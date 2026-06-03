import { NextResponse } from 'next/server'
import { z } from 'zod'
import { guardConfigSchema } from '@/src/config'
import { GitHubGuardClient } from '@/src/github'
import { scanRepositories } from '@/src/scanner'

export const dynamic = 'force-dynamic'

const scanRequestSchema = z.object({
  token: z.string().min(1),
  config: guardConfigSchema,
  apply: z.boolean().default(false),
})

export async function POST(request: Request) {
  try {
    const payload = scanRequestSchema.parse(await request.json())
    const client = new GitHubGuardClient(payload.token)
    const report = await scanRepositories({
      client,
      config: payload.config,
      apply: payload.apply,
    })

    return NextResponse.json({
      success: true,
      mode: payload.apply ? 'apply' : 'dry-run',
      report,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
