import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ScoreMeter } from "@/components/analyze/ScoreMeter";
import { ComplianceTrendChart, DepartmentImpactChart, RiskDistributionChart } from "@/components/analyze/DataVisualizations";
import { mockReports, mockInsights } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/analyze/SeverityBadge";
import {
  ArrowUpRight,
  FileText,
  ScanSearch,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — NLP-Jurist" },
      { name: "description", content: "Compliance overview, risk posture and AI insights for your bank." },
    ],
  }),
});

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: any;
  accent?: string;
  trend?: "up" | "down";
}

function StatCard({ label, value, change, icon: Icon, accent = "text-accent", trend }: StatCardProps) {
  return (
    <div className="glass-strong rounded-2xl p-7 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 group hover-lift border border-border/30">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 font-semibold">{label}</div>
          <div className={`mt-4 text-4xl font-bold tracking-tight ${accent}`}>{value}</div>
          {change && (
            <div className={`mt-3 text-xs font-semibold flex items-center gap-1.5 ${
              trend === "down" ? "text-orange-400" : "text-emerald-400"
            }`}>
              {trend === "up" ? "↑" : "↓"} {change}
            </div>
          )}
        </div>
        <div className="size-14 rounded-xl bg-gradient-primary/20 grid place-items-center group-hover:bg-gradient-primary/35 transition-all duration-300 flex-shrink-0">
          <Icon className={`size-7 ${accent}`} />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const todayDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AppShell title="Compliance Dashboard">
      <div className="space-y-10">
        {/* Welcome Header */}
        <div className="glass-strong rounded-2xl p-9 border border-accent/20 hover-lift">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-3">Welcome back</h2>
              <p className="text-sm text-muted-foreground/90 flex items-center gap-2 font-medium">
                <Clock className="size-4 text-accent/70" />
                {todayDate}
              </p>
            </div>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-primary text-white font-bold text-sm hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 no-underline group"
            >
              <Zap className="size-5 group-hover:scale-110 transition-transform" />
              Analyze New Regulation
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Alignment Score"
            value="78%"
            change="↑ 4% MoM"
            icon={TrendingUp}
            accent="text-emerald-400"
            trend="up"
          />
          <StatCard
            label="Critical Gaps"
            value="8"
            change="↓ 2 last week"
            icon={AlertTriangle}
            accent="text-red-400"
            trend="down"
          />
          <StatCard
            label="Reports (YTD)"
            value="142"
            change="↑ 18 this month"
            icon={FileText}
            accent="text-blue-400"
            trend="up"
          />
          <StatCard
            label="Active Regulations"
            value="48"
            change="↑ 6 this quarter"
            icon={ScanSearch}
            accent="text-cyan-400"
            trend="up"
          />
        </div>

        {/* Main Visualizations */}
        <div className="grid lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2">
            <ScoreMeter score={78} target={85} />
          </div>
          <div>
            <RiskDistributionChart />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-7">
          <div>
            <ComplianceTrendChart />
          </div>
          <div>
            <DepartmentImpactChart />
          </div>
        </div>

        {/* Recent Activity & Insights */}
        <div className="grid lg:grid-cols-2 gap-7">
          {/* Recent Reports */}
          <div className="glass rounded-2xl p-7 border border-border/50 hover-lift">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <FileText className="size-5 text-blue-400" />
                  Recent Reports
                </h3>
                <p className="text-xs text-muted-foreground/80 mt-1.5 font-medium">Last 5 analyses</p>
              </div>
              <Link to="/reports-history" className="text-xs text-accent hover:text-accent/80 font-bold transition-colors">
                View all →
              </Link>
            </div>
            <div className="space-y-2.5">
              {mockReports.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="glass-strong rounded-xl p-4 hover:shadow-md transition-all group cursor-pointer flex items-center justify-between border border-border/30 hover:border-accent/30"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                      {r.title}
                    </div>
                    <div className="text-xs text-muted-foreground/70 mt-1">{r.date}</div>
                  </div>
                  <div className="ml-4 px-3 py-1.5 rounded-full bg-gradient-primary/30 text-xs font-bold text-accent flex-shrink-0 border border-accent/20">
                    {r.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass rounded-2xl p-7 border border-border/50 hover-lift">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="size-5 text-accent" />
                  AI Insights
                </h3>
                <p className="text-xs text-muted-foreground/80 mt-1.5 font-medium">Latest recommendations</p>
              </div>
              <Link to="/ai-insights" className="text-xs text-accent hover:text-accent/80 font-bold transition-colors">
                More →
              </Link>
            </div>
            <div className="space-y-3.5">
              {mockInsights.slice(0, 3).map((insight, i) => {
                const toneColors = {
                  success: "border-emerald-500/40 bg-emerald-500/15",
                  warning: "border-orange-500/40 bg-orange-500/15",
                  info: "border-blue-500/40 bg-blue-500/15",
                  danger: "border-red-500/40 bg-red-500/15",
                };
                const toneIcons = {
                  success: <CheckCircle2 className="size-5 text-emerald-400" />,
                  warning: <AlertTriangle className="size-5 text-orange-400" />,
                  info: <Sparkles className="size-5 text-blue-400" />,
                  danger: <AlertTriangle className="size-5 text-red-400" />,
                };

                return (
                  <div
                    key={i}
                    className={`glass-strong rounded-xl p-4 border transition-all hover:shadow-md hover:border-opacity-100 ${toneColors[insight.tone as keyof typeof toneColors]}`}
                  >
                    <div className="flex items-start gap-3">
                      {toneIcons[insight.tone as keyof typeof toneIcons]}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-foreground">{insight.title}</div>
                        <p className="text-xs text-muted-foreground/90 mt-1.5 leading-relaxed">{insight.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-2xl p-7 border border-border/40 hover-lift">
          <h3 className="text-base font-bold text-foreground mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ScanSearch, label: "Analyze PDF", to: "/analyze" },
              { icon: FileText, label: "View Reports", to: "/reports-history" },
              { icon: Sparkles, label: "AI Insights", to: "/ai-insights" },
              { icon: AlertTriangle, label: "See Gaps", to: "/analyze" },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <Link
                  key={i}
                  to={action.to as any}
                  className="glass-strong rounded-xl p-5 group flex flex-col items-center justify-center gap-3 text-center transition-all hover:shadow-lg border border-border/30 hover:border-accent/30 no-underline"
                >
                  <Icon className="size-7 text-accent group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-muted-foreground/90 group-hover:text-foreground transition-colors">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

