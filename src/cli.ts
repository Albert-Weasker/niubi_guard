#!/usr/bin/env node
import { loadGuardConfig } from './config.js'
import { GitHubGuardClient } from './github.js'
import { scanRepositories } from './scanner.js'

type CliArgs = {
  command: string
  configPath: string
  apply: boolean
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.command !== 'scan') {
    printHelp()
    process.exit(args.command ? 1 : 0)
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error('GITHUB_TOKEN is required')
  }

  const config = await loadGuardConfig(args.configPath)
  const client = new GitHubGuardClient(token)
  const report = await scanRepositories({
    client,
    config,
    apply: args.apply,
  })

  process.stdout.write(`${JSON.stringify({
    mode: args.apply ? 'apply' : 'dry-run',
    ...report,
  }, null, 2)}\n`)
}

function parseArgs(argv: string[]): CliArgs {
  const command = argv[0] || ''
  let configPath = 'guard.config.json'
  let apply = false

  for (let index = 1; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--config') {
      configPath = argv[index + 1] || configPath
      index += 1
    } else if (arg === '--apply') {
      apply = true
    }
  }

  return { command, configPath, apply }
}

function printHelp() {
  process.stdout.write(`Niubi Guard

Usage:
  niubi-guard scan --config guard.config.json [--apply]

Environment:
  GITHUB_TOKEN  GitHub token with repository moderation permissions.

Notes:
  Dry-run is the default. Enabled actions are executed only with --apply.
`)
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  process.stderr.write(`${message}\n`)
  process.exit(1)
})
