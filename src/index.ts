export {
  ConstructorT,
  PropertyDecorator,
  PropertyKey,
  ClassDecoratorT,
} from './decorators/common';

export {
  configureDataProperty,
  configureDataProperties,
  ConfigureDataPropertyDecoratorFactory,
  IDataPropertyAttributes,
} from './decorators/configureDataProperty/configureDataProperty';

export { PropertyConfigurationError } from './decorators/configureDataProperty/PropertyConfigurationError';
