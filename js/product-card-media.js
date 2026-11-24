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

const studioPhotoBounds = {
  "assets/products/kit-desejos-natal-7260.jpg": [100, 140, 1090, 1050],
  "assets/products/kit-all-you-need-is-splash-7274.jpg": [0, 80, 1200, 1120],
  "assets/products/kit-amendoas-jasmim-7232-catalogo.jpg": [0, 0, 1200, 1200],
  "assets/products/kit-black-44-catalogo.jpg": [0, 235, 1200, 1085],
  "assets/products/vela-massagem-flor-da-pele-7192-catalogo.jpg": [215, 195, 985, 1040]
};

const cutoutPhotos = {
  "assets/products/roll-on-divina-6188.jpg": {
    bounds: [380, 320, 820, 1400], cutout: "roll-on-photo-front"
  },
  "assets/products/roll-on-divina-6188-lateral.jpg": {
    bounds: [385, 214, 895, 1375], cutout: "roll-on-photo-side"
  },
  "assets/products/refil-novita-patchouli-musk-imperial-7135.jpg": {
    bounds: [343, 345, 810, 1410], cutout: "refill-photo-cutout"
  }
};

export function getCutoutProductPhoto(src) {
  const frame = cutoutPhotos[src];
  return frame ? { src, width: 1200, height: 1600, ...frame } : null;
}

export function getProductCardPhoto(product) {
  if (product.photoPending) return null;
  const studioBounds = studioPhotoBounds[product.image];
  if (studioBounds) return {
    src: product.image, width: 1200, height: 1200, bounds: studioBounds, studio: true
  };
  const cutoutPhoto = getCutoutProductPhoto(product.image);
  if (cutoutPhoto) return cutoutPhoto;
  if (product.image === "assets/official-2026-11-12/difusor-cereja-e-avela-95ml.png") {
    return { src: product.image, width: 1000, height: 1000, bounds: [310, 135, 700, 982] };
  }
  if (product.image === "assets/products/sabonete-encantos-de-natal-cereja-avela-190ml.jpg") {
    return { src: product.image, width: 328, height: 492, bounds: [0, 0, 328, 492] };
  }
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
