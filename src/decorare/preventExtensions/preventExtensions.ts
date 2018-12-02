import {
  ConstructorT,
  DictT,
} from 'type-ops';


export const preventExtensions = <TConstructor extends ConstructorT>(constructor: TConstructor): TConstructor => {
  const extendedConstructor: DictT<TConstructor> = {
    [constructor.name]: class extends constructor {
      public constructor(...args: any[]) {
        super(...args);

        Object.preventExtensions(this);
      }
    }
  };
  Object.preventExtensions(extendedConstructor[constructor.name]);
  Object.preventExtensions(extendedConstructor[constructor.name].prototype);

  return extendedConstructor[constructor.name];
};
