import path from 'path';
import { Model } from 'objection';
import db from '../../../db/dbconfig';

Model.knex(db);

export default class Wishlist extends Model {
  static get tableName() {
    return 'wishlist';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'product_id'],
      properties: {
        user_id: {
          type: 'integer',
        },
        product_id: {
          type: 'integer',
        },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        ModelClass: path.resolve('models', 'user.model.js'),
        join: {
          from: 'wishlist.user_id',
          to: 'users.id',
        },
      },
      product: {
        relation: Model.BelongsToOneRelation,
        ModelClass: path.resolve('models', 'product.model.js'),
        join: {
          from: 'wishlist.product_id',
          to: 'products.id',
        },
      },
    };
  }
}
