import { OptionalT } from 'type-ops';

import {
  _addMetadata,
  _extendConstructor,
  _getMetadata,
  _hasMetadata,
  AnyFunctionT,
  ClassDecoratorT,
  ConstructorT,
  MethodDecoratorT,
  PropertyKeyT,
} from '../common';

import { _METADATA_KEY } from './_support/config';

import { _bindMethod } from './_support/utils';

export interface _IMethodMetadata {
  methodName: PropertyKeyT;
}

export const bindMethods: ClassDecoratorT<object> =
  <TConstructor extends ConstructorT<object>>(constructor: TConstructor): TConstructor => {
      if (!_hasMetadata(constructor.prototype, _METADATA_KEY)) {
        return constructor;
      }

      return _extendConstructor(
          constructor,
          (instance: object): void => {
            const existingMethodMetadata: _IMethodMetadata[] =
              _getMetadata<_IMethodMetadata>(constructor.prototype, _METADATA_KEY)!;
            for (const methodMetadata of existingMethodMetadata) {
              _bindMethod(constructor.prototype, instance, methodMetadata);
            }
          },
        );
    };

export type BindMethodDecoratorFactoryT<TMethod extends AnyFunctionT> = () => MethodDecoratorT<TMethod>;

export const bindMethod: BindMethodDecoratorFactoryT<AnyFunctionT> =
  <TMethod extends AnyFunctionT>(): MethodDecoratorT<TMethod> => {
      const bindMethodDecorator = (
          prototypeOrConstructor: object | AnyFunctionT, propertyKey: PropertyKeyT,
          propertyDescriptor: OptionalT<TypedPropertyDescriptor<TMethod>>,
        ): void => {
            if (propertyDescriptor === undefined) {
              return;
            }

            if (typeof prototypeOrConstructor === 'function') {
              return;
            }

            const newMethodMetadata: _IMethodMetadata = { methodName: propertyKey };
            _addMetadata(prototypeOrConstructor, _METADATA_KEY, newMethodMetadata);
          };

      return bindMethodDecorator;
    };
