import commonError from './hooks/common-error';// Application hooks that run for every service
import log from './hooks/log';
import * as _transaction from './hooks/transaction-hook';

// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [_transaction.start()],
    update: [_transaction.start()],
    patch: [_transaction.start()],
    remove: [_transaction.start()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [_transaction.commit()],
    update: [_transaction.commit()],
    patch: [_transaction.commit()],
    remove: [_transaction.commit()]
  },

  error: {
    all: [commonError(), log()],
    find: [],
    get: [],
    create: [_transaction.rollback()],
    update: [_transaction.rollback()],
    patch: [_transaction.rollback()],
    remove: [_transaction.rollback()]
  }
};
