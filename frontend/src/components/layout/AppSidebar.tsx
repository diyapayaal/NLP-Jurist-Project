import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ScanSearch,
  FileText,
  Library,
  Sparkles,
  Settings,
  ShieldCheck,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Analyze Regulation", url: "/analyze", icon: ScanSearch },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Policy Library", url: "/policy-library", icon: Library },
  { title: "AI Insights", url: "/ai-insights", icon: Sparkles },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col glass border-r border-border/50 sticky top-0 h-screen">
      <div className="p-5 flex items-center gap-2.5 border-b border-border/40">
        <div className="size-9 rounded-lg bg-gradient-primary grid place-items-center glow-primary">
          <ShieldCheck className="size-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-semibold tracking-tight text-foreground leading-none">NLP-Jurist</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">Compliance AI</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const active = currentPath === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-gradient-primary text-primary-foreground glow-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="size-4" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/40">
        <div className="glass rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Model</div>
          <div className="text-sm font-medium text-foreground">Jurist-LLM v3.2</div>
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-primary" />
          </div>
        </div>
      </div>
    </aside>
  );
}
