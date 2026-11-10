# Boutique de Aromas — catálogo demonstrativo

Catálogo estático em português do Brasil, feito com HTML, CSS e JavaScript puro. A experiência permite pesquisar e filtrar produtos, selecionar uma categoria, montar um carrinho local e gerar uma simulação de resumo com endereço de entrega.

> **Demonstração — preços fictícios.** Nenhum pedido é enviado e nenhum pagamento é realizado.

## Abrir no Windows com VS Code

1. Abra esta pasta no VS Code.
2. Instale a extensão **Live Server**, caso ainda não esteja instalada.
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Não é necessário instalar dependências nem executar uma etapa de compilação. O projeto também inclui testes nativos do Node.js; execute `npm test` em um terminal do VS Code.

## Estrutura

- `index.html` — estrutura semântica da página e dos diálogos.
- `css/styles.css` — estilos responsivos e estados de foco.
- `js/app.js` — filtros, detalhes, carrinho e fluxo de revisão.
- `js/catalog.js` — agrupamento das apresentações, sem repetir fotos coletivas na visualização geral.
- `js/products.js` — dados dos produtos, números de apresentação, famílias, categorias, preços demonstrativos e páginas de origem.
- `js/cart.js` — carrinho e persistência versionada em `localStorage`.
- `js/checkout.js` — validação do endereço e montagem do resumo.
- `js/config.js` — nome da loja, modo demonstrativo, entrega e configuração futura do WhatsApp.
- `assets/catalog-pages/` — cópias em imagem das páginas de produtos, usadas como fotos coletivas.
- `assets/products/` — recortes individuais que puderam ser associados com segurança a produtos.
- `assets/products/placeholder.svg` — ilustração local para os produtos sem recorte confirmado.
- `referencias/catalogo.pdf` — PDF de referência fornecido, mantido apenas na cópia local e excluído da publicação.
- `referencias/auditoria-catalogo.json` — identificação do PDF revisado, códigos por página e conferência das fotos coletivas.
- `referencias/conferencia-catalogo.csv` — relação de conferência dos produtos por página, com identificação, código original, especificação, família e situação.
- `tests/` — testes do carrinho, validação, subtotal e dados de catálogo.

## Dados e limitações

- Foram lidas as 65 páginas do PDF. O catálogo digital contém 191 produtos identificados nas páginas 4 a 62.
- Na visualização “Todas as categorias”, cada página coletiva aparece uma única vez, reunindo seus produtos mesmo quando pertencem a categorias diferentes. Combos mantêm cards próprios. A revisão reduziu 109 apresentações para 62, sem excluir nenhum dos 191 produtos. Ao selecionar uma categoria, as opções de compra ficam restritas aos produtos correspondentes.
- Foram diferenciados os cadastros semelhantes conferindo as fotos do catálogo: o código 6401 é um refil; as loções 6590 e 6592 têm variantes diferentes; o frasco 7248 identifica Ocean, apesar da legenda repetida “Element” no PDF. Óleos, brumas e blends de Aromaterapia receberam os nomes das variantes visíveis nos rótulos.
- As páginas coletivas são cópias renderizadas do PDF original, que permanece intacto na cópia local. Nenhum número é sobreposto às fotos; os números de apresentação aparecem nas opções individuais. Essências são identificadas pelo nome completo do aroma, sem número.
- O PDF imprime o código `6507` em duas velas diferentes. Os dois produtos têm IDs e números de apresentação próprios; o código exibido permanece exatamente como no catálogo.
- Categorias como difusores, sabonetes, sprays e refis são separadas para navegação. As famílias foram atribuídas a partir dos títulos visíveis no catálogo.
- “Comprar todos” inclui somente os itens daquela apresentação, respeitando os filtros ativos. Combos exibem o preço demonstrativo do conjunto. “Comprar combo” adiciona uma unidade do SKU do combo, sem lançar seus componentes novamente. No kit 7232, o preço demonstrativo do conjunto é a soma dos três componentes confirmados (R$ 204,70); eles ficam disponíveis separadamente em “Comprar unidades”. Os demais combos permanecem como SKU único enquanto suas composições individuais não puderem ser confirmadas. Preços são fictícios e não representam descontos.
- As fotos coletivas completas foram comparadas com os códigos e cadastros nas páginas de produtos do PDF. Identificações, especificações e pendências de composição estão registradas em `referencias/conferencia-catalogo.csv`; os itens de combo sem SKUs completos permanecem explicitamente pendentes. Fotos são contidas sem cortes e ampliadas somente ao clicar.
- Na revisão final, foram completados o modelo GAS-501F, os aromas dos aromatizadores profissionais, as especificações elétricas, os aromas e a embalagem dos sachês, além dos nomes do açúcar esfoliante em óleo e do hidratante Summer Gold.
- Os 13 preços da tabela inicial da especificação foram mantidos. Os demais preços são fictícios e devem ser substituídos antes de qualquer uso comercial.
- Os detalhes usam 17 fotos específicas de produtos ou conjuntos e 174 referências a fotos coletivas originais. Fotos coletivas têm legenda explicativa e ampliação. O kit Hydra usa a página coletiva porque o recorte anterior não representava o conjunto completo.
- A revisão organiza os produtos em 16 categorias. Corrige os aromas de Casa Alegre nas páginas 32 e 33, os refis 6400 e 6106 e as famílias das loções 6590 e 6592. Divergências entre legendas e rótulos são informadas nos detalhes dos produtos e na planilha de conferência.
- O catálogo não define disponibilidade, frete, regras de venda ou condições de atacado. A entrega aparece como **a combinar**.
- O endereço da loja é Rua Luiz Boito Piazza, nº 3467. O telefone e WhatsApp informados são 48996495663; o catálogo apenas os exibe e não abre uma integração de envio.
- Nome, telefone e endereço de entrega permanecem apenas na memória da página durante a sessão. O carrinho salva apenas IDs e quantidades localmente.
- O resumo é demonstrativo e não confirma nem envia um pedido.

### Editar dados e preços

Em `js/products.js`, atualize `priceCents` usando centavos (por exemplo, `11990` representa R$ 119,90). Os 13 registros iniciais estão na seção `initialProductDetails`; os demais estão em `extractedProducts`. Também é possível corrigir nomes, fragrâncias, volumes e páginas de origem nesse arquivo.

Para trocar uma imagem, coloque o arquivo local em `assets/products/` e altere o campo `image` do produto para o caminho relativo correspondente. Use somente uma imagem confirmada para aquele produto; mantenha o placeholder quando não houver uma imagem confiável.

## WhatsApp

O número fornecido, `48996495663`, fica registrado em `js/config.js` e é exibido junto ao telefone da loja. O envio por WhatsApp permanece desativado (`whatsappEnabled: false`): não foi acrescentado um código de país nem presumida uma integração. Nenhum pedido é enviado automaticamente.

## Verificação

Execute `npm test` para verificar SKUs, números de apresentação únicos, nomes de essências, famílias e categorias, imagens locais, adição atômica de ofertas, subtotal de R$ 299,70 (2 unidades do código 7109 e 1 do 7110), separação da entrega, validação de telefone/CEP/UF, restauração do carrinho e dados salvos inválidos.

Histórico de verificações no navegador de versões anteriores (a versão atual passou pelos testes automatizados; a última conferência visual foi interrompida pelo controle de acesso do navegador):

- 191 cadastros correspondem aos códigos das páginas de produtos do PDF, incluindo dois produtos distintos com o código repetido 6507. As pendências de composição dos combos estão listadas na relação de conferência.
- “Comprar combo” adiciona somente o SKU do conjunto pelo preço demonstrativo; “Comprar unidades” do kit 7232 lista os três componentes confirmados, e compras individuais adicionam somente o item e a quantidade escolhidos.
- Listas individuais inicialmente recolhidas, alternância por botão com `aria-expanded`, controle por teclado e quantidades inteiras de 1 a 99. Essências usam o nome completo do aroma e não mostram números de apresentação.
- Pesquisa sem acentos, estado sem resultados, limpeza de filtros, filtro de fragrância, ordenação e rolagem até categorias/famílias.
- Layout em 360, 768 e 1440 px, sem rolagem horizontal nem textos cortados; conteúdo limitado a 1.200 px e fotos coletivas contidas sem corte.
- Listas de ofertas e opções individuais com rolagem interna, preservando a rolagem da página e do carrinho.
- Compra de todas as unidades de uma oferta e compra individual com abertura automática do carrinho, quantidades, remoção e cálculos.
- Revisão do endereço de entrega, subtotal, frete a combinar e geração de resumo sem envio; endereço e contato da loja permanecem separados dos dados do cliente.
- Preferência por movimento reduzido e ausência de erros de JavaScript nos fluxos exercitados.
