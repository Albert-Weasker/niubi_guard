import type { GuardActionPlan, GuardDetection, GuardEvent } from './types.js'
import type { GuardConfig } from './config.js'
import { classifyEventWithLlm } from './llm.js'

export async function detectEvent(event: GuardEvent, config: GuardConfig): Promise<GuardDetection | null> {
  const text = `${event.title || ''}\n${event.body}`.toLowerCase()
  const actorLogin = event.actor?.login.toLowerCase()
  const allowPhrases = config.rules.allowPhrases.map((item) => item.toLowerCase())
  const allowUsers = new Set(config.rules.allowUsers.map((item) => item.toLowerCase()))

  if (actorLogin && allowUsers.has(actorLogin)) return null
  if (allowPhrases.some((phrase) => text.includes(phrase))) return null

  const matchedKeywords = config.rules.keywords.filter((keyword) => {
    return text.includes(keyword.toLowerCase())
  })

  const denyUsers = new Set(config.rules.denyUsers.map((item) => item.toLowerCase()))
  const denyUserMatched = actorLogin ? denyUsers.has(actorLogin) : false
  const coldStartReasons = getColdStartReasons(event, config)
  const coldStartMatched = coldStartReasons.length >= config.rules.coldStartAccounts.minimumSignals
  const labels: GuardDetection['labels'] = []

  if (matchedKeywords.length > 0) labels.push('keyword_match')
  if (denyUserMatched) labels.push('deny_user_match')
  if (coldStartMatched) labels.push('cold_start_account')

  const ruleReason = [
    matchedKeywords.length > 0 ? `keyword_match:${matchedKeywords.join(',')}` : '',
    denyUserMatched && actorLogin ? `deny_user_match:${actorLogin}` : '',
    coldStartMatched && actorLogin ? `cold_start_account:${actorLogin}:${coldStartReasons.join(',')}` : '',
  ].filter(Boolean).join(';')
  const llmResult = config.llm.enabled ? await classifyEventWithLlm(event, config) : undefined
  const llmMatched = Boolean(
    llmResult?.malicious && llmResult.confidence >= config.llm.confidenceThreshold
  )

  if (llmMatched) labels.push('llm_malicious')
  if (labels.length === 0) return null

  const llmReason = llmMatched && llmResult
    ? `llm_malicious:${llmResult.label}:${llmResult.confidence.toFixed(2)}`
    : ''
  const reason = [ruleReason, llmReason].filter(Boolean).join(';')
  const ruleScore = matchedKeywords.length * 25 + (denyUserMatched ? 80 : 0) + (coldStartMatched ? 45 : 0)
  const llmScore = llmMatched && llmResult ? Math.round(llmResult.confidence * 100) : 0
  const riskScore = Math.min(100, Math.max(ruleScore, llmScore))
  const shouldPlanActions =
    matchedKeywords.length > 0
    || denyUserMatched
    || coldStartMatched
    || (llmMatched && config.llm.reviewMode === 'auto_plan')

  return {
    event,
    labels,
    matchedKeywords,
    matchedUser: denyUserMatched ? event.actor?.login : undefined,
    llmResult,
    reason,
    riskScore,
    suggestedActions: shouldPlanActions ? buildActionPlans(event, reason, config) : [],
  }
}

function getColdStartReasons(event: GuardEvent, config: GuardConfig) {
  if (!config.rules.coldStartAccounts.enabled) return []
  return event.actor?.coldStartSignals?.reasons || []
}

function buildActionPlans(event: GuardEvent, reason: string, config: GuardConfig): GuardActionPlan[] {
  const plans: GuardActionPlan[] = []

  if (event.sourceType === 'comment' && config.actions.deleteComments) {
    plans.push({
      type: 'delete_comment',
      repoFullName: event.repoFullName,
      targetId: event.sourceId,
      targetLogin: event.actor?.login,
      issueNumber: event.number,
      reason,
    })
  }

  if (event.sourceType === 'issue' && event.number) {
    if (config.actions.deleteIssues) {
      plans.push({
        type: 'delete_issue',
        repoFullName: event.repoFullName,
        targetId: event.sourceId,
        targetLogin: event.actor?.login,
        issueNumber: event.number,
        reason,
      })
    } else {
      if (config.actions.closeIssues) {
        plans.push({
          type: 'close_issue',
          repoFullName: event.repoFullName,
          targetId: event.sourceId,
          targetLogin: event.actor?.login,
          issueNumber: event.number,
          reason,
        })
      }

      if (config.actions.lockIssues) {
        plans.push({
          type: 'lock_issue',
          repoFullName: event.repoFullName,
          targetId: event.sourceId,
          targetLogin: event.actor?.login,
          issueNumber: event.number,
          reason,
        })
      }
    }
  }

  if (config.actions.blockUsers && event.actor?.login) {
    plans.push({
      type: 'block_user',
      repoFullName: event.repoFullName,
      targetLogin: event.actor.login,
      reason,
    })
  }

  if (config.actions.setInteractionLimits) {
    plans.push({
      type: 'set_interaction_limits',
      repoFullName: event.repoFullName,
      reason,
    })
  }

  return plans
}
