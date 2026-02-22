/**
 * ABK Unlimited — Beautiful Email Templates
 *
 * 4-email automated thank-you sequence:
 * 1. Instant: Personalized thank you
 * 2. Day 1: Service-specific portfolio showcase
 * 3. Day 3: Social proof + reviews
 * 4. Day 7: Consultation offer + next steps
 */

// ─── Brand ───────────────────────────────────────────────────────────
const BRAND = {
  name: 'ABK Unlimited',
  phone: '(412) 944-1683',
  email: 'info@abkunlimited.com',
  url: 'https://abkunlimited.com',
  address: 'Pittsburgh, PA 15205',
  green: '#14664f',
  greenLight: '#1a8a6a',
  greenDark: '#0a1a14',
  gold: '#c8a84e',
  bg: '#f8faf9',
  cardBg: '#ffffff',
  textDark: '#1a1a1a',
  textMuted: '#6b7280',
}

// ─── Service content map ─────────────────────────────────────────────
const SERVICE_CONTENT: Record<string, {
  title: string
  tagline: string
  highlights: string[]
  cta: string
}> = {
  'kitchen': {
    title: 'Kitchen Remodeling',
    tagline: 'Transform the heart of your home',
    highlights: [
      'Custom cabinetry and countertop installation',
      'Full kitchen layout redesign and optimization',
      'Premium appliance integration and electrical upgrades',
      'Tile backsplash and flooring coordination',
    ],
    cta: 'See Our Kitchen Portfolio',
  },
  'bathroom': {
    title: 'Bathroom Remodeling',
    tagline: 'Create your personal spa retreat',
    highlights: [
      'Walk-in shower and soaking tub installations',
      'Custom vanity and tile design',
      'Heated flooring and smart fixtures',
      'ADA-compliant accessible designs',
    ],
    cta: 'See Our Bathroom Portfolio',
  },
  'basement': {
    title: 'Basement Finishing',
    tagline: 'Unlock your home\'s hidden potential',
    highlights: [
      'Complete basement finishing and waterproofing',
      'Home theater and entertainment rooms',
      'In-law suites and guest bedrooms',
      'Home gym and office buildouts',
    ],
    cta: 'See Our Basement Portfolio',
  },
  'deck': {
    title: 'Deck Building',
    tagline: 'Extend your living space outdoors',
    highlights: [
      'Composite and hardwood deck construction',
      'Multi-level deck designs with railing systems',
      'Built-in seating, planters, and lighting',
      'Pergolas and covered outdoor kitchens',
    ],
    cta: 'See Our Deck Portfolio',
  },
  default: {
    title: 'Home Remodeling',
    tagline: 'Quality craftsmanship for every room',
    highlights: [
      'Full-service residential construction',
      'Licensed and insured Pittsburgh contractors',
      '25+ years of combined experience',
      'Transparent pricing with no hidden fees',
    ],
    cta: 'Explore Our Services',
  },
}

function getServiceContent(service?: string) {
  if (!service) return SERVICE_CONTENT.default
  const key = service.toLowerCase()
  for (const [k, v] of Object.entries(SERVICE_CONTENT)) {
    if (key.includes(k)) return v
  }
  return SERVICE_CONTENT.default
}

// ─── Base layout ─────────────────────────────────────────────────────
function layout(content: string, preheader: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${BRAND.name}</title>
<style>
  body { margin: 0; padding: 0; background-color: ${BRAND.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
  .preheader { display: none !important; max-height: 0; overflow: hidden; mso-hide: all; }
  .container { max-width: 600px; margin: 0 auto; background: ${BRAND.cardBg}; }
  .header { background: linear-gradient(135deg, ${BRAND.greenDark} 0%, ${BRAND.green} 100%); padding: 40px 32px; text-align: center; }
  .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 4px; letter-spacing: -0.5px; }
  .header p { color: rgba(255,255,255,0.7); font-size: 13px; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
  .body-content { padding: 40px 32px; }
  .btn { display: inline-block; background: ${BRAND.green}; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; letter-spacing: 0.3px; }
  .btn:hover { background: ${BRAND.greenLight}; }
  .btn-outline { display: inline-block; border: 2px solid ${BRAND.green}; color: ${BRAND.green} !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; }
  .divider { height: 1px; background: #e5e7eb; margin: 28px 0; }
  .card { background: ${BRAND.bg}; border-radius: 12px; padding: 24px; margin: 20px 0; border: 1px solid #e5e7eb; }
  .card-accent { border-left: 4px solid ${BRAND.green}; }
  .highlight-row { display: flex; align-items: flex-start; margin-bottom: 12px; }
  .check-icon { color: ${BRAND.green}; font-size: 18px; margin-right: 10px; flex-shrink: 0; line-height: 1.4; }
  .footer { background: ${BRAND.greenDark}; padding: 32px; text-align: center; }
  .footer p { color: rgba(255,255,255,0.5); font-size: 12px; margin: 4px 0; }
  .footer a { color: ${BRAND.gold}; text-decoration: none; }
  .stars { color: ${BRAND.gold}; font-size: 20px; letter-spacing: 2px; }
  h2 { color: ${BRAND.textDark}; font-size: 22px; margin: 0 0 12px; }
  h3 { color: ${BRAND.textDark}; font-size: 17px; margin: 0 0 8px; }
  p { color: ${BRAND.textMuted}; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
  @media only screen and (max-width: 640px) {
    .body-content { padding: 28px 20px; }
    .header { padding: 32px 20px; }
    .footer { padding: 24px 20px; }
    .btn { padding: 12px 24px; }
  }
</style>
</head>
<body>
<div class="preheader">${preheader}</div>
<div style="padding: 20px 12px;">
<div class="container" style="border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
${content}
</div>
</div>
</body>
</html>`
}

function header(): string {
  return `<div class="header">
  <h1>${BRAND.name}</h1>
  <p>Quality Craftsmanship Since Day One</p>
</div>`
}

function footer(unsubscribeId: string): string {
  return `<div class="footer">
  <p style="margin-bottom: 12px;">
    <a href="tel:+14129441683">${BRAND.phone}</a> &nbsp;|&nbsp;
    <a href="mailto:${BRAND.email}">${BRAND.email}</a>
  </p>
  <p>${BRAND.name} &bull; ${BRAND.address}</p>
  <p style="margin-top: 12px;">
    <a href="${BRAND.url}/unsubscribe?id=${encodeURIComponent(unsubscribeId)}" style="color: rgba(255,255,255,0.35); font-size: 11px;">Unsubscribe</a>
  </p>
</div>`
}

// ─── Email 1: Instant Thank You ──────────────────────────────────────
export function thankYouEmail(data: {
  firstName: string
  service?: string
  source: string
  sequenceId: string
}): { subject: string; html: string } {
  const svc = getServiceContent(data.service)
  const isEstimate = data.source === 'free-estimate'

  const subject = isEstimate
    ? `${data.firstName}, your free estimate request is confirmed!`
    : `Thanks for reaching out, ${data.firstName}!`

  const html = layout(`
${header()}
<div class="body-content">
  <h2>Hi ${data.firstName}! 👋</h2>
  <p>
    ${isEstimate
      ? 'Thank you for requesting a free estimate from ABK Unlimited! We\'re excited about the opportunity to bring your vision to life.'
      : 'Thank you for contacting ABK Unlimited! We received your message and our team is already reviewing it.'
    }
  </p>

  <div class="card card-accent">
    <h3>What happens next?</h3>
    <div style="margin-top: 12px;">
      <div class="highlight-row">
        <span class="check-icon">✓</span>
        <p style="margin: 0;"><strong>Within 2 hours</strong> — A team member will personally review your ${isEstimate ? 'project details' : 'message'}</p>
      </div>
      <div class="highlight-row">
        <span class="check-icon">✓</span>
        <p style="margin: 0;"><strong>Within 24 hours</strong> — We'll reach out by phone or email with next steps</p>
      </div>
      ${isEstimate ? `
      <div class="highlight-row">
        <span class="check-icon">✓</span>
        <p style="margin: 0;"><strong>Free on-site visit</strong> — We'll schedule a time to see your space in person</p>
      </div>` : ''}
    </div>
  </div>

  ${data.service ? `
  <p style="color: ${BRAND.textDark}; font-weight: 600;">Interested in: ${svc.title}</p>
  <p>${svc.tagline} — our team has completed hundreds of ${svc.title.toLowerCase()} projects across Greater Pittsburgh.</p>
  ` : ''}

  <div style="text-align: center; margin: 32px 0;">
    <a href="${BRAND.url}/portfolio" class="btn">${svc.cta}</a>
  </div>

  <div class="divider"></div>

  <p style="font-size: 14px;">
    <strong>Can't wait?</strong> Call us directly at
    <a href="tel:+14129441683" style="color: ${BRAND.green}; font-weight: 600;">${BRAND.phone}</a>
    — we're available Mon–Fri 7am–6pm, Sat 8am–2pm.
  </p>
</div>
${footer(data.sequenceId)}
`, `${data.firstName}, we received your message and will respond within 24 hours.`)

  return { subject, html }
}

// ─── Email 2: Portfolio Showcase (Day 1) ─────────────────────────────
export function portfolioEmail(data: {
  firstName: string
  service?: string
  sequenceId: string
}): { subject: string; html: string } {
  const svc = getServiceContent(data.service)

  const subject = `${data.firstName}, see what we've built for Pittsburgh homeowners`

  const html = layout(`
${header()}
<div class="body-content">
  <h2>Your neighbors love what we do.</h2>
  <p>
    Hi ${data.firstName}! We wanted to share some of our recent work that might inspire your upcoming project.
  </p>

  <div class="card" style="text-align: center; padding: 32px;">
    <h3 style="font-size: 20px; margin-bottom: 4px;">${svc.title}</h3>
    <p style="color: ${BRAND.green}; font-style: italic; margin-bottom: 20px;">${svc.tagline}</p>

    ${svc.highlights.map(h => `
    <div class="highlight-row" style="justify-content: center;">
      <span class="check-icon">✓</span>
      <p style="margin: 0; text-align: left;">${h}</p>
    </div>`).join('')}
  </div>

  <div class="card" style="background: linear-gradient(135deg, ${BRAND.greenDark}, ${BRAND.green}); border: none; text-align: center;">
    <p style="color: rgba(255,255,255,0.8); margin-bottom: 4px; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px;">Why Pittsburgh Chooses ABK</p>
    <div style="display: flex; justify-content: space-around; margin: 20px 0;">
      <div style="text-align: center;">
        <p style="color: #fff; font-size: 28px; font-weight: 700; margin: 0;">500+</p>
        <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0;">Projects</p>
      </div>
      <div style="text-align: center;">
        <p style="color: #fff; font-size: 28px; font-weight: 700; margin: 0;">4.9</p>
        <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0;">Rating</p>
      </div>
      <div style="text-align: center;">
        <p style="color: #fff; font-size: 28px; font-weight: 700; margin: 0;">25+</p>
        <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0;">Years Exp</p>
      </div>
    </div>
  </div>

  <div style="text-align: center; margin: 32px 0;">
    <a href="${BRAND.url}/portfolio" class="btn">View Full Portfolio</a>
  </div>

  <div class="divider"></div>

  <p style="font-size: 14px; text-align: center;">
    Have questions? Reply to this email or call
    <a href="tel:+14129441683" style="color: ${BRAND.green};">${BRAND.phone}</a>
  </p>
</div>
${footer(data.sequenceId)}
`, `See our latest ${svc.title.toLowerCase()} projects across Pittsburgh — 500+ completed and counting.`)

  return { subject, html }
}

// ─── Email 3: Social Proof (Day 3) ──────────────────────────────────
export function socialProofEmail(data: {
  firstName: string
  service?: string
  sequenceId: string
}): { subject: string; html: string } {
  const subject = `${data.firstName}, here's what our clients say about working with ABK`

  const reviews = [
    { name: 'Sarah M.', location: 'Mt. Lebanon', stars: 5, text: 'ABK transformed our outdated kitchen into a showpiece. The attention to detail was incredible, and they finished ahead of schedule. Couldn\'t be happier!' },
    { name: 'James & Linda R.', location: 'Upper St. Clair', stars: 5, text: 'From the initial consultation to the final walkthrough, the ABK team was professional and communicative. Our basement is now our favorite room in the house.' },
    { name: 'Tom K.', location: 'Bethel Park', stars: 5, text: 'Fair pricing, quality materials, and a crew that actually cleans up after themselves. ABK is the real deal. Already planning our next project with them.' },
  ]

  const html = layout(`
${header()}
<div class="body-content">
  <h2>Don't just take our word for it.</h2>
  <p>
    Hi ${data.firstName}, we know choosing a contractor is a big decision. Here's what real Pittsburgh homeowners have to say about working with ABK Unlimited:
  </p>

  ${reviews.map(r => `
  <div class="card" style="margin-bottom: 16px;">
    <div class="stars">${'★'.repeat(r.stars)}</div>
    <p style="color: ${BRAND.textDark}; font-style: italic; margin: 12px 0 8px;">"${r.text}"</p>
    <p style="font-size: 13px; margin: 0;"><strong>${r.name}</strong> — ${r.location}</p>
  </div>`).join('')}

  <div style="background: ${BRAND.bg}; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
    <p style="font-size: 14px; color: ${BRAND.textDark}; margin-bottom: 16px;">
      <strong>4.9/5 average rating</strong> across 200+ verified reviews
    </p>
    <a href="${BRAND.url}/reviews" class="btn-outline">Read All Reviews</a>
  </div>

  <div class="divider"></div>

  <div style="text-align: center;">
    <p style="color: ${BRAND.textDark}; font-weight: 600; font-size: 16px;">Ready to join our happy clients?</p>
    <p>Schedule a free consultation and let's talk about your project.</p>
    <a href="${BRAND.url}/free-estimate" class="btn" style="margin-top: 8px;">Get Your Free Estimate</a>
  </div>
</div>
${footer(data.sequenceId)}
`, `4.9/5 stars from 200+ Pittsburgh homeowners. See why they trust ABK Unlimited.`)

  return { subject, html }
}

// ─── Email 4: Consultation Offer (Day 7) ────────────────────────────
export function consultationOfferEmail(data: {
  firstName: string
  service?: string
  sequenceId: string
}): { subject: string; html: string } {
  const svc = getServiceContent(data.service)

  const subject = `${data.firstName}, let's make your project a reality`

  const html = layout(`
${header()}
<div class="body-content">
  <h2>Your dream home is closer than you think.</h2>
  <p>
    Hi ${data.firstName}, it's been a week since you reached out, and we want to make sure we didn't miss each other.
    Whether you're still in the planning stage or ready to get started, we're here to help.
  </p>

  <div class="card" style="background: linear-gradient(135deg, ${BRAND.greenDark}, ${BRAND.green}); border: none; text-align: center; padding: 32px;">
    <p style="color: ${BRAND.gold}; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; font-weight: 600; margin-bottom: 8px;">Exclusive Offer</p>
    <h3 style="color: #ffffff; font-size: 24px; margin-bottom: 8px;">Free In-Home Consultation</h3>
    <p style="color: rgba(255,255,255,0.75); font-size: 14px; margin-bottom: 20px;">
      No obligation. No pressure. Just expert advice from Pittsburgh's trusted remodeling team.
    </p>
    <a href="${BRAND.url}/free-estimate" class="btn" style="background: ${BRAND.gold}; color: ${BRAND.greenDark};">Book My Free Consultation</a>
  </div>

  <h3 style="margin-top: 28px;">Here's what you'll get:</h3>
  <div style="margin: 16px 0;">
    <div class="highlight-row">
      <span class="check-icon">✓</span>
      <p style="margin: 0;"><strong>Expert walkthrough</strong> — We'll assess your space and discuss possibilities</p>
    </div>
    <div class="highlight-row">
      <span class="check-icon">✓</span>
      <p style="margin: 0;"><strong>Transparent estimate</strong> — Detailed line-item pricing, no surprises</p>
    </div>
    <div class="highlight-row">
      <span class="check-icon">✓</span>
      <p style="margin: 0;"><strong>Design ideas</strong> — We'll share inspiration tailored to your home and budget</p>
    </div>
    <div class="highlight-row">
      <span class="check-icon">✓</span>
      <p style="margin: 0;"><strong>Timeline planning</strong> — Know exactly when your project can start and finish</p>
    </div>
  </div>

  <div class="divider"></div>

  <div style="text-align: center;">
    <p style="font-size: 14px;">
      Questions? Call <a href="tel:+14129441683" style="color: ${BRAND.green}; font-weight: 600;">${BRAND.phone}</a>
      or simply reply to this email.
    </p>
    <p style="font-size: 13px; color: ${BRAND.textMuted};">
      We look forward to working with you, ${data.firstName}!
    </p>
  </div>
</div>
${footer(data.sequenceId)}
`, `${data.firstName}, claim your free in-home consultation — no obligation, just expert advice.`)

  return { subject, html }
}

// ─── Template selector ───────────────────────────────────────────────
export type EmailStep = 1 | 2 | 3 | 4

export function getEmailTemplate(step: EmailStep, data: {
  firstName: string
  service?: string
  source: string
  sequenceId: string
}): { subject: string; html: string } {
  switch (step) {
    case 1: return thankYouEmail(data)
    case 2: return portfolioEmail(data)
    case 3: return socialProofEmail(data)
    case 4: return consultationOfferEmail(data)
  }
}

export const SEQUENCE_SCHEDULE: { step: EmailStep; delayMinutes: number; name: string }[] = [
  { step: 1, delayMinutes: 0, name: 'Instant Thank You' },
  { step: 2, delayMinutes: 24 * 60, name: 'Portfolio Showcase (Day 1)' },
  { step: 3, delayMinutes: 3 * 24 * 60, name: 'Social Proof (Day 3)' },
  { step: 4, delayMinutes: 7 * 24 * 60, name: 'Consultation Offer (Day 7)' },
]
