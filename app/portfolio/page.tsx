import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Portfolio | ABK Unlimited Pittsburgh Home Remodeling Projects",
  description:
    "Browse completed projects by ABK Unlimited. Kitchen remodels, bathroom renovations, basement finishing, deck building, and more across Greater Pittsburgh.",
  openGraph: {
    title: "Our Portfolio | ABK Unlimited",
    description:
      "See the quality of our work. Browse completed kitchen, bathroom, basement, deck, and home addition projects across Pittsburgh.",
    url: "https://abkunlimited.com/portfolio",
    type: "website",
  },
}

const categories = [
  "All",
  "Kitchen",
  "Bathroom",
  "Basement",
  "Deck",
  "Additions",
  "Flooring",
]

const stats = [
  { value: "Hundreds", label: "Projects Completed" },
  { value: "18+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "5.0", label: "Google Rating", hasStars: true },
]

const featuredProjects = [
  {
    title: "Modern Kitchen Transformation",
    category: "Kitchen",
    image: "/modern-white-kitchen-remodel-quartz-countertops.jpg",
    description:
      "Complete kitchen overhaul featuring custom white shaker cabinets, quartz countertops, a 10-foot island with waterfall edge, and professional-grade appliances.",
    location: "Mt. Lebanon, PA",
    duration: "8 weeks",
    investment: "$85,000",
  },
  {
    title: "Luxury Master Bathroom Retreat",
    category: "Bathroom",
    image: "/luxury-master-bathroom-renovation-walk-in-shower.jpg",
    description:
      "Spa-inspired master bathroom with walk-in rain shower, freestanding soaking tub, heated tile floors, and custom double vanity with quartz tops.",
    location: "Upper St. Clair, PA",
    duration: "6 weeks",
    investment: "$62,000",
  },
  {
    title: "Finished Basement Entertainment Space",
    category: "Basement",
    image: "/finished-basement-home-theater-with-bar.jpg",
    description:
      "Full basement build-out with home theater, wet bar, gym area, and guest bedroom suite. Features LVP flooring and a custom-built entertainment center.",
    location: "Bethel Park, PA",
    duration: "10 weeks",
    investment: "$95,000",
  },
]

const projectGrid = [
  {
    title: "Farmhouse Kitchen Remodel",
    category: "Kitchen",
    image: "/farmhouse-kitchen-shaker-cabinets.jpg",
    location: "Sewickley, PA",
  },
  {
    title: "Contemporary Double Vanity Bath",
    category: "Bathroom",
    image: "/contemporary-double-vanity-bathroom.jpg",
    location: "Moon Township, PA",
  },
  {
    title: "Custom Composite Deck",
    category: "Deck",
    image: "/custom-composite-deck-with-outdoor-furniture-and-c.jpg",
    location: "Peters Township, PA",
  },
  {
    title: "Sunroom Addition",
    category: "Additions",
    image: "/sunroom-addition-with-large-windows-natural-light.jpg",
    location: "Cranberry Township, PA",
  },
  {
    title: "Hardwood Flooring Installation",
    category: "Flooring",
    image: "/hardwood-floor-installation-in-living-room.jpg",
    location: "Mt. Lebanon, PA",
  },
  {
    title: "Open Concept Kitchen & Living",
    category: "Kitchen",
    image: "/open-concept-kitchen-living-room-renovation.jpg",
    location: "Pittsburgh, PA",
  },
]

export default function PortfolioPage() {
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
                Our Work
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Our Portfolio
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Browse our completed projects and see the quality craftsmanship
                that has made ABK Unlimited Pittsburgh&apos;s most trusted
                contractor.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-8 bg-primary">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl md:text-3xl font-bold text-primary-foreground">
                      {stat.value}
                    </span>
                    {stat.hasStars && (
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                  <div className="text-primary-foreground/70 text-sm mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border sticky top-[72px] bg-background/95 backdrop-blur-md z-30">
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

        {/* Featured Projects */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                Featured Work
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Projects
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A closer look at some of our most impressive recent
                transformations.
              </p>
            </div>
            <div className="space-y-16">
              {featuredProjects.map((project, index) => (
                <div
                  key={project.title}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`relative h-[400px] rounded-2xl overflow-hidden shadow-xl ${
                      index % 2 === 1 ? "lg:order-2" : ""
                    }`}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {project.description}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-muted rounded-xl p-4 text-center">
                        <div className="text-sm text-muted-foreground">
                          Location
                        </div>
                        <div className="font-semibold text-foreground text-sm mt-1">
                          {project.location}
                        </div>
                      </div>
                      <div className="bg-muted rounded-xl p-4 text-center">
                        <div className="text-sm text-muted-foreground">
                          Duration
                        </div>
                        <div className="font-semibold text-foreground text-sm mt-1">
                          {project.duration}
                        </div>
                      </div>
                      <div className="bg-muted rounded-xl p-4 text-center">
                        <div className="text-sm text-muted-foreground">
                          Investment
                        </div>
                        <div className="font-semibold text-foreground text-sm mt-1">
                          {project.investment}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Grid */}
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                More Projects
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Every project gets the same attention to detail and commitment
                to quality.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectGrid.map((project) => (
                <div
                  key={project.title}
                  className="group bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-secondary">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Your Project Could Be Next
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Ready to transform your home? Get a free estimate and see why
              homeowners across Pittsburgh trust ABK Unlimited.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/free-estimate">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                >
                  Get Free Estimate
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <a href="tel:+14129441683">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  (412) 944-1683
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
