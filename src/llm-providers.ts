export const ATLAS_CLOUD_LLM_PRESET = {
  baseUrl: 'https://api.atlascloud.ai/v1',
  model: 'qwen/qwen3.5-flash',
  reasoningModel: 'deepseek-ai/deepseek-v4-pro',
  apiKeyEnv: 'ATLASCLOUD_API_KEY',
} as const

const ATLAS_CLOUD_ENV_KEYS = ['ATLASCLOUD_API_KEY', 'ATLAS_CLOUD_API_KEY'] as const
const API_KEY_PLACEHOLDERS = new Set(['', 'YOUR_API_KEY', 'your_api_key', 'sk-...'])

export function isAtlasCloudBaseUrl(baseUrl: string) {
  return baseUrl.toLowerCase().includes('api.atlascloud.ai')
}

export function resolveLlmApiKey(
  apiKey: string,
  baseUrl: string,
  env: Record<string, string | undefined> = process.env,
) {
  const trimmedApiKey = apiKey.trim()
  if (ATLAS_CLOUD_ENV_KEYS.includes(trimmedApiKey as typeof ATLAS_CLOUD_ENV_KEYS[number])) {
    return env[trimmedApiKey] ?? firstAtlasCloudEnvValue(env)
  }
  if (isAtlasCloudBaseUrl(baseUrl) && API_KEY_PLACEHOLDERS.has(trimmedApiKey)) {
    return firstAtlasCloudEnvValue(env)
  }
  return trimmedApiKey
}

function firstAtlasCloudEnvValue(env: Record<string, string | undefined>) {
  for (const envKey of ATLAS_CLOUD_ENV_KEYS) {
    const value = env[envKey]?.trim()
    if (value) return value
  }
  return ''
}
