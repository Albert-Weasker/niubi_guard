import test from 'node:test'
import assert from 'node:assert/strict'
import { parseArgs } from '../src/cli.js'

test('parseArgs supports global help and version flags', () => {
  assert.equal(parseArgs(['--help']).help, true)
  assert.equal(parseArgs(['-h']).help, true)
  assert.equal(parseArgs(['--version']).version, true)
  assert.equal(parseArgs(['-v']).version, true)
})

test('parseArgs parses scan options', () => {
  assert.deepEqual(parseArgs(['scan', '--config', 'custom.json', '--apply']), {
    command: 'scan',
    configPath: 'custom.json',
    apply: true,
    help: false,
    version: false,
    force: false,
  })
})

test('parseArgs parses init options', () => {
  assert.deepEqual(parseArgs(['init', '--force']), {
    command: 'init',
    configPath: 'guard.config.json',
    apply: false,
    help: false,
    version: false,
    force: true,
  })
})

test('parseArgs rejects missing values and unknown options', () => {
  assert.throws(() => parseArgs(['scan', '--config']), /requires a file path/)
  assert.throws(() => parseArgs(['scan', '--unknown']), /Unknown option/)
})
