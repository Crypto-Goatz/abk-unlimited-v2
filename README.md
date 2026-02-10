# ABK Unlimited v2 — AI-Powered Contractor Website

**Live site**: [abk-unlimited-v2.vercel.app](https://abk-unlimited-v2.vercel.app)

A full-featured contractor website for ABK Unlimited (Pittsburgh, PA) built on the Rocket Client Template. Powered by Google Workspace as CMS, Gemini AI for content generation, CRO9 analytics, and CRM integration for automated lead management.

---

## What's Inside

### Public Site (13 pages)
| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/` | Hero, services overview, testimonials, CTA |
| About | `/about` | Company story, team, values |
| Services | `/services` | All services grid |
| Service Detail | `/services/[slug]` | Individual service pages |
| Portfolio | `/portfolio` | Project gallery |
| Blog | `/blog` | Blog listing |
| Blog Post | `/blog/[slug]` | Individual blog posts |
| Testimonials | `/testimonials` | Customer reviews |
| Contact | `/contact` | Contact form (creates CRM lead) |
| Free Estimate | `/free-estimate` | Multi-step estimate request form |
| Tools Hub | `/tools` | Free tool listing page |
| AI Visualizer | `/tools/visualizer` | AI home renovation visualizer |
| Cost Calculator | `/tools/cost-calculator` | Project cost estimator |
| Timeline Estimator | `/tools/timeline-estimator` | Renovation timeline calculator |
| Design Gallery | `/tools/design-gallery` | Design inspiration browser |

### Admin Dashboard (7 pages)
| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/admin` | Overview + integration status |
| Content Manager | `/admin/content` | Edit all site content (syncs to Google Sheets) |
| Media Library | `/admin/media` | Upload/manage images (Google Drive) |
| AI Writer | `/admin/ai` | Generate content with Gemini AI |
| Analytics | `/admin/analytics` | CRO9 analytics dashboard |
| SXO Panel | `/admin/sxo` | Behavioral data + optimization recommendations |
| Settings | `/admin/settings` | Integration config, API keys, CRM connection |

### API Routes (10 endpoints)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth` | GET/POST/DELETE | Admin login/logout/check |
| `/api/content` | GET/POST/PUT/DELETE | CRUD for Google Sheets content |
| `/api/media` | GET/POST/DELETE | Google Drive media management |
| `/api/ai/generate` | POST | Gemini AI content generation |
| `/api/contact` | POST | Contact form submission → CRM |
| `/api/leads` | POST/PUT | Lead submission + Lead Intelligence scoring |
| `/api/visualizer` | POST | AI home visualization (7 actions) |
| `/api/visualizer/save-image` | POST | Save visualizer result to CRM |
| `/api/crm/connect` | GET | CRM OAuth initiation |
| `/api/crm/callback` | GET | CRM OAuth callback |

### Advanced Features
- **AI Home Visualizer** — Upload a room photo or generate from text, see AI-powered design transformations (Gemini 2.5 Flash + Imagen 4.0)
- **Lead Intelligence Skill** — Automated lead scoring engine with hot/warm/cold temperature routing, urgency detection, seasonal boosts, and automated SMS/email sequences
- **CRM Integration** — Contacts, opportunities, notes, tags, and SMS via CRM API
- **CRO9 Analytics** — Behavioral tracking, scroll depth, rage clicks, exit intent

---

## How to Access the Admin Backend

### URL
```
https://abk-unlimited-v2.vercel.app/admin
```

### Login
The admin is protected by a password set in the `ADMIN_PASSWORD` environment variable.

1. Go to `/admin` — you'll see the login prompt
2. Enter the admin password
3. Session lasts 7 days (stored as an HTTP-only cookie)

To set the password, add `ADMIN_PASSWORD` in Vercel:
- Go to [Vercel Dashboard](https://vercel.com/cryptogoatz/abk-unlimited-v2/settings/environment-variables)
- Add `ADMIN_PASSWORD` = your chosen password
- Add `SESSION_SECRET` = a random string (run `openssl rand -hex 32` to generate one)
- Redeploy

### Dashboard Overview
Once logged in, you'll see:
- **Integration Status** — green/red indicators for each connected service
- **Quick Links** — jump to Content, Media, AI, Analytics, SXO, or Settings

### Sidebar Navigation
The left sidebar has 7 sections:
- **Dashboard** — Home overview
- **Content** — Edit services, blog, portfolio, testimonials, team, FAQs
- **Media** — Upload and manage images
- **AI Writer** — Chat with Gemini to generate content
- **Analytics** — CRO9 performance data
- **SXO** — Search experience optimization
- **Settings** — API keys, CRM connection, integration status

---

## Setup Guide (Step by Step)

### Prerequisites
- Google account (for Sheets + Drive)
- Google Cloud project with Sheets API + Drive API enabled
- Vercel account (already deployed at `cryptogoatz`)

### Step 1: Create the Google Sheet (Automated)

There's a Google Apps Script that creates the entire sheet automatically with all ABK content pre-populated.

1. Go to [Google Apps Script](https://script.google.com)
2. Click **New Project**
3. Delete the default code
4. Copy the entire contents of `scripts/create-abk-sheet.gs` from this repo
5. Paste it in
6. Click **Run** (it will ask for Google Sheets permission — allow it)
7. Wait ~10 seconds
8. Check the **Execution Log** — it will show the new Sheet URL
9. Open the Sheet and copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
   ```

The script creates 8 tabs with all ABK content:
- `site_config` (34 business settings)
- `services` (9 services)
- `portfolio` (9 projects)
- `testimonials` (9 reviews)
- `blog` (6 full articles)
- `team` (3 team members)
- `faqs` (12 questions)
- `seo` (16 page-level SEO entries)

### Step 2: Create the Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder: `ABK Unlimited Media`
3. Inside it, create subfolders: `portfolio`, `team`, `blog`, `general`
4. Upload ABK images into the appropriate subfolders
5. Copy the **Folder ID** from the URL:
   ```
   https://drive.google.com/drive/folders/COPY_THIS_PART
   ```

### Step 3: Create a Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Go to **APIs & Services > Library**
4. Search and enable **Google Sheets API**
5. Search and enable **Google Drive API**
6. Go to **IAM & Admin > Service Accounts**
7. Click **Create Service Account**
   - Name: `abk-unlimited-cms`
   - Role: skip (not needed)
8. Click the service account > **Keys** tab > **Add Key** > **Create new key** > **JSON**
9. Save the downloaded JSON file
10. **Share the Google Sheet** with the service account email (the `client_email` from the JSON) — give it **Editor** access
11. **Share the Drive folder** with the same email — give it **Editor** access
12. Base64-encode the JSON key:
    ```bash
    base64 -i path/to/service-account-key.json | tr -d '\n'
    ```
13. Save this base64 string — it's your `GOOGLE_SERVICE_ACCOUNT_KEY`

### Step 4: Set Environment Variables in Vercel

Go to [Vercel Dashboard > Settings > Environment Variables](https://vercel.com/cryptogoatz/abk-unlimited-v2/settings/environment-variables)

Add these variables:

**Required:**
| Variable | Value | Notes |
|----------|-------|-------|
| `GOOGLE_SHEETS_ID` | (from Step 1) | The Sheet ID |
| `GOOGLE_DRIVE_FOLDER_ID` | (from Step 2) | The Drive folder ID |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | (from Step 3) | Base64-encoded JSON |
| `ADMIN_PASSWORD` | (choose a strong one) | For `/admin` login |
| `SESSION_SECRET` | (random string) | `openssl rand -hex 32` |

**AI Features:**
| Variable | Value | Notes |
|----------|-------|-------|
| `GEMINI_API_KEY` | (from Google AI Studio) | For AI Writer + Visualizer |

**CRM Integration:**
| Variable | Value | Notes |
|----------|-------|-------|
| `CRM_API_KEY` | (from CRM settings) | For lead submission |
| `CRM_LOCATION_ID` | (ABK's CRM location) | CRM sub-account ID |
| `CRM_PIPELINE_ID` | `G9L7BKFIGlD7140Ebh9x` | ABK's pipeline |
| `NEXT_PUBLIC_CRM_CHAT_WIDGET_ID` | (from CRM) | Chat widget embed |
| `NEXT_PUBLIC_CRM_TRACKING_ID` | `tk_646afa21f1344a9f960010e84b1aeea4` | Page tracking |

**Analytics:**
| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_CRO9_KEY` | (from CRO9 dashboard) | Analytics tracking |
| `CRO9_API_URL` | `https://api.cro9.app` | CRO9 API base |

**Site Branding:**
| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SITE_NAME` | `ABK Unlimited` |
| `NEXT_PUBLIC_SITE_PHONE` | `(412) 584-4383` |
| `NEXT_PUBLIC_SITE_EMAIL` | `info@abkunlimited.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://abkunlimited.com` |
| `NEXT_PUBLIC_COLOR_PRIMARY` | `#14664f` |
| `NEXT_PUBLIC_COLOR_SECONDARY` | `#0d4a38` |
| `NEXT_PUBLIC_COLOR_ACCENT` | `#c9a227` |

After adding all variables, click **Redeploy** from the Deployments tab.

### Step 5: Connect Custom Domain (Optional)

1. In Vercel, go to **Settings > Domains**
2. Add `abkunlimited.com` (or whatever domain)
3. Add a CNAME record in DNS: `cname.vercel-dns.com`
4. SSL is automatic

---

## How Each Feature Works

### Content Manager (`/admin/content`)
- Select a tab (Services, Blog, Portfolio, Testimonials, Team, FAQs)
- Edit any row inline — changes write directly to the Google Sheet
- Add new rows or delete existing ones
- Content appears on the public site within 5 minutes (ISR revalidation)

### Media Library (`/admin/media`)
- Browse images stored in Google Drive
- Upload new images — they go into the Drive folder
- Copy image IDs to use in content (paste into the `image_id` column in Sheets)

### AI Writer (`/admin/ai`)
- Chat interface powered by Gemini AI
- Type prompts like:
  - "Write a blog post about kitchen remodeling trends in 2026"
  - "Generate SEO meta descriptions for all my service pages"
  - "Improve this copy for better conversions: [paste text]"
- Click **Save to Blog** to write generated content directly to the blog Sheet tab

### AI Visualizer (`/tools/visualizer`)
- Two modes: **Indoor Design** and **Outdoor Renovation**
- Upload a photo of a room/exterior OR generate from a text description
- AI transforms the image with design changes
- Captures lead info before showing final result (lead gate)
- Saves visualization to CRM contact record

### Lead Intelligence (`/api/leads`)
Automatic scoring when a lead submits any form:
- **Scoring factors**: services requested, timeline urgency, budget, phone/address provided, urgent keywords, service value, seasonal demand
- **Temperature routing**: Hot (65+), Warm (35-64), Cold (<35)
- **Automated sequences**: SMS + email follow-ups on a timed schedule
- **CRM actions**: Creates contact, adds tags, creates opportunity, triggers workflow

### Analytics (`/admin/analytics`)
- CRO9 behavioral data: page views, scroll depth, rage clicks, dead clicks, exit intent
- Conversion tracking on form submissions

### SXO Panel (`/admin/sxo`)
- Pulls CRO9 behavioral data
- AI-powered optimization recommendations
- Example: "Your contact form has 73% abandonment — here's how to fix it"

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript, React 19 |
| Styling | Tailwind CSS 4 |
| CMS | Google Sheets v4 API |
| Media | Google Drive v3 API |
| AI | Gemini 2.5 Flash + Imagen 4.0 |
| Analytics | CRO9 |
| CRM | RocketAdd CRM API |
| Hosting | Vercel |
| Validation | Zod v4 |

## Project Structure

```
app/
  page.tsx                          Homepage
  about/page.tsx                    About page
  services/page.tsx                 Services listing
  services/[slug]/page.tsx          Service detail
  portfolio/page.tsx                Portfolio gallery
  blog/page.tsx                     Blog listing
  blog/[slug]/page.tsx              Blog post
  testimonials/page.tsx             Reviews page
  contact/page.tsx                  Contact form
  free-estimate/page.tsx            Estimate request form
  free-estimate/EstimateForm.tsx    Multi-step form component
  tools/page.tsx                    Tools hub
  tools/visualizer/                 AI Visualizer (14 components)
  tools/cost-calculator/            Cost calculator
  tools/timeline-estimator/         Timeline estimator
  tools/design-gallery/             Design inspiration
  admin/                            Client dashboard (7 pages)
  api/                              API routes (10 endpoints)

components/
  site/       Public site components (Header, Footer, Hero, etc.)
  admin/      Dashboard components (Sidebar, ContentEditor, AIChat, etc.)
  ui/         Shared primitives (Button, Card, Input, Label, Textarea)

lib/
  google/     Google Sheets + Drive + Auth
  skills/     Lead Intelligence Skill (engine, executor, config, types)
  crm-api.ts  CRM API client
  gemini.ts   Gemini AI client
  cro9.ts     CRO9 analytics helpers
  config.ts   Integration status checker
  utils.ts    Tailwind cn() helper

config/
  site.config.ts     Site metadata from env vars
  sheets-schema.ts   Google Sheets tab/column definitions
```

## Built by Rocket+

Part of the [Rocket Client Template](https://github.com/0nork/rocket-client-template) system.

Built by [RocketClients.com](https://rocketclients.com) | [0nork](https://github.com/0nork)
