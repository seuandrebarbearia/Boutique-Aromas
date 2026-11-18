// Products withdrawn from the storefront at the store's request on 15/11/2026.
// Keep the full list so future catalog imports do not restore these cards.
export const retiredProductCodes = [
  "6744", "6698", "6525", "6342", "5253", "6169", "6172",
  "4838", "4836", "4837", "5252", "6400", "4818",
  "6050", "6054", "2912", "6401", "2913", "4534", "4537", "4540",
  "6403", "5389", "5395", "6405", "5387", "5397", "6406", "5398", "5388",
  "6113", "6114", "4071", "6988", "6986", "6987", "6900", "6899",
  "6766", "6939", "5092", "6414", "6413", "5072",
  "7104" // Retirado a pedido da loja em 17/11/2026.
];

// These independently imported presentations have no SKU in the source.
export const retiredProductIds = [
  "site-difusor-de-aromas-desejos-sucesso-mandarina-fresca-240ml",
  "site-agua-perfumada-para-roupas-flowers-flor-de-cerejeira-500ml",
  "site-iogurte-corporal-dubai-dreams-200ml",
  "site-deo-colonia-spray-black-44-60ml",
  "site-acucar-esfoliante-bonjour-paris-250g",
  "site-kit-boutique-em-flores"
];

const codes = new Set(retiredProductCodes);
const ids = new Set(retiredProductIds);

export function isRetiredProduct(product) {
  return codes.has(product.code) || ids.has(product.id);
}
