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
      required: ['user_id', 'status', 'shipping_fee', 'shipping_address'],
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
          minLength: 1,
          maxLength: 200,
        },
      },
    };
  }
}
