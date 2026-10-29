Minha parte da Sprint 8: avaliações do vendedor, nota real nos cards, fotos dos materiais e confirmação de compra completa.

PR: https://github.com/MariaEduardaPitta/ENG4021-33D-2026.2-repo/pull/50 

O que fiz:

- Avaliações do vendedor (tela nova): view e URL `/vendedores/<id>/avaliacoes/`. A view busca as avaliações recebidas pelo vendedor e calcula a quantidade e a média real das notas. O HTML `avaliacoes_vendedor.html` mostra o resumo e cada avaliação, ou uma mensagem quando o vendedor ainda não tem avaliações
- Nota do vendedor: a página inicial e os detalhes do material não usam mais o campo `nota_media` (que ficava sempre em 0). Agora a nota é a média calculada das avaliações. Na tela de detalhes também tem um link "Ver avaliações"
- Fotos dos materiais: `index.html` e `detalhes.html` mostram a foto cadastrada, ou o logo do REPASSA quando o material não tem foto. Configurei `MEDIA_URL` e `MEDIA_ROOT` no `settings.py`, a URL de mídia no `urls.py` (só no modo DEBUG) e coloquei `media/` no `.gitignore` para as fotos de teste não irem para o repositório
- Confirmação de compra: o botão "Falar com o vendedor" agora leva para o chat. Adicionei o acompanhamento da entrega e as ações de acordo com a situação da compra: "Avaliar vendedor" quando a entrega foi concluída, e "Ver minha avaliação" quando a compra já foi avaliada

Também fiz a atividade individual de Login/Cadastro no meu repositório: https://github.com/condecaldasmaria-spec/ENG4021-2026.2

Para testar:

    python manage.py migrate
    python manage.py runserver

- Avaliações: crie uma avaliação pelo admin e abra `/vendedores/<id do vendedor>/avaliacoes/`
- Fotos: no admin, coloque uma foto em um material e veja a página inicial e os detalhes
- Confirmação: crie uma compra pelo admin com você como compradora e abra `/confirmacao/<id da compra>/`. Mude o status da entrega para `entregue` para ver o botão de avaliar

Os códigos estão em `repassaproject/repassaapp`.