export type GuardSourceType = 'issue' | 'comment'

export type GuardIssueState = 'open' | 'closed' | 'all'

export type InteractionLimit = 'existing_users' | 'contributors_only' | 'collaborators_only'

export type InteractionExpiry = 'one_day' | 'three_days' | 'one_week' | 'one_month' | 'six_months'

export type GuardActor = {
  login: string
  htmlUrl?: string
  type?: string
}

export type GuardEvent = {
  sourceType: GuardSourceType
  repoFullName: string
  sourceId: string
  number?: number
  title?: string
  body: string
  htmlUrl: string
  issueUrl?: string
  actor?: GuardActor
  createdAt?: string
  updatedAt?: string
}

export type GuardDetectionLabel = 'keyword_match' | 'deny_user_match' | 'llm_malicious'

export type GuardLlmReviewMode = 'review_only' | 'auto_plan'

export type GuardLlmLabel =
  | 'spam'
  | 'bot_attack'
  | 'coordinated_abuse'
  | 'fake_star_accusation'
  | 'harassment'
  | 'benign'
  | 'uncertain'

export type GuardLlmResult = {
  malicious: boolean
  confidence: number
  label: GuardLlmLabel
  reason: string
  evidence: string[]
  reviewRequired: boolean
}

export type GuardDetection = {
  event: GuardEvent
  labels: GuardDetectionLabel[]
  matchedKeywords: string[]
  matchedUser?: string
  llmResult?: GuardLlmResult
  reason: string
  riskScore: number
  suggestedActions: GuardActionPlan[]
}

export type GuardActionType =
  | 'delete_comment'
  | 'close_issue'
  | 'lock_issue'
  | 'delete_issue'
  | 'block_user'
  | 'set_interaction_limits'

export type GuardActionPlan = {
  type: GuardActionType
  repoFullName: string
  targetId?: string
  targetLogin?: string
  issueNumber?: number
  reason: string
}

export type GuardActionResult = GuardActionPlan & {
  applied: boolean
  success: boolean
  error?: string
}

export type GuardScanReport = {
  repositoriesScanned: number
  eventsScanned: number
  detections: GuardDetection[]
  actions: GuardActionResult[]
  errors: string[]
}
