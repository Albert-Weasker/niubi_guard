import { z } from 'zod'
import type { GuardConfig } from './config.js'
import type { GuardEvent, GuardLlmResult } from './types.js'

const llmResponseSchema = z.object({
  malicious: z.boolean(),
  confidence: z.number().min(0).max(1),
  label: z.enum([
    'spam',
    'bot_attack',
    'coordinated_abuse',
    'fake_star_accusation',
    'harassment',
    'benign',
    'uncertain',
  ]),
  reason: z.string().default(''),
  evidence: z.array(z.string()).default([]),
})

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null
    }
  }>
}

export async function classifyEventWithLlm(event: GuardEvent, config: GuardConfig): Promise<GuardLlmResult> {
  if (!config.llm.apiKey.trim()) {
    throw new Error('LLM detection is enabled but llm.apiKey is empty')
  }
  if (!config.llm.model.trim()) {
    throw new Error('LLM detection is enabled but llm.model is empty')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)

  let response: Response
  try {
    response = await fetch(`${trimTrailingSlash(config.llm.baseUrl)}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${config.llm.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.llm.model,
        temperature: config.llm.temperature,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: config.llm.systemPrompt,
          },
          {
            role: 'user',
            content: renderPrompt(config.llm.userPromptTemplate, event),
          },
        ],
      }),
    })
  } catch (fetchError) {
    clearTimeout(timeout)
    if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
      throw new Error('LLM request timed out after 30 seconds')
    }
    throw fetchError
  }

  clearTimeout(timeout)

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`LLM request failed: ${response.status} ${body.slice(0, 240)}`)
  }

  const data = await response.json() as ChatCompletionResponse
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('LLM response did not include message content')
  }

  const parsed = llmResponseSchema.parse(JSON.parse(content))
  return {
    ...parsed,
    reviewRequired: config.llm.reviewMode === 'review_only' || parsed.confidence < config.llm.confidenceThreshold,
  }
}

function renderPrompt(template: string, event: GuardEvent) {
  return template
    .replaceAll('{{repoFullName}}', event.repoFullName)
    .replaceAll('{{sourceType}}', event.sourceType)
    .replaceAll('{{actorLogin}}', event.actor?.login || 'unknown')
    .replaceAll('{{title}}', event.title || '')
    .replaceAll('{{body}}', event.body || '')
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}
