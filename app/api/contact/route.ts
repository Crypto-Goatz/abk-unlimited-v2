import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createCustomer } from '@/lib/crm-sync'
import { recordAnalyticsEvent } from '@/lib/analytics-loop'
import { startSequence } from '@/lib/email-sequence'

// Validation schema for contact form — now includes attribution fields
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  page_source: z.string().optional(),
  // Attribution fields from client-side tracker
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
  msclkid: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  ga_client_id: z.string().optional(),
  session_id: z.string().optional(),
  referrer: z.string().optional(),
  landing_page: z.string().optional(),
  conversion_page: z.string().optional(),
  device_type: z.string().optional(),
})

function splitName(fullName: string): { firstName: string; lastName?: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0] }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)
    const { firstName, lastName } = splitName(data.name)

    // Determine services from subject
    const serviceMap: Record<string, string> = {
      'Kitchen Remodeling': 'kitchen',
      'Bathroom Renovation': 'bathroom',
      'Basement Finishing': 'basement',
      'Deck Building': 'deck',
      'Home Addition': 'addition',
      'Roofing': 'roofing',
      'Siding': 'siding',
      'Flooring': 'flooring',
      'Emergency Repair': 'emergency',
    }
    const servicesInterested = data.subject && serviceMap[data.subject]
      ? [serviceMap[data.subject]]
      : []

    // Create customer → syncs to both CRM + Google Sheets with full attribution
    const result = await createCustomer({
      firstName,
      lastName,
      email: data.email,
      phone: data.phone,
      source: 'Website - Contact Form',
      tags: ['Website Contact', 'ABK Website'],
      servicesInterested,
      notes: `Subject: ${data.subject || 'General Inquiry'}\nMessage: ${data.message}\nSource Page: ${data.page_source || 'Unknown'}`,
      // Attribution
      gclid: data.gclid,
      fbclid: data.fbclid,
      utmSource: data.utm_source,
      utmMedium: data.utm_medium,
      utmCampaign: data.utm_campaign,
      gaClientId: data.ga_client_id,
      firstVisitPage: data.landing_page,
      conversionPage: data.conversion_page || data.page_source,
    })

    // Record analytics event for the feedback loop
    await recordAnalyticsEvent({
      customerId: result.customerId,
      crmContactId: result.crmContactId,
      eventName: 'contact_form_submission',
      eventCategory: 'conversion',
      attribution: {
        gclid: data.gclid,
        fbclid: data.fbclid,
        msclkid: data.msclkid,
        utmSource: data.utm_source,
        utmMedium: data.utm_medium,
        utmCampaign: data.utm_campaign,
        gaClientId: data.ga_client_id,
        sessionId: data.session_id,
        referrer: data.referrer,
        landingPage: data.landing_page,
        deviceType: data.device_type,
      },
      pagePath: data.conversion_page || data.page_source || '/contact',
      conversionValue: servicesInterested.length > 0 ? 500 : 100, // Estimated lead value
    }).catch(() => {})

    // Start automated email thank-you sequence (non-blocking)
    startSequence({
      firstName,
      lastName,
      email: data.email,
      phone: data.phone,
      service: data.subject,
      source: 'contact',
      crmContactId: result.crmContactId,
      customerId: result.customerId,
    }).catch((err) => console.error('Sequence start error:', err))

    return NextResponse.json({
      success: true,
      message: "Message received! We'll get back to you soon.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Contact submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
