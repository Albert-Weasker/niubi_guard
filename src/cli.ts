#!/usr/bin/env node
import { copyFile, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadGuardConfig } from './config.js'
import { GitHubGuardClient } from './github.js'
import { scanRepositories } from './scanner.js'

type CliArgs = {
  command: string
  configPath: string
  apply: boolean
  help: boolean
  version: boolean
  force: boolean
}

const require = createRequire(import.meta.url)
const packageJson = require('../package.json') as { version: string }

export async function runCli(argv = process.argv.slice(2), env = process.env, cwd = process.cwd()) {
  const args = parseArgs(argv)

  if (args.version) {
    process.stdout.write(`${packageJson.version}\n`)
    return 0
  }

  if (args.help || !args.command) {
    printHelp()
    return 0
  }

  if (args.command === 'init') {
    await initConfig(cwd, args.force)
    return 0
  }

  if (args.command !== 'scan') {
    process.stderr.write(`Unknown command: ${args.command}\n\n`)
    printHelp()
    return 1
  }

  const token = env.GITHUB_TOKEN
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

  return report.errors.length > 0 ? 2 : 0
}

export function parseArgs(argv: string[]): CliArgs {
  const command = argv[0]?.startsWith('-') ? '' : argv[0] || ''
  let configPath = 'guard.config.json'
  let apply = false
  let help = false
  let version = false
  let force = false

  for (let index = command ? 1 : 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--help' || arg === '-h') {
      help = true
    } else if (arg === '--version' || arg === '-v') {
      version = true
    } else if (arg === '--config') {
      const nextValue = argv[index + 1]
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('--config requires a file path')
      }
      configPath = nextValue
      index += 1
    } else if (arg === '--apply') {
      apply = true
    } else if (arg === '--force') {
      force = true
    } else {
      throw new Error(`Unknown option: ${arg}`)
    }
  }

  return { command, configPath, apply, help, version, force }
}

async function initConfig(cwd: string, force: boolean) {
  const targetPath = resolve(cwd, 'guard.config.json')
  if (!force && await exists(targetPath)) {
    throw new Error('guard.config.json already exists. Use --force to overwrite it.')
  }

  const cliDir = dirname(fileURLToPath(import.meta.url))
  const examplePath = resolve(cliDir, '../guard.config.example.json')
  await copyFile(examplePath, targetPath)
  process.stdout.write(`Created ${targetPath}\n`)
}

async function exists(path: string) {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

function printHelp() {
  process.stdout.write(`Niubi Guard

Usage:
  niubi-guard init [--force]
  niubi-guard scan --config guard.config.json [--apply]
  niubi-guard --help
  niubi-guard --version

Environment:
  GITHUB_TOKEN  GitHub token with repository moderation permissions.

Notes:
  init creates a starter guard.config.json in the current directory.
  Dry-run is the default. Enabled actions are executed only with --apply.
`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli().then((code) => {
    process.exit(code)
  }).catch((error) => {
    const message = error instanceof Error ? error.message : String(error)
    process.stderr.write(`${message}\n`)
    process.exit(1)
  })
}
