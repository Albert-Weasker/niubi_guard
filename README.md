<p align="center">
  <img src="./public/logo.png" alt="Niubi Guard" width="420" />
</p>

# Niubi Guard

A free, open-source defense system that protects GitHub maintainers from spam, harassment, and coordinated abuse.

[Apache-2.0 License](./LICENSE) · [Homepage](#web-ui) · [GitHub](https://github.com/Albert-Weasker/niubi_guard) · [English](./README.md) · [简体中文](./README.zh-CN.md)

[What it does](#what-it-does) · [Install](#install) · [Web UI](#web-ui) · [AI Detection](#ai-detection) · [Configuration](#configuration) · [CLI](#cli) · [Contributing](#contributing)

Niubi Guard helps maintainers defend their repositories without hiding the policy. You choose the detection signals, users, allowlists, model, prompts, confidence threshold, and response actions. Dry-run is the default. Strong actions only happen when you configure them and run apply mode.

We built it because maintainers reported coordinated attacks: hostile Issues, repeated copy-paste accusations, and reputation-pressure campaigns. More maintainers are seeing the same pattern. Normal project promotion is allowed. Coordinated harassment is not.

> **Don't want to self-host?** Use the free hosted version at [niubistar.com/guard](https://www.niubistar.com/guard) — no configuration needed. The open-source version is continuously improved. Issues and feedback are welcome on [GitHub](https://github.com/Albert-Weasker/niubi_guard/issues).

## What it does

**Transparent.** Every detection carries labels, matched keywords or usernames, AI confidence, reasons, evidence, and planned actions.

**User-controlled.** Delete, close, lock, block, and interaction-limit actions stay off until the maintainer explicitly enables them.

**AI-powered.** Use your own OpenAI-compatible model. Bring your own base URL, API key, model, prompt, and confidence threshold.

**Open source.** The defense logic, UI, CLI, configuration schema, and placeholder brand assets are available for maintainers to inspect and improve.

**Multilingual.** The first release supports English and 简体中文 in the web UI and documentation.

## Install

Install the CLI from npm:

```bash
npm install -g niubi-guard
niubi-guard init
niubi-guard scan --config guard.config.json
```

Or run from source:

```bash
git clone https://github.com/Albert-Weasker/niubi_guard.git
cd niubi_guard
pnpm install
```

Run the web UI:

```bash
pnpm dev:web
```

Then open `http://localhost:3000`. If that port is busy, Next.js will choose another port.

Run a CLI dry-run:

```bash
export GITHUB_TOKEN=github_pat_xxx
pnpm dev -- init
pnpm scan -- --config guard.config.json
```

Run with Docker:

```bash
docker build -t niubi-guard .
docker run --rm -p 3000:3000 niubi-guard
```

## Web UI

The UI is a product console and policy builder:

- GitHub token and repository list
- detection signals and username defense
- allow phrases and allow users
- OpenAI-compatible AI detection
- confidence threshold and prompt editing
- review-only or auto-plan mode
- dry-run or apply mode
- scan output with detection labels, reasons, AI confidence, and planned actions
- **Docs button** with a built-in operation manual (bilingual)

API keys are not stored by the app. The browser sends them only for the current scan request.

## AI Detection

Niubi Guard can scan your own Issues and comments with an OpenAI-compatible model. It is designed to detect semantic attacks that do not always contain obvious signals:

- malicious Issues
- bot-like reports
- coordinated harassment
- spam campaigns
- mass-mention abuse
- template-based copy-paste attacks

The adapter calls:

```text
POST {baseUrl}/chat/completions
```

The model must return strict JSON:

```json
{
  "malicious": true,
  "confidence": 0.91,
  "label": "fake_star_accusation",
  "reason": "The Issue repeats an accusation template without project-specific evidence.",
  "evidence": ["same allegation pattern", "no technical detail"]
}
```

By default, LLM detections are `review_only`. Switch to `auto_plan` only when you want high-confidence AI detections to create planned actions from your enabled policy.

## Configuration

Create `guard.config.json`:

```json
{
  "repositories": ["owner/repo"],
  "rules": {
    "keywords": ["spam template", "copy-paste", "mass mention", "repeated link"],
    "denyUsers": ["suspicious-login"],
    "allowPhrases": ["good-faith report", "security disclosure"],
    "allowUsers": ["trusted-maintainer"]
  },
  "scan": {
    "includeIssues": true,
    "includeComments": true,
    "state": "open",
    "since": null,
    "maxPages": 5
  },
  "llm": {
    "enabled": false,
    "baseUrl": "https://api.openai.com/v1",
    "apiKey": "",
    "model": "gpt-4o-mini",
    "temperature": 0.1,
    "confidenceThreshold": 0.8,
    "reviewMode": "review_only",
    "systemPrompt": "You are Niubi Guard, a GitHub repository abuse detection classifier. Detect spam, harassment, coordinated attacks, and template-based abuse. Do not flag good-faith criticism or valid reports.",
    "userPromptTemplate": "Repository: {{repoFullName}}\nType: {{sourceType}}\nAuthor: {{actorLogin}}\nTitle: {{title}}\nBody:\n{{body}}"
  },
  "actions": {
    "deleteComments": false,
    "closeIssues": false,
    "lockIssues": false,
    "deleteIssues": false,
    "blockUsers": false,
    "setInteractionLimits": false
  },
  "interactionLimits": {
    "limit": "existing_users",
    "expiry": "one_month"
  }
}
```

Destructive actions are disabled by default. Maintainers can enable them per repository policy.

## CLI

Create a starter config:

```bash
niubi-guard init
```

Dry-run:

```bash
niubi-guard scan --config guard.config.json
```

Apply enabled actions:

```bash
niubi-guard scan --config guard.config.json --apply
```

Without `--apply`, Niubi Guard only prints detections and planned actions.

## Development

```bash
pnpm install
pnpm check
pnpm build
npm pack --dry-run
```

The npm package publishes the CLI/library surface from `dist/`. The Next.js Web UI is built and deployed separately through `pnpm build`, `pnpm start:web`, or the included Dockerfile.

## Contributing

We welcome:

- attack samples
- false-positive samples
- prompt improvements
- model adapter improvements
- language translations
- UI and accessibility improvements
- GitHub App, GitHub Action, and self-hosted deployment ideas

Please read [CONTRIBUTING.md](./CONTRIBUTING.md), [SECURITY.md](./SECURITY.md), and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before opening issues or pull requests.

Niubi Guard is a defensive project. It does not provide growth services, manipulate metrics, or declare official truth. It gives maintainers a transparent risk detection and response system they can control.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Albert-Weasker/niubi_guard&type=Date)](https://www.star-history.com/#Albert-Weasker/niubi_guard&Date)

## Roadmap

- `v0.1`: rule detection, AI detection, web UI, audit output, manual response
- `v0.2`: review queue, labels, false-positive management
- `v0.3`: threat fingerprints and community threat feed
- `v1.0`: GitHub App, GitHub Action, and self-hosted deployment
