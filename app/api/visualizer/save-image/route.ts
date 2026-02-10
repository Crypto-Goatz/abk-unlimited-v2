import { NextRequest, NextResponse } from 'next/server'

const CRM_API_BASE = 'https://services.leadconnectorhq.com'
const CRM_API_VERSION = '2021-07-28'

export async function POST(request: NextRequest) {
  const apiKey = process.env.CRM_API_KEY
  const locationId = process.env.CRM_LOCATION_ID

  if (!apiKey || !locationId) {
    return NextResponse.json(
      { error: 'CRM integration not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { contactId, imageBase64, mimeType, projectType, description } = body

    if (!contactId || !imageBase64) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert base64 to blob for upload
    const imageBuffer = Buffer.from(imageBase64, 'base64')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `visualizer-${projectType || 'design'}-${timestamp}.jpg`

    // Create form data for file upload
    const formData = new FormData()
    formData.append('file', new Blob([imageBuffer], { type: mimeType || 'image/jpeg' }), filename)
    formData.append('contactId', contactId)

    // Upload file to CRM
    const uploadResponse = await fetch(`${CRM_API_BASE}/medias/upload-file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': CRM_API_VERSION,
      },
      body: formData,
    })

    let fileUrl = null
    if (uploadResponse.ok) {
      const uploadResult = await uploadResponse.json()
      fileUrl = uploadResult.url || uploadResult.fileUrl
    }

    // Add a note to the contact with the design details
    const noteBody = `
AI Visualizer Design Saved

Project Type: ${projectType || 'Not specified'}
Description: ${description || 'Renovation visualization'}
Generated: ${new Date().toLocaleString()}
${fileUrl ? `\nImage: ${fileUrl}` : ''}

This design was created using the AI Visualizer tool.
`.trim()

    const noteResponse = await fetch(`${CRM_API_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': CRM_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: noteBody }),
    })

    if (!noteResponse.ok) {
      console.error('Failed to add note:', await noteResponse.text())
    }

    // Add tag to contact
    await fetch(`${CRM_API_BASE}/contacts/${contactId}/tags`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': CRM_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags: ['AI Visualizer', `Visualizer - ${projectType || 'Design'}`] }),
    })

    return NextResponse.json({
      success: true,
      fileUrl,
      message: 'Design saved successfully'
    })

  } catch (error) {
    console.error('Save image error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save image' },
      { status: 500 }
    )
  }
}
