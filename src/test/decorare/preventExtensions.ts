import test from 'ava';

import { preventExtensions } from '../..';


@preventExtensions
class C1 { }


test('preventExtensions', t => {
  t.is(C1.name, 'C1');

  const c1 = new C1();

  t.is(Object.isExtensible(c1), false);
  t.throws(() => { (c1 as any).p1 = 'v1'; });

  t.is(Object.isExtensible(C1.prototype), false);
  t.is(Reflect.defineProperty(C1.prototype, 'm1', { value: () => 'r1' }), false);
  t.throws(() => { Object.defineProperty(C1.prototype, 'm1', { value: () => 'r1' }) });
  t.throws(() => { (C1.prototype as any).m1 = () => 'r1'; });

  t.is(Object.isExtensible(C1), false);
  t.throws(() => { (C1 as any).p2 = 'v1'; });
});
