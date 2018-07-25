import 'reflect-metadata';

import { test } from 'ava';

import {
  bindMethod,
  bindMethods,
} from '../..';

@bindMethods
class C1 {
  private _p1: string = 'p1';

  @bindMethod()
  public m1(): string {
    return this._p1;
  };
};

class C2 {
  private _p1: string = 'p1';

  public m1(): string {
    return this._p1;
  };
};

test.only('bindMethod', t => {
  const c1: C1 = new C1();
  t.is(c1.m1(), 'p1');
  t.is(((f: Function) => f())(c1.m1), 'p1');

  const c2: C2 = new C2();
  t.is(c2.m1(), 'p1');
  t.throws(() => ((f: Function) => f())(c2.m1));

  t.pass();
});
