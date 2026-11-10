export const CART_STORAGE_KEY = "boutique-aromas-cart-v1";

function getDefaultStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export function createCartStore(products, storage = getDefaultStorage()) {
  const productById = new Map(products.map((product) => [product.id, product]));
  const quantities = new Map();
  let storageMessage = storage
    ? ""
    : "O armazenamento local não está disponível; o carrinho ficará nesta sessão.";

  function persist() {
    if (!storage) return;

    try {
      storage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(
          [...quantities].map(([id, quantity]) => ({ id, quantity }))
        )
      );
    } catch {
      storage = null;
      storageMessage =
        "Não foi possível salvar o carrinho neste navegador; ele ficará nesta sessão.";
    }
  }

  function restore() {
    if (!storage) return;

    try {
      const saved = storage.getItem(CART_STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) {
        storageMessage = "O carrinho salvo estava inválido e foi ignorado.";
        storage.removeItem(CART_STORAGE_KEY);
        return;
      }

      for (const entry of parsed) {
        if (
          !entry ||
          typeof entry.id !== "string" ||
          !Number.isInteger(entry.quantity) ||
          entry.quantity < 1 ||
          entry.quantity > 99 ||
          !productById.has(entry.id)
        ) {
          continue;
        }

        quantities.set(entry.id, entry.quantity);
      }
    } catch {
      quantities.clear();
      storageMessage = "O carrinho salvo estava inválido e foi ignorado.";
      try {
        storage.removeItem(CART_STORAGE_KEY);
      } catch {
        storage = null;
      }
    }
  }

  restore();

  return {
    add(id, amount = 1) {
      if (!productById.has(id) || !Number.isInteger(amount) || amount < 1) {
        return false;
      }
      const current = quantities.get(id) ?? 0;
      if (current + amount > 99) return false;
      quantities.set(id, current + amount);
      persist();
      return true;
    },
    addMany(items) {
      if (!Array.isArray(items) || items.length === 0) return false;

      const additions = new Map();
      for (const item of items) {
        if (
          !item ||
          typeof item.id !== "string" ||
          !productById.has(item.id) ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1 ||
          item.quantity > 99
        ) {
          return false;
        }
        additions.set(item.id, (additions.get(item.id) ?? 0) + item.quantity);
      }

      for (const [id, quantity] of additions) {
        if ((quantities.get(id) ?? 0) + quantity > 99) return false;
      }
      for (const [id, quantity] of additions) {
        quantities.set(id, (quantities.get(id) ?? 0) + quantity);
      }
      persist();
      return true;
    },
    setQuantity(id, quantity) {
      if (
        !productById.has(id) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 99
      ) {
        return false;
      }
      quantities.set(id, quantity);
      persist();
      return true;
    },
    remove(id) {
      const removed = quantities.delete(id);
      if (removed) persist();
      return removed;
    },
    getItems() {
      return [...quantities].map(([id, quantity]) => {
        const product = productById.get(id);
        return {
          ...product,
          quantity,
          lineSubtotalCents: product.priceCents * quantity
        };
      });
    },
    get totalUnits() {
      return [...quantities.values()].reduce((total, quantity) => total + quantity, 0);
    },
    get subtotalCents() {
      return this.getItems().reduce(
        (total, item) => total + item.lineSubtotalCents,
        0
      );
    },
    get storageMessage() {
      return storageMessage;
    }
  };
}
