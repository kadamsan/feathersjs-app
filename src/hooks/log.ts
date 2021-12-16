// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import logger from '../logger';
import util from 'util';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { params } = context;
    const requestId = params.requestId;
    logger.debug(`Request Id: ${requestId}`);
    // This debugs the service call and a stringified version of the hook context
    // You can customize the message (and logger) to your needs
    logger.debug(
      `${context.type} app.service('${context.path}').${context.method}()`,
    );

    if (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof (context as any).toJSON === 'function' &&
      logger.level === 'debug'
    ) {
      logger.debug('Hook Context', util.inspect(context, { colors: false }));
    }

    if (context.error && !context.result) {
      logger.error(context.error.stack);
    }

    return context;
  };
};
