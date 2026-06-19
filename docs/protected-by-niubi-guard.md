# Protected by Niubi Guard Badge

English | [简体中文](protected-by-niubi-guard.zh-CN.md)

This document defines the lightweight badge protocol for repositories, websites, and documentation sites protected by Niubi Guard.

## Badge Meaning

`Protected by Niubi Guard` means the project has enabled Niubi Guard or an equivalent hosted Niubi Guard policy to help detect and respond to repository abuse, including spam Issues, coordinated harassment, fake-star accusation campaigns, cold-start account waves, and repeated attack templates.

The badge is a transparency signal, not a guarantee that every abusive interaction will be removed instantly.

## Use Requirements

You may display the badge when at least one condition is true:

- The repository runs the open-source Niubi Guard CLI or scanner.
- The repository uses the hosted Niubi Guard service.
- The repository has a documented Niubi Guard policy and review workflow.
- The project is a demo, integration, or documentation example for Niubi Guard.

Please do not use the badge to imply GitHub endorsement, official certification, or a zero-abuse guarantee.

## Recommended Markdown

```markdown
[![Protected by Niubi Guard](https://img.shields.io/badge/protected%20by-niubi_guard-00bcd4?style=for-the-badge)](https://github.com/Albert-Weasker/niubi_guard/blob/main/docs/protected-by-niubi-guard.md)
```

## Recommended HTML

```html
<a href="https://github.com/Albert-Weasker/niubi_guard/blob/main/docs/protected-by-niubi-guard.md" rel="noopener">
  <img
    src="https://img.shields.io/badge/protected%20by-niubi_guard-00bcd4?style=for-the-badge"
    alt="Protected by Niubi Guard"
  />
</a>
```

## Text-Only Embed

```html
<a href="https://github.com/Albert-Weasker/niubi_guard/blob/main/docs/protected-by-niubi-guard.md" rel="noopener">
  This repository is protected by Niubi Guard.
</a>
```

## Website Snippet

```html
<section aria-label="Repository protection status">
  <a href="https://github.com/Albert-Weasker/niubi_guard/blob/main/docs/protected-by-niubi-guard.md" rel="noopener">
    <img
      src="https://img.shields.io/badge/protected%20by-niubi_guard-00bcd4?style=for-the-badge"
      alt="Protected by Niubi Guard"
    />
  </a>
  <p>This repository uses Niubi Guard to help detect spam, coordinated abuse, and repeated attack templates.</p>
</section>
```

## Future Dynamic Badge

The static Shields badge is the current recommended embed. A hosted dynamic endpoint may be introduced later:

```html
<img
  src="https://www.niubistar.com/guard/badge.svg?repo=owner/repo"
  alt="Protected by Niubi Guard"
/>
```

When a dynamic endpoint exists, it should only return a positive protection status for repositories that have opted in or are verifiably protected.

## Removal

Remove the badge if Niubi Guard is no longer deployed, if the repository no longer maintains a Guard policy, or if the badge would mislead users about the protection status.
