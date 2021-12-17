// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { transaction } from 'objection';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import logger from '../logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const start = (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { app } = context;
    const knex = app.get('knex');
    const trx = await transaction.start(knex);
    context.params = {
      ...context.params,
      transaction: {
        trx
      }
    };
    /*const transactionObject = {
      transaction: {
        trx
      },
    };
    context.params = Object.assign(
      context.params,
      transactionObject
    );*/
    //logger.info('start ->', trx);
    //logger.info('context.params ->', context.params);
    return context;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const commit = (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { transaction } = context.params;
    await transaction.trx.commit();
    return context;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const rollback = (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { transaction } = context.params;
    await transaction.trx.rollback();
    return context;
  };
};
