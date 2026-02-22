"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/admin/Sidebar"
import { CRMChatWidget } from "@/components/site/CRMChatWidget"
import { LogOut, Bell } from "lucide-react"

interface User {
  email: string
  name: string
  picture: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isLoginPage) return
    fetch("/api/auth")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user)
      })
      .catch(() => {})
  }, [isLoginPage])

  if (isLoginPage) {
    return <>{children}</>
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" })
    window.location.href = "/admin/login"
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6f5]">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200/80 px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1a8a6a] animate-pulse" />
            <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">ABK Unlimited</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
              <Bell className="w-4 h-4" />
            </button>
            {user && (
              <>
                <div className="h-5 w-px bg-gray-200" />
                <div className="flex items-center gap-2.5">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt=""
                      className="w-7 h-7 rounded-full ring-2 ring-[#14664f]/10"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#14664f]/10 flex items-center justify-center text-xs font-bold text-[#14664f]">
                      {user.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                  )}
                  <span className="text-sm text-gray-600 hidden sm:block">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-6xl">{children}</div>
        </main>
      </div>
      {/* RocketOpp support chat — admin only */}
      <CRMChatWidget widgetId={process.env.NEXT_PUBLIC_ADMIN_CHAT_WIDGET_ID} />
    </div>
  )
}
