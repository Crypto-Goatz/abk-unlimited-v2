/**
 * ABK Unlimited — Email Sequence Engine
 *
 * Manages automated drip campaigns after form submissions.
 * Tracks state in Google Sheets `email_sequences` tab.
 * Sends via SendGrid API (or falls back to CRM email).
 *
 * Sequence flow:
 * 1. Form submitted → startSequence() → sends Email 1 immediately
 * 2. Cron runs every hour → processScheduledEmails() → sends due emails
 * 3. Each send is logged in sheets with status and timestamp
 */

import { getSheetData, appendSheetRow, updateSheetRow } from './google/sheets'
import { getEmailTemplate, SEQUENCE_SCHEDULE, type EmailStep } from './email-templates'

// ─── Types ───────────────────────────────────────────────────────────

interface SequenceContact {
  firstName: string
  lastName?: string
  email: string
  phone?: string
  service?: string
  source: string
  crmContactId?: string
  customerId?: string
}

interface SequenceRow {
  id: string
  customer_id: string
  crm_contact_id: string
  email: string
  first_name: string
  service: string
  source: string
  current_step: string
  status: string // active | paused | completed | unsubscribed
  step_1_sent: string
  step_2_sent: string
  step_3_sent: string
  step_4_sent: string
  step_2_scheduled: string
  step_3_scheduled: string
  step_4_scheduled: string
  created_at: string
  updated_at: string
}

// ─── SendGrid ────────────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'info@abkunlimited.com'
  const fromName = process.env.SENDGRID_FROM_NAME || 'ABK Unlimited'

  if (!apiKey) {
    console.log(`[email-sequence] SendGrid not configured — would send "${subject}" to ${to}`)
    return true // Don't block the sequence in dev
  }

  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: fromEmail, name: fromName },
        subject,
        content: [{ type: 'text/html', value: html }],
        tracking_settings: {
          click_tracking: { enable: true },
          open_tracking: { enable: true },
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`[email-sequence] SendGrid error (${res.status}):`, err)
      return false
    }

    console.log(`[email-sequence] Sent "${subject}" to ${to}`)
    return true
  } catch (err) {
    console.error('[email-sequence] Send failed:', err)
    return false
  }
}

// ─── Start a new sequence ────────────────────────────────────────────

export async function startSequence(contact: SequenceContact): Promise<{
  success: boolean
  sequenceId: string
  firstEmailSent: boolean
}> {
  const sequenceId = `seq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const now = new Date()

  // Check if this email already has an active sequence
  try {
    const existing = (await getSheetData('email_sequences')) as unknown as SequenceRow[]
    const active = existing.find(
      (r) => r.email === contact.email && (r.status === 'active' || r.status === 'paused')
    )
    if (active) {
      console.log(`[email-sequence] Active sequence exists for ${contact.email} — skipping`)
      return { success: true, sequenceId: active.id, firstEmailSent: false }
    }
  } catch {
    // Sheet might not exist yet, continue
  }

  // Generate and send the first email immediately
  const { subject, html } = getEmailTemplate(1, {
    firstName: contact.firstName,
    service: contact.service,
    source: contact.source,
    sequenceId,
  })

  const sent = await sendEmail(contact.email, subject, html)

  // Schedule future emails
  const step2Time = new Date(now.getTime() + SEQUENCE_SCHEDULE[1].delayMinutes * 60000)
  const step3Time = new Date(now.getTime() + SEQUENCE_SCHEDULE[2].delayMinutes * 60000)
  const step4Time = new Date(now.getTime() + SEQUENCE_SCHEDULE[3].delayMinutes * 60000)

  // Save to tracking sheet
  try {
    await appendSheetRow('email_sequences', {
      id: sequenceId,
      customer_id: contact.customerId || '',
      crm_contact_id: contact.crmContactId || '',
      email: contact.email,
      first_name: contact.firstName,
      service: contact.service || '',
      source: contact.source,
      current_step: '1',
      status: 'active',
      step_1_sent: sent ? now.toISOString() : '',
      step_2_sent: '',
      step_3_sent: '',
      step_4_sent: '',
      step_2_scheduled: step2Time.toISOString(),
      step_3_scheduled: step3Time.toISOString(),
      step_4_scheduled: step4Time.toISOString(),
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    })
  } catch (err) {
    console.error('[email-sequence] Failed to save sequence:', err)
  }

  return { success: true, sequenceId, firstEmailSent: sent }
}

// ─── Process scheduled emails (called by cron) ──────────────────────

export async function processScheduledEmails(): Promise<{
  processed: number
  sent: number
  errors: number
}> {
  const result = { processed: 0, sent: 0, errors: 0 }

  let sequences: SequenceRow[]
  try {
    sequences = (await getSheetData('email_sequences')) as unknown as SequenceRow[]
  } catch {
    return result
  }

  const now = new Date()
  const active = sequences.filter((s) => s.status === 'active')

  for (let i = 0; i < active.length; i++) {
    const seq = active[i]
    const rowIndex = sequences.indexOf(seq)
    const currentStep = parseInt(seq.current_step, 10) as EmailStep

    // Determine next step
    const nextStep = (currentStep + 1) as EmailStep
    if (nextStep > 4) {
      // Sequence complete
      await updateSheetRow('email_sequences', rowIndex, {
        ...seq,
        status: 'completed',
        updated_at: now.toISOString(),
      })
      continue
    }

    // Check if next step is due
    const scheduledField = `step_${nextStep}_scheduled` as keyof SequenceRow
    const scheduledTime = seq[scheduledField]
    if (!scheduledTime || new Date(scheduledTime) > now) continue

    // Check if already sent
    const sentField = `step_${nextStep}_sent` as keyof SequenceRow
    if (seq[sentField]) continue

    result.processed++

    // Generate and send
    const { subject, html } = getEmailTemplate(nextStep, {
      firstName: seq.first_name,
      service: seq.service || undefined,
      source: seq.source,
      sequenceId: seq.id,
    })

    const sent = await sendEmail(seq.email, subject, html)

    if (sent) {
      result.sent++
    } else {
      result.errors++
    }

    // Update tracking
    await updateSheetRow('email_sequences', rowIndex, {
      ...seq,
      current_step: String(nextStep),
      [sentField]: sent ? now.toISOString() : '',
      updated_at: now.toISOString(),
      // Mark as completed if this was the last step
      ...(nextStep === 4 ? { status: 'completed' } : {}),
    })
  }

  return result
}

// ─── Unsubscribe ─────────────────────────────────────────────────────

export async function unsubscribeSequence(sequenceId: string): Promise<boolean> {
  try {
    const sequences = (await getSheetData('email_sequences')) as unknown as SequenceRow[]
    const index = sequences.findIndex((s) => s.id === sequenceId)
    if (index < 0) return false

    await updateSheetRow('email_sequences', index, {
      ...sequences[index],
      status: 'unsubscribed',
      updated_at: new Date().toISOString(),
    })
    return true
  } catch {
    return false
  }
}

// ─── Get sequence stats ──────────────────────────────────────────────

export async function getSequenceStats(): Promise<{
  total: number
  active: number
  completed: number
  unsubscribed: number
  emailsSent: number
}> {
  try {
    const sequences = (await getSheetData('email_sequences')) as unknown as SequenceRow[]

    let emailsSent = 0
    for (const s of sequences) {
      if (s.step_1_sent) emailsSent++
      if (s.step_2_sent) emailsSent++
      if (s.step_3_sent) emailsSent++
      if (s.step_4_sent) emailsSent++
    }

    return {
      total: sequences.length,
      active: sequences.filter((s) => s.status === 'active').length,
      completed: sequences.filter((s) => s.status === 'completed').length,
      unsubscribed: sequences.filter((s) => s.status === 'unsubscribed').length,
      emailsSent,
    }
  } catch {
    return { total: 0, active: 0, completed: 0, unsubscribed: 0, emailsSent: 0 }
  }
}
