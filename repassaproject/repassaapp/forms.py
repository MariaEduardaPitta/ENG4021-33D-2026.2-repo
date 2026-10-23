from django import forms
from .models import Avaliacao


class AvaliacaoForm(forms.ModelForm):
    class Meta:
        model = Avaliacao
        fields = ['nota', 'comentario']
        labels = {'nota': 'Nota', 'comentario': 'Comentário (opcional)'}
        widgets = {
            'nota': forms.Select(choices=[('', 'Selecione uma nota')] + [(n, str(n)) for n in range(1, 6)]),
            'comentario': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Como foi sua experiência com o vendedor?'}),
        }


class CadastroForm(forms.Form):
    nome = forms.CharField(max_length=100, label='Nome')
    sobrenome = forms.CharField(max_length=100, label='Sobrenome')
    cpf = forms.CharField(max_length=14, label='CPF')
    telefone = forms.CharField(max_length=20, label='Telefone')
    email = forms.EmailField(label='E-mail')
    senha = forms.CharField(widget=forms.PasswordInput, label='Senha')

class LoginForm(forms.Form):
    email = forms.EmailField(label='E-mail')
    senha = forms.CharField(widget=forms.PasswordInput, label='Senha')

class EditarPerfilForm(forms.Form):
    nome = forms.CharField(max_length=100, label='Nome')
    sobrenome = forms.CharField(max_length=100, label='Sobrenome')
    email = forms.EmailField(label='E-mail')
    telefone = forms.CharField(max_length=20, required=False, label='Telefone')
    senha = forms.CharField(widget=forms.PasswordInput, required=False, label='Nova Senha')