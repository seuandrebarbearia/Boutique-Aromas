import { config } from "./config.js";
import { createCartStore } from "./cart.js";
import { buildOrderSummary, buildWhatsAppUrl, formatBRL, validateAddress } from "./checkout.js";
import { products } from "./products.js";
import { getCatalogDepartment, groupProductsByCategory } from "./catalog.js";
import { getProductCardPhoto } from "./product-card-media.js";

const cart = createCartStore(products);
const productById = new Map(products.map((product) => [product.id, product]));
let selectedFragrance = "";
let selectedDepartment = "";
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
  sendWhatsApp: document.querySelector("#send-whatsapp-button")
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
        product.officialTitle,
        product.officialHandle,
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
  if (product.officialTitle) return product.officialTitle;
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

function getPriceLabel(product) {
  if (product.priceReference) return "Preço de referência";
  if (product.priceBasis === "component-sum") return "Valor estimado do conjunto";
  return "Valor demonstrativo";
}

function getProductDescription(product) {
  if (!/^Item identificado no catálogo, página \d+\.$/.test(product.description)) {
    return product.description;
  }
  return `Uma opção da coleção ${product.family}. Confira a fragrância, o volume e o código nas informações do produto.`;
}

const catalogDepartments = [
  {
    id: "perfumacao-de-ambientes",
    title: "Perfumação de ambientes",
    description: "Fragrâncias e acessórios para criar a atmosfera dos seus espaços."
  },
  {
    id: "autocuidado",
    title: "Autocuidado",
    description: "Produtos para acompanhar seus momentos e rituais pessoais."
  },
  {
    id: "outras-colecoes",
    title: "Outras coleções",
    description: "Kits, presentes, acessórios e outras descobertas do catálogo."
  }
];

function createProductCard(product) {
  const card = createElement("article", "product-card");
  card.id = `product-${product.id}`;
  card.dataset.productId = product.id;
  const photo = getProductCardPhoto(product);
  const media = createButton("", "product-card-media", (event) =>
    openProductDetails(product, event.currentTarget), `Ver detalhes de ${getOfferItemName(product)}`);
  if (product.officialImage && !photo) {
    const image = createElement("img", "product-card-photo");
    image.loading = "lazy";
    image.style.cssText = "width:100%;height:100%;object-fit:contain;position:static";
    setProductImage(image, product.officialImage, product.officialTitle);
    media.append(image);
  } else if (photo) {
    const crop = createElement("span", "product-card-photo-crop");
    const image = createElement("img", "product-card-photo");
    const [left, top, right, bottom] = photo.bounds;
    const width = right - left;
    const height = bottom - top;
    const ratio = width / height;
    crop.style.width = `${Math.min(1, ratio) * 90}%`;
    crop.style.height = `${Math.min(1, 1 / ratio) * 90}%`;
    image.style.width = `${photo.width / width * 100}%`;
    image.style.height = `${photo.height / height * 100}%`;
    image.style.left = `${-left / width * 100}%`;
    image.style.top = `${-top / height * 100}%`;
    image.width = photo.width;
    image.height = photo.height;
    image.loading = "lazy";
    image.decoding = "async";
    setProductImage(image, photo.src, getOfferItemName(product));
    crop.append(image);
    media.append(crop);
  } else {
    media.classList.add("product-card-media-pending");
    media.append(
      createElement("span", "product-card-pending-mark", "Boutique de Aromas"),
      createElement("span", "product-card-pending-label", "Foto individual em atualização"),
      createElement("span", "product-card-pending-link", "Ver referência nos detalhes")
    );
  }
  const heading = createElement("h4", "product-card-heading");
  heading.append(createButton(getOfferItemName(product), "product-card-name", (event) =>
    openProductDetails(product, event.currentTarget)));
  const price = createElement("div", "product-card-price-block");
  price.append(
    createElement("strong", "product-card-price", formatBRL(product.priceCents)),
    createElement("small", "price-source-label", getPriceLabel(product))
  );
  card.append(media, heading,
    createElement("p", "product-card-meta", `${product.isCombo ? "Kit" : product.specification || product.volume} · Cód. ${product.code}`));
  if (product.isCombo) {
    card.append(createElement("p", "product-card-composition", product.composition));
  }
  card.append(price, createButton("Adicionar ao carrinho", "button product-card-add", (event) =>
    addProduct(product, 1, event.currentTarget), `Adicionar ${getOfferItemName(product)} ao carrinho`));
  if (product.officialHandle) {
    const source = createElement("a", "price-source-label", "Ver no site oficial");
    source.href = product.priceReference.sourceUrl;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    card.append(source);
  }
  return card;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts().filter(
    (product) =>
      !selectedDepartment || getCatalogDepartment(product) === selectedDepartment
  );
  const fragment = document.createDocumentFragment();
  const department = catalogDepartments.find((item) => item.id === selectedDepartment);
  const section = createElement("section", "catalog-department");
  section.id = selectedDepartment || "todas-as-colecoes";
  const heading = createElement("div", "department-heading");
  heading.append(
    createElement("p", "eyebrow", "Descubra por universo"),
    createElement("h3", "", department?.title || "Todos os produtos"),
    createElement(
      "p",
      "department-description",
      department?.description || "Encontre seus favoritos por categoria. Cada produto tem seu preço e compra individual."
    )
  );
  section.append(heading);

  for (const [category, categoryProducts] of groupProductsByCategory(visibleProducts)) {
    const categorySection = createElement("section", "product-category");
    const categoryId = `category-${slugify(category)}`;
    categorySection.setAttribute("aria-labelledby", categoryId);
    const categoryHeading = createElement("div", "product-category-heading");
    const title = createElement("h3", "", category);
    title.id = categoryId;
    categoryHeading.append(title, createElement("span", "", `${categoryProducts.length} ${categoryProducts.length === 1 ? "produto" : "produtos"}`));
    const grid = createElement("div", "product-grid");
    for (const product of categoryProducts) grid.append(createProductCard(product));
    categorySection.append(categoryHeading, grid);
    section.append(categorySection);
  }
  if (visibleProducts.length > 0) fragment.append(section);

  document.querySelectorAll("[data-department]").forEach((link) => {
    if (link.dataset.department === selectedDepartment) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  elements.catalogSections.replaceChildren(fragment);
  elements.emptyState.hidden = visibleProducts.length > 0;
  elements.resultsCount.textContent =
    visibleProducts.length === 1
      ? "1 produto"
      : `${visibleProducts.length} produtos`;
}

function clearCatalogFilters() {
  selectedDepartment = "";
  if (catalogDepartments.some(({ id }) => window.location.hash === `#${id}`)) {
    window.history.replaceState(null, "", "#catalogo");
  }
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

  const cardPhoto = getProductCardPhoto(product);
  const isCollective = !cardPhoto && product.imageKind === "collective";
  const image = createElement("img", `detail-image${isCollective ? " detail-image-collective" : ""}`);
  setProductImage(image, cardPhoto?.src ?? product.image, getOfferItemName(product));
  image.width = cardPhoto?.width ?? 640;
  image.height = cardPhoto?.height ?? 480;
  const figure = createElement("figure", "detail-figure");
  if (isCollective) {
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
      product.isCombo ? product.composition : getProductDescription(product)
    )
  );

  const metadata = createElement("dl", "detail-metadata");
  for (const [label, value] of [
    ["Código", product.code],
    ...(!product.isCombo
      ? [[product.specification ? "Especificação" : "Volume", product.specification || product.volume]]
      : []),
    ...(product.sourcePage ? [["Página do catálogo", String(product.sourcePage)]] : [["Referência", product.officialHandle]])
  ]) {
    metadata.append(createElement("dt", "", label), createElement("dd", "", value));
  }
  content.append(metadata);
  if (product.catalogNote) {
    content.append(createElement("p", "inline-notice", product.catalogNote));
  }
  content.append(createElement("strong", "detail-price", formatBRL(product.priceCents)));
  content.append(createElement("p", "price-source-label", getPriceLabel(product)));
  if (product.priceReference) {
    const source = createElement("a", "price-reference-link", "Consultar preço no site oficial");
    source.href = product.priceReference.sourceUrl;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    content.append(source);
  }

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
  const noNumber = elements.addressForm.elements.namedItem("noNumber");
  noNumber.checked = customer.number === "Sem número";
  numberField.disabled = noNumber.checked;
  if (noNumber.checked) numberField.value = "";
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
  const message = buildOrderSummary({
    storeName: config.storeName,
    items: cart.getItems(),
    customer,
    subtotalCents: cart.subtotalCents,
    shippingLabel: config.shippingLabel
  });
  elements.sendWhatsApp.href = buildWhatsAppUrl(config.whatsappNumber, message);
  elements.sendWhatsApp.hidden = !config.whatsappEnabled;
  elements.summaryStatus.textContent =
    "O WhatsApp abrirá com seu pedido preenchido. Confirme o envio no aplicativo. A loja confirmará valores, disponibilidade e entrega.";
  updateReview(customer);
  elements.checkoutDialog.scrollTop = 0;
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
function navigateCatalog() {
  const destination = window.location.hash.slice(1);
  if (destination !== "catalogo" && !catalogDepartments.some(({ id }) => id === destination)) return;
  selectedDepartment = destination === "catalogo" ? "" : destination;
  renderProducts();
  // The destination section is created by rendering the selected department.
  (document.getElementById(destination) ?? document.getElementById("catalogo"))
    .scrollIntoView({ behavior: "auto" });
}

window.addEventListener("hashchange", navigateCatalog);
document.querySelectorAll('a[href="#catalogo"], a[href="#perfumacao-de-ambientes"], a[href="#autocuidado"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (link.hash === window.location.hash) navigateCatalog();
  });
});
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

elements.sendWhatsApp.addEventListener("click", (event) => {
  if (!config.whatsappEnabled || !checkoutCustomer || cart.totalUnits === 0) {
    event.preventDefault();
    return;
  }
  cart.clear();
  renderAll();
  elements.checkoutDialog.close();
  elements.liveStatus.textContent = "Pedido preparado para o WhatsApp. Carrinho esvaziado.";
});

document.querySelector("#store-address").textContent = config.storeAddress;
const storePhone = document.querySelector("#store-phone");
storePhone.textContent = config.storePhone;
storePhone.href = `tel:${config.storePhone}`;
document.querySelector("#store-whatsapp").href =
  `https://wa.me/55${config.whatsappNumber.replace(/\D/g, "")}`;
renderCategoryFilters();
renderFragranceOptions();
renderAll();
navigateCatalog();
