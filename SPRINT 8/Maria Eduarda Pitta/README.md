# Maria Eduarda Pitta — Sprint 8

Minha parte da Sprint 8: implementação do fluxo completo de compra e integração da API ViaCEP para preenchimento automático do endereço de entrega.

Implementei o fluxo de compra utilizando Django Forms, conectado ao modelo Compra existente no projeto REPASSA. Também integrei a API ViaCEP à tela de compra, mantendo o layout desenvolvido nas sprints anteriores.

**Funcionalidades desenvolvidas:**

- Criação do formulário de compra utilizando Django Forms.
- Exibição dos dados reais do material, preço e vendedor.
- Registro da compra no banco de dados, associando o material ao comprador autenticado.
- Atualização automática do status do material para "vendido" após a compra.
- Restrição para impedir que o vendedor compre o próprio anúncio.
- Verificação para impedir a compra de materiais já vendidos.
- Redirecionamento para a página de confirmação da compra.
- Integração com a API ViaCEP para preenchimento automático de rua, bairro, cidade e estado.
- Tratamento de CEP inválido ou não encontrado, permitindo preenchimento manual.
- Conexão do botão Comprar da página de detalhes ao fluxo de compra.
- Adaptação do HTML e CSS existentes, preservando o visual do REPASSA.

**Arquivos alterados:**

- `repassaproject/repassaapp/forms.py`
- `repassaproject/repassaapp/views.py`
- `repassaproject/repassaproject/urls.py`
- `repassaproject/repassaapp/templates/compra.html`
- `repassaproject/repassaapp/templates/detalhes.html`
- `repassaproject/repassaapp/static/css/compra.css`

**Como acessar as funcionalidades:**

Com o servidor Django rodando e o usuário autenticado:

- `/material/ID/` — página de detalhes do material, com botão Comprar.
- `/comprar/ID/` — formulário de compra com integração ViaCEP.
- `/confirmacao/ID/` — confirmação da compra realizada.

O ID deve ser substituído pelo número do material ou da compra, conforme a página.

**Como executar o projeto:**

Dentro da pasta `repassaproject`, com Django instalado:

```bash
python manage.py migrate
python manage.py runserver
```

**Testes realizados:**

As alterações foram realizadas diretamente pelo GitHub. Foi feita uma conferência do código dos formulários, views, URLs e templates para verificar a integração das funcionalidades.

Não foram realizados testes de execução em ambiente local. O fluxo completo de compra e a consulta ao ViaCEP ainda precisam ser validados com o servidor Django em funcionamento.
