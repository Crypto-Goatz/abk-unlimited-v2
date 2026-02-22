/**
 * Lead Submission API
 *
 * Processes incoming leads using the Lead Intelligence Skill.
 * Scores, routes, and triggers automated follow-up sequences.
 *
 * @endpoint POST /api/leads
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { LeadIntelligence } from '@/lib/skills/lead-intelligence'
import type { IncomingLead } from '@/lib/skills/lead-intelligence'
import { appendSheetRow } from '@/lib/google/sheets'
import { recordAnalyticsEvent } from '@/lib/analytics-loop'
import { startSequence } from '@/lib/email-sequence'

// ============================================================================
// INBOUND WEBHOOK — fires on every lead submission
// ============================================================================

const INBOUND_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/497AdD39erWgmOu8JTCw/webhook-trigger/7eefc3ac-ca9c-4448-87da-b3d518f0ac15'

async function fireWebhook(lead: IncomingLead) {
  try {
    const [firstName, ...rest] = (lead.name || '').split(' ')
    const lastName = rest.join(' ')

    await fetch(INBOUND_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Contact fields (CRM-standard naming)
        firstName,
        lastName,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        address1: lead.address || '',
        city: lead.city || '',
        state: lead.state || '',
        postalCode: lead.zipCode || '',

        // Project details
        source: lead.source || 'Website',
        service: lead.service || '',
        services: lead.services?.join(', ') || '',
        message: lead.message || '',
        projectTimeline: lead.projectTimeline || '',
        budget: lead.budget || '',

        // UTM tracking
        utmSource: lead.utmSource || '',
        utmMedium: lead.utmMedium || '',
        utmCampaign: lead.utmCampaign || '',
        landingPage: lead.landingPage || '',

        // Metadata
        submittedAt: new Date().toISOString(),
        website: 'abkunlimited.com',
      }),
    })
  } catch (error) {
    // Non-blocking — log but don't fail the lead submission
    console.error('Webhook delivery failed:', error)
  }
}

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const leadSchema = z.object({
  // Required
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),

  // Contact
  phone: z.string().optional(),

  // Location
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),

  // Project
  service: z.string().optional(),
  services: z.array(z.string()).optional(),
  message: z.string().optional(),
  projectTimeline: z.string().optional(),
  budget: z.string().optional(),

  // Tracking
  source: z.string().optional(),
  landingPage: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
})

// ============================================================================
// API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = leadSchema.parse(body)

    // Convert to IncomingLead type
    const lead: IncomingLead = {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      address: validatedData.address,
      city: validatedData.city,
      state: validatedData.state,
      zipCode: validatedData.zipCode,
      service: validatedData.service,
      services: validatedData.services,
      message: validatedData.message,
      projectTimeline: validatedData.projectTimeline,
      budget: validatedData.budget,
      source: validatedData.source,
      landingPage: validatedData.landingPage,
      utmSource: validatedData.utmSource,
      utmMedium: validatedData.utmMedium,
      utmCampaign: validatedData.utmCampaign,
    }

    // Fire webhook + process lead intelligence in parallel
    const [result] = await Promise.all([
      LeadIntelligence.process(lead),
      fireWebhook(lead),
    ])

    // Log the result
    console.log('Lead Intelligence Result:', {
      name: validatedData.name,
      email: validatedData.email,
      score: result.lead.score.total,
      temperature: result.lead.score.temperature,
      sequence: result.lead.assignedSequence,
      contactCreated: result.actions.contactCreated,
      smsSent: result.actions.immediateSmsSent,
      tasksCreated: result.actions.tasksCreated.length,
      errors: result.errors,
    })

    // Extract attribution data (prefixed with _attr_ from frontend)
    const attrKeys = Object.keys(body).filter((k) => k.startsWith('_attr_'))
    const attr: Record<string, string> = {}
    for (const k of attrKeys) {
      attr[k.replace('_attr_', '')] = body[k]
    }

    // Sync to Google Sheets customer database (non-blocking)
    const [firstName, ...restName] = (validatedData.name || '').split(' ')
    const lastName = restName.join(' ')
    const customerId = `cust_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    appendSheetRow('customers', {
      id: customerId,
      crm_contact_id: result.lead.crmContactId || '',
      first_name: firstName,
      last_name: lastName,
      email: validatedData.email,
      phone: validatedData.phone || '',
      address: validatedData.address || '',
      city: validatedData.city || '',
      state: validatedData.state || '',
      zip: validatedData.zipCode || '',
      source: `Website - ${validatedData.source || 'Lead Form'}`,
      lead_score: String(result.lead.score.total),
      lead_temperature: result.lead.score.temperature,
      tags: [`source:${validatedData.source || 'website'}`, ...(validatedData.services || []).map((s: string) => `service:${s}`)].join(','),
      services_interested: (validatedData.services || []).join(','),
      estimated_value: validatedData.budget || '0',
      status: 'new',
      notes: validatedData.message || '',
      gclid: attr.gclid || '',
      fbclid: attr.fbclid || '',
      utm_source: validatedData.utmSource || attr.utm_source || '',
      utm_medium: validatedData.utmMedium || attr.utm_medium || '',
      utm_campaign: validatedData.utmCampaign || attr.utm_campaign || '',
      ga_client_id: attr.ga_client_id || '',
      first_visit_page: validatedData.landingPage || attr.landing_page || '',
      conversion_page: attr.conversion_page || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_synced: new Date().toISOString(),
    }).catch((err) => console.error('Sheets sync error:', err))

    // Record analytics event (non-blocking)
    recordAnalyticsEvent({
      customerId,
      crmContactId: result.lead.crmContactId,
      eventName: 'lead_form_submission',
      eventCategory: 'conversion',
      attribution: {
        gclid: attr.gclid,
        fbclid: attr.fbclid,
        utmSource: validatedData.utmSource || attr.utm_source,
        utmMedium: validatedData.utmMedium || attr.utm_medium,
        utmCampaign: validatedData.utmCampaign || attr.utm_campaign,
        gaClientId: attr.ga_client_id,
        sessionId: attr.session_id,
        referrer: attr.referrer,
        landingPage: validatedData.landingPage || attr.landing_page,
        deviceType: attr.device_type,
      },
      pagePath: attr.conversion_page || '/free-estimate',
      conversionValue: validatedData.budget ? 1000 : 500,
    }).catch(() => {})

    // Start automated email thank-you sequence (non-blocking)
    startSequence({
      firstName,
      lastName: restName.join(' ') || undefined,
      email: validatedData.email,
      phone: validatedData.phone,
      service: validatedData.service,
      source: validatedData.source || 'free-estimate',
      crmContactId: result.lead.crmContactId,
      customerId,
    }).catch((err) => console.error('Sequence start error:', err))

    // Return appropriate response based on temperature
    const messages = {
      hot: "Thank you! Your project sounds exciting. We'll call you shortly to discuss the details.",
      warm: "Thank you for reaching out! We'll be in touch within 24 hours with more information.",
      cold: "Thank you for your interest! We've received your inquiry and will follow up soon.",
    }

    return NextResponse.json({
      success: true,
      message: messages[result.lead.score.temperature],
      leadId: result.lead.crmContactId,
      // Include score for debugging (remove in production if needed)
      _debug: process.env.NODE_ENV === 'development' ? {
        score: result.lead.score.total,
        temperature: result.lead.score.temperature,
        sequence: result.lead.assignedSequence,
        actions: result.actions,
      } : undefined,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Lead submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again or call us directly.' },
      { status: 500 }
    )
  }
}

// ============================================================================
// ANALYZE ENDPOINT (Optional - for testing)
// ============================================================================

export async function PUT(request: NextRequest) {
  // This endpoint allows analyzing a lead without executing
  // Useful for testing and previewing

  try {
    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    const lead: IncomingLead = {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      address: validatedData.address,
      city: validatedData.city,
      state: validatedData.state,
      zipCode: validatedData.zipCode,
      service: validatedData.service,
      services: validatedData.services,
      message: validatedData.message,
      projectTimeline: validatedData.projectTimeline,
      budget: validatedData.budget,
      source: validatedData.source,
    }

    // Analyze without executing
    const processed = LeadIntelligence.analyze(lead)

    return NextResponse.json({
      success: true,
      analysis: {
        score: processed.score,
        primaryService: processed.primaryService?.name,
        assignedSequence: processed.assignedSequence,
        tags: processed.tags,
        summary: LeadIntelligence.summarize(processed),
      },
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Lead analysis error:', error)
    return NextResponse.json(
      { success: false, error: 'Analysis failed' },
      { status: 500 }
    )
  }
}
