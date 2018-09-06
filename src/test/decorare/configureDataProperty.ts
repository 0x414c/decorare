import 'reflect-metadata';

import test from 'ava';

import {
  configureDataProperties,
  configureDataProperty,
  PropertyConfigurationError,
} from '../..';


@configureDataProperties
class C1 {
  @configureDataProperty({ configurable: true, enumerable: true, writable: true })
  public p1: string = 'v1';

  @configureDataProperty({ configurable: false, enumerable: true, writable: true })
  public p2: symbol = Symbol.for('v2');

  @configureDataProperty({ configurable: false, enumerable: false, writable: false })
  public static readonly p3: string = 'v3';
}


@configureDataProperties
class C2 extends C1 {
  @configureDataProperty({ configurable: true, enumerable: false, writable: false })
  public p2: symbol = Symbol.for('v21');
}


@configureDataProperties
class C3 extends C1 {
  @configureDataProperty({ configurable: false, enumerable: false, writable: false })
  public p1: string = 'v11';
}


test('configureDataProperty', t => {
  const c1 = new C1();
  t.is(C1.name, 'C1');
  t.deepEqual(
    Reflect.getOwnPropertyDescriptor(c1, 'p1'),
    { configurable: true, enumerable: true, writable: true, value: 'v1' },
  );
  t.deepEqual(
    Reflect.getOwnPropertyDescriptor(c1, 'p2'),
    { configurable: false, enumerable: true, writable: true, value: Symbol.for('v2') },
  );
  t.deepEqual(
    Reflect.getOwnPropertyDescriptor(Reflect.getPrototypeOf(C1), 'p3'),
    { configurable: false, enumerable: false, writable: false, value: 'v3' },
  )

  t.throws(
    () => { new C2(); },
    {
      instanceOf: PropertyConfigurationError,
      name: PropertyConfigurationError.name,
      message: 'Property `p2\' cannot be configured using descriptor `{ configurable: true, enumerable: false, writable: false, value: Symbol(v21) }\'',
    },
  );

  const c3 = new C3();
  t.deepEqual(
    Reflect.getOwnPropertyDescriptor(c3, 'p1'),
    { configurable: false, enumerable: false, writable: false, value: 'v11' },
  );
});
