import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Niubi Guard - Free Open Source GitHub Abuse Defense',
  description:
    'Niubi Guard is a free open-source GitHub abuse defense tool with keyword rules, username defense, and user-owned OpenAI-compatible AI detection for malicious Issues, fake star accusations, buy-stars allegations, 刷星控诉, bot attacks, and reputation pressure campaigns.',
  keywords: [
    'GitHub malicious issues',
    'GitHub abuse defense',
    'OpenAI compatible GitHub moderation',
    'AI issue detection',
    'fake star accusation',
    'buy stars allegation',
    '刷星控诉',
    '恶意 Issue',
    'GitHub repository security',
    'open source guard',
  ],
  alternates: {
    languages: {
      en: '/',
      'zh-CN': '/',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
