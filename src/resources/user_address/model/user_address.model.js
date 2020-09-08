import path from 'path';
import { Model } from 'objection';
import db from '../../../db/dbconfig';

Model.knex(db);

export default class UserAddress extends Model {
  static get tableName() {
    return 'users_address';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'user_id',
        'phone_number',
        'street_address',
        'city',
        'state',
        'country',
      ],
      properties: {
        user_id: {
          type: 'integer',
        },
        phone_number: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
        street_address: {
          type: 'string',
          minLength: 1,
          maxLength: 250,
        },
        city: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
        state: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
        country: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
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
          from: 'user_address.user_id',
          to: 'users.id',
        },
      },
    };
  }
}
