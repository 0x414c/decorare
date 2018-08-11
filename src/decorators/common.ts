import {
  ConstructorT,
  DictT,
  FunctionT,
  OptionalT,
} from 'type-ops';

export type PropertyKeyT = string | symbol;

export type ClassDecoratorT<TInstance = object> =
  <TConstructor extends ConstructorT<any[], TInstance>>(constructor: TConstructor) => TConstructor | void;

export type PropertyDecoratorT = (prototypeOrConstructor: object | ConstructorT, propertyKey: PropertyKeyT) => void;

export type MethodDecoratorT<TMethod extends FunctionT> = (
    prototypeOrConstructor: object | ConstructorT, propertyKey: PropertyKeyT,
    propertyDescriptor: OptionalT<TypedPropertyDescriptor<TMethod>>,
  ) => TypedPropertyDescriptor<TMethod> | void;

export const _hasMetadata = (target: object, metadataKey: symbol): boolean =>
    Reflect.hasOwnMetadata(metadataKey, target);

export const _getMetadata = <TMetadata>(target: object, metadataKey: symbol): OptionalT<TMetadata[]> =>
    Reflect.getOwnMetadata(metadataKey, target);

export const _setMetadata = <TMetadata>(target: object, metadataKey: symbol, metadata: TMetadata): void =>
    Reflect.defineMetadata(metadataKey, metadata, target);

export const _addMetadata = <TMetadata>(target: object, metadataKey: symbol, newMetadata: TMetadata): void => {
      const existingMetadata: OptionalT<TMetadata[]> = _getMetadata<TMetadata>(target, metadataKey);
      const updatedMetadata: TMetadata[] = (existingMetadata === undefined)
          ? [newMetadata]
          : [...existingMetadata, newMetadata];
      _setMetadata(target, metadataKey, updatedMetadata);
    };

export const _extendConstructor = <TConstructor extends ConstructorT>(
    constructor: TConstructor, extension: (instance: object) => void,
  ): TConstructor => {
      const extendedConstructor: DictT<TConstructor> = {
          [constructor.name]: class extends constructor {
            public constructor(...args: any[]) {
              super(...args);

              extension(this);
            }
          },
        };

      return extendedConstructor[constructor.name];
    };
