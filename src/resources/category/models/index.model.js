import Category from './category.model';

export function createCategory(category) {
  return Category.query().insert(category).returning('*');
}

export function getCategoryByName(name) {
  return Category.query().where({ name });
}

export function getCategoryById(id) {
  return Category.query().where({ id });
}
