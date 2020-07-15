import Category from './category.model';

export async function createCategory(category) {
  return Category.query().insert(category).returning('*');
}

export async function getCategoryByAttribute(attribute) {
  return Category.query().where({ ...attribute });
}

export async function getAllCategories() {
  return Category.query().select('*');
}

export async function patchCategory(id, name) {
  return Category.query()
    .where({ id })
    .patch({ name, updated_at: Category.fn.now() });
}

export async function deleteCategory(id) {
  return Category.query().where({ id }).del();
}
