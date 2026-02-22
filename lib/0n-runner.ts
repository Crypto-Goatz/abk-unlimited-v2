/**
 * 0n Runner — Lightweight .0n SWITCH File Executor
 *
 * Runs .0n workflow files by making HTTP calls to the appropriate service APIs.
 * This is the client-side counterpart to 0nMCP's WorkflowRunner.
 *
 * For projects deployed on Vercel, this handles:
 * - Loading .0n workflow definitions
 * - Executing steps sequentially (respecting conditions)
 * - Resolving {{template}} variables
 * - Deploying CRM dependencies (tags, custom values)
 * - Logging execution results
 *
 * Standard for every RocketOpp project.
 */

// ─── Types ───────────────────────────────────────────────────────────

interface WorkflowDef {
  $0n: {
    type: 'workflow'
    version: string
    name: string
    description?: string
  }
  trigger?: {
    type: string
    config?: Record<string, unknown>
  }
  inputs?: Record<string, {
    type: string
    required?: boolean
    default?: unknown
    description?: string
  }>
  steps: WorkflowStep[]
  outputs?: Record<string, unknown>
  dependencies?: {
    crm_tags?: string[]
    crm_custom_values?: Record<string, string>
    env_vars?: string[]
  }
  error_handling?: {
    on_error: 'stop' | 'continue'
    retry_count?: number
    retry_delay_ms?: number
  }
}

interface WorkflowStep {
  id: string
  name: string
  service: string
  action: string
  params: Record<string, unknown>
  output: string
  conditions?: Array<{ if: string }>
  schedule?: {
    delay_minutes: number
    from: string
  }
}

interface ExecutionResult {
  workflowName: string
  executionId: string
  status: 'completed' | 'failed' | 'partial'
  stepsRun: number
  stepsSkipped: number
  stepsFailed: number
  duration_ms: number
  outputs: Record<string, unknown>
  stepResults: Array<{
    id: string
    name: string
    status: 'success' | 'skipped' | 'failed'
    output?: unknown
    error?: string
    duration_ms: number
  }>
}

// ─── CRM API Caller ──────────────────────────────────────────────────

const CRM_API = 'https://services.leadconnectorhq.com'
const CRM_VERSION = '2021-07-28'

async function callCRM(
  action: string,
  params: Record<string, unknown>,
  apiKey: string
): Promise<unknown> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Version: CRM_VERSION,
    'Content-Type': 'application/json',
  }

  // Map action strings to CRM API endpoints
  const actionMap: Record<string, { method: string; path: (p: Record<string, unknown>) => string; body?: (p: Record<string, unknown>) => unknown }> = {
    'contacts.addTag': {
      method: 'POST',
      path: (p) => `/contacts/${p.contactId}`,
      body: (p) => ({ tags: p.tags }),
    },
    'contacts.removeTag': {
      method: 'DELETE',
      path: (p) => `/contacts/${p.contactId}/tags`,
      body: (p) => ({ tags: p.tags }),
    },
    'conversations.sendEmail': {
      method: 'POST',
      path: () => '/conversations/messages',
      body: (p) => ({
        type: 'Email',
        contactId: p.contactId,
        subject: p.subject,
        html: p.html,
        emailFrom: p.emailFrom || 'info@abkunlimited.com',
      }),
    },
    'contacts.search': {
      method: 'GET',
      path: (p) => `/contacts/search?locationId=${p.locationId}&query=${encodeURIComponent(String(p.email || p.phone || ''))}`,
    },
    'contacts.upsert': {
      method: 'POST',
      path: () => '/contacts/upsert',
      body: (p) => p,
    },
    'contacts.createTask': {
      method: 'POST',
      path: (p) => `/contacts/${p.contactId}/tasks`,
      body: (p) => ({
        title: p.title,
        description: p.description,
        dueDate: p.dueDate,
        assignedTo: p.assignedTo,
      }),
    },
    'contacts.addToWorkflow': {
      method: 'POST',
      path: (p) => `/contacts/${p.contactId}/workflow/${p.workflowId}`,
    },
  }

  const mapping = actionMap[action]
  if (!mapping) {
    console.warn(`[0n-runner] Unknown CRM action: ${action}`)
    return { error: `Unknown action: ${action}` }
  }

  const url = `${CRM_API}${mapping.path(params)}`
  const fetchOpts: RequestInit = {
    method: mapping.method,
    headers,
  }

  if (mapping.body && mapping.method !== 'GET') {
    fetchOpts.body = JSON.stringify(mapping.body(params))
  }

  const res = await fetch(url, fetchOpts)
  if (!res.ok) {
    const err = await res.text().catch(() => '')
    throw new Error(`CRM ${action} failed (${res.status}): ${err}`)
  }

  return res.json().catch(() => ({ ok: true }))
}

// ─── SendGrid Caller ─────────────────────────────────────────────────

async function callSendGrid(
  action: string,
  params: Record<string, unknown>
): Promise<unknown> {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) return { skipped: true, reason: 'SENDGRID_API_KEY not set' }

  if (action === 'mail.send') {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: params.to }] }],
        from: { email: params.from || 'info@abkunlimited.com', name: params.fromName || 'ABK Unlimited' },
        subject: params.subject,
        content: [{ type: 'text/html', value: params.html }],
        tracking_settings: {
          click_tracking: { enable: params.trackClicks !== false },
          open_tracking: { enable: params.trackOpens !== false },
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text().catch(() => '')
      throw new Error(`SendGrid failed (${res.status}): ${err}`)
    }

    return { sent: true }
  }

  return { error: `Unknown SendGrid action: ${action}` }
}

// ─── Template Resolver ───────────────────────────────────────────────

function resolveTemplate(
  template: unknown,
  context: Record<string, unknown>
): unknown {
  if (template === null || template === undefined) return template
  if (Array.isArray(template)) return template.map((item) => resolveTemplate(item, context))
  if (typeof template === 'object') {
    const result: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(template as Record<string, unknown>)) {
      result[k] = resolveTemplate(v, context)
    }
    return result
  }
  if (typeof template !== 'string') return template

  // Single expression: {{ref}} returns raw value
  const singleMatch = template.match(/^\{\{(.+?)\}\}$/)
  if (singleMatch) return resolveRef(singleMatch[1].trim(), context)

  // Inline expressions: "Hello {{inputs.firstName}}" returns string
  return template.replace(/\{\{(.+?)\}\}/g, (_, expr) => {
    const val = resolveRef(expr.trim(), context)
    return val == null ? '' : String(val)
  })
}

function resolveRef(ref: string, ctx: Record<string, unknown>): unknown {
  if (ref === 'now') return new Date().toISOString()
  if (ref.startsWith('env.')) return deepGet(process.env, ref.slice(4))
  if (ref.startsWith('inputs.')) return deepGet(ctx.inputs, ref.slice(7))
  // Check step outputs
  const val = deepGet(ctx.steps, ref)
  if (val !== undefined) return val
  return deepGet(ctx, ref)
}

function deepGet(obj: unknown, path: string): unknown {
  if (!obj || !path) return undefined
  const segs = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let cur: unknown = obj
  for (const s of segs) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[s]
  }
  return cur
}

// ─── Workflow Executor ───────────────────────────────────────────────

export async function executeWorkflow(
  workflow: WorkflowDef,
  inputs: Record<string, unknown>
): Promise<ExecutionResult> {
  const start = Date.now()
  const executionId = `wf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const crmApiKey = process.env.CRM_API_KEY || process.env.CRM_PIT

  const context: Record<string, unknown> = {
    inputs,
    steps: {},
    env: process.env,
  }

  const stepResults: ExecutionResult['stepResults'] = []
  let stepsRun = 0
  let stepsSkipped = 0
  let stepsFailed = 0

  // Validate required inputs
  if (workflow.inputs) {
    for (const [key, schema] of Object.entries(workflow.inputs)) {
      if (schema.required && (inputs[key] === undefined || inputs[key] === null)) {
        if (schema.default !== undefined) {
          inputs[key] = schema.default
        } else {
          return {
            workflowName: workflow.$0n.name,
            executionId,
            status: 'failed',
            stepsRun: 0,
            stepsSkipped: 0,
            stepsFailed: 1,
            duration_ms: Date.now() - start,
            outputs: {},
            stepResults: [{
              id: '_validation',
              name: 'Input Validation',
              status: 'failed',
              error: `Missing required input: ${key}`,
              duration_ms: 0,
            }],
          }
        }
      }
    }
  }

  const retryCount = workflow.error_handling?.retry_count || 0
  const retryDelay = workflow.error_handling?.retry_delay_ms || 1000
  const onError = workflow.error_handling?.on_error || 'continue'

  for (const step of workflow.steps) {
    const stepStart = Date.now()

    // Check conditions
    if (step.conditions) {
      const conditionMet = step.conditions.every((cond) => {
        const val = resolveTemplate(cond.if, context)
        return Boolean(val) && val !== 'false' && val !== '0'
      })

      if (!conditionMet) {
        stepsSkipped++
        stepResults.push({
          id: step.id,
          name: step.name,
          status: 'skipped',
          duration_ms: 0,
        })
        continue
      }
    }

    // Skip scheduled steps (handled by cron)
    if (step.schedule) {
      stepsSkipped++
      stepResults.push({
        id: step.id,
        name: step.name,
        status: 'skipped',
        output: { reason: 'Scheduled step — handled by cron' },
        duration_ms: 0,
      })
      continue
    }

    // Skip internal wait steps
    if (step.service === 'internal') {
      stepsSkipped++
      stepResults.push({
        id: step.id,
        name: step.name,
        status: 'skipped',
        output: { reason: 'Internal action — wait/set' },
        duration_ms: 0,
      })
      continue
    }

    // Resolve params
    const resolvedParams = resolveTemplate(step.params, context) as Record<string, unknown>

    // Execute with retry
    let lastError: string | undefined
    let result: unknown

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        if (step.service === 'crm' && crmApiKey) {
          result = await callCRM(step.action, resolvedParams, crmApiKey)
        } else if (step.service === 'sendgrid') {
          result = await callSendGrid(step.action, resolvedParams)
        } else if (step.service === 'google_sheets') {
          // Google Sheets handled by existing lib
          result = { delegated: true, note: 'Handled by lib/google/sheets' }
        } else {
          result = { skipped: true, reason: `Service ${step.service} not configured in runner` }
        }
        lastError = undefined
        break
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err)
        if (attempt < retryCount) {
          await new Promise((r) => setTimeout(r, retryDelay * (attempt + 1)))
        }
      }
    }

    if (lastError) {
      stepsFailed++
      stepResults.push({
        id: step.id,
        name: step.name,
        status: 'failed',
        error: lastError,
        duration_ms: Date.now() - stepStart,
      })

      // Store error in context
      ;(context.steps as Record<string, unknown>)[step.output] = { error: lastError }

      if (onError === 'stop') break
    } else {
      stepsRun++
      stepResults.push({
        id: step.id,
        name: step.name,
        status: 'success',
        output: result,
        duration_ms: Date.now() - stepStart,
      })

      // Store result in context
      ;(context.steps as Record<string, unknown>)[step.output] = result
    }
  }

  // Resolve outputs
  const outputs = workflow.outputs
    ? (resolveTemplate(workflow.outputs, context) as Record<string, unknown>)
    : {}

  const status = stepsFailed === 0
    ? 'completed'
    : stepsRun > 0
      ? 'partial'
      : 'failed'

  console.log(
    `[0n-runner] ${workflow.$0n.name} — ${status} (${stepsRun} run, ${stepsSkipped} skipped, ${stepsFailed} failed) in ${Date.now() - start}ms`
  )

  return {
    workflowName: workflow.$0n.name,
    executionId,
    status,
    stepsRun,
    stepsSkipped,
    stepsFailed,
    duration_ms: Date.now() - start,
    outputs,
    stepResults,
  }
}

// ─── Deploy Dependencies ─────────────────────────────────────────────

/**
 * Deploy CRM dependencies (tags + custom values) defined in a .0n workflow.
 * Call this once during project setup or on first deploy.
 */
export async function deployDependencies(workflow: WorkflowDef): Promise<{
  tags: Array<{ name: string; status: string }>
  customValues: Array<{ name: string; status: string }>
}> {
  const apiKey = process.env.CRM_API_KEY || process.env.CRM_PIT
  const locationId = process.env.CRM_LOCATION_ID
  if (!apiKey || !locationId) {
    return { tags: [], customValues: [] }
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Version: CRM_VERSION,
    'Content-Type': 'application/json',
  }

  const tags: Array<{ name: string; status: string }> = []
  const customValues: Array<{ name: string; status: string }> = []

  // Create tags
  if (workflow.dependencies?.crm_tags) {
    for (const tag of workflow.dependencies.crm_tags) {
      try {
        const res = await fetch(`${CRM_API}/locations/${locationId}/tags`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ name: tag }),
        })
        tags.push({ name: tag, status: res.ok ? 'created' : 'exists' })
      } catch {
        tags.push({ name: tag, status: 'error' })
      }
    }
  }

  // Create custom values
  if (workflow.dependencies?.crm_custom_values) {
    for (const [name, value] of Object.entries(workflow.dependencies.crm_custom_values)) {
      try {
        const res = await fetch(`${CRM_API}/locations/${locationId}/customValues`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ name, value }),
        })
        customValues.push({ name, status: res.ok ? 'created' : 'exists' })
      } catch {
        customValues.push({ name, status: 'error' })
      }
    }
  }

  return { tags, customValues }
}
