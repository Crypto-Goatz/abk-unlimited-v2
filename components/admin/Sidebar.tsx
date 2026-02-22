"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Sparkles,
  BarChart3,
  Search,
  Settings,
  Blocks,
  ArrowLeft,
  Users,
  Webhook,
  Code2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface User {
  email: string
  name: string
  picture: string
}

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/ai", label: "AI Writer", icon: Sparkles },
  { href: "/admin/crm", label: "CRM", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/sxo", label: "SXO", icon: Search },
  { href: "/admin/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/admin/api-builder", label: "API Builder", icon: Code2 },
  { href: "/admin/apps", label: "Apps", icon: Blocks },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ user }: { user?: User | null }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#0a1a14] text-white min-h-screen flex flex-col shrink-0 border-r border-white/[0.06]">
      {/* ABK Logo */}
      <div className="p-5 border-b border-white/[0.06]">
        <Link href="/admin" className="block">
          <Image
            src="/abk-logo.png"
            alt="ABK Unlimited"
            width={160}
            height={44}
            className="h-9 w-auto brightness-0 invert"
          />
        </Link>
        <p className="text-[11px] text-white/30 mt-2 tracking-widest uppercase">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-[#14664f] text-white shadow-md shadow-[#14664f]/20"
                  : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
              )}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/[0.06]">
        {user && (
          <div className="px-4 py-3 flex items-center gap-2.5">
            {user.picture ? (
              <img
                src={user.picture}
                alt=""
                className="w-8 h-8 rounded-full shrink-0 ring-2 ring-[#14664f]/30"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#14664f]/30 shrink-0 flex items-center justify-center text-xs font-bold text-[#1a8a6a]">
                {user.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/80 truncate">{user.name}</p>
              <p className="text-[11px] text-white/30 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <div className="p-3 pt-0 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/30 hover:text-white/70 transition-colors rounded-lg hover:bg-white/[0.03]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
        </div>
        <div className="px-5 pb-4 pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1a8a6a] animate-pulse" />
            <span className="text-[10px] text-white/20 tracking-wider uppercase">Powered by RocketOpp</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
