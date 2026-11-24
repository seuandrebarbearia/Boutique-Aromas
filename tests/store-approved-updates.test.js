import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { products } from '../js/products.js';
import { getPriceLabel, getProductDescription, getCatalogDepartment } from '../js/catalog.js';
import { getCutoutProductPhoto, getProductCardPhoto } from '../js/product-card-media.js';
import { createCartStore, CART_STORAGE_KEY } from '../js/cart.js';
import { buildOrderSummary, getStoreWhatsAppUrl, formatBRL } from '../js/checkout.js';
import { config } from '../js/config.js';

const expected = [
  ['7245','1795',5990],
  ['site-aromatizador-profissional-cascas-e-folhas-250ml','1377',19990],
  ['site-bruma-hidratante-corporal-150ml','1717',9699],
  ['site-conjunto-de-varetas-natural-25cm-5-unidades',null,1690],
  ['7213','1753',6890], ['7226','1754',6890],
  ['site-manteiga-hidratante-corporal-200g','1627',10890],
  ['site-sabonete-esfoliante-jabuticaba-120ml','1487',4390],
  ['site-sabonete-esfoliante-maracuja-120ml','1486',4390],
  ['6589','834',15790],
  ['site-sabonete-liquido-corpo-e-rosto-250ml','1715',8590],
  ['site-sabonete-liquido-mi-casa-250ml','1819',15990],
  ['site-difusor-cereja-e-avela-95ml','1617',8990],
  ['site-difusor-de-aromas-mi-casa-300ml','1817',32890],
  ['site-difusor-de-aromas-sorria-mais-250ml','520',14290],
  ['site-essencia-para-aromatizador-eletrico-felicidade-10ml','517',4300],
  ['site-essencia-para-aromatizador-eletrico-gratidao-10ml','1780',4300],
  ['site-kit-bella-oriental-gourmand',null,29590],
  ['site-kit-black-44',null,24990],
  ['6177','6177',17990],
  ['5504','5504',9390],
  ['6188','6188',8090],
  ['7134','7134',12990],
  ['7135','7135',12990],
  ['7192','7192',6890]
];

test('uses the current store-approved prices and codes exactly', () => {
  for (const [id,code,price] of expected) {
    const p=products.find(p=>p.id===id);
    assert.ok(p,id);
    assert.equal(p.priceCents,price,id);
    if(code) assert.equal(p.code,code,id);
    assert.equal(p.priceStatus,'approved-store');
    assert.equal(p.priceReference,null);
    assert.equal(getPriceLabel(p),'');
    assert.equal(p.catalogNote,'');
  }
  assert.equal(formatBRL(products.find(p=>p.code==='1717').priceCents),'R$\u00a096,99');
  assert.equal(products.length,184);
  for (const [,code] of expected.filter(([,c])=>c)) assert.equal(products.filter(p=>p.code===code).length,1,code);
});

test('preserves photos and old cart IDs while displaying the new official references', () => {
  assert.ok(getProductCardPhoto(products.find(p=>p.code==='1754')).src.endsWith('esfoliante-flor-da-pele-7226-fornecido.png'));
  assert.ok(products.find(p=>p.code==='1754').legacyCodes.includes('7226'));
  const saved=JSON.stringify([{id:'7245',quantity:1,priceCents:1},{id:'7226',quantity:2,priceCents:1},{id:'site-bruma-hidratante-corporal-150ml',quantity:1,priceCents:1}]);
  const cart=createCartStore(products,{getItem:k=>k===CART_STORAGE_KEY?saved:null,setItem(){}});
  assert.equal(cart.subtotalCents,29469);
  assert.deepEqual(cart.getItems().map(p=>p.code),['1795','1754','1717']);
  assert.ok(products.find(p=>p.id==='site-sabonete-liquido-borboletas-azuis-flor-de-lotus-com-musgos-do-vale-240ml'));
  assert.equal(products.find(p=>p.code==='834').volume,'220 ml');
});

test('Black 44 kit uses its approved total and confirmed three-item composition in WhatsApp', () => {
  const kit=products.find(p=>p.id==='site-kit-black-44');
  assert.equal(getCatalogDepartment(kit),'outras-colecoes');
  assert.match(kit.composition,/deo colônia.*mousse de banho e barba.*necessaire/i);
  assert.deepEqual(kit.componentIds,['7030','6758','7245']);
  assert.equal(kit.isPromotional,true);
  assert.equal(kit.code,'');
  assert.equal(getProductCardPhoto(kit).src,'assets/products/kit-black-44-catalogo.jpg');
  const cart=createCartStore(products,null);
  cart.add(kit.id,2);
  assert.equal(cart.getItems().length,1);
  assert.equal(cart.subtotalCents,49980);
  const message=buildOrderSummary({storeName:config.storeName,items:cart.getItems(),customer:{name:'Cliente',phone:'48999990000',street:'Rua A',number:'10',city:'Florianópolis',state:'SC',postalCode:'88010000',notes:'Entregar à tarde'},subtotalCents:cart.subtotalCents,shippingLabel:config.shippingLabel});
  const url=new URL(getStoreWhatsAppUrl(config,message));
  cart.clear();
  assert.equal(cart.totalUnits,0);
  assert.equal(url.pathname,'/5548991134975');
  assert.match(url.searchParams.get('text'),/2 x Kit Black 44/);
  assert.match(message,/Unitário: R\$\u00a0249,90/);
  assert.match(message,/Subtotal dos produtos: R\$\u00a0499,80/);
  assert.match(message,/necessaire/);
  assert.doesNotMatch(message,/cód\./i);
  assert.match(message,/Entrega: valor a combinar/);
  assert.doesNotMatch(message,/teste|demonstrativ|estimad|PDF|pendente/i);
});

test('applies the store photographs and confirmed presentations', () => {
  const byId = id => products.find(product => product.id === id);
  assert.equal(byId('6177').volume, '250 ml');
  assert.equal(byId('6188').volume, '10 ml');
  assert.equal(byId('7192').volume, '100 g');
  assert.equal(byId('7103').name, 'Iogurte Corporal');
  assert.equal(byId('7103').volume, '200 ml');
  assert.equal(getProductCardPhoto(byId('7134')), null);
  assert.equal(getProductCardPhoto(byId('5504')).src, 'assets/official/product-5504.png');
  for (const id of ['6188', '7192']) {
    const product = byId(id);
    assert.notEqual(product.alternatePhoto.src, product.image);
    assert.ok(fs.existsSync(product.alternatePhoto.src));
  }
  const refill = getProductCardPhoto(byId('7135'));
  assert.equal(refill.src, 'assets/products/refil-novita-patchouli-musk-imperial-7135.jpg');
  assert.equal(refill.cutout, 'refill-photo-cutout');
  assert.ok(fs.existsSync(refill.src));
  const rollOn = byId('6188');
  assert.equal(getProductCardPhoto(rollOn).cutout, 'roll-on-photo-front');
  assert.equal(getCutoutProductPhoto(rollOn.alternatePhoto.src).cutout, 'roll-on-photo-side');
});

test('restores the merged Orquídea Negra diffuser at the current price', () => {
  const legacyId = 'site-difusor-de-aromas-novita-orquidea-negra-com-musk-250ml';
  const saved = JSON.stringify([{id: legacyId, quantity: 2}, {id: '6177', quantity: 1}]);
  const cart = createCartStore(products,{getItem: () => saved,setItem(){}});
  assert.deepEqual(cart.getItems().map(({id, code, quantity}) => [id, code, quantity]), [['6177', '6177', 3]]);
  assert.equal(cart.subtotalCents, 53970);
  assert.ok(products.find(p => p.id === '6177').legacyCodes.includes('341'));
});

test('customer-facing text contains no testing, estimates or internal PDF audit messages', () => {
  for(const p of products){
    const text=[getPriceLabel(p),getProductDescription(p),p.customerNote,p.composition].filter(Boolean).join(' ');
    assert.doesNotMatch(text,/demonstrativ|estimad|simula|\bteste\b|PDF|cadastro anterior|foto fornecida pelo usuário/i,p.id);
  }
  assert.equal(getPriceLabel(products.find(p=>p.id==='6566')),'');
  const app=fs.readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
  assert.doesNotMatch(app,/product\.(catalogNote|customerNote)|Página do PDF|Valor demonstrativo|Preço de referência/);
});

test('every active card can be restored, ordered and cleared with the current price and store WhatsApp', () => {
  const customer={name:'Cliente',phone:'48999990000',street:'Rua das Flores',number:'12',complement:'Sala 2',neighborhood:'Centro',city:'Florianópolis',state:'SC',postalCode:'88010000',notes:'Entregar à tarde'};
  assert.equal(config.whatsappEnabled,true);
  assert.equal(config.demoMode,false);
  assert.equal(new Set(products.map(p=>p.id)).size,products.length);
  for(const product of products){
    assert.ok(Number.isSafeInteger(product.priceCents)&&product.priceCents>0,product.id);
    assert.equal(getPriceLabel(product),'');
    let saved=JSON.stringify([{id:product.id,quantity:2,priceCents:1}]);
    const storage={getItem:key=>key===CART_STORAGE_KEY?saved:null,setItem:(key,value)=>{if(key===CART_STORAGE_KEY)saved=value;}};
    const cart=createCartStore(products,storage);
    assert.equal(cart.totalUnits,2,product.id);
    assert.equal(cart.subtotalCents,product.priceCents*2,product.id);
    const message=buildOrderSummary({storeName:config.storeName,items:cart.getItems(),customer,subtotalCents:cart.subtotalCents,shippingLabel:config.shippingLabel});
    const url=new URL(getStoreWhatsAppUrl(config,message));
    assert.equal(url.pathname,'/5548991134975',product.id);
    assert.equal(url.searchParams.get('text'),message);
    if (product.code) assert.ok(message.includes(`cód. ${product.code}`),product.id);
    assert.ok(message.includes(`Unitário: ${formatBRL(product.priceCents)}`),product.id);
    assert.ok(message.includes(`Subtotal dos produtos: ${formatBRL(product.priceCents*2)}`),product.id);
    if(product.isCombo)assert.ok(message.includes(product.composition),product.id);
    assert.match(message,/Rua das Flores, 12, Sala 2, Centro, Florianópolis - SC, CEP 88010000/);
    assert.match(message,/Observações: Entregar à tarde/);
    assert.doesNotMatch(message,/Observação do produto:/,product.id);
    assert.match(message,/Entrega: valor a combinar/);
    assert.doesNotMatch(message,/Preço pendente|demonstrativ|estimad|simula|\bteste\b|PDF/i,product.id);
    cart.clear();
    assert.equal(cart.totalUnits,0);
    assert.equal(createCartStore(products,storage).totalUnits,0);
  }
});
