import {
  ConstructorT,
  FunctionT,
  OptionalT,
} from 'type-ops';


export type PropertyKeyT = string | symbol;


export type ClassDecoratorT<TInstance = object> =
  <TConstructor extends ConstructorT<any[], TInstance>>(constructor: TConstructor) => TConstructor | void;


export type PropertyDecoratorT = (prototypeOrConstructor: object | ConstructorT, propertyKey: PropertyKeyT) => void;


export type AccessorDecoratorT<TValue> = (
    prototypeOrConstructor: object | ConstructorT, propertyKey: PropertyKeyT,
    propertyDescriptor: OptionalT<TypedPropertyDescriptor<TValue>>,
  ) => TypedPropertyDescriptor<TValue> | void;


export type MethodDecoratorT<TMethod extends FunctionT> = (
    prototypeOrConstructor: object | ConstructorT, propertyKey: PropertyKeyT,
    propertyDescriptor: OptionalT<TypedPropertyDescriptor<TMethod>>,
  ) => TypedPropertyDescriptor<TMethod> | void;
