import path from 'path';
import { Model } from 'objection';
import db from '../../../db/dbconfig';

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

  static get modifiers() {
    return {
      name(builder) {
        builder.select('firstname', 'lastname');
      },
    };
  }

  static get virtualAttributes() {
    return ['fullName'];
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // json schema validation for insert
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstname', 'lastname', 'email', 'password'],

      properties: {
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

  static get relationMappings() {
<<<<<<< HEAD
    return {
      userAddress: {
        relation: Model.HasManyRelation,
        ModelClass: path.resolve('models', 'user_address.model.js'),
=======
    // best to use a file path for ModelClass eslint won't let me call it here
    // to know why I wanted to call it here => https://vincit.github.io/objection.js/guide/models.html#examples
    const Order = require('../../order/models/order.model');
    return {
      userAddress: {
        // reason for the change: https://vincit.github.io/objection.js/guide/relations.html#examples
        relation: Model.BelongsToOneRelation,
        modelClass: path.resolve('models', 'user_address.model.js'),
>>>>>>> add pagination
        join: {
          from: 'users.id',
          to: 'user_address.user_id',
        },
      },
      orders: {
        relation: Model.HasManyRelation,
        modelClass: Order,
        join: {
          from: 'users.id',
          to: 'orders.user_id',
        },
      },
    };
  }
}
