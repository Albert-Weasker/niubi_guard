# Niubi Guard Attack Corpus / Niubi Guard 攻击语料库

Last updated: 2026-06-19 Asia/Shanghai

最新更新：2026-06-19，Asia/Shanghai

This corpus turns four observed GitHub issue-abuse waves into reusable defensive training material. Thank you, attackers, for the free data donation. The templates are repetitive, the timing is clustered, and the account metadata is almost courteous in how loudly it explains itself.

本语料库把四轮已观察到的 GitHub Issue 滥用攻击整理为可复用的防护训练材料。感谢攻击者免费投喂数据：模板够重复、时间够聚集、账号画像也足够“贴心”，几乎是在主动帮模型做标注。

## Scope / 范围

| Wave / 波次 | Main signal / 主要信号 | Reuse / 复用方式 |
| --- | --- | --- |
| First wave / 第一波 | Newly created blank accounts, synchronized burst, cross-repository issue spam | Baseline timing and account-profile signals |
| Second wave / 第二波 | Intermittent copy-paste accusations, rotating accounts | Template family expansion |
| Third wave / 第三波 | Customer repositories targeted, mixed banned and fresh accounts, continued re-entry | Residual-risk and recurrence signals |
| Fourth wave / 第四波 | 7 April-2026 blank accounts, 2,374 public issues, 629 unique repositories | Current high-confidence report and prompt tuning set |

## Labels / 标签

| Label | Description | 中文说明 |
| --- | --- | --- |
| `fake_star_accusation` | Accuses a project of buying, faking, or manipulating stars without constructive evidence | 无建设性证据地指控项目刷星、假星、操纵星标 |
| `blank_account_wave` | Newly registered or empty-profile accounts posting across many repositories | 新注册或资料空白账号跨仓库批量投递 |
| `stargazer_cleanup_threat` | Claims GitHub will clean Stargazers, remove traffic, or reset popularity | 声称 GitHub 将清理 Stargazer、清空流量或重置人气 |
| `github_report_threat` | Uses official-report language as intimidation rather than a good-faith report | 以“递交 GitHub 举报”等官方举报话术施压 |
| `template_reputation_attack` | Repeated reputation-pressure template with minor title/body changes | 小幅改写后重复投递的声誉施压模板 |
| `cold_start_account` | Account metadata shows new registration, empty bio, no repos, no followers/following | 账号画像呈现新注册、空 Bio、零仓库、零关注关系 |

## Wording Families / 话术家族

| Family | Sample phrases | 中文样例 | Suggested label |
| --- | --- | --- | --- |
| Fake-star warning | `fake stars`, `serious star fraud`, `suspicious Stargazers` | `刷星`, `Star存在严重造假嫌疑`, `虚假 Stargazer` | `fake_star_accusation` |
| Blank-account narrative | `blank accounts`, `zombie accounts`, `bot stargazers` | `空壳号`, `僵尸号`, `机器人 Stargazer` | `blank_account_wave` |
| Cleanup threat | `traffic removal`, `Stargazer cleanup`, `popularity reset` | `违规人气清空`, `清理 Stargazer`, `流量清空` | `stargazer_cleanup_threat` |
| Official-report pressure | `reported to GitHub`, `repository shutdown`, `access closure` | `递交 GitHub 举报`, `项目访问关闭`, `举报递官方` | `github_report_threat` |
| Fake personal story | `a friend's failed story`, `from excitement to shock`, `a warning from experience` | `讲一个朋友刷星后翻车的真实故事`, `从兴奋到震惊只用了十秒钟`, `过来人的忠告` | `template_reputation_attack` |
| Moralized confrontation | `if maintainers talked to truth`, `deeply disappointed`, `wake-up call` | `如果维护者和真相对话`, `对项目刷星行为深感失望`, `给其他人提个醒` | `template_reputation_attack` |

## Behavioral Signals / 行为信号

| Signal | English review note | 中文审核说明 |
| --- | --- | --- |
| Burst window | Many issues appear within minutes or hours across unrelated repositories | 短时间内跨多个无关仓库集中出现 |
| Account age | Accounts were created shortly before the campaign and have little normal activity | 账号刚注册不久，正常开发活动很少 |
| Empty profile | No bio, no public repositories, no followers or following | Bio 为空、无公开仓库、无 followers/following |
| Repeated title shape | Different accounts reuse the same title rhythm or warning format | 不同账号复用相同标题节奏或警示格式 |
| Threat framing | Content emphasizes punishment, reports, shutdown, cleanup, or reputation damage | 内容强调惩罚、举报、关闭、清理或声誉打击 |
| Cross-repo spread | Same wording family appears in many unrelated repositories | 同一话术家族出现在大量无关仓库 |

## Review Guidance / 审核建议

Do not mark good-faith criticism, real security reports, normal bug reports, or specific evidence-based star-quality concerns as malicious. A single keyword is not enough. Prefer a combined signal: repeated wording plus cold-start account metadata plus cross-repository spread.

不要把善意批评、真实安全报告、正常 bug report，或有具体证据的 Star 质量质疑直接判为恶意。单个关键词不够。更可靠的组合是：重复话术 + 冷启动账号画像 + 跨仓库扩散。

## Contribution Welcome / 欢迎补充

Please contribute new corpus entries when you see repeated abuse templates. Useful additions include:

- Redacted sample title and body.
- Public account report link when the evidence is high-confidence.
- Timestamp and rough burst window.
- Account metadata such as creation date, public repositories, followers, following, and bio status.
- Safely redacted affected-repository count.
- Suggested label and false-positive notes.

欢迎继续补充新的攻击语料。最有价值的信息包括：

- 打码后的标题和正文样例。
- 高置信证据下的公开账号举报链接。
- 时间戳和大致爆发窗口。
- 账号创建时间、公开仓库数、followers、following、Bio 状态等公开资料。
- 安全打码后的受影响仓库数量。
- 建议标签和误伤说明。

And yes, to the people generating these templates: every lazy copy-paste line makes the classifier a little less impressed and a little more accurate.

也顺便提醒继续复制粘贴这些模板的人：每一条偷懒话术都会让分类器少一点惊讶、多一点准确。
