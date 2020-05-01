import Product from './product.models';

export async function createCategory(product) {
  return Product.query().insert(product).returning('*');
}

export async function getProductName(name) {
  return Product.query().where({ name });
}
