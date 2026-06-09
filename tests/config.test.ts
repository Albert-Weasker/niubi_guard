import test from 'node:test'
import assert from 'node:assert/strict'
import { guardConfigSchema } from '../src/config.js'

test('guardConfigSchema applies safe defaults', () => {
  const config = guardConfigSchema.parse({
    repositories: ['owner/repo'],
  })

  assert.deepEqual(config.rules.keywords, [])
  assert.equal(config.scan.includeIssues, true)
  assert.equal(config.scan.includeComments, true)
  assert.equal(config.scan.maxPages, 5)
  assert.equal(config.actions.deleteComments, false)
  assert.equal(config.rules.coldStartAccounts.enabled, false)
  assert.equal(config.rules.coldStartAccounts.maxAccountAgeDays, 30)
  assert.equal(config.rules.coldStartAccounts.minimumSignals, 2)
  assert.equal(config.llm.enabled, false)
  assert.equal(config.llm.reviewMode, 'review_only')
})

test('guardConfigSchema rejects invalid repository names', () => {
  assert.throws(() => {
    guardConfigSchema.parse({
      repositories: ['not-a-full-name'],
    })
  })
})
