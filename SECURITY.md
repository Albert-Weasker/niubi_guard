# Security Policy

## Supported Versions

Niubi Guard is pre-1.0. Security fixes target the latest published version and the default branch.

## Reporting a Vulnerability

Please report security issues privately by opening a GitHub security advisory for this repository, or by contacting the maintainers through the private channel listed on the repository profile.

Do not include live GitHub tokens, OpenAI-compatible API keys, private repository content, or unredacted abuse targets in public issues.

## Security Model

- Dry-run is the default.
- Destructive actions require explicit configuration and `--apply`.
- The Web UI does not persist GitHub or model API keys.
- Users are responsible for granting the minimum GitHub token permissions needed for their configured actions.
