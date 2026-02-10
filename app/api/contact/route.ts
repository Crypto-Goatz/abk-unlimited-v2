import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createCRMContact, addCRMNote, addCRMTags } from '@/lib/crm-api'

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  page_source: z.string().optional(),
})

// Helper to split full name into first/last
function splitName(fullName: string): { firstName: string; lastName?: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0] }
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = contactSchema.parse(body)

    // Split name into first/last
    const { firstName, lastName } = splitName(validatedData.name)

    // Create contact in CRM
    const contactResult = await createCRMContact({
      firstName,
      lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      source: 'Website - Contact Form',
      tags: ['Website Contact', 'ABK Website'],
    })

    if (!contactResult.success) {
      console.error('Failed to create CRM contact:', contactResult.error)
      // Still return success to user - don't fail the form submission
    }

    // If contact was created, add note with message
    if (contactResult.contact?.id) {
      const noteBody = `
**Contact Form Submission**
Subject: ${validatedData.subject || 'General Inquiry'}
Message: ${validatedData.message}
Source Page: ${validatedData.page_source || 'Unknown'}
      `.trim()

      await addCRMNote(contactResult.contact.id, noteBody)

      // Add subject-specific tags
      if (validatedData.subject) {
        await addCRMTags(contactResult.contact.id, [`Subject: ${validatedData.subject}`])
      }
    }

    console.log('Contact submission processed:', {
      name: validatedData.name,
      email: validatedData.email,
      crmContactId: contactResult.contact?.id,
    })

    return NextResponse.json({
      success: true,
      message: 'Message received! We\'ll get back to you soon.',
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
