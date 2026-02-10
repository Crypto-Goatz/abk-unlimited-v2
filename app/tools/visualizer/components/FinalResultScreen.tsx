'use client'

import { Check, Save, Download } from 'lucide-react'
import Link from 'next/link'

interface FinalResultScreenProps {
  imageUrl: string
  enhancements: string[]
  onStartOver: () => void
  onSaveDesign?: () => void
  isSaving?: boolean
}

export default function FinalResultScreen({ imageUrl, enhancements, onStartOver, onSaveDesign, isSaving }: FinalResultScreenProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `abk-design-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in bg-card p-6 md:p-8 rounded-xl shadow-2xl border border-border">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Image Column */}
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">Your Dream Home, Realized.</h2>
          <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-border">
            <img src={imageUrl} alt="Final renovated home" className="w-full h-full object-cover" />
          </div>
          {/* Image action buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            {onSaveDesign && (
              <button
                onClick={onSaveDesign}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save to My Account
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* CTA & Enhancements Column */}
        <div className="flex flex-col justify-center bg-muted/50 p-6 md:p-8 rounded-lg">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Professional Touches Added</h3>
            <p className="text-muted-foreground mb-4">Our AI applied these enhancements to bring your vision to life:</p>
            <ul className="space-y-2 mb-8">
              {enhancements.map((item, index) => (
                <li key={index} className="flex items-center text-foreground">
                  <Check className="h-6 w-6 text-primary flex-shrink-0 mr-3" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary/10 border-t-4 border-primary rounded-b-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-foreground">Ready to make this a reality?</h3>
            <p className="mt-2 mb-6 text-foreground/80">Schedule your free, no-obligation consultation with our renovation experts to get a quote and timeline.</p>
            <Link
              href="/free-estimate"
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg w-full md:w-auto"
            >
              Get Your Free Estimate
            </Link>
          </div>
          <div className="text-center mt-6">
            <button
              onClick={onStartOver}
              className="text-sm text-muted-foreground hover:text-foreground font-semibold"
            >
              Or, Start a New Project
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
