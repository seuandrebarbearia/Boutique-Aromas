import { config } from "./config.js";
import { createCartStore } from "./cart.js";
import { buildOrderSummary, formatBRL, validateAddress } from "./checkout.js";
import { products } from "./products.js";
import { groupCatalogOffers } from "./catalog.js";

const cart = createCartStore(products);
const productById = new Map(products.map((product) => [product.id, product]));
let selectedFragrance = "";
let checkoutCustomer = null;

const elements = {
  search: document.querySelector("#search-input"),
  categoryFilter: document.querySelector("#category-filter"),
  fragranceFilter: document.querySelector("#fragrance-filter"),
  sortSelect: document.querySelector("#sort-select"),
  catalogSections: document.querySelector("#catalog-sections"),
  emptyState: document.querySelector("#empty-state"),
  resultsCount: document.querySelector("#results-count"),
  cartCount: document.querySelector("#cart-count"),
  mobileCartCount: document.querySelector("#mobile-cart-count"),
  mobileCartSubtotal: document.querySelector("#mobile-cart-subtotal"),
  mobileCartButton: document.querySelector("#mobile-cart-button"),
  cartDialog: document.querySelector("#cart-dialog"),
  cartItems: document.querySelector("#cart-items"),
  cartEmpty: document.querySelector("#cart-empty"),
  cartSubtotal: document.querySelector("#cart-subtotal"),
  cartStorageNotice: document.querySelector("#cart-storage-notice"),
  reviewButton: document.querySelector("#review-order-button"),
  liveStatus: document.querySelector("#cart-live-status"),
  productDialog: document.querySelector("#product-dialog"),
  productDetail: document.querySelector("#product-detail-content"),
  collectivePhotoDialog: document.querySelector("#collective-photo-dialog"),
  collectivePhotoLarge: document.querySelector("#collective-photo-large"),
  collectivePhotoCaption: document.querySelector("#collective-photo-caption"),
  checkoutDialog: document.querySelector("#checkout-dialog"),
  addressForm: document.querySelector("#address-form"),
  addressFormStatus: document.querySelector("#address-form-status"),
  orderReview: document.querySelector("#order-review"),
  reviewContent: document.querySelector("#review-content"),
  summaryStatus: document.querySelector("#summary-status"),
  summaryText: document.querySelector("#order-summary-text"),
  summaryActions: document.querySelector("#summary-actions")
};

const dialogOpeners = new WeakMap();
const PLACEHOLDER_IMAGE = "assets/products/placeholder.svg";

function createElement(tagName, className = "", text = "") {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function createButton(text, className, onClick, label = "") {
  const button = createElement("button", className, text);
  button.type = "button";
  if (label) button.setAttribute("aria-label", label);
  button.addEventListener("click", onClick);
  return button;
}

function setProductImage(image, path, productName = "") {
  image.alt =
    path === PLACEHOLDER_IMAGE
      ? `Imagem ilustrativa para ${productName}`
      : productName;
  image.src = path || PLACEHOLDER_IMAGE;
  image.addEventListener(
    "error",
    () => {
      if (!image.src.endsWith(PLACEHOLDER_IMAGE)) image.src = PLACEHOLDER_IMAGE;
    },
    { once: true }
  );
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function openDialog(dialog, opener, focusSelector = "button, input, select, textarea") {
  if (!dialog.open) dialog.showModal();
  dialogOpeners.set(dialog, opener);
  const target = focusSelector ? dialog.querySelector(focusSelector) : null;
  target?.focus();
}

function announceCart(message) {
  elements.liveStatus.textContent = "";
  window.requestAnimationFrame(() => {
    elements.liveStatus.textContent = message;
  });
}

function updateCartDisplays() {
  const itemCount = cart.totalUnits;
  const subtotal = formatBRL(cart.subtotalCents);
  elements.cartCount.textContent = String(itemCount);
  elements.mobileCartCount.textContent = String(itemCount);
  elements.mobileCartSubtotal.textContent = subtotal;
  elements.reviewButton.disabled = itemCount === 0;
  elements.mobileCartButton.disabled = itemCount === 0;
}

function renderCategoryFilters() {
  const categories = [...new Set(products.map((product) => product.category))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  for (const category of categories) {
    const option = createElement("option", "", category);
    option.value = category;
    elements.categoryFilter.append(option);
  }
}

function renderFragranceOptions() {
  const fragrances = [...new Set(products.map((product) => product.fragrance))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  for (const fragrance of fragrances) {
    const option = createElement("option", "", fragrance);
    option.value = fragrance;
    elements.fragranceFilter.append(option);
  }
}

function getVisibleProducts() {
  const query = normalizeText(elements.search.value);
  const matching = products.filter((product) => {
    const matchesCategory =
      !elements.categoryFilter.value || product.category === elements.categoryFilter.value;
    const matchesFragrance =
      !selectedFragrance || product.fragrance === selectedFragrance;
    const searchable = normalizeText(
      [
        product.name,
        product.code,
        product.fragrance,
        product.family,
        product.category
      ].join(" ")
    );
    return matchesCategory && matchesFragrance && (!query || searchable.includes(query));
  });

  const sortBy = elements.sortSelect.value;
  matching.sort((a, b) => {
    if (sortBy === "price-asc") return a.priceCents - b.priceCents;
    if (sortBy === "price-desc") return b.priceCents - a.priceCents;
    return a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
  });

  return matching;
}

function slugify(value) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getOfferItemName(product) {
  if (product.family === "Essências") return product.fragrance || product.name;
  if (product.isCombo) return product.name;
  const variant = product.fragrance || (product.family !== "Outros" ? product.family : "");
  return variant && variant !== product.name
    ? `${product.name} · ${variant}`
    : product.name;
}

function getOfferItemSpecification(product) {
  if (product.isCombo) {
    return [product.composition, `Cód. ${product.code}`].filter(Boolean).join(" · ");
  }
  if (product.family === "Essências") {
    return `Essência para aromatizador elétrico · ${product.volume}`;
  }
  return [product.specification || product.volume, product.code ? `Cód. ${product.code}` : ""]
    .filter(Boolean)
    .join(" · ");
}

function createOfferImagePanel(imagePath, imageAlt, caption, zoomLabel, openerLabel) {
  const imagePanel = createElement("div", "collective-image-panel");
  const figure = createElement("figure", "collective-figure");
  const imageWrap = createElement("div", "collective-image-wrap");
  const image = createElement("img", "collective-image");
  setProductImage(image, imagePath, imageAlt);
  image.alt = imageAlt;
  image.loading = "lazy";
  const photoButton = createButton(
    "",
    "collective-photo-button",
    (event) => openCollectivePhoto(image, zoomLabel, event.currentTarget),
    `Ampliar ${openerLabel}`
  );
  photoButton.append(image);
  imageWrap.append(photoButton);
  figure.append(imageWrap);
  figure.append(createElement("figcaption", "collective-caption", caption));
  imagePanel.append(figure);
  return imagePanel;
}

function createIndividualOption(product, offerId) {
  const card = createElement("article", "individual-option");
  card.id = `individual-option-${product.id}-${offerId}`;
  card.dataset.productId = product.id;
  const title = createButton(
    getOfferItemName(product),
    `individual-option-name${product.family === "Essências" ? " essence-aroma-name" : ""}`,
    (event) => openProductDetails(product, event.currentTarget)
  );
  const titleLine = createElement("div", "individual-option-title-line");
  if (product.family !== "Essências") {
    titleLine.append(
      createElement("span", "individual-option-number", `Nº ${product.presentationNumber}`)
    );
  }
  titleLine.append(title);
  card.append(titleLine);
  card.append(
    createElement("p", "individual-option-specification", getOfferItemSpecification(product))
  );

  const controls = createElement("div", "individual-option-controls");
  const quantityControls = createElement("div", "individual-quantity-controls");
  const quantityInput = createElement("input", "quantity-input individual-quantity-input");
  quantityInput.type = "number";
  quantityInput.min = "1";
  quantityInput.max = "99";
  quantityInput.step = "1";
  quantityInput.value = "1";
  quantityInput.inputMode = "numeric";
  quantityInput.setAttribute("aria-label", `Quantidade de ${getOfferItemName(product)}`);
  const decrement = createButton(
    "−",
    "individual-quantity-button",
    () => {
      quantityInput.value = String(Math.max(1, Number(quantityInput.value || 1) - 1));
      quantityInput.dispatchEvent(new Event("input", { bubbles: true }));
    },
    `Diminuir quantidade de ${getOfferItemName(product)}`
  );
  const increment = createButton(
    "+",
    "individual-quantity-button",
    () => {
      quantityInput.value = String(Math.min(99, Number(quantityInput.value || 1) + 1));
      quantityInput.dispatchEvent(new Event("input", { bubbles: true }));
    },
    `Aumentar quantidade de ${getOfferItemName(product)}`
  );
  quantityInput.addEventListener("input", () => quantityInput.setCustomValidity(""));
  quantityControls.append(decrement, quantityInput, increment);

  const addButton = createButton(
    "Adicionar ao carrinho",
    "button button-primary button-small",
    (event) => {
      const quantity = Number(quantityInput.value);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        quantityInput.setCustomValidity("Informe uma quantidade inteira entre 1 e 99.");
        quantityInput.reportValidity();
        return;
      }
      quantityInput.setCustomValidity("");
      addProduct(product, quantity, event.currentTarget);
    }
  );
  controls.append(
    createElement("strong", "individual-option-price", formatBRL(product.priceCents)),
    quantityControls,
    addButton
  );
  card.append(controls);
  return card;
}

function appendIndividualOptions(controls, groupProducts, offerId) {
  const optionsId = `individual-options-${offerId}`;
  const toggle = createButton(
    "Comprar unidades",
    "button button-outline button-full",
    (event) => {
      const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
      event.currentTarget.setAttribute("aria-expanded", String(!expanded));
      event.currentTarget.textContent = expanded ? "Comprar unidades" : "Fechar unidades";
      document.getElementById(optionsId).hidden = expanded;
    }
  );
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", optionsId);
  controls.append(toggle);
  const options = createElement("div", "individual-options");
  options.id = optionsId;
  options.hidden = true;
  options.setAttribute("aria-label", "Opções de compra individual");
  for (const product of groupProducts) {
    options.append(createIndividualOption(product, offerId));
  }
  controls.append(options);
}

function createFamilyOfferControls(groupProducts, offerId) {
  if (groupProducts.length === 1) {
    const controls = createElement("div", "family-offer-controls");
    const [product] = groupProducts;
    controls.append(
      createButton(
        "Comprar unidade",
        "button button-primary button-full",
        (event) => addProduct(product, 1, event.currentTarget)
      )
    );
    return controls;
  }

  const controls = createElement("div", "family-offer-controls");
  controls.append(
    createButton(
      "Comprar todos",
      "button button-primary button-full",
      (event) =>
        addProducts(
          groupProducts.map((product) => ({ id: product.id, quantity: 1 })),
          groupProducts,
          event.currentTarget
        )
    )
  );
  appendIndividualOptions(controls, groupProducts, offerId);
  return controls;
}

function createComboOfferControls(combo, componentProducts, offerId) {
  const controls = createElement("div", "family-offer-controls combo-offer-controls");
  controls.append(
    createButton(
      "Comprar combo",
      "button button-primary button-full",
      (event) => addProduct(combo, 1, event.currentTarget)
    )
  );
  if (componentProducts.length > 0) {
    appendIndividualOptions(controls, componentProducts, offerId);
  }
  return controls;
}

function createCatalogSpread(family, page, category, groupProducts, assignedFamilies) {
  const spread = createElement("section", "catalog-spread");
  const familyId = `family-${slugify(family)}`;
  if (!assignedFamilies.has(family)) {
    spread.id = familyId;
    assignedFamilies.add(family);
  }

  const heading = createElement("h3", "family-heading", family);
  const offerId = slugify(`${family}-${page}-${category}`);
  const imagePanel = createOfferImagePanel(
    `assets/catalog-pages/catalog-page-${String(page).padStart(2, "0")}.jpg`,
    `Foto coletiva original dos produtos na página ${page} do catálogo`,
    `Foto coletiva · página ${page} do catálogo`,
    `foto coletiva da família ${family}`,
    `foto coletiva da família ${family}, página ${page}`
  );
  imagePanel.append(createFamilyOfferControls(groupProducts, offerId));
  spread.append(heading, imagePanel);
  return spread;
}

function createComboPresentation(product) {
  const spread = createElement("section", "catalog-spread combo-presentation");
  spread.id = `product-${product.id}`;
  const heading = createElement("h3", "family-heading", product.name);
  const offerId = `combo-${product.id}`;
  const components = product.componentIds?.map((id) => {
    const component = productById.get(id);
    if (!component) {
      throw new Error(`Missing component ${id} for combo ${product.code}.`);
    }
    return component;
  });
  const imagePanel = createOfferImagePanel(
    product.image,
    product.name,
    product.imageKind === "collective"
      ? `Foto coletiva da linha ${product.family}. Este combo inclui esponja e espuma de limpeza de 50 ml; os demais produtos da foto são vendidos separadamente.`
      : `Foto do conjunto · ${product.name} · Cód. ${product.code}`,
    `imagem do conjunto ${product.name}`,
    `imagem do conjunto ${product.name}`
  );
  const comboPrice = createElement("aside", "combo-offer-badge");
  comboPrice.setAttribute("aria-label", `COMBO — ${formatBRL(product.priceCents)}`);
  comboPrice.append(
    createElement("span", "combo-offer-label", "COMBO —"),
    createElement("strong", "combo-offer-price", formatBRL(product.priceCents))
  );
  const controls = createComboOfferControls(product, components ?? [], offerId);
  spread.append(
    heading,
    imagePanel,
    comboPrice,
    controls
  );
  return spread;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  const fragment = document.createDocumentFragment();
  const category = elements.categoryFilter.value;
  const categorySection = createElement("section", "catalog-category");
  if (category) {
    categorySection.id = `category-${slugify(category)}`;
    categorySection.append(createElement("h2", "category-heading", category));
  }
  const assignedFamilies = new Set();
  for (const groupProducts of groupCatalogOffers(visibleProducts)) {
    const [product] = groupProducts;
    const familyHeading = [...new Set(groupProducts.map(item => item.family))].join(" · ");
    categorySection.append(
      product.isCombo
        ? createComboPresentation(product)
        : createCatalogSpread(
            familyHeading,
            product.sourcePage,
            category || "todas",
            groupProducts,
            assignedFamilies
          )
    );
  }
  categorySection.hidden = visibleProducts.length === 0;
  fragment.append(categorySection);

  elements.catalogSections.replaceChildren(fragment);
  elements.emptyState.hidden = visibleProducts.length > 0;
  elements.resultsCount.textContent =
    visibleProducts.length === 1
      ? "1 produto"
      : `${visibleProducts.length} produtos`;
}

function clearCatalogFilters() {
  elements.search.value = "";
  elements.categoryFilter.value = "";
  elements.fragranceFilter.value = "";
  elements.sortSelect.value = "name";
  selectedFragrance = "";
}

function renderCart() {
  const items = cart.getItems();
  const fragment = document.createDocumentFragment();

  for (const item of items) {
    const row = createElement("article", "cart-line");
    row.id = `cart-item-${item.id}`;
    row.dataset.productId = item.id;
    const details = createElement("div", "cart-line-details");
    details.append(createElement("h3", "cart-line-title", getOfferItemName(item)));
    details.append(
      createElement(
        "p",
        "cart-line-meta",
        [
          item.isCombo
            ? item.composition
            : item.family === "Essências"
              ? ""
              : item.fragrance,
          item.isCombo ? "" : item.volume,
          `Cód. ${item.code}`
        ]
          .filter(Boolean)
          .join(" · ")
      )
    );
    details.append(
      createElement("strong", "cart-line-subtotal", formatBRL(item.lineSubtotalCents))
    );

    const controls = createElement("div", "cart-line-controls");
    const decrement = createButton(
      "−",
      "quantity-button",
      () => updateQuantity(item.id, item.quantity - 1),
      `Diminuir quantidade de ${getOfferItemName(item)}`
    );
    decrement.disabled = item.quantity <= 1;
    const quantity = createElement("span", "quantity-value", String(item.quantity));
    quantity.setAttribute("aria-label", `${item.quantity} unidades`);
    const increment = createButton(
      "+",
      "quantity-button",
      () => updateQuantity(item.id, item.quantity + 1),
      `Aumentar quantidade de ${getOfferItemName(item)}`
    );
    increment.disabled = item.quantity >= 99;
    const remove = createButton(
      "Remover",
      "text-button remove-button",
      () => removeProduct(item.id),
      `Remover ${getOfferItemName(item)} do carrinho`
    );
    controls.append(decrement, quantity, increment, remove);
    row.append(details, controls);
    fragment.append(row);
  }

  elements.cartItems.replaceChildren(fragment);
  elements.cartItems.hidden = items.length === 0;
  elements.cartEmpty.hidden = items.length > 0;
  elements.cartSubtotal.textContent = formatBRL(cart.subtotalCents);
  elements.cartStorageNotice.textContent = cart.storageMessage;
  elements.cartStorageNotice.hidden = !cart.storageMessage;
  updateCartDisplays();
}

function renderAll() {
  renderProducts();
  renderCart();
}

function addProduct(product, quantity, opener = null) {
  if (!cart.add(product.id, quantity)) {
    announceCart("Não foi possível adicionar essa quantidade ao carrinho.");
    return;
  }
  openCartAfterAdd([product], opener, `${getOfferItemName(product)} adicionado ao carrinho.`);
}

function addProducts(items, addedProducts, opener = null) {
  if (!cart.addMany(items)) {
    announceCart("Não foi possível adicionar todos os itens desta oferta ao carrinho.");
    return;
  }
  openCartAfterAdd(
    addedProducts,
    opener,
    `${addedProducts.length} produtos da oferta adicionados ao carrinho.`
  );
}

function openCartAfterAdd(addedProducts, opener, announcement) {
  renderCart();
  announceCart(`${announcement} ${cart.totalUnits} unidades no total.`);
  const returnFocusTarget = elements.productDialog.open
    ? dialogOpeners.get(elements.productDialog) ?? opener
    : opener;
  if (elements.productDialog.open) elements.productDialog.close();
  openDialog(
    elements.cartDialog,
    returnFocusTarget ?? document.querySelector("#open-cart-button"),
    ".dialog-close"
  );
  window.requestAnimationFrame(() => {
    document.getElementById(`cart-item-${addedProducts[0].id}`)?.scrollIntoView({
      block: "nearest"
    });
  });
}

function updateQuantity(id, quantity) {
  const product = productById.get(id);
  if (!cart.setQuantity(id, quantity)) return;
  renderCart();
  announceCart(`Quantidade de ${getOfferItemName(product)} atualizada para ${quantity}.`);
}

function removeProduct(id) {
  const product = productById.get(id);
  if (!cart.remove(id)) return;
  renderCart();
  announceCart(`${getOfferItemName(product)} removido do carrinho.`);
}

function openProductDetails(product, opener) {
  elements.productDetail.replaceChildren();

  const image = createElement("img", `detail-image${product.imageKind === "collective" ? " detail-image-collective" : ""}`);
  setProductImage(image, product.image, product.name);
  image.width = 640;
  image.height = 480;
  const figure = createElement("figure", "detail-figure");
  if (product.imageKind === "collective") {
    const caption = product.isCombo
      ? "Foto coletiva da linha Hydra. O combo inclui apenas esponja e espuma de limpeza de 50 ml."
      : `Foto coletiva da página ${product.sourcePage}. O item selecionado é ${getOfferItemName(product)}, código ${product.code}; os demais produtos são vendidos separadamente.`;
    image.alt = caption;
    const photoButton = createButton(
      "",
      "detail-photo-button",
      (event) => openCollectivePhoto(image, caption, event.currentTarget),
      "Ampliar foto coletiva do catálogo"
    );
    photoButton.append(image);
    figure.append(photoButton);
    figure.append(createElement("figcaption", "collective-caption", caption));
  } else {
    figure.append(image);
  }

  const content = createElement("div", "detail-copy");
  content.append(
    createElement(
      "p",
      "eyebrow",
      [
        ...(product.family === "Essências" ? [] : [`Nº ${product.presentationNumber}`]),
        product.family || product.category
      ].join(" · ")
    )
  );
  content.append(createElement("h2", "detail-title", getOfferItemName(product)));
  if (product.fragrance) {
    content.append(createElement("p", "detail-fragrance", product.fragrance));
  }
  content.append(
    createElement(
      "p",
      "detail-description",
      product.isCombo ? product.composition : product.description
    )
  );

  const metadata = createElement("dl", "detail-metadata");
  for (const [label, value] of [
    ["Código", product.code],
    ...(!product.isCombo
      ? [[product.specification ? "Especificação" : "Volume", product.specification || product.volume]]
      : []),
    ["Página do catálogo", String(product.sourcePage)]
  ]) {
    metadata.append(createElement("dt", "", label), createElement("dd", "", value));
  }
  content.append(metadata);
  if (product.catalogNote) {
    content.append(createElement("p", "inline-notice", product.catalogNote));
  }
  content.append(createElement("strong", "detail-price", formatBRL(product.priceCents)));

  const quantityControls = createElement("div", "detail-purchase-row");
  const quantityLabel = createElement("label", "detail-quantity-label", "Quantidade");
  const quantityInput = createElement("input", "quantity-input");
  quantityInput.type = "number";
  quantityInput.min = "1";
  quantityInput.max = "99";
  quantityInput.step = "1";
  quantityInput.value = "1";
  quantityInput.inputMode = "numeric";
  quantityLabel.append(quantityInput);
  const addButton = createButton(
    product.isCombo ? "Adicionar combo" : "Adicionar ao carrinho",
    "button button-primary",
    () => {
      const quantity = Number(quantityInput.value);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        quantityInput.setCustomValidity("Escolha uma quantidade de 1 a 99.");
        quantityInput.reportValidity();
        return;
      }
      quantityInput.setCustomValidity("");
      addProduct(product, quantity, addButton);
    }
  );
  quantityInput.addEventListener("input", () => quantityInput.setCustomValidity(""));
  quantityControls.append(quantityLabel, addButton);
  content.append(quantityControls);

  elements.productDetail.append(figure, content);
  openDialog(elements.productDialog, opener, ".dialog-close");
}

function openCollectivePhoto(image, caption, opener) {
  elements.collectivePhotoLarge.src = image.src;
  elements.collectivePhotoLarge.alt = `Imagem ampliada: ${caption}`;
  elements.collectivePhotoCaption.textContent = caption;
  openDialog(elements.collectivePhotoDialog, opener, ".dialog-close");
}

function clearFieldErrors() {
  for (const input of elements.addressForm.querySelectorAll("input, textarea")) {
    input.removeAttribute("aria-invalid");
  }
  for (const error of elements.addressForm.querySelectorAll("[data-error-for]")) {
    error.textContent = "";
  }
}

function fillAddressForm(customer) {
  if (!customer) return;
  for (const [name, value] of Object.entries(customer)) {
    const field = elements.addressForm.elements.namedItem(name);
    if (!field) continue;
    if (field.type === "checkbox") {
      field.checked = value === "Sem número";
    } else {
      field.value = value;
    }
  }
  const numberField = elements.addressForm.elements.namedItem("number");
  numberField.disabled = Boolean(
    elements.addressForm.elements.namedItem("noNumber").checked
  );
}

function updateReview(customer) {
  elements.reviewContent.replaceChildren();

  const customerBlock = createElement("div", "review-block");
  customerBlock.append(createElement("h4", "", "Endereço de entrega"));
  const addressLines = [
    customer.name,
    `Telefone: ${customer.phone}`,
    `${customer.street}, ${customer.number}`,
    customer.complement,
    customer.neighborhood,
    `${customer.city} - ${customer.state}`,
    `CEP ${customer.postalCode}`
  ].filter(Boolean);
  for (const line of addressLines) {
    customerBlock.append(createElement("p", "", line));
  }
  if (customer.notes) {
    customerBlock.append(createElement("p", "", `Observações: ${customer.notes}`));
  }

  const productsBlock = createElement("div", "review-block");
  productsBlock.append(createElement("h4", "", "Produtos"));
  for (const item of cart.getItems()) {
    productsBlock.append(
      createElement(
        "p",
        "",
        `${item.quantity} × ${item.name} · ${item.volume} · ${formatBRL(item.lineSubtotalCents)}`
      )
    );
  }
  productsBlock.append(
    createElement(
      "p",
      "review-subtotal",
      `Subtotal dos produtos: ${formatBRL(cart.subtotalCents)}`
    ),
    createElement("p", "", "Entrega: valor a combinar")
  );
  elements.reviewContent.append(customerBlock, productsBlock);
}

function beginCheckout(opener) {
  if (cart.totalUnits === 0) return;
  const returnFocusTarget =
    dialogOpeners.get(elements.cartDialog) ??
    document.querySelector("#open-cart-button");
  if (elements.cartDialog.open) elements.cartDialog.close();

  clearFieldErrors();
  elements.addressFormStatus.textContent = "";
  elements.addressForm.hidden = false;
  elements.orderReview.hidden = true;
  fillAddressForm(checkoutCustomer);
  openDialog(elements.checkoutDialog, returnFocusTarget ?? opener, '[name="name"]');
}

function showReview(customer) {
  checkoutCustomer = customer;
  elements.addressForm.hidden = true;
  elements.orderReview.hidden = false;
  elements.summaryStatus.textContent = "";
  elements.summaryText.value = "";
  elements.summaryText.hidden = true;
  elements.summaryActions.hidden = true;
  updateReview(customer);
  elements.orderReview.querySelector("#edit-address-button").focus();
}

function containDialogFocus(dialog, event) {
  if (event.key !== "Tab") return;
  const focusable = [...dialog.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((element) => !element.hidden && element.getClientRects().length > 0);
  if (focusable.length === 0) {
    event.preventDefault();
    dialog.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

for (const dialog of document.querySelectorAll("dialog")) {
  dialog.addEventListener("close", () => {
    const opener = dialogOpeners.get(dialog);
    if (opener?.isConnected) opener.focus();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      if (dialog.open) dialog.close();
      return;
    }
    containDialogFocus(dialog, event);
  });
}

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

document.querySelector("#open-cart-button").addEventListener("click", (event) => {
  renderCart();
  openDialog(elements.cartDialog, event.currentTarget, ".dialog-close");
});
elements.mobileCartButton.addEventListener("click", (event) => {
  renderCart();
  openDialog(elements.cartDialog, event.currentTarget, ".dialog-close");
});

document.querySelector("#back-to-catalog-button").addEventListener("click", () => {
  elements.cartDialog.close();
  document.querySelector("#catalogo").scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth"
  });
});

elements.reviewButton.addEventListener("click", (event) => {
  beginCheckout(event.currentTarget);
});

elements.search.addEventListener("input", renderProducts);
elements.categoryFilter.addEventListener("change", renderProducts);
elements.fragranceFilter.addEventListener("change", (event) => {
  selectedFragrance = event.currentTarget.value;
  renderProducts();
});
elements.sortSelect.addEventListener("change", renderProducts);
document.querySelector("#clear-filters-button").addEventListener("click", () => {
  clearCatalogFilters();
  renderProducts();
});

elements.addressForm.elements.namedItem("noNumber").addEventListener("change", (event) => {
  const numberField = elements.addressForm.elements.namedItem("number");
  numberField.disabled = event.currentTarget.checked;
  if (event.currentTarget.checked) {
    numberField.removeAttribute("aria-invalid");
    elements.addressForm.querySelector('[data-error-for="number"]').textContent = "";
  }
});

elements.addressForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearFieldErrors();
  const fields = Object.fromEntries(new FormData(elements.addressForm));
  const { errors, customer } = validateAddress(fields);
  const invalidFields = Object.keys(errors);

  for (const name of invalidFields) {
    const input = elements.addressForm.elements.namedItem(name);
    input?.setAttribute("aria-invalid", "true");
    const message = elements.addressForm.querySelector(`[data-error-for="${name}"]`);
    if (message) message.textContent = errors[name];
  }

  if (invalidFields.length > 0) {
    elements.addressFormStatus.textContent = "Revise os campos indicados.";
    elements.addressForm.elements.namedItem(invalidFields[0])?.focus();
    return;
  }

  elements.addressFormStatus.textContent = "";
  showReview(customer);
});

document.querySelector("#edit-address-button").addEventListener("click", () => {
  elements.orderReview.hidden = true;
  elements.addressForm.hidden = false;
  elements.addressFormStatus.textContent = "";
  clearFieldErrors();
  elements.addressForm.elements.namedItem("name").focus();
});

document.querySelector("#generate-summary-button").addEventListener("click", () => {
  if (!checkoutCustomer || cart.totalUnits === 0) return;
  elements.summaryText.value = buildOrderSummary({
    storeName: config.storeName,
    items: cart.getItems(),
    customer: checkoutCustomer,
    subtotalCents: cart.subtotalCents,
    shippingLabel: config.shippingLabel
  });
  elements.summaryText.hidden = false;
  elements.summaryActions.hidden = false;
  elements.summaryStatus.textContent =
    "Resumo gerado. Nenhum pedido foi enviado.";
});

document.querySelector("#copy-summary-button").addEventListener("click", async () => {
  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("A área de transferência não está disponível.");
    }
    await navigator.clipboard.writeText(elements.summaryText.value);
    elements.summaryStatus.textContent = "Resumo copiado.";
  } catch {
    elements.summaryText.hidden = false;
    elements.summaryText.focus();
    elements.summaryText.select();
    elements.summaryStatus.textContent =
      "Não foi possível copiar automaticamente. O resumo está selecionado para cópia manual.";
  }
});

document.querySelector("#store-address").textContent = config.storeAddress;
const storePhone = document.querySelector("#store-phone");
storePhone.textContent = config.storePhone;
storePhone.href = `tel:${config.storePhone}`;
renderCategoryFilters();
renderFragranceOptions();
renderAll();
