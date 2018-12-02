import { PropertyKeyT } from '../support/types';


export const _ownKeys = (target: object): PropertyKeyT[] => Reflect.ownKeys(target) as PropertyKeyT[] /* HACK. */;


export const _ownEntries = <TValue = any>(target: object): [ PropertyKeyT, TValue ][] =>
  _ownKeys(target).map(_ => [ _, Reflect.get(target, _) ] as [ PropertyKeyT, TValue ] /* HACK. */);


export const _ownValues = <TValue = any>(target: object): TValue[] => _ownKeys(target).map(_ => Reflect.get(target, _));
