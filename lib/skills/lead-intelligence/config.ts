/**
 * Lead Intelligence Skill - ABK Unlimited Configuration
 *
 * This configuration file defines the business-specific settings for the
 * Lead Intelligence Skill. To use this skill for another business:
 * 1. Copy this file
 * 2. Update the business, services, and sequences
 * 3. Configure CRM integration IDs
 *
 * @package @rocketplus/skill-lead-intelligence
 */

import type { LeadIntelligenceConfig } from './types'

export const config: LeadIntelligenceConfig = {
  // ============================================================================
  // SKILL METADATA
  // ============================================================================
  skillId: 'lead-intelligence-abk',
  skillVersion: '1.0.0',

  // ============================================================================
  // BUSINESS CONFIGURATION
  // ============================================================================
  business: {
    name: 'ABK Unlimited',
    phone: '(412) 944-1683',
    email: 'abk.unlimited@gmail.com',
    website: 'https://abkunlimited.com',
    address: {
      street: '138 Balver Ave',
      city: 'Pittsburgh',
      state: 'PA',
      zip: '15205',
    },
    ownerName: 'Audrey',
    license: 'PA163301',
    tagline: "Pittsburgh's Trusted General Contractor",
    responseTimePromise: 'within 24 hours',
  },

  // ============================================================================
  // SERVICES CONFIGURATION
  // ============================================================================
  services: [
    {
      id: 'roofing',
      name: 'Roofing',
      category: 'exterior',
      urgencyMultiplier: 1.5, // Weather-dependent, often urgent
      avgProjectValue: 12000,
      keywords: ['roof', 'roofing', 'shingles', 'leak', 'gutter'],
      seasonalBoost: {
        months: [3, 4, 5, 9, 10, 11], // Spring & Fall
        multiplier: 1.3,
      },
    },
    {
      id: 'kitchen',
      name: 'Kitchen Remodeling',
      category: 'interior',
      urgencyMultiplier: 1.0,
      avgProjectValue: 45000,
      keywords: ['kitchen', 'cabinets', 'countertops', 'island'],
    },
    {
      id: 'bathroom',
      name: 'Bathroom Remodeling',
      category: 'interior',
      urgencyMultiplier: 1.0,
      avgProjectValue: 25000,
      keywords: ['bathroom', 'bath', 'shower', 'tub', 'vanity', 'tile'],
    },
    {
      id: 'basement',
      name: 'Basement Finishing',
      category: 'interior',
      urgencyMultiplier: 0.8, // Usually not urgent
      avgProjectValue: 35000,
      keywords: ['basement', 'finish', 'waterproof', 'theater', 'rec room'],
    },
    {
      id: 'deck',
      name: 'Deck Building',
      category: 'exterior',
      urgencyMultiplier: 1.2,
      avgProjectValue: 18000,
      keywords: ['deck', 'patio', 'outdoor', 'pergola', 'composite'],
      seasonalBoost: {
        months: [2, 3, 4, 5], // Late winter/spring for summer completion
        multiplier: 1.4,
      },
    },
    {
      id: 'addition',
      name: 'Home Addition',
      category: 'interior',
      urgencyMultiplier: 1.0,
      avgProjectValue: 85000,
      keywords: ['addition', 'expand', 'add room', 'extra space', 'build on'],
    },
    {
      id: 'flooring',
      name: 'Flooring Installation',
      category: 'interior',
      urgencyMultiplier: 1.1,
      avgProjectValue: 8000,
      keywords: ['floor', 'flooring', 'hardwood', 'tile', 'carpet', 'vinyl', 'lvp'],
    },
    {
      id: 'siding',
      name: 'Siding',
      category: 'exterior',
      urgencyMultiplier: 1.3,
      avgProjectValue: 15000,
      keywords: ['siding', 'vinyl', 'hardie', 'exterior', 'facade'],
    },
    {
      id: 'emergency',
      name: 'Emergency Repair',
      category: 'emergency',
      urgencyMultiplier: 2.0, // Highest priority
      avgProjectValue: 5000,
      keywords: ['emergency', 'urgent', 'asap', 'water damage', 'storm', 'immediate'],
    },
    {
      id: 'general',
      name: 'General Inquiry',
      category: 'consultation',
      urgencyMultiplier: 0.8,
      avgProjectValue: 20000,
      keywords: [],
    },
  ],

  // ============================================================================
  // SCORING CONFIGURATION
  // ============================================================================
  scoring: {
    rules: {
      hot: {
        minScore: 70,
        conditions: [
          'Multiple services selected',
          'Timeline within 3 months',
          'Budget provided',
          'Phone number provided',
          'Emergency keywords detected',
        ],
      },
      warm: {
        minScore: 40,
        conditions: [
          'Single service selected',
          'Has contact phone',
          'Some project details provided',
        ],
      },
      cold: {
        minScore: 0,
        conditions: [
          'Minimal information provided',
          'No timeline or budget',
          'General inquiry only',
        ],
      },
    },
    weights: {
      multipleServices: 20,
      hasTimeline: 15,
      hasBudget: 15,
      hasPhone: 10,
      hasAddress: 10,
      urgentKeywords: 25,
      highValueService: 15,
    },
  },

  // ============================================================================
  // AUTOMATED SEQUENCES
  // ============================================================================
  sequences: [
    // -------------------------------------------------------------------------
    // HOT LEAD SEQUENCE - Aggressive follow-up for high-intent leads
    // -------------------------------------------------------------------------
    {
      id: 'hot-lead-sequence',
      name: 'Hot Lead - Priority Follow-up',
      description: 'High-touch sequence for leads showing strong buying signals',
      trigger: 'new_lead',
      steps: [
        {
          id: 'hot-1-immediate-sms',
          channel: 'sms',
          delayMinutes: 0,
          template: `Hi {{firstName}}! This is {{ownerName}} from {{businessName}}. Thank you for reaching out about your {{serviceName}} project. I'd love to learn more and provide a free estimate. When's a good time to chat today?`,
        },
        {
          id: 'hot-2-call-task',
          channel: 'call_task',
          delayMinutes: 15,
          template: `PRIORITY: Call {{fullName}} about {{serviceName}} - Hot lead, scored {{score}}. Phone: {{phone}}`,
        },
        {
          id: 'hot-3-detail-sms',
          channel: 'sms',
          delayMinutes: 120, // 2 hours
          template: `{{firstName}}, I wanted to share that we're currently scheduling {{serviceName}} estimates in your area this week. Our calendar fills up fast - would tomorrow or {{dayOfWeek}} work better for your free consultation?`,
          conditions: {
            skipIf: ['Contacted', 'Appointment Scheduled'],
          },
        },
        {
          id: 'hot-4-value-email',
          channel: 'email',
          delayMinutes: 360, // 6 hours
          subject: `Your {{serviceName}} Project - Next Steps`,
          template: `hot-lead-email`,
          conditions: {
            skipIf: ['Contacted', 'Appointment Scheduled'],
          },
        },
        {
          id: 'hot-5-urgency-sms',
          channel: 'sms',
          delayMinutes: 1440, // 24 hours
          template: `{{firstName}}, just following up on your {{serviceName}} inquiry. We have an opening this week for estimates in {{city}}. Reply YES and I'll get you on the schedule, or call me directly at {{businessPhone}}. - {{ownerName}}`,
          conditions: {
            skipIf: ['Contacted', 'Appointment Scheduled', 'Not Interested'],
          },
        },
        {
          id: 'hot-6-final-attempt',
          channel: 'sms',
          delayMinutes: 4320, // 3 days
          template: `Hi {{firstName}}, I don't want to miss connecting with you about your {{serviceName}} project. If you've gone another direction, no worries at all - just let me know. Otherwise, I'm here when you're ready. Have a great {{dayOfWeek}}! - {{ownerName}}, {{businessName}}`,
          conditions: {
            skipIf: ['Contacted', 'Appointment Scheduled', 'Not Interested', 'Closed'],
          },
        },
      ],
    },

    // -------------------------------------------------------------------------
    // WARM LEAD SEQUENCE - Balanced follow-up for interested leads
    // -------------------------------------------------------------------------
    {
      id: 'warm-lead-sequence',
      name: 'Warm Lead - Standard Follow-up',
      description: 'Nurturing sequence for leads with moderate buying signals',
      trigger: 'new_lead',
      steps: [
        {
          id: 'warm-1-welcome-sms',
          channel: 'sms',
          delayMinutes: 0,
          template: `Hi {{firstName}}! Thanks for contacting {{businessName}} about your {{serviceName}} project. I'm {{ownerName}}, and I'll personally ensure you get a prompt response. We'll be in touch {{responseTimePromise}}!`,
        },
        {
          id: 'warm-2-intro-email',
          channel: 'email',
          delayMinutes: 30,
          subject: `Thanks for Contacting {{businessName}}!`,
          template: `warm-lead-email`,
        },
        {
          id: 'warm-3-followup-sms',
          channel: 'sms',
          delayMinutes: 1440, // 24 hours
          template: `{{greeting}} {{firstName}}! Following up on your {{serviceName}} inquiry. Would you like to schedule a free estimate? We're booking appointments in {{city}} this week. Just reply with a day that works!`,
          conditions: {
            skipIf: ['Contacted', 'Appointment Scheduled'],
          },
        },
        {
          id: 'warm-4-call-task',
          channel: 'call_task',
          delayMinutes: 2880, // 48 hours
          template: `Follow up call: {{fullName}} - {{serviceName}} inquiry. Lead score: {{score}}. No response to initial outreach.`,
          conditions: {
            skipIf: ['Contacted', 'Appointment Scheduled'],
          },
        },
        {
          id: 'warm-5-value-sms',
          channel: 'sms',
          delayMinutes: 5760, // 4 days
          template: `{{firstName}}, quick question - are you still considering {{serviceName}} for your home? If so, I'd be happy to answer any questions or provide a no-obligation estimate. Just reply or call {{businessPhone}}. - {{ownerName}}`,
          conditions: {
            skipIf: ['Contacted', 'Appointment Scheduled', 'Not Interested'],
          },
        },
        {
          id: 'warm-6-soft-close',
          channel: 'sms',
          delayMinutes: 10080, // 7 days
          template: `Hi {{firstName}}, just circling back one last time. If your {{serviceName}} plans have changed, no problem at all. We'll be here when you're ready. Wishing you a great week! - {{businessName}}`,
          conditions: {
            skipIf: ['Contacted', 'Appointment Scheduled', 'Not Interested', 'Closed'],
          },
        },
      ],
    },

    // -------------------------------------------------------------------------
    // COLD LEAD SEQUENCE - Light touch for early-stage leads
    // -------------------------------------------------------------------------
    {
      id: 'cold-lead-sequence',
      name: 'Cold Lead - Nurture Sequence',
      description: 'Low-pressure sequence for leads in research phase',
      trigger: 'new_lead',
      steps: [
        {
          id: 'cold-1-ack-sms',
          channel: 'sms',
          delayMinutes: 0,
          template: `Hi {{firstName}}, thanks for visiting {{businessName}}! We received your inquiry and we're here to help whenever you're ready. Feel free to reply with any questions. - {{ownerName}}`,
        },
        {
          id: 'cold-2-resource-email',
          channel: 'email',
          delayMinutes: 60,
          subject: `Helpful Resources for Your Home Project`,
          template: `cold-lead-email`,
        },
        {
          id: 'cold-3-checkin-sms',
          channel: 'sms',
          delayMinutes: 4320, // 3 days
          template: `{{greeting}} {{firstName}}! Just checking in - do you have any questions about home remodeling? Happy to help point you in the right direction. - {{ownerName}}, {{businessName}}`,
          conditions: {
            skipIf: ['Contacted', 'Appointment Scheduled'],
          },
        },
        {
          id: 'cold-4-value-email',
          channel: 'email',
          delayMinutes: 10080, // 7 days
          subject: `Planning Your Home Project? Here's What to Know`,
          template: `cold-lead-nurture-email`,
          conditions: {
            skipIf: ['Contacted', 'Appointment Scheduled', 'Unsubscribed'],
          },
        },
      ],
    },

    // -------------------------------------------------------------------------
    // EMERGENCY SEQUENCE - Immediate response for urgent needs
    // -------------------------------------------------------------------------
    {
      id: 'emergency-sequence',
      name: 'Emergency Lead - Immediate Response',
      description: 'Rapid response for emergency/urgent service needs',
      trigger: 'new_lead',
      steps: [
        {
          id: 'emergency-1-immediate-sms',
          channel: 'sms',
          delayMinutes: 0,
          template: `{{firstName}}, we received your URGENT request. I'm {{ownerName}} from {{businessName}} and I'm prioritizing your call. Calling you now at {{phone}} - if I miss you, please call me directly at {{businessPhone}}.`,
        },
        {
          id: 'emergency-2-call-task-urgent',
          channel: 'call_task',
          delayMinutes: 0,
          template: `EMERGENCY CALL NOW: {{fullName}} - {{serviceName}}. Phone: {{phone}}. This is an urgent request - call immediately!`,
        },
        {
          id: 'emergency-3-backup-sms',
          channel: 'sms',
          delayMinutes: 30,
          template: `{{firstName}}, I tried reaching you. For emergencies, please call us directly at {{businessPhone}} - we're standing by to help with your {{serviceName}} situation.`,
          conditions: {
            skipIf: ['Contacted'],
          },
        },
        {
          id: 'emergency-4-internal-note',
          channel: 'internal_note',
          delayMinutes: 60,
          template: `ALERT: Emergency lead {{fullName}} has not been contacted after 1 hour. Immediate follow-up required. Original inquiry: {{serviceName}}`,
          conditions: {
            skipIf: ['Contacted'],
          },
        },
      ],
    },
  ],

  // ============================================================================
  // CRM INTEGRATION
  // ============================================================================
  crm: {
    locationId: '497AdD39erWgmOu8JTCw',
    pipelineId: 'G9L7BKFIGlD7140Ebh9x',
    stages: {
      newLead: 'ba181b0e-95c6-4d44-8528-ecdd3015016c',
      contacted: '9540c006-3233-46f0-a78c-bd27f71f7949',
      qualified: '9540c006-3233-46f0-a78c-bd27f71f7949', // Using contacted for now
      proposalSent: 'e718bcc3-7f35-483d-a681-df4a7312f591',
      closed: 'fbbe8130-82c3-4b69-ab5c-8b1f23f392ac',
    },
  },

  // ============================================================================
  // FEATURE FLAGS
  // ============================================================================
  features: {
    autoSms: true,
    autoEmail: true,
    createTasks: true,
    aiPersonalization: false, // Future feature
  },
}

export default config
