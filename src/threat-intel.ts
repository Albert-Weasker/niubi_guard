export interface ThreatWaveAccount {
  login: string
  role: 'seed' | 'associated' | 'observed'
  registeredAt?: string
  publicRepos?: number
  followers?: number
  following?: number
  issueCount?: number
  repositoryCount?: number
}

export interface ThreatWave {
  slug: string
  title: string
  observedAt: string
  riskLevel: 'High' | 'Critical'
  abnormalIssues: number
  affectedRepositories: number
  burstStartedAt: string
  burstEndedAt: string
  accounts: ThreatWaveAccount[]
  phrases: string[]
}

export const THREAT_WAVES: ThreatWave[] = [
  {
    slug: 'github-abuse-wave-2026-05-08',
    title: 'GitHub coordinated issue abuse wave #2026-05-08',
    observedAt: '2026-05-08',
    riskLevel: 'High',
    abnormalIssues: 1584,
    affectedRepositories: 161,
    burstStartedAt: '2026-05-07T20:35:50Z',
    burstEndedAt: '2026-05-07T20:47:37Z',
    accounts: [
      { login: 'acct-1w-observed-01', role: 'observed', registeredAt: '2026-04-09T16:37:39Z', publicRepos: 0, followers: 0, following: 0, issueCount: 310, repositoryCount: 155 },
      { login: 'acct-1w-observed-02', role: 'observed', registeredAt: '2026-04-11T03:27:49Z', publicRepos: 0, followers: 0, following: 0, issueCount: 313, repositoryCount: 159 },
      { login: 'acct-1w-observed-03', role: 'observed', registeredAt: '2026-04-10T04:11:29Z', publicRepos: 0, followers: 0, following: 0, issueCount: 316, repositoryCount: 160 },
      { login: 'acct-1w-observed-04', role: 'observed', registeredAt: '2026-04-10T05:01:06Z', publicRepos: 0, followers: 0, following: 0, issueCount: 321, repositoryCount: 158 },
      { login: 'acct-1w-observed-05', role: 'observed', registeredAt: '2026-04-09T19:15:27Z', publicRepos: 0, followers: 0, following: 0, issueCount: 324, repositoryCount: 157 },
    ],
    phrases: ['fake stars', 'bot stargazers', 'zombie accounts', 'cross-repository accusation burst'],
  },
  {
    slug: 'github-issue-abuse-wave-2026-05-31',
    title: 'GitHub issue abuse wave #2026-05-31',
    observedAt: '2026-05-31',
    riskLevel: 'Critical',
    abnormalIssues: 1127,
    affectedRepositories: 525,
    burstStartedAt: '2026-05-26T09:46:51Z',
    burstEndedAt: '2026-05-31T15:47:32Z',
    accounts: [
      { login: 'acct-2w-observed-01', role: 'observed' },
      { login: 'acct-2w-observed-02', role: 'observed' },
      { login: 'acct-2w-observed-03', role: 'observed' },
      { login: 'acct-2w-observed-04', role: 'observed' },
      { login: 'acct-2w-observed-05', role: 'observed' },
      { login: 'acct-2w-observed-06', role: 'observed' },
    ],
    phrases: ['刷星', '僵尸', '虚假', '清理', 'fake stars', 'zombie accounts'],
  },
  {
    slug: 'github-issue-abuse-wave-2026-06-18-round-4',
    title: 'GitHub issue abuse wave 4: coordinated blank-account issue spam',
    observedAt: '2026-06-18',
    riskLevel: 'Critical',
    abnormalIssues: 658,
    affectedRepositories: 322,
    burstStartedAt: '2026-06-18T14:36:08Z',
    burstEndedAt: '2026-06-18T17:03:10Z',
    accounts: [
      { login: 'acct-4w-seed-01', role: 'seed', registeredAt: '2026-04-10T19:11:28Z', publicRepos: 0, followers: 0, following: 0, issueCount: 151, repositoryCount: 94 },
      { login: 'acct-4w-seed-02', role: 'seed', registeredAt: '2026-04-09T13:07:42Z', publicRepos: 0, followers: 0, following: 0, issueCount: 141, repositoryCount: 45 },
      { login: 'acct-4w-seed-03', role: 'seed', registeredAt: '2026-04-09T17:12:21Z', publicRepos: 0, followers: 0, following: 0, issueCount: 120, repositoryCount: 98 },
      { login: 'acct-4w-associated-01', role: 'associated', registeredAt: '2026-04-09T12:54:58Z', publicRepos: 0, followers: 0, following: 0, issueCount: 70, repositoryCount: 51 },
      { login: 'acct-4w-associated-02', role: 'associated', registeredAt: '2026-04-09T17:18:58Z', publicRepos: 0, followers: 0, following: 0, issueCount: 65, repositoryCount: 50 },
      { login: 'acct-4w-associated-03', role: 'associated', registeredAt: '2026-04-09T19:21:48Z', publicRepos: 0, followers: 0, following: 0, issueCount: 64, repositoryCount: 46 },
      { login: 'acct-4w-associated-04', role: 'associated', registeredAt: '2026-04-09T19:06:14Z', publicRepos: 0, followers: 0, following: 0, issueCount: 47, repositoryCount: 34 },
    ],
    phrases: [
      '刷星',
      '空壳号',
      'Stargazer',
      '违规人气清空',
      '项目访问关闭',
      '递交 GitHub 举报',
      'Star存在严重造假嫌疑',
      '从发现到确认的全过程',
      '从兴奋到震惊只用了十秒钟',
    ],
  },
]

export const KNOWN_ATTACKER_LOGINS = Array.from(
  new Set(THREAT_WAVES.flatMap((wave) => wave.accounts.map((account) => account.login))),
).sort((left, right) => left.localeCompare(right))

export const KNOWN_ATTACK_PHRASES = Array.from(
  new Set(THREAT_WAVES.flatMap((wave) => wave.phrases)),
).sort((left, right) => left.localeCompare(right))
