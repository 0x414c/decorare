import {
  _ownEntries,
  _ownPropertyKeys,
} from '../../_support/_reflect';

import { PropertyKeyT } from '../types';


export interface _IStringifyArrayOptions {
  readonly separator: string;

  readonly start: string;

  readonly end: string;

  readonly padding: string;
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
          const [ first, ...rest ]: ReadonlyArray<TElement> = sequence;
          const formatted: string = rest
              .reduce<string>(
                (result: string, element: TElement) => `${result}${separator}${padding}${formatter(element)}`,
                formatter(first),
              );

          return `${start}${padding}${formatted}${padding}${end}`;
        }
      }
    };


export const _formatObjectEntry = ([ propertyKey, propertyValue ]: [ PropertyKeyT, any ]): string =>
    `${propertyKey.toString()}: ${propertyValue.toString()}`;


export const _stringifyObject = (target: object): string =>
    _stringifyArray(
      _ownEntries(target), _ => _formatObjectEntry(_), { separator: ',', start: '{', end: '}', padding: ' ' },
    );
