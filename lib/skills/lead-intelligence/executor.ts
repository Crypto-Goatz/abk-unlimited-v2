/**
 * Lead Intelligence Skill - Sequence Executor
 *
 * Executes the planned sequence steps by integrating with CRM APIs.
 * Handles SMS sending, email delivery, task creation, and notes.
 *
 * @package @rocketplus/skill-lead-intelligence
 */

import type {
  ProcessedLead,
  LeadIntelligenceConfig,
  LeadIntelligenceResult,
  SequenceExecution,
  TemplateVariables,
} from './types'
import {
  resolveTemplateVariables,
  planSequenceExecution,
  renderTemplate,
} from './engine'

const CRM_API_BASE = 'https://services.leadconnectorhq.com'
const CRM_API_VERSION = '2021-07-28'

// ============================================================================
// CRM API HELPERS
// ============================================================================

async function crmRequest(
  endpoint: string,
  method: string = 'GET',
  body?: object
): Promise<{ success: boolean; data?: any; error?: string }> {
  const apiKey = process.env.CRM_API_KEY

  if (!apiKey) {
    return { success: false, error: 'CRM API key not configured' }
  }

  try {
    const response = await fetch(`${CRM_API_BASE}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': CRM_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.message || 'CRM API error' }
    }

    return { success: true, data }
  } catch (error) {
    console.error('CRM API request failed:', error)
    return { success: false, error: 'Failed to connect to CRM' }
  }
}

// ============================================================================
// CONTACT CREATION
// ============================================================================

async function createContact(
  lead: ProcessedLead,
  config: LeadIntelligenceConfig
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const result = await crmRequest('/contacts/', 'POST', {
    locationId: config.crm.locationId,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.original.email,
    phone: lead.original.phone,
    address1: lead.original.address,
    city: lead.original.city,
    state: lead.original.state,
    postalCode: lead.original.zipCode,
    source: lead.original.source || 'Website - Lead Form',
    tags: lead.tags,
  })

  if (result.success && result.data?.contact?.id) {
    return { success: true, contactId: result.data.contact.id }
  }

  return { success: false, error: result.error }
}

// ============================================================================
// OPPORTUNITY CREATION
// ============================================================================

async function createOpportunity(
  contactId: string,
  lead: ProcessedLead,
  config: LeadIntelligenceConfig
): Promise<{ success: boolean; opportunityId?: string; error?: string }> {
  const serviceName = lead.primaryService?.name || 'General Inquiry'
  const services = lead.original.services?.join(', ') || serviceName

  const result = await crmRequest('/opportunities/', 'POST', {
    locationId: config.crm.locationId,
    contactId,
    pipelineId: config.crm.pipelineId,
    pipelineStageId: config.crm.stages.newLead,
    name: `${lead.original.name} - ${services}`,
    source: lead.original.source || 'Website',
    status: 'open',
    monetaryValue: lead.primaryService?.avgProjectValue,
  })

  if (result.success && result.data?.opportunity?.id) {
    return { success: true, opportunityId: result.data.opportunity.id }
  }

  return { success: false, error: result.error }
}

// ============================================================================
// NOTE CREATION
// ============================================================================

async function addNote(
  contactId: string,
  lead: ProcessedLead,
  config: LeadIntelligenceConfig
): Promise<{ success: boolean; error?: string }> {
  const noteLines = [
    '**Lead Intelligence Report**',
    '',
    `**Score:** ${lead.score.total} (${lead.score.temperature.toUpperCase()})`,
    `**Sequence:** ${lead.assignedSequence}`,
    '',
    '**Score Breakdown:**',
    ...lead.score.breakdown.map((b) => `- ${b.factor}: +${b.points} (${b.reason})`),
    '',
    '**Recommended Actions:**',
    ...lead.score.recommendedActions.map((a) => `- ${a}`),
    '',
    '---',
    '',
    '**Original Submission:**',
  ]

  if (lead.original.services && lead.original.services.length > 0) {
    noteLines.push(`Services: ${lead.original.services.join(', ')}`)
  } else if (lead.original.service) {
    noteLines.push(`Service: ${lead.original.service}`)
  }

  if (lead.original.address) noteLines.push(`Address: ${lead.original.address}`)
  if (lead.original.city) noteLines.push(`City: ${lead.original.city}`)
  if (lead.original.zipCode) noteLines.push(`Zip: ${lead.original.zipCode}`)
  if (lead.original.projectTimeline) noteLines.push(`Timeline: ${lead.original.projectTimeline}`)
  if (lead.original.budget) noteLines.push(`Budget: ${lead.original.budget}`)
  if (lead.original.message) noteLines.push(`Message: ${lead.original.message}`)

  const result = await crmRequest(`/contacts/${contactId}/notes`, 'POST', {
    body: noteLines.join('\n'),
  })

  return { success: result.success, error: result.error }
}

// ============================================================================
// SMS SENDING
// ============================================================================

async function sendSMS(
  contactId: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const result = await crmRequest('/conversations/messages', 'POST', {
    type: 'SMS',
    contactId,
    message,
  })

  if (result.success) {
    return { success: true, messageId: result.data?.messageId }
  }

  return { success: false, error: result.error }
}

// ============================================================================
// TASK CREATION
// ============================================================================

async function createTask(
  contactId: string,
  title: string,
  dueDate: Date,
  config: LeadIntelligenceConfig
): Promise<{ success: boolean; taskId?: string; error?: string }> {
  const result = await crmRequest('/contacts/' + contactId + '/tasks', 'POST', {
    title,
    dueDate: dueDate.toISOString(),
    completed: false,
  })

  if (result.success) {
    return { success: true, taskId: result.data?.task?.id }
  }

  return { success: false, error: result.error }
}

// ============================================================================
// IMMEDIATE STEP EXECUTION
// ============================================================================

async function executeImmediateSteps(
  contactId: string,
  lead: ProcessedLead,
  variables: TemplateVariables,
  executions: SequenceExecution[],
  config: LeadIntelligenceConfig
): Promise<{
  smsSent: boolean
  tasksCreated: string[]
  errors: string[]
}> {
  const result = {
    smsSent: false,
    tasksCreated: [] as string[],
    errors: [] as string[],
  }

  // Only execute immediate steps (delay = 0)
  const immediateSteps = executions.filter(
    (e) => e.scheduledFor.getTime() <= Date.now() + 60000 // Within 1 minute
  )

  for (const step of immediateSteps) {
    try {
      switch (step.channel) {
        case 'sms':
          if (config.features.autoSms && lead.original.phone) {
            const smsResult = await sendSMS(contactId, step.content)
            if (smsResult.success) {
              result.smsSent = true
              step.status = 'sent'
            } else {
              step.status = 'failed'
              result.errors.push(`SMS failed: ${smsResult.error}`)
            }
          } else {
            step.status = 'skipped'
          }
          break

        case 'call_task':
          if (config.features.createTasks) {
            const taskResult = await createTask(
              contactId,
              step.content,
              step.scheduledFor,
              config
            )
            if (taskResult.success) {
              result.tasksCreated.push(step.stepId)
              step.status = 'sent'
            } else {
              step.status = 'failed'
              result.errors.push(`Task creation failed: ${taskResult.error}`)
            }
          }
          break

        case 'internal_note':
          await addNote(contactId, lead, config)
          step.status = 'sent'
          break

        case 'email':
          // Email would be handled by CRM workflow or separate integration
          step.status = 'pending'
          break
      }
    } catch (error) {
      step.status = 'failed'
      result.errors.push(`Step ${step.stepId} failed: ${error}`)
    }
  }

  return result
}

// ============================================================================
// MAIN EXECUTION FUNCTION
// ============================================================================

export async function executeLeadIntelligence(
  lead: ProcessedLead,
  config: LeadIntelligenceConfig
): Promise<LeadIntelligenceResult> {
  const errors: string[] = []
  const result: LeadIntelligenceResult = {
    success: false,
    lead,
    actions: {
      contactCreated: false,
      opportunityCreated: false,
      sequenceStarted: false,
      immediateSmsSent: false,
      tasksCreated: [],
    },
    nextSteps: [],
    errors,
  }

  try {
    // 1. Create contact
    const contactResult = await createContact(lead, config)
    if (!contactResult.success) {
      errors.push(`Contact creation failed: ${contactResult.error}`)
      return result
    }

    const contactId = contactResult.contactId!
    lead.crmContactId = contactId
    result.actions.contactCreated = true

    // 2. Create opportunity
    const oppResult = await createOpportunity(contactId, lead, config)
    if (oppResult.success) {
      lead.crmOpportunityId = oppResult.opportunityId
      result.actions.opportunityCreated = true
    } else {
      errors.push(`Opportunity creation failed: ${oppResult.error}`)
    }

    // 3. Add intelligence note
    await addNote(contactId, lead, config)

    // 4. Resolve template variables
    const variables = resolveTemplateVariables(
      lead.original,
      lead.score,
      lead.primaryService,
      config
    )

    // 5. Plan sequence execution
    const executions = planSequenceExecution(
      lead.assignedSequence,
      variables,
      lead.score,
      config
    )
    result.nextSteps = executions

    // 6. Execute immediate steps
    const execResult = await executeImmediateSteps(
      contactId,
      lead,
      variables,
      executions,
      config
    )

    result.actions.immediateSmsSent = execResult.smsSent
    result.actions.tasksCreated = execResult.tasksCreated
    result.actions.sequenceStarted = execResult.smsSent || execResult.tasksCreated.length > 0
    errors.push(...execResult.errors)

    // Mark overall success
    result.success = result.actions.contactCreated

  } catch (error) {
    errors.push(`Execution error: ${error}`)
  }

  result.errors = errors
  return result
}

export default executeLeadIntelligence
