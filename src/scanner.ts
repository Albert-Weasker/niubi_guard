import type { GuardConfig } from './config.js'
import { detectEvent } from './detector.js'
import { GitHubGuardClient } from './github.js'
import { executeActionPlan } from './responder.js'
import type { GuardScanReport } from './types.js'

export async function scanRepositories(options: {
  client: GitHubGuardClient
  config: GuardConfig
  apply: boolean
}): Promise<GuardScanReport> {
  const report: GuardScanReport = {
    repositoriesScanned: 0,
    eventsScanned: 0,
    detections: [],
    actions: [],
    errors: [],
  }

  for (const repoFullName of options.config.repositories) {
    try {
      const events = []

      if (options.config.scan.includeIssues) {
        events.push(...await options.client.listIssueEvents(repoFullName, {
          state: options.config.scan.state,
          since: options.config.scan.since,
          maxPages: options.config.scan.maxPages,
        }))
      }

      if (options.config.scan.includeComments) {
        events.push(...await options.client.listCommentEvents(repoFullName, {
          since: options.config.scan.since,
          maxPages: options.config.scan.maxPages,
        }))
      }

      report.repositoriesScanned += 1
      report.eventsScanned += events.length

      for (const event of events) {
        let detection = null
        try {
          detection = await detectEvent(event, options.config)
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          report.errors.push(`${repoFullName}:${event.sourceType}:${event.sourceId}: ${message}`)
          continue
        }
        if (!detection) continue

        report.detections.push(detection)

        for (const plan of detection.suggestedActions) {
          const result = await executeActionPlan(options.client, plan, options.config, options.apply)
          report.actions.push(result)
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      report.errors.push(`${repoFullName}: ${message}`)
    }
  }

  return report
}
