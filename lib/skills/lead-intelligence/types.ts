/**
 * Lead Intelligence Skill - Type Definitions
 *
 * A Rocket+ Skill for intelligent lead scoring, routing, and automated follow-up.
 * Drop-in ready for any home services business.
 *
 * @package @rocketplus/skill-lead-intelligence
 * @version 1.0.0
 */

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface BusinessConfig {
  name: string
  phone: string
  email: string
  website: string
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  ownerName: string
  license?: string
  tagline?: string
  responseTimePromise: string // e.g., "within 24 hours"
}

export interface ServiceConfig {
  id: string
  name: string
  category: 'interior' | 'exterior' | 'emergency' | 'consultation'
  urgencyMultiplier: number // 1.0 = normal, 1.5 = urgent, 2.0 = emergency
  avgProjectValue: number
  keywords: string[]
  seasonalBoost?: {
    months: number[] // 1-12
    multiplier: number
  }
}

export interface ScoringRules {
  hot: {
    minScore: number
    conditions: string[] // Human-readable for config UI
  }
  warm: {
    minScore: number
    conditions: string[]
  }
  cold: {
    minScore: number
    conditions: string[]
  }
}

export interface SequenceStep {
  id: string
  channel: 'sms' | 'email' | 'call_task' | 'internal_note'
  delayMinutes: number
  template: string
  subject?: string // For emails
  conditions?: {
    onlyIf?: string[] // Tags that must be present
    skipIf?: string[] // Tags that skip this step
  }
}

export interface SequenceConfig {
  id: string
  name: string
  description: string
  trigger: 'new_lead' | 'no_response' | 'post_estimate' | 'post_completion'
  steps: SequenceStep[]
}

export interface LeadIntelligenceConfig {
  // Skill metadata
  skillId: string
  skillVersion: string

  // Business configuration
  business: BusinessConfig

  // Services offered
  services: ServiceConfig[]

  // Scoring configuration
  scoring: {
    rules: ScoringRules
    weights: {
      multipleServices: number
      hasTimeline: number
      hasBudget: number
      hasPhone: number
      hasAddress: number
      urgentKeywords: number
      highValueService: number
    }
  }

  // Automated sequences
  sequences: SequenceConfig[]

  // CRM Integration
  crm: {
    locationId: string
    pipelineId: string
    stages: {
      newLead: string
      contacted: string
      qualified: string
      proposalSent: string
      closed: string
    }
  }

  // Feature flags
  features: {
    autoSms: boolean
    autoEmail: boolean
    createTasks: boolean
    aiPersonalization: boolean
  }
}

// ============================================================================
// LEAD TYPES
// ============================================================================

export interface IncomingLead {
  // Contact info
  name: string
  email: string
  phone?: string

  // Location
  address?: string
  city?: string
  state?: string
  zipCode?: string

  // Project details
  service?: string
  services?: string[]
  message?: string
  projectTimeline?: string
  budget?: string

  // Tracking
  source?: string
  landingPage?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

export type LeadTemperature = 'hot' | 'warm' | 'cold'

export interface LeadScore {
  total: number
  temperature: LeadTemperature
  breakdown: {
    factor: string
    points: number
    reason: string
  }[]
  recommendedActions: string[]
}

export interface ProcessedLead {
  // Original data
  original: IncomingLead

  // Parsed data
  firstName: string
  lastName?: string

  // Scoring
  score: LeadScore

  // Routing
  primaryService: ServiceConfig | null
  assignedSequence: string
  tags: string[]

  // CRM data
  crmContactId?: string
  crmOpportunityId?: string

  // Timestamps
  receivedAt: Date
  processedAt: Date
}

// ============================================================================
// ENGINE TYPES
// ============================================================================

export interface SequenceExecution {
  sequenceId: string
  stepId: string
  scheduledFor: Date
  channel: SequenceStep['channel']
  content: string
  status: 'pending' | 'sent' | 'failed' | 'skipped'
}

export interface LeadIntelligenceResult {
  success: boolean
  lead: ProcessedLead
  actions: {
    contactCreated: boolean
    opportunityCreated: boolean
    sequenceStarted: boolean
    immediateSmsSent: boolean
    tasksCreated: string[]
  }
  nextSteps: SequenceExecution[]
  errors: string[]
}

// ============================================================================
// TEMPLATE VARIABLE TYPES
// ============================================================================

export interface TemplateVariables {
  // Contact
  firstName: string
  lastName: string
  fullName: string
  phone: string
  email: string

  // Business
  businessName: string
  businessPhone: string
  businessEmail: string
  ownerName: string
  responseTimePromise: string

  // Project
  serviceName: string
  serviceList: string
  timeline: string
  budget: string

  // Dynamic
  dayOfWeek: string
  timeOfDay: 'morning' | 'afternoon' | 'evening'
  greeting: string
}
