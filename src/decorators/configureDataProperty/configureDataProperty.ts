import {
  DictT,
  OptionalT,
} from 'type-ops';

import {
  ClassDecorator,
  Constructor,
  PropertyDecorator,
  PropertyKey,
} from '../common';

import { _METADATA_KEY } from './_support/config';

import { _setAttributes } from './_support/utils';

export type IDataPropertyAttributes = Pick<PropertyDescriptor, 'configurable' | 'enumerable' | 'writable'>;

export interface IDataPropertyAttributesMetadata {
  key: PropertyKey;
  attributes: IDataPropertyAttributes;
}

export const configureDataProperties: ClassDecorator<{ }> =
  <TConstructor extends Constructor<{ }>>(constructor: TConstructor): TConstructor => {
    const { name, prototype }: { name: string; prototype: object; } = constructor;
    if (!Reflect.hasOwnMetadata(_METADATA_KEY, prototype)) {
      return constructor;
    }

    const extended: DictT<TConstructor> = {
        [name]: class extends constructor {
          public constructor(...args: any[]) {
            super(...args);

            const metadata: IDataPropertyAttributesMetadata[] = Reflect.getOwnMetadata(_METADATA_KEY, prototype);
            for (const propertyAttributesMetadata of metadata) {
              _setAttributes(this, propertyAttributesMetadata);
            }
          };
        },
      };

    return extended[name];
  };

export type ConfigureDataPropertyDecoratorFactory = (attributes: IDataPropertyAttributes) => PropertyDecorator;

export const configureDataProperty: ConfigureDataPropertyDecoratorFactory =
  (attributes: IDataPropertyAttributes): PropertyDecorator => {
    const decorator: PropertyDecorator = (target: object, propertyKey: PropertyKey): void => {
        const newPropertyAttributesMetadata: IDataPropertyAttributesMetadata = {
            attributes,
            key: propertyKey,
          };
        const oldPropertyAttributesMetadata: OptionalT<IDataPropertyAttributesMetadata[]> =
          Reflect.getOwnMetadata(_METADATA_KEY, target);
        const newMetadata: IDataPropertyAttributesMetadata[] = (oldPropertyAttributesMetadata !== undefined)
            ? [...oldPropertyAttributesMetadata, newPropertyAttributesMetadata]
            : [newPropertyAttributesMetadata];
        Reflect.defineMetadata(_METADATA_KEY, newMetadata, target);
      };

    return decorator;
  };
