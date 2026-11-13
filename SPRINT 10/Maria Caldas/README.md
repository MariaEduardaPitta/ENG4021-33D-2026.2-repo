Minha parte da Sprint 10: padronização visual de todas as telas com o Design System, busca e filtros da página inicial funcionando e a nova página Meu perfil.

PRs: [#58](https://github.com/MariaEduardaPitta/ENG4021-33D-2026.2-repo/pull/58) (padronização) e [#60](https://github.com/MariaEduardaPitta/ENG4021-33D-2026.2-repo/pull/59) (busca da página inicial e Meu perfil)

O que fiz:

- Padronização de todas as telas (difícil): cada uma das 19 telas tinha um visual diferente (o login era escuro, a recuperação de senha era azul, algumas tinham cabeçalho roxo, outras um menu que nem funcionava). Criei o `templates/base.html` com o que se repete em todas as telas (cabeçalho com logo e Entrar/Sair, menu inferior e fontes) e o `static/css/base.css` com as cores, fontes, botões, campos, cards e alertas do Design System que fizemos na Sprint 2. As cores viraram variáveis CSS (`--roxo`, `--coral`, `--lilas`...), então se um dia mudar uma cor, muda num lugar só. Depois passei todas as telas para `{% extends 'base.html' %}`: cada tela agora só tem o próprio conteúdo e um CSS com o que é específico dela
  - Login, cadastro, recuperação de senha e chat escondem o menu inferior com `{% block menu %}{% endblock %}` (quem não está logado não usa o menu, e no chat o lugar dele é da caixa de mensagem)
  - O card de material da página inicial e do Buscar agora é o mesmo componente, que ficou no `base.css`. No Buscar, o título do material passou a abrir os detalhes, coisa que antes não acontecia
  - Anunciar e editar anúncio passaram a usar o mesmo CSS, porque o `editar_material.css` era uma cópia exata do `anunciar.css`
  - Apaguei o `responsivo.css`: ele era um arquivo de correções por cima do CSS antigo de cada tela. Como os CSS novos já foram escritos pensando em celular e computador, as regras gerais foram para o `base.css`, as específicas para o CSS de cada tela, e os remendos foram removidos
  - Correções no caminho: logo duplicada na página inicial, "Cancelar" do editar perfil que levava para o login, botão Entrar com cara de botão
- Busca e filtros da página inicial (média): a barra de busca e os botões de filtro da página inicial eram só enfeite. Agora a barra é um formulário GET que manda o texto para o `/buscar/`, e os botões viraram atalhos para cada categoria cadastrada (`/buscar/?categoria=<id>`), além de um "Mais filtros" que abre o Buscar completo. Aproveitei que o Buscar já lê os filtros pela URL, então só precisei passar as categorias na view `home` e montar os links
- Página Meu perfil (média): o botão Perfil do menu ia direto para o formulário de editar perfil. Criei a página `/perfil/` (view `meu_perfil` com `@login_required`) que mostra os dados do usuário, a nota média como vendedor, a lista de anúncios dele (com links para editar ou atualizar a entrega) e a lista de compras (com o status da entrega e o link para avaliar quando a entrega foi concluída). Também criei o `tests_perfil.py` com 3 testes: exige login, o vendedor vê os anúncios dele e o comprador vê as compras dele

Para testar:

    python manage.py migrate
    python manage.py runserver

- Padronização: passe pelas telas logada e deslogada, no tamanho de celular (375 px) e de computador (1280 px) no DevTools. Todas devem ter o mesmo cabeçalho, as mesmas cores e fontes
- Busca: na página inicial, digite "calc" e aperte Buscar, depois clique numa categoria e em "Mais filtros"
- Meu perfil: logada, clique em Perfil no menu inferior
- Testes automáticos: `python manage.py test` (32 testes, incluindo os 3 novos do Meu perfil)

Os códigos estão em `repassaproject/repassaapp`.
