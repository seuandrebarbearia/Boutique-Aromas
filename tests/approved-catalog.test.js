import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { products } from '../js/products.js';
import { getProductCardPhoto } from '../js/product-card-media.js';
import { getCatalogDepartment, groupProductsByCategory } from '../js/catalog.js';
import { CART_STORAGE_KEY, createCartStore } from '../js/cart.js';
import { buildOrderSummary, getStoreWhatsAppUrl } from '../js/checkout.js';
import { config } from '../js/config.js';
import { suppressedPhotoIds } from '../js/approved-catalog-data.js';

const audit = JSON.parse(fs.readFileSync(new URL('../referencias/catalogo-aprovado-2026-11-17.json', import.meta.url), 'utf8'));
const byId = id => products.find(p => p.id === id);

test('records visual review of all 61 pages and does not approve obscured or malformed prices', () => {
  assert.deepEqual(audit.pageReview.map(p => p.page), Array.from({length:61}, (_,i) => i+1));
  assert.ok(audit.pageReview.every(p => p.reviewedVisually));
  assert.equal(audit.records.length, 189);
  assert.ok(audit.records.filter(r => r.status === 'riscado/ilegível').every(r => r.priceCents === null));
  assert.equal(audit.records.find(r => r.code === '6566').rawPrice, 'R$ 6390');
  assert.equal(audit.records.find(r => r.code === '6566').priceCents, null);
  assert.equal(byId('6566').priceStatus, 'pending-review');
  assert.equal(byId('6566').priceCents, 7490);
});

test('the approved PDF wins over historical official prices for every matched active product', () => {
  const confirmed = products.filter(p => p.priceStatus === 'approved-pdf');
  assert.equal(confirmed.length, 123);
  for (const p of confirmed) {
    const source = audit.records.find(r => r.code === p.code && r.page === p.approvedPdfPage);
    assert.equal(p.priceCents, source.priceCents, `${p.id}: PDF price`);
    assert.equal(p.priceReference, null);
    assert.equal(p.priceBasis, 'approved-pdf');
  }
  assert.equal(byId('7109').priceCents, 28990);
  assert.equal(byId('7110').priceCents, 17890);
  assert.equal(byId('7193').priceCents, 38490);
  assert.equal(byId('7218').priceCents, 890);
});

test('consolidates exact duplicates, preserves different presentations, and retains missing products for review', () => {
  assert.equal(products.length, 184);
  for (const pair of audit.consolidations) {
    assert.equal(byId(pair.removedId), undefined);
    assert.ok(byId(pair.retainedId));
  }
  for (const p of audit.retiredEquivalents) assert.equal(byId(p.id), undefined);
  assert.equal(products.filter(p => p.code === '6507').length, 2);
  assert.ok(byId('6177'));
  assert.equal(byId('site-difusor-de-aromas-novita-orquidea-negra-com-musk-250ml'), undefined);
  assert.equal(byId('6052').volume, '95 ml');
  assert.equal(getProductCardPhoto(byId('6052')), null);
  assert.ok(byId('site-refil-para-difusor-de-aromas-divina-250ml'));
  assert.ok(byId('7102') && byId('site-manteiga-hidratante-corporal-200g'));
  assert.equal(byId('7232').priceStatus, 'approved-store');
  assert.equal(byId('7232').priceCents, 26790);
  assert.equal(byId('site-kit-jasmim-e-amendoas-doces').priceCents, 26990);
});

test('preserves the remaining PDF-only codes and restores resolved photographs', () => {
  for (const id of ['6674','6371','6683','6138']) {
    assert.equal(byId(id).priceStatus, 'approved-pdf');
    assert.ok(fs.existsSync(byId(id).image));
  }
  assert.equal(byId('6138').fragrance, 'Sândalo Australiano');
  assert.equal(byId('6683').fragrance, 'Baunilha');
  assert.equal(getCatalogDepartment(byId('6371')), 'perfumacao-de-ambientes');
  assert.equal(getCatalogDepartment(byId('6188')), 'autocuidado');
  assert.equal(groupProductsByCategory(products).flatMap(([,p]) => p).length, 184);
  for (const id of suppressedPhotoIds.filter(id => byId(id))) {
    const product = byId(id);
    assert.equal(product.photoPending, false);
    assert.equal(getProductCardPhoto(product).src, product.image);
    assert.ok(fs.existsSync(product.image));
  }
});

test('old carts use current unit prices and cannot restore retired or consolidated cards', () => {
  const saved = JSON.stringify([
    {id:'7109',quantity:2,priceCents:1}, {id:'7110',quantity:1,priceCents:1},
    {id:'7104',quantity:1}, {id:audit.consolidations[0].removedId,quantity:1},
    {id:'site-kit-boutique-em-flores',quantity:1}
  ]);
  const storage = {getItem:key=>key===CART_STORAGE_KEY?saved:null,setItem(){}};
  const cart = createCartStore(products,storage);
  assert.equal(cart.totalUnits,3);
  assert.equal(cart.subtotalCents,75870);
  const message = buildOrderSummary({storeName:config.storeName,items:cart.getItems(),
    customer:{name:'Cliente Teste',phone:'48999990000',street:'Rua Teste',number:'10',complement:'Apto 2',neighborhood:'Centro',city:'Florianópolis',state:'SC',postalCode:'88010000',notes:'Entregar à tarde'},
    subtotalCents:cart.subtotalCents,shippingLabel:config.shippingLabel});
  const url = new URL(getStoreWhatsAppUrl(config,message));
  cart.clear();
  assert.equal(cart.totalUnits,0);
  assert.equal(url.pathname,'/5548991134975');
  assert.equal(url.searchParams.get('text'),message);
  assert.match(message,/2 x Óleo Difusor/);
  assert.match(message,/Unitário: R\$\u00a0289,90/);
  assert.match(message,/Subtotal dos produtos: R\$\u00a0758,70/);
  assert.match(message,/Apto 2, Centro, Florianópolis - SC, CEP 88010000/);
  assert.match(message,/Observações: Entregar à tarde/);
  assert.match(message,/Entrega: valor a combinar/);
  assert.doesNotMatch(message,/7104|Máquina/);
});

test('WhatsApp includes confirmed kit composition and charges a kit once at its own PDF price', () => {
  const cart=createCartStore(products,null);
  cart.add('6914',2);
  assert.equal(cart.totalUnits,2);
  assert.equal(cart.subtotalCents,12180);
  const message=buildOrderSummary({storeName:config.storeName,items:cart.getItems(),customer:{name:'Teste',phone:'48999990000',street:'Rua A',number:'1',city:'Florianópolis',state:'SC',postalCode:'88010000'},subtotalCents:cart.subtotalCents,shippingLabel:config.shippingLabel});
  assert.match(message,/2 x Kit Esponja/);
  assert.match(message,/esponja e espuma de limpeza 50 ml/i);
  assert.match(message,/Unitário: R\$\u00a060,90/);
});
