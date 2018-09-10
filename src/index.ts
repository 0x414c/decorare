export {
  bindMethod,
  bindMethods,
  BindMethodDecoratorFactoryT,
} from './decorare/bindMethod/bindMethod';

export {
  configureAccessorProperty,
  ConfigureAccessorPropertyDecoratorFactoryT,
  IAccessorPropertyAttributes,
} from './decorare/configureAccessorProperty/configureAccessorProperty';

export {
  configureDataProperty,
  configureDataProperties,
  ConfigureDataPropertyDecoratorFactoryT,
  IDataPropertyAttributes,
} from './decorare/configureDataProperty/configureDataProperty';

export { freeze } from './decorare/freeze/freeze';

export {
  memoize,
  MemoizeAccessorPropertyDecoratorFactoryT,
} from './decorare/memoize/memoize';

export { monostate } from './decorare/monostate/monostate';

export { preventExtensions } from './decorare/preventExtensions/preventExtensions';

export { seal } from './decorare/seal/seal';

export {
  AccessorDecoratorT,
  ClassDecoratorT,
  MethodDecoratorT,
  PropertyDecoratorT,
  PropertyKeyT,
} from './decorare/support/types';
export { ErrorJson } from './decorare/support/ErrorJson';
export {
  PropertyConfigurationError,
  PropertyConfigurationErrorJson,
} from './decorare/support/PropertyConfigurationError';
export {
  TargetError,
  TargetErrorJson,
} from './decorare/support/TargetError';
