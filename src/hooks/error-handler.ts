// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { GeneralError } from '@feathersjs/errors';
import { Hook, HookContext } from '@feathersjs/feathers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.error) {
      const error = context.error;
      if (!error.code) {
        const newError = new GeneralError('server error');
        context.error = newError;
        return context;
      }
      if (error.code === 404 || process.env.NODE_ENV === 'production') {
        error.stack = null;
      }
      return context;
    }
    return context;
  };
};
