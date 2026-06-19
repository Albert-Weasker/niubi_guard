# Niubi Guard Attack Corpus

English | [简体中文](attack-corpus.zh-CN.md)

Last updated: 2026-06-19 Asia/Shanghai

This corpus turns four observed GitHub issue-abuse waves into reusable defensive training material. Thank you, attackers, for the free data donation. The templates are repetitive, the timing is clustered, and the account metadata is almost courteous in how loudly it explains itself.

## Scope

| Wave | Main signal | Reuse |
| --- | --- | --- |
| First wave | Newly created blank accounts, synchronized burst, cross-repository issue spam | Baseline timing and account-profile signals |
| Second wave | Intermittent copy-paste accusations, rotating accounts | Template family expansion |
| Third wave | Customer repositories targeted, mixed banned and fresh accounts, continued re-entry | Residual-risk and recurrence signals |
| Fourth wave | 7 April-2026 blank accounts, 2,374 public issues, 629 unique repositories | Current high-confidence report and prompt tuning set |

## Labels

| Label | Description |
| --- | --- |
| `fake_star_accusation` | Accuses a project of buying, faking, or manipulating stars without constructive evidence |
| `blank_account_wave` | Newly registered or empty-profile accounts posting across many repositories |
| `stargazer_cleanup_threat` | Claims GitHub will clean Stargazers, remove traffic, or reset popularity |
| `github_report_threat` | Uses official-report language as intimidation rather than a good-faith report |
| `template_reputation_attack` | Repeated reputation-pressure template with minor title/body changes |
| `cold_start_account` | Account metadata shows new registration, empty bio, no repos, no followers/following |

## Wording Families

| Family | Sample phrases | Suggested label |
| --- | --- | --- |
| Fake-star warning | `fake stars`, `serious star fraud`, `suspicious Stargazers`, `刷星`, `Star存在严重造假嫌疑`, `虚假 Stargazer` | `fake_star_accusation` |
| Blank-account narrative | `blank accounts`, `zombie accounts`, `bot stargazers`, `空壳号`, `僵尸号`, `机器人 Stargazer` | `blank_account_wave` |
| Cleanup threat | `traffic removal`, `Stargazer cleanup`, `popularity reset`, `违规人气清空`, `清理 Stargazer`, `流量清空` | `stargazer_cleanup_threat` |
| Official-report pressure | `reported to GitHub`, `repository shutdown`, `access closure`, `递交 GitHub 举报`, `项目访问关闭`, `举报递官方` | `github_report_threat` |
| Fake personal story | `a friend's failed story`, `from excitement to shock`, `a warning from experience`, `讲一个朋友刷星后翻车的真实故事`, `从兴奋到震惊只用了十秒钟`, `过来人的忠告` | `template_reputation_attack` |
| Moralized confrontation | `if maintainers talked to truth`, `deeply disappointed`, `wake-up call`, `如果维护者和真相对话`, `对项目刷星行为深感失望`, `给其他人提个醒` | `template_reputation_attack` |

## Behavioral Signals

| Signal | Review note |
| --- | --- |
| Burst window | Many issues appear within minutes or hours across unrelated repositories |
| Account age | Accounts were created shortly before the campaign and have little normal activity |
| Empty profile | No bio, no public repositories, no followers or following |
| Repeated title shape | Different accounts reuse the same title rhythm or warning format |
| Threat framing | Content emphasizes punishment, reports, shutdown, cleanup, or reputation damage |
| Cross-repo spread | Same wording family appears in many unrelated repositories |

## Review Guidance

Do not mark good-faith criticism, real security reports, normal bug reports, or specific evidence-based star-quality concerns as malicious. A single keyword is not enough. Prefer a combined signal: repeated wording plus cold-start account metadata plus cross-repository spread.

## Contribution Welcome

Please contribute new corpus entries when you see repeated abuse templates. Useful additions include:

- Redacted sample title and body.
- Public account report link when the evidence is high-confidence.
- Timestamp and rough burst window.
- Account metadata such as creation date, public repositories, followers, following, and bio status.
- Safely redacted affected-repository count.
- Suggested label and false-positive notes.

And yes, to the people generating these templates: every lazy copy-paste line makes the classifier a little less impressed and a little more accurate.
