from django.shortcuts import get_object_or_404, render
from .models import Material

# Create your views here.
def home(request):
    materiais = Material.objects.filter(status="disponivel")
    return render(request, 'index.html', {"materiais": materiais})

def notificacoes(request):
    return render(request, 'notificacoes.html')

def detalhe_material(request, id):
    material = get_object_or_404(Material, pk=id)
    return render(request, 'detalhes.html', {"material": material})