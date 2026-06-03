import { readFile } from 'node:fs/promises'
import { z } from 'zod'
import { DEFAULT_LLM_SYSTEM_PROMPT, DEFAULT_LLM_USER_PROMPT_TEMPLATE } from './prompts.js'

const interactionLimitSchema = z.enum(['existing_users', 'contributors_only', 'collaborators_only'])
const interactionExpirySchema = z.enum(['one_day', 'three_days', 'one_week', 'one_month', 'six_months'])
const llmReviewModeSchema = z.enum(['review_only', 'auto_plan'])


export const guardConfigSchema = z.object({
  repositories: z.array(z.string().regex(/^[^/\s]+\/[^/\s]+$/)).min(1),
  rules: z.object({
    keywords: z.array(z.string().min(1)).default([]),
    denyUsers: z.array(z.string().min(1)).default([]),
    allowPhrases: z.array(z.string().min(1)).default([]),
    allowUsers: z.array(z.string().min(1)).default([]),
  }).default({}),
  scan: z.object({
    includeIssues: z.boolean().default(true),
    includeComments: z.boolean().default(true),
    state: z.enum(['open', 'closed', 'all']).default('open'),
    since: z.string().datetime().nullable().default(null),
    maxPages: z.number().int().min(1).max(50).default(5),
  }).default({}),
  actions: z.object({
    deleteComments: z.boolean().default(false),
    closeIssues: z.boolean().default(false),
    lockIssues: z.boolean().default(false),
    deleteIssues: z.boolean().default(false),
    blockUsers: z.boolean().default(false),
    setInteractionLimits: z.boolean().default(false),
  }).default({}),
  interactionLimits: z.object({
    limit: interactionLimitSchema.default('existing_users'),
    expiry: interactionExpirySchema.default('one_month'),
  }).default({}),
  llm: z.object({
    enabled: z.boolean().default(false),
    baseUrl: z.string().url().default('https://api.openai.com/v1'),
    apiKey: z.string().default(''),
    model: z.string().default('gpt-4o-mini'),
    temperature: z.number().min(0).max(2).default(0.1),
    confidenceThreshold: z.number().min(0).max(1).default(0.8),
    reviewMode: llmReviewModeSchema.default('review_only'),
    systemPrompt: z.string().default(DEFAULT_LLM_SYSTEM_PROMPT),
    userPromptTemplate: z.string().default(DEFAULT_LLM_USER_PROMPT_TEMPLATE),
  }).default({}),
})

export type GuardConfig = z.infer<typeof guardConfigSchema>

export async function loadGuardConfig(path: string): Promise<GuardConfig> {
  const raw = await readFile(path, 'utf8')
  return guardConfigSchema.parse(JSON.parse(raw))
}
