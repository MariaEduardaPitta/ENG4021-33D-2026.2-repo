
from django import forms
from .models import Avaliacao, Material, Usuario
from django.contrib.auth.password_validation import validate_password
import re


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
    senha = forms.CharField(widget=forms.PasswordInput, required=False, label='Nova senha')

    def __init__(self, *args, usuario=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.usuario = usuario

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
    cpf = forms.CharField(max_length=14, label='CPF')
    telefone = forms.CharField(max_length=20, label='Telefone')
    senha = forms.CharField(widget=forms.PasswordInput, label='Senha')

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

        return dados
