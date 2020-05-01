import Product from './product.models';

export function addProduct(product) {
  return Product.query().insert(product).returning('*');
}

export function getProductName(name) {
  return Product.query().where({ name });
}
