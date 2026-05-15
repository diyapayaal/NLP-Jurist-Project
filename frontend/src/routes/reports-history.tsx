import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2, Eye, Download, Trash2, ChevronRight } from "lucide-react";
import { SeverityBadge } from "@/components/analyze/SeverityBadge";

export const Route = createFileRoute("/reports-history")({
  component: ReportsHistory,
  head: () => ({
    meta: [
      { title: "Reports History — NLP-Jurist" },
      { name: "description", content: "View all previous compliance analysis reports" },
    ],
  }),
});

interface Report {
  id: string;
  filename: string;
  title: string;
  created_at: string;
  alignment_score: number;
  total_gaps: number;
}

function ReportCard({ report }: { report: Report }) {
  const date = new Date(report.created_at);
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const scoreStatus =
    report.alignment_score >= 80
      ? "emerald"
      : report.alignment_score >= 60
      ? "yellow"
      : "red";

  return (
    <div className="glass rounded-xl p-5 hover-lift group cursor-pointer border border-border/50 hover:border-accent/50 transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
            {report.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {formattedDate} at {formattedTime}
          </p>
        </div>
        <ChevronRight className="size-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg glass-strong border border-${scoreStatus}-500/30 bg-${scoreStatus}-500/10`}>
            <div className={`text-xs font-bold text-${scoreStatus}-400`}>
              {report.alignment_score}%
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">Gaps</div>
            <div className="text-sm font-medium text-foreground">{report.total_gaps}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="p-1.5 rounded-lg glass-strong hover:bg-accent/20 transition-colors" title="View">
            <Eye className="size-4 text-muted-foreground hover:text-accent" />
          </button>
          <button className="p-1.5 rounded-lg glass-strong hover:bg-accent/20 transition-colors" title="Download">
            <Download className="size-4 text-muted-foreground hover:text-accent" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportsHistory() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/reports");
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        setReports(data.reports || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load reports");
        console.error("Error fetching reports:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <AppShell title="Reports History">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass rounded-2xl p-6 border border-accent/20">
          <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Reports</h2>
          <p className="text-sm text-muted-foreground">
            View and download all previous compliance analysis reports
          </p>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="size-8 text-accent animate-spin" />
            <div className="text-sm text-muted-foreground">Loading reports...</div>
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-6 border border-red-500/30 bg-red-500/10">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-sm text-muted-foreground mb-2">No reports found</div>
            <p className="text-xs text-muted-foreground/70">
              Upload a regulation PDF to generate your first compliance report
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {reports.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent">{reports.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total Reports</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {(reports.reduce((sum, r) => sum + r.alignment_score, 0) / reports.length).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Avg Score</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">
                {reports.reduce((sum, r) => sum + r.total_gaps, 0)}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total Gaps</div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
