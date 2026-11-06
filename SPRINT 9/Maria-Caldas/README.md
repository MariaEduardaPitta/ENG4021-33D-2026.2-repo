Minha parte da Sprint 9: logout completo, integração com a ViaCEP no back-end, QR Code do anúncio e CSS responsivo da página inicial e dos detalhes.

PR: [#54](https://github.com/MariaEduardaPitta/ENG4021-33D-2026.2-repo/pull/54)

O que fiz:

- Logout completo (média): o Entrar/Sair agora aparece em todas as telas, e não só na página inicial. Criei o arquivo `templates/partials/conta.html` com o bloco e coloquei ele com `{% include %}` em cada tela, pra não repetir o código. O estilo do bloco foi para o `responsivo.css`, que todas as páginas carregam. Também troquei as checagens de login feitas na mão por `@login_required` no anunciar, editar material, conversas e chat, então depois de logar a pessoa volta pra página que estava tentando abrir
- ViaCEP no back-end (média): a parte do front (preencher o endereço pelo CEP) já existia desde a sprint 8. Nessa sprint fiz a validação no servidor: criei `servicos.py` com a função que consulta a ViaCEP, e o `CompraForm` agora recusa CEP que não existe e cidade/UF que não batem com o CEP. Se a ViaCEP estiver fora do ar, a compra não é bloqueada. Escolhi a ViaCEP porque o endereço de entrega é a parte da compra onde é mais fácil a pessoa errar
- QR Code (fácil): na tela de detalhes tem um QR Code com o link do anúncio, gerado pela API do goqr.me. A ideia é o vendedor poder divulgar o material (num cartaz no campus, por exemplo) e quem escanear cair direto na página
- CSS responsivo (média): na página inicial os cards ficam em 1, 2 ou 3 colunas dependendo da largura da tela. Nos detalhes, a foto e o preço ficam lado a lado a partir do tablet. Testei em 375, 768 e 1280px no DevTools do Chrome, os prints estão na pasta `testes`
- Correções: o menu de baixo da página inicial e das notificações apontava para arquivos antigos ou estava desativado, agora todos os links funcionam. O botão "Conversar com vendedor" nos detalhes também estava desativado e agora leva para o chat (só aparece para quem não é dono do anúncio)

Para testar:

    python manage.py migrate
    python manage.py runserver

- Logout: abra `/`, `/buscar/` e `/material/<id>/` logada e deslogada (dá pra usar uma janela anônima) e confira o Entrar/Sair. Deslogada, abra `/anunciar/`: deve ir para o login e, depois de entrar, voltar para o anunciar
- ViaCEP: com uma conta que não seja a vendedora, abra `/comprar/<id do material>/`, escolha entrega e teste o CEP `00000000` (CEP não encontrado), o CEP `22451900` com a cidade trocada para Niterói (erro na cidade) e o CEP `22451900` certo (compra concluída)
- QR Code: abra `/material/<id>/` e veja a seção "Compartilhar anúncio"
- Testes automáticos: `python manage.py test` (29 testes, incluindo os 5 novos da ViaCEP)

Prints da responsividade:

| Tela | Celular | Tablet | Computador |
| --- | --- | --- | --- |
| Página inicial | [375 px](testes/home-celular.png) | [768 px](testes/home-tablet.png) | [1280 px](testes/home-computador.png) |
| Detalhes | [375 px](testes/detalhes-celular.png) | [768 px](testes/detalhes-tablet.png) | [1280 px](testes/detalhes-computador.png) |

Os códigos estão em `repassaproject/repassaapp`.