'use client'

import {
  AlertTriangle,
  Ban,
  Bot,
  CheckCircle2,
  CirclePlay,
  ExternalLink,
  FileWarning,
  Github,
  KeyRound,
  Languages,
  LockKeyhole,
  MessageSquareWarning,
  Radar,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserX,
} from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import type { GuardConfig } from '@/src/config'
import { DEFAULT_LLM_SYSTEM_PROMPT, DEFAULT_LLM_USER_PROMPT_TEMPLATE } from '@/src/prompts'
import type { GuardScanReport } from '@/src/types'
import { locales, type UILocale } from './locales'

type ScanResponse = {
  success: boolean
  mode?: 'dry-run' | 'apply'
  report?: GuardScanReport
  error?: string
}

type ToggleKey =
  | 'deleteComments'
  | 'closeIssues'
  | 'lockIssues'
  | 'deleteIssues'
  | 'blockUsers'
  | 'setInteractionLimits'

const defaultKeywords = 'spam template, repeated copy-paste, mass mention, suspicious pattern'

export default function GuardDashboard() {
  const [locale, setLocale] = useState<UILocale>('en')
  const copy = locales[locale]
  const [token, setToken] = useState('')
  const [repositories, setRepositories] = useState('owner/repo')
  const [keywords, setKeywords] = useState(defaultKeywords)
  const [denyUsers, setDenyUsers] = useState('')
  const [allowPhrases, setAllowPhrases] = useState('')
  const [allowUsers, setAllowUsers] = useState('')
  const [state, setState] = useState<'open' | 'closed' | 'all'>('open')
  const [maxPages, setMaxPages] = useState(5)
  const [includeIssues, setIncludeIssues] = useState(true)
  const [includeComments, setIncludeComments] = useState(true)
  const [apply, setApply] = useState(false)
  const [llmEnabled, setLlmEnabled] = useState(false)
  const [llmBaseUrl, setLlmBaseUrl] = useState('https://api.openai.com/v1')
  const [llmApiKey, setLlmApiKey] = useState('')
  const [llmModel, setLlmModel] = useState('gpt-4o-mini')
  const [llmTemperature, setLlmTemperature] = useState(0.1)
  const [llmThreshold, setLlmThreshold] = useState(0.8)
  const [llmReviewMode, setLlmReviewMode] = useState<'review_only' | 'auto_plan'>('review_only')
  const [llmSystemPrompt, setLlmSystemPrompt] = useState(DEFAULT_LLM_SYSTEM_PROMPT)
  const [llmUserPrompt, setLlmUserPrompt] = useState(DEFAULT_LLM_USER_PROMPT_TEMPLATE)
  const [actions, setActions] = useState<Record<ToggleKey, boolean>>({
    deleteComments: false,
    closeIssues: false,
    lockIssues: false,
    deleteIssues: false,
    blockUsers: false,
    setInteractionLimits: false,
  })
  const [report, setReport] = useState<GuardScanReport | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDocs, setShowDocs] = useState(false)

  const config = useMemo<GuardConfig>(() => ({
    repositories: splitList(repositories),
    rules: {
      keywords: splitList(keywords),
      denyUsers: splitList(denyUsers),
      allowPhrases: splitList(allowPhrases),
      allowUsers: splitList(allowUsers),
    },
    scan: {
      includeIssues,
      includeComments,
      state,
      since: null,
      maxPages,
    },
    actions,
    interactionLimits: {
      limit: 'existing_users',
      expiry: 'one_month',
    },
    llm: {
      enabled: llmEnabled,
      baseUrl: llmBaseUrl,
      apiKey: llmApiKey,
      model: llmModel,
      temperature: llmTemperature,
      confidenceThreshold: llmThreshold,
      reviewMode: llmReviewMode,
      systemPrompt: llmSystemPrompt,
      userPromptTemplate: llmUserPrompt,
    },
  }), [
    actions,
    allowPhrases,
    allowUsers,
    denyUsers,
    includeComments,
    includeIssues,
    keywords,
    llmApiKey,
    llmBaseUrl,
    llmEnabled,
    llmModel,
    llmReviewMode,
    llmSystemPrompt,
    llmTemperature,
    llmThreshold,
    llmUserPrompt,
    maxPages,
    repositories,
    state,
  ])

  const enabledActions = Object.values(actions).filter(Boolean).length

  async function runScan(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setReport(null)

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, config, apply }),
      })
      const data = await response.json() as ScanResponse

      if (!response.ok || !data.success || !data.report) {
        throw new Error(data.error || 'Scan failed')
      }

      setReport(data.report)
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : String(scanError))
    } finally {
      setLoading(false)
    }
  }

  function setAction(key: ToggleKey, value: boolean) {
    setActions((current) => ({ ...current, [key]: value }))
  }

  return (
    <main className="guard-app">
      <section className="topbar">
        <div className="brand">
          <img src="/logo.png" alt="Niubi Guard logo" />
          <div>
            <strong>Niubi Guard</strong>
            <span>{copy.brandSubtitle}</span>
          </div>
        </div>
        <div className="status-strip">
          <button className="language-switch" type="button" onClick={() => setLocale(locale === 'en' ? 'zh-CN' : 'en')}>
            <Languages size={16} /> {copy.languageName}
          </button>
          <span><Github size={16} /> {copy.badges.open}</span>
          <button className="language-switch" type="button" onClick={() => setShowDocs(true)}>
            <Radar size={16} /> {copy.badges.free}
          </button>
          <span><LockKeyhole size={16} /> {copy.badges.actions}</span>
        </div>
      </section>

      <section className="mission-hero">
        <div className="mission-copy">
          <span className="eyebrow"><Sparkles size={14} /> {copy.heroKicker}</span>
          <h1>{copy.heroTitle}</h1>
          <p>{copy.heroBody}</p>
          <div className="mission-tags">
            {copy.heroTags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </section>

      <section className="limits-section">
        <div className="limits-head">
          <span className="eyebrow"><Ban size={14} /> {copy.notDoTitle}</span>
        </div>
        <div className="limits-grid">
          {copy.notDoItems.map((item) => (
            <span key={item}><CheckCircle2 size={15} /> {item}</span>
          ))}
        </div>
      </section>

      <section className="cloud-banner">
        <div className="cloud-banner-inner">
          <span className="cloud-banner-text">
            <Sparkles size={16} /> {copy.cloudBanner}
          </span>
          <a className="cloud-banner-link" href="https://www.niubistar.com/guard" target="_blank" rel="noopener noreferrer">
            {copy.cloudCta} <ExternalLink size={14} />
          </a>
        </div>
      </section>

      <section className="workspace">
        <form className="control-surface" onSubmit={runScan}>
          <div className="surface-head">
            <div>
              <span className="eyebrow"><Sparkles size={14} /> {copy.policyKicker}</span>
              <h2>{copy.policyTitle}</h2>
            </div>
            <button className="run-button" type="submit" disabled={loading || !token.trim()}>
              <CirclePlay size={18} />
              {loading ? copy.scanning : apply ? copy.applyScan : copy.dryRun}
            </button>
          </div>

          <div className="setup-grid">
            <Field label={copy.token} icon={<KeyRound size={17} />}>
              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="github_pat_..."
                autoComplete="off"
              />
            </Field>

            <Field label={copy.repositories} icon={<Github size={17} />}>
              <textarea
                value={repositories}
                onChange={(event) => setRepositories(event.target.value)}
                rows={3}
                placeholder="owner/repo, org/project"
              />
            </Field>
          </div>

          <div className="policy-grid">
            <Field label={copy.keywords} icon={<MessageSquareWarning size={17} />}>
              <textarea
                value={keywords}
                onChange={(event) => setKeywords(event.target.value)}
                rows={4}
                placeholder="repeated link, copy-paste template, mass mention, suspicious account"
              />
            </Field>

            <Field label={copy.denyUsers} icon={<UserX size={17} />}>
              <textarea
                value={denyUsers}
                onChange={(event) => setDenyUsers(event.target.value)}
                rows={4}
                placeholder="suspicious-login, repeat-attacker"
              />
            </Field>

            <Field label={copy.allowPhrases} icon={<CheckCircle2 size={17} />}>
              <textarea
                value={allowPhrases}
                onChange={(event) => setAllowPhrases(event.target.value)}
                rows={3}
                placeholder="good-faith report, security disclosure"
              />
            </Field>

            <Field label={copy.allowUsers} icon={<CheckCircle2 size={17} />}>
              <textarea
                value={allowUsers}
                onChange={(event) => setAllowUsers(event.target.value)}
                rows={3}
                placeholder="trusted-maintainer, org-admin"
              />
            </Field>
          </div>

          <div className="scan-row">
            <label className="segmented">
              <span><SlidersHorizontal size={16} /> {copy.issueState}</span>
              <select value={state} onChange={(event) => setState(event.target.value as typeof state)}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="all">All</option>
              </select>
            </label>
            <label className="number-field">
              <span>{copy.pages}</span>
              <input
                type="number"
                min={1}
                max={50}
                value={maxPages}
                onChange={(event) => setMaxPages(Number(event.target.value))}
              />
            </label>
            <Toggle label={copy.issues} checked={includeIssues} onChange={setIncludeIssues} />
            <Toggle label={copy.comments} checked={includeComments} onChange={setIncludeComments} />
          </div>

          <section className="actions-panel" id="ai-detection">
            <div className="actions-head">
              <div>
                <span className="eyebrow"><Bot size={14} /> {copy.aiKicker}</span>
                <h2>{copy.aiTitle}</h2>
              </div>
              <Toggle label={copy.aiEnabled} checked={llmEnabled} onChange={setLlmEnabled} emphasis />
            </div>
            <div className="ai-grid">
              <Field label={copy.baseUrl} icon={<Radar size={17} />}>
                <input value={llmBaseUrl} onChange={(event) => setLlmBaseUrl(event.target.value)} />
              </Field>
              <Field label={copy.apiKey} icon={<KeyRound size={17} />}>
                <input
                  type="password"
                  value={llmApiKey}
                  onChange={(event) => setLlmApiKey(event.target.value)}
                  placeholder="sk-..."
                  autoComplete="off"
                />
              </Field>
              <Field label={copy.model} icon={<Bot size={17} />}>
                <input value={llmModel} onChange={(event) => setLlmModel(event.target.value)} />
              </Field>
              <label className="number-field">
                <span>{copy.threshold}: {llmThreshold.toFixed(2)}</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={llmThreshold}
                  onChange={(event) => setLlmThreshold(Number(event.target.value))}
                />
              </label>
              <label className="number-field">
                <span>Temperature</span>
                <input
                  type="number"
                  min={0}
                  max={2}
                  step={0.1}
                  value={llmTemperature}
                  onChange={(event) => setLlmTemperature(Number(event.target.value))}
                />
              </label>
              <label className="segmented">
                <span>{copy.reviewMode}</span>
                <select value={llmReviewMode} onChange={(event) => setLlmReviewMode(event.target.value as typeof llmReviewMode)}>
                  <option value="review_only">{copy.reviewOnly}</option>
                  <option value="auto_plan">{copy.autoPlan}</option>
                </select>
              </label>
              <Field label={copy.systemPrompt} icon={<MessageSquareWarning size={17} />}>
                <textarea value={llmSystemPrompt} onChange={(event) => setLlmSystemPrompt(event.target.value)} rows={5} />
              </Field>
              <Field label={copy.userPrompt} icon={<MessageSquareWarning size={17} />}>
                <textarea value={llmUserPrompt} onChange={(event) => setLlmUserPrompt(event.target.value)} rows={5} />
              </Field>
            </div>
          </section>

          <section className="actions-panel">
            <div className="actions-head">
              <div>
                <span className="eyebrow"><Ban size={14} /> {copy.responseKicker}</span>
                <h2>{copy.responseTitle}</h2>
              </div>
              <Toggle label={copy.apply} checked={apply} onChange={setApply} emphasis />
            </div>
            <div className="action-grid">
              <ActionToggle icon={<Trash2 size={17} />} label={copy.actions.deleteComments} checked={actions.deleteComments} onChange={(value) => setAction('deleteComments', value)} />
              <ActionToggle icon={<FileWarning size={17} />} label={copy.actions.closeIssues} checked={actions.closeIssues} onChange={(value) => setAction('closeIssues', value)} />
              <ActionToggle icon={<LockKeyhole size={17} />} label={copy.actions.lockIssues} checked={actions.lockIssues} onChange={(value) => setAction('lockIssues', value)} />
              <ActionToggle icon={<Trash2 size={17} />} label={copy.actions.deleteIssues} checked={actions.deleteIssues} onChange={(value) => setAction('deleteIssues', value)} danger />
              <ActionToggle icon={<UserX size={17} />} label={copy.actions.blockUsers} checked={actions.blockUsers} onChange={(value) => setAction('blockUsers', value)} danger />
              <ActionToggle icon={<AlertTriangle size={17} />} label={copy.actions.setInteractionLimits} checked={actions.setInteractionLimits} onChange={(value) => setAction('setInteractionLimits', value)} />
            </div>
          </section>
        </form>

        <aside className="inspector">
          <section className="principles-card">
            <span className="eyebrow"><ShieldCheck size={14} /> {copy.principlesKicker}</span>
            <ul>
              {copy.principles.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className="summary-band">
            <Metric label={copy.metrics.repos} value={config.repositories.length} />
            <Metric label={copy.metrics.keywords} value={config.rules.keywords.length} />
            <Metric label={copy.metrics.users} value={config.rules.denyUsers.length} />
            <Metric label={copy.metrics.actions} value={enabledActions} />
          </section>

          <section className="result-panel">
            <div className="result-head">
              <span className="eyebrow"><Radar size={14} /> {copy.outputKicker}</span>
              <strong>{report ? `${report.detections.length} ${copy.detections}` : copy.ready}</strong>
            </div>

            {error ? <div className="error-box">{error}</div> : null}

            {!report && !error ? (
              <div className="empty-state">
                <ShieldCheck size={38} />
                <p>{copy.empty}</p>
              </div>
            ) : null}

            {report ? (
              <div className="report-stack">
                <div className="report-metrics">
                  <Metric label={copy.metrics.events} value={report.eventsScanned} />
                  <Metric label={copy.metrics.planned} value={report.actions.length} />
                  <Metric label={copy.metrics.errors} value={report.errors.length} />
                </div>
                {report.detections.slice(0, 8).map((detection) => (
                  <article className="detection" key={`${detection.event.repoFullName}-${detection.event.sourceType}-${detection.event.sourceId}`}>
                    <div>
                      <strong>{detection.event.repoFullName}</strong>
                      <span>{detection.event.sourceType} #{detection.event.number || detection.event.sourceId}</span>
                    </div>
                    <p>{detection.reason}</p>
                    {detection.llmResult ? (
                      <p className="llm-note">
                        AI {detection.llmResult.label} · {Math.round(detection.llmResult.confidence * 100)}%
                        {detection.llmResult.reviewRequired ? ` · ${copy.reviewRequired}` : ''}
                      </p>
                    ) : null}
                    <small>{copy.risk} {detection.riskScore} · {detection.suggestedActions.length} {copy.plannedActions}</small>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        </aside>
      </section>

      {showDocs ? (
        <DocsModal
          locale={locale}
          onClose={() => setShowDocs(false)}
        />
      ) : null}
    </main>
  )
}

const MANUAL_EN = {
  title: 'Niubi Guard — Operation Manual',
  sections: [
    {
      heading: '1. Installation',
      body: `Requirements: Node.js >= 20, pnpm.

git clone https://github.com/niubistar/niubi-guard.git
cd niubi-guard
pnpm install

Then start the Web UI:
  pnpm dev:web

Or use the CLI:
  export GITHUB_TOKEN=github_pat_xxx
  pnpm scan -- --config guard.config.json`,
    },
    {
      heading: '2. Configuration (guard.config.json)',
      body: `Create guard.config.json in the project root:

{
  "repositories": ["owner/repo"],
  "rules": {
    "keywords": ["spam template", "copy-paste", "mass mention"],
    "denyUsers": [],
    "allowPhrases": ["good-faith report", "security disclosure"],
    "allowUsers": ["trusted-maintainer"]
  },
  "scan": {
    "includeIssues": true,
    "includeComments": true,
    "state": "open",
    "maxPages": 5
  },
  "actions": {
    "deleteComments": false,
    "closeIssues": false,
    "lockIssues": false,
    "deleteIssues": false,
    "blockUsers": false,
    "setInteractionLimits": false
  },
  "llm": {
    "enabled": false,
    "baseUrl": "https://api.openai.com/v1",
    "apiKey": "",
    "model": "gpt-4o-mini",
    "confidenceThreshold": 0.8,
    "reviewMode": "review_only"
  }
}

All destructive actions default to false for safety.`,
    },
    {
      heading: '3. Running a Scan',
      body: `Web UI:
  1. Enter your GitHub token (requires repo and moderation scopes).
  2. Enter repository names (comma or newline separated, e.g. "owner/repo").
  3. Configure detection signals, allow lists, scan range.
  4. (Optional) Enable AI detection and configure your model.
  5. Click "Dry Run" to see results without executing actions.
  6. Review detection results in the right panel.

CLI:
  export GITHUB_TOKEN=github_pat_xxx
  pnpm scan -- --config guard.config.json
  pnpm scan -- --config guard.config.json --apply   # execute enabled actions`,
    },
    {
      heading: '4. Understanding Scan Results',
      body: `Each detection includes:
  - Labels: keyword_match / deny_user_match / llm_malicious
  - Matched keywords or usernames
  - AI confidence score (if LLM enabled)
  - Risk score (0-100)
  - Suggested actions (what would happen in apply mode)

The scan report shows:
  - Total repositories and events scanned
  - Number of detections and planned actions
  - Error messages (if any API calls failed)`,
    },
    {
      heading: '5. AI Detection Setup',
      body: `Niubi Guard supports any OpenAI-compatible API.

Steps:
  1. Set "Enable AI detection" to ON.
  2. Enter your API base URL (default: https://api.openai.com/v1).
  3. Enter your API key.
  4. Choose a model (e.g. gpt-4o-mini, gpt-4o).
  5. Set confidence threshold (default 0.8).
  6. Choose review mode:
     - Review only: AI detections are flagged but never auto-act.
     - Auto-plan: High-confidence detections generate action plans.

The model must return JSON matching the expected schema.`,
    },
    {
      heading: '6. Enabling Actions (Apply Mode)',
      body: `By default, ALL actions are disabled. To enable:

  1. In the "Response Actions" section, toggle ON the actions you want
     (e.g. Close issues, Delete comments).
  2. Toggle "Apply enabled actions" at the top of the actions panel
     (button turns orange).
  3. The main button changes from "Dry Run" to "Apply Scan".
  4. Click "Apply Scan" — only enabled actions will execute.

Available actions:
  - Delete comments     — removes individual comment
  - Close issues        — closes the issue
  - Lock issues         — locks the issue (spam reason)
  - Delete issues       — permanently deletes the issue
  - Block users         — blocks the user from the repo
  - Set interaction limits — restricts who can interact

WARNING: Start with dry-run. Enable one action at a time.`,
    },
    {
      heading: '7. Safety Principles',
      body: `• Dry-run is ALWAYS the default — nothing executes without --apply.
• All destructive actions start disabled — you must opt in.
• API keys are sent directly from your browser to the LLM provider —
  they are never stored on our server.
• LLM detections default to "review only" — AI never acts alone.
• Allow lists prevent false positives.
• You stay in full control at all times.`,
    },
    {
      heading: '8. Best Practices',
      body: `1. Start with a single repository and dry-run mode.
2. Use broad allow phrases first, then narrow down.
3. Review scan output carefully before enabling any action.
4. Enable actions one at a time, starting with the least destructive
   (close issue) before destructive ones (delete issue, block user).
5. When using AI detection, test with review_only mode first.
6. Tune your detection signals based on real attack patterns
   you observe.
7. Run scans after major project events (releases, media coverage)
   when attack risk is higher.`,
    },
    {
      heading: '9. FAQ',
      body: `Q: Can Niubi Guard run continuously in the background?
A: Not yet. v0.1 requires manual scan triggers. Background/auto mode
   is planned for v1.0 with GitHub App integration.

Q: Does it work with GitHub.com only?
A: Yes, currently GitHub.com only via REST API + GraphQL.

Q: Are my API keys safe?
A: Yes. The Web UI sends your token and LLM key directly from your
   browser to GitHub/LLM APIs — they never touch our server.

Q: What if there's a false positive?
A: Add the phrase to "Allow Phrases" or the user to "Allow Users"
   and re-run the scan.

Q: Can I use a local LLM?
A: Yes, if it exposes an OpenAI-compatible /chat/completions endpoint.
   Just set the base URL to your local server address.`,
    },
  ],
}

const MANUAL_ZH = {
  title: 'Niubi Guard — 操作手册',
  sections: [
    {
      heading: '一、安装',
      body: `环境要求：Node.js >= 20，pnpm

git clone https://github.com/niubistar/niubi-guard.git
cd niubi-guard
pnpm install

启动 Web UI：
  pnpm dev:web

使用 CLI：
  export GITHUB_TOKEN=github_pat_xxx
  pnpm scan -- --config guard.config.json`,
    },
    {
      heading: '二、配置文件 (guard.config.json)',
      body: `在项目根目录创建 guard.config.json：

{
  "repositories": ["owner/repo"],
  "rules": {
    "keywords": ["spam template", "copy-paste", "mass mention"],
    "denyUsers": [],
    "allowPhrases": ["good-faith report", "security disclosure"],
    "allowUsers": ["trusted-maintainer"]
  },
  "scan": {
    "includeIssues": true,
    "includeComments": true,
    "state": "open",
    "maxPages": 5
  },
  "actions": {
    "deleteComments": false,
    "closeIssues": false,
    "lockIssues": false,
    "deleteIssues": false,
    "blockUsers": false,
    "setInteractionLimits": false
  },
  "llm": {
    "enabled": false,
    "baseUrl": "https://api.openai.com/v1",
    "apiKey": "",
    "model": "gpt-4o-mini",
    "confidenceThreshold": 0.8,
    "reviewMode": "review_only"
  }
}

所有破坏性操作默认关闭，确保安全。`,
    },
    {
      heading: '三、执行扫描',
      body: `Web UI：
  1. 输入 GitHub Token（需要 repo 和 moderation 权限）。
  2. 输入仓库名（逗号或换行分隔，如 "owner/repo"）。
  3. 配置检测信号、放行规则、扫描范围。
  4. （可选）启用 AI 检测并配置模型。
  5. 点击 "Dry Run" 查看结果，不会执行任何操作。
  6. 在右侧面板审查检测结果。

CLI：
  export GITHUB_TOKEN=github_pat_xxx
  pnpm scan -- --config guard.config.json
  pnpm scan -- --config guard.config.json --apply   # 执行已启用的动作`,
    },
    {
      heading: '四、理解扫描结果',
      body: `每条检测包含：
  - 标签：keyword_match / deny_user_match / llm_malicious
  - 命中的关键词或用户名
  - AI 置信度（如果启用了 LLM）
  - 风险评分（0-100）
  - 建议操作（apply 模式下会执行什么）

扫描报告展示：
  - 扫描的仓库和事件总数
  - 检测数和计划动作数
  - 错误信息（如果 API 调用失败）`,
    },
    {
      heading: '五、AI 检测配置',
      body: `Niubi Guard 支持任何兼容 OpenAI 的 API。

步骤：
  1. 将 "启用 AI 侦测" 打开。
  2. 输入 API Base URL（默认为 https://api.openai.com/v1）。
  3. 输入 API Key。
  4. 选择模型（如 gpt-4o-mini、gpt-4o）。
  5. 设置置信度阈值（默认 0.8）。
  6. 选择复核模式：
     - 仅二次审核：AI 检测仅标记，不会自动操作。
     - 达阈值生成动作：高置信度检测会生成行动计划。

模型必须返回符合预期 schema 的 JSON。`,
    },
    {
      heading: '六、启用动作（Apply 模式）',
      body: `默认情况下，所有动作都是关闭的。要启用：

  1. 在"响应动作"区域，打开你想要执行的动作开关
     （如关闭 Issue、删除评论）。
  2. 打开动作区域顶部的"执行已启用动作"开关
     （按钮变为橙色）。
  3. 主按钮从 "Dry Run" 变为 "Apply Scan"。
  4. 点击 "Apply Scan" — 只有已启用的动作会被执行。

可用动作：
  - 删除评论      — 移除单条评论
  - 关闭 Issue    — 关闭 Issue
  - 锁定 Issue    — 锁定 Issue（原因为垃圾信息）
  - 删除 Issue    — 永久删除 Issue
  - 拉黑用户      — 从仓库封禁用户
  - 限制互动      — 限制谁可以与仓库互动

警告：先从 dry-run 开始，每次只启用一个动作。`,
    },
    {
      heading: '七、安全原则',
      body: `• Dry-run 始终是默认模式——不加 --apply 不会执行任何操作。
• 所有破坏性动作默认关闭——你必须手动启用。
• API Key 直接从浏览器发送到 LLM 提供商——不会存储在我们的服务器上。
• LLM 检测默认设置为"仅二次审核"——AI 不会单独行动。
• 放行规则可以防止误报。
• 你始终拥有完全控制权。`,
    },
    {
      heading: '八、最佳实践',
      body: `1. 从一个仓库开始，先使用 dry-run 模式。
2. 先使用宽松的放行规则，再逐步收紧。
3. 在启用任何动作前，仔细审查扫描输出。
4. 每次只启用一个动作，从破坏性最小的（关闭 Issue）
   开始，再到破坏性较大的（删除 Issue、拉黑用户）。
5. 使用 AI 检测时，先用 review_only 模式测试。
6. 根据观察到的真实攻击模式调整检测信号。
7. 在重大项目事件后（发布、媒体报道）攻击风险较高时，
   及时运行扫描。`,
    },
    {
      heading: '九、常见问题',
      body: `问：Niubi Guard 能否在后台持续运行？
答：目前不行。v0.1 需要手动触发扫描。后台/自动模式计划在
   v1.0 通过 GitHub App 集成实现。

问：只支持 GitHub.com 吗？
答：是的，目前通过 REST API + GraphQL 仅支持 GitHub.com。

问：我的 API Key 安全吗？
答：安全。Web UI 的 Token 和 LLM Key 直接从浏览器发送到
   GitHub/LLM 接口，不会经过我们的服务器。

问：如果出现误报怎么办？
答：将相关短语添加到"放行短语"或相关用户添加到"放行用户"，
   然后重新扫描。

问：可以使用本地 LLM 吗？
答：可以，只要它暴露了 OpenAI 兼容的 /chat/completions 接口，
   将 base URL 设置为你的本地服务器地址即可。`,
    },
  ],
}

function DocsModal({ locale, onClose }: { locale: UILocale; onClose: () => void }) {
  const manual = locale === 'en' ? MANUAL_EN : MANUAL_ZH

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{manual.title}</h2>
          <button className="modal-close" type="button" onClick={onClose}>
            <Ban size={18} />
          </button>
        </div>
        <div className="modal-body">
          {manual.sections.map((section) => (
            <article key={section.heading}>
              <h3>{section.heading}</h3>
              <pre>{section.body}</pre>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="field">
      <span>{icon}{label}</span>
      {children}
    </label>
  )
}

function Toggle({ label, checked, onChange, emphasis = false }: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  emphasis?: boolean
}) {
  return (
    <button
      className={`toggle ${checked ? 'is-on' : ''} ${emphasis ? 'is-emphasis' : ''}`}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-track"><span /></span>
      {label}
    </button>
  )
}

function ActionToggle({ icon, label, checked, onChange, danger = false }: {
  icon: React.ReactNode
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  danger?: boolean
}) {
  return (
    <button
      className={`action-toggle ${checked ? 'is-on' : ''} ${danger ? 'is-danger' : ''}`}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function splitList(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}
