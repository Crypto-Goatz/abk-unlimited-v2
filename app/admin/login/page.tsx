"use client"

import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useState } from "react"
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react"

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const errorMessages: Record<string, string> = {
    unauthorized: "Your email is not authorized to access the admin panel.",
    auth_failed: "Authentication failed. Please try again.",
    no_code: "No authorization code received from Google.",
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setLoginError(data.error || "Login failed")
        setLoading(false)
        return
      }

      router.push("/admin")
      router.refresh()
    } catch {
      setLoginError("Network error. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Image
          src="/abk-logo.png"
          alt="ABK Unlimited"
          width={200}
          height={54}
          className="h-12 w-auto mx-auto brightness-0 invert"
          priority
        />
        <p className="text-white/40 text-sm mt-3 tracking-wide">Admin Portal</p>
      </div>

      {/* Login card */}
      <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-8 shadow-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-white/50 mt-1">
            Sign in to manage your ABK Unlimited website
          </p>
        </div>

        {(error || loginError) && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-300">
            {loginError || (error && errorMessages[error]) || "An error occurred. Please try again."}
          </div>
        )}

        <form onSubmit={handlePasswordLogin} className="space-y-4 mb-5">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#1a8a6a]/50 focus:border-[#1a8a6a]/50 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#1a8a6a]/50 focus:border-[#1a8a6a]/50 transition-all"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-[#14664f] text-white rounded-xl text-sm font-semibold hover:bg-[#1a8a6a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#14664f]/20"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-3 text-white/30 backdrop-blur-sm">or</span>
          </div>
        </div>

        {/* Google OAuth */}
        <a
          href="/api/auth/google"
          className="inline-flex items-center justify-center gap-3 w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm font-medium text-white/80 hover:bg-white/[0.1] hover:text-white transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </a>
      </div>

      {/* Footer */}
      <p className="text-center text-white/20 text-xs mt-6">
        Powered by RocketOpp
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#1a8a6a] rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
