import test from "node:test";
import assert from "node:assert/strict";
import { products } from "../js/products.js";
import { groupCatalogOffers } from "../js/catalog.js";

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

test("distinguishes lookalike products by refill, aroma or variant", () => {
  const identities = products.map(p => [p.name, p.fragrance, p.volume, p.family].join("|"));
  assert.equal(new Set(identities).size, products.length);
  assert.equal(products.find(p => p.code === "6401").category, "Refis");
  assert.equal(products.find(p => p.code === "7248").fragrance, "Ocean");
  assert.ok(!products.some(p => p.family === "Hydra" && p.category === "Aromatização"));
});
