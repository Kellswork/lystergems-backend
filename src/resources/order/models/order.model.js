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
}

export const STATUSES = ['pending', 'in_transit', 'delivered', 'cancelled'];
