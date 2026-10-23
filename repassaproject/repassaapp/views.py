
from decimal import Decimal, InvalidOperation

from django.db.models import Q
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


def home(request):
    return render(request, 'index.html')


def notificacoes(request):
    return render(request, 'notificacoes.html')


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


def cadastro_view(request):
    if request.method == 'POST':
        form = CadastroForm(request.POST)
        if form.is_valid():
            dados = form.cleaned_data
            print(dados)
            return render(request, 'cadastro.html', {'dados': dados})
    else:
        form = CadastroForm()

    return render(request, 'cadastro.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            dados = form.cleaned_data
            print(dados)
            return render(request, 'core/index.html')
    else:
        form = LoginForm()

    return render(request, 'core/login.html', {'form': form})


def editar_perfil_view(request):
    if request.method == 'POST':
        form = EditarPerfilForm(request.POST)
        if form.is_valid():
            dados = form.cleaned_data
            print(dados)
            return render(request, 'editarperfil.html', {
                'form': form,
                'sucesso': True,
            })
    else:
        form = EditarPerfilForm()

    return render(request, 'editarperfil.html', {'form': form})


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
