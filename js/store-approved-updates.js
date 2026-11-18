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
  "site-difusor-de-aromas-novita-orquidea-negra-com-musk-250ml": {
    code: "341", priceCents: 9890, name: "Difusor de Aromas", family: "Novità", fragrance: "Orquídea Negra com Musk", volume: "250 ml"
  },
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
    componentIds: ["7030", "6758", "7245"], photoPending: true,
    customerNote: "Foto do kit em atualização."
  }
};

const customerNotes = {
  "5504": "Confirme a apresentação de 95 ml com nossa equipe.",
  "6052": "Confirme a apresentação de 95 ml com nossa equipe.",
  "6177": "Confirme a apresentação de 200 ml com nossa equipe.",
  "6507": "Confirme a fragrância ao pedir: este código identifica as opções Baunilha e Canela.",
  "6507-2": "Confirme a fragrância ao pedir: este código identifica as opções Baunilha e Canela.",
  "6514": "Confirme a apresentação de 380 ml com nossa equipe.",
  "6637": "Confirme o peso de 190 g com nossa equipe.",
  "6749": "Confirme o volume de 250 ml com nossa equipe.",
  "6750": "Confirme a apresentação com nossa equipe: há indicações de 150 ml e 80 ml.",
  "6754": "Confirme o volume com nossa equipe: há indicações de 150 ml e 200 ml.",
  "7103": "Confirme o conteúdo com nossa equipe: há indicações de 200 g e 200 ml.",
  "7192": "Confirme a apresentação de 100 g com nossa equipe.",
  "7218": "Consulte as dimensões da sacola com nossa equipe.",
  "7232": "Consulte a composição e as apresentações do kit com nossa equipe.",
  "6188": "Consulte o volume com nossa equipe."
};

export function applyStoreApprovedUpdate(product) {
  const update = storeApprovedUpdates[product.id];
  const customerNote = update?.customerNote ?? (update ? "" : customerNotes[product.id] ?? "");
  if (!update) return {
    ...product, customerNote,
    ...(product.isCombo && /PDF|catálogo|pendente|não informad/i.test(product.composition ?? "")
      ? { composition: "Consulte os itens do kit com nossa equipe." } : {})
  };
  const legacyCodes = [...new Set([
    ...(product.legacyCodes ?? []),
    ...(product.code && product.code !== "Não informado" && update.code && product.code !== update.code ? [product.code] : [])
  ])];
  const reviewed = {
    ...product, ...update, legacyCodes, reference: update.code ?? product.reference,
    priceStatus: "approved-store", priceBasis: "approved-store", priceReference: null,
    storeApprovedAt: "2026-11-18", catalogNote: "", customerNote,
    officialTitle: "", description: "", collection: update.family ?? product.collection
  };
  if (reviewed.photoPending) {
    reviewed.image = "assets/products/placeholder.svg";
    reviewed.officialImage = null;
    reviewed.imageKind = "pending";
  }
  return reviewed;
}
