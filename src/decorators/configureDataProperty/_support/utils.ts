import { OptionalT } from 'type-ops';

import {
  configureDataProperties,
  _IDataPropertyAttributesMetadata,
  IDataPropertyAttributes,
} from '../configureDataProperty';

import { PropertyConfigurationError } from '../PropertyConfigurationError';

export const _setDataPropertyAttributes =
  (instance: object, dataPropertyAttributesMetadata: _IDataPropertyAttributesMetadata): void | never => {
      const existingAttributes: OptionalT<PropertyDescriptor> =
        Reflect.getOwnPropertyDescriptor(instance, dataPropertyAttributesMetadata.propertyName);
      const { configurable, enumerable, writable }: IDataPropertyAttributes = (existingAttributes !== undefined)
          ? existingAttributes
          : { };
      const newAttributes: PropertyDescriptor = {
          configurable, enumerable, writable,
          ...dataPropertyAttributesMetadata.propertyAttributes,
        };
      if (!Reflect.defineProperty(instance, dataPropertyAttributesMetadata.propertyName, newAttributes)) {
        throw new PropertyConfigurationError(dataPropertyAttributesMetadata, configureDataProperties);
      }
    };

export interface _IStringifyArrayOptions {
  separator: string;
  start: string;
  end: string;
}

export const _stringifyArray =
  <TElement>(
    sequence: ReadonlyArray<TElement>, formatter: (element: TElement) => string,
    { separator, start, end }: _IStringifyArrayOptions = { separator: ',', start: '', end: '' },
  ): string => {
      const [first, ...rest]: ReadonlyArray<TElement> = sequence;
      const formatted: string = rest
          .reduce<string>(
            (result: string, element: TElement) => `${result}${separator}${formatter(element)}`, formatter(first),
          );

      return `${start}${formatted}${end}`;
    };

export const _formatEntry = (target: object, propertyKey: PropertyKey) =>
    `${propertyKey.toString()}: ${Reflect.get(target, propertyKey)}`;

export const _stringifyObject = (target: object): string =>
    _stringifyArray(
      Reflect.ownKeys(target), (propertyKey: PropertyKey) => _formatEntry(target, propertyKey),
      { separator: ', ', start: '{ ', end: ' }'},
    );
