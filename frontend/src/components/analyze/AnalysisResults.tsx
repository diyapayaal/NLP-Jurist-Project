import type { AnalysisResponse } from "@/lib/mock-data";
import { SeverityBadge } from "./SeverityBadge";
import { ScoreMeter } from "./ScoreMeter";
import { GapsTable } from "./GapsTable";
import {
  Calendar,
  Building2,
  CheckCircle2,
  Target,
  ListChecks,
  Clock,
  Flag,
  Circle,
  Check,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className={`mt-2 text-lg font-semibold ${accent ?? "text-foreground"}`}>{value}</div>
    </div>
  );
}

export function AnalysisResults({ data }: { data: AnalysisResponse }) {
  const r = data.regulation_analysis ?? ({} as any);
  const g = data.gap_analysis ?? ({} as any);
  const gaps = Array.isArray(g.gaps) ? g.gaps : [];
  const alignmentScore = (g as any).alignment_score ?? (r as any).alignment_score ?? 0;

  const formatDeadline = (d?: string) => {
    if (!d) return "No fixed deadline";
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return "No fixed deadline";
    return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-wrap items-start gap-4 justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.18em] text-accent">Regulation Type</span>
              <SeverityBadge severity={r.risk_level} />
            </div>
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">{r.regulation_type}</h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-3xl leading-relaxed">{r.summary}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <StatCard icon={Calendar} label="Deadline" value={formatDeadline(r.deadline)} accent="text-accent" />
          <StatCard icon={Building2} label="Departments" value={`${Array.isArray(r.affected_departments) ? r.affected_departments.length : 0} affected`} />
          <StatCard icon={Target} label="Action points" value={`${Array.isArray(r.measurable_action_points) ? r.measurable_action_points.length : 0} defined`} />
          <StatCard icon={ListChecks} label="Requirements" value={`${Array.isArray(r.key_requirements) ? r.key_requirements.length : 0} key items`} />
        </div>
      </div>

      {/* Score + Departments */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScoreMeter score={alignmentScore} />
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground">Affected Departments</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {(r.affected_departments || []).map((d: any) => (
              <span key={d} className="px-3 py-1.5 rounded-full text-xs font-medium glass border-accent/30 text-accent">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements & Action points */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Key Requirements</h3>
          <ul className="space-y-3">
            {(r.key_requirements || []).map((k: any, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="size-4 text-accent mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{k}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Measurable Action Points</h3>
          <ul className="space-y-4">
            {(r.measurable_action_points || []).map((p: any, i: number) => {
              const pct = 30 + ((i * 17) % 60);
              return (
                <li key={i}>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{p}</span>
                    <span className="text-muted-foreground text-xs">{pct}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Gaps table */}
      <GapsTable gaps={gaps} />

      {/* Remediation priority */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-foreground">Remediation Priority</h3>
            <p className="text-xs text-muted-foreground">Suggested execution order based on risk-weighted impact</p>
          </div>
          <Flag className="size-4 text-accent" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {(g.remediation_priority || []).map((p: any, i: number) => (
            <div key={i} className="glass rounded-xl p-4 border-l-2 border-accent/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">P{i + 1}</span>
                <SeverityBadge severity={p.priority} />
              </div>
              <div className="mt-2 font-medium text-foreground">{p.title}</div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> ETA {p.eta}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action timeline */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-base font-semibold text-foreground mb-6">Action Plan Timeline</h3>
        <div className="relative pl-6">
          <div className="absolute left-2 top-1 bottom-1 w-px bg-gradient-to-b from-accent via-primary to-purple/50" />
          <div className="space-y-5">
            {(data.action_items || []).map((a: any, i: number) => {
                const Icon = a.status === "done" ? Check : a.status === "in_progress" ? Circle : Circle;
              return (
                <div key={i} className="relative">
                  <div className={`absolute -left-[18px] top-1 size-3 rounded-full ring-4 ring-background ${
                    a.status === "done" ? "bg-success" : a.status === "in_progress" ? "bg-accent pulse-glow" : "bg-muted"
                  }`} />
                  <div className="glass rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Icon className="size-3.5 text-muted-foreground" /> {a.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Owner: {a.owner}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Due</div>
                      <div className="text-sm text-foreground">
                        {new Date(a.due).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
