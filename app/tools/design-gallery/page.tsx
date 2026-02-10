"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Palette, Heart, ExternalLink, X, Mail, Sparkles } from "lucide-react"

const categories = ["All", "Kitchens", "Bathrooms", "Basements", "Decks", "Additions", "Flooring"]

const galleryItems = [
  {
    id: 1,
    title: "Modern White Kitchen",
    category: "Kitchens",
    image: "/modern-white-kitchen-remodel-quartz-countertops.jpg",
    style: "Modern",
  },
  {
    id: 2,
    title: "Traditional Cherry Kitchen",
    category: "Kitchens",
    image: "/traditional-kitchen-cherry-cabinets.jpg",
    style: "Traditional",
  },
  {
    id: 3,
    title: "Farmhouse Kitchen",
    category: "Kitchens",
    image: "/farmhouse-kitchen-shaker-cabinets.jpg",
    style: "Farmhouse",
  },
  {
    id: 4,
    title: "Contemporary Island Kitchen",
    category: "Kitchens",
    image: "/contemporary-kitchen-island-pendant-lights.jpg",
    style: "Contemporary",
  },
  {
    id: 5,
    title: "Luxury Spa Bathroom",
    category: "Bathrooms",
    image: "/luxury-bathroom-freestanding-tub.jpg",
    style: "Luxury",
  },
  {
    id: 6,
    title: "Modern Walk-In Shower",
    category: "Bathrooms",
    image: "/modern-bathroom-walk-in-shower-glass.jpg",
    style: "Modern",
  },
  {
    id: 7,
    title: "Double Vanity Bath",
    category: "Bathrooms",
    image: "/contemporary-double-vanity-bathroom.jpg",
    style: "Contemporary",
  },
  {
    id: 8,
    title: "Natural Stone Spa",
    category: "Bathrooms",
    image: "/spa-bathroom-natural-stone.jpg",
    style: "Spa",
  },
  {
    id: 9,
    title: "Entertainment Basement",
    category: "Basements",
    image: "/finished-basement-living-space.jpg",
    style: "Modern",
  },
  {
    id: 10,
    title: "Basement Transformation",
    category: "Basements",
    image: "/basement-transformation-before-after.jpg",
    style: "Contemporary",
  },
  {
    id: 11,
    title: "Multi-Level Composite Deck",
    category: "Decks",
    image: "/custom-composite-deck-outdoor-living.jpg",
    style: "Modern",
  },
  {
    id: 12,
    title: "Classic Wood Deck",
    category: "Decks",
    image: "/custom-wooden-deck-outdoor.jpg",
    style: "Traditional",
  },
]

function SaveInspirationModal({
  isOpen,
  onClose,
  itemTitle,
}: {
  isOpen: boolean
  onClose: () => void
  itemTitle: string
}) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSuccess(true)
    setTimeout(() => {
      onClose()
      setIsSuccess(false)
      setEmail("")
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl border border-border w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors z-10"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-primary to-primary/80 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-white fill-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Save Your Inspiration</h3>
          <p className="text-white/80 mt-2 text-sm">
            Enter your email to save "{itemTitle}" and build your dream home collection
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">Saved!</h4>
              <p className="text-muted-foreground mt-2">Check your email to access your inspiration collection.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Save to My Collection
                  </span>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                We'll send you a link to access your saved designs. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DesignGalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string>("")

  const filteredItems =
    activeCategory === "All" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory)

  const handleHeartClick = (title: string) => {
    setSelectedItem(title)
    setModalOpen(true)
  }

  return (
    <>
      <Header siteName={process.env.NEXT_PUBLIC_SITE_NAME || "ABK Unlimited"} phone={process.env.NEXT_PUBLIC_SITE_PHONE} />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-16 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Link href="/tools" className="text-primary hover:underline text-sm font-medium mb-4 inline-block">
                ← Back to Tools
              </Link>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center border-2 border-primary">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <span className="text-white/70">Free Tool</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Design Inspiration Gallery</h1>
              <p className="text-lg sm:text-xl text-white/80">
                Browse hundreds of design ideas for your home remodeling project. Click the heart icon to save your
                favorites.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-4 sm:py-6 bg-muted border-b border-border sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 justify-start sm:justify-center overflow-x-auto pb-2 sm:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    category === activeCategory
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground hover:bg-primary/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="group relative rounded-xl overflow-hidden bg-card shadow-sm">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Hover Actions */}
                    <div className="absolute inset-0 flex items-end justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div>
                        <h3 className="text-white font-bold">{item.title}</h3>
                        <p className="text-white/80 text-sm">{item.style}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleHeartClick(item.title)}
                          className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        >
                          <Heart className="h-4 w-4 text-white" />
                        </button>
                        <button className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                          <ExternalLink className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-primary">{item.category}</span>
                      <button
                        onClick={() => handleHeartClick(item.title)}
                        className="sm:hidden w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
                      >
                        <Heart className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-foreground mt-1">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Designs
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">Found Your Inspiration?</h2>
            <p className="text-lg sm:text-xl text-white/80 mb-8">
              Let's bring your vision to life. Get a free estimate on your dream remodel.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/free-estimate">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90"
                >
                  Get Free Estimate
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10 bg-transparent"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer siteName={process.env.NEXT_PUBLIC_SITE_NAME || "ABK Unlimited"} phone={process.env.NEXT_PUBLIC_SITE_PHONE} email={process.env.NEXT_PUBLIC_SITE_EMAIL} />

      <SaveInspirationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} itemTitle={selectedItem} />
    </>
  )
}
