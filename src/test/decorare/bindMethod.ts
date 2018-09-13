import 'reflect-metadata';

import test from 'ava';

import { FunctionT } from 'type-ops';

import {
  bindMethod,
  bindMethods,
} from '../..';


@bindMethods
class C1 {
  private readonly _p1: string = 'v1';

  @bindMethod()
  public m1(): string {
    return this._p1;
  }
}


test('bindMethod', t => {
  t.is(C1.name, 'C1');

  const c1 = new C1();
  t.is(c1.m1(), 'v1');
  t.is(((f: FunctionT<string, [ ]>) => f())(c1.m1), 'v1');
});
