import { PropertyKeyT } from '../support/types';


export const _ownPropertyKeys = (target: object): PropertyKeyT[] =>
    Reflect.ownKeys(target) as PropertyKeyT[] /* HACK. */;


export const _ownEntries = <TValue = any>(target: object): [ PropertyKeyT, TValue ][] =>
    _ownPropertyKeys(target).map(_ => [ _, Reflect.get(target, _) ] as [ PropertyKeyT, TValue ] /* HACK. */);
