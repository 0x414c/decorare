import {
  ConstructorT,
  DictT,
} from 'type-ops';


export const monostate = <TConstructor extends ConstructorT>(constructor: TConstructor): TConstructor => {
      let instance: InstanceType<TConstructor>;
      const extendedConstructor: DictT<TConstructor> = {
          [constructor.name]: class extends constructor {
            public constructor(...args: any[]) {
              if (instance !== undefined) {
                return instance;
              }

              super(...args);

              instance = this as InstanceType<TConstructor> /* HACK. */;
            }
          }
        };

      return extendedConstructor[constructor.name];
    };
