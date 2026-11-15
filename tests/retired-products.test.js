import test from "node:test";
import assert from "node:assert/strict";
import { products, catalogSourceProducts } from "../js/products.js";
import { retiredProductCodes } from "../js/retired-products.js";
import { CART_STORAGE_KEY, createCartStore } from "../js/cart.js";
import { groupProductsByCategory } from "../js/catalog.js";
import { buildOrderSummary } from "../js/checkout.js";

const withdrawnCodes = "6744 6698 6525 6342 5253 6169 6172 4838 4836 4837 5252 6400 4818 6050 6054 2912 6401 2913 4534 4537 4540 6403 5389 5395 6405 5387 5397 6406 5398 5388 6113 6114 4071 6988 6986 6987 6900 6899 6766 6939 5092 6414 6413 5072".split(" ");
const withdrawnIds = [
  "site-difusor-de-aromas-desejos-sucesso-mandarina-fresca-240ml",
  "site-agua-perfumada-para-roupas-flowers-flor-de-cerejeira-500ml"
];

test("removes the requested products and corresponding uncoded cards from the storefront", () => {
  assert.deepEqual([...retiredProductCodes].sort(), [...withdrawnCodes].sort());
  assert.equal(products.length, 195);
  assert.deepEqual(products, catalogSourceProducts.filter(product =>
    !withdrawnCodes.includes(product.code) && !withdrawnIds.includes(product.id)));
  const grouped = groupProductsByCategory(products).flatMap(([, items]) => items);
  assert.equal(grouped.length, 195);
  assert.ok(grouped.every(product => !withdrawnCodes.includes(product.code)));
  for (const family of ["Wedding", "Pêssego e Flores Brancas", "Velvet Rosé"]) {
    assert.ok(!products.some(product => product.family === family));
  }
});

test("ignores withdrawn products saved in an old cart and excludes them from the order", () => {
  const saved = JSON.stringify([
    { id: "6698", quantity: 2 },
    { id: "4540", quantity: 1 },
    { id: withdrawnIds[0], quantity: 1 },
    { id: "7109", quantity: 1 }
  ]);
  const storage = { getItem: key => key === CART_STORAGE_KEY ? saved : null, setItem() {} };
  const cart = createCartStore(products, storage);
  assert.deepEqual(cart.getItems().map(item => item.id), ["7109"]);
  assert.equal(cart.add("6698"), false);
  assert.equal(cart.add(withdrawnIds[0]), false);
  const summary = buildOrderSummary({
    storeName: "Boutique de Aromas", items: cart.getItems(),
    customer: { name: "Cliente", phone: "11999991234", street: "Rua A", number: "1", neighborhood: "Centro", city: "São Paulo", state: "SP", postalCode: "01001000" },
    subtotalCents: cart.subtotalCents, shippingLabel: "A combinar"
  });
  assert.doesNotMatch(summary, /6698|4540|Magnólia|Wedding|Sucesso/);
});
