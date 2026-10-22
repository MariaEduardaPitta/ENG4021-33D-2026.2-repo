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
