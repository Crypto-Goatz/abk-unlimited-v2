/**
 * Universal 0n Webhook Handler
 * POST /api/webhooks/0n
 *
 * Receives CRM webhooks and routes them to .0n SWITCH file workflows.
 * This is the bridge between CRM events and 0nMCP-powered automation.
 *
 * Every RocketOpp project gets this endpoint.
 *
 * Supports:
 * - CRM contact events (contact.created, contact.updated, contact.tag_added)
 * - CRM form events (form.submitted)
 * - CRM opportunity events (opportunity.created, opportunity.status_changed)
 * - Custom webhook events (any event with a matching .0n workflow)
 * - Manual trigger via POST with { workflow, inputs }
 */

import { NextRequest, NextResponse } from 'next/server'
import { executeWorkflow, deployDependencies } from '@/lib/0n-runner'

// ─── Workflow Registry ───────────────────────────────────────────────
// Maps CRM events to .0n workflow definitions.
// In production, these would be loaded from files or a database.
// For now, inline definitions that reference the full .0n SWITCH files.

import { getEmailTemplate, SEQUENCE_SCHEDULE } from '@/lib/email-templates'

// ABK Email Sequence — inline workflow that uses the existing email template engine
const ABK_EMAIL_SEQUENCE = {
  $0n: {
    type: 'workflow' as const,
    version: '1.0.0',
    name: 'ABK — Thank You Email Sequence',
  },
  inputs: {
    firstName: { type: 'string', required: true },
    email: { type: 'string', required: true },
    service: { type: 'string', required: false, default: 'general' },
    source: { type: 'string', required: true },
    crmContactId: { type: 'string', required: false },
  },
  steps: [
    {
      id: 'tag_active',
      name: 'Tag contact as active sequence',
      service: 'crm',
      action: 'contacts.addTag',
      params: {
        contactId: '{{inputs.crmContactId}}',
        locationId: '{{env.CRM_LOCATION_ID}}',
        tags: ['email sequence - active', 'website contact'],
      },
      output: 'tag_result',
      conditions: [{ if: '{{inputs.crmContactId}}' }],
    },
    {
      id: 'email_1_crm',
      name: 'Send Thank You via CRM',
      service: 'crm',
      action: 'conversations.sendEmail',
      params: {
        contactId: '{{inputs.crmContactId}}',
        subject: '{{inputs.firstName}}, thank you for reaching out!',
        emailFrom: 'info@abkunlimited.com',
      },
      output: 'crm_email_result',
      conditions: [{ if: '{{inputs.crmContactId}}' }],
    },
    {
      id: 'email_1_sg',
      name: 'Send Thank You via SendGrid',
      service: 'sendgrid',
      action: 'mail.send',
      params: {
        to: '{{inputs.email}}',
        from: 'info@abkunlimited.com',
        fromName: 'ABK Unlimited',
        subject: '{{inputs.firstName}}, thank you for reaching out!',
        trackClicks: true,
        trackOpens: true,
      },
      output: 'sg_email_result',
    },
    {
      id: 'tag_step1',
      name: 'Tag Step 1 Sent',
      service: 'crm',
      action: 'contacts.addTag',
      params: {
        contactId: '{{inputs.crmContactId}}',
        locationId: '{{env.CRM_LOCATION_ID}}',
        tags: ['email sequence - step 1 sent'],
      },
      output: 'tag_step1_result',
      conditions: [{ if: '{{inputs.crmContactId}}' }],
    },
  ],
  outputs: {
    email1Sent: true,
    contactEmail: '{{inputs.email}}',
  },
  dependencies: {
    crm_tags: [
      'email sequence - active',
      'email sequence - step 1 sent',
      'email sequence - step 2 sent',
      'email sequence - step 3 sent',
      'email sequence - step 4 sent',
      'email sequence - completed',
      'website contact',
      'free estimate request',
      'abk website',
    ],
    crm_custom_values: {
      abk_email_1_subject: 'Thanks for reaching out!',
      abk_email_2_subject: "See what we've built for Pittsburgh homeowners",
      abk_email_3_subject: "Here's what our clients say about ABK",
      abk_email_4_subject: "Let's make your project a reality",
      abk_email_sequence_status: 'active',
      abk_sequence_version: 'v1.0.0 - 4 Step Thank You',
    },
  },
}

// ─── Event → Workflow Routing ────────────────────────────────────────

const EVENT_ROUTES: Record<string, typeof ABK_EMAIL_SEQUENCE> = {
  'contact.created': ABK_EMAIL_SEQUENCE,
  'form.submitted': ABK_EMAIL_SEQUENCE,
  // Add more routes as workflows are created:
  // 'opportunity.created': ABK_OPPORTUNITY_WORKFLOW,
  // 'contact.tag_added': ABK_TAG_ROUTER,
}

// ─── Extract contact data from CRM webhook payload ──────────────────

function extractContactFromWebhook(payload: Record<string, unknown>): Record<string, unknown> {
  // CRM webhooks send different shapes depending on the event
  const contact = (payload.contact || payload.data || payload) as Record<string, unknown>

  return {
    firstName: contact.firstName || contact.first_name || contact.name || 'Friend',
    lastName: contact.lastName || contact.last_name || '',
    email: contact.email || '',
    phone: contact.phone || '',
    service: contact.customField?.service_interested || contact.service || 'general',
    source: contact.source || payload.source || 'webhook',
    crmContactId: contact.id || contact.contactId || payload.contactId || '',
  }
}

// ─── POST Handler ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Manual trigger: { workflow: "email-sequence", inputs: {...} }
    if (body.workflow) {
      const wf = EVENT_ROUTES[body.workflow] || Object.values(EVENT_ROUTES).find(
        (w) => w.$0n.name.toLowerCase().includes(body.workflow.toLowerCase())
      )

      if (!wf) {
        return NextResponse.json(
          { error: `Unknown workflow: ${body.workflow}`, available: Object.keys(EVENT_ROUTES) },
          { status: 404 }
        )
      }

      const result = await executeWorkflow(wf, body.inputs || {})
      return NextResponse.json({ success: true, ...result })
    }

    // Deploy dependencies: { action: "deploy" }
    if (body.action === 'deploy') {
      const results = []
      for (const wf of Object.values(EVENT_ROUTES)) {
        results.push({
          workflow: wf.$0n.name,
          ...(await deployDependencies(wf)),
        })
      }
      return NextResponse.json({ success: true, deployments: results })
    }

    // CRM webhook event
    const event = body.event || body.type || body.action
    if (!event) {
      return NextResponse.json(
        { error: 'No event type in webhook payload' },
        { status: 400 }
      )
    }

    const workflow = EVENT_ROUTES[event]
    if (!workflow) {
      console.log(`[0n-webhook] No workflow mapped for event: ${event}`)
      return NextResponse.json({ received: true, event, mapped: false })
    }

    // Extract contact data from webhook payload
    const contactData = extractContactFromWebhook(body)

    // Inject email HTML from our template engine
    const { html } = getEmailTemplate(1, {
      firstName: String(contactData.firstName),
      service: String(contactData.service),
      source: String(contactData.source),
      sequenceId: `wh_${Date.now()}`,
    })

    // Merge HTML into the workflow step params at runtime
    const enrichedWorkflow = {
      ...workflow,
      steps: workflow.steps.map((step) => {
        if (step.id === 'email_1_crm' || step.id === 'email_1_sg') {
          return { ...step, params: { ...step.params, html } }
        }
        return step
      }),
    }

    // Execute
    const result = await executeWorkflow(enrichedWorkflow, contactData)

    console.log(`[0n-webhook] ${event} → ${workflow.$0n.name} — ${result.status}`)

    return NextResponse.json({
      received: true,
      event,
      workflow: workflow.$0n.name,
      ...result,
    })
  } catch (error) {
    console.error('[0n-webhook] Error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// ─── GET: Status + Available Workflows ───────────────────────────────

export async function GET() {
  return NextResponse.json({
    status: 'active',
    engine: '0nMCP SWITCH Runner',
    version: '1.0.0',
    workflows: Object.entries(EVENT_ROUTES).map(([event, wf]) => ({
      event,
      name: wf.$0n.name,
      steps: wf.steps.length,
      dependencies: wf.dependencies,
    })),
    endpoints: {
      'POST /api/webhooks/0n': 'Process CRM webhook event',
      'POST /api/webhooks/0n { workflow, inputs }': 'Manual trigger',
      'POST /api/webhooks/0n { action: "deploy" }': 'Deploy all CRM dependencies',
      'GET /api/webhooks/0n': 'This status page',
    },
  })
}
