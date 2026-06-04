import test from 'node:test'
import assert from 'node:assert/strict'
import { splitRepo } from '../src/github.js'

test('splitRepo returns owner and repo', () => {
  assert.deepEqual(splitRepo('owner/repo'), {
    owner: 'owner',
    repo: 'repo',
  })
})

test('splitRepo rejects invalid names', () => {
  assert.throws(() => splitRepo('owner-only'), /Invalid repository name/)
})
