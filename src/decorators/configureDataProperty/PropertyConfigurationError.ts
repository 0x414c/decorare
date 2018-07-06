import { _stringify } from './_support/utils';

import {
  IDataPropertyAttributesMetadata,
} from './configureDataProperty';

const _formatErrorMessage = (propertyAttributesMetadata: IDataPropertyAttributesMetadata): string =>
    `Property \`${propertyAttributesMetadata.key}' cannot be configured using attributes \`${_stringify(propertyAttributesMetadata.attributes)}'`;

export class PropertyConfigurationError extends Error {
  public readonly [Symbol.toStringTag]: string = PropertyConfigurationError.name;

  public constructor(
    propertyAttributesMetadata: IDataPropertyAttributesMetadata, callSite: Function = PropertyConfigurationError,
  ) {
    super(_formatErrorMessage(propertyAttributesMetadata));

    this.name = PropertyConfigurationError.name;
    Reflect.defineProperty(
      this, 'name', { configurable: true, writable: true, enumerable: false },
    );

    if (Error.captureStackTrace !== undefined) {
      Error.captureStackTrace(this, callSite);
    }

    Reflect.defineProperty(
      this, Symbol.toStringTag, { configurable: true, enumerable: false, writable: false },
    );
  };
}
