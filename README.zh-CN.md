<p align="center">
  <img src="./public/logo.png" alt="Niubi Guard" width="420" />
</p>

# Niubi Guard

一个免费开源的 GitHub 仓库防御系统，保护维护者免受垃圾信息、骚扰和协同攻击的侵扰。

[Apache-2.0 License](./LICENSE) · [Homepage](#web-ui) · [GitHub](https://github.com/Albert-Weasker/niubi_guard) · [English](./README.md) · [简体中文](./README.zh-CN.md)

[能力](#能力) · [安装](#安装) · [Web UI](#web-ui) · [AI 侦测](#ai-侦测) · [配置](#配置) · [CLI](#cli) · [贡献](#贡献)

Niubi Guard 帮助维护者防护仓库，同时保持策略透明。检测信号、用户名、放行规则、模型、提示词、置信度阈值和响应动作都由你配置。默认是 dry-run。只有当你启用动作并进入 apply mode，强动作才会执行。

我们做它，是因为维护者遭遇了协同攻击：恶意 Issue、重复的复制粘贴指控和声誉施压。越来越多维护者遇到同样的问题。正常项目推广是权利，协同骚扰不是。

> **不想自己部署？** 直接使用 [niubistar.com/guard](https://www.niubistar.com/guard) 的免费托管版本——无需任何配置。开源版本会持续优化。欢迎在 [GitHub](https://github.com/Albert-Weasker/niubi_guard/issues) 提交 Issue 和反馈。

## 能力

**透明。** 每条检测都会包含标签、命中的关键词或用户名、AI 置信度、理由、证据和计划动作。

**用户控制。** 删除、关闭、锁定、拉黑和限制互动默认关闭，只有维护者明确启用才会进入计划。

**AI 驱动。** 使用你自己的 OpenAI-compatible 模型。你可以配置 base URL、API key、model、prompt 和 confidence threshold。

**开源。** 防护逻辑、UI、CLI、配置 schema 和占位品牌资产都可以被维护者检查和改进。

**多语言。** 首版 Web UI 和文档支持 English 和 简体中文。

## 安装

从 npm 安装 CLI：

```bash
npm install -g niubi-guard
niubi-guard init
niubi-guard scan --config guard.config.json
```

或从源码运行：

```bash
git clone https://github.com/Albert-Weasker/niubi_guard.git
cd niubi_guard
pnpm install
```

启动 Web UI：

```bash
pnpm dev:web
```

然后打开 `http://localhost:3000`。如果端口被占用，Next.js 会自动选择其他端口。

CLI dry-run：

```bash
export GITHUB_TOKEN=github_pat_xxx
pnpm dev -- init
pnpm scan -- --config guard.config.json
```

使用 Docker 运行：

```bash
docker build -t niubi-guard .
docker run --rm -p 3000:3000 niubi-guard
```

## Web UI

UI 是产品控制台和策略配置器：

- GitHub token 和仓库列表
- 检测信号和用户名防御
- 放行短语和放行用户
- OpenAI-compatible AI 侦测
- 置信度阈值和提示词编辑
- 仅复核或自动生成动作计划
- dry-run 或 apply mode
- 展示检测标签、理由、AI 置信度和计划动作
- **文档按钮**内置完整操作手册（中英文双语）

API key 不会被应用保存。浏览器只会在本次扫描请求中发送它。

## AI 侦测

Niubi Guard 可以使用 OpenAI-compatible 模型扫描你自己的 Issues 和评论。它用于识别不一定包含明显关键词的语义型攻击：

- 恶意 Issue
- 机器人式举报
- 协同骚扰
- 垃圾信息传播
- 大规模提及滥用
- 模板化复制粘贴攻击

适配器调用：

```text
POST {baseUrl}/chat/completions
```

模型必须返回严格 JSON：

```json
{
  "malicious": true,
  "confidence": 0.91,
  "label": "fake_star_accusation",
  "reason": "该 Issue 重复指控模板，缺少项目相关证据。",
  "evidence": ["重复指控模式", "没有技术细节"]
}
```

默认情况下，LLM 命中是 `review_only`。只有当你希望高置信 AI 命中按照已启用策略生成计划动作时，才切换到 `auto_plan`。

## 配置

创建 `guard.config.json`：

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

破坏性动作默认关闭。维护者可以按仓库策略自行开启。

## CLI

创建初始配置：

```bash
niubi-guard init
```

Dry-run：

```bash
niubi-guard scan --config guard.config.json
```

执行已启用动作：

```bash
niubi-guard scan --config guard.config.json --apply
```

没有 `--apply` 时，Niubi Guard 只输出检测和计划动作。

## 开发

```bash
pnpm install
pnpm check
pnpm build
npm pack --dry-run
```

npm 包发布 `dist/` 中的 CLI/库入口。Next.js Web UI 通过 `pnpm build`、`pnpm start:web` 或内置 Dockerfile 单独构建部署。

## 贡献

我们欢迎：

- 攻击样本
- 误报样本
- 提示词改进
- 模型适配改进
- 语言翻译
- UI 和可访问性改进
- GitHub App、GitHub Action 和自托管部署建议

提交 Issue 或 Pull Request 前，请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)、[SECURITY.md](./SECURITY.md) 和 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)。

Niubi Guard 是防御型项目。它不提供增长服务，不操纵指标，也不输出官方定性。它提供的是维护者可控制的透明风险检测与响应系统。

## 路线图

- `v0.1`：规则检测、AI 侦测、Web UI、审计输出、手动响应
- `v0.2`：复核队列、标签、误报管理
- `v0.3`：威胁指纹和社区 threat feed
- `v1.0`：GitHub App、GitHub Action 和自托管部署
