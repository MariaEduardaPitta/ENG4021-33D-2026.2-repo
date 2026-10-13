from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'index.html')

def notificacoes(request):
    return render(request, 'notificacoes.html')