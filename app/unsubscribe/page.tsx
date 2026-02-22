"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    const id = searchParams.get("id")
    if (!id) {
      setStatus("error")
      return
    }

    fetch("/api/sequences/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sequenceId: id }),
    })
      .then((res) => {
        setStatus(res.ok ? "success" : "error")
      })
      .catch(() => setStatus("error"))
  }, [searchParams])

  if (status === "loading") {
    return <p className="text-muted-foreground">Processing your request...</p>
  }

  if (status === "success") {
    return (
      <>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">You&apos;ve been unsubscribed</h1>
        <p className="text-muted-foreground mb-6">
          You won&apos;t receive any more automated emails from this sequence.
          You can still contact us anytime at{" "}
          <a href="tel:+14129441683" className="text-primary font-medium">(412) 944-1683</a>.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </Link>
      </>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-foreground mb-3">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">
        Please contact us directly at{" "}
        <a href="mailto:info@abkunlimited.com" className="text-primary font-medium">
          info@abkunlimited.com
        </a>{" "}
        to be removed from our mailing list.
      </p>
    </>
  )
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-32">
        <div className="max-w-lg mx-auto px-6 text-center">
          <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
            <UnsubscribeContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
