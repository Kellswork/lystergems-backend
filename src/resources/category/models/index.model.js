import Category from './category.model';

export async function createCategory(category) {
  return Category.query().insert(category).returning('*');
}

export async function getCategoryByName(name) {
  return Category.query().where({ name });
}
