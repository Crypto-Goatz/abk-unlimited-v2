/**
 * Sequence Management API
 * GET /api/sequences — stats
 * POST /api/sequences — manually trigger a sequence
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSequenceStats, startSequence } from '@/lib/email-sequence'

export async function GET() {
  try {
    const stats = await getSequenceStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Sequence stats error:', error)
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, service, source } = body

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'email and firstName required' },
        { status: 400 }
      )
    }

    const result = await startSequence({
      firstName,
      email,
      service,
      source: source || 'manual',
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Sequence start error:', error)
    return NextResponse.json({ error: 'Failed to start sequence' }, { status: 500 })
  }
}
