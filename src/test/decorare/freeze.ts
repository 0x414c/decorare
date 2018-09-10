import test from 'ava';

import { freeze } from '../..';


@freeze
class C1 {
  public readonly p1: string = 'v1';

  public static p2: string = 'v2';

  public m1(): string {
    return 'r1';
  }
}


test('freeze', t => {
  t.is(C1.name, 'C1');

  const c1 = new C1();

  t.is(Object.isFrozen(c1), true);
  t.throws(() => { (c1 as any).p1 = 'v11'; });

  t.is(Object.isFrozen(C1.prototype), true);
  t.throws(() => { (C1.prototype as any).m1 = () => 'r12'; });

  t.is(Object.isFrozen(C1), true);
  t.throws(() => { (C1 as any).p2 = 'v21'; });
});
