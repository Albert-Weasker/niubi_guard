# Fourth-Wave GitHub Issue Abuse Report

Last updated: 2026-06-19 Asia/Shanghai

This report summarizes GitHub issue-abuse campaigns observed by Niubi Guard's hosted protection data and public GitHub Issue records. The public report uses aggregated statistics and redacted samples; complete evidence is retained in the hosted Guard audit trail for authorized maintainers. It is not an official GitHub determination.

## Executive Summary

Niubi Guard has now recorded four coordinated abuse waves targeting open-source maintainers through GitHub Issues and comments. The campaigns repeatedly use fake-star accusations, "blank account" or "zombie stargazer" narratives, and threat-style wording about GitHub reports, repository shutdown, traffic removal, or Stargazer cleanup.

The fourth wave started on 2026-06-18 UTC and was confirmed by Guard as `github-issue-abuse-wave-2026-06-18-round-4`. It involved 7 high-confidence suspicious accounts, 658 abnormal issues, and 322 affected repositories in about 2.5 hours.

## Known Waves

| Wave | Window (UTC) | Accounts | Abnormal issues | Affected repositories | Risk |
| --- | --- | ---: | ---: | ---: | --- |
| `github-abuse-wave-2026-05-08` | 2026-05-07 20:35:50 to 20:47:37 | 5 | 1,584 | 161 | High |
| `github-issue-abuse-wave-2026-05-31` | 2026-05-26 09:46:51 to 2026-05-31 15:47:32 | 6 | 1,127 | 525 | Critical |
| `github-issue-attack-2026-05-31` | 2026-05-31 15:38:22 to 16:21:30 | 21 | 38,022 detections | 9 | High |
| `github-issue-abuse-wave-2026-06-18-round-4` | 2026-06-18 14:36:08 to 17:03:10 | 7 | 658 | 322 | Critical |

The 2026-05-31 data contains two campaign records: one conservative cross-repository campaign and one high-volume Guard detection campaign. The latter includes repeated detections in protected repositories, so its count should be read as Guard detections rather than unique public issues.

## Fourth Wave Details

Guard campaign: `github-issue-abuse-wave-2026-06-18-round-4`

Confirmed pattern:

- Fourth coordinated GitHub issue-abuse wave.
- April 2026 blank-account cluster.
- High-frequency cross-repository posting within about 2.5 hours.
- Repeated fake-star, blank-account, Stargazer-list and traffic-removal wording.
- Threat-style GitHub report and repository-shutdown narrative.

High-confidence account cluster:

| Account | Role | Registered at (UTC) | Public repos | Followers | Following | Issues | Repositories |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| `acct-4w-seed-01` | seed | 2026-04-10 19:11:28 | 0 | 0 | 0 | 151 | 94 |
| `acct-4w-seed-02` | seed | 2026-04-09 13:07:42 | 0 | 0 | 0 | 141 | 45 |
| `acct-4w-seed-03` | seed | 2026-04-09 17:12:21 | 0 | 0 | 0 | 120 | 98 |
| `acct-4w-associated-01` | associated | 2026-04-09 12:54:58 | 0 | 0 | 0 | 70 | 51 |
| `acct-4w-associated-02` | associated | 2026-04-09 17:18:58 | 0 | 0 | 0 | 65 | 50 |
| `acct-4w-associated-03` | associated | 2026-04-09 19:21:48 | 0 | 0 | 0 | 64 | 46 |
| `acct-4w-associated-04` | associated | 2026-04-09 19:06:14 | 0 | 0 | 0 | 47 | 34 |

Sample captured issues and comments, redacted for public reporting:

| Account | Repository | Title / target | Reason |
| --- | --- | --- | --- |
| `acct-4w-associated-01` | `repo-redacted-01` | `从兴奋到震惊只用了十秒钟（过来人的忠告）` | `deny_list_match` |
| `acct-4w-associated-01` | `repo-redacted-02` | `对项目刷星行为深感失望` | `keyword_match:刷星,清理,虚假,假数` |
| `acct-4w-associated-02` | `repo-redacted-03` | `提请注意：本仓库近期涌入的Star存在严重造假嫌疑` | `threat_intel:github-issue-abuse-wave-2026-06-18-round-4` |
| `acct-4w-associated-02` | `repo-redacted-04` | `[警示] 讲一个朋友刷星后翻车的真实故事（附数据）` | `threat_intel:github-issue-abuse-wave-2026-06-18-round-4` |
| `acct-4w-associated-03` | `repo-redacted-03` | `如果维护者和真相对话` | `threat_intel:github-issue-abuse-wave-2026-06-18-round-4` |
| `acct-4w-associated-04` | `repo-redacted-05` | `给其他人提个醒` | `deny_list_match` |
| `acct-4w-seed-01` | `repo-redacted-05` | `[忠告] 从发现到确认的全过程` | `deny_list_match` |

Sample affected repositories are redacted in the public report. Authorized maintainers can audit the complete mapping in the hosted Guard trail.

## Protection Updates In This Repository

- Added redacted deny-list placeholders to `guard.config.example.json` to demonstrate the protection format without exposing public report mappings.
- Added repeated fourth-wave phrases to `guard.config.example.json` as keyword examples.
- Added exported threat intelligence constants in `src/threat-intel.ts`.
- Updated the default LLM moderation prompt in `src/prompts.ts` to recognize fake-star accusation campaigns, blank-account waves, Stargazer cleanup narratives, traffic-removal threats, repository-shutdown threats, and GitHub-report threats.
- Kept the core scanner and detector logic unchanged.

## Operator Guidance

Recommended response for maintainers:

1. Keep automatic destructive actions disabled until the repository owner is comfortable with the false-positive risk.
2. Enable keyword detection, deny-list checks, and cold-start account signals first.
3. Use review mode for LLM moderation before enabling issue deletion, issue locking, or user blocking.
4. Record sample URLs and action logs in issues so future maintainers can audit why a pattern was added.
5. Avoid naming normal users from low-confidence searches. Only add accounts that match repeated behavior, public metadata signals, and cross-repository campaign evidence.
