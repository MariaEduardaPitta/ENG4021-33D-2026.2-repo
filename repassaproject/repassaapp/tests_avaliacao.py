from django.test import TestCase, Client
from django.urls import reverse
from .models import Avaliacao, Usuario
from .tests import ModelsTest


class AvaliacaoTest(TestCase):
    setUp = ModelsTest.setUp

    def url(self):
        return reverse('avaliar_vendedor', args=[self.compra.pk])

    def test_salva_comprador_e_vendedor_da_compra(self):
        self.client.force_login(self.comprador)
        response = self.client.post(self.url(), {
            'nota': 5, 'comentario': 'Material bem conservado.',
            'avaliador': self.vendedor.pk, 'vendedor': self.comprador.pk,
        }, follow=True)
        self.assertContains(response, 'Sua avaliação está registrada.')
        avaliacao = Avaliacao.objects.get(compra=self.compra)
        self.assertEqual(avaliacao.avaliador, self.comprador)
        self.assertEqual(avaliacao.vendedor, self.vendedor)
        self.assertEqual(avaliacao.nota, 5)

    def test_rejeita_nota_invalida_e_preserva_comentario(self):
        self.client.force_login(self.comprador)
        for nota in ['', '0', '6', 'abc']:
            response = self.client.post(self.url(), {'nota': nota, 'comentario': 'Meu comentário'})
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.context['form'].errors)
            self.assertContains(response, 'Meu comentário')
        self.assertFalse(Avaliacao.objects.exists())

    def test_nao_aceita_compra_de_outro_usuario(self):
        self.client.force_login(self.vendedor)
        self.assertEqual(self.client.get(self.url()).status_code, 404)
        self.assertEqual(self.client.post(self.url(), {'nota': 5}).status_code, 404)
        self.assertFalse(Avaliacao.objects.exists())

    def test_exige_login(self):
        self.assertEqual(self.client.get(self.url()).status_code, 403)
        self.assertEqual(self.client.post(self.url(), {'nota': 5}).status_code, 403)
        self.assertFalse(Avaliacao.objects.exists())

    def test_envio_repetido_nao_altera_avaliacao(self):
        self.client.force_login(self.comprador)
        self.client.post(self.url(), {'nota': 5})
        self.client.post(self.url(), {'nota': 1})
        self.assertEqual(Avaliacao.objects.count(), 1)
        self.assertEqual(Avaliacao.objects.get().nota, 5)

    def test_protecao_csrf(self):
        client = Client(enforce_csrf_checks=True)
        client.force_login(self.comprador)
        self.assertEqual(client.post(self.url(), {'nota': 5}).status_code, 403)

    def test_admin_cadastra_usuario_com_senha_protegida(self):
        admin = Usuario.objects.create_superuser(
            username='admin', password='SenhaSomenteTeste123!',
            email='admin@example.com', nome='Admin', cpf='33333333333',
        )
        self.client.force_login(admin)
        response = self.client.post(reverse('admin:repassaapp_usuario_add'), {
            'username': 'novo', 'nome': 'Novo usuário', 'email': 'novo@example.com',
            'cpf': '44444444444', 'curso': 'Engenharia', 'whatsapp': '21000000000',
            'password1': 'SenhaSomenteTeste123!', 'password2': 'SenhaSomenteTeste123!',
            '_save': 'Salvar',
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Usuario.objects.get(username='novo').check_password('SenhaSomenteTeste123!'))


class DadosExemploTest(TestCase):
    fixtures = ['dados_sprint7']

    def test_dados_carregam_com_relacoes_e_sem_senhas(self):
        from .models import Material, Compra, Pagamento, Mensagem
        self.assertEqual(Usuario.objects.count(), 4)
        self.assertEqual(Material.objects.count(), 6)
        self.assertEqual(Compra.objects.count(), 3)
        self.assertEqual(Pagamento.objects.count(), 3)
        self.assertEqual(Mensagem.objects.count(), 4)
        self.assertEqual(Avaliacao.objects.count(), 1)
        self.assertTrue(all(not usuario.has_usable_password() for usuario in Usuario.objects.all()))
        avaliacao = Avaliacao.objects.get()
        self.assertEqual(avaliacao.avaliador, avaliacao.compra.comprador)
        self.assertEqual(avaliacao.vendedor, avaliacao.compra.material.vendedor)
