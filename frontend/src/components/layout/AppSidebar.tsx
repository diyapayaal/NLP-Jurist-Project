import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ScanSearch,
  History,
  Library,
  Sparkles,
  Settings,
  ShieldCheck,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Analyze", url: "/analyze", icon: ScanSearch },
  { title: "Reports History", url: "/reports-history", icon: History },
  { title: "Policy Library", url: "/policy-library", icon: Library },
  { title: "AI Insights", url: "/ai-insights", icon: Sparkles },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside className="flex w-64 shrink-0 flex-col glass-strong border-r border-border sticky top-0 h-screen overflow-y-auto">
      {/* Logo & Branding */}
      <div className="p-6 flex items-center gap-3 border-b border-border/40">
        <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center glow-primary shadow-lg">
          <ShieldCheck className="size-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-lg tracking-tight text-foreground leading-none">NLP-Jurist</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mt-1">Compliance AI</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const active = currentPath === item.url;
          const Icon = item.icon;
          const baseClasses = "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 no-underline";
          const activeClasses = active 
            ? "bg-gradient-primary text-white shadow-lg" 
            : "text-muted-foreground hover:text-foreground hover:bg-white/10";
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`${baseClasses} ${activeClasses}`}
            >
              <Icon className={`size-4 flex-shrink-0 ${active ? "text-white" : "group-hover:text-accent"}`} />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Status Card */}
      <div className="p-4 border-t border-border/40 space-y-3">
        <div className="glass-strong rounded-lg p-4 border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex size-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400/60 pulse-glow" />
              <span className="relative size-2 rounded-full bg-emerald-400" />
            </span>
            <div className="text-xs text-muted-foreground">Model Status</div>
          </div>
          <div className="text-sm font-semibold text-foreground">Gemini 2.5 Flash</div>
          <div className="text-xs text-emerald-400 mt-1">Online & Ready</div>
        </div>

        <div className="glass rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Last Analysis</div>
          <div className="text-xs text-accent">Just now</div>
        </div>
      </div>
    </aside>
  );
}

