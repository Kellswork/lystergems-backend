import { Model } from 'objection';
import db from '../../../db/dbconfig';

Model.knex(db);

export default class Category extends Model {
  static get tableName() {
    return 'categories';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        name: {
          type: 'string',
          minLength: 3,
          maxLength: 50,
        },
      },
    };
  }
}
