# Boutique de Aromas — catálogo demonstrativo

Catálogo estático em português do Brasil, feito com HTML, CSS e JavaScript puro. A experiência permite pesquisar e filtrar produtos, selecionar uma categoria, montar um carrinho local e gerar uma simulação de resumo com endereço de entrega.

> **Catálogo demonstrativo.** Há preços de referência do site oficial e valores demonstrativos identificados por item. Nenhum pedido é enviado e nenhum pagamento é realizado.

## Revisão de preços e fotos — 10/11/2026

### Cards unitários por categoria

A apresentação atual usa **191 cards unitários em 16 categorias**, seguindo a referência enviada pelo usuário: uma imagem por SKU, nome, volume/especificação, código, preço sempre visível e botão “Adicionar ao carrinho”. O botão adiciona uma unidade daquele produto; quantidades são alteradas no carrinho. Os kits têm seu próprio card e exibem a composição antes da compra. A grade tem quatro colunas no desktop, três no tablet e duas no celular.

Foram conferidas **153 fotos individuais: 137 do site oficial e 16 do catálogo**, ante 63 na etapa anterior. Os outros **38 cards** indicam “Foto individual em atualização”; as pendências por código e apresentação estão em `referencias/fotos-pendentes.md`. A foto coletiva permanece disponível nos detalhes desses itens. A busca, os filtros de categoria, fragrância e universo e a ordenação de preço continuam funcionando.

O mapa público de produtos do site forneceu os nomes, páginas e imagens de referência. Foram conferidos tipo, aroma, volume e rótulos; no refil 6748, o código também foi confirmado na variante pública. Outras consultas de variantes retornaram HTTP 429 e não foram repetidas. A correspondência por código remoto não está confirmada para todos os itens. Os limites de enquadramento mudam apenas a área exibida no card: as fotos, rótulos e embalagens não foram reconstruídos. Duas máquinas GAS-501F e três roll-ons foram enquadrados individualmente a partir de objetos separados nas fotos do PDF.

O mapeamento fica em `js/product-card-media.js` e `js/audited-product-photos.js`. A auditoria completa está em `referencias/auditoria-fotos-produtos.json`, com fonte, dimensões, enquadramento e hash de cada foto. Diferenças de volume, itens sobrepostos e aromas sem identificação segura ficaram pendentes.

Validação desta apresentação: **32 testes passaram**, incluindo preservação de todos os SKUs nas categorias, ordem dos produtos filtrados, arquivos das fotos, limites de enquadramento e identidade das variantes. As fotos e os painéis de enquadramento foram inspecionados. A verificação do layout no navegador segue pendente.

Na etapa anterior, foram extraídas 115 fotos de 59 páginas do PDF, separando as fotografias de títulos, textos, logotipos e decoração. Essa etapa forneceu as imagens aproveitadas nos cards unitários atuais. Os limites de enquadramento estão em `js/collection-photos.js`; os arquivos ficam em `assets/collections/`.

- Atualizados 60 preços com correspondência de produto, aroma/coleção e volume nas páginas públicas do site oficial. Os dados ficam em `js/reference-prices.js`; valores anteriores, fontes, idade da indexação e pendências estão em `referencias/revisao-precos-site.json`.
- A consulta inclui páginas indexadas entre hoje e três meses atrás. A listagem direta retornou HTTP 429, e algumas páginas não ficaram acessíveis. Os valores são referências para conferência, sem sincronização ao vivo ou confirmação de promoções e estoque da filial. Os demais itens continuam identificados como demonstrativos.
- O difusor Sucesso 250 ml e o sabonete Borboletas 220 ml mantêm os valores demonstrativos: as apresentações encontradas no site são de 240 ml. O Novità Chá Branco 300 ml também ficou pendente, pois a página individual não pôde ser confirmada.
- O kit 7232 usa loção de 380 ml; o kit de nome semelhante no site informa 200 ml. Seu valor continua estimado pela soma dos componentes corretos, agora R$ 293,70, sem copiar o preço do outro kit.
- O usuário autorizou o uso das fotos do site oficial. Foram integradas 137 fotos individuais e uma foto de ambiente para a abertura, com origem em `referencias/fotos-site-oficial.json`.
- As páginas completas renderizadas a 120 dpi (1350 × 1688 px) continuam disponíveis nos detalhes. Na apresentação dos cards, foram substituídas pelas fotografias extraídas descritas acima. O grid evita esticar um único card pela largura inteira. A ampliação continua disponível.
- Verificação: 29 testes passaram, JavaScript válido e nenhuma falha em `git diff --check`. A conferência de layout no navegador continua pendente por indisponibilidade do acesso de navegador na sessão anterior.

## Revisão de continuidade — 10/11/2026

O trabalho existente foi preservado: 191 produtos, agrupamento por coleção, fotos locais, filtros, carrinho e resumo demonstrativo, além da identidade visual baseada no brandbook fornecido.

- Corrigida a navegação de Perfumação e Autocuidado no cabeçalho e nos acessos rápidos. Links diretos, recarregamento e voltar/avançar agora sincronizam o universo exibido com a URL. Os filtros de busca, categoria e fragrância continuam combinados.
- Completada a classificação de Perfumação com velas, essências, aromatizadores elétricos, sachês e aromatização profissional; Autocuidado inclui perfumaria e cuidados faciais. Refis de sabonete ficam em Autocuidado; outros refis, em Perfumação. Kits, embalagens, acessórios e aromaterapia permanecem na consulta geral.
- Corrigida a restauração de “Sem número” ao reabrir a revisão do endereço.
- Conferidos visualmente no PDF os exemplos de assinatura, redução mínima, paleta e tipografia. As fontes institucionais continuam dependendo de arquivos licenciados para integração.
- Consultado o site oficial como referência. A página de Bamboo da Sorte 250 ml ficou acessível e apresenta texto sobre folhas verdes/cítricos e uma pirâmide com lavanda, mel, jasmim, vetiver e musk. Essa diferença continua exigindo confirmação da marca; não foi transferida ao catálogo.
- Validação desta revisão: 28 testes passaram e o JavaScript passou na verificação de sintaxe. A conferência visual interativa desta revisão não foi concluída: a conexão HTTP local foi encerrada inesperadamente, o acesso de navegador estava indisponível e a janela nativa permaneceu minimizada após a tentativa de abertura. Os registros de telas abaixo pertencem à revisão anterior.

Para uso comercial, ainda é necessário confirmar preços, disponibilidade, composições pendentes dos kits, entrega e o fluxo de pedidos. A prévia permanece demonstrativa e as alterações desta revisão são locais.

## Abrir no Windows com VS Code

1. Abra esta pasta no VS Code.
2. Instale a extensão **Live Server**, caso ainda não esteja instalada.
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Não é necessário instalar dependências nem executar uma etapa de compilação. O projeto também inclui testes nativos do Node.js; execute `npm test` em um terminal do VS Code.

## Estrutura

- `index.html` — estrutura semântica da página e dos diálogos.
- `css/styles.css` — estilos responsivos e estados de foco.
- `js/app.js` — filtros, detalhes, carrinho e fluxo de revisão.
- `js/catalog.js` — agrupamento das páginas e produtos por coleção.
- `js/products.js` — dados dos produtos, números de apresentação, famílias, categorias, preços demonstrativos e páginas de origem.
- `js/cart.js` — carrinho e persistência versionada em `localStorage`.
- `js/checkout.js` — validação do endereço e montagem do resumo.
- `js/config.js` — nome da loja, modo demonstrativo, entrega e configuração futura do WhatsApp.
- `assets/catalog-pages/` — cópias em imagem das páginas de produtos, usadas como fotos coletivas.
- `assets/products/` — recortes individuais que puderam ser associados com segurança a produtos.
- `assets/brand/boutique-de-aromas-logo.png` — recorte sem alterações da assinatura horizontal oficial no brandbook fornecido.
- `assets/products/placeholder.svg` — ilustração local para os produtos sem recorte confirmado.
- `referencias/catalogo.pdf` — PDF de referência fornecido, mantido apenas na cópia local e excluído da publicação.
- `referencias/auditoria-catalogo.json` — identificação do PDF revisado, códigos por página e conferência das fotos coletivas.
- `referencias/conferencia-catalogo.csv` — relação de conferência dos produtos por página, com identificação, código original, especificação, família e situação.
- `tests/` — testes do carrinho, validação, subtotal e dados de catálogo.

## Dados e limitações

- Foram lidas as 65 páginas do PDF. O catálogo digital contém 191 produtos identificados nas páginas 4 a 62.
- A apresentação segue as cores institucionais do brandbook (#567E72, #FCF5E3 e #32563D) e usa a assinatura horizontal oficial do documento, preservando sua proporção e respiro.
- Quiche Sans e Recursive Sans não estão disponíveis como arquivos de fonte licenciados no projeto. Seguindo a alternativa indicada no brandbook, títulos usam Optima com fallback de sistema e textos usam Calibri com fallback de sistema.
- BA Essências, BOU Beauty e Favo Beauty não foram atribuídas aos produtos: a associação de cada SKU a uma linha não está confirmada nos cadastros. O catálogo agora agrupa páginas repetidas da mesma coleção e oferece acessos separados para perfumação de ambientes e autocuidado.
- O botão “Ver produtos da coleção” apenas revela as opções individuais; nenhum item é adicionado até a ação explícita em um produto. As composições conhecidas de combos são apresentadas antes da compra e combos de composição não confirmada não recebem componentes presumidos.
- O WhatsApp da loja abre um canal de atendimento com o número confirmado e prefixo internacional do Brasil. O link não preenche uma mensagem nem ativa o envio de pedido.
- A abertura usa uma foto de ambiente do site oficial, autorizada pelo usuário. As fotografias do brandbook não foram copiadas.
- O usuário confirmou autorização da filial para as imagens existentes do catálogo e autorizou posteriormente as fotos do site oficial.
- Na visualização geral, páginas repetidas da mesma coleção são agrupadas sob um único título, preservando as fotos e os produtos de cada página. Os acessos “Perfumação de ambientes” e “Autocuidado” filtram o catálogo sem alterar a busca por nome, código ou fragrância nem a seleção de categoria.
- Foram diferenciados os cadastros semelhantes conferindo as fotos do catálogo: o código 6401 é um refil; as loções 6590 e 6592 têm variantes diferentes; o frasco 7248 identifica Ocean, apesar da legenda repetida “Element” no PDF. Óleos, brumas e blends de Aromaterapia receberam os nomes das variantes visíveis nos rótulos.
- As páginas coletivas são cópias renderizadas do PDF original, que permanece intacto na cópia local. Nenhum número é sobreposto às fotos; os números de apresentação aparecem nas opções individuais. Essências são identificadas pelo nome completo do aroma, sem número.
- O PDF imprime o código `6507` em duas velas diferentes. Os dois produtos têm IDs e números de apresentação próprios; o código exibido permanece exatamente como no catálogo.
- Categorias como difusores, sabonetes, sprays e refis são separadas para navegação. As famílias foram atribuídas a partir dos títulos visíveis no catálogo.
- “Ver produtos da coleção” revela as opções sem adicionar itens; a compra ocorre apenas quando o cliente aciona o botão do produto. Combos exibem sua composição conhecida, quantidade, volume e preço antes da compra. “Comprar combo” adiciona uma unidade do SKU do conjunto, sem lançar seus componentes novamente. No kit 7232, o valor estimado é a soma dos três componentes confirmados (R$ 293,70). Os demais combos permanecem como SKU único enquanto suas composições individuais não puderem ser confirmadas.
- As fotos coletivas completas foram comparadas com os códigos e cadastros nas páginas de produtos do PDF. Identificações, especificações e pendências de composição estão registradas em `referencias/conferencia-catalogo.csv`; os itens de combo sem SKUs completos permanecem explicitamente pendentes. Fotos são contidas sem cortes e ampliadas somente ao clicar.
- Na revisão final, foram completados o modelo GAS-501F, os aromas dos aromatizadores profissionais, as especificações elétricas, os aromas e a embalagem dos sachês, além dos nomes do açúcar esfoliante em óleo e do hidratante Summer Gold.
- Os preços sem referência oficial mantêm os valores demonstrativos de base. As referências conferidas substituem esses valores na exportação final do catálogo e aparecem identificadas na interface.
- Os detalhes usam 153 fotos individuais ou de conjuntos específicos e 38 referências a fotos coletivas. Fotos coletivas têm legenda explicativa e ampliação. O kit Hydra recebeu a foto oficial da embalagem, que confirma uma esponja e uma espuma de limpeza de 50 ml.
- A revisão organiza os produtos em 16 categorias. Corrige os aromas de Casa Alegre nas páginas 32 e 33, os refis 6400 e 6106 e as famílias das loções 6590 e 6592. Divergências entre legendas e rótulos são informadas nos detalhes dos produtos e na planilha de conferência.
- O catálogo não define disponibilidade, frete, regras de venda ou condições de atacado. A entrega aparece como **a combinar**.
- A página oficial do Bamboo da Sorte 250 ml foi consultada na revisão de continuidade acima. A descrição e a pirâmide olfativa continuam dependendo de confirmação antes de incorporá-las ao catálogo.
- O endereço da loja é Rua Luiz Boito Piazza, nº 3467. O telefone e WhatsApp informados são 48996495663. O link de atendimento usa o prefixo do Brasil e não envia pedidos.
- Nome, telefone e endereço de entrega permanecem apenas na memória da página durante a sessão. O carrinho salva apenas IDs e quantidades localmente.
- O resumo é demonstrativo e não confirma nem envia um pedido.

### Editar dados e preços

Atualize preços de referência em `js/reference-prices.js`, usando centavos (por exemplo, `11990` representa R$ 119,90). Os valores demonstrativos de base ficam em `js/products.js`, nas seções `initialProductDetails` e `extractedProducts`. Nomes, fragrâncias, volumes e páginas de origem também ficam nesse arquivo.

Para trocar uma imagem, coloque o arquivo local em `assets/products/` e altere o campo `image` do produto para o caminho relativo correspondente. Use somente uma imagem confirmada para aquele produto; mantenha o placeholder quando não houver uma imagem confiável.

## WhatsApp

O número fornecido, `48996495663`, fica registrado em `js/config.js` e é exibido junto ao telefone da loja. O link de atendimento abre `https://wa.me/5548996495663`; enviar um pedido continua desativado (`whatsappEnabled: false`).

## Verificação

Execute `npm test` para verificar SKUs, números de apresentação únicos, nomes de essências, famílias e categorias, imagens locais, adição atômica de ofertas, subtotal de R$ 299,70 (2 unidades do código 7109 e 1 do 7110), separação da entrega, validação de telefone/CEP/UF, restauração do carrinho e dados salvos inválidos.

- `npm test` — 29 testes passaram, cobrindo preços de referência, diferenças de volume, catálogo, agrupamento por coleção, imagens locais, combos e carrinho.
- No navegador, em 360, 768 e 1440 px, não houve rolagem horizontal nem sobreposição entre o título e o elemento gráfico da abertura.
- Busca pelo código repetido 6507 retornou os dois produtos; o filtro de Difusores retornou 28 produtos. Os acessos das categorias selecionaram os destinos corretos e Novità foi agrupada em um único bloco na visualização geral.
- “Ver produtos da coleção” abriu uma lista sem fotos e com `aria-expanded`; apenas a ação explícita em um produto abriu o carrinho. O carrinho confirmou a inclusão individual.
- A composição do kit 7232 aparece antes da compra. O endereço de WhatsApp foi conferido e imagens locais referenciadas carregaram sem erro.
- A prévia local fica disponível em `http://127.0.0.1:8767/` enquanto o servidor de revisão estiver em execução.

## Pedidos pelo WhatsApp — 12/11/2026
A revisão agora prepara uma solicitação com produtos, quantidades, subtotal e endereço. O cliente abre o WhatsApp da loja e confirma o envio no próprio aplicativo. Não há pagamento automático nem confirmação de estoque. Preços de referência e valores pendentes continuam sujeitos à confirmação da loja. Layout e cores preservados.

## Catálogo oficial — 12/11/2026
Consultado o catálogo público oficial: 185 produtos em sete páginas. Atualizados 140 produtos por correspondência documentada e adicionadas 45 apresentações com fotos locais. O catálogo contém agora 236 itens, preservando os 191 originais e os volumes distintos. Fontes e correspondências: referencias/catalogo-oficial-2026-11-12.json. As ofertas são referências consultadas na data, sem sincronização de estoque ou preços da filial. Produtos antigos sem correspondência continuam identificados como valores demonstrativos. Layout e paleta preservados.

## Fotos do PDF fornecido — 13/11/2026
Adicionadas 13 fotos individuais extraídas do catálogo de 97 páginas, preservando as imagens completas. Conferidos código, tipo e apresentação antes da associação. O catálogo tem 211 fotos disponíveis e 25 pendências documentadas em `referencias/fotos-pendentes.md`; modelos ausentes ou com volume divergente não foram substituídos por outra apresentação. Preços e dados dos produtos preservados.
