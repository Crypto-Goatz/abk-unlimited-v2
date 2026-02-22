import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Award,
  Users,
  Clock,
  CheckCircle,
  Phone,
  ArrowRight,
  Star,
  Hammer,
  Home,
  Heart,
} from "lucide-react"

export const metadata: Metadata = {
  title: "About ABK Unlimited | Pittsburgh General Contractor | Licensed & Insured",
  description:
    "ABK Unlimited is a family-owned general contracting company serving Greater Pittsburgh. PA Licensed (HIC #PA163301), BBB A+ Rated, and Best of Houzz 2025 winner. Kitchen, bathroom, basement, and whole-home remodeling.",
  openGraph: {
    title: "About ABK Unlimited | Pittsburgh General Contractor",
    description:
      "Family-owned Pittsburgh contractor. PA Licensed, BBB A+ Rated, Best of Houzz 2025. Kitchen remodeling, bathroom renovations, basement finishing, decks, and more.",
    url: "https://abkunlimited.com/about",
    type: "website",
  },
}

const coreValues = [
  {
    icon: Shield,
    title: "Integrity First",
    description:
      "We do what we say we'll do. Transparent pricing, honest timelines, and no surprises. Our reputation is built on trust — and we plan to keep it that way.",
  },
  {
    icon: Award,
    title: "Uncompromising Quality",
    description:
      "Every project meets the highest standards of craftsmanship. We use premium materials and proven techniques to deliver results that stand the test of time.",
  },
  {
    icon: Users,
    title: "Family Values",
    description:
      "As a family-owned business, we treat every client like family. Your home is your most important investment, and we respect that with every decision we make.",
  },
  {
    icon: Clock,
    title: "Reliability",
    description:
      "On-time, on-budget, every time. We show up when we say we will and finish when we promise. That's the ABK guarantee.",
  },
]

const milestones = [
  {
    year: "2020",
    title: "ABK Unlimited Founded",
    description:
      "ABK Unlimited launches in Pittsburgh with a clear mission: deliver honest, high-quality home remodeling to Western PA families. Licensed and insured from day one.",
  },
  {
    year: "2021",
    title: "Rapid Growth Through Referrals",
    description:
      "Word-of-mouth drives early growth as completed kitchen and bathroom projects earn 5-star reviews. Service area expands across Allegheny County.",
  },
  {
    year: "2023",
    title: "BBB A+ Rating Earned",
    description:
      "Earns an A+ rating from the Better Business Bureau — the highest rating available. Becomes one of Pittsburgh's top-reviewed remodeling contractors on Houzz.",
  },
  {
    year: "2025",
    title: "Best of Houzz 2025",
    description:
      "Awarded Best of Houzz 2025, recognizing exceptional service and quality. Expands services to include home additions, commercial work, and full design-build projects.",
  },
]

const credentials = [
  { label: "PA Licensed", detail: "HIC #PA163301" },
  { label: "Fully Insured", detail: "Liability & Workers' Comp" },
  { label: "BBB A+ Rated", detail: "Highest Rating" },
  { label: "Best of Houzz", detail: "2025 Winner" },
  { label: "5-Star Reviews", detail: "Across Platforms" },
  { label: "BuildZoom 90", detail: "Top Contractor Score" },
]

const stats = [
  { value: "A+", label: "BBB Rating" },
  { value: "5.0", label: "Houzz Rating", icon: true },
  { value: "50+", label: "Communities Served" },
  { value: "5", label: "Years Strong" },
]

const services = [
  { icon: Home, name: "Kitchen Remodeling" },
  { icon: Home, name: "Bathroom Renovations" },
  { icon: Hammer, name: "Basement Finishing" },
  { icon: Home, name: "Deck Building" },
  { icon: Home, name: "Home Additions" },
  { icon: Hammer, name: "Flooring Installation" },
  { icon: Hammer, name: "General Contracting" },
  { icon: Heart, name: "Interior Design" },
]

export default function AboutPage() {
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
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Pittsburgh&apos;s Trusted Home Remodeling Partner
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Family-owned. Locally operated. PA Licensed &amp; Insured.
                We&apos;ve earned a BBB A+ rating and Best of Houzz 2025 by doing
                one thing right: treating every home like it&apos;s our own.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                  Our Story
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Built on Hard Work &amp; Honest Values
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    ABK Unlimited was founded in{" "}
                    <strong className="text-foreground">2020</strong> right here
                    in Pittsburgh, PA. What started as a small, hands-on contracting
                    operation quickly grew through word-of-mouth referrals and a
                    simple commitment: show up on time, do exceptional work, and
                    treat every client like family.
                  </p>
                  <p>
                    As a family-owned business, we take personal pride in every
                    project — from kitchen renovations in Mt. Lebanon to basement
                    finishes in Moon Township. We don&apos;t cut corners, we don&apos;t
                    disappear mid-project, and we don&apos;t pad invoices. That approach
                    has earned us a{" "}
                    <strong className="text-foreground">
                      BBB A+ rating, a 5.0 on Houzz, and the Best of Houzz 2025 award
                    </strong>.
                  </p>
                  <p>
                    Today, ABK Unlimited serves over 50 communities across
                    Greater Pittsburgh with a full range of residential and
                    commercial remodeling services. From kitchens and bathrooms
                    to whole-home additions and commercial buildouts, we bring
                    the same dedication to quality and client care that built
                    our reputation from day one.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/professional-contractor-team-portrait-in-front-of-.jpg"
                    alt="ABK Unlimited team on a job site in Pittsburgh"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl">
                  <div className="text-3xl font-bold">A+</div>
                  <div className="text-sm text-primary-foreground/80">
                    BBB Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services We Offer */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                What We Do
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Full-Service Home Remodeling
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                One contractor for your entire project — from design through final walkthrough.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.map((svc) => (
                <div
                  key={svc.name}
                  className="bg-card rounded-xl p-5 text-center shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <svc.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="font-semibold text-foreground text-sm">
                    {svc.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What We Stand For
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                These core values guide every decision we make and every nail we
                drive.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreValues.map((value) => (
                <div
                  key={value.title}
                  className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                Our Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Growing With Pittsburgh
              </h2>
            </div>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className="relative flex gap-8 items-start"
                  >
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${
                          index % 2 === 0
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {milestone.year}
                      </div>
                    </div>
                    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                Credentials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Licensed, Insured &amp; Recognized
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We maintain the highest professional standards and have earned
                recognition across every major platform.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {credentials.map((cred) => (
                <div
                  key={cred.label}
                  className="bg-card rounded-xl p-4 text-center shadow-sm border border-border"
                >
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="font-semibold text-foreground text-sm">
                    {cred.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {cred.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-primary">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl md:text-5xl font-bold text-primary-foreground">
                      {stat.value}
                    </span>
                    {stat.icon && (
                      <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                  <div className="text-primary-foreground/70 mt-2 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team — Generic, no fake names */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                Our Team
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Skilled Professionals, Real Results
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our team includes experienced project managers, licensed
                tradespeople, and dedicated support staff — all committed to
                delivering exceptional results on every project.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Project Management</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Dedicated project managers oversee every job from start to finish —
                  coordinating schedules, managing budgets, and keeping you informed
                  at every step.
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Hammer className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Skilled Trades</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our licensed craftsmen handle everything from framing and electrical
                  to finish carpentry and tile work. No subcontractor roulette — you
                  get our team, every time.
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Client Care</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  From your initial consultation through warranty support, our
                  client care team ensures you have a seamless, stress-free
                  experience from start to finish.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-secondary">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your vision. Get a free, no-obligation estimate
              from Pittsburgh&apos;s most trusted contractor.
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
