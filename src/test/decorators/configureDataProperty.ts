import 'reflect-metadata';

import { test } from 'ava';

import {
  configureDataProperties,
  configureDataProperty,
  PropertyConfigurationError,
} from '../..';

@configureDataProperties
class C1 {
  @configureDataProperty({ configurable: true, enumerable: true, writable: false })
  public readonly p1 = 'v1';

  @configureDataProperty({ configurable: false, enumerable: true, writable: true })
  public p2 = 'v2';

  @configureDataProperty({ configurable: true, enumerable: false, writable: true })
  private _p3!: string;

  @configureDataProperty({ configurable: false, enumerable: false, writable: true })
  public p4 = Symbol.for('v4');
}

@configureDataProperties
class C2 extends C1 {
  @configureDataProperty({ configurable: true, enumerable: false, writable: false })
  public p2 = 'v21';

  @configureDataProperty({ configurable: true, enumerable: true, writable: false })
  public p4 = Symbol.for('v41');

  public constructor() {
    super();
  }
}

@configureDataProperties
class C3 extends C1 {
  @configureDataProperty({ configurable: false, enumerable: false, writable: true })
  public p3 = 'v3';

  public constructor() {
    super();
  }
}

test('configureDataProperty', t => {
  const c1 = new C1();
  (c1 as any)._p3 = 'v3';
  t.is(C1.name, 'C1');
  t.deepEqual(
    Reflect.getOwnPropertyDescriptor(c1, 'p1'),
    { configurable: true, enumerable: true, writable: false, value: 'v1' },
  );
  t.deepEqual(
    Reflect.getOwnPropertyDescriptor(c1, 'p2'),
    { configurable: false, enumerable: true, writable: true, value: 'v2' },
  );
  t.deepEqual(
    Reflect.getOwnPropertyDescriptor(c1, '_p3'),
    { configurable: true, enumerable: false, writable: true, value: 'v3' },
  );
  t.deepEqual(
    Reflect.getOwnPropertyDescriptor(c1, 'p4'),
    { configurable: false, enumerable: false, writable: true, value: Symbol.for('v4') },
  );

  t.throws(
    () => { new C2(); },
    {
      instanceOf: PropertyConfigurationError,
      message: 'Property `p2\' cannot be configured using descriptor `{ configurable: true, enumerable: false, writable: false }\'',
      name: PropertyConfigurationError.name,
    },
  );

  const c3 = new C3();
  t.deepEqual(
    Object.getOwnPropertyDescriptor(c3, 'p3'),
    { configurable: false, enumerable: false, writable: true, value: 'v3' },
  );
});
