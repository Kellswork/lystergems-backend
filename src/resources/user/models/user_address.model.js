import path from 'path';
import { Model } from 'objection';
import db from '../../../db/dbconfig';

Model.knex(db);

export default class UserAddress extends Model {
  // get table name
  static get tableName() {
    return 'users_address';
  }

  // each model must have an identifier column,
  // can be ignored if primary key name is 'id'
  static get idColumn() {
    return 'id';
  }

  // json schema validation for insert
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
          type: 'string',
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

  // this object defines the relations to other models

  static get relationMappings() {
    // best to use a file path for ModelClass eslint won't let me call it here
    // the doc recommends not calling it at the top
    // => https://vincit.github.io/objection.js/guide/models.html#examples
    return {
      user: {
        // reason for the change: https://vincit.github.io/objection.js/guide/relations.html#examples
        relation: Model.HasManyRelation,
        ModelClass: path.resolve('models', 'user.model.js'),
        join: {
          from: 'user_address.user_id',
          to: 'users.id',
        },
      },
    };
  }
}
