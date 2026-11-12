# Testes da Sprint 9

Data: 07/11/2026. Base: `main` no commit `69a8766508cd0781069109ed80feeb675c08f2fd`, mais as alterações desta entrega. Não havia PR aberto no início da revisão. Se entrarem novas alterações, é preciso testar novamente as telas afetadas.

## O que foi feito

- Consulta à API Pwned Passwords na redefinição de senha (`repassaapp/pwned_passwords.py`, `NovaSenhaForm` em `forms.py` e URL de redefinição). Uma senha encontrada em vazamentos não é salva. Se o serviço não responder, a tela pede para tentar novamente e mantém a senha anterior.
- Ajustes em `static/css/responsivo.css`: cabeçalhos de avaliação e entrega, espaçamento dos avisos, foco dos botões, campo de senha com fonte de 16px e recuperação em janela baixa. O botão para pedir outro link mantém contraste com o fundo.
- Revisão das páginas da aplicação nas larguras 375, 768 e 1280px, com dados fictícios em um banco separado.

A consulta ocorre ao enviar o formulário. Só os primeiros cinco caracteres do hash SHA-1 são enviados ao serviço; a comparação do restante acontece no servidor do projeto. Isso não substitui o hash usado pelo Django para guardar a senha. A ausência de resultado também não garante que uma senha nunca tenha sido vazada.

Referência: [API oficial Pwned Passwords](https://haveibeenpwned.com/API/v3#PwnedPasswords).

## Resultado

- 36 testes Django passaram, incluindo 7 novos testes da API/formulário.
- 66 verificações de layout: 21 páginas/estados e o modal de compra, nas três larguras. Nenhuma rolagem horizontal, elemento fora da largura, falha de CSS ou erro JavaScript foi detectado; as páginas retornaram HTTP 200.
- 6 verificações adicionais: aviso real de senha vazada e retorno de link inválido à recuperação, nas três larguras. O aviso foi testado também com altura de 500px, mantendo o conteúdo acessível por rolagem vertical.
- Consulta real com uma senha pública de exemplo confirmou a integração. Os testes automáticos de falha e sucesso usam respostas simuladas, sem depender da internet.

Navegador: Microsoft Edge com Playwright, larguras emuladas. Não são testes em aparelhos físicos. Os prints são de página inteira; podem ficar mais altos que a janela quando existe rolagem. Foram conferidos visualmente os exemplos de avaliação, entrega e nova senha. A tabela registra a checagem automática e o print de cada tela, não uma validação funcional completa de todas as funções do grupo.

## Prints por tela

| Tela/estado | 375px | 768px | 1280px |
| --- | --- | --- | --- |
| inicio | [Ver](prints/inicio-375.png) | [Ver](prints/inicio-768.png) | [Ver](prints/inicio-1280.png) |
| login | [Ver](prints/login-375.png) | [Ver](prints/login-768.png) | [Ver](prints/login-1280.png) |
| cadastro | [Ver](prints/cadastro-375.png) | [Ver](prints/cadastro-768.png) | [Ver](prints/cadastro-1280.png) |
| perfil | [Ver](prints/perfil-375.png) | [Ver](prints/perfil-768.png) | [Ver](prints/perfil-1280.png) |
| anunciar | [Ver](prints/anunciar-375.png) | [Ver](prints/anunciar-768.png) | [Ver](prints/anunciar-1280.png) |
| editar_material | [Ver](prints/editar_material-375.png) | [Ver](prints/editar_material-768.png) | [Ver](prints/editar_material-1280.png) |
| buscar | [Ver](prints/buscar-375.png) | [Ver](prints/buscar-768.png) | [Ver](prints/buscar-1280.png) |
| conversas | [Ver](prints/conversas-375.png) | [Ver](prints/conversas-768.png) | [Ver](prints/conversas-1280.png) |
| chat | [Ver](prints/chat-375.png) | [Ver](prints/chat-768.png) | [Ver](prints/chat-1280.png) |
| notificacoes | [Ver](prints/notificacoes-375.png) | [Ver](prints/notificacoes-768.png) | [Ver](prints/notificacoes-1280.png) |
| detalhes | [Ver](prints/detalhes-375.png) | [Ver](prints/detalhes-768.png) | [Ver](prints/detalhes-1280.png) |
| compra | [Ver](prints/compra-375.png) | [Ver](prints/compra-768.png) | [Ver](prints/compra-1280.png) |
| modal_compra | [Ver](prints/modal-375.png) | [Ver](prints/modal-768.png) | [Ver](prints/modal-1280.png) |
| confirmacao | [Ver](prints/confirmacao-375.png) | [Ver](prints/confirmacao-768.png) | [Ver](prints/confirmacao-1280.png) |
| avaliacao | [Ver](prints/avaliacao-375.png) | [Ver](prints/avaliacao-768.png) | [Ver](prints/avaliacao-1280.png) |
| avaliacoes | [Ver](prints/avaliacoes-375.png) | [Ver](prints/avaliacoes-768.png) | [Ver](prints/avaliacoes-1280.png) |
| avaliacoes_vazio | [Ver](prints/avaliacoes_vazio-375.png) | [Ver](prints/avaliacoes_vazio-768.png) | [Ver](prints/avaliacoes_vazio-1280.png) |
| entrega | [Ver](prints/entrega-375.png) | [Ver](prints/entrega-768.png) | [Ver](prints/entrega-1280.png) |
| recuperar | [Ver](prints/recuperar-375.png) | [Ver](prints/recuperar-768.png) | [Ver](prints/recuperar-1280.png) |
| email_enviado | [Ver](prints/email_enviado-375.png) | [Ver](prints/email_enviado-768.png) | [Ver](prints/email_enviado-1280.png) |
| nova_senha | [Ver](prints/nova_senha-375.png) | [Ver](prints/nova_senha-768.png) | [Ver](prints/nova_senha-1280.png) |
| senha_sucesso | [Ver](prints/senha_sucesso-375.png) | [Ver](prints/senha_sucesso-768.png) | [Ver](prints/senha_sucesso-1280.png) |
| Aviso de senha vazada (altura 500px) | [Ver](prints/senha-vazada-375.png) | [Ver](prints/senha-vazada-768.png) | [Ver](prints/senha-vazada-1280.png) |

## Como repetir

Na pasta `repassaproject`, com o ambiente virtual e dependências instaladas:

```sh
python manage.py check
python manage.py test repassaapp --noinput
python manage.py runserver
```

Abra as rotas em `repassaproject/urls.py`. Use as ferramentas do navegador para testar as larguras 375, 768 e 1280px. Entre como comprador ou vendedor conforme a tela, com materiais, compras e mensagens de teste cadastrados. Confira se os textos longos quebram, os campos ficam visíveis e os botões podem ser alcançados. Na compra, abra também o modal de confirmação.

Para conferir a API, solicite uma recuperação de senha para uma conta de teste e use o link recebido. Uma senha pública de exemplo como `Password123!` deve mostrar o aviso de vazamento. Nunca use senha pessoal como exemplo. O teste automatizado também confere que uma senha não encontrada pode ser salva, que senhas diferentes não fazem consulta e que o token deixa de funcionar após a troca.

Os resultados detalhados estão nos três arquivos JSON desta pasta. O banco de teste, cookies de sessão e tokens não foram incluídos no repositório.

A atividade individual do vídeo de Login/Cadastro ficou pendente do link da aula e não faz parte desta entrega.
