/**
 * Google Sheets schema definition.
 * Each client's Google Sheet must have these tabs with the specified columns.
 * The first row of each tab is treated as headers.
 */

export const SHEETS_SCHEMA = {
  site_config: {
    description: "Key-value pairs for site configuration",
    columns: ["key", "value"],
  },
  services: {
    description: "Service offerings displayed on the services page",
    columns: [
      "id",
      "title",
      "slug",
      "description",
      "image_id",
      "icon",
      "order",
    ],
  },
  portfolio: {
    description: "Portfolio/project items with images",
    columns: [
      "id",
      "title",
      "description",
      "image_ids",
      "category",
      "date",
    ],
  },
  testimonials: {
    description: "Client testimonials and reviews",
    columns: ["id", "name", "role", "text", "rating", "image_id"],
  },
  blog: {
    description: "Blog posts with full content",
    columns: [
      "id",
      "title",
      "slug",
      "content",
      "excerpt",
      "image_id",
      "published_at",
      "status",
    ],
  },
  team: {
    description: "Team member profiles",
    columns: ["id", "name", "role", "bio", "image_id"],
  },
  faqs: {
    description: "Frequently asked questions",
    columns: ["id", "question", "answer", "category"],
  },
  seo: {
    description: "Per-page SEO metadata overrides",
    columns: ["page_path", "title", "description", "og_image_id"],
  },
  custom_apps: {
    description: "Custom app/tool definitions rendered dynamically",
    columns: [
      "id",
      "title",
      "slug",
      "status",
      "definition",
      "created_at",
      "updated_at",
    ],
  },
  webhooks: {
    description: "Webhook endpoint configurations",
    columns: [
      "id",
      "slug",
      "name",
      "status",
      "auth_type",
      "auth_secret",
      "action_type",
      "action_config",
      "created_at",
      "updated_at",
    ],
  },
  custom_endpoints: {
    description: "Custom API endpoint definitions",
    columns: [
      "id",
      "slug",
      "name",
      "method",
      "status",
      "input_schema",
      "actions",
      "response_template",
      "auth_required",
      "created_at",
    ],
  },
  customers: {
    description: "Customer database synced with CRM",
    columns: [
      "id",
      "crm_contact_id",
      "first_name",
      "last_name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zip",
      "source",
      "lead_score",
      "lead_temperature",
      "tags",
      "services_interested",
      "estimated_value",
      "status",
      "notes",
      "gclid",
      "fbclid",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "ga_client_id",
      "first_visit_page",
      "conversion_page",
      "created_at",
      "updated_at",
      "last_synced",
    ],
  },
  email_sequences: {
    description: "Automated email drip sequence tracking",
    columns: [
      "id",
      "customer_id",
      "crm_contact_id",
      "email",
      "first_name",
      "service",
      "source",
      "current_step",
      "status",
      "step_1_sent",
      "step_2_sent",
      "step_3_sent",
      "step_4_sent",
      "step_2_scheduled",
      "step_3_scheduled",
      "step_4_scheduled",
      "created_at",
      "updated_at",
    ],
  },
  analytics_events: {
    description: "GA4 and CRO9 analytics events for feedback loop",
    columns: [
      "id",
      "customer_id",
      "crm_contact_id",
      "event_name",
      "event_category",
      "source",
      "medium",
      "campaign",
      "gclid",
      "fbclid",
      "page_path",
      "referrer",
      "ga_client_id",
      "session_id",
      "device_type",
      "city",
      "conversion_value",
      "timestamp",
    ],
  },
} as const;

export type SheetName = keyof typeof SHEETS_SCHEMA;

export interface ServiceRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_id: string;
  icon: string;
  order: string;
}

export interface PortfolioRow {
  id: string;
  title: string;
  description: string;
  image_ids: string;
  category: string;
  date: string;
}

export interface TestimonialRow {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: string;
  image_id: string;
}

export interface BlogRow {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_id: string;
  published_at: string;
  status: string;
}

export interface TeamRow {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_id: string;
}

export interface FAQRow {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SEORow {
  page_path: string;
  title: string;
  description: string;
  og_image_id: string;
}

export interface CustomAppRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  definition: string;
  created_at: string;
  updated_at: string;
}

export interface WebhookRow {
  id: string;
  slug: string;
  name: string;
  status: string;
  auth_type: string;
  auth_secret: string;
  action_type: string;
  action_config: string;
  created_at: string;
  updated_at: string;
}

export interface CustomEndpointRow {
  id: string;
  slug: string;
  name: string;
  method: string;
  status: string;
  input_schema: string;
  actions: string;
  response_template: string;
  auth_required: string;
  created_at: string;
}

export interface CustomerRow {
  id: string;
  crm_contact_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  source: string;
  lead_score: string;
  lead_temperature: string;
  tags: string;
  services_interested: string;
  estimated_value: string;
  status: string;
  notes: string;
  gclid: string;
  fbclid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  ga_client_id: string;
  first_visit_page: string;
  conversion_page: string;
  created_at: string;
  updated_at: string;
  last_synced: string;
}

export interface AnalyticsEventRow {
  id: string;
  customer_id: string;
  crm_contact_id: string;
  event_name: string;
  event_category: string;
  source: string;
  medium: string;
  campaign: string;
  gclid: string;
  fbclid: string;
  page_path: string;
  referrer: string;
  ga_client_id: string;
  session_id: string;
  device_type: string;
  city: string;
  conversion_value: string;
  timestamp: string;
}
