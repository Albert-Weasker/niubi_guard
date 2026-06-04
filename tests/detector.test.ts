import test from 'node:test'
import assert from 'node:assert/strict'
import { detectEvent } from '../src/detector.js'
import { guardConfigSchema } from '../src/config.js'
import type { GuardEvent } from '../src/types.js'

const baseEvent: GuardEvent = {
  sourceType: 'issue',
  repoFullName: 'owner/repo',
  sourceId: '12',
  number: 12,
  title: 'Suspicious report',
  body: 'This repeats a spam template with no project evidence.',
  htmlUrl: 'https://github.com/owner/repo/issues/12',
  actor: {
    login: 'unknown-user',
  },
}

test('detectEvent reports keyword matches and plans enabled issue actions', async () => {
  const config = guardConfigSchema.parse({
    repositories: ['owner/repo'],
    rules: {
      keywords: ['spam template'],
    },
    actions: {
      closeIssues: true,
      lockIssues: true,
      blockUsers: true,
    },
  })

  const detection = await detectEvent(baseEvent, config)

  assert.ok(detection)
  assert.deepEqual(detection.labels, ['keyword_match'])
  assert.deepEqual(detection.matchedKeywords, ['spam template'])
  assert.equal(detection.riskScore, 25)
  assert.deepEqual(detection.suggestedActions.map((action) => action.type), [
    'close_issue',
    'lock_issue',
    'block_user',
  ])
})

test('detectEvent ignores allowlisted users and phrases', async () => {
  const config = guardConfigSchema.parse({
    repositories: ['owner/repo'],
    rules: {
      keywords: ['spam template'],
      allowUsers: ['unknown-user'],
      allowPhrases: ['security disclosure'],
    },
  })

  assert.equal(await detectEvent(baseEvent, config), null)
  assert.equal(await detectEvent({
    ...baseEvent,
    actor: { login: 'someone-else' },
    body: 'This is a good-faith security disclosure about a spam template.',
  }, config), null)
})

test('detectEvent handles deny user matches case-insensitively', async () => {
  const config = guardConfigSchema.parse({
    repositories: ['owner/repo'],
    rules: {
      denyUsers: ['UNKNOWN-USER'],
    },
  })

  const detection = await detectEvent(baseEvent, config)

  assert.ok(detection)
  assert.deepEqual(detection.labels, ['deny_user_match'])
  assert.equal(detection.matchedUser, 'unknown-user')
  assert.equal(detection.riskScore, 80)
})
