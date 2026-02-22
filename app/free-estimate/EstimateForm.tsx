"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Loader2 } from "lucide-react"

const services = [
  "Kitchen Remodeling",
  "Bathroom Remodeling",
  "Basement Finishing",
  "Deck Building",
  "Home Additions",
  "Flooring Installation",
  "Custom Homes",
  "Commercial Construction",
]

export function EstimateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  function toggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    )
  }

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
      attribution.conversion_page = window.location.pathname
      sessionStorage.setItem("abk_attribution", JSON.stringify(attribution))
    } catch {}

    const data = {
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      zipCode: formData.get("zip"),
      state: "PA",
      services: selectedServices,
      service: selectedServices.join(", "),
      projectTimeline: formData.get("timeline"),
      budget: formData.get("budget"),
      message: `
Address: ${formData.get("address")}, ${formData.get("city")}, PA ${formData.get("zip")}
Timeline: ${formData.get("timeline")}
Budget: ${formData.get("budget")}
Description: ${formData.get("description")}
      `.trim(),
      source: "free-estimate",
      landingPage: attribution.landing_page || "",
      utmSource: attribution.utm_source || "",
      utmMedium: attribution.utm_medium || "",
      utmCampaign: attribution.utm_campaign || "",
      // Pass full attribution for Sheets sync
      ...Object.fromEntries(
        Object.entries(attribution).map(([k, v]) => [`_attr_${k}`, v])
      ),
    }

    try {
      const response = await fetch("/api/leads", {
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
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-card rounded-2xl p-8 shadow-lg border border-border text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Request Received!</h2>
        <p className="text-muted-foreground mb-4">
          Thank you for requesting a free estimate from ABK Unlimited!
        </p>
        <p className="text-muted-foreground mb-6">
          Our team will review your project details and get back to you within 24 hours with next steps.
        </p>
        <Button onClick={() => window.location.href = "/"}>
          Return to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
      <h2 className="text-2xl font-bold text-foreground mb-2">Request Your Estimate</h2>
      <p className="text-muted-foreground mb-8">
        The more details you provide, the more accurate your estimate will be.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Contact Information */}
        <div>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center">
              1
            </span>
            Contact Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" name="lastName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
          </div>
        </div>

        {/* Property Information */}
        <div>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center">
              2
            </span>
            Property Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input id="address" name="address" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code *</Label>
              <Input id="zip" name="zip" required />
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center">
              3
            </span>
            Project Details
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Services Needed *</Label>
              <div className="grid grid-cols-2 gap-2">
                {services.map((service) => (
                  <label key={service} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-input"
                      checked={selectedServices.includes(service)}
                      onChange={() => toggleService(service)}
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">When do you want to start?</Label>
              <select
                id="timeline"
                name="timeline"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select timeline...</option>
                <option value="asap">As soon as possible</option>
                <option value="1month">Within 1 month</option>
                <option value="3months">Within 3 months</option>
                <option value="6months">Within 6 months</option>
                <option value="planning">Just planning</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Estimated Budget</Label>
              <select
                id="budget"
                name="budget"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select budget range...</option>
                <option value="under25k">Under $25,000</option>
                <option value="25-50k">$25,000 - $50,000</option>
                <option value="50-100k">$50,000 - $100,000</option>
                <option value="100-200k">$100,000 - $200,000</option>
                <option value="over200k">Over $200,000</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Tell us about your project goals, any specific requirements, and what you're hoping to achieve..."
              />
            </div>
          </div>
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
              Submitting...
            </>
          ) : (
            "Submit Estimate Request"
          )}
        </Button>
      </form>
    </div>
  )
}
