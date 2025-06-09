import assert from 'node:assert'
import { test } from 'node:test'

import defaultExport, { exampleFunction } from '../src/index.js'

test('main module exports an object', () => {
  assert.strictEqual(typeof defaultExport, 'object')
  assert.deepStrictEqual(defaultExport, { exampleFunction })
})

test('main module is properly structured', () => {
  assert.ok(defaultExport !== null)
})
