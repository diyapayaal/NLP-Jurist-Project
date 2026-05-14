import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/settings")({
  component: Settings,
  head: () => ({
    meta: [
      { title: "Settings — NLP-Jurist" },
      { name: "description", content: "Workspace, model and notification settings." },
    ],
  }),
});

function Toggle({ label, desc, on = false }: { label: string; desc: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border/30 last:border-0">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <div className={`w-11 h-6 rounded-full p-0.5 transition ${on ? "bg-gradient-primary glow-primary" : "bg-muted"}`}>
        <div className={`size-5 rounded-full bg-background transition ${on ? "translate-x-5" : ""}`} />
      </div>
    </div>
  );
}

function Settings() {
  return (
    <AppShell title="Settings">
      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-base font-semibold text-foreground mb-2">Workspace</h3>
          <div className="space-y-3 mt-4">
            <div>
              <label className="text-xs text-muted-foreground">Organisation</label>
              <input defaultValue="Bharat National Bank" className="mt-1 w-full h-10 rounded-lg bg-input/40 border border-border px-3 text-sm text-foreground outline-none focus:ring-glow" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Backend endpoint</label>
              <input defaultValue="http://127.0.0.1:8000/analyze" className="mt-1 w-full h-10 rounded-lg bg-input/40 border border-border px-3 text-sm text-foreground font-mono outline-none focus:ring-glow" />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-base font-semibold text-foreground mb-2">Preferences</h3>
          <Toggle label="Real-time analysis" desc="Stream partial results from Jurist-LLM" on />
          <Toggle label="Auto-link policies" desc="Suggest internal policies for each gap" on />
          <Toggle label="Email digest" desc="Weekly summary of new regulations" />
          <Toggle label="Slack alerts" desc="Critical-severity gaps to #compliance" on />
        </div>
      </div>
    </AppShell>
  );
}
