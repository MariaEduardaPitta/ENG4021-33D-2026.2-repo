from django.shortcuts import render, get_object_or_404, redirect
from .forms import AvaliacaoForm
from .models import Compra, Avaliacao
from .forms import CadastroForm
from .forms import LoginForm

# Create your views here.
def home(request):
    return render(request, 'index.html')

def notificacoes(request):
    return render(request, 'notificacoes.html')


def avaliar_vendedor(request, compra_id):
    if not request.user.is_authenticated:
        return render(request, 'avaliacao.html', {'precisa_login': True}, status=403)
    compra = get_object_or_404(
        Compra.objects.select_related('material__vendedor'),
        pk=compra_id, comprador=request.user,
    )
    avaliacao = Avaliacao.objects.filter(compra=compra).first()
    form = AvaliacaoForm(request.POST if request.method == 'POST' else None)
    if request.method == 'POST' and not avaliacao and form.is_valid():
        Avaliacao.objects.get_or_create(
            compra=compra,
            defaults={
                'avaliador': request.user,
                'vendedor': compra.material.vendedor,
                'nota': form.cleaned_data['nota'],
                'comentario': form.cleaned_data['comentario'],
            },
        )
        return redirect('avaliar_vendedor', compra_id=compra.pk)
    return render(request, 'avaliacao.html', {
        'compra': compra, 'form': form, 'avaliacao': avaliacao,
    })



def cadastro_view(request):
    if request.method == 'POST':
        form = CadastroForm(request.POST)
        if form.is_valid():
            # Dados válidos recebidos do formulário
            dados = form.cleaned_data
            print(dados) # Aparecerá no terminal do VS Code quando preencherem
            return render(request, 'cadastro.html', {'dados': dados})
    else:
        form = CadastroForm()

    return render(request, 'cadastro.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            dados = form.cleaned_data
            # Aqui você validaria o usuário e senha futuramente
            print(dados)
            # Redireciona para a página inicial (exemplo)
            return render(request, 'core/index.html')
    else:
        form = LoginForm()

    return render(request, 'core/login.html', {'form': form})