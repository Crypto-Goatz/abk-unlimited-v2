/**
 * Lead Intelligence Skill - Scoring & Routing Engine
 *
 * The brain of the Lead Intelligence Skill. Analyzes incoming leads,
 * calculates scores, determines temperature, and routes to appropriate sequences.
 *
 * @package @rocketplus/skill-lead-intelligence
 */

import type {
  IncomingLead,
  LeadScore,
  LeadTemperature,
  ProcessedLead,
  ServiceConfig,
  LeadIntelligenceConfig,
  TemplateVariables,
  SequenceStep,
  SequenceExecution,
} from './types'

// ============================================================================
// NAME PARSING
// ============================================================================

export function parseName(fullName: string): { firstName: string; lastName?: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0] }
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  }
}

// ============================================================================
// SERVICE MATCHING
// ============================================================================

export function matchService(
  lead: IncomingLead,
  services: ServiceConfig[]
): ServiceConfig | null {
  // Direct service match
  if (lead.service) {
    const direct = services.find(
      (s) => s.name.toLowerCase() === lead.service?.toLowerCase() ||
             s.id === lead.service?.toLowerCase()
    )
    if (direct) return direct
  }

  // Check services array
  if (lead.services && lead.services.length > 0) {
    const firstMatch = services.find((s) =>
      lead.services?.some(
        (ls) => ls.toLowerCase().includes(s.id) ||
                s.keywords.some((k) => ls.toLowerCase().includes(k))
      )
    )
    if (firstMatch) return firstMatch
  }

  // Keyword matching in message
  if (lead.message) {
    const messageLower = lead.message.toLowerCase()

    // Check for emergency keywords first
    const emergency = services.find((s) => s.category === 'emergency')
    if (emergency && emergency.keywords.some((k) => messageLower.includes(k))) {
      return emergency
    }

    // Check other services
    for (const service of services) {
      if (service.keywords.some((k) => messageLower.includes(k))) {
        return service
      }
    }
  }

  // Default to general inquiry
  return services.find((s) => s.id === 'general') || null
}

// ============================================================================
// LEAD SCORING
// ============================================================================

export function scoreLead(
  lead: IncomingLead,
  config: LeadIntelligenceConfig
): LeadScore {
  const breakdown: LeadScore['breakdown'] = []
  let total = 0
  const { weights } = config.scoring

  // Base score
  total += 10
  breakdown.push({
    factor: 'Base',
    points: 10,
    reason: 'Lead submitted inquiry',
  })

  // Multiple services
  if (lead.services && lead.services.length > 1) {
    total += weights.multipleServices
    breakdown.push({
      factor: 'Multiple Services',
      points: weights.multipleServices,
      reason: `Interested in ${lead.services.length} services`,
    })
  }

  // Has timeline
  if (lead.projectTimeline) {
    const urgentTimelines = ['asap', 'immediately', 'this week', 'this month', '1 month', '1-3 months']
    const isUrgent = urgentTimelines.some((t) =>
      lead.projectTimeline?.toLowerCase().includes(t)
    )

    total += weights.hasTimeline
    breakdown.push({
      factor: 'Timeline Provided',
      points: weights.hasTimeline,
      reason: isUrgent ? 'Urgent timeline indicated' : 'Has project timeline',
    })

    if (isUrgent) {
      total += 10
      breakdown.push({
        factor: 'Urgent Timeline',
        points: 10,
        reason: `Timeline: ${lead.projectTimeline}`,
      })
    }
  }

  // Has budget
  if (lead.budget) {
    total += weights.hasBudget
    breakdown.push({
      factor: 'Budget Provided',
      points: weights.hasBudget,
      reason: `Budget range: ${lead.budget}`,
    })
  }

  // Has phone
  if (lead.phone && lead.phone.length >= 10) {
    total += weights.hasPhone
    breakdown.push({
      factor: 'Phone Provided',
      points: weights.hasPhone,
      reason: 'Valid phone number submitted',
    })
  }

  // Has address
  if (lead.address || (lead.city && lead.zipCode)) {
    total += weights.hasAddress
    breakdown.push({
      factor: 'Address Provided',
      points: weights.hasAddress,
      reason: 'Property location provided',
    })
  }

  // Urgent keywords in message
  if (lead.message) {
    const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediately', 'water damage', 'leak', 'broken', 'storm']
    const hasUrgent = urgentKeywords.some((k) => lead.message?.toLowerCase().includes(k))

    if (hasUrgent) {
      total += weights.urgentKeywords
      breakdown.push({
        factor: 'Urgent Keywords',
        points: weights.urgentKeywords,
        reason: 'Message contains urgency indicators',
      })
    }
  }

  // High-value service match
  const matchedService = matchService(lead, config.services)
  if (matchedService) {
    // Apply urgency multiplier
    const urgencyBonus = Math.round((matchedService.urgencyMultiplier - 1) * 20)
    if (urgencyBonus > 0) {
      total += urgencyBonus
      breakdown.push({
        factor: 'Service Urgency',
        points: urgencyBonus,
        reason: `${matchedService.name} is high-priority service`,
      })
    }

    // Apply seasonal boost
    const currentMonth = new Date().getMonth() + 1
    if (matchedService.seasonalBoost?.months.includes(currentMonth)) {
      const seasonalBonus = Math.round((matchedService.seasonalBoost.multiplier - 1) * 15)
      total += seasonalBonus
      breakdown.push({
        factor: 'Seasonal Demand',
        points: seasonalBonus,
        reason: `${matchedService.name} in peak season`,
      })
    }

    // High-value project
    if (matchedService.avgProjectValue >= 40000) {
      total += weights.highValueService
      breakdown.push({
        factor: 'High-Value Project',
        points: weights.highValueService,
        reason: `${matchedService.name} - avg value $${matchedService.avgProjectValue.toLocaleString()}`,
      })
    }
  }

  // Determine temperature
  const { rules } = config.scoring
  let temperature: LeadTemperature = 'cold'
  if (total >= rules.hot.minScore) {
    temperature = 'hot'
  } else if (total >= rules.warm.minScore) {
    temperature = 'warm'
  }

  // Generate recommended actions
  const recommendedActions: string[] = []

  if (temperature === 'hot') {
    recommendedActions.push('Call within 15 minutes')
    recommendedActions.push('Send personalized follow-up')
    recommendedActions.push('Add to priority queue')
  } else if (temperature === 'warm') {
    recommendedActions.push('Call within 24 hours')
    recommendedActions.push('Send welcome sequence')
  } else {
    recommendedActions.push('Add to nurture sequence')
    recommendedActions.push('Send resource materials')
  }

  return {
    total,
    temperature,
    breakdown,
    recommendedActions,
  }
}

// ============================================================================
// SEQUENCE SELECTION
// ============================================================================

export function selectSequence(
  score: LeadScore,
  service: ServiceConfig | null,
  config: LeadIntelligenceConfig
): string {
  // Emergency service always gets emergency sequence
  if (service?.category === 'emergency') {
    return 'emergency-sequence'
  }

  // Route by temperature
  switch (score.temperature) {
    case 'hot':
      return 'hot-lead-sequence'
    case 'warm':
      return 'warm-lead-sequence'
    case 'cold':
    default:
      return 'cold-lead-sequence'
  }
}

// ============================================================================
// TAG GENERATION
// ============================================================================

export function generateTags(
  lead: IncomingLead,
  score: LeadScore,
  service: ServiceConfig | null,
  config: LeadIntelligenceConfig
): string[] {
  const tags: string[] = []

  // Source tags
  tags.push('Website Lead')
  tags.push('ABK Website')

  if (lead.source) {
    tags.push(`Source: ${lead.source}`)
  }

  // Temperature tag
  tags.push(`Lead: ${score.temperature.charAt(0).toUpperCase() + score.temperature.slice(1)}`)

  // Service tags
  if (service) {
    tags.push(service.name)
    tags.push(`Category: ${service.category}`)
  }

  if (lead.services && lead.services.length > 0) {
    lead.services.forEach((s) => tags.push(s))
  }

  // Timeline tag
  if (lead.projectTimeline) {
    tags.push(`Timeline: ${lead.projectTimeline}`)
  }

  // Budget tag
  if (lead.budget) {
    tags.push(`Budget: ${lead.budget}`)
  }

  // Score tag
  tags.push(`Score: ${score.total}`)

  // Sequence tag
  const sequence = selectSequence(score, service, config)
  tags.push(`Sequence: ${sequence}`)

  return tags
}

// ============================================================================
// TEMPLATE VARIABLE RESOLUTION
// ============================================================================

export function resolveTemplateVariables(
  lead: IncomingLead,
  score: LeadScore,
  service: ServiceConfig | null,
  config: LeadIntelligenceConfig
): TemplateVariables {
  const { firstName, lastName } = parseName(lead.name)
  const hour = new Date().getHours()

  let timeOfDay: 'morning' | 'afternoon' | 'evening' = 'afternoon'
  if (hour < 12) timeOfDay = 'morning'
  else if (hour >= 17) timeOfDay = 'evening'

  const greetings = {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  return {
    // Contact
    firstName,
    lastName: lastName || '',
    fullName: lead.name,
    phone: lead.phone || '',
    email: lead.email,

    // Business
    businessName: config.business.name,
    businessPhone: config.business.phone,
    businessEmail: config.business.email,
    ownerName: config.business.ownerName,
    responseTimePromise: config.business.responseTimePromise,

    // Project
    serviceName: service?.name || 'home improvement',
    serviceList: lead.services?.join(', ') || service?.name || 'your project',
    timeline: lead.projectTimeline || 'your timeline',
    budget: lead.budget || 'your budget',

    // Dynamic
    dayOfWeek: days[tomorrow.getDay()],
    timeOfDay,
    greeting: greetings[timeOfDay],
  }
}

// ============================================================================
// TEMPLATE RENDERING
// ============================================================================

export function renderTemplate(template: string, variables: TemplateVariables): string {
  let result = template

  // Replace all {{variable}} patterns
  Object.entries(variables).forEach(([key, value]) => {
    const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    result = result.replace(pattern, value)
  })

  // Also handle {{score}} separately since it's not in variables
  result = result.replace(/\{\{score\}\}/g, '0') // Default, will be overridden

  return result
}

// ============================================================================
// SEQUENCE EXECUTION PLANNING
// ============================================================================

export function planSequenceExecution(
  sequenceId: string,
  variables: TemplateVariables,
  score: LeadScore,
  config: LeadIntelligenceConfig
): SequenceExecution[] {
  const sequence = config.sequences.find((s) => s.id === sequenceId)
  if (!sequence) return []

  const now = new Date()
  const executions: SequenceExecution[] = []

  for (const step of sequence.steps) {
    const scheduledFor = new Date(now.getTime() + step.delayMinutes * 60 * 1000)

    // Render the template with score
    let content = renderTemplate(step.template, variables)
    content = content.replace(/\{\{score\}\}/g, score.total.toString())

    executions.push({
      sequenceId,
      stepId: step.id,
      scheduledFor,
      channel: step.channel,
      content,
      status: 'pending',
    })
  }

  return executions
}

// ============================================================================
// MAIN PROCESSING FUNCTION
// ============================================================================

export function processLead(
  lead: IncomingLead,
  config: LeadIntelligenceConfig
): ProcessedLead {
  const { firstName, lastName } = parseName(lead.name)

  // Score the lead
  const score = scoreLead(lead, config)

  // Match primary service
  const primaryService = matchService(lead, config.services)

  // Select sequence
  const assignedSequence = selectSequence(score, primaryService, config)

  // Generate tags
  const tags = generateTags(lead, score, primaryService, config)

  return {
    original: lead,
    firstName,
    lastName,
    score,
    primaryService,
    assignedSequence,
    tags,
    receivedAt: new Date(),
    processedAt: new Date(),
  }
}

export default {
  parseName,
  matchService,
  scoreLead,
  selectSequence,
  generateTags,
  resolveTemplateVariables,
  renderTemplate,
  planSequenceExecution,
  processLead,
}
