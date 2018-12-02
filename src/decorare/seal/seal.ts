import {
  ConstructorT,
  DictT,
} from 'type-ops';


export const seal = <TConstructor extends ConstructorT>(constructor: TConstructor): TConstructor => {
  const extendedConstructor: DictT<TConstructor> = {
    [constructor.name]: class extends constructor {
      public constructor(...args: any[]) {
        super(...args);

        Object.seal(this);
      }
    }
  };
  Object.seal(extendedConstructor[constructor.name]);
  Object.seal(extendedConstructor[constructor.name].prototype);

  return extendedConstructor[constructor.name];
};
