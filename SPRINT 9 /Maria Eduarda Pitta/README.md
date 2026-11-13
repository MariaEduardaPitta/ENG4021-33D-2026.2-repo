# Maria Eduarda Pitta — Sprint 9

Minha parte da Sprint 9: gravação do vídeo demonstrativo de Login/Cadastro no repositório próprio, integração da API Open Library para consulta de livros pelo ISBN e implementação de CSS responsivo nas telas de Anunciar Material, Editar Material, Compra e Confirmação de Compra.

Trabalhei na melhoria da experiência do usuário no projeto REPASSA, integrando a API Open Library ao formulário de anúncio para facilitar o preenchimento das informações de livros. Também realizei adaptações de responsividade nas telas, preservando a identidade visual desenvolvida nas sprints anteriores.

**Funcionalidades desenvolvidas:**

- Gravação do vídeo demonstrativo das funcionalidades de Login e Cadastro no repositório próprio.
- Integração com a API Open Library para consulta de informações de livros por ISBN.
- Implementação da consulta de ISBN na tela de Anunciar Material.
- Preenchimento automático de informações disponíveis sobre o livro a partir da resposta da API.
- Preservação do preenchimento manual das informações do anúncio.
- Adaptação do CSS da tela de Anunciar Material para diferentes tamanhos de tela.
- Adaptação do CSS da tela de Editar Material.
- Adaptação do CSS da tela de Compra.
- Adaptação do CSS da tela de Confirmação de Compra.
- Ajustes de organização visual, espaçamento e apresentação dos elementos em telas menores.
- Preservação dos formulários e das funcionalidades existentes durante as alterações de interface.

**Arquivos alterados:**

- `repassaproject/repassaapp/templates/anunciar.html`
- `repassaproject/repassaapp/static/css/anunciar.css`
- `repassaproject/repassaapp/static/css/editar_material.css`
- `repassaproject/repassaapp/static/css/compra.css`
- `repassaproject/repassaapp/static/css/confirmacao.css`

A atividade de vídeo de Login/Cadastro foi realizada em repositório próprio, separado do projeto principal.

**Como acessar as funcionalidades:**

Com o servidor Django rodando:

- Tela de Anunciar Material — formulário com consulta de livros por ISBN utilizando a API Open Library.
- Tela de Editar Material — formulário com CSS responsivo.
- Tela de Compra — formulário de compra adaptado para diferentes tamanhos de tela.
- Tela de Confirmação de Compra — apresentação das informações da compra com layout responsivo.

As funcionalidades de anúncio, edição e compra dependem da autenticação do usuário.

**Como executar o projeto:**

Dentro da pasta `repassaproject`, com Django instalado:

```bash
python manage.py migrate
python manage.py runserver
```

**Testes realizados:**

As alterações foram realizadas diretamente pelo GitHub. Foi feita uma conferência do código HTML, CSS e JavaScript para verificar a implementação da consulta à API Open Library e das adaptações de responsividade.

Também foram preparados vídeos demonstrativos das alterações realizadas.

Não foram realizados testes completos de execução em ambiente local. A consulta à API Open Library e a apresentação das telas em diferentes dispositivos ainda precisam ser validadas com o servidor Django em funcionamento.
