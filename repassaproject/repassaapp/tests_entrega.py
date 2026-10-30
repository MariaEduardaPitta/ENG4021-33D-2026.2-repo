from django.test import TestCase, Client
from django.urls import reverse
from .tests import ModelsTest
from .models import Compra


class EntregaTest(TestCase):
    setUp = ModelsTest.setUp

    def url(self):
        return reverse('atualizar_entrega', args=[self.compra.pk])

    def test_exige_login_e_vendedor(self):
        self.assertEqual(self.client.get(self.url()).status_code, 302)
        self.client.force_login(self.comprador)
        self.assertEqual(self.client.get(self.url()).status_code, 404)
        self.assertEqual(self.client.post(self.url(), {'status_entrega': 'entregue'}).status_code, 404)
        self.compra.refresh_from_db()
        self.assertEqual(self.compra.status_entrega, 'aguardando')

    def test_avanca_entrega_e_comprador_ve_status(self):
        self.client.force_login(self.vendedor)
        for status in ['em_andamento', 'entregue']:
            response = self.client.post(self.url(), {'status_entrega': status, 'comprador': self.vendedor.pk}, follow=True)
            self.assertContains(response, 'Entrega atualizada com sucesso.')
            self.compra.refresh_from_db()
            self.assertEqual(self.compra.status_entrega, status)
            self.assertEqual(self.compra.comprador_id, self.comprador.pk)
        self.client.force_login(self.comprador)
        response = self.client.get(reverse('confirmacao', args=[self.compra.pk]))
        self.assertContains(response, 'Entrega concluída')
        self.assertContains(response, 'Avaliar vendedor')

    def test_rejeita_salto_status_invalido_e_retrocesso(self):
        self.client.force_login(self.vendedor)
        for status in ['', 'entregue', 'cancelado']:
            response = self.client.post(self.url(), {'status_entrega': status})
            self.assertTrue(response.context['form'].errors)
            self.compra.refresh_from_db()
            self.assertEqual(self.compra.status_entrega, 'aguardando')
        Compra.objects.filter(pk=self.compra.pk).update(status_entrega='entregue')
        response = self.client.post(self.url(), {'status_entrega': 'aguardando'})
        self.assertTrue(response.context['form'].errors)
        self.compra.refresh_from_db()
        self.assertEqual(self.compra.status_entrega, 'entregue')

    def test_csrf_e_acesso_pelas_notificacoes(self):
        client = Client(enforce_csrf_checks=True)
        client.force_login(self.vendedor)
        self.assertEqual(client.post(self.url(), {'status_entrega': 'em_andamento'}).status_code, 403)
        self.client.force_login(self.vendedor)
        self.assertContains(self.client.get('/notificacoes/'), self.url())
