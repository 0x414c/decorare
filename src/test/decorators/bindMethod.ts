import 'reflect-metadata';

import test from 'ava';

import { FunctionT } from 'type-ops';

import {
  bindMethod,
  bindMethods,
} from '../..';

@bindMethods
class C1 {
  private _p1 = 'v1';

  @bindMethod()
  public m1(): string {
    return this._p1;
  }
}

class C2 {
  private _p1 = 'v1';

  public m1(): string {
    return this._p1;
  }
}

test('bindMethod', t => {
  const c1 = new C1();
  t.is(c1.m1(), 'v1');
  t.is(((f: FunctionT) => f())(c1.m1), 'v1');

  const c2 = new C2();
  t.is(c2.m1(), 'v1');
  t.throws(() => ((f: FunctionT) => f())(c2.m1));

  t.pass();
});
