# Revisão de responsividade de 13/11/2026

Base testada em main: c8aa58a. Edge com Playwright, altura de 900 px, banco SQLite isolado e contas fictícias de comprador e vendedor.

Na primeira rodada, as páginas de detalhes e edição de material deram erro 500 por falta da tabela FotoMaterial. Foi preciso instalar Pillow no ambiente e gerar a migração do modelo. A branch inclui essas duas correções.

Depois das correções, as 72 verificações passaram nas três larguras. Foram verificados o endereço final, HTTP 200, CSS carregado, erros de JavaScript, largura do documento e elementos fora da janela. Na compra, o teste também abriu o modal e mediu sua posição. Nenhum ajuste adicional em responsivo.css foi necessário para esses critérios.

A suíte Django teve 38 de 39 testes aprovados. O teste de edição de perfil esperava a mensagem “Perfil atualizado.” e falhou nessa comparação. Essa verificação é separada do teste de layout.

| Tela ou estado | 375 px | 768 px | 1280 px |
| --- | --- | --- | --- |
| meu_perfil | [Print](prints/meu_perfil-375.png) | [Print](prints/meu_perfil-768.png) | [Print](prints/meu_perfil-1280.png) |
| perfil_vendedor | [Print](prints/perfil_vendedor-375.png) | [Print](prints/perfil_vendedor-768.png) | [Print](prints/perfil_vendedor-1280.png) |
| inicio | [Print](prints/inicio-375.png) | [Print](prints/inicio-768.png) | [Print](prints/inicio-1280.png) |
| login | [Print](prints/login-375.png) | [Print](prints/login-768.png) | [Print](prints/login-1280.png) |
| cadastro | [Print](prints/cadastro-375.png) | [Print](prints/cadastro-768.png) | [Print](prints/cadastro-1280.png) |
| perfil | [Print](prints/perfil-375.png) | [Print](prints/perfil-768.png) | [Print](prints/perfil-1280.png) |
| anunciar | [Print](prints/anunciar-375.png) | [Print](prints/anunciar-768.png) | [Print](prints/anunciar-1280.png) |
| editar_material | [Print](prints/editar_material-375.png) | [Print](prints/editar_material-768.png) | [Print](prints/editar_material-1280.png) |
| buscar | [Print](prints/buscar-375.png) | [Print](prints/buscar-768.png) | [Print](prints/buscar-1280.png) |
| conversas | [Print](prints/conversas-375.png) | [Print](prints/conversas-768.png) | [Print](prints/conversas-1280.png) |
| chat | [Print](prints/chat-375.png) | [Print](prints/chat-768.png) | [Print](prints/chat-1280.png) |
| notificacoes | [Print](prints/notificacoes-375.png) | [Print](prints/notificacoes-768.png) | [Print](prints/notificacoes-1280.png) |
| detalhes | [Print](prints/detalhes-375.png) | [Print](prints/detalhes-768.png) | [Print](prints/detalhes-1280.png) |
| compra | [Print](prints/compra-375.png) | [Print](prints/compra-768.png) | [Print](prints/compra-1280.png) |
| modal_compra | [Print](prints/modal-375.png) | [Print](prints/modal-768.png) | [Print](prints/modal-1280.png) |
| confirmacao | [Print](prints/confirmacao-375.png) | [Print](prints/confirmacao-768.png) | [Print](prints/confirmacao-1280.png) |
| avaliacao | [Print](prints/avaliacao-375.png) | [Print](prints/avaliacao-768.png) | [Print](prints/avaliacao-1280.png) |
| avaliacoes | [Print](prints/avaliacoes-375.png) | [Print](prints/avaliacoes-768.png) | [Print](prints/avaliacoes-1280.png) |
| avaliacoes_vazio | [Print](prints/avaliacoes_vazio-375.png) | [Print](prints/avaliacoes_vazio-768.png) | [Print](prints/avaliacoes_vazio-1280.png) |
| entrega | [Print](prints/entrega-375.png) | [Print](prints/entrega-768.png) | [Print](prints/entrega-1280.png) |
| recuperar | [Print](prints/recuperar-375.png) | [Print](prints/recuperar-768.png) | [Print](prints/recuperar-1280.png) |
| email_enviado | [Print](prints/email_enviado-375.png) | [Print](prints/email_enviado-768.png) | [Print](prints/email_enviado-1280.png) |
| nova_senha | [Print](prints/nova_senha-375.png) | [Print](prints/nova_senha-768.png) | [Print](prints/nova_senha-1280.png) |
| senha_sucesso | [Print](prints/senha_sucesso-375.png) | [Print](prints/senha_sucesso-768.png) | [Print](prints/senha_sucesso-1280.png) |
