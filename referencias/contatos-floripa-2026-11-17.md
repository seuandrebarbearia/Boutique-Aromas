# Contatos da unidade de Florianópolis — 17/11/2026

Fontes fornecidas pela empresa:

- Google Maps: https://maps.app.goo.gl/C189HDEHPThRFPxJ9
- Instagram: https://www.instagram.com/boutiquedearomas.floripa/

O link do Maps redirecionou para **Boutique de Aromas Florianópolis**, identificador `0x952747563915b7d7:0xc4b440d1234cac1b` (`/g/11wxz2mmsb`). Os detalhes públicos carregados pelo próprio Maps informam:

- Endereço: Av. Luiz Boiteux Piazza, 3414, sala 3, Cachoeira do Bom Jesus, Florianópolis - SC, CEP 88056-000.
- Telefone: (48) 99198-9442 / +55 48 99198-9442.

A descrição pública do Instagram identifica Boutique de Aromas Floripa e Cachoeira do Bom Jesus, Florianópolis. O conteúdo acessível não forneceu telefone, destino do link de contato nem e-mail. Não foram usados dados da matriz, do quiosque do shopping ou de outras franquias.

## Pendências

- Não foi possível confirmar que (48) 99649-5663 pertence à unidade ou recebe pedidos. Retirado dos contatos ativos.
- WhatsApp para atendimento e pedidos: (48) 99198-9442, confirmado diretamente pelo usuário em 17/11/2026, na mensagem “048991989442 sse confirmmado”. Configurado no formato internacional `5548991989442`, retirando o zero de prefixo nacional.
- E-mail da unidade não confirmado. Nenhum endereço foi inferido.
- A confirmação posterior do usuário resolveu a pendência anterior de WhatsApp. `whatsappNumber` é `5548991989442` e `whatsappEnabled` é verdadeiro em `js/config.js`.

## Comportamento e verificação

Instagram e Maps usam os links exatos fornecidos, abrem em nova aba com `noopener noreferrer`. Telefone usa `tel:+5548991989442`. “Fale conosco” abre o WhatsApp com mensagem de atendimento. O pedido usa o mesmo destinatário confirmado. A mensagem contém produtos, quantidades, subtotal, nome e telefone do cliente, endereço de entrega e observações opcionais. O clique limpa o carrinho e orienta o cliente a confirmar o envio no aplicativo. Não houve envio de mensagens à loja.

Os testes automatizados verificam mensagem, codificação de acentos, destinatário compartilhado, bloqueio sem confirmação e carrinho. A inspeção visual no navegador ficou indisponível porque o host de acesso ao navegador não respondeu. O retorno HTTP das fontes foi conferido por consulta direta; isso não confirma atendimento real no WhatsApp.
