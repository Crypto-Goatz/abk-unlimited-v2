import { getIntegrationStatus } from "@/lib/config";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  FileText,
  Image,
  Bot,
  BarChart3,
  Settings,
  Activity,
  Blocks,
  Users,
  Webhook,
  Code2,
  ArrowUpRight,
  Zap,
} from "lucide-react";

export default function AdminDashboardPage() {
  const status = getIntegrationStatus();

  const integrations = [
    { name: "Google Sheets", key: "googleSheets" as const, description: "Content management via Sheets" },
    { name: "Google Drive", key: "googleDrive" as const, description: "Media storage and management" },
    { name: "Gemini AI", key: "gemini" as const, description: "AI content generation" },
    { name: "CRO9 Analytics", key: "cro9" as const, description: "Analytics and behavior tracking" },
    { name: "CRM", key: "crm" as const, description: "Customer relationship management" },
    { name: "Google OAuth", key: "googleOAuth" as const, description: "Admin authentication" },
    { name: "Social Planner", key: "socialPlanner" as const, description: "Automated social posting" },
    { name: "Apps Script", key: "appsScript" as const, description: "Blog auto-publishing" },
  ];

  const quickLinks = [
    { href: "/admin/content", label: "Content Manager", icon: FileText, description: "Edit site content via Google Sheets" },
    { href: "/admin/media", label: "Media Library", icon: Image, description: "Upload and manage images" },
    { href: "/admin/ai", label: "AI Writer", icon: Bot, description: "Generate content with AI" },
    { href: "/admin/crm", label: "CRM Dashboard", icon: Users, description: "Manage contacts, pipelines, social" },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3, description: "View site performance" },
    { href: "/admin/sxo", label: "SXO Panel", icon: Activity, description: "Behavioral data and search experience" },
    { href: "/admin/webhooks", label: "Webhooks", icon: Webhook, description: "Incoming webhook endpoints" },
    { href: "/admin/api-builder", label: "API Builder", icon: Code2, description: "Custom API endpoints" },
    { href: "/admin/apps", label: "Custom Apps", icon: Blocks, description: "Build and manage dynamic tools" },
    { href: "/admin/settings", label: "Settings", icon: Settings, description: "Configure integrations" },
  ];

  const connectedCount = integrations.filter((i) => status[i.key]).length;

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1a14] via-[#0f2e1f] to-[#14664f] p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a8a6a]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#14664f]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-[#4ade80]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#4ade80]">ABK Unlimited Admin</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to Your Command Center</h1>
          <p className="text-white/60 max-w-lg">
            Manage your website content, media, analytics, CRM, and integrations — all from one place.
          </p>
        </div>
      </div>

      {/* Integration status */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Integration Status</h2>
          <span className="text-xs font-medium text-[#14664f] bg-[#14664f]/10 px-2.5 py-1 rounded-full">
            {connectedCount}/{integrations.length} active
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {integrations.map((integration) => {
            const connected = status[integration.key];
            return (
              <div
                key={integration.key}
                className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-gray-200/80 hover:border-gray-300/80 transition-colors"
              >
                {connected ? (
                  <div className="w-8 h-8 rounded-lg bg-[#14664f]/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-[#14664f]" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <XCircle className="h-4 w-4 text-red-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-800">{integration.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{integration.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <div className="group flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-200/80 hover:border-[#14664f]/30 hover:shadow-md hover:shadow-[#14664f]/5 transition-all cursor-pointer h-full">
                  <div className="w-10 h-10 rounded-xl bg-[#14664f]/8 group-hover:bg-[#14664f]/15 flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="h-5 w-5 text-[#14664f]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-sm text-gray-800">{link.label}</p>
                      <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-[#14664f] transition-colors" />
                    </div>
                    <p className="text-xs text-gray-400">{link.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
