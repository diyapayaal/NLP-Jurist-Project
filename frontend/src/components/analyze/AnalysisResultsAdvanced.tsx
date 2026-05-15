import type { AnalysisResponse } from "@/lib/mock-data";
import { SeverityBadge } from "./SeverityBadge";
import { ScoreMeter } from "./ScoreMeter";
import { GapsTable } from "./GapsTable";
import { ComplianceTrendChart, DepartmentImpactChart, RiskDistributionChart, RemediationTimelineChart } from "./DataVisualizations";
import {
  Calendar,
  Building2,
  CheckCircle2,
  Target,
  ListChecks,
  Clock,
  Flag,
  TrendingDown,
  AlertTriangle,
  Check,
  Users,
} from "lucide-react";

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  accent,
  secondary,
}: { 
  icon: any
  label: string
  value: string | number
  accent?: string
  secondary?: string
}) {
  return (
    <div className="glass-strong rounded-xl p-4 hover-lift">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
        <Icon className="size-4 text-accent" />
        {label}
      </div>
      <div className={`mt-3 text-2xl font-bold ${accent ?? "text-foreground"}`}>{value}</div>
      {secondary && <div className="text-xs text-muted-foreground mt-1">{secondary}</div>}
    </div>
  );
}

interface AnalysisResultsAdvancedProps {
  data: AnalysisResponse;
  className?: string;
}

export function AnalysisResultsAdvanced({ data, className = "" }: AnalysisResultsAdvancedProps) {
  const r = data.regulation_analysis ?? ({} as any);
  const g = data.gap_analysis ?? ({} as any);
  const gaps = Array.isArray(g.gaps) ? g.gaps : [];
  const criticalGaps = gaps.filter((gap: any) => gap.severity === "critical").length;
  const highGaps = gaps.filter((gap: any) => gap.severity === "high").length;
  const alignmentScore = (g as any).alignment_score ?? (r as any).alignment_score ?? 0;

  const formatDeadline = (d?: string) => {
    if (!d) return { label: "No fixed deadline", days: null };
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return { label: "No fixed deadline", days: null };
    const days = Math.ceil((parsed.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return { label: parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), days };
  };
  const deadline = formatDeadline(r.deadline as any);

  return (
    <div className={`space-y-6 animate-slide-up ${className}`}>
      {/* Header Section */}
      <div className="glass rounded-2xl p-6 border border-accent/20 hover-lift">
        <div className="grid lg:grid-cols-[1fr_200px] gap-6 items-start">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold bg-accent/20 px-2 py-1 rounded-full">
                  Regulation Type
                </span>
              </div>
              <SeverityBadge severity={r.risk_level} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-2">{r.regulation_type}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.summary}</p>
          </div>

          {/* Quick Stats */}
          <div className="glass-strong rounded-xl p-4 border-l-2 border-accent/40">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Deadline</div>
            <div className="text-lg font-semibold text-accent">{deadline.label}</div>
            <div className="text-xs text-muted-foreground mt-2">{deadline.days == null ? "" : `${deadline.days} days remaining`}</div>
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard icon={Target} label="Alignment" value={`${alignmentScore}%`} accent="text-emerald-400" />
        <StatCard icon={AlertTriangle} label="Critical Gaps" value={criticalGaps} accent="text-red-400" />
        <StatCard icon={Flag} label="High Gaps" value={highGaps} accent="text-orange-400" />
        <StatCard icon={Users} label="Departments" value={Array.isArray(r.affected_departments) ? r.affected_departments.length : 0} accent="text-blue-400" />
        <StatCard icon={ListChecks} label="Action Items" value={Array.isArray(r.measurable_action_points) ? r.measurable_action_points.length : 0} accent="text-violet-400" />
      </div>

      {/* Main Visualizations */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScoreMeter score={alignmentScore} />
        </div>
        <RiskDistributionChart gaps={gaps} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <ComplianceTrendChart data={(r as any).trend ?? (g as any).trend} />
        <RemediationTimelineChart data={(g as any).remediation_timeline ?? undefined} />
      </div>

      <DepartmentImpactChart className="lg:col-span-2" departments={r.affected_departments} />

      {/* Gaps Table */}
      <GapsTable gaps={gaps} />

      {/* Requirements Section */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="size-5 text-accent" />
          Key Requirements
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {(r.key_requirements || []).map((req: any, i: number) => (
            <div key={i} className="glass-strong rounded-lg p-4 flex gap-3">
                <div className="size-6 rounded-full bg-accent/20 grid place-items-center flex-shrink-0">
                <Check className="size-3 text-accent" />
              </div>
              <p className="text-sm text-foreground leading-relaxed">{req}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingDown className="size-5 text-blue-400" />
          Measurable Action Points
        </h3>
        <div className="space-y-3">
          {(r.measurable_action_points || []).map((action: any, i: number) => (
            <div
              key={i}
              className="glass-strong rounded-lg p-4 border-l-4 border-blue-400 hover-lift group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-foreground">{action.action}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Owner: {action.owner} • Timeline: {action.timeline}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Success Metric</div>
                    <div className="text-xs font-medium text-accent max-w-xs truncate">{action.success_metric}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remediation Priority */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="size-5 text-warning" />
          Remediation Priority
        </h3>
        <div className="space-y-2">
          {g.remediation_priority?.map((item: any, i: number) => (
            <div key={i} className="glass-strong rounded-lg p-3 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{item.title}</div>
                <div className="text-xs text-muted-foreground">ETA: {item.eta}</div>
              </div>
              <SeverityBadge severity={item.priority} />
            </div>
          ))}
        </div>
      </div>

      {/* Affected Departments */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 className="size-5 text-cyan-400" />
          Affected Departments
        </h3>
        <div className="flex flex-wrap gap-2">
          {(r.affected_departments || []).map((d: any) => (
            <div
              key={d}
              className="px-3 py-2 rounded-full text-xs font-medium glass border border-accent/30 text-accent hover-lift cursor-pointer"
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
