# Fourth-Wave GitHub Issue Abuse Report

English | [简体中文](fourth-wave-attack-report.zh-CN.md)

Last updated: 2026-06-19 Asia/Shanghai

This report summarizes GitHub issue-abuse campaigns observed by Niubi Guard's hosted protection data and public GitHub Issue records. Public samples keep affected repositories redacted; account rows include GitHub abuse-report links so maintainers can report active abuse quickly. This is not an official GitHub determination.

## Executive Summary

Niubi Guard has now recorded four coordinated abuse waves targeting open-source maintainers through GitHub Issues and comments. The campaigns repeatedly use fake-star accusations, blank-account or zombie-stargazer narratives, and threat-style wording about GitHub reports, repository shutdown, traffic removal, or Stargazer cleanup.

The fourth wave is confirmed as `github-issue-abuse-wave-2026-06-18-round-4`: 7 blank accounts posted 2,374 public issues across 629 unique repositories over about 6.6 hours. The last observed public issue was around 2026-06-19 05:12 Beijing time.

And, since the attackers have been so generous: thank you for donating clean, repeated, nicely clustered training material to our defense model. It was not the community service you meant to provide, but Niubi Guard accepts the free corpus anyway.

## Known Waves

| Wave | Campaign | Window UTC | Accounts | Issues or detections | Affected repositories | Risk |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1 | `github-abuse-wave-2026-05-08` | 2026-05-07 20:35:50 to 20:47:37 | 5 | 1,584 | 161 | High |
| 2 | `github-issue-abuse-wave-2026-05-31` | 2026-05-26 09:46:51 to 2026-05-31 15:47:32 | 6 | 1,127 | 525 | Critical |
| 3 | `github-issue-attack-2026-05-31` with archive `2026-06-02` | 2026-05-31 15:38:22 to 16:21:30 | 21, archived 10 | 38,022 detections, archived 2,595 | 9, archived 892 | High |
| 4 | `github-issue-abuse-wave-2026-06-18-round-4` | 2026-06-18 14:36:08 to 21:12:37 | 7 | 2,374 | 629 | Critical |

The third-wave row includes both a high-volume Guard detection record and the later archive reconstruction. Detection counts are not the same as unique public issues.

## Fourth-Wave Accounts

Report links follow the hosted Guard UI pattern: `https://github.com/contact/report-abuse?report=<login>`.

| Login | GitHub ID | Registered at UTC | Public repos | Followers | Following | Public issues | Unique repositories | Report |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `ananjamez108` | 275163558 | 2026-04-10 19:11:28 | 0 | 0 | 0 | 363 | 335 | [Report](https://github.com/contact/report-abuse?report=ananjamez108) |
| `raxh64` | 274818679 | 2026-04-09 13:07:42 | 0 | 0 | 0 | 357 | 333 | [Report](https://github.com/contact/report-abuse?report=raxh64) |
| `afsant1993` | 274902061 | 2026-04-09 19:21:48 | 0 | 0 | 0 | 339 | 312 | [Report](https://github.com/contact/report-abuse?report=afsant1993) |
| `clipe22aving-iti` | 274815712 | 2026-04-09 12:54:58 | 0 | 0 | 0 | 336 | 319 | [Report](https://github.com/contact/report-abuse?report=clipe22aving-iti) |
| `binybow623` | 274878314 | 2026-04-09 17:18:58 | 0 | 0 | 0 | 333 | 309 | [Report](https://github.com/contact/report-abuse?report=binybow623) |
| `denitzade` | 274876910 | 2026-04-09 17:12:21 | 0 | 0 | 0 | 326 | 313 | [Report](https://github.com/contact/report-abuse?report=denitzade) |
| `custpopax` | 274899184 | 2026-04-09 19:06:14 | 0 | 0 | 0 | 320 | 299 | [Report](https://github.com/contact/report-abuse?report=custpopax) |

## Fourth-Wave Pattern

- April 2026 blank-account cluster.
- High-frequency cross-repository posting over about 6.6 hours.
- Repeated fake-star, blank-account, Stargazer-list and traffic-removal wording.
- Continued after the original detection window; no public issues observed after about 2026-06-18 21:15 UTC.

## Redacted Samples

Affected repositories remain redacted in the public report. Authorized maintainers can audit the complete mapping in the hosted Guard trail.

| Account | Repository | Title or target | Guard reason |
| --- | --- | --- | --- |
| `clipe22aving-iti` | `repo-redacted-01` | `从兴奋到震惊只用了十秒钟（过来人的忠告）` | `deny_list_match` |
| `clipe22aving-iti` | `repo-redacted-02` | `对项目刷星行为深感失望` | `keyword_match:刷星,清理,虚假,假数` |
| `binybow623` | `repo-redacted-03` | `提请注意：本仓库近期涌入的Star存在严重造假嫌疑` | `threat_intel:github-issue-abuse-wave-2026-06-18-round-4` |
| `binybow623` | `repo-redacted-04` | `[警示] 讲一个朋友刷星后翻车的真实故事（附数据）` | `threat_intel:github-issue-abuse-wave-2026-06-18-round-4` |
| `afsant1993` | `repo-redacted-03` | `如果维护者和真相对话` | `threat_intel:github-issue-abuse-wave-2026-06-18-round-4` |
| `custpopax` | `repo-redacted-05` | `给其他人提个醒` | `deny_list_match` |
| `ananjamez108` | `repo-redacted-05` | `[忠告] 从发现到确认的全过程` | `deny_list_match` |

## Attack Corpus

The reusable corpus is maintained in [attack-corpus.md](attack-corpus.md). It groups the four waves into wording families, behavioral signals, review notes, and suggested labels. Users are welcome to contribute new samples, especially repeated templates, timestamps, account metadata, and safely redacted repository evidence.

Contribution rule: redact victim repositories unless explicit permission is available; include account report links only when the abuse pattern is high-confidence and publicly observable.

## Maintainer Guidance

1. Keep destructive actions disabled until the repository owner is comfortable with the false-positive risk.
2. Enable keyword detection, deny-list checks, cold-start account signals, and LLM review mode first.
3. Use GitHub report links for active abuse accounts.
4. Record new samples in the corpus with bilingual notes when possible.
5. Treat the corpus as defensive training material, not as a place for personal harassment.
