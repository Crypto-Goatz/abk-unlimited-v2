'use client'

import { useState } from 'react'
import { Sparkles, Shield, Clock } from 'lucide-react'

export interface LeadData {
  name: string
  email: string
  phone: string
  address: string
  zipCode: string
  contactId?: string
}

interface LeadGateProps {
  onSubmit: (data: LeadData) => Promise<void>
  isSubmitting: boolean
}

export default function LeadGate({ onSubmit, isSubmitting }: LeadGateProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    zipCode: ''
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in all required fields')
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Value proposition */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Visualization</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See Your Dream Home <span className="text-primary">Before You Build</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            Our AI visualizer transforms your photos into stunning renovation previews.
            Enter your details to get started with 3 free design revisions.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">3 Free Revisions</p>
                <p className="text-sm text-muted-foreground">Perfect your design with unlimited tweaks</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Results in Seconds</p>
                <p className="text-sm text-muted-foreground">AI generates designs instantly</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">No Obligation</p>
                <p className="text-sm text-muted-foreground">Explore ideas risk-free</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="bg-card rounded-2xl shadow-xl border border-border p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground mb-2">Get Started Free</h2>
          <p className="text-muted-foreground mb-6">Enter your details to access the visualizer</p>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-background"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-background"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Phone <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-background"
                placeholder="(412) 555-1234"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Address <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-background"
                placeholder="123 Main St, Pittsburgh, PA"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Zip Code <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-background"
                placeholder="15213"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Starting...
                </span>
              ) : (
                'Start Visualizing'
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              By continuing, you agree to receive communications from ABK Unlimited.
              Your information is secure and will never be shared.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
