import test from 'ava';

import { configureAccessorProperty } from '../..';


class C1 {
  @configureAccessorProperty<string>({ configurable: false, enumerable: true })
  public get p1(): string {
    return 'v1';
  }

  @configureAccessorProperty<string>({ configurable: false, enumerable: true })
  public static get p2(): string {
    return 'v2';
  }
}


test('configureAccessorProperty', t => {
  const c1 = new C1();
  t.is(c1.p1, 'v1');
  const c1P1 = Reflect.getOwnPropertyDescriptor(C1.prototype, 'p1');
  t.deepEqual(
    c1P1,
    { configurable: false, enumerable: true, get: c1P1!.get, set: undefined },
  );
  const c1P2 = Reflect.getOwnPropertyDescriptor(C1, 'p2');
  t.deepEqual(
    c1P2,
    { configurable: false, enumerable: true, get: c1P2!.get, set: undefined }
  );
});
