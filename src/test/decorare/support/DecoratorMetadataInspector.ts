import 'reflect-metadata';

import test from 'ava';

import { _DecoratorMetadataInspector } from '../../../decorare/_support/_DecoratorMetadataInspector';


test('_support/_DecoratorMetadataInspector', t => {
  const inspector = new _DecoratorMetadataInspector();
  const target = { };
  inspector
    .attach(target)
    .setDecoratorMetadata('p1', 'd1', { 'p2': 'v2' })
  const allMetadata = inspector.getAllDecoratorMetadata('d1');
  const metadata = inspector.getDecoratorMetadata('p1', 'd1');
  inspector.detach();

  t.deepEqual(allMetadata, { 'p1': { 'p2': 'v2' }});
  t.deepEqual(metadata, { 'p2': 'v2' });
});
