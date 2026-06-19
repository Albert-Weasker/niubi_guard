# Niubi Guard 防护徽章

[English](protected-by-niubi-guard.md) | 简体中文

本文定义 Niubi Guard 防护徽章的轻量协议，适用于已经安装、部署或接入 Niubi Guard 的仓库、官网和文档站。

## 徽章含义

`Protected by Niubi Guard` 表示该项目已启用 Niubi Guard 或等价的 Niubi Guard 托管防护策略，用于辅助识别和处置仓库滥用行为，包括垃圾 Issue、协同骚扰、刷星污蔑、冷启动账号攻击和重复攻击模板。

徽章是透明度标识，不承诺所有恶意互动都会被立即删除。

## 使用条件

满足以下任一条件时，可以展示该徽章：

- 仓库正在运行开源 Niubi Guard CLI 或 scanner。
- 仓库正在使用 Niubi Guard 托管服务。
- 仓库具有明确的 Niubi Guard 防护策略和审核流程。
- 项目是 Niubi Guard 的演示、集成或文档示例。

请不要用该徽章暗示 GitHub 官方背书、官方认证或“零滥用”保证。

## 推荐 Markdown

```markdown
[![Protected by Niubi Guard](https://img.shields.io/badge/protected%20by-niubi_guard-00bcd4?style=for-the-badge)](https://github.com/Albert-Weasker/niubi_guard/blob/main/docs/protected-by-niubi-guard.zh-CN.md)
```

## 推荐 HTML

```html
<a href="https://github.com/Albert-Weasker/niubi_guard/blob/main/docs/protected-by-niubi-guard.zh-CN.md" rel="noopener">
  <img
    src="https://img.shields.io/badge/protected%20by-niubi_guard-00bcd4?style=for-the-badge"
    alt="Protected by Niubi Guard"
  />
</a>
```

## 纯文本嵌入

```html
<a href="https://github.com/Albert-Weasker/niubi_guard/blob/main/docs/protected-by-niubi-guard.zh-CN.md" rel="noopener">
  此仓库正在由 Niubi Guard 防护。
</a>
```

## 官网或文档站片段

```html
<section aria-label="Repository protection status">
  <a href="https://github.com/Albert-Weasker/niubi_guard/blob/main/docs/protected-by-niubi-guard.zh-CN.md" rel="noopener">
    <img
      src="https://img.shields.io/badge/protected%20by-niubi_guard-00bcd4?style=for-the-badge"
      alt="Protected by Niubi Guard"
    />
  </a>
  <p>此仓库使用 Niubi Guard 辅助识别垃圾信息、协同滥用和重复攻击模板。</p>
</section>
```

## 未来动态徽章

当前推荐使用静态 Shields 徽章。未来可以增加官网动态端点：

```html
<img
  src="https://www.niubistar.com/guard/badge.svg?repo=owner/repo"
  alt="Protected by Niubi Guard"
/>
```

如果未来上线动态端点，只有主动接入或可验证已防护的仓库才应返回正向防护状态。

## 移除

如果不再部署 Niubi Guard、不再维护 Guard 策略，或徽章会误导用户理解防护状态，请移除该徽章。
