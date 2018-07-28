import { OptionalT } from 'type-ops';

import { PropertyConfigurationError } from '../../support/PropertyConfigurationError';

import {
  bindMethods,
  _IMethodMetadata,
} from '../bindMethod';

export const _bindMethod = (prototype: object, instance: object, methodMetadata: _IMethodMetadata): void | never => {
      const existingPropertyDescriptor: OptionalT<PropertyDescriptor> =
        Reflect.getOwnPropertyDescriptor(prototype, methodMetadata.methodName);
      const { configurable, enumerable, writable, value }: PropertyDescriptor =
        (existingPropertyDescriptor !== undefined)
          ? existingPropertyDescriptor
          : { };
      if (typeof value === 'function') {
        const updatedPropertyDescriptor: PropertyDescriptor = {
            configurable, enumerable, writable,
            value: value.bind(instance),
          };
        if (!Reflect.defineProperty(instance, methodMetadata.methodName, updatedPropertyDescriptor)) {
          throw new PropertyConfigurationError(methodMetadata.methodName, updatedPropertyDescriptor, bindMethods);
        }
      }
    };
