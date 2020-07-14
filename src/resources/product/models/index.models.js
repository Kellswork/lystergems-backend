import Product from './product.models';

export async function addProduct(product) {
  return Product.query().insert(product).returning('*');
}

export async function getProductByAttribute(attribute) {
  return Product.query().where({ ...attribute });
}

export async function updateProduct(id, updatedProduct) {
  return Product.query()
    .patch({ ...updatedProduct })
    .where({ id })
    .returning('*');
}
