Minha parte da Sprint 7: admin com dados de exemplo, formulário de avaliação do vendedor e CSS da avaliação.

Cadastrei 25 registros fictícios pelos formulários do admin local: 1 faculdade, 4 usuários, 3 categorias, 6 materiais, 3 compras, 3 pagamentos, 4 mensagens e 1 avaliação. A cópia dos dados está em `repassaproject/repassaapp/fixtures/dados_sprint7.json`, sem senhas utilizáveis. O banco SQLite fica local.

Para carregar a cópia em um banco local novo, dentro de `repassaproject`:

```text
python manage.py migrate
python manage.py loaddata dados_sprint7
python manage.py createsuperuser
python manage.py runserver
```

O admin fica em `/admin/`. Para usar uma conta de exemplo no login, defina uma senha para ela pelo admin. Não carregue a cópia por cima de um banco com dados do grupo, porque os IDs podem coincidir.

A avaliação fica em `/compras/ID/avaliar/` e precisa de uma sessão autenticada do comprador. Nos dados de exemplo, `demo_2` tem a compra 2 ainda sem avaliação. O formulário recebe só nota e comentário; comprador e vendedor vêm da compra. Uma compra aceita apenas uma avaliação.

A tela de login está na tarefa do Eric. O link para avaliar pode ser colocado na confirmação ou nas conversas usando a URL `avaliar_vendedor` e o ID da compra. Não alterei essas telas para evitar conflito com as outras entregas.

Testes:

```text
python manage.py test repassaapp
```
