import { OptionalT } from 'type-ops';

import { PropertyKeyT } from '../../support/types';

import { PropertyConfigurationError } from '../../support/PropertyConfigurationError';

import {
  configureDataProperties,
  IDataPropertyAttributes,
} from '../configureDataProperty';


export const _setDataPropertyAttributes =
  (instance: object, propertyKey: PropertyKeyT, dataPropertyAttributes: IDataPropertyAttributes): void | never => {
      const existingPropertyDescriptor: OptionalT<PropertyDescriptor> =
        Reflect.getOwnPropertyDescriptor(instance, propertyKey);
      const { configurable, enumerable, writable, value }: PropertyDescriptor = (existingPropertyDescriptor !== undefined)
          ? existingPropertyDescriptor
          : { };
      const updatedPropertyDescriptor: PropertyDescriptor = {
          configurable, enumerable, writable, value,
          ...dataPropertyAttributes,
        };
      if (!Reflect.defineProperty(instance, propertyKey, updatedPropertyDescriptor)) {
        throw new PropertyConfigurationError(propertyKey, updatedPropertyDescriptor, configureDataProperties);
      }
    };
