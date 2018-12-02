import {
  ConstructorT,
  DictT,
} from 'type-ops';


export const freeze = <TConstructor extends ConstructorT>(constructor: TConstructor): TConstructor => {
  const extendedConstructor: DictT<TConstructor> = {
    [constructor.name]: class extends constructor {
      public constructor(...args: any[]) {
        super(...args);

        Object.freeze(this);
      }
    }
  };
  Object.freeze(extendedConstructor[constructor.name]);
  Object.freeze(extendedConstructor[constructor.name].prototype);

  return extendedConstructor[constructor.name];
};
