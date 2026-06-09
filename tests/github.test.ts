import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateColdStartSignals, getRateLimitRetryDelay, parseHeaderNumber, splitRepo } from '../src/github.js'

test('splitRepo returns owner and repo', () => {
  assert.deepEqual(splitRepo('owner/repo'), {
    owner: 'owner',
    repo: 'repo',
  })
})

test('splitRepo rejects invalid names', () => {
  assert.throws(() => splitRepo('owner-only'), /Invalid repository name/)
})

test('parseHeaderNumber parses finite numeric headers', () => {
  assert.equal(parseHeaderNumber('42'), 42)
  assert.equal(parseHeaderNumber(42), 42)
  assert.equal(parseHeaderNumber('not-a-number'), null)
  assert.equal(parseHeaderNumber(Number.NaN), null)
  assert.equal(parseHeaderNumber(undefined), null)
})

test('getRateLimitRetryDelay handles retry-after secondary rate limits', () => {
  assert.equal(getRateLimitRetryDelay({
    status: 429,
    response: {
      headers: {
        'retry-after': '3',
      },
    },
  }), 10)
})

test('getRateLimitRetryDelay handles primary rate limit reset headers', () => {
  assert.equal(getRateLimitRetryDelay({
    status: 403,
    headers: {
      'x-ratelimit-remaining': '0',
      'x-ratelimit-reset': '110',
    },
  }, {
    nowSeconds: 100,
    maxAutoWaitSeconds: 30,
  }), 11)
})

test('getRateLimitRetryDelay skips waits above the configured automatic limit', () => {
  assert.equal(getRateLimitRetryDelay({
    status: 403,
    headers: {
      'x-ratelimit-remaining': '0',
      'x-ratelimit-reset': '500',
    },
  }, {
    nowSeconds: 100,
    maxAutoWaitSeconds: 30,
  }), null)
})

test('evaluateColdStartSignals reports configured profile signals', () => {
  assert.deepEqual(evaluateColdStartSignals({
    avatarUrl: '',
    bio: '',
    createdAt: '2026-06-01T00:00:00Z',
  }, {
    maxAccountAgeDays: 14,
    requireEmptyBio: true,
    requireMissingAvatar: true,
  }, new Date('2026-06-09T00:00:00Z')), {
    accountAgeDays: 8,
    newAccount: true,
    emptyBio: true,
    missingAvatar: true,
    reasons: ['new_account:8d<=14d', 'empty_bio', 'missing_avatar'],
  })
})
