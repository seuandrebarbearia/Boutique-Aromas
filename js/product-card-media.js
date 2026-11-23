import { collectionPhotosByPage, productPhotoFramesByPath } from "./collection-photos.js?v=20261120";
import { auditedProductPhotos } from "./audited-product-photos.js?v=20261120";

// Individual photographs identified by type, size and fragrance on the same
// catalog page. Collective shots stay in the detail view, not unit cards.
const individualPhotos = {
  "7201": "06-2", "7198": "13-1", "6398": "19-1",
  "6169": "20-3", "6172": "20-4",
  "6177": "21-2", "5044": "21-3",
  "5039": "22-3", "5042": "22-4",
  "5389": "31-3", "6403": "31-4",
  "5387": "32-3", "6405": "32-4", "5397": "32-5",
  "5398": "33-2", "6406": "33-3", "5388": "33-4",
  "6139": "37-1", "6140": "37-2", "7151": "39-3",
  "6900": "47-2", "6899": "47-3", "6840": "49-1",
  "7033": "51-3", "6522": "51-2",
  "6190": "53-4", "6755": "53-1", "7115": "54-1",
  "7246": "57-2", "7247": "57-3", "7248": "57-4",
  "7245": "58-1", "7218": "62-1"
};

const frames = new Map(Object.values(collectionPhotosByPage).flat().map(photo => [photo.src, photo]));

const storePhotoBounds = {
  "assets/products/kit-amendoas-jasmim-7232.jpg": [0, 90, 1200, 1550],
  "assets/products/kit-black-44-loja.jpg": [0, 490, 1200, 1310],
  "assets/products/roll-on-divina-6188.jpg": [380, 310, 820, 1400],
  "assets/products/refil-novita-patchouli-musk-imperial-7135.jpg": [343, 345, 810, 1410],
  "assets/products/vela-massagem-flor-da-pele-7192.jpg": [360, 530, 930, 1190]
};

export function getProductCardPhoto(product) {
  if (product.photoPending) return null;
  const bounds = storePhotoBounds[product.image];
  if (bounds) return { src: product.image, width: 1200, height: 1600, bounds };
  if (product.image === "assets/official-2026-11-12/difusor-de-aromas-novita-orquidea-negra-com-musk-250ml.jpg") {
    return { src: product.image, width: 864, height: 984, bounds: [190, 0, 810, 984] };
  }
  if (auditedProductPhotos[product.id]) return auditedProductPhotos[product.id];
  if (product.imageKind === "individual" && productPhotoFramesByPath[product.image]) {
    return productPhotoFramesByPath[product.image];
  }
  const photo = individualPhotos[product.id];
  return photo ? frames.get(`assets/collections/collection-${photo}.webp`) ?? null : null;
}
