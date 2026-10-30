
from decimal import Decimal, InvalidOperation

from django.contrib.auth.decorators import login_required
from django.db.models import Q, Avg, Count
from django.http import Http404
from django.shortcuts import render, get_object_or_404, redirect
from .forms import (
    AvaliacaoForm,
    CadastroForm,
    LoginForm,
    EditarPerfilForm,
    AnunciarMaterialForm,
    EditarMaterialForm,
)
from .models import Compra, Avaliacao, Material, Categoria, Mensagem, Usuario
from django.db import transaction, IntegrityError
from django.http import HttpResponseForbidden
from .forms import CompraForm


def home(request):
    materiais = Material.objects.filter(status="disponivel").select_related('vendedor', 'categoria').annotate(
        nota_vendedor=Avg('vendedor__avaliacoes_recebidas__nota')
    )
    return render(request, 'index.html', {"materiais": materiais})


@login_required
def notificacoes(request):
    mensagens = Mensagem.objects.filter(destinatario=request.user)
    vendas = Compra.objects.filter(material__vendedor=request.user)
    return render(request, 'notificacoes.html', {"mensagens": mensagens, "vendas": vendas})


def detalhe_material(request, id):
    material = get_object_or_404(Material.objects.select_related('vendedor', 'categoria'), pk=id)
    resumo = material.vendedor.avaliacoes_recebidas.aggregate(media=Avg('nota'), quantidade=Count('id'))
    return render(request, 'detalhes.html', {
        "material": material,
        "nota_vendedor": resumo['media'],
        "quantidade_avaliacoes": resumo['quantidade'],
    })


@login_required
def confirmacao(request, id):
    compra = get_object_or_404(
        Compra.objects.select_related('material__vendedor', 'pagamento'),
        pk=id,
        comprador=request.user,
    )
    ja_avaliou = Avaliacao.objects.filter(compra=compra).exists()
    return render(request, 'confirmacao.html', {
        "compra": compra,
        "ja_avaliou": ja_avaliou,
        "entregue": compra.status_entrega == "entregue",
    })


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

def avaliacoes_vendedor(request, id):
    vendedor = get_object_or_404(Usuario, pk=id)
    avaliacoes = vendedor.avaliacoes_recebidas.select_related('avaliador', 'compra__material')
    resumo = avaliacoes.aggregate(media=Avg('nota'), quantidade=Count('id'))

    return render(request, 'avaliacoes_vendedor.html', {
        'vendedor': vendedor,
        'avaliacoes': avaliacoes,
        'media': resumo['media'],
        'quantidade': resumo['quantidade'],
    })




from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
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

def logout_view(request):
    if request.method == 'POST':
        logout(request)
    return redirect('home')


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


# ---------- Buscar, Conversas e Chat ----------

ORDENS_BUSCA = {
    'recentes': '-id',
    'menor_preco': 'preco',
    'maior_preco': '-preco',
}


def buscar(request):
    materiais = Material.objects.filter(status='disponivel').select_related('vendedor', 'categoria')

    q = request.GET.get('q', '').strip()
    categoria = request.GET.get('categoria', '')
    curso = request.GET.get('curso', '')
    estado = request.GET.get('estado', '')
    preco_max = request.GET.get('preco_max', '').strip().replace(',', '.')
    ordem = request.GET.get('ordem', 'recentes')
    if ordem not in ORDENS_BUSCA:
        ordem = 'recentes'

    if q:
        materiais = materiais.filter(
            Q(titulo__icontains=q) | Q(descricao__icontains=q) | Q(curso__icontains=q)
        )
    if categoria.isdigit():
        materiais = materiais.filter(categoria_id=categoria)
    if curso:
        materiais = materiais.filter(curso=curso)
    if estado:
        materiais = materiais.filter(estado_conservacao=estado)
    if preco_max:
        try:
            valor = Decimal(preco_max)
            if not valor.is_finite():
                raise InvalidOperation
            materiais = materiais.filter(preco__lte=valor)
        except InvalidOperation:
            preco_max = ''

    materiais = materiais.order_by(ORDENS_BUSCA[ordem])

    disponiveis = Material.objects.filter(status='disponivel')
    return render(request, 'buscar.html', {
        'materiais': materiais,
        'categorias': Categoria.objects.order_by('nome'),
        'cursos': disponiveis.order_by('curso').values_list('curso', flat=True).distinct(),
        'estados': disponiveis.order_by('estado_conservacao').values_list('estado_conservacao', flat=True).distinct(),
        'filtros': {
            'q': q,
            'categoria': categoria,
            'curso': curso,
            'estado': estado,
            'preco_max': preco_max,
            'ordem': ordem,
        },
    })


def conversas(request):
    if not request.user.is_authenticated:
        return render(request, 'conversas.html', {'precisa_login': True})

    usuario = request.user
    filtro = request.GET.get('filtro', 'todas')
    if filtro not in ('todas', 'comprando', 'vendendo'):
        filtro = 'todas'
    q = request.GET.get('q', '').strip()

    mensagens = (
        Mensagem.objects
        .filter(Q(remetente=usuario) | Q(destinatario=usuario))
        .select_related('remetente', 'destinatario', 'material__vendedor')
        .order_by('-data_hora', '-id')
    )

    # Uma conversa = mesmo material + mesma outra pessoa.
    # Como as mensagens vêm da mais nova para a mais antiga,
    # a primeira de cada conversa é a última mensagem trocada.
    lista = []
    vistas = set()
    for mensagem in mensagens:
        outro = mensagem.destinatario if mensagem.remetente_id == usuario.id else mensagem.remetente
        chave = (mensagem.material_id, outro.id)
        if chave in vistas:
            continue
        vistas.add(chave)

        vendendo = mensagem.material.vendedor_id == usuario.id
        if filtro == 'comprando' and vendendo:
            continue
        if filtro == 'vendendo' and not vendendo:
            continue
        if q:
            nome_outro = (outro.nome or outro.username).lower()
            if q.lower() not in nome_outro and q.lower() not in mensagem.material.titulo.lower():
                continue

        lista.append({
            'outro': outro,
            'material': mensagem.material,
            'ultima': mensagem,
            'vendendo': vendendo,
        })

    # Marca as conversas que viraram compra e se o usuário ainda pode avaliar.
    compras = {
        compra.material_id: compra
        for compra in Compra.objects.filter(material_id__in=[c['material'].pk for c in lista])
    }
    avaliadas = set(
        Avaliacao.objects.filter(compra__in=compras.values()).values_list('compra_id', flat=True)
    )
    for conversa in lista:
        compra = compras.get(conversa['material'].pk)
        participantes = {usuario.id, conversa['outro'].id}
        conversa['compra'] = compra
        conversa['negocio_concluido'] = bool(compra and compra.comprador_id in participantes)
        conversa['pode_avaliar'] = bool(
            compra and compra.comprador_id == usuario.id and compra.pk not in avaliadas
        )

    return render(request, 'conversas.html', {
        'conversas': lista,
        'filtro': filtro,
        'q': q,
    })


def chat(request, material_id, usuario_id):
    if not request.user.is_authenticated:
        return render(request, 'chat.html', {'precisa_login': True})

    usuario = request.user
    material = get_object_or_404(Material.objects.select_related('vendedor'), pk=material_id)
    outro = get_object_or_404(Usuario, pk=usuario_id)

    # A conversa é sempre entre o vendedor do material e outra pessoa.
    if outro.pk == usuario.pk or material.vendedor_id not in (usuario.pk, outro.pk):
        raise Http404('Conversa não encontrada.')

    if request.method == 'POST':
        conteudo = request.POST.get('conteudo', '').strip()
        if conteudo:
            Mensagem.objects.create(
                remetente=usuario,
                destinatario=outro,
                material=material,
                conteudo=conteudo,
            )
        return redirect('chat', material_id=material.pk, usuario_id=outro.pk)

    mensagens = (
        Mensagem.objects
        .filter(material=material)
        .filter(
            Q(remetente=usuario, destinatario=outro) | Q(remetente=outro, destinatario=usuario)
        )
        .order_by('data_hora', 'id')
    )

    return render(request, 'chat.html', {
        'material': material,
        'outro': outro,
        'mensagens': mensagens,
    })

@login_required(login_url='login')
def comprar_material(request, material_id):
    material = get_object_or_404(Material, pk=material_id)

    if material.vendedor_id == request.user.id:
        return HttpResponseForbidden('Você não pode comprar seu próprio anúncio.')

    if material.status == 'vendido':
        return HttpResponseForbidden('Este material já foi vendido.')

    form = CompraForm(request.POST or None)

    if request.method == 'POST' and form.is_valid():
        dados = form.cleaned_data

        if dados['forma_entrega'] == 'retirada':
            endereco = 'Retirada combinada com o vendedor'
        else:
            endereco = (
                f"{dados['logradouro']}, {dados['numero']}, "
                f"{dados.get('complemento', '')}, {dados['bairro']}, "
                f"{dados['cidade']}/{dados['uf']} - CEP {dados['cep']}"
            )

        try:
            with transaction.atomic():
                material = Material.objects.select_for_update().get(pk=material_id)

                if material.status != 'disponivel' or Compra.objects.filter(material=material).exists():
                    return HttpResponseForbidden('Este material não está disponível.')

                compra = Compra.objects.create(
                    comprador=request.user,
                    material=material,
                    valor_total=material.preco,
                    forma_entrega=dados['forma_entrega'],
                    endereco_local_entrega=endereco
                )

                material.status = 'vendido'
                material.save(update_fields=['status'])

        except IntegrityError:
            return HttpResponseForbidden('Este material já foi comprado.')

        return redirect('confirmacao', id=compra.id)

    return render(request, 'compra.html', {
        'form': form,
        'material': material
    })
