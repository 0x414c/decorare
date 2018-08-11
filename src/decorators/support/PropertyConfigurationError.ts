import {
  ConstructorT,
  FunctionT,
} from 'type-ops';

import { _stringifyObject } from '../configureDataProperty/_support/utils';

import { PropertyKeyT } from '../common';

const _formatErrorMessage = (propertyKey: PropertyKeyT, propertyDescriptor: PropertyDescriptor): string =>
    `Property \`${propertyKey.toString()}' cannot be configured using descriptor \`${_stringifyObject(propertyDescriptor)}'`;

export class PropertyConfigurationError extends Error {
  public readonly [Symbol.toStringTag]: string = PropertyConfigurationError.name;

  public constructor(
    propertyKey: PropertyKeyT, propertyDescriptor: PropertyDescriptor,
    caller: FunctionT | ConstructorT = PropertyConfigurationError,
  ) {
    super(_formatErrorMessage(propertyKey, propertyDescriptor));

    Reflect.defineProperty(this, Symbol.toStringTag, { configurable: true, enumerable: false, writable: false });

    this.name = PropertyConfigurationError.name;
    Reflect.defineProperty(this, 'name', { configurable: true, writable: true, enumerable: false });

    if ((typeof Error.captureStackTrace === 'function') && (Error.captureStackTrace.length === 2)) {
      Error.captureStackTrace(this, caller);
      Reflect.defineProperty(this, 'stack', { configurable: true, writable: true, enumerable: false });
    }
  }
}
