import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  User,
  Calendar,
  Facebook,
  Linkedin,
  Phone,
} from "lucide-react"

interface BlogPostData {
  slug: string
  title: string
  excerpt: string
  image: string
  category: string
  author: string
  authorImage: string
  authorBio: string
  date: string
  readTime: string
  content: string
}

const blogPosts: Record<string, BlogPostData> = {
  "kitchen-remodeling-trends-2025": {
    slug: "kitchen-remodeling-trends-2025",
    title: "Top Kitchen Remodeling Trends for 2025",
    excerpt:
      "From smart appliances to natural stone finishes, discover the top kitchen design trends that Pittsburgh homeowners are embracing this year.",
    image: "/modern-white-kitchen-renovation-with-island-and-pe.jpg",
    category: "Kitchen",
    author: "ABK Unlimited Team",
    authorImage: "/abk-logo.png",
    authorBio:
      "The ABK Unlimited team is experienced in home remodeling across Greater Pittsburgh.",
    date: "January 15, 2025",
    readTime: "8 min read",
    content: `The kitchen remains the heart of the home, and 2025 is bringing exciting new trends that blend style with functionality. As Pittsburgh's trusted remodeling contractor, we're seeing these trends dominate our project requests this year.

## 1. Smart Kitchen Integration

Smart technology is no longer limited to voice-activated assistants. In 2025, we're installing touchless faucets, smart refrigerators with interior cameras, induction cooktops with precision temperature control, and under-cabinet lighting systems that adjust color temperature throughout the day. Pittsburgh homeowners are increasingly requesting dedicated charging stations and built-in tablet mounts for recipe displays.

## 2. Natural Stone and Organic Materials

The ultra-modern, all-white kitchen is giving way to warmer, more natural aesthetics. We're seeing a surge in requests for quartzite and marble countertops with dramatic veining, natural wood floating shelves, and stone accent walls. Fluted wood panels on islands and cabinet fronts add texture and visual warmth that Pittsburgh families love.

## 3. Bold Color Palettes

While white kitchens aren't disappearing, we're installing more kitchens with deep forest greens, navy blues, and warm terracotta tones. Two-tone cabinetry remains popular: think white uppers with a bold color on the base cabinets, or a statement island in a contrasting hue.

## 4. Oversized Islands with Multi-Function Design

Islands are getting bigger and more functional. Our clients want islands that serve as cooking stations, homework desks, entertaining bars, and storage solutions all in one. We're building 10-to-12-foot islands with waterfall edges, integrated sinks, and built-in wine coolers as standard features.

## 5. Hidden Appliances and Clean Lines

Integrated panel-ready appliances are in high demand. Dishwashers, refrigerators, and even range hoods are being concealed behind custom cabinetry for a seamless look. Handleless cabinets with push-to-open mechanisms create clean, uninterrupted lines.

## Planning Your Kitchen Remodel

If you're considering a kitchen remodel in 2025, the most important step is working with an experienced contractor who understands both design trends and the practical realities of construction. At ABK Unlimited, we guide you through material selection, layout optimization, and every detail from demo to final walkthrough.

Ready to start planning? Contact us for a free estimate and let's bring your dream kitchen to life.`,
  },
  "bathroom-remodel-roi": {
    slug: "bathroom-remodel-roi",
    title: "Bathroom Remodel ROI: What's Worth the Investment?",
    excerpt:
      "Not all bathroom upgrades are created equal. Learn which renovations deliver the highest return on investment and which are purely for enjoyment.",
    image: "/luxury-master-bathroom-with-walk-in-shower-and-fre.jpg",
    category: "Bathroom",
    author: "ABK Unlimited Team",
    authorImage: "/abk-logo.png",
    authorBio:
      "The ABK Unlimited team is experienced in home remodeling across Greater Pittsburgh.",
    date: "January 8, 2025",
    readTime: "6 min read",
    content: `When it comes to home renovations, bathroom remodels consistently rank among the highest-ROI projects you can undertake. But not every upgrade delivers the same return. Here's our data-driven breakdown.

## The Numbers: Bathroom Remodel ROI in Pittsburgh

According to the latest Remodeling Magazine Cost vs. Value report, a midrange bathroom remodel in the Pittsburgh area returns approximately 60-70% of its cost at resale. A minor bathroom remodel (think updated fixtures, new vanity, fresh tile) can return even more, sometimes up to 75%.

## High-ROI Upgrades

**Updated Vanity and Countertop** - Replacing an outdated vanity with a modern double-sink version with quartz countertops is one of the single highest-ROI moves. Budget: $1,500-$4,000. Expected ROI: 70-80%.

**Walk-In Shower Conversion** - Converting an old tub/shower combo into a walk-in shower with glass enclosure is increasingly popular, especially for master baths. Budget: $5,000-$12,000. Expected ROI: 60-70%.

**New Tile and Flooring** - Updating floor tile and shower surrounds can dramatically change the look without a full gut renovation. Budget: $2,000-$6,000. Expected ROI: 65-75%.

**Modern Fixtures and Hardware** - Sometimes the simplest changes have the biggest impact. New faucets, showerheads, towel bars, and lighting fixtures can modernize a bathroom for under $1,000. Expected ROI: 80%+.

## Luxury Upgrades Worth It for Enjoyment

**Heated Tile Floors** - Radiant floor heating adds about $1,500-$3,000 to a project but creates a spa-like experience, especially during Pittsburgh winters. ROI at resale is modest, but the daily comfort is significant.

**Freestanding Soaking Tub** - A beautiful freestanding tub is a design statement that buyers notice. While the ROI is around 50-60%, it elevates the entire room's aesthetic.

## Our Recommendation

Focus your budget on the elements buyers see first: the vanity, the shower, and the flooring. These three upgrades deliver the most visual impact and the highest return. Then, if budget allows, add luxury touches that improve your daily life.

Contact ABK Unlimited for a free bathroom remodel consultation. We'll help you prioritize upgrades that maximize both enjoyment and value.`,
  },
  "basement-finishing-guide": {
    slug: "basement-finishing-guide",
    title: "The Complete Guide to Basement Finishing in Pittsburgh",
    excerpt:
      "Everything you need to know about transforming your Pittsburgh basement into usable living space, from moisture control to design ideas.",
    image: "/finished-basement-living-space.jpg",
    category: "Basement",
    author: "ABK Unlimited Team",
    authorImage: "/abk-logo.png",
    authorBio:
      "The ABK Unlimited team is experienced in home remodeling across Greater Pittsburgh.",
    date: "December 20, 2024",
    readTime: "10 min read",
    content: `Pittsburgh basements present unique challenges and incredible opportunities. With the right approach, your unfinished basement can become the most popular room in your home. Here's everything you need to know.

## Step 1: Moisture Assessment and Waterproofing

This is the most critical step for Pittsburgh basements. Our region's clay-heavy soil and frequent rainfall mean that moisture management must be addressed before any finishing work begins.

**Interior drainage systems** with a sump pump are standard for most Pittsburgh basements. We also recommend applying a waterproof membrane to foundation walls and installing a dehumidification system rated for the space.

**Budget: $3,000-$8,000** for a comprehensive waterproofing solution.

## Step 2: Framing and Insulation

Once the space is dry, we frame interior walls using pressure-treated lumber for the bottom plates (which contact the concrete floor). Closed-cell spray foam insulation on foundation walls provides both insulation and an additional moisture barrier, delivering R-values of R-20 or higher.

## Step 3: Electrical and Plumbing

This is the time to plan for future needs. We recommend running extra circuits for home theaters, wet bars, and workshop areas even if you're not installing those features immediately. If you're adding a bathroom (highly recommended for ROI), rough-in plumbing now to avoid costly retrofits later.

## Step 4: Flooring Options for Pittsburgh Basements

**Luxury Vinyl Plank (LVP)** is our top recommendation for Pittsburgh basements. It's waterproof, comfortable underfoot, and looks like real hardwood. Engineered hardwood and tile are also excellent options.

Avoid: traditional hardwood and carpet as primary flooring in below-grade spaces.

## Step 5: Popular Basement Layouts

**Home Theater** - Dedicated media room with acoustic treatment, tiered seating, and ambient lighting. The basement is ideal for this because it's naturally dark and sound-isolated.

**Wet Bar and Entertainment Area** - A wet bar with sink, beverage fridge, and counter seating creates a fantastic entertaining space.

**Guest Suite** - A bedroom, bathroom, and small sitting area give you a self-contained guest suite that adds significant value.

**Home Gym** - Rubber flooring, mirrors, and proper ventilation transform a basement section into a private fitness center.

## Budget Planning

A typical Pittsburgh basement finishing project runs $30-$60 per square foot for a standard finish and $60-$100+ per square foot for a premium finish with bathroom, wet bar, and custom built-ins. For a 1,000 sq ft basement, budget $30,000-$100,000 depending on scope.

Ready to transform your basement? Contact ABK Unlimited for a free assessment and estimate.`,
  },
  "deck-materials-comparison": {
    slug: "deck-materials-comparison",
    title: "Composite vs. Wood Decking: Which Is Right for Pittsburgh?",
    excerpt:
      "A comprehensive comparison of composite and wood decking materials, considering Pittsburgh's unique climate challenges.",
    image: "/custom-composite-deck-outdoor-living.jpg",
    category: "Outdoor",
    author: "ABK Unlimited Team",
    authorImage: "/abk-logo.png",
    authorBio:
      "The ABK Unlimited team is experienced in home remodeling across Greater Pittsburgh.",
    date: "December 12, 2024",
    readTime: "7 min read",
    content: `Choosing the right decking material is one of the most important decisions in your outdoor project. Pittsburgh's four-season climate with hot, humid summers and freezing, snowy winters puts unique demands on decking materials. Here's how composite and wood compare.

## Wood Decking: The Classic Choice

**Pressure-Treated Pine** is the most affordable option at $15-$25 per square foot installed. It's strong, readily available, and takes stain well. However, it requires annual maintenance (staining/sealing) and is susceptible to warping, splitting, and insect damage over time.

**Cedar and Redwood** offer natural beauty and rot resistance at $25-$40 per square foot installed. They require less maintenance than pine but still need periodic sealing. Their natural oils resist insects, but Pittsburgh's freeze-thaw cycles can cause cracking.

**Ipe and Tropical Hardwoods** are the premium wood option at $40-$60 per square foot. They're incredibly durable and beautiful but extremely hard (requiring pre-drilling for every fastener) and expensive.

## Composite Decking: The Modern Alternative

**Standard Composite** (brands like Trex Select, TimberTech) costs $30-$45 per square foot installed. Made from a blend of wood fibers and recycled plastic, these products resist rot, insects, and fading. They require minimal maintenance beyond occasional cleaning.

**Premium Composite and PVC** (Trex Transcend, TimberTech Azek) costs $45-$65 per square foot installed. These offer the most realistic wood appearance, superior scratch resistance, and 25-50 year warranties.

## Pittsburgh Climate Considerations

**Freeze-thaw cycles**: Composite decking handles Pittsburgh's temperature swings better than wood because it doesn't absorb moisture that expands when frozen.

**Humidity**: Our summer humidity causes wood to swell and contract. Composite remains dimensionally stable.

**Snow and Ice**: Composite surfaces can be shoveled without damage. Wood decks risk gouging from metal shovels.

**Sun Exposure**: Early composite products were prone to fading. Modern premium composites have UV-resistant caps that maintain color for decades.

## Our Recommendation

For most Pittsburgh homeowners, we recommend **premium composite decking**. While the upfront cost is 20-40% higher than pressure-treated wood, the total cost of ownership over 20 years is actually lower when you factor in annual staining, sealing, and board replacement costs for wood.

If you love the authentic feel of real wood and don't mind annual maintenance, **cedar** is an excellent middle-ground option.

Contact ABK Unlimited for a free deck consultation and estimate. We'll help you choose the perfect material for your project and budget.`,
  },
  "home-addition-planning": {
    slug: "home-addition-planning",
    title:
      "Planning a Home Addition: What Pittsburgh Homeowners Need to Know",
    excerpt:
      "From zoning permits to design considerations, this guide walks you through every step of planning a successful home addition.",
    image: "/home-addition-seamless-architecture.jpg",
    category: "Additions",
    author: "ABK Unlimited Team",
    authorImage: "/abk-logo.png",
    authorBio:
      "The ABK Unlimited team is experienced in home remodeling across Greater Pittsburgh.",
    date: "November 28, 2024",
    readTime: "9 min read",
    content: `A home addition is one of the most significant investments you can make in your property. When done right, it adds valuable living space and increases your home's value. Here's your comprehensive planning guide.

## Step 1: Define Your Needs

Before calling a contractor, clearly define what you need. Are you adding a bedroom for a growing family? A sunroom for year-round enjoyment? A master suite for aging in place? The purpose of your addition drives every design and budget decision that follows.

## Step 2: Understand Pittsburgh Zoning and Permits

Pittsburgh and its surrounding municipalities have specific zoning requirements that affect what you can build:

**Setback Requirements**: Most areas require minimum distances from property lines. A typical requirement is 5-10 feet from side property lines and 25 feet from the rear.

**Lot Coverage**: There's often a maximum percentage of your lot that can be covered by structures (usually 35-50%).

**Height Restrictions**: Second-story additions may face height limits depending on your zoning district.

**Historic Districts**: If your home is in a historic district, you may need approval from a historic review board. This is common in neighborhoods like Shadyside, Squirrel Hill, and the Mexican War Streets.

ABK Unlimited handles all permit applications as part of our service.

## Step 3: Choose Your Addition Type

**Bump-Out Addition (50-200 sq ft)**: Extend an existing room by a few feet. Great for expanding a kitchen or adding a mudroom. Budget: $20,000-$50,000.

**Room Addition (200-500 sq ft)**: Add a new room at ground level. Most common for family rooms, bedrooms, or sunrooms. Budget: $50,000-$150,000.

**Second-Story Addition**: Build up instead of out, ideal for smaller lots. Adds significant square footage without reducing yard space. Budget: $100,000-$300,000.

**In-Law Suite / ADU**: A self-contained living space with kitchen, bath, and separate entrance. Increasingly popular and now allowed in more Pittsburgh-area municipalities. Budget: $80,000-$200,000.

## Step 4: Design for Seamless Integration

The best additions look like they were always part of the original home. Key design principles include matching roof lines and pitch, using identical or complementary exterior materials, aligning window styles and sizes, and ensuring interior flow between old and new spaces.

## Step 5: Budget and Timeline Planning

A well-planned addition typically takes 3-6 months from design to completion. Budget should include a 10-15% contingency for unexpected issues, which are common when connecting new construction to an existing structure.

## Step 6: Choose the Right Contractor

Your addition contractor should be licensed, insured, experienced with additions specifically, and able to provide references from similar projects. At ABK Unlimited, we've completed hundreds of home additions across Greater Pittsburgh.

Ready to expand your home? Contact us for a free consultation and detailed estimate.`,
  },
  "choosing-the-right-flooring": {
    slug: "choosing-the-right-flooring",
    title: "Choosing the Right Flooring: A Room-by-Room Guide",
    excerpt:
      "Hardwood, LVP, tile, or carpet? Learn which flooring material works best for each room in your home.",
    image: "/hardwood-flooring-installation.png",
    category: "Flooring",
    author: "ABK Unlimited Team",
    authorImage: "/abk-logo.png",
    authorBio:
      "The ABK Unlimited team is experienced in home remodeling across Greater Pittsburgh.",
    date: "November 15, 2024",
    readTime: "6 min read",
    content: `Choosing flooring is one of the most impactful decisions in any renovation. The right flooring material depends on the room's function, your lifestyle, and your budget. Here's our room-by-room guide.

## Kitchen

**Best Choice: Luxury Vinyl Plank (LVP) or Porcelain Tile**

Kitchens see water spills, dropped items, and heavy foot traffic. LVP is waterproof, comfortable to stand on for extended cooking sessions, and comes in remarkably realistic wood-look finishes. Budget: $4-$8/sq ft installed.

Porcelain tile is extremely durable and water-resistant but harder underfoot. Consider adding anti-fatigue mats in front of the sink and stove. Budget: $8-$15/sq ft installed.

## Bathroom

**Best Choice: Porcelain Tile or LVP**

Water resistance is non-negotiable in bathrooms. Large-format porcelain tile with minimal grout lines creates a clean, modern look and is easy to maintain. Heated underlayment is a popular add-on for Pittsburgh homes. Budget: $8-$15/sq ft installed.

LVP is an excellent budget-friendly alternative that's 100% waterproof and warm underfoot without heating. Budget: $4-$8/sq ft installed.

## Living Room and Bedrooms

**Best Choice: Hardwood or Engineered Hardwood**

These are the rooms where real hardwood shines. Oak, maple, and hickory are popular Pittsburgh choices. Wide-plank options (5 inches and wider) create a modern, open feel. Budget: $8-$15/sq ft installed for engineered; $10-$20/sq ft for solid hardwood.

For bedrooms, quality carpet remains an excellent choice for warmth and comfort. Budget: $3-$8/sq ft installed.

## Basement

**Best Choice: Luxury Vinyl Plank (LVP)**

Basements require flooring that handles moisture. LVP is the clear winner here. It's waterproof, installs over minor subfloor imperfections, and provides a warm feel that tile can't match in below-grade spaces. Budget: $4-$8/sq ft installed.

## Entryway and Mudroom

**Best Choice: Porcelain Tile or Natural Stone**

These high-traffic areas need bulletproof flooring. Porcelain tile in a textured finish provides slip resistance and withstands wet boots, dirt, and salt. Natural stone (slate, travertine) offers beauty and durability. Budget: $10-$20/sq ft installed.

## Home Office

**Best Choice: Engineered Hardwood or LVP**

A home office benefits from flooring that looks professional on video calls and is comfortable for rolling desk chairs. Hardwood or hardwood-look LVP both work well. Avoid carpet, which makes chair movement difficult. Budget: $6-$12/sq ft installed.

## Tips for Choosing

**Consider your lifestyle**: Pets, kids, and high traffic demand more durable options. LVP and tile are the most forgiving.

**Think long-term**: Hardwood can be refinished multiple times over decades. LVP and tile are replace-only.

**Sample before committing**: Always view samples in your home's actual lighting conditions.

Contact ABK Unlimited for expert flooring consultation. We'll help you choose the right material for every room and install it with precision craftsmanship.`,
  },
}

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return { title: "Post Not Found | ABK Unlimited" }
  }

  return {
    title: `${post.title} | ABK Unlimited Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://abkunlimited.com/blog/${post.slug}`,
      images: [{ url: `https://abkunlimited.com${post.image}` }],
    },
  }
}

function renderContent(content: string) {
  return content.split("\n\n").map((block, index) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="text-2xl font-bold text-foreground mt-8 mb-4"
        >
          {block.replace("## ", "")}
        </h2>
      )
    }
    if (block.startsWith("**") && block.includes("**:")) {
      const parts = block.split("**")
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-4">
          <strong className="text-foreground">{parts[1]}</strong>
          {parts[2]}
        </p>
      )
    }
    return (
      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
        {block}
      </p>
    )
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  const shareUrl = `https://abkunlimited.com/blog/${post.slug}`
  const shareTitle = encodeURIComponent(post.title)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero with post image */}
        <section className="relative pt-32 pb-20">
          <div className="absolute inset-0">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-secondary/40" />
          </div>
          <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/70">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <article className="lg:col-span-2 prose max-w-none">
                {renderContent(post.content)}
              </article>

              {/* Sidebar */}
              <aside className="space-y-8">
                {/* Author Card */}
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    About the Author
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden">
                      <Image
                        src={post.authorImage}
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {post.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ABK Unlimited
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {post.authorBio}
                  </p>
                </div>

                {/* Share Buttons */}
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Share This Article
                  </h3>
                  <div className="flex gap-3">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                    >
                      <span className="font-bold text-sm">X</span>
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                {/* CTA Card */}
                <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
                  <h3 className="text-xl font-bold mb-3">
                    Ready to Start Your Project?
                  </h3>
                  <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
                    Get a free, no-obligation estimate from Pittsburgh&apos;s
                    most trusted contractor.
                  </p>
                  <Link href="/free-estimate">
                    <Button
                      size="lg"
                      className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
                    >
                      Get Free Estimate
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <a
                    href="tel:+14129441683"
                    className="flex items-center justify-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mt-4 text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    (412) 944-1683
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
