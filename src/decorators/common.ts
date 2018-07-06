export type PropertyKey = string | symbol;

export type ConstructorT<Type> = new(...args: any[]) => Type;

export type ClassDecoratorT<Type> =
  <Constructor extends ConstructorT<Type>>(constructor: Constructor) => Constructor | never;

export type PropertyDecorator = (target: object, propertyKey: PropertyKey) => void;
