import { _stringifyObject } from '../configureDataProperty/_support/utils';

import { PropertyKeyT } from '../common';

const _formatErrorMessage = (propertyKey: PropertyKeyT, propertyDescriptor: PropertyDescriptor): string =>
    `Property \`${propertyKey.toString()}' cannot be configured using descriptor \`${_stringifyObject(propertyDescriptor)}'`;

export class PropertyConfigurationError extends Error {
  public readonly [Symbol.toStringTag]: string = PropertyConfigurationError.name;

  public constructor(
      propertyKey: PropertyKeyT,
      propertyDescriptor: PropertyDescriptor,
      callSite: Function = PropertyConfigurationError,
  ) {
    super(_formatErrorMessage(propertyKey, propertyDescriptor));

    this.name = PropertyConfigurationError.name;
    Reflect.defineProperty(this, 'name', { configurable: true, writable: true, enumerable: false });

    if (Error.captureStackTrace !== undefined) {
      Error.captureStackTrace(this, callSite);
    }

    Reflect.defineProperty(this, Symbol.toStringTag, { configurable: true, enumerable: false, writable: false });
  };
};
