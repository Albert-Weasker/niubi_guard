import { Octokit } from '@octokit/rest'
import type { GuardEvent, GuardIssueState, InteractionExpiry, InteractionLimit } from './types.js'

export class GitHubGuardClient {
  private readonly octokit: Octokit

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token })
  }

  async listIssueEvents(repoFullName: string, options: {
    state: GuardIssueState
    since?: string | null
    maxPages: number
  }): Promise<GuardEvent[]> {
    const { owner, repo } = splitRepo(repoFullName)
    const events: GuardEvent[] = []

    for (let page = 1; page <= options.maxPages; page += 1) {
      const { data } = await this.octokit.rest.issues.listForRepo({
        owner,
        repo,
        state: options.state,
        sort: 'updated',
        direction: 'desc',
        since: options.since || undefined,
        per_page: 100,
        page,
      })

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
      const { data } = await this.octokit.rest.issues.listCommentsForRepo({
        owner,
        repo,
        sort: 'updated',
        direction: 'desc',
        since: options.since || undefined,
        per_page: 100,
        page,
      })

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
