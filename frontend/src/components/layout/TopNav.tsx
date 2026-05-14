import { Bell, Search, Sparkles } from "lucide-react";

export function TopNav({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-border/40">
      <div className="flex items-center gap-4 px-6 h-16">
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>
          <p className="text-xs text-muted-foreground">RBI compliance intelligence workspace</p>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 h-9 rounded-lg bg-input/40 border border-border w-72">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder="Search regulations, policies, gaps…"
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>
        </div>

        <div className="flex items-center gap-2 px-3 h-9 rounded-full glass">
          <span className="relative flex size-2">
            <span className="absolute inset-0 rounded-full bg-success/60 pulse-glow" />
            <span className="relative size-2 rounded-full bg-success" />
          </span>
          <Sparkles className="size-3.5 text-accent" />
          <span className="text-xs font-medium text-foreground">AI Online</span>
        </div>

        <button className="relative size-9 grid place-items-center rounded-lg glass hover:bg-sidebar-accent transition-colors">
          <Bell className="size-4 text-foreground" />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-accent" />
        </button>

        <div className="size-9 rounded-full bg-gradient-primary grid place-items-center text-xs font-semibold text-primary-foreground glow-primary">
          AR
        </div>
      </div>
    </header>
  );
}
