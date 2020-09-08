import Product from './product.model';

export async function addProduct(product) {
  return Product.query().insert(product).returning('*');
}

export async function updateProduct(id, updatedProduct) {
  return Product.query()
    .patch({ ...updatedProduct })
    .where({ id })
    .returning('*');
}

export async function deleteProduct(id) {
  return Product.query().where({ id }).del();
}

export async function getAllProductsInaCategory(id) {
  return Product.query().select('*').where({ category_id: id });
}
