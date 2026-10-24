from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .forms import (
    AvaliacaoForm,
    CadastroForm,
    LoginForm,
    EditarPerfilForm,
    AnunciarMaterialForm,
    EditarMaterialForm,
)
from .models import Compra, Avaliacao, Material, Mensagem

from django.shortcuts import render, get_object_or_404, redirect
from .forms import (
    AvaliacaoForm,
    CadastroForm,
    LoginForm,
    EditarPerfilForm,
    AnunciarMaterialForm,
    EditarMaterialForm,
)
from .models import Compra, Avaliacao, Material


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

@login_required
def confirmacao(request, id):
    compra = get_object_or_404(Compra, pk=id, comprador=request.user)
    return render(request, 'confirmacao.html', {"compra": compra})


def avaliar_vendedor(request, compra_id):
    if not request.user.is_authenticated:
        return render(request, 'avaliacao.html', {'precisa_login': True}, status=403)

    compra = get_object_or_404(
        Compra.objects.select_related('material__vendedor'),
        pk=compra_id,
        comprador=request.user,
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
        'compra': compra,
        'form': form,
        'avaliacao': avaliacao,
    })




from django.contrib.auth.models import User  


def cadastro_view(request):
    if request.method == 'POST':
        form = CadastroForm(request.POST)
        if form.is_valid():
            dados = form.cleaned_data
            
            
            if not User.objects.filter(username=dados['email']).exists():
                user = User.objects.create_user(
                    username=dados['email'], 
                    email=dados['email'],
                    password=dados['senha'],
                    first_name=dados['nome'],
                    last_name=dados['sobrenome']
                )
                user.save()
                return redirect('login')
            else:
                form.add_error('email', 'Este e-mail já está cadastrado.')
    else:
        form = CadastroForm()

    return render(request, 'core/cadastro.html', {'form': form})

@login_required(login_url='login')
def editar_perfil_view(request):
    usuario = request.user  

    if request.method == 'POST':
        form = EditarPerfilForm(request.POST)
        if form.is_valid():
            dados = form.cleaned_data
            
            
            usuario.first_name = dados['nome']
            usuario.last_name = dados['sobrenome']
            usuario.email = dados['email']
            usuario.username = dados['email']  
            
           
            if dados.get('senha'):
                usuario.set_password(dados['senha'])
                
            usuario.save()
            return redirect('editar_perfil') 
    else:
        
        form = EditarPerfilForm(initial={
            'nome': usuario.first_name,
            'sobrenome': usuario.last_name,
            'email': usuario.email,
        })

    return render(request, 'core/editarperfil.html', {'form': form})



from django.contrib.auth import authenticate, login

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            senha = form.cleaned_data['senha']
            
            
            user = authenticate(request, username=email, password=senha)
            
            if user is not None:
                login(request, user) 
                return redirect('home') 
            else:
               
                form.add_error(None, 'E-mail ou senha inválidos.')
    else:
        form = LoginForm()

    return render(request, 'core/login.html', {'form': form})





def anunciar_material(request):
    if not request.user.is_authenticated:
        return redirect('login')

    if request.method == 'POST':
        form = AnunciarMaterialForm(request.POST, request.FILES)

        if form.is_valid():
            material = form.save(commit=False)
            material.vendedor = request.user
            material.save()
            return redirect('home')
    else:
        form = AnunciarMaterialForm()

    return render(request, 'anunciar.html', {'form': form})


def editar_material(request, material_id):
    if not request.user.is_authenticated:
        return redirect('login')

    material = get_object_or_404(
        Material,
        pk=material_id,
        vendedor=request.user,
    )

    if request.method == 'POST':
        form = EditarMaterialForm(
            request.POST,
            request.FILES,
            instance=material,
        )

        if form.is_valid():
            form.save()
            return redirect('home')
    else:
        form = EditarMaterialForm(instance=material)

    return render(request, 'editar_material.html', {
        'form': form,
        'material': material,
    })

