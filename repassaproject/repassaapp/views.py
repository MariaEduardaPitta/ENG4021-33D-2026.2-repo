from django.shortcuts import get_object_or_404, render
from .models import Compra, Material, Mensagem
from django.contrib.auth.decorators import login_required

# Create your views here.
def home(request):
    materiais = Material.objects.filter(status="disponivel")
    return render(request, 'index.html', {"materiais": materiais})

@login_required
def notificacoes(request):
    mensagens = Mensagem.objects.filter(destinatario=request.user)
    vendas = Compra.objects.filter(material__vendedor=request.user)
    return render(request, 'notificacoes.html', {"mensagens": mensagens, "vendas": vendas})

def detalhe_material(request, id):
    material = get_object_or_404(Material, pk=id)
    return render(request, 'detalhes.html', {"material": material})