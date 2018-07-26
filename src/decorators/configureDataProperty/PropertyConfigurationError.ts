import { _stringifyObject } from './_support/utils';

import {
  _IDataPropertyAttributesMetadata,
} from './configureDataProperty';

const _formatErrorMessage = (dataPropertyAttributesMetadata: _IDataPropertyAttributesMetadata): string => {
      const { propertyAttributes, propertyName }: _IDataPropertyAttributesMetadata = dataPropertyAttributesMetadata;

      return `Property \`${propertyName.toString()}' cannot be configured using attributes \`${_stringifyObject(propertyAttributes)}'`;
    };

export class PropertyConfigurationError extends Error {
  public readonly [Symbol.toStringTag]: string = PropertyConfigurationError.name;

  public constructor(
      propertyAttributesMetadata: _IDataPropertyAttributesMetadata, callSite: Function = PropertyConfigurationError,
  ) {
    super(_formatErrorMessage(propertyAttributesMetadata));

    this.name = PropertyConfigurationError.name;
    Reflect.defineProperty(this, 'name', { configurable: true, writable: true, enumerable: false });

    if (Error.captureStackTrace !== undefined) {
      Error.captureStackTrace(this, callSite);
    }

    Reflect.defineProperty(this, Symbol.toStringTag, { configurable: true, enumerable: false, writable: false });
  };
};
