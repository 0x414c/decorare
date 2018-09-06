import test from 'ava';

import { monostate } from '../..';


@monostate
class C1 {
  public readonly p1: string = 'v1';
}


test('monostate', t => {
  const c1 = new C1();
  const c11 = new C1();
  t.is(c1, c11);
});
