// A collective photo represents one catalog page, even when its products
// belong to several categories. Combos keep their own presentation.
export function groupCatalogOffers(products) {
  const groups = new Map();
  for (const product of products) {
    const key = product.isCombo ? `combo-${product.id}` : `page-${product.sourcePage}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(product);
  }
  return [...groups.values()];
}
