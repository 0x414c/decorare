import {
  ConstructorT,
  DictT,
} from 'type-ops';


export const _extendConstructor = <TConstructor extends ConstructorT>(
    constructor: TConstructor, extension: (instance: object) => void | InstanceType<TConstructor>,
  ): TConstructor => {
      const extendedConstructor: DictT<TConstructor> = {
          [constructor.name]: class extends constructor {
            public constructor(...args: any[]) {
              super(...args);

              return extension(this) as InstanceType<TConstructor> /* HACK. */;
            }
          },
        };

      return extendedConstructor[constructor.name];
    };
