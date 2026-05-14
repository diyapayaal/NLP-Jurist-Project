import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { mockInsights } from "@/lib/mock-data";
import { Sparkles, AlertTriangle, Lightbulb, ShieldAlert, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/ai-insights")({
  component: Insights,
  head: () => ({
    meta: [
      { title: "AI Insights — NLP-Jurist" },
      { name: "description", content: "AI-generated recommendations and compliance risk predictions." },
    ],
  }),
});

const toneMap = {
  warning: { icon: AlertTriangle, cls: "text-warning border-warning/30" },
  info: { icon: Sparkles, cls: "text-accent border-accent/30" },
  success: { icon: Lightbulb, cls: "text-success border-success/30" },
  danger: { icon: ShieldAlert, cls: "text-destructive border-destructive/30" },
} as const;

function Insights() {
  return (
    <AppShell title="AI Insights">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
          {mockInsights.map((ins, i) => {
            const t = toneMap[ins.tone];
            const Icon = t.icon;
            return (
              <div key={i} className={`glass rounded-2xl p-5 border-l-2 ${t.cls}`}>
                <div className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest ${t.cls.split(" ")[0]}`}>
                  <Icon className="size-3.5" /> {ins.tone}
                </div>
                <h3 className="mt-3 text-base font-semibold text-foreground">{ins.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{ins.body}</p>
              </div>
            );
          })}
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-accent" />
            <h3 className="text-base font-semibold text-foreground">Risk Prediction</h3>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Next 90 days, blended portfolio</p>

          <div className="mt-6 space-y-4">
            {[
              { label: "KYC drift", value: 64, tone: "text-warning" },
              { label: "AML exposure", value: 38, tone: "text-success" },
              { label: "Cyber control lag", value: 81, tone: "text-destructive" },
              { label: "Disclosure gaps", value: 27, tone: "text-success" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-xs">
                  <span className="text-foreground">{m.label}</span>
                  <span className={m.tone}>{m.value}%</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${m.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
