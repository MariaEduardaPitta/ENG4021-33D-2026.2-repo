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




from django.contrib.auth import authenticate, login, update_session_auth_hash
from django.utils.http import url_has_allowed_host_and_scheme
from .models import Usuario


def cadastro_view(request):
    form = CadastroForm(request.POST if request.method == 'POST' else None)
    if request.method == 'POST' and form.is_valid():
        dados = form.cleaned_data
        Usuario.objects.create_user(
            username=dados['email'], email=dados['email'], password=dados['senha'],
            nome=f"{dados['nome']} {dados['sobrenome']}",
            first_name=dados['nome'], last_name=dados['sobrenome'],
            cpf=dados['cpf'], whatsapp=dados['telefone'],
        )
        return redirect('login')
    return render(request, 'cadastro.html', {'form': form})


@login_required(login_url='login')
def editar_perfil_view(request):
    usuario = request.user
    partes = usuario.nome.split(' ', 1)
    form = EditarPerfilForm(
        request.POST if request.method == 'POST' else None,
        usuario=usuario,
        initial={
            'nome': usuario.first_name or partes[0],
            'sobrenome': usuario.last_name or (partes[1] if len(partes) > 1 else ''),
            'email': usuario.email, 'telefone': usuario.whatsapp,
        },
    )
    if request.method == 'POST' and form.is_valid():
        dados = form.cleaned_data
        usuario.nome = f"{dados['nome']} {dados['sobrenome']}"
        usuario.first_name = dados['nome']
        usuario.last_name = dados['sobrenome']
        usuario.email = dados['email']
        usuario.whatsapp = dados['telefone']
        if dados['senha']:
            usuario.set_password(dados['senha'])
        usuario.save()
        if dados['senha']:
            update_session_auth_hash(request, usuario)
        return redirect('/editar-perfil/?salvo=1')
    return render(request, 'editarperfil.html', {'form': form, 'sucesso': request.GET.get('salvo') == '1'})


def login_view(request):
    form = LoginForm(request.POST if request.method == 'POST' else None)
    if request.method == 'POST' and form.is_valid():
        conta = Usuario.objects.filter(email__iexact=form.cleaned_data['email']).first()
        usuario = authenticate(
            request, username=conta.username if conta else form.cleaned_data['email'],
            password=form.cleaned_data['senha'],
        )
        if usuario is not None:
            login(request, usuario)
            destino = request.GET.get('next', '')
            if destino and url_has_allowed_host_and_scheme(destino, {request.get_host()}, require_https=request.is_secure()):
                return redirect(destino)
            return redirect('home')
        form.add_error(None, 'E-mail ou senha inválidos.')
    return render(request, 'loginmelhorado.html', {'form': form})


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

