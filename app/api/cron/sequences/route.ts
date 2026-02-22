/**
 * Cron: Process Scheduled Email Sequences
 * GET /api/cron/sequences
 *
 * Should be called every hour by Vercel Cron.
 * Checks for due emails and sends them.
 */

import { NextRequest, NextResponse } from 'next/server'
import { processScheduledEmails, getSequenceStats } from '@/lib/email-sequence'

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sets this automatically)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await processScheduledEmails()
    const stats = await getSequenceStats()

    console.log('[cron/sequences]', {
      processed: result.processed,
      sent: result.sent,
      errors: result.errors,
      ...stats,
    })

    return NextResponse.json({
      success: true,
      ...result,
      stats,
    })
  } catch (error) {
    console.error('[cron/sequences] Error:', error)
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}
