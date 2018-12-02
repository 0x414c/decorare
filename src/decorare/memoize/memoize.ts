import {
  ConstructorT,
  OptionalT,
} from 'type-ops';

import {
  AccessorDecoratorT,
  PropertyKeyT,
} from '../support/types';


export type MemoizeAccessorPropertyDecoratorFactoryT<TValue> = () => AccessorDecoratorT<TValue>;


export const memoize = <TValue>(): AccessorDecoratorT<TValue> => {
  const memoizeAccessorPropertyDecorator: AccessorDecoratorT<TValue> = (
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
    let valueCache: OptionalT<TValue>;
    let valueIsCached: boolean = false;
    const updatedPropertyDescriptor: TypedPropertyDescriptor<TValue> = {
        configurable, enumerable,
        get: (get !== undefined)
          ? function (this: object): TValue {
            if (!valueIsCached) {
              valueCache = Reflect.apply(get, this, [ ]);
              valueIsCached = true;
            }

            return valueCache!;
          }
          : undefined,
        set: (set !== undefined)
          ? function (this: object, newValue: TValue): void {
            Reflect.apply(set, this, [ newValue ]);
            if (valueIsCached) {
              valueCache = undefined;
              valueIsCached = false;
            }
          }
          : undefined,
      };

    return updatedPropertyDescriptor;
  };

  return memoizeAccessorPropertyDecorator;
};
