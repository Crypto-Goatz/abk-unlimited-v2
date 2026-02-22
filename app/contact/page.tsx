"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { Button } from "@/components/ui/button"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  Loader2,
  MessageSquare,
} from "lucide-react"

const projectTypes = [
  "Kitchen Remodeling",
  "Bathroom Remodeling",
  "Basement Finishing",
  "Deck Building",
  "Home Addition",
  "Flooring Installation",
  "Roofing",
  "Custom Home",
  "General Inquiry",
  "Other",
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // Get attribution data from session tracker
    let attribution: Record<string, string> = {}
    try {
      const stored = sessionStorage.getItem("abk_attribution")
      if (stored) attribution = JSON.parse(stored)
      // Record conversion page
      attribution.conversion_page = window.location.pathname
      sessionStorage.setItem("abk_attribution", JSON.stringify(attribution))
    } catch {}

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      page_source: "/contact",
      ...attribution,
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit")
      }

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-16 bg-secondary overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
                Get In Touch
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
                Contact ABK Unlimited
              </h1>
              <p className="text-xl text-secondary-foreground/80">
                Have a question or ready to start your project? We&apos;d love to hear from you.
                Reach out by phone, email, or fill out the form below.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content - 2 Column */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form - Left */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>

                {isSuccess ? (
                  <div className="bg-card rounded-2xl border border-border p-8 shadow-sm text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-4">
                      Thank you for reaching out. We&apos;ll get back to you within one business day.
                    </p>
                    <Link href="/">
                      <Button>Return to Home</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                          {error}
                        </div>
                      )}

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-foreground">
                            Full Name *
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="John Smith"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email Address *
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium text-foreground">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="(412) 555-1234"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="subject" className="text-sm font-medium text-foreground">
                            Subject *
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="">Select a topic...</option>
                            {projectTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-foreground">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          required
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[120px]"
                          placeholder="How can we help you? Tell us about your project or question..."
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </div>

              {/* Contact Info - Right */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>

                {/* Phone Card */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <a
                        href="tel:+14129441683"
                        className="text-lg text-primary hover:underline font-medium"
                      >
                        (412) 944-1683
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        Call or text anytime
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a
                        href="mailto:info@abkunlimited.com"
                        className="text-lg text-primary hover:underline font-medium"
                      >
                        info@abkunlimited.com
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        We respond within one business day
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Area Card */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Service Area</h3>
                      <p className="text-foreground">Pittsburgh, PA 15205</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Serving all of Greater Pittsburgh and surrounding communities
                      </p>
                      <Link
                        href="/service-areas"
                        className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-2 hover:underline"
                      >
                        View all service areas <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Business Hours Card */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Business Hours</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between gap-8">
                          <span className="text-muted-foreground">Monday - Friday</span>
                          <span className="text-foreground font-medium">7:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span className="text-muted-foreground">Saturday</span>
                          <span className="text-foreground font-medium">8:00 AM - 2:00 PM</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span className="text-muted-foreground">Sunday</span>
                          <span className="text-foreground font-medium">Closed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prefer to Talk Card */}
                <div className="bg-primary rounded-2xl p-6 text-center">
                  <MessageSquare className="h-8 w-8 text-primary-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-primary-foreground mb-2">Prefer to Talk?</h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">
                    Skip the form and speak directly with our team.
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 w-full"
                    asChild
                  >
                    <a href="tel:+14129441683">
                      <Phone className="mr-2 h-4 w-4" />
                      (412) 944-1683
                    </a>
                  </Button>
                  <p className="text-primary-foreground/60 text-xs mt-3">
                    Mon-Fri 7am-6pm, Sat 8am-2pm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-muted/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Find Us</h2>
              <p className="text-muted-foreground">
                Based in Pittsburgh&apos;s Crafton neighborhood, serving all of Greater Pittsburgh.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48537.17454370175!2d-80.08!3d40.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8834f1565c23c531%3A0x6d8e2e97c3a3e8a7!2sPittsburgh%2C%20PA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ABK Unlimited location in Pittsburgh, PA"
                className="w-full"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
