import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { buildOrderSummary, formatBRL, validateAddress } from "../js/checkout.js";

const validFields = {
  name: "Ana Exemplo",
  phone: "(11) 99999-1234",
  postalCode: "01001-000",
  street: "Rua das Flores",
  number: "10",
  neighborhood: "Centro",
  city: "São Paulo",
  state: "sp"
};

test("validates Brazilian phone, CEP, UF, and no-number addresses", () => {
  const result = validateAddress({ ...validFields, noNumber: "on" });

  assert.deepEqual(result.errors, {});
  assert.equal(result.customer.phone, "11999991234");
  assert.equal(result.customer.postalCode, "01001000");
  assert.equal(result.customer.state, "SP");
  assert.equal(result.customer.number, "Sem número");
});

test("reports invalid phone, CEP, and UF", () => {
  const result = validateAddress({
    ...validFields,
    phone: "123",
    postalCode: "123",
    state: "São"
  });

  assert.ok(result.errors.phone);
  assert.ok(result.errors.postalCode);
  assert.ok(result.errors.state);
});

test("builds a simulation summary with shipping separate from the subtotal", () => {
  const summary = buildOrderSummary({
    storeName: "Boutique de Aromas",
    items: [
      {
        name: "Óleo Difusor de Aromas",
        code: "7109",
        volume: "300 ml",
        quantity: 2,
        lineSubtotalCents: 23980
      },
      {
        name: "Sabonete Líquido",
        code: "7110",
        volume: "300 ml",
        quantity: 1,
        lineSubtotalCents: 5990
      }
    ],
    customer: validateAddress(validFields).customer,
    subtotalCents: 29970,
    shippingLabel: "A combinar"
  });

  assert.match(summary, /R\$\u00a0299,70/);
  assert.match(summary, /Entrega: valor a combinar/);
  assert.doesNotMatch(summary, /Valor final|Total a pagar/i);
  assert.equal(formatBRL(29970), "R$ 299,70");
});

test("shows a combo as one composed item in the order summary", () => {
  const summary = buildOrderSummary({
    storeName: "Boutique de Aromas",
    items: [
      {
        name: "Kit Amêndoas Doces e Flor de Jasmim",
        code: "7232",
        volume: "Não informado",
        isCombo: true,
        composition: "1 loção 380 ml + 1 mousse 150 ml + 1 body splash 200 ml",
        quantity: 1,
        lineSubtotalCents: 7990
      }
    ],
    customer: validateAddress(validFields).customer,
    subtotalCents: 7990,
    shippingLabel: "A combinar"
  });

  assert.match(summary, /1 x Kit Amêndoas Doces e Flor de Jasmim/);
  assert.match(summary, /1 loção 380 ml \+ 1 mousse 150 ml \+ 1 body splash 200 ml/);
  assert.doesNotMatch(summary, /Não informado/);
});

test("keeps set component names identifiable in the order summary", () => {
  const summary = buildOrderSummary({
    storeName: "Boutique de Aromas",
    items: [
      {
        name: "Loção Hidratante",
        family: "Amêndoas Doces e Flor de Jasmim",
        code: "7149",
        volume: "380ml",
        quantity: 1,
        lineSubtotalCents: 7990
      }
    ],
    customer: validateAddress(validFields).customer,
    subtotalCents: 7990,
    shippingLabel: "A combinar"
  });

  assert.match(summary, /Loção Hidratante · Amêndoas Doces e Flor de Jasmim/);
});

test("catalog products have unique IDs and preserve the 13 specified prices", async () => {
  const { products } = await import("../js/products.js");
  assert.equal(products.length, 191);
  assert.equal(new Set(products.map((product) => product.id)).size, products.length);
  assert.equal(new Set(products.map((product) => product.code)).size, 190);
  assert.equal(products.filter((product) => product.code === "6507").length, 2);
  assert.ok(
    products.every(
      (product) =>
        product.name.trim() &&
        product.category &&
        product.volume &&
        Number.isInteger(product.priceCents) &&
        product.priceCents > 0
    )
  );

  const initialPrices = {
    "7109": 11990,
    "7110": 5990,
    "7111": 6990,
    "7112": 12990,
    "7113": 6490,
    "7117": 7990,
    "7201": 2490,
    "7210": 9990,
    "7135": 5990,
    "7211": 9490,
    "7134": 5490,
    "7137": 3990,
    "7136": 3990
  };
  for (const [code, priceCents] of Object.entries(initialPrices)) {
    assert.equal(
      products.find((product) => product.code === code).priceCents,
      priceCents,
      `unexpected demo price for product ${code}`
    );
  }
  assert.equal(products.find((product) => product.code === "7201").volume, "Não informado");
});

test("assigns unique presentation numbers and keeps catalog families and categories", async () => {
  const { products } = await import("../js/products.js");
  const presentationNumbers = products.map((product) => product.presentationNumber);
  const categories = new Set(products.map((product) => product.category));
  const productFingerprints = products.map(
    (product) => `${product.code}|${product.name}|${product.fragrance}`
  );

  assert.equal(new Set(presentationNumbers).size, products.length);
  assert.equal(new Set(productFingerprints).size, products.length);
  assert.ok(products.every((product) => product.family && product.collection));
  assert.ok(
    ["Difusores", "Sabonetes", "Sprays", "Refis", "Banho e corpo"].every((category) =>
      categories.has(category)
    )
  );

  const duplicateCodes = products.filter((product) => product.code === "6507");
  assert.equal(duplicateCodes.length, 2);
  assert.notEqual(
    duplicateCodes[0].presentationNumber,
    duplicateCodes[1].presentationNumber
  );
  assert.deepEqual(
    duplicateCodes.map((product) => product.code),
    ["6507", "6507"]
  );
  assert.equal(products.find((product) => product.code === "7055").fragrance, "Bonjour Paris");
  assert.equal(products.find((product) => product.code === "7218").volume, "80 cm");
  assert.equal(products.find((product) => product.code === "6106").category, "Refis");
  assert.equal(products.find((product) => product.code === "7102").name, "Manteiga Hidratante Desodorante");
  assert.equal(products.find((product) => product.code === "7102").fragrance, "New York Vibes");
  assert.equal(products.find((product) => product.code === "7103").fragrance, "Dubai Dreams");
  assert.equal(products.find((product) => product.code === "7104").fragrance, "Bonjour Paris");
  assert.equal(products.find((product) => product.code === "7245").name, "Necessaire Masculina");
  assert.equal(products.find((product) => product.code === "7245").volume, "11 × 29,5 × 6 cm");
});

test("identifies each essence by its full aroma name without a presentation number", async () => {
  const { products } = await import("../js/products.js");
  const essences = products.filter((product) => product.family === "Essências");

  assert.equal(essences.length, 11);
  assert.deepEqual(
    essences.map((product) => product.fragrance).sort(),
    [
      "Alecrim Dourado",
      "Bamboo da Sorte",
      "Borboletas Azuis",
      "Cereja e Avelã",
      "Flowers",
      "Lichia e Flores do Campo",
      "Maçã com Canela",
      "Magnólia",
      "Mandarina Fresca",
      "Orquídea Negra com Musk",
      "Violeta e Lavanda"
    ].sort()
  );
});

test("matches the three Aromas Nativos diffuser fragrances to their pictured SKUs", async () => {
  const { products } = await import("../js/products.js");

  assert.deepEqual(
    products
      .filter((product) => product.sourcePage === 34)
      .map(({ code, fragrance, volume }) => [code, fragrance, volume])
      .sort(([codeA], [codeB]) => codeA.localeCompare(codeB)),
    [
      ["6970", "Manga Rosa", "95 ml"],
      ["7180", "Capim Real", "95 ml"],
      ["7181", "Bergamota Basilic", "95 ml"]
    ]
  );
});

test("preserves catalog specifications and fragrances from the audited pages", async () => {
  const { products } = await import("../js/products.js");
  const byId = (id) => products.find((product) => product.id === id);

  assert.equal(byId("7140").specification, "Modelo GAS-501F · perfuma áreas de 400 a 600 m²");
  assert.equal(byId("7141").specification, "Modelo GAS-501F · perfuma áreas de 400 a 600 m²");
  assert.deepEqual(
    products.filter((product) => product.sourcePage === 11).map(({ code, fragrance }) => [code, fragrance]),
    [
      ["6836", "Chá Branco com Romã"],
      ["6845", "Alecrim"],
      ["6847", "Gardenia"],
      ["6848", "Rosas e Peônia"],
      ["7193", "Patchouli e Musk Imperial"],
      ["6846", "Flor de Lótus e Musgos do Vale"]
    ]
  );
  assert.deepEqual(
    ["4017", "6768", "6767"].map((id) => [byId(id).name, byId(id).specification]),
    [
      ["Aromatizador Elétrico Cerâmica com botão", "Tensão 110–220 V · potência 5 W · área 30 m²"],
      ["Aromatizador Elétrico Polímero com botão", "Tensão 110–220 V · potência 5 W · área 30 m²"],
      ["Aromatizador Cerâmica sem botão", "Tensão 110–220 V · potência 5 W · área 30 m²"]
    ]
  );
  assert.equal(byId("6140").fragrance, "Carro Novo");
  assert.equal(byId("6140").volume, "30 g · caixa com 10 un.");
  assert.equal(byId("6139").fragrance, "Baunilha do Tahiti");
  assert.equal(byId("6139").volume, "30 g · caixa com 10 un.");
  assert.equal(byId("7151").name, "Açúcar Esfoliante em Óleo");
  assert.equal(byId("6840").name, "Hidratante Corporal");
});

test("keeps the catalog audit report aligned with corrected products and open combo questions", () => {
  const report = readFileSync(
    new URL("../referencias/conferencia-catalogo.csv", import.meta.url),
    "utf8"
  )
    .replace(/^\uFEFF/, "")
    .trim()
    .split(/\r?\n/);

  assert.equal(report.length - 1, 191);
  assert.equal(report.filter((row) => row.includes(";6507;")).length, 2);
  assert.match(
    report.find((row) => row.startsWith("10;7140;")),
    /Aparelho Difusor Elétrico Branco;Modelo GAS-501F/
  );
  assert.match(
    report.find((row) => row.startsWith("37;6140;")),
    /Sachê Perfumado;Carro Novo · 30 g · caixa com 10 un\./
  );
  assert.match(
    report.find((row) => row.startsWith("39;7151;")),
    /Açúcar Esfoliante em Óleo/
  );
  assert.equal(report.filter((row) => row.includes("Pendente:")).length, 5);
});

test("keeps catalog combos and their confirmed components explicit", async () => {
  const { products } = await import("../js/products.js");
  const combos = products.filter((product) => product.isCombo);

  assert.deepEqual(
    combos.map((product) => product.code).sort(),
    ["4540", "6728", "6766", "6914", "6939", "7232"]
  );
  assert.ok(combos.every((product) => product.category === "Combos"));
  assert.ok(combos.every((product) => product.composition && existsSync(product.image)));
  assert.deepEqual(
    products.find((product) => product.code === "7232").componentIds,
    ["7149", "5024", "7150"]
  );
  const almondKit = products.find((product) => product.code === "7232");
  assert.equal(
    almondKit.priceCents,
    almondKit.componentIds.reduce(
      (total, id) => total + products.find((product) => product.id === id).priceCents,
      0
    )
  );
  assert.ok(
    almondKit.componentIds.every((id) => products.some((product) => product.id === id))
  );
  assert.equal(
    almondKit.name,
    "Kit Amêndoas Doces e Flor de Jasmim"
  );
});

test("keeps the supplied store address and WhatsApp number without enabling sending", async () => {
  const { config } = await import("../js/config.js");

  assert.equal(config.storeAddress, "Rua Luiz Boito Piazza, nº 3467");
  assert.equal(config.storePhone, "48996495663");
  assert.equal(config.whatsappNumber, "48996495663");
  assert.equal(config.whatsappEnabled, false);
});

test("keeps every collective page and confirmed individual crop available locally", async () => {
  const { products } = await import("../js/products.js");

  for (const page of new Set(products.map((product) => product.sourcePage))) {
    assert.ok(
      existsSync(`assets/catalog-pages/catalog-page-${String(page).padStart(2, "0")}.jpg`),
      `missing collective image for catalog page ${page}`
    );
  }
  for (const product of products) {
    if (product.image !== "assets/products/placeholder.svg") {
      assert.ok(existsSync(product.image), `missing crop for product ${product.code}`);
    }
  }
});
