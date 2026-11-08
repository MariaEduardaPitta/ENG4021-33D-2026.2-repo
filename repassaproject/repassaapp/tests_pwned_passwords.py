import hashlib
from io import BytesIO
from unittest.mock import patch
from urllib.error import URLError
from django.test import SimpleTestCase, TestCase
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.urls import reverse
from .models import Usuario
from .pwned_passwords import consultar_senha_vazada, ConsultaSenhaIndisponivel


class ConsultaSenhaTest(SimpleTestCase):
    def resposta(self, conteudo):
        resposta = BytesIO(conteudo.encode())
        resposta.status = 200
        return resposta

    @patch('repassaapp.pwned_passwords.urlopen')
    def test_envia_apenas_prefixo_e_encontra_sufixo(self, abrir):
        senha = 'SenhaFicticiaParaTeste!903'
        digest = hashlib.sha1(senha.encode()).hexdigest().upper()
        abrir.return_value = self.resposta('A' * 35 + ':0\r\n' + digest[5:] + ':12')
        self.assertEqual(consultar_senha_vazada(senha), 12)
        requisicao = abrir.call_args.args[0]
        self.assertEqual(requisicao.full_url, 'https://api.pwnedpasswords.com/range/' + digest[:5])
        self.assertIsNone(requisicao.data)
        self.assertEqual(requisicao.get_header('Add-padding'), 'true')
        self.assertEqual(abrir.call_args.kwargs['timeout'], 4)

    @patch('repassaapp.pwned_passwords.urlopen')
    def test_senha_nao_encontrada_e_padding_nao_sao_vazamento(self, abrir):
        senha = 'OutraSenhaFicticia!903'
        digest = hashlib.sha1(senha.encode()).hexdigest().upper()
        for texto in ['A' * 35 + ':123', digest[5:] + ':0']:
            abrir.return_value = self.resposta(texto)
            self.assertEqual(consultar_senha_vazada(senha), 0)

    @patch('repassaapp.pwned_passwords.urlopen')
    def test_falhas_nao_sao_tratadas_como_senha_segura(self, abrir):
        for erro in [URLError('offline'), TimeoutError()]:
            abrir.side_effect = erro
            with self.assertRaises(ConsultaSenhaIndisponivel):
                consultar_senha_vazada('Teste!903')
        abrir.side_effect = None
        for texto in ['', '<html>erro</html>', 'A' * 35 + ':abc']:
            abrir.return_value = self.resposta(texto)
            with self.assertRaises(ConsultaSenhaIndisponivel):
                consultar_senha_vazada('Teste!903')


class NovaSenhaTest(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create_user(username='pwnedteste', email='pwned@example.com',
            cpf='90909090909', password='SenhaAnterior!903')
        url = reverse('password_reset_confirm', args=[
            urlsafe_base64_encode(force_bytes(self.usuario.pk)),
            default_token_generator.make_token(self.usuario)])
        resposta = self.client.get(url, follow=True)
        self.destino = resposta.redirect_chain[-1][0]

    def enviar(self, senha='NovaSenhaFicticia!903'):
        return self.client.post(self.destino, {'new_password1': senha, 'new_password2': senha}, follow=True)

    @patch('repassaapp.forms.consultar_senha_vazada', return_value=21)
    def test_vazada_avisa_e_nao_altera_senha(self, consultar):
        resposta = self.enviar()
        self.assertContains(resposta, 'Essa senha já apareceu em vazamentos')
        self.usuario.refresh_from_db()
        self.assertTrue(self.usuario.check_password('SenhaAnterior!903'))

    @patch('repassaapp.forms.consultar_senha_vazada', side_effect=ConsultaSenhaIndisponivel)
    def test_indisponivel_avisa_e_preserva_senha(self, consultar):
        self.assertContains(self.enviar(), 'Não foi possível verificar vazamentos agora')
        self.usuario.refresh_from_db()
        self.assertTrue(self.usuario.check_password('SenhaAnterior!903'))

    @patch('repassaapp.forms.consultar_senha_vazada', return_value=0)
    def test_nao_encontrada_salva_senha_e_invalida_token(self, consultar):
        self.assertContains(self.enviar(), 'Senha redefinida com sucesso!')
        self.usuario.refresh_from_db()
        self.assertTrue(self.usuario.check_password('NovaSenhaFicticia!903'))
        consultar.reset_mock()
        self.enviar('TentativaNovaSenha!904')
        consultar.assert_not_called()

    @patch('repassaapp.forms.consultar_senha_vazada')
    def test_confirmacao_diferente_nao_consulta_api(self, consultar):
        self.client.post(self.destino, {'new_password1': 'UmaSenha!903', 'new_password2': 'OutraSenha!903'})
        consultar.assert_not_called()
