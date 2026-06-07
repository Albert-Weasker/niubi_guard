import { Octokit } from '@octokit/rest'
import type { GuardEvent, GuardIssueState, InteractionExpiry, InteractionLimit } from './types.js'

export class GitHubGuardClient {
  private readonly octokit: Octokit
  private static readonly RATE_LIMIT_THRESHOLD = 30
  private static readonly MAX_RATE_LIMIT_WAIT_SECONDS = 120

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token })
  }

  private async checkRateLimitBeforeNextPage(headers: Record<string, string | number | undefined>): Promise<void> {
    const remaining = parseHeaderNumber(headers['x-ratelimit-remaining'])
    const resetEpoch = parseHeaderNumber(headers['x-ratelimit-reset'])
    if (remaining === null || resetEpoch === null) return
    if (remaining > GitHubGuardClient.RATE_LIMIT_THRESHOLD) return

    const waitSeconds = getResetWaitSeconds(resetEpoch)
    if (waitSeconds <= 0) return
    if (waitSeconds > GitHubGuardClient.MAX_RATE_LIMIT_WAIT_SECONDS) {
      const limit = String(headers['x-ratelimit-limit'] ?? '?')
      throw new Error(
        `GitHub rate limit is low (${remaining}/${limit}) and resets in ${waitSeconds}s. `
        + `This exceeds the ${GitHubGuardClient.MAX_RATE_LIMIT_WAIT_SECONDS}s automatic wait limit; `
        + 'try again later or reduce scan.maxPages.'
      )
    }

    const limit = String(headers['x-ratelimit-limit'] ?? '?')
    process.stderr.write(
      `[niubi-guard] Rate limit approaching (${remaining}/${limit}), waiting ${waitSeconds}s until reset\n`
    )
    await sleep(waitSeconds * 1000)
  }

  /**
   * Fetches a single page with automatic retry on secondary rate limits (429 / 403+retry-after).
   * Returns headers so the caller can throttle remaining requests via {@link checkRateLimitBeforeNextPage}.
   */
  private async fetchPage<T>(
    fn: () => Promise<{ data: T; headers: Record<string, string | number | undefined>; status: number }>
  ): Promise<{ data: T; headers: Record<string, string | number | undefined> }> {
    const maxRetries = 3
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const { data, headers } = await fn()
        return { data, headers }
      } catch (error: unknown) {
        const wait = getRateLimitRetryDelay(error, {
          maxAutoWaitSeconds: GitHubGuardClient.MAX_RATE_LIMIT_WAIT_SECONDS,
        })
        if (wait !== null && attempt < maxRetries - 1) {
          process.stderr.write(
            `[niubi-guard] Rate limited, retrying after ${wait}s (attempt ${attempt + 1}/${maxRetries})\n`
          )
          await sleep(wait * 1000)
          continue
        }
        throw error
      }
    }
    throw new Error('Rate limit retries exhausted')
  }

  async listIssueEvents(repoFullName: string, options: {
    state: GuardIssueState
    since?: string | null
    maxPages: number
  }): Promise<GuardEvent[]> {
    const { owner, repo } = splitRepo(repoFullName)
    const events: GuardEvent[] = []

    for (let page = 1; page <= options.maxPages; page += 1) {
      const { data, headers } = await this.fetchPage(() =>
        this.octokit.rest.issues.listForRepo({
          owner,
          repo,
          state: options.state,
          sort: 'updated',
          direction: 'desc',
          since: options.since || undefined,
          per_page: 100,
          page,
        })
      )

      if (data.length === 0) break

      for (const issue of data) {
        if ('pull_request' in issue && issue.pull_request) continue
        events.push({
          sourceType: 'issue',
          repoFullName,
          sourceId: String(issue.number),
          number: issue.number,
          title: issue.title,
          body: issue.body || '',
          htmlUrl: issue.html_url,
          actor: issue.user ? {
            login: issue.user.login,
            htmlUrl: issue.user.html_url,
            type: issue.user.type,
          } : undefined,
          createdAt: issue.created_at,
          updatedAt: issue.updated_at,
        })
      }

      if (data.length < 100) break
      if (page < options.maxPages) {
        await this.checkRateLimitBeforeNextPage(headers)
      }
    }

    return events
  }

  async listCommentEvents(repoFullName: string, options: {
    since?: string | null
    maxPages: number
  }): Promise<GuardEvent[]> {
    const { owner, repo } = splitRepo(repoFullName)
    const events: GuardEvent[] = []

    for (let page = 1; page <= options.maxPages; page += 1) {
      const { data, headers } = await this.fetchPage(() =>
        this.octokit.rest.issues.listCommentsForRepo({
          owner,
          repo,
          sort: 'updated',
          direction: 'desc',
          since: options.since || undefined,
          per_page: 100,
          page,
        })
      )

      if (data.length === 0) break

      for (const comment of data) {
        events.push({
          sourceType: 'comment',
          repoFullName,
          sourceId: String(comment.id),
          body: comment.body || '',
          htmlUrl: comment.html_url,
          issueUrl: comment.issue_url,
          number: Number(comment.issue_url.split('/').pop()),
          actor: comment.user ? {
            login: comment.user.login,
            htmlUrl: comment.user.html_url,
            type: comment.user.type,
          } : undefined,
          createdAt: comment.created_at,
          updatedAt: comment.updated_at,
        })
      }

      if (data.length < 100) break
      if (page < options.maxPages) {
        await this.checkRateLimitBeforeNextPage(headers)
      }
    }

    return events
  }

  async deleteComment(repoFullName: string, commentId: string) {
    const { owner, repo } = splitRepo(repoFullName)
    await this.octokit.rest.issues.deleteComment({
      owner,
      repo,
      comment_id: Number(commentId),
    })
  }

  async closeIssue(repoFullName: string, issueNumber: number) {
    const { owner, repo } = splitRepo(repoFullName)
    await this.octokit.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed',
    })
  }

  async lockIssue(repoFullName: string, issueNumber: number) {
    const { owner, repo } = splitRepo(repoFullName)
    await this.octokit.rest.issues.lock({
      owner,
      repo,
      issue_number: issueNumber,
      lock_reason: 'spam',
    })
  }

  async deleteIssue(repoFullName: string, issueNumber: number) {
    const { owner, repo } = splitRepo(repoFullName)
    const { data } = await this.octokit.rest.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    })

    await this.octokit.graphql(
      `mutation DeleteIssue($issueId: ID!) {
        deleteIssue(input: { issueId: $issueId }) {
          clientMutationId
        }
      }`,
      { issueId: data.node_id }
    )
  }

  async blockUser(username: string) {
    await this.octokit.rest.users.block({ username })
  }

  async setInteractionLimits(repoFullName: string, limit: InteractionLimit, expiry: InteractionExpiry) {
    const { owner, repo } = splitRepo(repoFullName)
    await this.octokit.rest.interactions.setRestrictionsForRepo({
      owner,
      repo,
      limit,
      expiry,
    })
  }
}

export function splitRepo(repoFullName: string) {
  const [owner, repo] = repoFullName.split('/')
  if (!owner || !repo) throw new Error(`Invalid repository name: ${repoFullName}`)
  return { owner, repo }
}

export function getRateLimitRetryDelay(error: unknown, options: {
  nowSeconds?: number
  maxAutoWaitSeconds?: number
} = {}) {
  if (!isObject(error)) return null

  const status = typeof error.status === 'number' ? error.status : null
  if (status !== 403 && status !== 429) return null

  const headers = getErrorHeaders(error)
  const retryAfter = parseHeaderNumber(headers['retry-after'])
  if (retryAfter !== null && retryAfter > 0) {
    return capWaitSeconds(Math.max(retryAfter, 10), options.maxAutoWaitSeconds)
  }

  const remaining = parseHeaderNumber(headers['x-ratelimit-remaining'])
  const resetEpoch = parseHeaderNumber(headers['x-ratelimit-reset'])
  if (remaining !== 0 || resetEpoch === null) return null

  const waitSeconds = getResetWaitSeconds(resetEpoch, options.nowSeconds)
  return waitSeconds > 0 ? capWaitSeconds(waitSeconds, options.maxAutoWaitSeconds) : null
}

function getErrorHeaders(error: Record<string, unknown>) {
  if (isObject(error.response) && isObject(error.response.headers)) {
    return error.response.headers
  }
  if (isObject(error.headers)) {
    return error.headers
  }
  return {}
}

export function parseHeaderNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function getResetWaitSeconds(resetEpoch: number, nowSeconds = Date.now() / 1000) {
  return Math.ceil(resetEpoch - nowSeconds + 1)
}

function capWaitSeconds(waitSeconds: number, maxAutoWaitSeconds = Infinity) {
  return waitSeconds <= maxAutoWaitSeconds ? waitSeconds : null
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
