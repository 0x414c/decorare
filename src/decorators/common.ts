export type PropertyKey = string | symbol;

export type IConstructor<Type> = new(...args: any[]) => Type;

export type ClassDecoratorT<Type> = <Constructor extends IConstructor<Type>>(constructor: Constructor) => Constructor;

export type PropertyDecorator = (target: object, propertyKey: PropertyKey) => void;
