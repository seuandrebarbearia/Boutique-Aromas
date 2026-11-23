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
    image: "assets/products/kit-amendoas-jasmim-7232.jpg",
    catalogNote: "Kit não localizado no PDF de 61 páginas. A foto da loja confirma a composição. Preço anterior mantido para conferência."
  },
  "site-kit-black-44": {
    code: "", isPromotional: true, image: "assets/products/kit-black-44-loja.jpg"
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
    volume: "100 g", priceCents: 6890, image: "assets/products/vela-massagem-flor-da-pele-7192.jpg",
    alternatePhoto: { src: "assets/products/vela-massagem-flor-da-pele-7192-aberta.jpg", label: "Vela com a tampa aberta" }
  }
};

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
  const update = reviewUpdate ? { ...originalUpdate, ...reviewUpdate } : originalUpdate;
  const customerNote = update?.customerNote ?? (update ? "" : customerNotes[product.id] ?? "");
  if (!update) return {
    ...product, customerNote,
    ...(product.isCombo && /PDF|catálogo|pendente|não informad/i.test(product.composition ?? "")
      ? { composition: "Consulte os itens do kit com nossa equipe." } : {})
  };
  const legacyCodes = [...new Set([
    ...(product.legacyCodes ?? []),
    ...(update.legacyCodes ?? []),
    ...(product.code && product.code !== "Não informado" && update.code && product.code !== update.code ? [product.code] : [])
  ])];
  return {
    ...product, ...update, legacyCodes, reference: update.code ?? product.reference,
    ...(update.priceCents !== undefined ? {
      priceStatus: "approved-store", priceBasis: "approved-store", priceReference: null,
      storeApprovedAt: reviewUpdate?.priceCents !== undefined ? "2026-11-19" : "2026-11-18"
    } : {}),
    ...(update.image ? { imageKind: "individual", officialImage: null, photoPending: false } : {}),
    catalogNote: update.catalogNote ?? "", customerNote, officialTitle: "", description: "",
    collection: update.family ?? product.collection
  };
}
