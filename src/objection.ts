import { Model } from 'objection';
import knex from 'knex';
import { Application } from './declarations';

export default function (app: Application): void {
  const { client, connection, pool } = app.get('postgres');
  const db = knex({ client, connection, pool, useNullAsDefault: false });

  Model.knex(db);

  app.set('knex', db);
}
