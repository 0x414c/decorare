import { OptionalT } from 'type-ops';

import {
  configureDataProperties,
  IDataPropertyAttributes,
  IDataPropertyAttributesMetadata,
} from '../configureDataProperty';

import { PropertyConfigurationError } from '../PropertyConfigurationError';

export const _setAttributes = (
    target: object, propertyAttributesMetadata: IDataPropertyAttributesMetadata,
  ): void | never => {
    const oldAttributes: OptionalT<PropertyDescriptor> =
      Reflect.getOwnPropertyDescriptor(target, propertyAttributesMetadata.key);
    const { configurable, enumerable, writable }: IDataPropertyAttributes = (oldAttributes !== undefined)
        ? oldAttributes
        : { };
    const newAttributes: PropertyDescriptor = {
        configurable,
        enumerable,
        writable,
        ...propertyAttributesMetadata.attributes,
      };
    if (!Reflect.defineProperty(target, propertyAttributesMetadata.key, newAttributes)) {
      throw new PropertyConfigurationError(propertyAttributesMetadata, configureDataProperties);
    }
  };

export const _join = <TElement>(
    sequence: ReadonlyArray<TElement>, formatter: (element: TElement) => string,
    separator: string, start: string, end: string,
  ): string => {
    const [first, ...rest]: ReadonlyArray<TElement> = sequence;

    const formatted: string = rest
        .reduce<string>(
          (result: string, element: TElement) => `${result}${separator}${formatter(element)}`,
          formatter(first),
        );

    return `${start}${formatted}${end}`;
  };

export const _formatEntry = (target: object, propertyKey: PropertyKey) =>
    `${propertyKey}: ${Reflect.get(target, propertyKey)}`;

export const _stringify = (target: object): string =>
    _join(Reflect.ownKeys(target), (propertyKey: PropertyKey) => _formatEntry(target, propertyKey), ', ', '{ ', ' }');
