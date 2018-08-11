import { OptionalT } from 'type-ops';

import { PropertyConfigurationError } from '../../support/PropertyConfigurationError';

import {
  configureDataProperties,
  _IDataPropertyAttributesMetadata,
  IDataPropertyAttributes,
} from '../configureDataProperty';

export const _setDataPropertyAttributes =
  (instance: object, dataPropertyAttributesMetadata: _IDataPropertyAttributesMetadata): void | never => {
      const existingPropertyDescriptor: OptionalT<PropertyDescriptor> =
        Reflect.getOwnPropertyDescriptor(instance, dataPropertyAttributesMetadata.propertyName);
      const { configurable, enumerable, writable }: IDataPropertyAttributes = (existingPropertyDescriptor !== undefined)
          ? existingPropertyDescriptor
          : { };
      const updatedPropertyDescriptor: PropertyDescriptor = {
          configurable, enumerable, writable,
          ...dataPropertyAttributesMetadata.propertyAttributes,
        };
      if (!Reflect.defineProperty(instance, dataPropertyAttributesMetadata.propertyName, updatedPropertyDescriptor)) {
        throw new PropertyConfigurationError(
            dataPropertyAttributesMetadata.propertyName, updatedPropertyDescriptor, configureDataProperties,
          );
      }
    };

export interface _IStringifyArrayOptions {
  separator: string;
  start: string;
  end: string;
  padding: string;
}

export const _stringifyArray =
  <TElement>(
    sequence: ReadonlyArray<TElement>, formatter: (element: TElement) => string,
    { separator, start, end, padding }: _IStringifyArrayOptions = { separator: ',', start: '', end: '', padding: '' },
  ): string => {
      switch (sequence.length) {
        case 0: {
          return `${start}${padding}${end}`;
        }

        case 1: {
          return `${start}${padding}${formatter(sequence[0])}${padding}${end}`;
        }

        default: {
          const [first, ...rest]: ReadonlyArray<TElement> = sequence;
          const formatted: string = rest
              .reduce<string>(
                (result: string, element: TElement) => `${result}${separator}${padding}${formatter(element)}`,
                formatter(first),
              );

          return `${start}${padding}${formatted}${padding}${end}`;
        }
      }
    };

export const _formatEntry = (target: object, propertyKey: PropertyKey) =>
    `${propertyKey.toString()}: ${Reflect.get(target, propertyKey)}`;

export const _stringifyObject = (target: object): string =>
    _stringifyArray(
      Reflect.ownKeys(target), (propertyKey: PropertyKey) => _formatEntry(target, propertyKey),
      { separator: ',', start: '{', end: '}', padding: ' ' },
    );
