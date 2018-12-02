import {
  DictT,
  OptionalT,
} from 'type-ops';

import { PropertyKeyT } from '../support/types';
import { TargetError } from '../support/TargetError';

import {
  _defineMetadata,
  _getOwnMetadata,
  _hasOwnMetadata,
} from './_metadata';

import {
  _ownEntries,
  _ownKeys,
  _ownValues,
} from './_reflect';

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
    return this._target !== undefined;
  }

  private get _hasMetadata(): boolean {
    return this._metadataTree !== undefined;
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
      throw new TargetError('Already attached', this._target);
    }

    this._target = target;
    if (_hasOwnMetadata(this._target, metadataKey)) {
      this._metadataTree = _getOwnMetadata<_MetadataTreeT>(this._target, metadataKey);
    }

    return this;
  }


  public detach(): this | never {
    if (!this._isAttached) {
      throw new TargetError('Not attached');
    }

    if (this._hasMetadata && this._isDirty) {
      _defineMetadata<_MetadataTreeT>(this._target! /* HACK. */, _METADATA_KEY, this._metadataTree! /* HACK. */);
    }

    this._reset();

    return this;
  }


  public getAllDecoratorMetadata<TMetadata extends object>(decoratorKey: PropertyKeyT): DictT<TMetadata> | never {
    if (!this._isAttached) {
      throw new TargetError('Not attached');
    }

    if (!this._hasMetadata) {
      return { };
    }

    const result: DictT<TMetadata> = { };
    for (const [ propertyKey, propertyMetadata ] of _ownEntries(this._metadataTree! /* HACK. */)) {
      for (const decoratorKey2 of _ownKeys(propertyMetadata)) {
        if (decoratorKey2 === decoratorKey) {
          Reflect.set(result, propertyKey, Reflect.get(propertyMetadata, decoratorKey2));
        }
      }
    }

    return result;
  }


  public getDecoratorMetadata<TMetadata extends object>(
    propertyKey: PropertyKeyT, decoratorKey: PropertyKeyT,
  ): OptionalT<TMetadata> | never {
    if (!this._isAttached) {
      throw new TargetError('Not attached');
    }

    if (!this._hasMetadata) {
      return undefined;
    }

    if (!Reflect.has(this._metadataTree! /* HACK. */, propertyKey)) {
      return undefined;
    }

    return Reflect.get(Reflect.get(this._metadataTree! /* HACK. */, propertyKey), decoratorKey);
  }


  public hasDecoratorMetadata(propertyKey: PropertyKeyT, decoratorKey: PropertyKeyT): boolean | never {
    if (!this._isAttached) {
      throw new TargetError('Not attached');
    }

    if (!this._hasMetadata) {
      return false;
    }

    if (!Reflect.has(this._metadataTree! /* HACK. */, propertyKey)) {
      return false;
    }

    return Reflect.has(Reflect.get(this._metadataTree! /* HACK. */, propertyKey), decoratorKey);
  }


  public deleteAllDecoratorMetadata(decoratorKey: PropertyKeyT): this | never {
    if (!this._isAttached) {
      throw new TargetError('Not attached');
    }

    if (!this._hasMetadata) {
      return this;
    }

    for (const propertyMetadata of _ownValues(this._metadataTree! /* HACK. */)) {
      Reflect.deleteProperty(propertyMetadata, decoratorKey);
    }

    return this;
  }


  public deleteDecoratorMetadata(propertyKey: PropertyKeyT, decoratorKey: PropertyKeyT): this | never {
    if (!this._isAttached) {
      throw new TargetError('Not attached');
    }

    if (!this._hasMetadata) {
      return this;
    }

    if (!Reflect.has(this._metadataTree! /* HACK. */, propertyKey)) {
      return this;
    }

    Reflect.deleteProperty(Reflect.get(this._metadataTree! /* HACK. */, propertyKey), decoratorKey);

    return this;
  }


  public setDecoratorMetadata<TMetadata extends object>(
    propertyKey: PropertyKeyT, decoratorKey: PropertyKeyT, decoratorMetadata: TMetadata,
  ): this | never {
    if (!this._isAttached) {
      throw new TargetError('Not attached');
    }

    if (!this._hasMetadata) {
      this._metadataTree = { };
    }

    if (!Reflect.has(this._metadataTree! /* HACK. */, propertyKey)) {
      Reflect.set(this._metadataTree!, propertyKey, { });
    }

    Reflect.set(Reflect.get(this._metadataTree! /* HACK. */, propertyKey), decoratorKey, decoratorMetadata);

    this._isDirty = true;

    return this;
  }


  private _reset(): void {
    this._isDirty = false;
    this._metadataTree = undefined;
    this._target = undefined;
  }
}
