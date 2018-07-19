import {
  DictT,
  OptionalT,
} from 'type-ops';

import {
  ClassDecorator,
  Constructor,
  MethodDecorator,
  PropertyKey,
} from '../common';

import { _METADATA_KEY } from './_support/config';

export interface IMethodMetadata {
  key: PropertyKey;
  bound: boolean;
}

export const bindMethods: ClassDecorator<{ }> =
  <TConstructor extends Constructor<{ }>>(constructor: TConstructor): TConstructor => {
    const { name, prototype }: { name: string; prototype: object; } = constructor;
    if (!Reflect.hasOwnMetadata(_METADATA_KEY, prototype)) {
      return constructor;
    }

    const extended: DictT<TConstructor> = {
        [name]: class extends constructor {
          public constructor(...args: any[]) {
            super(...args);

            const metadata: IMethodMetadata[] = Reflect.getOwnMetadata(_METADATA_KEY, prototype);
            for (const methodMetadata of metadata) {
              if (methodMetadata.bound && ((this as any)[methodMetadata.key] !== undefined)) {
                (this as any)[methodMetadata.key] = (this as any)[methodMetadata.key].bind(this);
              }
            }
          };
        },
      };

    return extended[name];
  };

export type BindMethodDecoratorFactory = () => MethodDecorator;

export const bindMethod: BindMethodDecoratorFactory = (): MethodDecorator => {
    const decorator: MethodDecorator = (
        target: object, propertyKey: PropertyKey, descriptor: OptionalT<TypedPropertyDescriptor<Function>>,
      ): TypedPropertyDescriptor<Function> | void => {
        const newMethodMetadata: IMethodMetadata = {
            key: propertyKey,
            bound: true,
          };
        const oldMethodMetadata: OptionalT<IMethodMetadata[]> =
            Reflect.getOwnMetadata(_METADATA_KEY, target);
        const newMetadata: IMethodMetadata[] = (oldMethodMetadata !== undefined)
            ? [...oldMethodMetadata, newMethodMetadata]
            : [newMethodMetadata];
        Reflect.defineMetadata(_METADATA_KEY, newMetadata, target);
      };

    return decorator;
  };
