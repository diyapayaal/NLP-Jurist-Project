import { Bell, Search, Sparkles, Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function TopNav({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-border">
      <div className="flex items-center gap-4 px-4 py-4 md:px-6 lg:px-10">
        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">{title}</h1>
        </div>

        {/* Search Bar */}
        <div className="hidden xl:flex items-center gap-2 px-3.5 h-9 rounded-full glass border border-border/60 hover:border-accent/40 transition-colors flex-1 max-w-sm">
          <Search className="size-4 text-muted-foreground flex-shrink-0" />
          <input
            placeholder="Search regulations…"
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] text-muted-foreground bg-muted/30 rounded px-1.5 py-0.5 hidden sm:block">
            ⌘K
          </kbd>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 h-9 rounded-full glass border border-emerald-500/30 bg-emerald-500/10">
          <span className="relative flex size-2">
            <span className="absolute inset-0 rounded-full bg-emerald-400/60 pulse-glow" />
            <span className="relative size-2 rounded-full bg-emerald-400" />
          </span>
          <Sparkles className="size-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">AI Online</span>
        </div>

        {/* Notification Bell */}
        <button className="relative size-9 grid place-items-center rounded-lg glass hover:bg-white/10 transition-colors duration-200 group">
          <Bell className="size-4 text-muted-foreground group-hover:text-accent transition-colors" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-orange-400" />
        </button>

        {/* Settings */}
        <Link
          to="/settings"
          className="relative size-9 grid place-items-center rounded-lg glass hover:bg-white/10 transition-colors duration-200 group"
        >
          <Settings className="size-4 text-muted-foreground group-hover:text-accent transition-colors" />
        </Link>

        {/* Profile Avatar */}
        <div className="size-9 rounded-lg bg-gradient-primary grid place-items-center text-xs font-bold text-white glow-primary hover:shadow-lg transition-all cursor-pointer">
          AI
        </div>
      </div>
    </header>
  );
}

