import test from 'node:test'
import assert from 'node:assert/strict'
import { guardConfigSchema } from '../src/config.js'
import { classifyEventWithLlm } from '../src/llm.js'
import { ATLAS_CLOUD_LLM_PRESET } from '../src/llm-providers.js'
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

test('classifyEventWithLlm resolves Atlas Cloud api key from environment', async () => {
  const originalFetch = globalThis.fetch
  process.env.ATLASCLOUD_API_KEY = 'atlas-env-key'

  globalThis.fetch = (async (url, init) => {
    assert.equal(url, `${ATLAS_CLOUD_LLM_PRESET.baseUrl}/chat/completions`)
    assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer atlas-env-key')

    return new Response(JSON.stringify({
      choices: [{
        message: {
          content: JSON.stringify({
            malicious: true,
            confidence: 0.91,
            label: 'spam',
            reason: 'Repeated spam template',
            evidence: ['spam template'],
          }),
        },
      }],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const config = guardConfigSchema.parse({
      repositories: ['owner/repo'],
      llm: {
        enabled: true,
        baseUrl: ATLAS_CLOUD_LLM_PRESET.baseUrl,
        apiKey: ATLAS_CLOUD_LLM_PRESET.apiKeyEnv,
        model: ATLAS_CLOUD_LLM_PRESET.model,
      },
    })

    const result = await classifyEventWithLlm(baseEvent, config)

    assert.equal(result.malicious, true)
    assert.equal(result.label, 'spam')
    assert.equal(result.reviewRequired, true)
  } finally {
    globalThis.fetch = originalFetch
    delete process.env.ATLASCLOUD_API_KEY
  }
})
