/**
 * Lead Intelligence Skill
 *
 * A Rocket+ Skill for intelligent lead scoring, routing, and automated follow-up.
 * Drop-in ready for any home services business.
 *
 * USAGE:
 * ```typescript
 * import { LeadIntelligence } from '@/lib/skills/lead-intelligence'
 *
 * // Process and execute
 * const result = await LeadIntelligence.process(leadData)
 *
 * // Or step by step
 * const processed = LeadIntelligence.analyze(leadData)
 * const result = await LeadIntelligence.execute(processed)
 * ```
 *
 * CONFIGURATION:
 * Edit `config.ts` to customize for your business:
 * - Business details (name, phone, owner)
 * - Services offered with scoring weights
 * - Automated SMS/email sequences
 * - CRM integration settings
 *
 * @package @rocketplus/skill-lead-intelligence
 * @version 1.0.0
 */

// Types
export type {
  BusinessConfig,
  ServiceConfig,
  ScoringRules,
  SequenceStep,
  SequenceConfig,
  LeadIntelligenceConfig,
  IncomingLead,
  LeadTemperature,
  LeadScore,
  ProcessedLead,
  SequenceExecution,
  LeadIntelligenceResult,
  TemplateVariables,
} from './types'

// Configuration
export { config, default as defaultConfig } from './config'

// Engine functions
export {
  parseName,
  matchService,
  scoreLead,
  selectSequence,
  generateTags,
  resolveTemplateVariables,
  renderTemplate,
  planSequenceExecution,
  processLead,
} from './engine'

// Executor
export { executeLeadIntelligence } from './executor'

// ============================================================================
// MAIN SKILL INTERFACE
// ============================================================================

import { config } from './config'
import { processLead } from './engine'
import { executeLeadIntelligence } from './executor'
import type { IncomingLead, ProcessedLead, LeadIntelligenceResult } from './types'

/**
 * Lead Intelligence Skill - Main Interface
 *
 * Provides a clean API for processing and executing lead intelligence.
 */
export const LeadIntelligence = {
  /**
   * Get the current configuration
   */
  getConfig: () => config,

  /**
   * Analyze a lead without executing actions
   * Useful for previewing scores and sequence selection
   */
  analyze: (lead: IncomingLead): ProcessedLead => {
    return processLead(lead, config)
  },

  /**
   * Execute lead intelligence on an already-processed lead
   */
  execute: async (processed: ProcessedLead): Promise<LeadIntelligenceResult> => {
    return executeLeadIntelligence(processed, config)
  },

  /**
   * Process and execute in one call
   * This is the main entry point for most use cases
   */
  process: async (lead: IncomingLead): Promise<LeadIntelligenceResult> => {
    const processed = processLead(lead, config)
    return executeLeadIntelligence(processed, config)
  },

  /**
   * Get a human-readable summary of a processed lead
   */
  summarize: (processed: ProcessedLead): string => {
    const lines = [
      `Lead: ${processed.original.name}`,
      `Score: ${processed.score.total} (${processed.score.temperature.toUpperCase()})`,
      `Service: ${processed.primaryService?.name || 'General'}`,
      `Sequence: ${processed.assignedSequence}`,
      '',
      'Score Breakdown:',
      ...processed.score.breakdown.map((b) => `  - ${b.factor}: +${b.points}`),
      '',
      'Tags:',
      ...processed.tags.map((t) => `  - ${t}`),
    ]
    return lines.join('\n')
  },
}

export default LeadIntelligence
