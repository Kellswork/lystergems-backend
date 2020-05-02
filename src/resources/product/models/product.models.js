import path from 'path';
import { Model } from 'objection';
import db from '../../../db/dbconfig';

Model.knex(db);

export default class Product extends Model {
  static get tableName() {
    return 'products';
  }

  // json schema validation for insert
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['category_id', 'name', 'description', 'price'],
      properties: {
        category_id: {
          type: 'integer',
        },
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
        description: {
          type: 'string',
          minLength: 1,
          maxLength: 250,
        },
        price: {
          type: 'float',
          minLength: 1,
          maxLength: 50,
        },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.HasManyRelation,
        ModelClass: path.resolve('models', 'category.model.js'),
        join: {
          from: 'products.category_id',
          to: 'categories.id',
        },
      },
    };
  }
}
