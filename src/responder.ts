import type { GuardConfig } from './config.js'
import type { GuardActionPlan, GuardActionResult } from './types.js'
import { GitHubGuardClient } from './github.js'

export async function executeActionPlan(
  client: GitHubGuardClient,
  plan: GuardActionPlan,
  config: GuardConfig,
  apply: boolean
): Promise<GuardActionResult> {
  if (!apply) {
    return { ...plan, applied: false, success: true }
  }

  try {
    if (plan.type === 'delete_comment') {
      if (!plan.targetId) throw new Error('delete_comment missing targetId')
      await client.deleteComment(plan.repoFullName, plan.targetId)
    } else if (plan.type === 'close_issue') {
      if (!plan.issueNumber) throw new Error('close_issue missing issueNumber')
      await client.closeIssue(plan.repoFullName, plan.issueNumber)
    } else if (plan.type === 'lock_issue') {
      if (!plan.issueNumber) throw new Error('lock_issue missing issueNumber')
      await client.lockIssue(plan.repoFullName, plan.issueNumber)
    } else if (plan.type === 'delete_issue') {
      if (!plan.issueNumber) throw new Error('delete_issue missing issueNumber')
      await client.deleteIssue(plan.repoFullName, plan.issueNumber)
    } else if (plan.type === 'block_user') {
      if (!plan.targetLogin) throw new Error('block_user missing targetLogin')
      await client.blockUser(plan.targetLogin)
    } else if (plan.type === 'set_interaction_limits') {
      await client.setInteractionLimits(
        plan.repoFullName,
        config.interactionLimits.limit,
        config.interactionLimits.expiry
      )
    }

    return { ...plan, applied: true, success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { ...plan, applied: true, success: false, error: message }
  }
}
