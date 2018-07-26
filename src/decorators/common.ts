import {
  DictT,
  OptionalT,
} from 'type-ops';

export type AnyFunctionT = (...args: any[]) => any;

export type PropertyKeyT = string | symbol;

export type ConstructorT<TInstance> = new(...args: any[]) => TInstance;

export type ClassDecoratorT<TInstance> = <TConstructor extends ConstructorT<TInstance>>(constructor: TConstructor) =>
    TConstructor | void;

export type PropertyDecoratorT = (prototypeOrConstructor: object, propertyKey: PropertyKeyT) => void;

export type MethodDecoratorT<TMethod extends AnyFunctionT> = (
    prototypeOrConstructor: object, propertyKey: PropertyKeyT,
    propertyDescriptor: OptionalT<TypedPropertyDescriptor<TMethod>>,
  ) =>
    TypedPropertyDescriptor<TMethod> | void;

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

export const _extendConstructor = <TConstructor extends ConstructorT<object>>(
    constructor: TConstructor, extension: (instance: object) => void,
  ): TConstructor => {
      const extendedConstructor: DictT<TConstructor> = {
          [constructor.name]: class extends constructor {
            public constructor(...args: any[]) {
              super(...args);

              extension(this);
            };
          },
        };

      return extendedConstructor[constructor.name];
    };
