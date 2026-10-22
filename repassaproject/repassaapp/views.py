from django.shortcuts import render
from .models import Material

# Create your views here.
def home(request):
    materiais = Material.objects.filter(status="disponivel")
    return render(request, 'index.html', {"materiais": materiais})

def notificacoes(request):
    return render(request, 'notificacoes.html')