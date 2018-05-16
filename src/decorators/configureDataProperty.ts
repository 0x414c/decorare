import 'reflect-metadata';

import { OptionalT } from 'type-ops';

import {
  ClassDecoratorT,
  IConstructor,
  PropertyDecorator,
} from './common';

export type IDataPropertyAttributes = Pick<PropertyDescriptor, 'configurable' | 'enumerable' | 'writable'>;

interface _IDataPropertyAttributesMetadata {
  key: PropertyKey;
  attributes: IDataPropertyAttributes;
}

const _METADATA_KEY: symbol = Symbol.for('ts-decorators.configureDataProperty');

const _setAttributes = (target: object, propertyAttributesMetadata: _IDataPropertyAttributesMetadata): void => {
    const oldAttributes: OptionalT<PropertyDescriptor> =
      Object.getOwnPropertyDescriptor(target, propertyAttributesMetadata.key);
    const { configurable, enumerable, writable }: IDataPropertyAttributes = (oldAttributes !== undefined)
        ? oldAttributes
        : { };
    const newAttributes: PropertyDescriptor = {
        configurable,
        enumerable,
        writable,
        ...propertyAttributesMetadata.attributes,
      };
    Object.defineProperty(target, propertyAttributesMetadata.key, newAttributes);
  };

export const configureDataProperties: ClassDecoratorT<object> =
  <TConstructor extends IConstructor<object>>(constructor: TConstructor): TConstructor => {
    const { name, prototype }: { name: string; prototype: object; } = constructor;
    if (!Reflect.hasOwnMetadata(_METADATA_KEY, prototype)) {
      return constructor;
    }

    const extended: { [propertyKey: string]: TConstructor; } = {
        [name]: class extends constructor {
          public constructor(...args: any[]) {
            super(...args);
            const metadata: _IDataPropertyAttributesMetadata[] = Reflect.getOwnMetadata(_METADATA_KEY, prototype);
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
        const newPropertyAttributesMetadata: _IDataPropertyAttributesMetadata = {
            attributes,
            key: propertyKey,
          };
        const oldPropertyAttributesMetadata: OptionalT<_IDataPropertyAttributesMetadata[]> =
          Reflect.getOwnMetadata(_METADATA_KEY, target);
        const newMetadata: _IDataPropertyAttributesMetadata[] = (oldPropertyAttributesMetadata !== undefined)
            ? [...oldPropertyAttributesMetadata, newPropertyAttributesMetadata]
            : [newPropertyAttributesMetadata];
        Reflect.defineMetadata(_METADATA_KEY, newMetadata, target);
      };

    return decorator;
  };
