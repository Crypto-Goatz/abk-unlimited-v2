import { NextRequest, NextResponse } from 'next/server'
import { unsubscribeSequence } from '@/lib/email-sequence'

export async function POST(request: NextRequest) {
  try {
    const { sequenceId } = await request.json()
    if (!sequenceId) {
      return NextResponse.json({ error: 'Missing sequenceId' }, { status: 400 })
    }

    const result = await unsubscribeSequence(sequenceId)
    return NextResponse.json({ success: result })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
  }
}
