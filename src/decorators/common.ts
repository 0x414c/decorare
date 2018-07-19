import { OptionalT } from 'type-ops';

export type PropertyKey = string | symbol;

export type Constructor<T> = new(...args: any[]) => T;

export type ClassDecorator<T> =
  <TConstructor extends Constructor<T>>(constructor: TConstructor) => TConstructor | never;

export type PropertyDecorator = (target: object, propertyKey: PropertyKey) => void;

export type MethodDecorator =
  (target: object, propertyKey: PropertyKey, descriptor: PropertyDescriptor) => PropertyDescriptor | void;
