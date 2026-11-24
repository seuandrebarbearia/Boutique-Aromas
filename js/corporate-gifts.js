// Ofertas por unidade das páginas 2 a 8 do catálogo Mimos Corporativos.
export const corporateGifts = [
  {
    id: "corporativo-perfume-ambiente-15ml",
    name: "Perfume para Ambiente",
    volume: "15 ml",
    priceCents: 1690,
    description: "Acompanha cartão presente personalizável.",
    image: "assets/products/corporativo-perfume-ambiente-15ml.jpg"
  },
  {
    id: "corporativo-body-splash-15ml",
    name: "Body Splash",
    volume: "15 ml",
    priceCents: 1690,
    description: "Acompanha cartão presente personalizável. Foto ilustrativa da apresentação.",
    image: "assets/products/corporativo-perfume-ambiente-15ml.jpg",
    imageAlt: "Exemplo de cartão presente com frasco de 15 ml"
  },
  {
    id: "corporativo-body-splash-masculino-15ml",
    name: "Body Splash Masculino",
    volume: "15 ml",
    priceCents: 1690,
    description: "Acompanha cartão presente personalizável.",
    image: "assets/products/corporativo-body-splash-masculino-15ml.jpg",
    variants: [
      { id: "corporativo-body-splash-masculino-15ml-element", label: "Element" },
      { id: "corporativo-body-splash-masculino-15ml-ocean", label: "Ocean" },
      { id: "corporativo-body-splash-masculino-15ml-original", label: "Original" }
    ]
  },
  {
    id: "corporativo-hidratante-jasmim-vanilla-60ml",
    name: "Hidratante Mãos e Corpo Jasmim e Vanilla",
    volume: "60 ml",
    priceCents: 2190,
    description: "Acompanha cartão presente personalizável.",
    image: "assets/products/corporativo-hidratante-jasmim-vanilla-60ml.jpg"
  },
  {
    id: "corporativo-difusor-lirio-95ml",
    name: "Difusor de Aromas Lírio do Vale",
    volume: "95 ml",
    priceCents: 3690,
    description: "Acompanha varetas e cartão presente personalizável.",
    image: "assets/products/corporativo-difusor-lirio-95ml.jpg"
  },
  {
    id: "corporativo-difusor-30ml",
    name: "Difusor de Aromas",
    volume: "30 ml",
    priceCents: 2290,
    description: "Acompanha varetas e cartão presente personalizável.",
    image: "assets/products/corporativo-difusor-30ml.jpg"
  },
  {
    id: "corporativo-escalda-pes-30g",
    name: "Kit Escalda-Pés com Sal de Banho",
    volume: "30 g",
    priceCents: 1290,
    description: "Embalagem com espaço para a marca da empresa.",
    image: "assets/products/corporativo-escalda-pes-30g.jpg"
  },
  {
    id: "corporativo-vela-cereja-avela-30g",
    name: "Vela Aromática Cereja e Avelã",
    volume: "30 g",
    priceCents: 2190,
    description: "Vela em frasco de vidro com tampa de cortiça.",
    image: "assets/products/corporativo-vela-cereja-avela-30g.jpg"
  }
];

export const corporateGiftProducts = corporateGifts.flatMap(({ id, name, volume, priceCents, variants }) => {
  const product = { id, name, volume, priceCents, code: "", family: "Presentes corporativos" };
  if (!variants) return [product];

  return variants.map((variant) => ({
    ...product,
    id: variant.id,
    name: `${name} · ${variant.label}`
  }));
});
