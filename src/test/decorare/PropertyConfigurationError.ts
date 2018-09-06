import test from 'ava';

import { PropertyConfigurationError } from '../..';


test('PropertyConfigurationError', t => {
  const e1 = new PropertyConfigurationError('p1', { configurable: true });
  t.is(e1.name, 'PropertyConfigurationError');
  t.is(e1.message, 'Property `p1\' cannot be configured using descriptor `{ configurable: true }\'');
  t.is(e1.propertyKey, 'p1');
  t.deepEqual(e1.propertyDescriptor, { configurable: true });
  t.is(JSON.stringify(e1), '{"name":"PropertyConfigurationError","message":"Property `p1\' cannot be configured using descriptor `{ configurable: true }\'","propertyKey":"p1","propertyDescriptor":{"configurable":true}}');
});
