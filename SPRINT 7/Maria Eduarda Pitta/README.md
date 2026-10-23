# Maria Eduarda Pitta — Sprint 7

Minha parte da Sprint 7: formulário para anunciar material, formulário para editar anúncio e CSS da tela de edição.

Implementei dois formulários utilizando Django ModelForm, conectados ao modelo Material existente no projeto.

**Funcionalidades desenvolvidas:**
- Criação de anúncios de materiais acadêmicos.
- Edição de anúncios já cadastrados.
- Salvamento e atualização dos dados no banco de dados.
- Associação automática do anúncio ao usuário autenticado.
- Restrição da edição ao vendedor responsável pelo anúncio.
- Estilização da página de edição com CSS.

**Arquivos alterados ou criados:**
- `repassaproject/repassaapp/forms.py`
- `repassaproject/repassaapp/views.py`
- `repassaproject/repassaproject/urls.py`
- `repassaproject/repassaapp/templates/anunciar.html`
- `repassaproject/repassaapp/templates/editar_material.html`
- `repassaproject/repassaapp/static/css/editar_material.css`

**Como acessar as funcionalidades:**

Com o servidor Django rodando e o usuário autenticado:

- `/anunciar/` — formulário para cadastrar um material.
- `/editar-material/ID/` — formulário para editar um anúncio existente, substituindo ID pelo número do material.

**Como executar o projeto:**

Dentro da pasta `repassaproject`, com Django instalado:

```bash
python manage.py migrate
python manage.py runserver
```

**Testes realizados:**

Testei localmente a criação de um anúncio pelo formulário e confirmei que o material foi registrado no banco de dados por meio do Django Admin.

Também testei a edição de um anúncio existente, alterando título e preço. Após salvar, confirmei que as informações foram atualizadas corretamente.

Os testes foram realizados no ambiente local, utilizando um usuário autenticado e uma categoria previamente cadastrada.
