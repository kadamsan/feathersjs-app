// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { createHash } from 'crypto';

// The Gravatar image service
const gravatarUrl = 'https://s.gravatar.com/avatar';
// The size query. Our chat needs 60px images
const query = 's=60';

// Returns a full URL to a Gravatar image for a given email address
const gravatarImage = (email: string) => {
  // Gravatar uses MD5 hashes from an email address to get the image
  const hash = createHash('md5').update(email.toLowerCase()).digest('hex');
  return `${gravatarUrl}/${hash}?${query}`;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { email } = context.data;
    context.data.avatar = gravatarImage(email);
    return context;
  };
};
