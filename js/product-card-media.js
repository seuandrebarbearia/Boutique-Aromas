import { collectionPhotosByPage, productPhotoFramesByPath } from "./collection-photos.js";
import { auditedProductPhotos } from "./audited-product-photos.js";

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

export function getProductCardPhoto(product) {
  if (auditedProductPhotos[product.id]) return auditedProductPhotos[product.id];
  if (product.imageKind === "individual" && productPhotoFramesByPath[product.image]) {
    return productPhotoFramesByPath[product.image];
  }
  const photo = individualPhotos[product.id];
  return photo ? frames.get(`assets/collections/collection-${photo}.webp`) ?? null : null;
}
