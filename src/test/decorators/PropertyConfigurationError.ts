import 'reflect-metadata';

import { test } from 'ava';

import { PropertyConfigurationError } from '../..';

test('PropertyConfigurationError', t => {
  const e1 = new PropertyConfigurationError('p1', { });
  console.debug({ e1 });

  const e2 = new PropertyConfigurationError('p2', { configurable: true });
  console.debug({ e2 });

  console.debug(Reflect.getOwnPropertyDescriptor(e2, 'name'));
  console.debug(Reflect.getPrototypeOf(e2));
  console.debug(Reflect.getOwnPropertyDescriptor(Reflect.getPrototypeOf(e2), 'message'));
  console.debug(Reflect.getOwnPropertyDescriptor(e2, 'message'));
  console.debug(Reflect.getOwnPropertyDescriptor(e2, 'stack'));

  t.pass();
});
