import {
  ConstructorT,
  FunctionT,
} from 'type-ops';

import { ErrorJson } from './ErrorJson';


export interface TargetErrorJson extends ErrorJson {
  readonly target?: object;
}


export class TargetError extends Error {
  public readonly target?: object;

  public readonly [Symbol.toStringTag]: string = TargetError.name;

  public constructor(message: string, target?: object, caller: FunctionT | ConstructorT = TargetError) {
    super(message);

    this.name = TargetError.name;
    Reflect.defineProperty(this, 'name', { configurable: true, writable: true, enumerable: false });

    if ((typeof Error.captureStackTrace === 'function') && (Error.captureStackTrace.length === 2)) {
      Error.captureStackTrace(this, caller);
      Reflect.defineProperty(this, 'stack', { configurable: true, writable: true, enumerable: false });
    }

    this.target = target;
    Reflect.defineProperty(this, 'target', { configurable: true, enumerable: false, writable: false });

    Reflect.defineProperty(this, Symbol.toStringTag, { configurable: true, enumerable: false, writable: false });
  }

  public toJSON(propertyKey_: string): TargetErrorJson {
    return {
        name: this.name,
        message: this.message,
        target: this.target,
      };
  }
}
