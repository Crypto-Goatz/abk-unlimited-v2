import type { Metadata } from "next"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { EstimateForm } from "./EstimateForm"
import { getSiteConfig } from "@/config/site.config"

export const metadata: Metadata = {
  title: "Free Estimate | ABK Unlimited Pittsburgh Home Remodeling",
  description:
    "Request a free home remodeling estimate from ABK Unlimited. Kitchen, bathroom, basement, deck, and more. Serving Pittsburgh and surrounding areas.",
}

export default function FreeEstimatePage() {
  const config = getSiteConfig();
  return (
    <>
      <Header siteName={config.name} phone={config.phone} />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-8 bg-secondary">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
                No Obligation
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get Your Free Estimate</h1>
              <p className="text-xl text-white/80">
                Tell us about your project and we&apos;ll provide a detailed estimate within 24 hours.
                No obligation, no pressure.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-12 bg-background">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <EstimateForm />
          </div>
        </section>
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} />
    </>
  )
}
