import {
  DictT,
  OptionalT,
} from 'type-ops';

import {
  ClassDecoratorT,
  ConstructorT,
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

export const configureDataProperties: ClassDecoratorT<object> =
  <TConstructor extends ConstructorT<object>>(constructor: TConstructor): TConstructor => {
      const { name, prototype }: { name: string; prototype: object; } = constructor;
      if (!Reflect.hasOwnMetadata(_METADATA_KEY, prototype)) {
        return constructor;
      }

      const extended: DictT<TConstructor> = {
          [name]: class extends constructor {
            public constructor(...args: any[]) {
              super(...args);

              const existingMethodMetadata: _IDataPropertyAttributesMetadata[] =
                Reflect.getOwnMetadata(_METADATA_KEY, prototype);
              for (const propertyAttributesMetadata of existingMethodMetadata) {
                _setDataPropertyAttributes(this, propertyAttributesMetadata);
              }
            };
          },
        };

      return extended[name];
    };

export type ConfigureDataPropertyDecoratorFactory = (attributes: IDataPropertyAttributes) => PropertyDecoratorT;

export const configureDataProperty: ConfigureDataPropertyDecoratorFactory =
  (attributes: IDataPropertyAttributes): PropertyDecoratorT => {
      const configureDataPropertyDecorator: PropertyDecoratorT = (target: object, propertyKey: PropertyKeyT): void => {
          const newPropertyAttributesMetadata: _IDataPropertyAttributesMetadata = {
              propertyAttributes: attributes, propertyName: propertyKey,
            };
          const oldPropertyAttributesMetadata: OptionalT<_IDataPropertyAttributesMetadata[]> =
            Reflect.getOwnMetadata(_METADATA_KEY, target);
          const newMetadata: _IDataPropertyAttributesMetadata[] = (oldPropertyAttributesMetadata !== undefined)
              ? [...oldPropertyAttributesMetadata, newPropertyAttributesMetadata]
              : [newPropertyAttributesMetadata];
          Reflect.defineMetadata(_METADATA_KEY, newMetadata, target);
      };

      return configureDataPropertyDecorator;
    };
