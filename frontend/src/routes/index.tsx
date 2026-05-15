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
    <div className="glass-strong rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/20 transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">{label}</div>
          <div className={`mt-3 text-4xl font-bold tracking-tight ${accent}`}>{value}</div>
          {change && (
            <div className={`mt-2 text-xs font-medium flex items-center gap-1 ${
              trend === "down" ? "text-orange-400" : "text-emerald-400"
            }`}>
              {trend === "up" ? "↑" : "↓"} {change}
            </div>
          )}
        </div>
        <div className="size-12 rounded-xl bg-gradient-primary/20 grid place-items-center group-hover:bg-gradient-primary/30 transition-colors">
          <Icon className={`size-6 ${accent}`} />
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
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="glass-strong rounded-2xl p-8 border border-accent/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="size-4" />
                {todayDate}
              </p>
            </div>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-primary text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/50 transition-all no-underline"
            >
              <Zap className="size-4" />
              Analyze New Regulation
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ScoreMeter score={78} target={85} />
          </div>
          <div>
            <RiskDistributionChart />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <ComplianceTrendChart />
          </div>
          <div>
            <DepartmentImpactChart />
          </div>
        </div>

        {/* Recent Activity & Insights */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <div className="glass rounded-2xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <FileText className="size-5 text-blue-400" />
                  Recent Reports
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Last 5 analyses</p>
              </div>
              <Link to="/reports-history" className="text-xs text-accent hover:text-accent/80 font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {mockReports.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="glass-strong rounded-lg p-3 hover:shadow-md transition-shadow group cursor-pointer flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                      {r.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.date}</div>
                  </div>
                  <div className="ml-3 px-2.5 py-1 rounded-full bg-accent/20 text-xs font-bold text-accent flex-shrink-0">
                    {r.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass rounded-2xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="size-5 text-accent" />
                  AI Insights
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Latest recommendations</p>
              </div>
              <Link to="/ai-insights" className="text-xs text-accent hover:text-accent/80 font-medium">
                More
              </Link>
            </div>
            <div className="space-y-3">
              {mockInsights.slice(0, 3).map((insight, i) => {
                const toneColors = {
                  success: "border-emerald-500/30 bg-emerald-500/10",
                  warning: "border-orange-500/30 bg-orange-500/10",
                  info: "border-blue-500/30 bg-blue-500/10",
                  danger: "border-red-500/30 bg-red-500/10",
                };
                const toneIcons = {
                  success: <CheckCircle2 className="size-4 text-emerald-400" />,
                  warning: <AlertTriangle className="size-4 text-orange-400" />,
                  info: <Sparkles className="size-4 text-blue-400" />,
                  danger: <AlertTriangle className="size-4 text-red-400" />,
                };

                return (
                  <div
                    key={i}
                    className={`glass-strong rounded-lg p-3 border transition-shadow hover:shadow-md ${toneColors[insight.tone as keyof typeof toneColors]}`}
                  >
                    <div className="flex items-start gap-2">
                      {toneIcons[insight.tone as keyof typeof toneIcons]}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground">{insight.title}</div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-2xl p-6 border border-border/40">
          <h3 className="text-base font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                  className="glass-strong rounded-lg p-4 group flex flex-col items-center justify-center gap-2 text-center transition-all hover:shadow-md no-underline"
                >
                  <Icon className="size-6 text-accent group-hover:text-accent transition-colors" />
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
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

