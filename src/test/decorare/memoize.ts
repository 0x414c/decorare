import test from 'ava';

import { memoize } from '../..';


const P_1 = { p1: 'v1' };
const P_2 = { p1: 'v1' };
const P_21 = { p1: 'v11' };


class C1 {
  @memoize<typeof P_1>()
  public get p1(): typeof P_1 {
    return { ...P_1 };
  }

  @memoize<typeof P_2>()
  public get p2(): typeof P_2 {
    return { ...this._p2 };
  }

  public set p2(newP2: typeof P_2) {
    this._p2 = newP2;
  }

  private _p2: typeof P_2 = P_2;
}


test('memoize', t => {
  const c1 = new C1();

  const p1 = c1.p1;
  t.deepEqual(p1, P_1);
  const p11 = c1.p1;
  t.is(p11, p1);

  const p2 = c1.p2;
  t.deepEqual(p2, P_2);
  const p21 = c1.p2;
  t.is(p21, p2);

  c1.p2 = P_21;
  t.deepEqual(c1.p2, P_21);
  t.is(c1.p2, c1.p2);
});
