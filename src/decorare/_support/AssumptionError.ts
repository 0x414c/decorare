import {
  ConstructorT,
  FunctionT,
} from 'type-ops';

import { ErrorJson } from '../support/ErrorJson';


export class AssumptionError extends Error {
  public readonly [Symbol.toStringTag]: string = AssumptionError.name;


  public constructor(caller: FunctionT | ConstructorT = AssumptionError) {
    super('Assumption failed');

    this.name = AssumptionError.name;
    Reflect.defineProperty(this, 'name', { configurable: true, writable: true, enumerable: false });

    if ((typeof Error.captureStackTrace === 'function') && (Error.captureStackTrace.length === 2)) {
      Error.captureStackTrace(this, caller);
      Reflect.defineProperty(this, 'stack', { configurable: true, writable: true, enumerable: false });
    }

    Reflect.defineProperty(this, Symbol.toStringTag, { configurable: true, enumerable: false, writable: false });
  }

  public toJSON(propertyKey_: string): ErrorJson {
    return {
      name: this.name,
      message: this.message,
    };
  }
}
