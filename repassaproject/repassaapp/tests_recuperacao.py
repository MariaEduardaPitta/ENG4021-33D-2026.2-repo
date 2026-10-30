from django.test import TestCase, override_settings
from django.core import mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.urls import reverse
from .models import Usuario


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class RecuperacaoTest(TestCase):
    def test_recupera_senha_com_templates_e_rotas(self):
        user = Usuario.objects.create_user(username='teste', email='teste@example.com',
                                          cpf='77777777777', password='SenhaAntiga123!')
        self.assertEqual(self.client.get('/').status_code, 200)
        self.assertEqual(self.client.get('/login/').status_code, 200)
        self.assertEqual(self.client.get('/recuperar-senha/').status_code, 200)
        response = self.client.post('/recuperar-senha/', {'email': user.email}, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        url = reverse('password_reset_confirm', args=[
            urlsafe_base64_encode(force_bytes(user.pk)), default_token_generator.make_token(user)])
        self.assertIn(url, mail.outbox[0].body)
        response = self.client.get(url, follow=True)
        self.assertTrue(response.context['validlink'])
        destino = response.redirect_chain[-1][0]
        response = self.client.post(destino, {'new_password1': 'OutraSenha456!xy',
                                              'new_password2': 'OutraSenha456!xy'}, follow=True)
        self.assertContains(response, 'Senha redefinida com sucesso!')
        user.refresh_from_db()
        self.assertTrue(user.check_password('OutraSenha456!xy'))
        self.assertFalse(user.check_password('SenhaAntiga123!'))

    def test_email_inexistente_nao_envia_mensagem(self):
        response = self.client.post('/recuperar-senha/', {'email': 'ninguem@example.com'}, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 0)
