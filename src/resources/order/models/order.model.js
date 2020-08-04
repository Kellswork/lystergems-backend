import { Model } from 'objection';
import db from '../../../db/dbconfig';

Model.knex(db);

export default class Order extends Model {
  static get tableName() {
    return 'orders';
  }

  // json schema validation for insert
  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'user_id',
        'status',
        'shipping_fee',
        'shipping_address',
        'total_price',
      ],
      properties: {
        user_id: {
          type: 'integer',
        },
        status: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
        shipping_fee: {
          type: 'float',
        },
        shipping_address: {
          type: 'float',
          minLength: 3,
          maxLength: 200,
        },
        total_price: {
          type: 'float',
        },
      },
    };
  }

  static get relationMappings() {
    // best to use a file path for ModelClass eslint won't let me call it here
    // to know why I wanted to call it here => https://vincit.github.io/objection.js/guide/models.html#examples
    // eslint-disable-next-line global-require
    const User = require('../../user/models/user.model');
    return {
      user: {
        // reason for the change: https://vincit.github.io/objection.js/guide/relations.html#examples
        relation: Model.BelongsToOneRelation,
        modelClass: User.default,
        join: {
          from: 'orders.user_id',
          to: 'users.id',
        },
      },
    };
  }
}

export const STATUSES = ['pending', 'in_transit', 'delivered', 'cancelled'];
