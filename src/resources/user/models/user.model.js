import path from 'path';
import db from '../../../db/dbconfig';

const { Model } = require('objection');

Model.knex(db);

export default class User extends Model {
  // get table name
  static get tableName() {
    return 'users';
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
      required: ['firstname', 'lastname', 'email', 'password'],

      properties: {
        id: {
          type: 'integer ',
        },
        firstname: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
        lastname: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
        email: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
          format: 'email',
        },
        password: {
          type: 'string',
          minLength: 1,
          maxLength: 1000,
        },
      },
    };
  }

  // this object defines the relations to other models

  static get relationMappings() {
    // best to use a file path for ModelClass eslint won't let me call it here
    // to know why I wanted to call it here => https://vincit.github.io/objection.js/guide/models.html#examples
    return {
      userAddress: {
        relation: Model.HasManyRelation,
        ModelClass: path.resolve('models', 'user_address.model.js'),
        join: {
          from: 'users.id',
          to: 'user_address.user_id',
        },
      },
    };
  }
}
