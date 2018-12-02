import test from 'ava';

import { seal } from '../..';


@seal
class C1 {
  public readonly p1: string = 'v1';

  public static p2: string = 'v2';


  public m1(): string {
    return 'r1';
  }
}


test('seal', t => {
  t.is(C1.name, 'C1');

  const c1 = new C1();

  t.is(Object.isSealed(c1), true);
  t.throws(() => { delete (c1 as any).p1; });
  // t.throws(() => { (c1 as any).p1 = 'v11'; });

  t.is(Object.isSealed(C1.prototype), true);
  // t.is(Reflect.deleteProperty(C1.prototype, 'm1'), false);
  // t.throws(() => { delete (C1.prototype as any).m1; });
  t.is(Reflect.defineProperty(C1.prototype, 'm1', { value: () => 'r11' }), false);
  t.throws(() => { Object.defineProperty(C1.prototype, 'm1', { value: () => 'r11' }) });
  t.throws(() => { (C1.prototype as any).m1 = () => 'r11'; });

  t.is(Object.isSealed(C1), true);
  // t.throws(() => { delete C1.p2; });
  t.throws(() => { (C1 as any).p2 = 'v2'; });
});
