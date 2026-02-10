/**
 * CRM API Integration
 * API base: https://services.leadconnectorhq.com
 */

const CRM_API_BASE = 'https://services.leadconnectorhq.com'
const CRM_API_VERSION = '2021-07-28'

interface CRMContactData {
  firstName: string
  lastName?: string
  email?: string
  phone?: string
  address1?: string
  city?: string
  state?: string
  postalCode?: string
  source?: string
  tags?: string[]
  customFields?: Array<{ key: string; value: string }>
}

interface CRMContact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  [key: string]: unknown
}

interface CRMError {
  message: string
  statusCode: number
}

/**
 * Create a contact in CRM
 */
export async function createCRMContact(data: CRMContactData): Promise<{ success: boolean; contact?: CRMContact; error?: string }> {
  const locationId = process.env.CRM_LOCATION_ID
  const apiKey = process.env.CRM_API_KEY

  if (!locationId || !apiKey) {
    console.error('CRM credentials not configured')
    return { success: false, error: 'CRM integration not configured' }
  }

  try {
    const response = await fetch(`${CRM_API_BASE}/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': CRM_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId,
        ...data,
      }),
    })

    if (!response.ok) {
      const errorData: CRMError = await response.json()
      console.error('CRM API error:', errorData)
      return { success: false, error: errorData.message || 'Failed to create contact' }
    }

    const result = await response.json()
    return { success: true, contact: result.contact }
  } catch (error) {
    console.error('CRM API request failed:', error)
    return { success: false, error: 'Failed to connect to CRM' }
  }
}

/**
 * Create an opportunity in CRM (for estimate requests)
 */
export async function createCRMOpportunity(
  contactId: string,
  data: {
    name: string
    pipelineId?: string
    pipelineStageId?: string
    monetaryValue?: number
    source?: string
  }
): Promise<{ success: boolean; opportunity?: unknown; error?: string }> {
  const locationId = process.env.CRM_LOCATION_ID
  const apiKey = process.env.CRM_API_KEY
  const pipelineId = process.env.CRM_PIPELINE_ID

  if (!locationId || !apiKey) {
    console.error('CRM credentials not configured')
    return { success: false, error: 'CRM integration not configured' }
  }

  try {
    const response = await fetch(`${CRM_API_BASE}/opportunities/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': CRM_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId,
        contactId,
        pipelineId: data.pipelineId || pipelineId,
        pipelineStageId: data.pipelineStageId,
        name: data.name,
        monetaryValue: data.monetaryValue,
        source: data.source,
        status: 'open',
      }),
    })

    if (!response.ok) {
      const errorData: CRMError = await response.json()
      console.error('CRM API error:', errorData)
      return { success: false, error: errorData.message || 'Failed to create opportunity' }
    }

    const result = await response.json()
    return { success: true, opportunity: result.opportunity }
  } catch (error) {
    console.error('CRM API request failed:', error)
    return { success: false, error: 'Failed to connect to CRM' }
  }
}

/**
 * Add a note to a contact in CRM
 */
export async function addCRMNote(
  contactId: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.CRM_API_KEY

  if (!apiKey) {
    console.error('CRM credentials not configured')
    return { success: false, error: 'CRM integration not configured' }
  }

  try {
    const response = await fetch(`${CRM_API_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': CRM_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body }),
    })

    if (!response.ok) {
      const errorData: CRMError = await response.json()
      console.error('CRM API error:', errorData)
      return { success: false, error: errorData.message || 'Failed to add note' }
    }

    return { success: true }
  } catch (error) {
    console.error('CRM API request failed:', error)
    return { success: false, error: 'Failed to connect to CRM' }
  }
}

/**
 * Add tags to a contact in CRM
 */
export async function addCRMTags(
  contactId: string,
  tags: string[]
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.CRM_API_KEY

  if (!apiKey) {
    console.error('CRM credentials not configured')
    return { success: false, error: 'CRM integration not configured' }
  }

  try {
    const response = await fetch(`${CRM_API_BASE}/contacts/${contactId}/tags`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': CRM_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags }),
    })

    if (!response.ok) {
      const errorData: CRMError = await response.json()
      console.error('CRM API error:', errorData)
      return { success: false, error: errorData.message || 'Failed to add tags' }
    }

    return { success: true }
  } catch (error) {
    console.error('CRM API request failed:', error)
    return { success: false, error: 'Failed to connect to CRM' }
  }
}

/**
 * Send an SMS message to a contact
 */
export async function sendCRMSMS(
  contactId: string,
  message: string
): Promise<{ success: boolean; conversationId?: string; messageId?: string; error?: string }> {
  const apiKey = process.env.CRM_API_KEY

  if (!apiKey) {
    console.error('CRM credentials not configured')
    return { success: false, error: 'CRM integration not configured' }
  }

  try {
    const response = await fetch(`${CRM_API_BASE}/conversations/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': CRM_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'SMS',
        contactId,
        message,
      }),
    })

    if (!response.ok) {
      const errorData: CRMError = await response.json()
      console.error('CRM SMS error:', errorData)
      return { success: false, error: errorData.message || 'Failed to send SMS' }
    }

    const result = await response.json()
    return {
      success: true,
      conversationId: result.conversationId,
      messageId: result.messageId
    }
  } catch (error) {
    console.error('CRM SMS request failed:', error)
    return { success: false, error: 'Failed to connect to CRM' }
  }
}
