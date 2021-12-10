// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema } from 'objection';
import { Knex } from 'knex';
import { Application } from '../declarations';

class User extends Model {
  created_at!: string;
  updated_at!: string;

  static get tableName(): string {
    return 'fe_user';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['email', 'password'],

      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        avatar: { type: 'string' },

        googleId: { type: 'string' },
        githubId: { type: 'string' },

      }
    };
  }

  $beforeInsert(): void {
    this.created_at = this.updated_at = new Date().toISOString();
  }

  $beforeUpdate(): void {
    this.updated_at = new Date().toISOString();
  }
}

export default function (app: Application): typeof User {
  const db: Knex = app.get('knex');

  db.schema.hasTable(User.tableName).then(exists => {
    if (!exists) {
      db.schema.createTable(User.tableName, table => {
        table.increments('id');

        table.string('first_name', 255);
        table.string('last_name', 255);
        table.string('email', 255).notNullable().unique();
        table.string('password', 255).notNullable();
        table.string('avatar');

        table.string('googleId');
        table.string('githubId');

        table.timestamp('created_at');
        table.timestamp('updated_at');
      })
        .then(() => console.log('Created user table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating user table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating user table', e)); // eslint-disable-line no-console

  return User;
}
