// Products withdrawn from the storefront at the store's request on 15/11/2026.
// Keep the full list so future catalog imports do not restore these cards.
export const retiredProductCodes = [
  "6744", "6698", "6525", "6342", "5253", "6169", "6172",
  "4838", "4836", "4837", "5252", "6400", "4818",
  "6050", "6054", "2912", "6401", "2913", "4534", "4537", "4540",
  "6403", "5389", "5395", "6405", "5387", "5397", "6406", "5398", "5388",
  "6113", "6114", "4071", "6988", "6986", "6987", "6900", "6899",
  "6766", "6939", "5092", "6414", "6413", "5072",
  "7104", // Retirado a pedido da loja em 17/11/2026.
  "6754", "6745", "7211", "7210", "6637", // Relatório de 19/11/2026. O 6052 voltou ao catálogo em 24/11.
  "1486", "1487", "1617", "6175", "6370", "6402"
];

// These independently imported presentations have no SKU in the source.
export const retiredProductIds = [
  "site-difusor-de-aromas-desejos-sucesso-mandarina-fresca-240ml",
  "site-agua-perfumada-para-roupas-flowers-flor-de-cerejeira-500ml",
  "site-iogurte-corporal-dubai-dreams-200ml",
  "site-deo-colonia-spray-black-44-60ml",
  "site-acucar-esfoliante-bonjour-paris-250g",
  "site-kit-boutique-em-flores",
  "site-capsulas-de-colageno-e-acido-hialuronico-60-unidades",
  "site-sabonete-esfoliante-jabuticaba-120ml",
  "site-sabonete-esfoliante-maracuja-120ml",
  "site-kit-cascas-e-folhas-herbal-verde",
  "site-kit-viagem-flor-de-jasmim-e-amendoas-doces",
  "site-refil-para-difusor-de-aromas-desejos-sucesso-mandarina-fresca-250ml",
  "site-perfume-para-roupas-e-ambiente-sucesso-mandarina-fresca-380ml"
];

const codes = new Set(retiredProductCodes);
const ids = new Set(retiredProductIds);

export function isRetiredProduct(product) {
  return codes.has(product.code) || ids.has(product.id);
}
