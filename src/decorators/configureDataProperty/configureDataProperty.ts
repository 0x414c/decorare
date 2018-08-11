import { ConstructorT } from 'type-ops';

import {
  _addMetadata,
  _extendConstructor,
  _getMetadata,
  _hasMetadata,
  ClassDecoratorT,
  PropertyDecoratorT,
  PropertyKeyT,
} from '../common';

import { _METADATA_KEY } from './_support/config';

import { _setDataPropertyAttributes } from './_support/utils';

export type IDataPropertyAttributes = Pick<PropertyDescriptor, 'configurable' | 'enumerable' | 'writable'>;

export interface _IDataPropertyAttributesMetadata {
  propertyAttributes: IDataPropertyAttributes;
  propertyName: PropertyKeyT;
}

export const configureDataProperties: ClassDecoratorT =
  <TConstructor extends ConstructorT>(constructor: TConstructor): TConstructor => {
      if (!_hasMetadata(constructor.prototype, _METADATA_KEY)) {
        return constructor;
      }

      return _extendConstructor(
          constructor,
          (instance: object): void => {
            const existingDataPropertyAttributesMetadata: _IDataPropertyAttributesMetadata[] =
              _getMetadata<_IDataPropertyAttributesMetadata>(constructor.prototype, _METADATA_KEY)!;
            for (const dataPropertyAttributesMetadata of existingDataPropertyAttributesMetadata) {
              _setDataPropertyAttributes(instance, dataPropertyAttributesMetadata);
            }
          },
        );
    };

export type ConfigureDataPropertyDecoratorFactory = (attributes: IDataPropertyAttributes) => PropertyDecoratorT;

export const configureDataProperty: ConfigureDataPropertyDecoratorFactory =
  (attributes: IDataPropertyAttributes): PropertyDecoratorT => {
      const configureDataPropertyDecorator: PropertyDecoratorT =
        (prototypeOrConstructor: object | ConstructorT, propertyKey: PropertyKeyT): void => {
            if (typeof prototypeOrConstructor === 'function') {
              return;
            }

            const newDataPropertyAttributesMetadata: _IDataPropertyAttributesMetadata = {
                propertyAttributes: attributes, propertyName: propertyKey,
              };
            _addMetadata(prototypeOrConstructor, _METADATA_KEY, newDataPropertyAttributesMetadata);
          };

      return configureDataPropertyDecorator;
    };
