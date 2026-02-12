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
