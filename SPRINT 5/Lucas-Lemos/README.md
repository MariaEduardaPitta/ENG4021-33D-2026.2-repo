# Minha parte da Sprint 5

Preparei os oito models com base na minha modelagem da Sprint 3. Corrigi a relação com Faculdade: uma faculdade pode ter vários usuários e cada usuário pode pertencer a nenhuma ou uma faculdade.

O arquivo está aqui provisoriamente. Ainda falta colocar no aplicativo Django do projeto e gerar/aplicar as migrações. Conferi a sintaxe Python, mas ainda não testei no Django.

## Integração no projeto

- Copiar o conteúdo de models.py para o models.py do aplicativo criado pelo PO e adicionar esse aplicativo a INSTALLED_APPS.
- Antes da primeira migração, configurar AUTH_USER_MODEL = "nome_do_app.Usuario" em settings.py, substituindo nome_do_app pelo nome real. Se o projeto já tiver migrações com o usuário padrão, combinar a adaptação antes de mudar essa configuração.
- Usuario usa AbstractUser: mantém username e os recursos de senha do Django. Nome, email, CPF, curso, WhatsApp, nota média e faculdade são os campos da modelagem. O login por email ainda precisa ser integrado; por padrão a autenticação usa username.
- Criar senhas com create_user() ou set_password(); não salvar a senha diretamente no campo password.
- foto guarda um arquivo em materiais/. A validação de imagem fica para o formulário; configurar MEDIA_ROOT/MEDIA_URL para os uploads.
- Os IDs são criados automaticamente pelo Django. Valores monetários usam DecimalField. CPF é salvo sem pontuação; a validação atual confere os 11 números, não os dígitos verificadores.
- Compra.material, Pagamento.compra e Avaliacao.compra usam OneToOneField para seguir as cardinalidades do diagrama. Um pagamento por compra precisa ser criado pelo fluxo de checkout.
- A atualização da nota média, os estados de pagamento/entrega e a conferência de que o avaliador é o comprador ficam para a lógica da aplicação.

Depois de integrar, rodar na pasta do manage.py:

```text
python manage.py check
python manage.py makemigrations nome_do_app
python manage.py migrate
python manage.py showmigrations nome_do_app
```

Vou incluir as migrações geradas no PR quando a estrutura estiver disponível.
