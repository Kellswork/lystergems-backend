import Product from './product.models';

export async function addProduct(product) {
  return Product.query().insert(product).returning('*');
}

export async function getProductName(name) {
  return Product.query().where({ name });
}

export async function getAllProductsInaCategory(id) {
  return Product.query().select('*').where({ category_id: id });
}
