from django.test import TestCase
from django.urls import reverse
from .tests import ModelsTest


class MeuPerfilTest(TestCase):
    setUp = ModelsTest.setUp

    def test_exige_login(self):
        response = self.client.get(reverse('meu_perfil'))
        self.assertEqual(response.status_code, 302)
        self.assertIn('/login/', response.url)

    def test_vendedor_ve_seus_anuncios(self):
        self.client.force_login(self.vendedor)
        response = self.client.get(reverse('meu_perfil'))
        self.assertContains(response, self.material.titulo)
        self.assertIn(self.material, response.context['meus_anuncios'])
        self.assertFalse(response.context['minhas_compras'])

    def test_comprador_ve_suas_compras(self):
        self.client.force_login(self.comprador)
        response = self.client.get(reverse('meu_perfil'))
        self.assertIn(self.compra, response.context['minhas_compras'])
        self.assertFalse(response.context['meus_anuncios'])
        