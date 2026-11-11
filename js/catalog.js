export function getCatalogDepartment(product) {
  const name = product.name.toLocaleLowerCase("pt-BR");
  if (product.category === "Refis") {
    return name.includes("sabonete") ? "autocuidado" : "perfumacao-de-ambientes";
  }
  if (["Difusores", "Sprays", "Velas", "Essências", "Aromatizadores elétricos",
    "Sachês perfumados", "Aromatização profissional"].includes(product.category)) {
    return "perfumacao-de-ambientes";
  }
  if (["Banho e corpo", "Sabonetes", "Perfumaria", "Cuidados faciais"].includes(product.category)) {
    return "autocuidado";
  }
  return "outras-colecoes";
}

export function groupProductsByCategory(products) {
  const groups = new Map();
  for (const product of products) {
    if (!groups.has(product.category)) groups.set(product.category, []);
    groups.get(product.category).push(product);
  }
  return [...groups].sort(([a], [b]) => a.localeCompare(b, "pt-BR"));
}

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

export function groupCatalogCollections(products) {
  const collections = new Map();
  for (const pageProducts of groupCatalogOffers(products)) {
    const [product] = pageProducts;
    const key = product.isCombo ? `combo-${product.id}` : `family-${product.family}`;
    if (!collections.has(key)) {
      collections.set(key, {
        family: product.family,
        isCombo: Boolean(product.isCombo),
        pages: []
      });
    }
    collections.get(key).pages.push(pageProducts);
  }
  return [...collections.values()];
}
