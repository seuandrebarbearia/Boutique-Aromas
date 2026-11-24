// Códigos e preços informados diretamente pela loja em 18/11/2026.
// IDs internos preservados para manter fotos e carrinhos salvos.
export const storeApprovedUpdates = {
  "7245": { code: "1795", priceCents: 5990 },
  "site-aromatizador-profissional-cascas-e-folhas-250ml": {
    code: "1377", priceCents: 19990, name: "Aromatizador Profissional", family: "Aromatizadores Profissionais", fragrance: "Cascas e Folhas"
  },
  "site-bruma-hidratante-corporal-150ml": { code: "1717", priceCents: 9699 },
  "site-conjunto-de-varetas-natural-25cm-5-unidades": { priceCents: 1690 },
  "7213": { code: "1753", priceCents: 6890 },
  "7226": { code: "1754", priceCents: 6890 },
  "site-manteiga-hidratante-corporal-200g": { code: "1627", priceCents: 10890 },
  "site-sabonete-esfoliante-jabuticaba-120ml": { code: "1487", priceCents: 4390 },
  "site-sabonete-esfoliante-maracuja-120ml": { code: "1486", priceCents: 4390 },
  "6589": { code: "834", priceCents: 15790, volume: "220 ml" },
  "site-sabonete-liquido-corpo-e-rosto-250ml": {
    code: "1715", priceCents: 8590, name: "Sabonete Líquido Corpo e Rosto", family: "Favo Beauty", volume: "250 ml"
  },
  "site-sabonete-liquido-mi-casa-250ml": { code: "1819", priceCents: 15990, family: "Mi Casa" },
  "site-difusor-cereja-e-avela-95ml": {
    code: "1617", priceCents: 8990, name: "Difusor de Ambientes", family: "Cereja e Avelã", fragrance: "Cereja e Avelã", volume: "95 ml"
  },
  "site-difusor-de-aromas-mi-casa-300ml": { code: "1817", priceCents: 32890, family: "Mi Casa" },
  "site-difusor-de-aromas-sorria-mais-250ml": { code: "520", priceCents: 14290, customerNote: "Consulte a fragrância com nossa equipe." },
  "site-essencia-para-aromatizador-eletrico-felicidade-10ml": {
    code: "517", priceCents: 4300, name: "Essência para Aromatizador Elétrico", family: "Essências", fragrance: "Felicidade", category: "Essências", volume: "10 ml"
  },
  "site-essencia-para-aromatizador-eletrico-gratidao-10ml": {
    code: "1780", priceCents: 4300, name: "Essência para Aromatizador Elétrico", family: "Essências", fragrance: "Gratidão", category: "Essências", volume: "10 ml"
  },
  "site-kit-bella-oriental-gourmand": {
    priceCents: 29590, name: "Kit Bella Original", family: "Bella", category: "Combos", isCombo: true,
    composition: "Consulte os itens do kit com nossa equipe."
  },
  "site-kit-black-44": {
    priceCents: 24990, name: "Kit Black 44", family: "Black 44", category: "Combos", isCombo: true,
    composition: "1 deo colônia + 1 mousse de banho e barba + 1 necessaire.",
    componentIds: ["7030", "6758", "7245"]
  }
};

// Resoluções do relatório da loja de 19/11/2026.
const catalogReviewUpdates = {
  "7103": { name: "Iogurte Corporal", volume: "200 ml", image: "assets/products/iogurte-dubai-dreams-fornecido.png" },
  "7232": {
    name: "Kit Amêndoas e Flor de Jasmim",
    image: "assets/products/kit-amendoas-jasmim-7232-catalogo.jpg",
    catalogNote: "Kit não localizado no PDF de 61 páginas. A foto da loja confirma a composição. Preço anterior mantido para conferência."
  },
  "site-kit-black-44": {
    code: "", isPromotional: true, image: "assets/products/kit-black-44-catalogo.jpg"
  },
  "6177": {
    volume: "250 ml", priceCents: 17990,
    image: "assets/official-2026-11-12/difusor-de-aromas-novita-orquidea-negra-com-musk-250ml.jpg",
    legacyCodes: ["341"],
    legacyIds: ["site-difusor-de-aromas-novita-orquidea-negra-com-musk-250ml"]
  },
  "5504": { priceCents: 9390, image: "assets/official/product-5504.png" },
  "6188": {
    name: "Deo Colônia Roll-on", volume: "10 ml", priceCents: 8090,
    image: "assets/products/roll-on-divina-6188.jpg",
    alternatePhoto: { src: "assets/products/roll-on-divina-6188-lateral.jpg", label: "Frasco e caixa em ângulo lateral" }
  },
  "7134": { priceCents: 12990 },
  "7135": { priceCents: 12990, image: "assets/products/refil-novita-patchouli-musk-imperial-7135.jpg" },
  "7192": {
    volume: "100 g", priceCents: 6890, image: "assets/products/vela-massagem-flor-da-pele-7192-catalogo.jpg",
    alternatePhoto: { src: "assets/products/vela-massagem-flor-da-pele-7192-aberta-catalogo.jpg", label: "Vela com a tampa aberta" }
  }
};

const currentStoreDate = "2026-11-24";
const christmasPromotion = { campaign: "natal", category: "Presentes de Natal", promotionLabel: "Promoção de Natal" };
const currentCatalogUpdates = {
  "7201": { priceCents: 9890 },
  "7198": { priceCents: 9890 },
  "7151": { priceCents: 8990 },
  "site-bruma-hidratante-corporal-150ml": {
    priceCents: 9690, name: "Bruma Hidratante Corporal", family: "Favo Beauty"
  },
  "site-creme-de-banho-shower-cream-esfoliante-200ml": { priceCents: 9790 },
  "5024": { priceCents: 8490, name: "Mousse de Banho Aerossol" },
  "site-kit-jasmim-e-amendoas-doces": {
    priceCents: 26990, name: "Kit Amêndoas Doces e Flor de Jasmim", category: "Combos",
    family: "Amêndoas Doces e Flor de Jasmim", officialTitle: ""
  },
  "site-kit-black-44": {
    priceCents: 32990,
    composition: "1 deo colônia + 1 mousse de banho e barba + 1 necessaire. Masculino."
  },
  "site-serum-clareador-de-manchas-30ml": {
    priceCents: 10190, name: "Sérum Clareador com Ácido Glicólico", family: "Favo Beauty", officialTitle: ""
  },
  "site-serum-uniformizador-30ml": {
    priceCents: 10190, name: "Sérum Uniformizador com Vitamina C", family: "Favo Beauty", officialTitle: ""
  },
  "site-kit-3-body-splash-all-you-need-is-splash": {
    code: "7274", priceCents: 10990, name: "Kit 3 Body Splash All You Need Is Splash",
    volume: "3 × 100 ml", specification: "3 × 100 ml", ...christmasPromotion,
    composition: "3 body splashes de 100 ml cada: Start, Lumi e Night.",
    image: "assets/products/kit-all-you-need-is-splash-7274.jpg",
    alternatePhoto: { src: "assets/products/kit-all-you-need-is-splash-7274-frascos.jpg", label: "Frascos Start, Night e Lumi" }
  },
  "site-difusor-cereja-e-avela-95ml": {
    ...christmasPromotion, promotionGroup: "encantos-de-natal", name: "Difusor de Aromas",
    family: "Encantos de Natal", specification: "95 ml", priceCents: 8990
  },
  "7232": { priceCents: 26790, name: "Kit Jasmim e Amêndoas Doces", catalogNote: "" },
  "site-refil-para-difusor-de-aromas-desejos-gratidao-canela-com-musk-250ml": {
    code: "6176", priceCents: 7290, name: "Refil Difusor de Aromas", family: "Desejos",
    fragrance: "Canela com Musk — Gratidão"
  },
  "6052": { priceCents: 8490, photoPending: true },
  "6100": { priceCents: 7290 },
  "site-vela-aromatica-mi-casa-190g": {
    code: "7235", priceCents: 19990, name: "Vela Aromática", family: "Mi Casa", volume: "190 g", specification: "190 g"
  },
  "6504": { priceCents: 17490 },
  "6505": { priceCents: 17490 },
  "6506": { priceCents: 17490 },
  "6507": { priceCents: 17490 },
  "6507-2": { priceCents: 17490 },
  "7246": { priceCents: 8990, volume: "200 ml", specification: "200 ml · Masculino" },
  "7247": { priceCents: 8990, volume: "200 ml", specification: "200 ml · Masculino" },
  "7248": { priceCents: 8990, volume: "200 ml", specification: "200 ml · Masculino" },
  "7030": { priceCents: 20890, specification: "50 ml · Masculino" }
};

export const storeCatalogAdditions = [
  {
    code: "7260", name: "Kit Desejos de Natal", family: "Desejos de Natal",
    priceCents: 8990, volume: "3 × 30 ml", isCombo: true, ...christmasPromotion,
    composition: "3 perfumes para roupas e ambiente de 30 ml cada: Felicidade, Gratidão e Coragem.",
    image: "assets/products/kit-desejos-natal-7260.jpg"
  },
  {
    code: "7194", name: "Deo Colônia Spray", family: "Amêndoas Doces e Flor de Jasmim", category: "Perfumaria",
    priceCents: 7690, volume: "10 ml"
  },
  ...[
    ["7074", "Verbena"],
    ["7075", "Cereja e Avelã"],
    ["7076", "Lavanda"],
    ["7077", "Vanilla"],
    ["7078", "Chá Branco"]
  ].map(([code, fragrance]) => ({
    code, fragrance, name: "Vela Aromática de Vidro", family: "Velas Aromáticas", category: "Velas",
    priceCents: 16490, volume: "200 g"
  })),
  {
    id: "site-sabonete-liquido-cereja-e-avela-natal-190ml", code: "",
    name: "Sabonete Líquido", family: "Encantos de Natal", fragrance: "Cereja e Avelã", volume: "190 ml",
    ...christmasPromotion, promotionGroup: "encantos-de-natal", priceCents: 4990,
    image: "assets/products/sabonete-encantos-de-natal-cereja-avela-190ml.jpg"
  }
].map(product => ({
  fragrance: "",
  ...product, id: product.id ?? product.code, reference: product.code, collection: product.family,
  image: product.image ?? "assets/products/placeholder.svg",
  imageKind: product.image ? "individual" : "pending", photoPending: !product.image, sourcePage: null, catalogNote: "",
  priceStatus: "approved-store", priceBasis: "approved-store", priceReference: null, storeApprovedAt: currentStoreDate
}));

const customerNotes = {
  "6507": "Confirme a fragrância ao pedir: este código identifica as opções Baunilha e Canela.",
  "6507-2": "Confirme a fragrância ao pedir: este código identifica as opções Baunilha e Canela.",
  "6514": "Confirme a apresentação de 380 ml com nossa equipe.",
  "6749": "Confirme o volume de 250 ml com nossa equipe.",
  "6750": "Confirme a apresentação com nossa equipe: há indicações de 150 ml e 80 ml.",
  "7218": "Consulte as dimensões da sacola com nossa equipe.",
};

export function applyStoreApprovedUpdate(product) {
  if (product.id === "site-capsulas-de-colageno-e-acido-hialuronico-60-unidades") {
    product = {
      ...product,
      description: `Celulite, flacidez e textura irregular da pele estão te incomodando?
O DermaFirm Collagen foi desenvolvido pela Favo para cuidar da sua pele de dentro pra fora, unindo tecnologia e ativos poderosos que promovem firmeza, elasticidade e hidratação.

Benefícios:
• Auxilia na melhora da firmeza e elasticidade da pele;
• Contribui para reduzir o aspecto da celulite;
• Melhora a textura e aparência da pele;
• Possui ação antioxidante e hidratante;
• Ajuda a manter o colágeno natural do corpo.

Fórmula completa com:
• Colágeno hidrolisado, que repõe a proteína essencial para a firmeza da pele;
• Ácido hialurônico, que garante hidratação e viço;
• Vitamina C, conhecida por fortalecer o sistema imunológico, além de participar da síntese de colágeno;
• Silício, cafeína e café verde, que potencializam a ação firmeza e combatem a flacidez.

Sugestão de uso:
Consumir 2 cápsulas ao dia, preferencialmente junto a uma refeição e com ingestão de água. Atua de forma natural, sem causar aceleração.

Importante: O DermaFirm Collagen auxilia na beleza e firmeza da pele quando aliado a bons hábitos, alimentação equilibrada e hidratação adequada.`
    };
  }
  // Apresentação informada pela loja em 20/11/2026; mantém o preço vigente.
  if (["7201", "7198"].includes(product.id)) {
    product = {
      ...product,
      name: "Papel Perfumado",
      officialTitle: `Papel Perfumado ${product.fragrance} para Gavetas`,
      volume: "5 folhas decoradas de 62 cm × 42 cm",
      description: "Contém 5 folhas decoradas de 62 cm × 42 cm."
    };
  }
  const originalUpdate = storeApprovedUpdates[product.id];
  const reviewUpdate = catalogReviewUpdates[product.id];
  const currentUpdate = currentCatalogUpdates[product.id];
  if (!originalUpdate && !reviewUpdate && !currentUpdate) return {
    ...product, customerNote: customerNotes[product.id] ?? "",
    ...(product.isCombo && /PDF|catálogo|pendente|não informad/i.test(product.composition ?? "")
      ? { composition: "Consulte os itens do kit com nossa equipe." } : {})
  };
  const update = { ...originalUpdate, ...reviewUpdate, ...currentUpdate };
  const productIdentityChanged = update.name !== undefined || update.family !== undefined;
  const photo = update.photoPending
    ? { image: "assets/products/placeholder.svg", imageKind: "pending", officialImage: null }
    : update.image ? { imageKind: "individual", officialImage: null, photoPending: false } : {};
  const legacyCodes = [...new Set([
    ...(product.legacyCodes ?? []),
    ...(update.legacyCodes ?? []),
    ...(product.code && product.code !== "Não informado" && update.code && product.code !== update.code ? [product.code] : [])
  ])];
  return {
    ...product, ...update, legacyCodes, reference: update.code ?? product.reference,
    ...(update.priceCents !== undefined ? {
      priceStatus: "approved-store", priceBasis: "approved-store", priceReference: null,
      storeApprovedAt: currentUpdate?.priceCents !== undefined
        ? currentStoreDate : reviewUpdate?.priceCents !== undefined ? "2026-11-19" : "2026-11-18"
    } : {}),
    ...photo,
    catalogNote: update.catalogNote ?? "",
    customerNote: update.customerNote ?? customerNotes[product.id] ?? "",
    officialTitle: update.officialTitle ?? (originalUpdate || reviewUpdate || productIdentityChanged ? "" : product.officialTitle),
    description: originalUpdate || reviewUpdate ? "" : product.description,
    collection: update.family ?? product.collection
  };
}
