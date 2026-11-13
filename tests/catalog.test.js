import {officialProductUpdates} from "../js/official-catalog.js";
import test from "node:test";
import assert from "node:assert/strict";
import { products } from "../js/products.js";
import { getCatalogDepartment, groupCatalogCollections, groupCatalogOffers, groupProductsByCategory } from "../js/catalog.js";
import { referencePricesById } from "../js/reference-prices.js";
import { getProductCardPhoto } from "../js/product-card-media.js";
import { existsSync } from "node:fs";
import { auditedProductPhotos } from "../js/audited-product-photos.js";

test("keeps every SKU once in its category and preserves the selected product order", () => {
  const sorted = [...products].sort((a, b) => b.priceCents - a.priceCents);
  const groups = groupProductsByCategory(sorted);
  assert.equal(groups.flatMap(([, items]) => items).length, 236);
  assert.equal(new Set(groups.flatMap(([, items]) => items.map(p => p.id))).size, 236);
  for (const [category, items] of groups) {
    assert.ok(items.every(p => p.category === category));
    assert.deepEqual(items, sorted.filter(p => p.category === category));
  }
  assert.deepEqual(groupProductsByCategory([]), []);
});

test("unit cards use identified individual photos and leave collective-only items pending", () => {
  assert.equal(getProductCardPhoto(products.find(p => p.id === "7150")).src, "assets/official/product-7150.png");
  assert.equal(getProductCardPhoto(products.find(p => p.id === "5387")).src, "assets/official/product-5387.png");
  assert.equal(getProductCardPhoto(products.find(p => p.id === "7134")), null);
  for (const product of products) {
    const photo = getProductCardPhoto(product);
    if (photo) {
      assert.ok(existsSync(photo.src));
      assert.ok(!photo.src.startsWith("assets/catalog-pages/"));
    }
  }
});

test("reviewed photos preserve complete bounds, provenance and the identity of variants", () => {
  for (const [id, photo] of Object.entries(auditedProductPhotos)) {
    assert.ok(products.some(p => p.id === id), `unknown photo SKU ${id}`);
    assert.ok(existsSync(photo.src), `missing photo for ${id}`);
    const [left, top, right, bottom] = photo.bounds;
    assert.ok(left >= 0 && top >= 0 && right > left && bottom > top);
    assert.ok(right <= photo.width && bottom <= photo.height, `invalid bounds for ${id}`);
    assert.ok(photo.sourceUrl && photo.verification && photo.reviewedAt);
  }
  assert.notDeepEqual(auditedProductPhotos["6916"].bounds, auditedProductPhotos["6918"].bounds);
  assert.notDeepEqual(auditedProductPhotos["7140"].bounds, auditedProductPhotos["7141"].bounds);
  assert.equal(auditedProductPhotos["6914"].sourceKind, "official-site");
  assert.match(auditedProductPhotos["6748"].verification, /SKU 6748/);
});

test("applies reviewed references without confusing package sizes or kit composition", () => {
  assert.equal(products.find(p => p.id === "6513").priceCents, 15790);
  assert.equal(products.find(p => p.id === "7150").priceCents, 9890);
  assert.equal(products.find(p => p.id === "5024").priceCents, 8490);
  assert.equal(products.find(p => p.id === "6836").priceCents, 34990);
  for (const id of Object.keys(referencePricesById)) {
    const product = products.find(p => p.id === id);
    assert.ok(product, `unknown reference product ${id}`);
    assert.equal(product.priceCents, (officialProductUpdates[id] ?? referencePricesById[id]).priceCents);
    assert.ok(product.priceReference.sourceUrl.startsWith("https://www.boutiquedearomas.com.br/"));
  }
  // Official listings use 240 ml for these items; our PDF lists 220/250 ml.
  for (const id of ["6589", "6342"]) {
    assert.equal(products.find(p => p.id === id).priceReference, null);
  }
  const kit = products.find(p => p.id === "7232");
  assert.equal(kit.priceCents, 29370);
  assert.equal(kit.priceReference, null);
  assert.equal(kit.priceBasis, "component-sum");
  assert.notEqual(kit.priceCents, 26990); // Official kit has a 200 ml lotion.
});

test("includes home fragrance and personal care categories in their navigation destinations", () => {
  const homeCategories = ["Difusores", "Sprays", "Velas", "Essências", "Aromatizadores elétricos", "Sachês perfumados", "Aromatização profissional"];
  const careCategories = ["Banho e corpo", "Sabonetes", "Perfumaria", "Cuidados faciais"];
  for (const product of products) {
    if (homeCategories.includes(product.category)) assert.equal(getCatalogDepartment(product), "perfumacao-de-ambientes", product.name);
    if (careCategories.includes(product.category)) assert.equal(getCatalogDepartment(product), "autocuidado", product.name);
  }
  assert.equal(getCatalogDepartment({ category: "Refis", name: "Refil Sabonete Líquido" }), "autocuidado");
  assert.equal(getCatalogDepartment({ category: "Refis", name: "Refil Difusor" }), "perfumacao-de-ambientes");
  assert.equal(getCatalogDepartment({ category: "Embalagens", name: "Sacola" }), "outras-colecoes");
});

test("shows each collective page once while preserving every product and combo", () => {
  const groups = groupCatalogOffers(products);
  const pageGroups = groups.filter(([product]) => !product.isCombo);
  assert.equal(new Set(pageGroups.map(([product]) => product.sourcePage)).size, pageGroups.length);
  assert.deepEqual(groups.flat().map(p => p.id).sort(), products.map(p => p.id).sort());
  for (const combo of products.filter(p => p.isCombo)) {
    assert.deepEqual(groups.find(group => group.includes(combo)), [combo]);
  }
});

test("keeps category results complete without repeated collective pages", () => {
  for (const category of new Set(products.map(p => p.category))) {
    const matching = products.filter(p => p.category === category);
    const groups = groupCatalogOffers(matching);
    assert.deepEqual(groups.flat().map(p => p.id).sort(), matching.map(p => p.id).sort());
    const pages = groups.filter(([p]) => !p.isCombo).map(([p]) => p.sourcePage);
    assert.equal(new Set(pages).size, pages.length);
  }
});

test("groups repeated collection pages together without merging unrelated collections or kits", () => {
  const collections = groupCatalogCollections(products);
  const novita = collections.find((collection) => collection.family === "Novità");
  const casaAlegre = collections.find((collection) => collection.family === "Casa Alegre");

  assert.ok(novita);
  assert.ok(casaAlegre);
  assert.ok(novita.pages.length > 1);
  assert.ok(casaAlegre.pages.length > 1);
  assert.ok(collections.filter((collection) => collection.isCombo).every((collection) => collection.pages.length === 1));
  assert.deepEqual(
    collections.flatMap((collection) => collection.pages.flat()).map(({ id }) => id).sort(),
    products.map(({ id }) => id).sort()
  );
});

test("distinguishes lookalike products by refill, aroma or variant", () => {
  const identities = products.map(p => [p.name, p.fragrance, p.volume, p.family].join("|"));
  assert.equal(new Set(identities).size, products.length);
  assert.equal(products.find(p => p.code === "6401").category, "Refis");
  assert.equal(products.find(p => p.code === "7248").fragrance, "Ocean");
  assert.ok(!products.some(p => p.family === "Hydra" && p.category === "Aromatização"));
});
