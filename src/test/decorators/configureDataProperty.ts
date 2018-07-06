import { test } from 'ava';

import {
  configureDataProperties,
  configureDataProperty,
  PropertyConfigurationError,
} from '../..';

@configureDataProperties
class Foo {
  @configureDataProperty({ configurable: true, enumerable: true, writable: false })
  public readonly p1 = 'p1';

  @configureDataProperty({ configurable: false, enumerable: true, writable: true })
  public p2 = 'p2';

  @configureDataProperty({ configurable: true, enumerable: false, writable: true })
  private _p3!: string;
}

@configureDataProperties
class Bar extends Foo {
  @configureDataProperty({ configurable: true, enumerable: true, writable: true })
  public p2 = '1';

  public constructor() {
    super();
  };
}

@configureDataProperties
class Baz extends Foo {
  @configureDataProperty({ configurable: false, enumerable: false, writable: true })
  public p3 = '1';

  public constructor() {
    super();
  };
}

test('configureDataProperty', t => {
  const x = new Foo();
  (x as any)._p3 = '_p3';
  t.is(Foo.name, 'Foo');
  t.deepEqual(
    Object.getOwnPropertyDescriptor(x, 'p1'),
    { configurable: true, enumerable: true, writable: false, value: 'p1' },
  );
  t.deepEqual(
    Object.getOwnPropertyDescriptor(x, 'p2'),
    { configurable: false, enumerable: true, writable: true, value: 'p2' },
  );
  t.deepEqual(
    Object.getOwnPropertyDescriptor(x, '_p3'),
    { configurable: true, enumerable: false, writable: true, value: '_p3' },
  );

  t.throws(
    () => { new Bar(); },
    {
      instanceOf: PropertyConfigurationError,
      message: 'Property `p2\' cannot be configured using attributes `{ configurable: true, enumerable: true, writable: true }\'',
      name: PropertyConfigurationError.name,
    },
  );

  const y = new Baz();
  t.deepEqual(
    Object.getOwnPropertyDescriptor(y, 'p3'),
    { configurable: false, enumerable: false, writable: true, value: '1' },
  );
});
