# Fourth-Wave GitHub Issue Abuse Report / GitHub Issue 第四波滥用攻击报告

Last updated: 2026-06-19 Asia/Shanghai

最新更新：2026-06-19，Asia/Shanghai

This bilingual report summarizes GitHub issue-abuse campaigns observed by Niubi Guard's hosted protection data and public GitHub Issue records. Public samples keep affected repositories redacted; account rows include GitHub abuse-report links so maintainers can report active abuse quickly. This is not an official GitHub determination.

本双语报告汇总 Niubi Guard 官网防护数据与公开 GitHub Issue 记录中观察到的 GitHub Issue 滥用攻击。公开样例继续对受影响仓库打码；攻击账号行提供 GitHub 举报链接，方便维护者快速举报仍在活跃的滥用行为。本记录不代表 GitHub 官方判定。

## Executive Summary / 摘要

Niubi Guard has now recorded four coordinated abuse waves targeting open-source maintainers through GitHub Issues and comments. The campaigns repeatedly use fake-star accusations, blank-account or zombie-stargazer narratives, and threat-style wording about GitHub reports, repository shutdown, traffic removal, or Stargazer cleanup.

Niubi Guard 目前已记录四轮通过 GitHub Issues 和评论攻击开源维护者的协同滥用事件。这些攻击反复使用刷星指控、空壳号/僵尸 Stargazer 叙事，以及 GitHub 举报、仓库关闭、流量清空、Stargazer 清理等威胁型话术。

The fourth wave is confirmed as `github-issue-abuse-wave-2026-06-18-round-4`: 7 blank accounts posted 2,374 public issues across 629 unique repositories over about 6.6 hours. The last observed public issue was around 2026-06-19 05:12 Beijing time.

第四波已确认为 `github-issue-abuse-wave-2026-06-18-round-4`：7 个空壳账号约 6.6 小时内在 629 个唯一仓库公开投递 2,374 条 Issue，最后一次公开新增约为北京时间 2026-06-19 05:12。

And, since the attackers have been so generous: thank you for donating clean, repeated, nicely clustered training material to our defense model. It was not the community service you meant to provide, but Niubi Guard accepts the free corpus anyway.

顺便也真诚感谢这些攻击者：你们免费提供了干净、重复、聚类明显的防护模型训练语料。虽然这大概不是你们本意上的社区贡献，但 Niubi Guard 还是礼貌收下这份免费投喂。

## Known Waves / 已知波次

| Wave / 波次 | Campaign | Window UTC / UTC 时间窗口 | Accounts / 账号 | Issues or detections / Issue 或检测数 | Affected repositories / 受影响仓库 | Risk / 风险 |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1 / 第一波 | `github-abuse-wave-2026-05-08` | 2026-05-07 20:35:50 to 20:47:37 | 5 | 1,584 | 161 | High |
| 2 / 第二波 | `github-issue-abuse-wave-2026-05-31` | 2026-05-26 09:46:51 to 2026-05-31 15:47:32 | 6 | 1,127 | 525 | Critical |
| 3 / 第三波 | `github-issue-attack-2026-05-31` / archive `2026-06-02` | 2026-05-31 15:38:22 to 16:21:30 | 21 / archived 10 | 38,022 detections / archived 2,595 | 9 / archived 892 | High |
| 4 / 第四波 | `github-issue-abuse-wave-2026-06-18-round-4` | 2026-06-18 14:36:08 to 21:12:37 | 7 | 2,374 | 629 | Critical |

The third-wave row includes both a high-volume Guard detection record and the later archive reconstruction. Detection counts are not the same as unique public issues.

第三波同时展示高频 Guard 检测记录和后续归档补录口径。检测数不等同于唯一公开 Issue 数。

## Fourth-Wave Accounts / 第四波账号

Report links follow the hosted Guard UI pattern: `https://github.com/contact/report-abuse?report=<login>`.

举报链接沿用官网 Guard UI 的做法：`https://github.com/contact/report-abuse?report=<login>`。

| Login | GitHub ID | Registered at UTC | Public repos | Followers | Following | Public issues | Unique repositories | Report / 举报 |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `ananjamez108` | 275163558 | 2026-04-10 19:11:28 | 0 | 0 | 0 | 363 | 335 | [Report](https://github.com/contact/report-abuse?report=ananjamez108) |
| `raxh64` | 274818679 | 2026-04-09 13:07:42 | 0 | 0 | 0 | 357 | 333 | [Report](https://github.com/contact/report-abuse?report=raxh64) |
| `afsant1993` | 274902061 | 2026-04-09 19:21:48 | 0 | 0 | 0 | 339 | 312 | [Report](https://github.com/contact/report-abuse?report=afsant1993) |
| `clipe22aving-iti` | 274815712 | 2026-04-09 12:54:58 | 0 | 0 | 0 | 336 | 319 | [Report](https://github.com/contact/report-abuse?report=clipe22aving-iti) |
| `binybow623` | 274878314 | 2026-04-09 17:18:58 | 0 | 0 | 0 | 333 | 309 | [Report](https://github.com/contact/report-abuse?report=binybow623) |
| `denitzade` | 274876910 | 2026-04-09 17:12:21 | 0 | 0 | 0 | 326 | 313 | [Report](https://github.com/contact/report-abuse?report=denitzade) |
| `custpopax` | 274899184 | 2026-04-09 19:06:14 | 0 | 0 | 0 | 320 | 299 | [Report](https://github.com/contact/report-abuse?report=custpopax) |

## Fourth-Wave Pattern / 第四波模式

- April 2026 blank-account cluster.
- High-frequency cross-repository posting over about 6.6 hours.
- Repeated fake-star, blank-account, Stargazer-list and traffic-removal wording.
- Continued after the original detection window; no public issues observed after about 2026-06-18 21:15 UTC.

- 2026 年 4 月注册的空壳账号集群。
- 约 6.6 小时内高频跨仓库投递。
- 重复命中刷星、空壳号、Stargazer、违规人气清空等话术。
- 原记录窗口结束后仍继续扩散，约 2026-06-18 21:15 UTC 后暂未发现新增公开 Issue。

## Redacted Samples / 脱敏样例

Affected repositories remain redacted in the public report. Authorized maintainers can audit the complete mapping in the hosted Guard trail.

公开报告继续对受影响仓库打码。授权维护者可在官网 Guard 审计记录中查看完整映射。

| Account | Repository | Title / target | Guard reason |
| --- | --- | --- | --- |
| `clipe22aving-iti` | `repo-redacted-01` | `从兴奋到震惊只用了十秒钟（过来人的忠告）` | `deny_list_match` |
| `clipe22aving-iti` | `repo-redacted-02` | `对项目刷星行为深感失望` | `keyword_match:刷星,清理,虚假,假数` |
| `binybow623` | `repo-redacted-03` | `提请注意：本仓库近期涌入的Star存在严重造假嫌疑` | `threat_intel:github-issue-abuse-wave-2026-06-18-round-4` |
| `binybow623` | `repo-redacted-04` | `[警示] 讲一个朋友刷星后翻车的真实故事（附数据）` | `threat_intel:github-issue-abuse-wave-2026-06-18-round-4` |
| `afsant1993` | `repo-redacted-03` | `如果维护者和真相对话` | `threat_intel:github-issue-abuse-wave-2026-06-18-round-4` |
| `custpopax` | `repo-redacted-05` | `给其他人提个醒` | `deny_list_match` |
| `ananjamez108` | `repo-redacted-05` | `[忠告] 从发现到确认的全过程` | `deny_list_match` |

## Attack Corpus / 攻击语料库

The reusable corpus is maintained in [attack-corpus.md](attack-corpus.md). It groups the four waves into wording families, behavioral signals, review notes, and suggested labels. Users are welcome to contribute new samples, especially repeated templates, timestamps, account metadata, and safely redacted repository evidence.

可复用语料库维护在 [attack-corpus.md](attack-corpus.md)。它把四轮攻击整理为话术家族、行为信号、审核说明和建议标签。欢迎用户继续补充新样本，尤其是重复模板、时间戳、账号公开资料，以及安全打码后的仓库证据。

Contribution rule: redact victim repositories unless explicit permission is available; include account report links only when the abuse pattern is high-confidence and publicly observable.

贡献规则：除非已获明确许可，请对受害仓库打码；只有在滥用模式高置信且公开可观察时，才附上账号举报链接。

## Maintainer Guidance / 维护者建议

1. Keep destructive actions disabled until the repository owner is comfortable with the false-positive risk.
2. Enable keyword detection, deny-list checks, cold-start account signals, and LLM review mode first.
3. Use GitHub report links for active abuse accounts.
4. Record new samples in the corpus with bilingual notes when possible.
5. Treat the corpus as defensive training material, not as a place for personal harassment.

1. 在维护者能接受误伤风险前，保持删除、锁定、拉黑等强动作关闭。
2. 优先启用关键词、deny-list、冷启动账号信号和 LLM review mode。
3. 对仍活跃的滥用账号使用 GitHub 举报链接。
4. 新样本尽量以双语说明加入语料库。
5. 语料库用于防护训练，不用于人身骚扰。
