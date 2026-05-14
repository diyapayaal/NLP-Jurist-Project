import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ScoreMeter } from "@/components/analyze/ScoreMeter";
import { mockAnalysis, mockReports, mockInsights } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/analyze/SeverityBadge";
import { ArrowUpRight, FileText, ScanSearch, Sparkles, ShieldAlert, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — NLP-Jurist" },
      { name: "description", content: "Compliance overview, risk posture and AI insights for your bank." },
    ],
  }),
});

function Stat({ label, value, hint, icon: Icon, accent }: any) {
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute -right-6 -top-6 size-24 rounded-full bg-gradient-primary opacity-10 blur-2xl" />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </div>
      <div className={`mt-3 text-3xl font-bold tracking-tight ${accent ?? "text-foreground"}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function Dashboard() {
  return (
    <AppShell title="Compliance Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Active regulations" value="48" hint="+6 this quarter" icon={ScanSearch} />
          <Stat label="Open gaps" value="23" hint="5 critical" icon={ShieldAlert} accent="text-destructive" />
          <Stat label="Reports generated" value="142" hint="this year" icon={FileText} />
          <Stat label="Avg alignment" value="78%" hint="↑ 4 pts MoM" icon={TrendingUp} accent="text-accent" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ScoreMeter score={78} label="Portfolio Alignment Score" />
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Latest AI Insight</h3>
              <Sparkles className="size-4 text-accent" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{mockInsights[0].body}</p>
            <Link to="/ai-insights" className="mt-4 inline-flex items-center gap-1 text-xs text-accent hover:underline">
              View all insights <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-foreground">Top Compliance Gaps</h3>
              <Link to="/analyze" className="text-xs text-accent hover:underline">Analyze new →</Link>
            </div>
            <ul className="space-y-3">
              {mockAnalysis.gap_analysis.gaps.slice(0, 4).map((g, i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground truncate">{g.description}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{g.affected_policy}</div>
                  </div>
                  <SeverityBadge severity={g.severity} />
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-foreground">Recent Reports</h3>
              <Link to="/reports" className="text-xs text-accent hover:underline">All reports →</Link>
            </div>
            <ul className="space-y-3">
              {mockReports.slice(0, 4).map((r) => (
                <li key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition">
                  <div className="size-9 rounded-lg bg-gradient-primary/20 grid place-items-center">
                    <FileText className="size-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground truncate">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.date} · {r.size}</div>
                  </div>
                  <div className="text-sm font-semibold text-accent">{r.score}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
