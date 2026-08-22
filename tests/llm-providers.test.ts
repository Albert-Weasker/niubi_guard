import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ATLAS_CLOUD_LLM_PRESET,
  isAtlasCloudBaseUrl,
  resolveLlmApiKey,
} from '../src/llm-providers.js'

test('isAtlasCloudBaseUrl detects Atlas Cloud endpoints', () => {
  assert.equal(isAtlasCloudBaseUrl(ATLAS_CLOUD_LLM_PRESET.baseUrl), true)
  assert.equal(isAtlasCloudBaseUrl('https://api.openai.com/v1'), false)
})

test('resolveLlmApiKey resolves Atlas Cloud env key names', () => {
  const apiKey = resolveLlmApiKey('ATLASCLOUD_API_KEY', ATLAS_CLOUD_LLM_PRESET.baseUrl, {
    ATLASCLOUD_API_KEY: 'atlas-test-key',
  })

  assert.equal(apiKey, 'atlas-test-key')
})

test('resolveLlmApiKey falls back to Atlas Cloud env for placeholder keys', () => {
  const apiKey = resolveLlmApiKey('sk-...', ATLAS_CLOUD_LLM_PRESET.baseUrl, {
    ATLAS_CLOUD_API_KEY: 'atlas-secondary-key',
  })

  assert.equal(apiKey, 'atlas-secondary-key')
})

test('resolveLlmApiKey preserves explicit non-Atlas keys', () => {
  const apiKey = resolveLlmApiKey('explicit-key', 'https://api.openai.com/v1', {
    ATLASCLOUD_API_KEY: 'atlas-test-key',
  })

  assert.equal(apiKey, 'explicit-key')
})
