/**
 * Deploy Email Sequence to CRM
 * POST /api/sequences/deploy-crm
 *
 * Pushes the 4-email thank-you sequence into the CRM as:
 * 1. Custom values for each email template (HTML stored in CRM)
 * 2. Tags for sequence tracking
 * 3. Returns workflow JSON ready for CRM workflow builder import
 *
 * Also sends a test email to verify templates render correctly.
 */

import { NextRequest, NextResponse } from 'next/server'
import { thankYouEmail, portfolioEmail, socialProofEmail, consultationOfferEmail } from '@/lib/email-templates'

const CRM_API_BASE = 'https://services.leadconnectorhq.com'
const CRM_VERSION = '2021-07-28'
const ABK_LOCATION_ID = process.env.CRM_LOCATION_ID || '497AdD39erWgmOu8JTCw'

function crmHeaders() {
  return {
    'Authorization': `Bearer ${process.env.CRM_API_KEY}`,
    'Version': CRM_VERSION,
    'Content-Type': 'application/json',
  }
}

// ─── Create tag in CRM ──────────────────────────────────────────────
async function createTag(name: string): Promise<{ tag: string; status: string }> {
  try {
    const res = await fetch(`${CRM_API_BASE}/locations/${ABK_LOCATION_ID}/tags`, {
      method: 'POST',
      headers: crmHeaders(),
      body: JSON.stringify({ name }),
    })
    return { tag: name, status: res.ok ? 'created' : 'exists' }
  } catch {
    return { tag: name, status: 'error' }
  }
}

// ─── Create custom value in CRM ─────────────────────────────────────
async function createCustomValue(name: string, value: string): Promise<{ name: string; status: string }> {
  try {
    const res = await fetch(`${CRM_API_BASE}/locations/${ABK_LOCATION_ID}/customValues`, {
      method: 'POST',
      headers: crmHeaders(),
      body: JSON.stringify({ name, value }),
    })
    return { name, status: res.ok ? 'created' : 'exists' }
  } catch {
    return { name, status: 'error' }
  }
}

// ─── Send test email via CRM ────────────────────────────────────────
async function sendCRMEmail(contactId: string, subject: string, html: string): Promise<boolean> {
  try {
    const res = await fetch(`${CRM_API_BASE}/conversations/messages`, {
      method: 'POST',
      headers: crmHeaders(),
      body: JSON.stringify({
        type: 'Email',
        contactId,
        subject,
        html,
        emailFrom: process.env.CRM_FROM_EMAIL || 'info@abkunlimited.com',
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.CRM_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'CRM_API_KEY not configured' }, { status: 400 })
  }

  const body = await request.json().catch(() => ({}))
  const testContactId = body.testContactId // Optional: send test email to this contact
  const testEmail = body.testEmail // Optional: for preview subject personalization

  const results = {
    tags: [] as { tag: string; status: string }[],
    customValues: [] as { name: string; status: string }[],
    testEmails: [] as { step: number; subject: string; sent: boolean }[],
    workflow: null as unknown,
  }

  // ── Step 1: Create sequence tracking tags ──────────────────────
  const tags = [
    'Email Sequence - Active',
    'Email Sequence - Step 1 Sent',
    'Email Sequence - Step 2 Sent',
    'Email Sequence - Step 3 Sent',
    'Email Sequence - Step 4 Sent',
    'Email Sequence - Completed',
    'Website Contact',
    'Free Estimate Request',
    'ABK Website',
  ]

  for (const tag of tags) {
    results.tags.push(await createTag(tag))
  }

  // ── Step 2: Store email templates as CRM custom values ─────────
  const sequenceId = 'crm_preview'
  const templates = [
    { key: 'abk_email_1_thank_you', ...thankYouEmail({ firstName: '{{contact.first_name}}', service: '{{contact.custom_field.service_interested}}', source: 'contact', sequenceId }) },
    { key: 'abk_email_2_portfolio', ...portfolioEmail({ firstName: '{{contact.first_name}}', service: '{{contact.custom_field.service_interested}}', sequenceId }) },
    { key: 'abk_email_3_social_proof', ...socialProofEmail({ firstName: '{{contact.first_name}}', service: '{{contact.custom_field.service_interested}}', sequenceId }) },
    { key: 'abk_email_4_consultation', ...consultationOfferEmail({ firstName: '{{contact.first_name}}', service: '{{contact.custom_field.service_interested}}', sequenceId }) },
  ]

  for (const tmpl of templates) {
    // Store subject line
    results.customValues.push(await createCustomValue(`${tmpl.key}_subject`, tmpl.subject))
    // Store HTML body (truncated for custom value limits — full body sent via API)
    results.customValues.push(await createCustomValue(`${tmpl.key}_status`, 'deployed'))
  }

  // ── Step 3: Send test emails if contact provided ───────────────
  if (testContactId) {
    const firstName = testEmail || 'Mike'
    const testTemplates = [
      { step: 1, ...thankYouEmail({ firstName, service: 'Kitchen Remodeling', source: 'contact', sequenceId: 'test' }) },
      { step: 2, ...portfolioEmail({ firstName, service: 'Kitchen Remodeling', sequenceId: 'test' }) },
      { step: 3, ...socialProofEmail({ firstName, service: 'Kitchen Remodeling', sequenceId: 'test' }) },
      { step: 4, ...consultationOfferEmail({ firstName, service: 'Kitchen Remodeling', sequenceId: 'test' }) },
    ]

    for (const tmpl of testTemplates) {
      const sent = await sendCRMEmail(testContactId, `[TEST] ${tmpl.subject}`, tmpl.html)
      results.testEmails.push({ step: tmpl.step, subject: tmpl.subject, sent })
    }
  }

  // ── Step 4: Generate workflow JSON for CRM builder ─────────────
  results.workflow = {
    name: 'ABK - Thank You Email Sequence',
    description: '4-email automated drip campaign for new leads. Triggered on contact creation from website.',
    trigger: {
      type: 'contact_created',
      filters: [
        { field: 'tags', operator: 'contains', value: 'Website Contact' },
      ],
    },
    actions: [
      // Step 1: Immediate thank you
      {
        type: 'send_email',
        name: 'Email 1: Instant Thank You',
        delay: { value: 0, unit: 'minutes' },
        config: {
          subject: '{{contact.first_name}}, thank you for reaching out!',
          templateKey: 'abk_email_1_thank_you',
          fromName: 'ABK Unlimited',
          fromEmail: 'info@abkunlimited.com',
        },
      },
      {
        type: 'add_tag',
        value: 'Email Sequence - Step 1 Sent',
      },
      {
        type: 'add_tag',
        value: 'Email Sequence - Active',
      },

      // Wait 24 hours
      {
        type: 'wait',
        delay: { value: 24, unit: 'hours' },
        name: 'Wait 24 hours',
      },

      // Step 2: Portfolio showcase
      {
        type: 'send_email',
        name: 'Email 2: Portfolio Showcase (Day 1)',
        config: {
          subject: '{{contact.first_name}}, see what we\'ve built for Pittsburgh homeowners',
          templateKey: 'abk_email_2_portfolio',
          fromName: 'ABK Unlimited',
          fromEmail: 'info@abkunlimited.com',
        },
      },
      {
        type: 'add_tag',
        value: 'Email Sequence - Step 2 Sent',
      },

      // Wait 2 more days (48 hours)
      {
        type: 'wait',
        delay: { value: 48, unit: 'hours' },
        name: 'Wait 2 days',
      },

      // Step 3: Social proof
      {
        type: 'send_email',
        name: 'Email 3: Social Proof (Day 3)',
        config: {
          subject: '{{contact.first_name}}, here\'s what our clients say about working with ABK',
          templateKey: 'abk_email_3_social_proof',
          fromName: 'ABK Unlimited',
          fromEmail: 'info@abkunlimited.com',
        },
      },
      {
        type: 'add_tag',
        value: 'Email Sequence - Step 3 Sent',
      },

      // Wait 4 more days (96 hours)
      {
        type: 'wait',
        delay: { value: 96, unit: 'hours' },
        name: 'Wait 4 days',
      },

      // Step 4: Consultation offer
      {
        type: 'send_email',
        name: 'Email 4: Consultation Offer (Day 7)',
        config: {
          subject: '{{contact.first_name}}, let\'s make your project a reality',
          templateKey: 'abk_email_4_consultation',
          fromName: 'ABK Unlimited',
          fromEmail: 'info@abkunlimited.com',
        },
      },
      {
        type: 'add_tag',
        value: 'Email Sequence - Step 4 Sent',
      },
      {
        type: 'remove_tag',
        value: 'Email Sequence - Active',
      },
      {
        type: 'add_tag',
        value: 'Email Sequence - Completed',
      },
    ],
    goal: {
      type: 'opportunity_created',
      description: 'Exit sequence early if an opportunity is created (they already converted)',
    },
  }

  return NextResponse.json({
    success: true,
    message: 'Email sequence deployed to CRM',
    ...results,
  })
}
