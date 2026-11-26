from smtplib import SMTPException
from unittest.mock import patch

from django.core import mail
from django.test import SimpleTestCase, TestCase, override_settings
from django.urls import reverse

from . import tests
from .models import Compra, Pagamento


class CompraEntregaTest(TestCase):
    setUp = tests.ModelsTest.setUp

    def test_checkout_registra_escolha_total_e_confirmacao(self):
        self.compra.delete()
        self.client.force_login(self.comprador)
        url = reverse('comprar_material', args=[self.material.pk])
        for forma in ['Pix', 'Dinheiro', 'Cartão']:
            with self.subTest(forma=forma):
                resposta = self.client.post(url, {'forma_entrega': 'retirada', 'forma_pagamento': forma})
                pagamento = Pagamento.objects.get()
                self.assertRedirects(resposta, reverse('confirmacao', args=[pagamento.compra_id]))
                self.assertContains(self.client.get(resposta.url), forma)
                self.assertEqual(pagamento.forma_pagamento, forma)
                self.assertEqual(pagamento.valor, pagamento.compra.valor_total)
                self.assertEqual(pagamento.status_pagamento, 'pendente')
                pagamento.delete()
                Compra.objects.all().delete()
                self.material.status = 'disponivel'
                self.material.save()

    def test_recusa_forma_ausente_ou_invalida(self):
        self.compra.delete()
        self.client.force_login(self.comprador)
        for forma in ['', 'boleto']:
            resposta = self.client.post(reverse('comprar_material', args=[self.material.pk]),
                                        {'forma_entrega': 'retirada', 'forma_pagamento': forma})
            self.assertIn('forma_pagamento', resposta.context['form'].errors)
        self.assertFalse(Compra.objects.exists())
        self.assertFalse(Pagamento.objects.exists())

    def test_email_somente_em_mudanca_real(self):
        self.client.force_login(self.vendedor)
        url = reverse('atualizar_entrega', args=[self.compra.pk])
        for status in ['aguardando', 'em_andamento', 'em_andamento', 'entregue']:
            self.client.post(url, {'status_entrega': status})
        self.assertEqual(len(mail.outbox), 2)
        for mensagem, status in zip(mail.outbox, ['Em andamento', 'Entregue']):
            self.assertEqual(mensagem.to, [self.comprador.email])
            self.assertIn(status, mensagem.body)

    @patch('repassaapp.views.send_mail', side_effect=SMTPException())
    def test_falha_no_envio_mantem_status(self, enviar):
        self.client.force_login(self.vendedor)
        resposta = self.client.post(reverse('atualizar_entrega', args=[self.compra.pk]),
                                    {'status_entrega': 'em_andamento'})
        self.assertContains(resposta, 'Não foi possível enviar o e-mail')
        self.compra.refresh_from_db()
        self.assertEqual(self.compra.status_entrega, 'aguardando')


@override_settings(DEBUG=False)
class PaginasErroTest(SimpleTestCase):
    def test_404(self):
        self.assertContains(self.client.get('/pagina-inexistente/'), 'Página não encontrada', status_code=404)

    @patch('repassaapp.views.Material.objects.filter', side_effect=RuntimeError('falha de teste'))
    def test_500(self, consulta):
        self.client.raise_request_exception = False
        resposta = self.client.get('/')
        self.assertContains(resposta, 'Erro ao carregar a página', status_code=500)
        self.assertNotContains(resposta, 'falha de teste', status_code=500)
