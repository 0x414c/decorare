import {
  ConstructorT,
  DictT,
  OptionalT,
  PrimitiveT,
} from 'type-ops';

import { _extendConstructor } from '../_support/_extendConstructor';
import { _ownEntries } from '../_support/_reflect';
import { _DecoratorMetadataInspector } from '../_support/_DecoratorMetadataInspector';

import {
  PropertyDecoratorT,
  PropertyKeyT,
} from '../support/types';

import { _assumeUnreachable } from '../_support/_assumeUnreachable';
import { PropertyConfigurationError } from '../support/PropertyConfigurationError';

import { _setDataPropertyAttributes } from './_support/_setDataPropertyAttributes';
import { _METADATA_KEY } from './_support/_METADATA_KEY';


export interface IDataPropertyAttributes {
  readonly configurable?: boolean;

  readonly enumerable?: boolean;

  readonly writable?: boolean;
}


export const configureDataProperties =
  <TConstructor extends ConstructorT>(constructor: TConstructor): TConstructor => {
      if (!_DecoratorMetadataInspector.hasDecoratorMetadata(constructor.prototype)) {
        return constructor;
      }

      return _extendConstructor(
          constructor,
          (instance: object): void => {
            const metadataInspector: _DecoratorMetadataInspector = new _DecoratorMetadataInspector();
            const existingMethodMetadata: DictT<IDataPropertyAttributes> = metadataInspector
                .attach(constructor.prototype)
                .getAllDecoratorMetadata<IDataPropertyAttributes>(_METADATA_KEY);
            metadataInspector.detach();
            for (const [ propertyKey, dataPropertyAttributes ] of _ownEntries(existingMethodMetadata)) {
              _setDataPropertyAttributes(instance, propertyKey, dataPropertyAttributes);
            }
          },
        );
    };


export type ConfigureDataPropertyDecoratorFactoryT = (attributes: IDataPropertyAttributes) => PropertyDecoratorT;


export const configureDataProperty = (dataPropertyAttributes: IDataPropertyAttributes): PropertyDecoratorT => {
      const configureDataPropertyDecorator: PropertyDecoratorT =
        (prototypeOrConstructor: object | ConstructorT, propertyKey: PropertyKeyT): void => {
            const type: PrimitiveT = typeof prototypeOrConstructor;
            switch (type) {
              case 'object': {
                new _DecoratorMetadataInspector()
                  .attach(prototypeOrConstructor)
                  .setDecoratorMetadata<IDataPropertyAttributes>(propertyKey, _METADATA_KEY, dataPropertyAttributes)
                  .detach();

                break;
              }

              case 'function': {
                const existingPropertyDescriptor: OptionalT<PropertyDescriptor> =
                  Reflect.getOwnPropertyDescriptor(prototypeOrConstructor, propertyKey);
                const { configurable, enumerable, writable, value, }: PropertyDescriptor =
                  (existingPropertyDescriptor !== undefined)
                    ? existingPropertyDescriptor
                    : { };
                const updatedPropertyDescriptor: PropertyDescriptor = {
                    configurable, enumerable, writable, value,
                    ...dataPropertyAttributes,
                  };
                if (!Reflect.defineProperty(prototypeOrConstructor, propertyKey, updatedPropertyDescriptor)) {
                  throw new PropertyConfigurationError(propertyKey, updatedPropertyDescriptor, configureDataProperty);
                }

                break;
              }

              default: {
                _assumeUnreachable(type as never /* HACK. */);

                break;
              }
            }
          };

      return configureDataPropertyDecorator;
    };
