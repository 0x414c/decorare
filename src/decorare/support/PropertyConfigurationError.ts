import {
  ConstructorT,
  FunctionT,
} from 'type-ops';

import { PropertyKeyT } from './types';

import { _stringifyObject } from './_support/_stringify';

import { ErrorJson } from './ErrorJson';


const _formatErrorMessage = (propertyKey: PropertyKeyT, propertyDescriptor: PropertyDescriptor): string =>
  `Property \`${propertyKey.toString()}' cannot be configured using descriptor \`${_stringifyObject(propertyDescriptor)}'`;


export interface PropertyConfigurationErrorJson extends ErrorJson {
  readonly propertyKey: PropertyKey;

  readonly propertyDescriptor: PropertyDescriptor;
}


export class PropertyConfigurationError extends Error {
  public readonly propertyKey: PropertyKey;

  public readonly propertyDescriptor: PropertyDescriptor;

  public readonly [Symbol.toStringTag]: string = PropertyConfigurationError.name;


  public constructor(
    propertyKey: PropertyKeyT, propertyDescriptor: PropertyDescriptor,
    caller: FunctionT | ConstructorT = PropertyConfigurationError,
  ) {
    super(_formatErrorMessage(propertyKey, propertyDescriptor));

    this.name = PropertyConfigurationError.name;
    Reflect.defineProperty(this, 'name', { configurable: true, writable: true, enumerable: false });

    if ((typeof Error.captureStackTrace === 'function') && (Error.captureStackTrace.length === 2)) {
      Error.captureStackTrace(this, caller);
      Reflect.defineProperty(this, 'stack', { configurable: true, writable: true, enumerable: false });
    }

    this.propertyKey = propertyKey;
    Reflect.defineProperty(this, 'propertyKey', { configurable: true, enumerable: false, writable: false });

    this.propertyDescriptor = propertyDescriptor;
    Reflect.defineProperty(this, 'propertyDescriptor', { configurable: true, enumerable: false, writable: false });

    Reflect.defineProperty(this, Symbol.toStringTag, { configurable: true, enumerable: false, writable: false });
  }


  public toJSON(propertyKey_: string): PropertyConfigurationErrorJson {
    return {
      name: this.name,
      message: this.message,
      propertyKey: this.propertyKey,
      propertyDescriptor: this.propertyDescriptor,
    };
  }
}
