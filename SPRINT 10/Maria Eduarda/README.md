# Maria Eduarda Pitta — Sprint 10

Minha parte da Sprint 10: implementação das funcionalidades de Excluir e Reservar Anúncio, suporte a várias fotos por material e criação do campo Disciplina nos formulários, detalhes e filtros de busca.

Trabalhei na ampliação das funcionalidades de gerenciamento e pesquisa de anúncios do projeto REPASSA. Implementei a lógica para reserva e exclusão de materiais, adicionei suporte ao cadastro de múltiplas imagens por anúncio e desenvolvi o campo Disciplina para facilitar a identificação e localização de materiais acadêmicos.

**Funcionalidades desenvolvidas:**

- Implementação da funcionalidade de reservar anúncios disponíveis.
- Atualização do status do material para "reservado" após a reserva.
- Restrição da reserva ao vendedor responsável pelo anúncio.
- Implementação da funcionalidade de excluir anúncios.
- Verificação para impedir a exclusão de anúncios com compras registradas.
- Verificação para impedir a exclusão de anúncios com mensagens registradas.
- Inclusão de confirmação antes da exclusão do anúncio.
- Criação do modelo FotoMaterial para armazenar várias imagens associadas ao mesmo material.
- Implementação do envio de fotos adicionais durante a criação de anúncios.
- Implementação da inclusão e exclusão de fotos adicionais durante a edição de materiais.
- Criação de uma galeria de imagens na página de detalhes, permitindo alternar entre as fotos do anúncio.
- Adição do campo Disciplina ao modelo Material.
- Inclusão do campo Disciplina nos formulários de Anunciar e Editar Material.
- Exibição da disciplina na página de detalhes do anúncio.
- Implementação da pesquisa por disciplina na função de busca do Django.
- Inclusão do filtro Disciplina na página Buscar.
- Exibição da disciplina nos cartões dos materiais encontrados.
- Preservação das funcionalidades e do layout existentes durante as alterações.

**Arquivos alterados:**

- `repassaproject/repassaapp/models.py`
- `repassaproject/repassaapp/forms.py`
- `repassaproject/repassaapp/views.py`
- `repassaproject/repassaapp/templates/anunciar.html`
- `repassaproject/repassaapp/templates/editar_material.html`
- `repassaproject/repassaapp/templates/detalhes.html`
- `repassaproject/repassaapp/templates/buscar.html`
- `repassaproject/repassaapp/static/css/detalhes.css`

**Como acessar as funcionalidades:**

Com o servidor Django rodando e o usuário autenticado:

- `/material/ID/` — página de detalhes do material, com galeria de fotos, disciplina e opções de reservar ou excluir o anúncio para o vendedor.
- Tela de Anunciar Material — formulário com campo Disciplina e envio de fotos adicionais.
- Tela de Editar Material — formulário para atualizar a disciplina e gerenciar as fotos do anúncio.
- Tela Buscar — pesquisa e filtragem de materiais por disciplina, além dos filtros existentes.

O ID deve ser substituído pelo número do material correspondente. As rotas específicas de anúncio, edição e busca devem ser consultadas no arquivo `urls.py` do projeto.

**Como executar o projeto:**

Dentro da pasta `repassaproject`, com Django instalado:

```bash
python manage.py makemigrations repassaapp
python manage.py migrate
python manage.py runserver
```

Os comandos de migração são necessários para aplicar ao banco de dados as alterações nos modelos Material e FotoMaterial.

**Testes realizados:**

As alterações foram realizadas diretamente pelo GitHub. Foi feita uma conferência do código dos modelos, formulários, views, templates e CSS para verificar a implementação das funcionalidades.

Também foram preparados vídeos explicativos das alterações realizadas em cada etapa.

Não foram realizados testes completos de execução em ambiente local. As migrações do banco de dados ainda precisam ser executadas e as funcionalidades de reserva, exclusão, múltiplas fotos e filtro por disciplina precisam ser validadas com o servidor Django em funcionamento.
