from io import BytesIO
from tempfile import TemporaryDirectory

from PIL import Image
from django.core import mail
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse

from .tests import ModelsTest
from .forms import CadastroForm
from .models import Avaliacao, Faculdade, FotoMaterial, Material, Mensagem, Pagamento, Favorito


class RevisaoTest(TestCase):
    def setUp(self):
        ModelsTest.setUp(self)
        self.client.force_login(self.comprador)
        self.pasta = TemporaryDirectory()
        self.addCleanup(self.pasta.cleanup)
        self.override = override_settings(MEDIA_ROOT=self.pasta.name)
        self.override.enable()
        self.addCleanup(self.override.disable)

    def imagem(self, nome='foto.png'):
        conteudo = BytesIO()
        Image.new('RGB', (20, 20), 'purple').save(conteudo, format='PNG')
        return SimpleUploadedFile(nome, conteudo.getvalue(), content_type='image/png')

    def anuncio(self, **extras):
        dados = dict(titulo='Livro novo', descricao='Bom estado', preco='40',
                     preco_produto_novo='80', estado_conservacao='Bom',
                     curso='Engenharia', disciplina='Cálculo', categoria=self.material.categoria_id)
        dados.update(extras)
        return dados

    def test_avaliacao_bloqueada_antes_da_entrega(self):
        url = reverse('avaliar_vendedor', args=[self.compra.pk])
        for status in ['aguardando', 'em_andamento']:
            self.compra.status_entrega = status
            self.compra.save()
            self.assertContains(self.client.post(url, {'nota': 5}),
                                'confirmar a entrega', status_code=403)
        self.assertFalse(Avaliacao.objects.exists())

    def test_notificacao_abre_chat_e_atualiza_contador(self):
        Mensagem.objects.create(material=self.material, remetente=self.vendedor,
                                destinatario=self.comprador, conteudo='Olá')
        resposta = self.client.get('/notificacoes/')
        self.assertContains(resposta, '<span class="contador">1</span>', html=True)
        url = reverse('chat', args=[self.material.pk, self.vendedor.pk])
        self.assertContains(resposta, url)
        self.client.get(url)
        self.assertFalse(Mensagem.objects.filter(destinatario=self.comprador, lida=False).exists())
        self.assertNotContains(self.client.get('/notificacoes/'), 'class="contador"')

    def test_sem_faculdade_permite_cadastro(self):
        Faculdade.objects.all().delete()
        dados = dict(nome='João', sobrenome='Teste', cpf='12345678901', telefone='21999999999',
                     email='joao@example.com', curso='Engenharia', senha='RepassaTeste123!')
        self.assertTrue(CadastroForm(dados).is_valid())

    def test_busca_parametros_invalidos_nao_causa_500(self):
        for valor in ['9' * 50, '²', 'abc']:
            self.assertEqual(self.client.get('/buscar/', {'categoria': valor, 'faculdade': valor}).status_code, 200)
        for valor in ['NaN', 'Infinity', 'abc']:
            self.assertEqual(self.client.get('/buscar/', {'preco_max': valor}).status_code, 200)

    def test_fotos_invalidas_nao_criam_anuncio(self):
        for campo in ['foto', 'fotos_adicionais']:
            dados = self.anuncio(**{campo: SimpleUploadedFile('foto.png', b'nao sou imagem')})
            resposta = self.client.post('/anunciar/', dados)
            self.assertEqual(resposta.status_code, 200)
            self.assertTrue(resposta.context['form'].errors)
            self.assertEqual(Material.objects.count(), 1)

    def test_anuncio_edicao_favorito_e_exclusao(self):
        self.client.force_login(self.vendedor)
        self.assertEqual(self.client.post('/anunciar/', self.anuncio(
            foto=self.imagem(), fotos_adicionais=[self.imagem('extra.png')])).status_code, 302)
        novo = Material.objects.get(titulo='Livro novo')
        self.assertEqual(novo.fotos.count(), 1)
        foto = novo.fotos.get()
        self.assertEqual(self.client.post(reverse('editar_material', args=[novo.pk]),
            self.anuncio(titulo='Livro revisado', excluir_fotos=[foto.pk])).status_code, 302)
        self.assertFalse(FotoMaterial.objects.filter(pk=foto.pk).exists())
        self.client.force_login(self.comprador)
        self.assertEqual(self.client.get(reverse('editar_material', args=[novo.pk])).status_code, 404)
        self.client.post(reverse('alternar_favorito', args=[novo.pk]))
        self.assertContains(self.client.get('/favoritos/'), 'Livro revisado')
        self.client.post(reverse('alternar_favorito', args=[novo.pk]))
        self.assertFalse(Favorito.objects.exists())
        self.client.force_login(self.vendedor)
        self.client.post(reverse('excluir_material', args=[novo.pk]))
        self.assertFalse(Material.objects.filter(pk=novo.pk).exists())

    def test_compra_entrega_email_avaliacao(self):
        novo = Material.objects.create(vendedor=self.vendedor, categoria=self.material.categoria,
            titulo='Livro para comprar', descricao='Exemplo', preco='25', preco_produto_novo='50',
            curso='Engenharia', estado_conservacao='Bom')
        resposta = self.client.post(reverse('comprar_material', args=[novo.pk]),
                                   {'forma_pagamento': 'Pix', 'forma_entrega': 'retirada'}, follow=True)
        self.assertContains(resposta, 'Pix')
        novo.refresh_from_db()
        self.assertEqual(novo.status, 'vendido')
        compra = novo.compra
        self.assertEqual(Pagamento.objects.get(compra=compra).valor, novo.preco)
        self.assertEqual(self.client.post(reverse('comprar_material', args=[novo.pk]),
                         {'forma_pagamento': 'Pix', 'forma_entrega': 'retirada'}).status_code, 403)
        self.client.force_login(self.vendedor)
        entrega = reverse('atualizar_entrega', args=[compra.pk])
        for status in ['em_andamento', 'em_andamento', 'entregue']:
            self.assertEqual(self.client.post(entrega, {'status_entrega': status}).status_code, 302)
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(mail.outbox[0].to, [self.comprador.email])
        self.client.force_login(self.comprador)
        self.client.post(reverse('avaliar_vendedor', args=[compra.pk]), {'nota': '5', 'comentario': 'Recebido'})
        self.assertEqual(compra.avaliacao.nota, 5)

    def test_chat_nao_expoe_conversa_de_terceiros(self):
        terceiro = type(self.comprador).objects.create_user(username='terceiro',email='terceiro@example.com',cpf='33333333333')
        Mensagem.objects.create(remetente=self.vendedor, destinatario=terceiro,
                                material=self.material, conteudo='Mensagem reservada')
        self.assertNotContains(self.client.get(reverse('chat', args=[self.material.pk,self.vendedor.pk])),
                               'Mensagem reservada')
        self.assertEqual(self.client.get(reverse('chat', args=[self.material.pk,terceiro.pk])).status_code, 404)


    def test_reserva_pode_ser_desfeita_sem_afetar_venda(self):
        self.compra.delete()
        self.client.force_login(self.vendedor)
        url = reverse('reservar_material', args=[self.material.pk])
        for status in ['reservado', 'disponivel']:
            self.client.post(url)
            self.material.refresh_from_db()
            self.assertEqual(self.material.status, status)
        self.material.status = 'vendido'
        self.material.save()
        self.client.post(url)
        self.material.refresh_from_db()
        self.assertEqual(self.material.status, 'vendido')
