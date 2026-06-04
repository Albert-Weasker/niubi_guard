# Contributing

Thanks for helping improve Niubi Guard. This project is focused on defensive tooling for maintainers: abuse detection, transparent review output, safer response planning, and self-hosted operation.

## Development

```bash
pnpm install
pnpm dev:web
```

Run the CLI locally:

```bash
pnpm dev -- --help
pnpm dev -- init
pnpm scan -- --config guard.config.json
```

Before opening a pull request:

```bash
pnpm check
pnpm build
npm pack --dry-run
```

## Pull Requests

- Keep changes focused and explain the maintainer workflow they improve.
- Add tests for detection, configuration, CLI parsing, or response behavior when those areas change.
- Keep destructive GitHub actions disabled by default.
- Avoid adding telemetry or storing GitHub/API credentials.

## Samples

Abuse samples and false-positive samples are useful. Please remove private data, tokens, and identifying details unless they are essential to a public report.
