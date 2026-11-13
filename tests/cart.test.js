import test from "node:test";
import assert from "node:assert/strict";
import { CART_STORAGE_KEY, createCartStore } from "../js/cart.js";
import { products } from "../js/products.js";

class MemoryStorage {
  values = new Map();

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, value);
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

test("keeps different SKUs separate and calculates the specified subtotal", () => {
  const store = createCartStore(products, new MemoryStorage());

  assert.equal(store.add("7109", 2), true);
  assert.equal(store.add("7110"), true);
  assert.equal(store.totalUnits, 3);
  assert.equal(store.subtotalCents, 83468);
  assert.deepEqual(
    store.getItems().map(({ code, quantity }) => [code, quantity]),
    [["7109", 2], ["7110", 1]]
  );
});

test("clears all cart items and keeps the cart empty after reload", () => {
  const storage = new MemoryStorage();
  const store = createCartStore(products, storage);
  store.add("7109", 2);
  store.add("7110");

  store.clear();

  assert.deepEqual(store.getItems(), []);
  assert.equal(store.totalUnits, 0);
  assert.equal(store.subtotalCents, 0);
  assert.equal(createCartStore(products, storage).totalUnits, 0);
  assert.equal(store.add("7110"), true);
  assert.equal(store.totalUnits, 1);
});

test("restores only valid IDs and quantities from storage", () => {
  const storage = new MemoryStorage();
  storage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify([
      { id: "7109", quantity: 2 },
      { id: "missing", quantity: 4 },
      { id: "7110", quantity: 0 },
      { id: "7110", quantity: 1.5 }
    ])
  );

  const store = createCartStore(products, storage);
  assert.equal(store.totalUnits, 2);
  assert.equal(store.subtotalCents, 63778);
});

test("ignores corrupted JSON without breaking the cart", () => {
  const storage = new MemoryStorage();
  storage.setItem(CART_STORAGE_KEY, "{not-json");

  const store = createCartStore(products, storage);
  assert.equal(store.totalUnits, 0);
  assert.match(store.storageMessage, /inválido/i);
  assert.equal(storage.getItem(CART_STORAGE_KEY), null);
});

test("enforces the quantity limit and allows explicit removal", () => {
  const store = createCartStore(products, new MemoryStorage());
  store.add("7109", 99);

  assert.equal(store.getItems()[0].quantity, 99);
  assert.equal(store.add("7109"), false);
  assert.equal(store.setQuantity("7109", 100), false);
  assert.equal(store.remove("7109"), true);
  assert.equal(store.totalUnits, 0);
});

test("adding the same product increases its existing quantity", () => {
  const store = createCartStore(products, new MemoryStorage());

  assert.equal(store.add("7109", 2), true);
  assert.equal(store.add("7109", 3), true);
  assert.equal(store.getItems()[0].quantity, 5);
  assert.equal(store.add("7109", 95), false);
  assert.equal(store.getItems()[0].quantity, 5);
});

test("adds a combo as one cart SKU when no complete component SKU set exists", () => {
  const combo = products.find((product) => product.code === "6728");
  const store = createCartStore(products, new MemoryStorage());

  assert.equal(combo.isCombo, true);
  assert.equal(store.add(combo.id), true);
  assert.deepEqual(
    store.getItems().map(({ id, quantity }) => ({ id, quantity })),
    [{ id: combo.id, quantity: 1 }]
  );
});

test("adds a complete combo once at its combo price without charging its components", () => {
  const combo = products.find((product) => product.code === "7232");
  const store = createCartStore(products, new MemoryStorage());

  assert.equal(combo.componentIds.length, 3);
  assert.equal(store.add(combo.id), true);
  assert.deepEqual(
    store.getItems().map(({ id, quantity }) => ({ id, quantity })),
    [{ id: combo.id, quantity: 1 }]
  );
  assert.equal(store.subtotalCents, combo.priceCents);
  assert.equal(store.subtotalCents, 29370);
});

test("adds a multi-product offer atomically and combines duplicate SKUs", () => {
  const store = createCartStore(products, new MemoryStorage());

  assert.equal(
    store.addMany([
      { id: "7109", quantity: 1 },
      { id: "7110", quantity: 1 },
      { id: "7109", quantity: 2 }
    ]),
    true
  );
  assert.deepEqual(
    store.getItems().map(({ code, quantity }) => [code, quantity]),
    [["7109", 3], ["7110", 1]]
  );
  assert.equal(
    store.addMany([
      { id: "7109", quantity: 97 },
      { id: "7110", quantity: 1 }
    ]),
    false
  );
  assert.deepEqual(
    store.getItems().map(({ code, quantity }) => [code, quantity]),
    [["7109", 3], ["7110", 1]]
  );
});

test("keeps the cart functional when browser storage is unavailable", () => {
  const store = createCartStore(products, null);

  assert.equal(store.add("7109"), true);
  assert.equal(store.totalUnits, 1);
  assert.match(store.storageMessage, /não está disponível/i);
});
