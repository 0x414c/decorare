import {
  ConstructorT,
  DictT,
  FunctionT,
  OptionalT,
} from 'type-ops';

import { _extendConstructor } from '../_support/_extendConstructor';
import { _ownEntries } from '../_support/_reflect';
import { _DecoratorMetadataInspector } from '../_support/_DecoratorMetadataInspector';

import {
  MethodDecoratorT,
  PropertyKeyT,
} from '../support/types';

import { _bindMethod } from './_support/_bindMethod';
import { _METADATA_KEY } from './_support/_METADATA_KEY';


export interface _IBoundMethodMetadata {
  readonly isBound: boolean;
}


export const bindMethods = <TConstructor extends ConstructorT>(constructor: TConstructor): TConstructor => {
      if (!_DecoratorMetadataInspector.hasDecoratorMetadata(constructor.prototype)) {
        return constructor;
      }

      return _extendConstructor(
          constructor,
          (instance: object): void => {
            const metadataInspector: _DecoratorMetadataInspector = new _DecoratorMetadataInspector();
            const existingMethodMetadata: DictT<_IBoundMethodMetadata> = metadataInspector
                .attach(constructor.prototype)
                .getAllDecoratorMetadata<_IBoundMethodMetadata>(_METADATA_KEY);
            metadataInspector.detach();
            for (const [ propertyKey, boundMethodMetadata ] of _ownEntries(existingMethodMetadata)) {
              _bindMethod(constructor.prototype, instance, propertyKey, boundMethodMetadata);
            }
          },
        );
    };


export type BindMethodDecoratorFactoryT<TMethod extends FunctionT> = () => MethodDecoratorT<TMethod>;


export const bindMethod = <TMethod extends FunctionT>(): MethodDecoratorT<TMethod> => {
      const bindMethodDecorator: MethodDecoratorT<TMethod> = (
          prototypeOrConstructor: object | ConstructorT, propertyKey: PropertyKeyT,
          propertyDescriptor: OptionalT<TypedPropertyDescriptor<TMethod>>,
        ): void => {
            if (propertyDescriptor === undefined) {
              return;
            }

            if (typeof prototypeOrConstructor === 'function') {
              return;
            }

            new _DecoratorMetadataInspector()
              .attach(prototypeOrConstructor)
              .setDecoratorMetadata<_IBoundMethodMetadata>(propertyKey, _METADATA_KEY, { isBound: true })
              .detach();
          };

      return bindMethodDecorator;
    };
