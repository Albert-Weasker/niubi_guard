# Niubi Guard 攻击语料库

[English](attack-corpus.md) | 简体中文

最新更新：2026-06-19，Asia/Shanghai

本语料库把四轮已观察到的 GitHub Issue 滥用攻击整理为可复用的防护训练材料。感谢攻击者免费投喂数据：模板够重复、时间够聚集、账号画像也足够“贴心”，几乎是在主动帮模型做标注。

## 范围

| 波次 | 主要信号 | 复用方式 |
| --- | --- | --- |
| 第一波 | 新注册空白账号、同步爆发、跨仓库 Issue spam | 基线时间窗和账号画像信号 |
| 第二波 | 间歇性复制粘贴指控、账号轮换 | 扩展模板家族 |
| 第三波 | 客户仓库被命中、已封禁账号与新号混合、继续回流 | 残余风险和复燃信号 |
| 第四波 | 7 个 2026 年 4 月注册空壳账号、2,374 条公开 Issue、629 个唯一仓库 | 当前高置信报告和提示词调优集 |

## 标签

| 标签 | 中文说明 |
| --- | --- |
| `fake_star_accusation` | 无建设性证据地指控项目刷星、假星、操纵星标 |
| `blank_account_wave` | 新注册或资料空白账号跨仓库批量投递 |
| `stargazer_cleanup_threat` | 声称 GitHub 将清理 Stargazer、清空流量或重置人气 |
| `github_report_threat` | 以“递交 GitHub 举报”等官方举报话术施压 |
| `template_reputation_attack` | 小幅改写后重复投递的声誉施压模板 |
| `cold_start_account` | 账号画像呈现新注册、空 Bio、零仓库、零关注关系 |

## 话术家族

| 家族 | 样例 | 建议标签 |
| --- | --- | --- |
| 刷星警示 | `fake stars`, `serious star fraud`, `suspicious Stargazers`, `刷星`, `Star存在严重造假嫌疑`, `虚假 Stargazer` | `fake_star_accusation` |
| 空壳账号叙事 | `blank accounts`, `zombie accounts`, `bot stargazers`, `空壳号`, `僵尸号`, `机器人 Stargazer` | `blank_account_wave` |
| 清理威胁 | `traffic removal`, `Stargazer cleanup`, `popularity reset`, `违规人气清空`, `清理 Stargazer`, `流量清空` | `stargazer_cleanup_threat` |
| 官方举报施压 | `reported to GitHub`, `repository shutdown`, `access closure`, `递交 GitHub 举报`, `项目访问关闭`, `举报递官方` | `github_report_threat` |
| 伪个人故事 | `a friend's failed story`, `from excitement to shock`, `a warning from experience`, `讲一个朋友刷星后翻车的真实故事`, `从兴奋到震惊只用了十秒钟`, `过来人的忠告` | `template_reputation_attack` |
| 道德化对峙 | `if maintainers talked to truth`, `deeply disappointed`, `wake-up call`, `如果维护者和真相对话`, `对项目刷星行为深感失望`, `给其他人提个醒` | `template_reputation_attack` |

## 行为信号

| 信号 | 审核说明 |
| --- | --- |
| 爆发窗口 | 短时间内跨多个无关仓库集中出现 |
| 账号年龄 | 账号刚注册不久，正常开发活动很少 |
| 空白资料 | Bio 为空、无公开仓库、无 followers/following |
| 重复标题形态 | 不同账号复用相同标题节奏或警示格式 |
| 威胁框架 | 内容强调惩罚、举报、关闭、清理或声誉打击 |
| 跨仓库扩散 | 同一话术家族出现在大量无关仓库 |

## 审核建议

不要把善意批评、真实安全报告、正常 bug report，或有具体证据的 Star 质量质疑直接判为恶意。单个关键词不够。更可靠的组合是：重复话术 + 冷启动账号画像 + 跨仓库扩散。

## 欢迎补充

欢迎继续补充新的攻击语料。最有价值的信息包括：

- 打码后的标题和正文样例。
- 高置信证据下的公开账号举报链接。
- 时间戳和大致爆发窗口。
- 账号创建时间、公开仓库数、followers、following、Bio 状态等公开资料。
- 安全打码后的受影响仓库数量。
- 建议标签和误伤说明。

也顺便提醒继续复制粘贴这些模板的人：每一条偷懒话术都会让分类器少一点惊讶、多一点准确。
