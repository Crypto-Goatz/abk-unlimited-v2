import type { Metadata } from "next"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import VisualizerApp from "./components/VisualizerApp"
import { getSiteConfig } from "@/config/site.config"

export const metadata: Metadata = {
  title: "AI Home Visualizer | ABK Unlimited Pittsburgh Home Remodeling",
  description:
    "Visualize your home renovation with AI. Upload a photo of your room or home exterior and see instant design transformations. Free tool from ABK Unlimited, Pittsburgh's trusted contractor.",
}

export default function VisualizerPage() {
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
                AI-Powered Design Tool
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Home Canvas AI</h1>
              <p className="text-xl text-white/80">
                Your AI-powered home renovation assistant. Generate your dream space from a description, or upload a photo of your own room to start designing.
              </p>
            </div>
          </div>
        </section>

        {/* Visualizer App */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <VisualizerApp />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Make Your Vision a Reality?</h2>
            <p className="text-muted-foreground mb-8">
              Once you&apos;ve visualized your dream renovation, let ABK Unlimited bring it to life.
              Our expert team has been transforming Pittsburgh homes for over 15 years.
            </p>
            <a
              href="/free-estimate"
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
            >
              Get Your Free Estimate
            </a>
          </div>
        </section>
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} />
    </>
  )
}
