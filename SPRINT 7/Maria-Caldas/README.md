Minha parte da Sprint 7: liguei telas ao banco de dados e criei a tela de detalhes do material.

PR: https://github.com/MariaEduardaPitta/ENG4021-33D-2026.2-repo/pull/44

O que fiz:

- Página inicial: a view busca os materiais disponíveis e o HTML mostra os cards com os dados do banco
- Notificações: a view junta as mensagens que o usuário recebeu e os materiais dele que foram vendidos, e o HTML mostra essas notificações
- Confirmação de compra: criei a view e a URL `/confirmacao/<id>/` e liguei o HTML aos dados da compra. Só o comprador consegue ver a própria compra
- Detalhes do material (tela nova): HTML, CSS, view e URL `/material/<id>/`. Os cards da página inicial levam para essa tela

Também mudei o settings.py para pt-br e horário de São Paulo, e coloquei o `LOGIN_URL` apontando para o login do admin até a tela de login do Eric ficar pronta.

Notificações e confirmação precisam de login. Para testar com os dados do Lucas:

    python manage.py migrate
    python manage.py loaddata dados_sprint7
    python manage.py createsuperuser
    python manage.py runserver

Os códigos estão em `repassaproject/repassaapp`.