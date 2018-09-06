import { OptionalT } from 'type-ops';

import { PropertyKeyT } from '../../support/types';

import { PropertyConfigurationError } from '../../support/PropertyConfigurationError';

import {
  _IBoundMethodMetadata,
  bindMethods,
} from '../bindMethod';


export const _bindMethod = (
    prototype: object, instance: object, propertyKey: PropertyKeyT, boundMethodMetadata: _IBoundMethodMetadata,
  ): void | never => {
      if (!boundMethodMetadata.isBound) {
        return;
      }

      const existingPropertyDescriptor: OptionalT<PropertyDescriptor> =
        Reflect.getOwnPropertyDescriptor(prototype, propertyKey);
      const { configurable, enumerable, writable, value }: PropertyDescriptor = (existingPropertyDescriptor !== undefined)
          ? existingPropertyDescriptor
          : { };
      if (typeof value === 'function') {
        const updatedPropertyDescriptor: PropertyDescriptor = {
            configurable, enumerable, writable,
            value: value.bind(instance),
          };
        if (!Reflect.defineProperty(instance, propertyKey, updatedPropertyDescriptor)) {
          throw new PropertyConfigurationError(propertyKey, updatedPropertyDescriptor, bindMethods);
        }
      }
    };
