"use client"

import { useEffect, useRef } from "react"
import { Star } from "lucide-react"

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load the reputation hub widget script
    const script = document.createElement("script")
    script.src = "https://reputationhub.site/reputation/assets/review-widget.js"
    script.type = "text/javascript"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup on unmount
      try { document.body.removeChild(script) } catch {}
    }
  }, [])

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-wider text-accent uppercase mb-4">Client Reviews</p>
          <h2 className="text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl lg:text-5xl text-balance">
            What Pittsburgh Homeowners Say
          </h2>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-secondary-foreground/80 font-medium">5.0 Average Rating</span>
          </div>
        </div>

        {/* Live CRM Review Widget */}
        <div ref={containerRef} className="rounded-2xl overflow-hidden">
          <iframe
            className="lc_reviews_widget"
            src="https://reputationhub.site/reputation/widgets/review_widget/497AdD39erWgmOu8JTCw"
            frameBorder="0"
            scrolling="no"
            style={{ minWidth: "100%", width: "100%" }}
            title="ABK Unlimited Customer Reviews"
          />
        </div>
      </div>
    </section>
  )
}
