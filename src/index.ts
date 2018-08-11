export {
  ClassDecoratorT,
  MethodDecoratorT,
  PropertyDecoratorT,
  PropertyKeyT,
} from './decorators/common';

export {
  configureDataProperty,
  configureDataProperties,
  ConfigureDataPropertyDecoratorFactory,
  IDataPropertyAttributes,
} from './decorators/configureDataProperty/configureDataProperty';

export { PropertyConfigurationError } from './decorators/support/PropertyConfigurationError';

export {
  bindMethod,
  bindMethods,
  BindMethodDecoratorFactoryT,
} from './decorators/bindMethod/bindMethod';
