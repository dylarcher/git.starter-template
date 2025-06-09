import assert from 'node:assert'
import { test } from 'node:test'

import cliModule from '../src/bin/cli.js'

test('CLI module exports an object', () => {
  assert.strictEqual(typeof cliModule, 'object')
  assert.deepStrictEqual(cliModule, {})
})

test('CLI module is properly structured', () => {
  assert.ok(cliModule !== null)
})
