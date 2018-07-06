export type PropertyKey = string | symbol;

export interface IConstructor<Type> extends Function {
  new(...args: any[]): Type;
}

export type ClassDecoratorT<Type> = <Ctor extends IConstructor<Type>>(ctor: Ctor) => Ctor;

export type PropertyDecorator = (target: object, ownPropertyKey: PropertyKey) => void;
