export function formatBRL(cents) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(cents / 100);
}

function digits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export function validateAddress(fields) {
  const customer = {
    name: String(fields.name ?? "").trim(),
    phone: digits(fields.phone),
    postalCode: digits(fields.postalCode),
    street: String(fields.street ?? "").trim(),
    number: fields.noNumber ? "Sem número" : String(fields.number ?? "").trim(),
    complement: String(fields.complement ?? "").trim(),
    neighborhood: String(fields.neighborhood ?? "").trim(),
    city: String(fields.city ?? "").trim(),
    state: String(fields.state ?? "").trim().toUpperCase(),
    notes: String(fields.notes ?? "").trim()
  };
  const errors = {};

  for (const field of [
    "name",
    "street",
    "number",
    "neighborhood",
    "city",
    "state"
  ]) {
    if (!customer[field]) errors[field] = "Preencha este campo.";
  }

  if (!/^[1-9]\d{9,10}$/.test(customer.phone)) {
    errors.phone = "Informe um telefone com DDD e 10 ou 11 dígitos.";
  }
  if (!/^\d{8}$/.test(customer.postalCode)) {
    errors.postalCode = "Informe um CEP com 8 dígitos.";
  }
  if (customer.state && !/^[A-Z]{2}$/.test(customer.state)) {
    errors.state = "Informe a UF com duas letras.";
  }

  return { errors, customer };
}

export function buildOrderSummary({
  storeName,
  items,
  customer,
  subtotalCents,
  shippingLabel
}) {
  const address = [
    `${customer.street}, ${customer.number}`,
    customer.complement,
    customer.neighborhood,
    `${customer.city} - ${customer.state}`,
    `CEP ${customer.postalCode}`
  ].filter(Boolean);

  const lines = [
    `${storeName} — pedido pelo WhatsApp`,
    "",
    "Produtos:"
  ];

  for (const item of items) {
    const itemDescription = item.isCombo ? item.composition : item.volume;
    const variant =
      item.fragrance ||
      (item.family && item.family !== "Outros" && !item.isCombo ? item.family : "");
    const itemName =
      item.family === "Essências"
        ? item.fragrance || item.name
        : variant && variant !== item.name
          ? `${item.name} · ${variant}`
          : item.name;
    lines.push(
      `${item.quantity} x ${item.officialTitle || itemName} (${itemDescription}, cód. ${item.code}) — ${formatBRL(item.lineSubtotalCents)}`
    );
  }

  lines.push(
    "",
    `Subtotal dos produtos: ${formatBRL(subtotalCents)}`,
    `Entrega: valor ${shippingLabel.toLowerCase()}`,
    "",
    `Cliente: ${customer.name}`,
    `Telefone: ${customer.phone}`,
    `Endereço: ${address.join(", ")}`
  );

  if (customer.notes) lines.push(`Observações: ${customer.notes}`);
  return lines.join("\n");
}

export function buildWhatsAppUrl(number, message) {
 const phone = String(number).replace(/\D/g, "");
 const full = phone.startsWith("55") && phone.length >= 12 ? phone : `55${phone}`;
 if (!/^55[1-9]\d{9,10}$/.test(full)) throw new Error("WhatsApp inválido.");
 return `https://wa.me/${full}?text=${encodeURIComponent(message)}`;
}
