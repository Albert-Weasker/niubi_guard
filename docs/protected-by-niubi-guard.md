# Protected by Niubi Guard Badge / Niubi Guard 防护徽章

This document defines the lightweight badge protocol for repositories, websites, and documentation sites protected by Niubi Guard.

本文定义 Niubi Guard 防护徽章的轻量协议，适用于已经安装、部署或接入 Niubi Guard 的仓库、官网和文档站。

## Badge Meaning / 徽章含义

`Protected by Niubi Guard` means the project has enabled Niubi Guard or an equivalent hosted Niubi Guard policy to help detect and respond to repository abuse, including spam Issues, coordinated harassment, fake-star accusation campaigns, cold-start account waves, and repeated attack templates.

`Protected by Niubi Guard` 表示该项目已启用 Niubi Guard 或等价的 Niubi Guard 托管防护策略，用于辅助识别和处置仓库滥用行为，包括垃圾 Issue、协同骚扰、刷星污蔑、冷启动账号攻击和重复攻击模板。

The badge is a transparency signal, not a guarantee that every abusive interaction will be removed instantly.

徽章是透明度标识，不承诺所有恶意互动都会被立即删除。

## Use Requirements / 使用条件

You may display the badge when at least one condition is true:

- The repository runs the open-source Niubi Guard CLI or scanner.
- The repository uses the hosted Niubi Guard service.
- The repository has a documented Niubi Guard policy and review workflow.
- The project is a demo, integration, or documentation example for Niubi Guard.

满足以下任一条件时，可以展示该徽章：

- 仓库正在运行开源 Niubi Guard CLI 或 scanner。
- 仓库正在使用 Niubi Guard 托管服务。
- 仓库具有明确的 Niubi Guard 防护策略和审核流程。
- 项目是 Niubi Guard 的演示、集成或文档示例。

Please do not use the badge to imply GitHub endorsement, official certification, or a zero-abuse guarantee.

请不要用该徽章暗示 GitHub 官方背书、官方认证或“零滥用”保证。

## Recommended Markdown / 推荐 Markdown

```markdown
[![Protected by Niubi Guard](https://img.shields.io/badge/protected%20by-niubi_guard-00bcd4?style=for-the-badge)](https://github.com/Albert-Weasker/niubi_guard/blob/main/docs/protected-by-niubi-guard.md)
```

## Recommended HTML / 推荐 HTML

```html
<a href="https://github.com/Albert-Weasker/niubi_guard/blob/main/docs/protected-by-niubi-guard.md" rel="noopener">
  <img
    src="https://img.shields.io/badge/protected%20by-niubi_guard-00bcd4?style=for-the-badge"
    alt="Protected by Niubi Guard"
  />
</a>
```

## Text-Only Embed / 纯文本嵌入

```html
<a href="https://github.com/Albert-Weasker/niubi_guard/blob/main/docs/protected-by-niubi-guard.md" rel="noopener">
  This repository is protected by Niubi Guard.
</a>
```

```html
<a href="https://github.com/Albert-Weasker/niubi_guard/blob/main/docs/protected-by-niubi-guard.md" rel="noopener">
  此仓库正在由 Niubi Guard 防护。
</a>
```

## Website Snippet / 官网或文档站片段

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

## Future Dynamic Badge / 未来动态徽章

The static Shields badge is the current recommended embed. A hosted dynamic endpoint may be introduced later:

当前推荐使用静态 Shields 徽章。未来可以增加官网动态端点：

```html
<img
  src="https://www.niubistar.com/guard/badge.svg?repo=owner/repo"
  alt="Protected by Niubi Guard"
/>
```

When a dynamic endpoint exists, it should only return a positive protection status for repositories that have opted in or are verifiably protected.

如果未来上线动态端点，只有主动接入或可验证已防护的仓库才应返回正向防护状态。

## Removal / 移除

Remove the badge if Niubi Guard is no longer deployed, if the repository no longer maintains a Guard policy, or if the badge would mislead users about the protection status.

如果不再部署 Niubi Guard、不再维护 Guard 策略，或徽章会误导用户理解防护状态，请移除该徽章。
