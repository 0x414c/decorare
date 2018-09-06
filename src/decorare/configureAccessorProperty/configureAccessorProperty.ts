import {
  ConstructorT,
  OptionalT,
} from 'type-ops';

import {
  AccessorDecoratorT,
  PropertyKeyT,
} from '../support/types';


export interface IAccessorPropertyAttributes {
  readonly configurable?: boolean;

  readonly enumerable?: boolean;
}


export type ConfigureAccessorPropertyDecoratorFactoryT<TValue> =
  (accessorPropertyAttributes: IAccessorPropertyAttributes) => AccessorDecoratorT<TValue>;


export const configureAccessorProperty =
  <TValue>(accessorPropertyAttributes: IAccessorPropertyAttributes): AccessorDecoratorT<TValue> => {
      const configureAccessorPropertyDecorator: AccessorDecoratorT<TValue> = (
          prototypeOrConstructor: object | ConstructorT, propertyKey: PropertyKeyT,
          propertyDescriptor: OptionalT<TypedPropertyDescriptor<TValue>>,
        ): void | TypedPropertyDescriptor<TValue> => {
            if (propertyDescriptor === undefined) {
              return;
            }

            const existingPropertyDescriptor: OptionalT<TypedPropertyDescriptor<TValue>> =
              Reflect.getOwnPropertyDescriptor(prototypeOrConstructor, propertyKey);
            const { configurable, enumerable, get, set }: TypedPropertyDescriptor<TValue> =
              (existingPropertyDescriptor !== undefined)
                ? existingPropertyDescriptor
                : { };
            const updatedPropertyDescriptor: TypedPropertyDescriptor<TValue> = {
                configurable, enumerable, get, set,
                ...accessorPropertyAttributes,
              };

            return updatedPropertyDescriptor;
          };

      return configureAccessorPropertyDecorator;
    };
