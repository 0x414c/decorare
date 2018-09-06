import { OptionalT } from 'type-ops';

import { PropertyKeyT } from '../support/types';


export const _defineMetadata =
  <TMetadata extends object>(target: object, metadataKey: symbol, metadata: TMetadata): void =>
    Reflect.defineMetadata(metadataKey, metadata, target);


export const _definePropertyMetadata =
  <TMetadata extends object>(target: object, metadataKey: symbol, metadata: TMetadata, propertyKey: PropertyKeyT): void =>
    Reflect.defineMetadata(metadataKey, metadata, target, propertyKey);


export const _deleteMetadata = (target: object, metadataKey: symbol): boolean =>
    Reflect.deleteMetadata(metadataKey, target);


export const _getOwnMetadataKeys = (target: object): ReadonlyArray<symbol> =>
    Reflect.getOwnMetadataKeys(target);


export const _getOwnPropertyMetadataKeys = (target: object, propertyKey: PropertyKeyT): ReadonlyArray<symbol> =>
    Reflect.getOwnMetadataKeys(target, propertyKey);


export const _getOwnMetadata =
  <TMetadata extends object>(target: object, metadataKey: symbol): OptionalT<TMetadata> =>
    Reflect.getOwnMetadata(metadataKey, target);


export const _getOwnPropertyMetadata =
  <TMetadata extends object>(target: object, metadataKey: symbol, propertyKey: PropertyKeyT): OptionalT<TMetadata> =>
    Reflect.getOwnMetadata(metadataKey, target, propertyKey);


export const _hasOwnMetadata = (target: object, metadataKey: symbol): boolean =>
    Reflect.hasOwnMetadata(metadataKey, target);


export const _hasOwnPropertyMetadata = (target: object, metadataKey: symbol, propertyKey: PropertyKeyT): boolean =>
    Reflect.hasOwnMetadata(metadataKey, target, propertyKey);
