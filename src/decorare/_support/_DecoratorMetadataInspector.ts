import {
  DictT,
  OptionalT,
} from 'type-ops';

import { PropertyKeyT } from '../support/types';

import {
  _hasOwnMetadata,
  _getOwnMetadata,
  _defineMetadata,
} from './_metadata';

import { _ownPropertyKeys } from './_reflect';

import { _METADATA_KEY } from './_support/_METADATA_KEY';


type _MetadataTreeT = DictT<DictT<object>>;


const _INSTANCE_KEY: unique symbol = Symbol.for('decorāre:_DecoratorMetadataInspector:instance');


export class _DecoratorMetadataInspector {
  public [Symbol.toStringTag]: string = _DecoratorMetadataInspector.name;

  private static readonly [_INSTANCE_KEY]: _DecoratorMetadataInspector;

  private _target: OptionalT<object>;

  private _metadataTree: OptionalT<_MetadataTreeT>;

  private _isDirty: boolean = false;

  private get _isAttached(): boolean {
    return (this._target !== undefined);
  }

  private get _hasMetadata(): boolean {
    return (this._metadataTree !== undefined);
  }

  public constructor() {
    if (_DecoratorMetadataInspector[_INSTANCE_KEY] !== undefined) {
      return _DecoratorMetadataInspector[_INSTANCE_KEY];
    }

    Reflect.defineProperty(this, '_target', { configurable: true, enumerable: false, writable: true });

    Reflect.defineProperty(this, '_metadataTree', { configurable: true, enumerable: false, writable: true });

    Reflect.defineProperty(this, '_isDirty', { configurable: true, enumerable: false, writable: true });

    Reflect.defineProperty(this, Symbol.toStringTag, { configurable: true, enumerable: false, writable: false });

    (_DecoratorMetadataInspector as any /* HACK. */)[_INSTANCE_KEY] = this;
    Reflect.defineProperty(
      _DecoratorMetadataInspector, _INSTANCE_KEY, { configurable: true, enumerable: false, writable: false },
    );
  }

  public static hasDecoratorMetadata(target: object, metadataKey: symbol = _METADATA_KEY): boolean {
    return _hasOwnMetadata(target, metadataKey);
  }

  public attach(target: object, metadataKey: symbol = _METADATA_KEY): this | never {
    if (this._isAttached) {
      throw new Error();
    }

    this._target = target;
    if (_hasOwnMetadata(this._target, metadataKey)) {
      this._metadataTree = _getOwnMetadata<_MetadataTreeT>(this._target, metadataKey);
    }

    return this;
  }

  public detach(): this | never {
    if (!this._isAttached) {
      throw new Error();
    }

    if (this._hasMetadata && this._isDirty) {
      _defineMetadata<_MetadataTreeT>(this._target! /* HACK. */, _METADATA_KEY, this._metadataTree! /* HACK. */);
    }

    this._reset();

    return this;
  }

  public getAllDecoratorMetadata<TMetadata extends object>(decoratorKey: PropertyKeyT): DictT<TMetadata> | never {
    if (!this._isAttached) {
      throw new Error();
    }

    if (!this._hasMetadata) {
      return { };
    }

    const result: DictT<TMetadata> = { };
    for (const propertyKey of _ownPropertyKeys(this._metadataTree! /* HACK. */)) {
      for (const decoratorKey2 of _ownPropertyKeys(Reflect.get(this._metadataTree!, propertyKey))) {
        if (decoratorKey2 === decoratorKey) {
          Reflect.set(result, propertyKey, Reflect.get(Reflect.get(this._metadataTree!, propertyKey), decoratorKey2));
        }
      }
    }

    // for (const propertyKey of _ownPropertyKeys(this._metadataTree! /* HACK. */)) {
    //   for (const decoratorKey2 of _ownPropertyKeys(this._metadataTree! /* HACK. */[propertyKey as string /* HACK. */])) {
    //     if (decoratorKey2 === decoratorKey) {
    //       result[propertyKey as string /* HACK. */] =
    //         this._metadataTree! /* HACK. */[propertyKey as string /* HACK. */][decoratorKey2 as string /* HACK. */] as TMetadata /* HACK. */;

    //       break;
    //     }
    //   }
    // }

    return result;
  }

  public getDecoratorMetadata<TMetadata extends object>(
    propertyKey: PropertyKeyT, decoratorKey: PropertyKeyT,
  ): OptionalT<TMetadata> | never {
    if (!this._isAttached) {
      throw new Error();
    }

    if (!this._hasMetadata) {
      return undefined;
    }

    if (!Reflect.has(this._metadataTree! /* HACK. */, propertyKey)) {
      return undefined;
    }

    return Reflect.get(Reflect.get(this._metadataTree! /* HACK. */, propertyKey), decoratorKey);

    // if (this._metadataTree! /* HACK. */[propertyKey as string /* HACK. */] === undefined) {
    //   return undefined;
    // }

    // return this._metadataTree! /* HACK. */[propertyKey as string /* HACK. */][decoratorKey as string /* HACK. */] as TMetadata /* HACK. */;
  }

  public hasDecoratorMetadata(propertyKey: PropertyKeyT, decoratorKey: PropertyKeyT): boolean | never {
    if (!this._isAttached) {
      throw new Error();
    }

    if (!this._hasMetadata) {
      return false;
    }

    if (!Reflect.has(this._metadataTree! /* HACK. */, propertyKey)) {
      return false;
    }

    return Reflect.has(Reflect.get(this._metadataTree! /* HACK. */, propertyKey), decoratorKey);

    // if (this._metadataTree! /* HACK. */[propertyKey as string /* HACK. */] === undefined) {
    //   return false;
    // }

    // return (
    //         this._metadataTree! /* HACK. */[propertyKey as string /* HACK. */][decoratorKey as string /* HACK. */]
    //     !== undefined
    //   );
  }

  public deleteAllDecoratorMetadata(decoratorKey: PropertyKeyT): this | never {
    if (!this._isAttached) {
      throw new Error();
    }

    if (!this._hasMetadata) {
      return this;
    }

    for (const propertyKey of _ownPropertyKeys(this._metadataTree! /* HACK. */)) {
      Reflect.deleteProperty(Reflect.get(this._metadataTree! /* HACK. */, propertyKey), decoratorKey);
    }

    // for (const propertyKey of _ownPropertyKeys(this._metadataTree! /* HACK. */)) {
    //   delete this._metadataTree![propertyKey as string /* HACK. */][decoratorKey as string /* HACK. */];
    // }

    return this;
  }

  public deleteDecoratorMetadata(propertyKey: PropertyKeyT, decoratorKey: PropertyKeyT): this | never {
    if (!this._isAttached) {
      throw new Error();
    }

    if (!this._hasMetadata) {
      return this;
    }

    if (!Reflect.has(this._metadataTree! /* HACK. */, propertyKey)) {
      return this;
    }

    Reflect.deleteProperty(Reflect.get(this._metadataTree! /* HACK. */, propertyKey), decoratorKey);

    // if (this._metadataTree! /* HACK. */[propertyKey as string /* HACK. */] === undefined) {
    //   return this;
    // }

    // delete this._metadataTree! /* HACK. */[propertyKey as string /* HACK. */][decoratorKey as string /* HACK. */];

    return this;
  }

  public setDecoratorMetadata<TMetadata extends object>(
    propertyKey: PropertyKeyT, decoratorKey: PropertyKeyT, decoratorMetadata: TMetadata,
  ): this | never {
    if (!this._isAttached) {
      throw new Error();
    }

    if (!this._hasMetadata) {
      this._metadataTree = { };
    }

    if (!Reflect.has(this._metadataTree! /* HACK. */, propertyKey)) {
      Reflect.set(this._metadataTree!, propertyKey, { });
    }

    Reflect.set(Reflect.get(this._metadataTree! /* HACK. */, propertyKey), decoratorKey, decoratorMetadata);

    // if (this._metadataTree! /* HACK. */[propertyKey as string /* HACK. */] === undefined) {
    //   this._metadataTree! /* HACK. */[propertyKey as string /* HACK. */] = { };
    // }

    // this._metadataTree! /* HACK. */[propertyKey as string /* HACK. */][decoratorKey as string /* HACK. */] = decoratorMetadata;

    this._isDirty = true;

    return this;
  }

  private _reset(): void {
    this._isDirty = false;
    this._metadataTree = undefined;
    this._target = undefined;
  }
}
