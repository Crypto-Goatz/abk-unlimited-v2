import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, User, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog | ABK Unlimited Pittsburgh Home Remodeling Tips & Guides",
  description:
    "Expert home remodeling tips, trends, and guides from ABK Unlimited. Learn about kitchen renovations, bathroom design, basement finishing, and more.",
  openGraph: {
    title: "Home Remodeling Blog | ABK Unlimited",
    description:
      "Expert tips and guides for your next home renovation project. Kitchen trends, bathroom ROI, basement ideas, and more from Pittsburgh's trusted contractor.",
    url: "https://abkunlimited.com/blog",
    type: "website",
  },
}

const categories = [
  "All",
  "Kitchen",
  "Bathroom",
  "Basement",
  "Outdoor",
  "Additions",
  "Flooring",
]

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  image: string
  category: string
  author: string
  date: string
  readTime: string
}

const featuredPosts: BlogPost[] = [
  {
    slug: "kitchen-remodeling-trends-2025",
    title: "Top Kitchen Remodeling Trends for 2025",
    excerpt:
      "From smart appliances to natural stone finishes, discover the top kitchen design trends that Pittsburgh homeowners are embracing this year. Learn what's in, what's out, and how to make your kitchen remodel both beautiful and functional.",
    image: "/modern-white-kitchen-renovation-with-island-and-pe.jpg",
    category: "Kitchen",
    author: "ABK Unlimited Team",
    date: "January 15, 2025",
    readTime: "8 min read",
  },
  {
    slug: "bathroom-remodel-roi",
    title: "Bathroom Remodel ROI: What's Worth the Investment?",
    excerpt:
      "Not all bathroom upgrades are created equal. Learn which renovations deliver the highest return on investment and which are purely for enjoyment.",
    image: "/luxury-master-bathroom-with-walk-in-shower-and-fre.jpg",
    category: "Bathroom",
    author: "ABK Unlimited Team",
    date: "January 8, 2025",
    readTime: "6 min read",
  },
  {
    slug: "basement-finishing-guide",
    title: "The Complete Guide to Basement Finishing in Pittsburgh",
    excerpt:
      "Everything you need to know about transforming your Pittsburgh basement into usable living space, from moisture control to design ideas.",
    image: "/finished-basement-living-space.jpg",
    category: "Basement",
    author: "ABK Unlimited Team",
    date: "December 20, 2024",
    readTime: "10 min read",
  },
]

const regularPosts: BlogPost[] = [
  {
    slug: "deck-materials-comparison",
    title: "Composite vs. Wood Decking: Which Is Right for Pittsburgh?",
    excerpt:
      "A comprehensive comparison of composite and wood decking materials, considering Pittsburgh's unique climate and what each option means for maintenance, longevity, and budget.",
    image: "/custom-composite-deck-outdoor-living.jpg",
    category: "Outdoor",
    author: "ABK Unlimited Team",
    date: "December 12, 2024",
    readTime: "7 min read",
  },
  {
    slug: "home-addition-planning",
    title: "Planning a Home Addition: What Pittsburgh Homeowners Need to Know",
    excerpt:
      "From zoning permits to design considerations, this guide walks you through every step of planning a successful home addition in the Greater Pittsburgh area.",
    image: "/home-addition-seamless-architecture.jpg",
    category: "Additions",
    author: "ABK Unlimited Team",
    date: "November 28, 2024",
    readTime: "9 min read",
  },
  {
    slug: "choosing-the-right-flooring",
    title: "Choosing the Right Flooring: A Room-by-Room Guide",
    excerpt:
      "Hardwood, LVP, tile, or carpet? Learn which flooring material works best for each room in your home, plus tips for staying on budget without sacrificing quality.",
    image: "/hardwood-flooring-installation.png",
    category: "Flooring",
    author: "ABK Unlimited Team",
    date: "November 15, 2024",
    readTime: "6 min read",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-secondary overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/20" />
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
                Blog
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Home Remodeling Insights
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Expert tips, design inspiration, and practical guides to help
                you plan your next home renovation project.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === "All"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* First featured post spans 2 columns */}
              <Link
                href={`/blog/${featuredPosts[0].slug}`}
                className="group md:col-span-2"
              >
                <div className="grid md:grid-cols-2 gap-0 bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all">
                  <div className="relative h-64 md:h-full min-h-[300px]">
                    <Image
                      src={featuredPosts[0].image}
                      alt={featuredPosts[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        {featuredPosts[0].category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {featuredPosts[0].author}
                      </span>
                      <span>{featuredPosts[0].date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {featuredPosts[0].readTime}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {featuredPosts[0].title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {featuredPosts[0].excerpt}
                    </p>
                    <span className="text-primary font-medium flex items-center gap-2">
                      Read Article{" "}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Second and third featured posts */}
              {featuredPosts.slice(1).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all h-full">
                    <div className="relative h-56">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Regular Posts */}
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Latest Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all h-full">
                    <div className="relative h-52">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1 text-primary font-medium text-sm mt-4">
                        Read More{" "}
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 bg-primary">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <Mail className="h-12 w-12 text-primary-foreground/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Get Remodeling Tips Delivered
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join 2,000+ Pittsburgh homeowners who get our weekly renovation
              tips, project inspiration, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold"
              >
                Subscribe
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <p className="text-primary-foreground/60 text-sm mt-4">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
