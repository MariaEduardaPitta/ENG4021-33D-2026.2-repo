
from django import forms
from django.contrib.auth.forms import SetPasswordForm
from .pwned_passwords import consultar_senha_vazada, ConsultaSenhaIndisponivel
from .models import Avaliacao, Material, Usuario, Compra, Faculdade
from django.contrib.auth.password_validation import validate_password
import re
import unicodedata
from .servicos import consultar_cep, ViaCepIndisponivel


class AvaliacaoForm(forms.ModelForm):
    class Meta:
        model = Avaliacao
        fields = ['nota', 'comentario']
        labels = {'nota': 'Nota', 'comentario': 'Comentário (opcional)'}
        widgets = {
            'nota': forms.Select(choices=[('', 'Selecione uma nota')] + [(n, str(n)) for n in range(1, 6)]),
            'comentario': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Como foi sua experiência com o vendedor?'}),
        }




class PerfilForm(forms.Form):
    nome = forms.CharField(max_length=75, label='Nome')
    sobrenome = forms.CharField(max_length=74, label='Sobrenome')
    email = forms.EmailField(max_length=150, label='E-mail')
    telefone = forms.CharField(max_length=20, required=False, label='Telefone')
    curso = forms.CharField(max_length=100, label='Curso')  # Certifique-se de que o curso já existe ou inclua aqui
    faculdade = forms.ModelChoiceField(
        queryset=Faculdade.objects.all(),
        label='Faculdade',
        empty_label='Selecione sua faculdade',
        widget=forms.Select(attrs={'class': 'input-destaque'})
    )
    senha = forms.CharField(widget=forms.PasswordInput, required=False, label='Nova senha')

    def __init__(self, *args, usuario=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.usuario = usuario
        if 'curso' in self.fields:
            self.fields['curso'].widget.attrs.update({'class': 'input-destaque', 'placeholder': 'Seu curso'})

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        usuarios = Usuario.objects.all()
        if self.usuario:
            usuarios = usuarios.exclude(pk=self.usuario.pk)
        if usuarios.filter(email__iexact=email).exists() or usuarios.filter(username__iexact=email).exists():
            raise forms.ValidationError('Este e-mail já está cadastrado.')
        return email

    def clean_senha(self):
        senha = self.cleaned_data.get('senha', '')
        if senha:
            validate_password(senha, self.usuario)
        return senha

class CadastroForm(PerfilForm):
    cpf = forms.CharField(
        max_length=14, 
        label='CPF',
        widget=forms.TextInput(attrs={'class': 'input-cpfemailsenha', 'placeholder': 'XXX.XXX.XXX-XX'})
    )
    telefone = forms.CharField(
        max_length=20, 
        required=True,  
        label='Telefone',
        widget=forms.TextInput(attrs={'class': 'input-telefone', 'placeholder': '(XX) XXXXX-XXXX'})
    )
    senha = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'input-cpfemailsenha', 'placeholder': 'Digite sua senha'}), 
        label='Senha'
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nome'].widget.attrs.update({'placeholder': 'Digite seu nome'})
        self.fields['sobrenome'].widget.attrs.update({'placeholder': 'Digite seu sobrenome'})
        self.fields['email'].widget.attrs.update({'class': 'input-cpfemailsenha', 'placeholder': 'seuemail@universidade.com.br'})

    def clean_cpf(self):
        cpf = re.sub(r'[.\-\s]', '', self.cleaned_data['cpf'])
        if not re.fullmatch(r'[0-9]{11}', cpf):
            raise forms.ValidationError('Informe os 11 números do CPF.')
        if Usuario.objects.filter(cpf=cpf).exists():
            raise forms.ValidationError('Este CPF já está cadastrado.')
        return cpf


class EditarPerfilForm(PerfilForm):
    pass


class LoginForm(forms.Form):
    email = forms.EmailField(label='E-mail')
    senha = forms.CharField(widget=forms.PasswordInput, label='Senha')


class AnunciarMaterialForm(forms.ModelForm):
    class Meta:
        model = Material
        fields = [
            'titulo',
            'descricao',
            'preco',
            'preco_produto_novo',
            'estado_conservacao',
            'foto',
            'curso',
            'categoria'
        ]


class EditarMaterialForm(AnunciarMaterialForm):
    pass


class CompraForm(forms.Form):
    ENTREGA_CHOICES = [
        ('entrega', 'Receber no endereço'),
        ('retirada', 'Combinar retirada com o vendedor'),
    ]

    forma_entrega = forms.ChoiceField(
        choices=ENTREGA_CHOICES,
        label='Forma de entrega'
    )
    cep = forms.CharField(max_length=9, required=False, label='CEP')
    logradouro = forms.CharField(max_length=150, required=False, label='Rua')
    numero = forms.CharField(max_length=10, required=False, label='Número')
    complemento = forms.CharField(max_length=100, required=False, label='Complemento')
    bairro = forms.CharField(max_length=100, required=False, label='Bairro')
    cidade = forms.CharField(max_length=100, required=False, label='Cidade')
    uf = forms.CharField(max_length=2, required=False, label='Estado')

    def clean(self):
        dados = super().clean()

        if dados.get('forma_entrega') == 'entrega':
            for campo in ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'uf']:
                if not dados.get(campo):
                    self.add_error(campo, 'Este campo é obrigatório para entrega.')
            
            if not self.errors:                    
                self.validar_endereco(dados)

        return dados

    def validar_endereco(self, dados):
        cep = re.sub(r'\D', '', dados['cep'])
        if len(cep) != 8:
            self.add_error('cep', 'Digite um CEP com 8 números.')
            return
        dados['cep'] = cep

        try:
            endereco = consultar_cep(cep)
        except ViaCepIndisponivel:
            return

        if endereco is None:
            self.add_error('cep', 'CEP não encontrado.')
            return

        if normalizar(dados['cidade']) != normalizar(endereco['localidade']):
            self.add_error('cidade', f"Este CEP é de {endereco['localidade']}.")
        if normalizar(dados['uf']) != normalizar(endereco['uf']):
            self.add_error('uf', f"Este CEP é de {endereco['uf']}.")

def normalizar(texto):
    sem_acento = unicodedata.normalize('NFD', texto).encode('ascii', 'ignore').decode()
    return sem_acento.strip().lower()

class AtualizarEntregaForm(forms.ModelForm):
    status_entrega = forms.ChoiceField(label='Status da entrega')

    class Meta:
        model = Compra
        fields = ['status_entrega']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        opcoes = {
            'aguardando': [('aguardando', 'Aguardando'), ('em_andamento', 'Em andamento')],
            'em_andamento': [('em_andamento', 'Em andamento'), ('entregue', 'Entregue')],
            'entregue': [('entregue', 'Entregue')],
        }
        self.fields['status_entrega'].choices = opcoes.get(self.instance.status_entrega, [])


class NovaSenhaForm(SetPasswordForm):
    def clean_new_password2(self):
        senha = super().clean_new_password2()
        if senha:
            try:
                quantidade = consultar_senha_vazada(senha)
            except ConsultaSenhaIndisponivel:
                raise forms.ValidationError(
                    'Não foi possível verificar vazamentos agora. Tente novamente em instantes.',
                    code='consulta_indisponivel',
                )
            if quantidade > 0:
                raise forms.ValidationError(
                    'Essa senha já apareceu em vazamentos. Escolha outra senha para proteger sua conta.',
                    code='senha_vazada',
                )
        return senha
