from django.test import TestCase
from .models import Usuario


class ContasTest(TestCase):
    def setUp(self):
        self.dados = dict(nome='Ana', sobrenome='Silva', cpf='123.456.789-01', telefone='21900000000', email='ana@example.com', senha='TesteConta2026!')

    def cadastrar(self):
        return self.client.post('/cadastro/', self.dados)

    def test_cadastro_login_e_campos(self):
        self.assertEqual(self.client.get('/cadastro/').status_code, 200)
        self.assertEqual(self.client.get('/login/').status_code, 200)
        self.assertRedirects(self.cadastrar(), '/login/')
        u = Usuario.objects.get(email=self.dados['email'])
        self.assertEqual(u.nome, 'Ana Silva')
        self.assertEqual(u.cpf, '12345678901')
        self.assertEqual(u.whatsapp, self.dados['telefone'])
        self.assertTrue(u.check_password(self.dados['senha']))
        self.assertFalse(u.is_staff)
        self.assertRedirects(self.client.post('/login/?next=/editar-perfil/', {'email':'ANA@example.com', 'senha':self.dados['senha']}), '/editar-perfil/')
        self.assertEqual(int(self.client.session['_auth_user_id']), u.pk)

    def test_dados_invalidos_e_duplicados(self):
        self.cadastrar()
        for changes in [{}, {'email':'outra@example.com'}, {'cpf':'abc','email':'outra@example.com'}, {'cpf':'11122233344','email':'outra@example.com','senha':'123'}]:
            r=self.client.post('/cadastro/', self.dados | changes)
            self.assertEqual(r.status_code,200)
            self.assertTrue(r.context['form'].errors)
        self.assertEqual(Usuario.objects.count(),1)

    def test_login_invalido_e_inativo(self):
        self.cadastrar()
        for senha in ['errada', self.dados['senha']]:
            if senha==self.dados['senha']:
                Usuario.objects.update(is_active=False)
            r=self.client.post('/login/', {'email':self.dados['email'],'senha':senha})
            self.assertContains(r,'E-mail ou senha inválidos.')
            self.assertNotIn('_auth_user_id',self.client.session)

    def test_edicao_campos_senha_e_sessao(self):
        self.cadastrar();u=Usuario.objects.get();self.client.force_login(u)
        r=self.client.get('/editar-perfil/')
        self.assertContains(r,'value="Ana"')
        dados=dict(nome='Ana Maria',sobrenome='Souza',email='novo@example.com',telefone='21888888888',senha='NovaSenha2026!')
        r=self.client.post('/editar-perfil/',dados,follow=True)
        self.assertContains(r,'Perfil atualizado.')
        u.refresh_from_db()
        self.assertEqual(u.nome,'Ana Maria Souza');self.assertEqual(u.whatsapp,dados['telefone'])
        self.assertTrue(u.check_password(dados['senha']))
        self.assertEqual(int(self.client.session['_auth_user_id']),u.pk)
        self.client.logout()
        self.assertRedirects(self.client.post('/login/',{'email':dados['email'],'senha':dados['senha']}),'/')

    def test_edicao_email_repetido_e_senha_em_branco(self):
        self.cadastrar();u=Usuario.objects.get();self.client.force_login(u)
        Usuario.objects.create_user(username='outro',email='outro@example.com',cpf='11122233344',nome='Outro')
        dados=dict(nome='Ana',sobrenome='Silva',email='outro@example.com',telefone='',senha='')
        r=self.client.post('/editar-perfil/',dados)
        self.assertTrue(r.context['form'].errors)
        u.refresh_from_db();self.assertEqual(u.email,self.dados['email'])
        dados['email']=u.email
        self.assertEqual(self.client.post('/editar-perfil/',dados).status_code,302)
        u.refresh_from_db();self.assertTrue(u.check_password(self.dados['senha']))

    def test_acesso_anonimo_e_redirecionamento_externo(self):
        self.assertEqual(self.client.get('/editar-perfil/').status_code,302)
        self.cadastrar()
        self.assertRedirects(self.client.post('/login/?next=https://example.com',{'email':self.dados['email'],'senha':self.dados['senha']}),'/')
