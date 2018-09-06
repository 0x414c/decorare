import { FunctionT } from 'type-ops';

import { AssumptionError } from './AssumptionError';


export const _assumeUnreachable = (_: never): never => {
    throw new AssumptionError(_assumeUnreachable as FunctionT<never, never> /* HACK. */);
  };
