import path from 'path';
import { Model } from 'objection';
import db from '../../../db/dbconfig';

Model.knex(db);

export default class Products extends Model {
  static get tableName() {
    return 'products';
  }

  static get idColumn() {
    return 'id';
  }

  // json schema validation for insert
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['category_id', 'name', 'description', 'price'],
      properties: {
        category_id: {
          type: 'string',
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
          type: 'integer',
          minLength: 1,
          maxLength: 50,
        },
      },
    };
  }

  // this object defines the relations to other models

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
