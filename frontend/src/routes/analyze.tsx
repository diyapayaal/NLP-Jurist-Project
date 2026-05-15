import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UploadZone } from "@/components/analyze/UploadZone";
import { AnalysisResultsAdvanced } from "@/components/analyze/AnalysisResultsAdvanced";
import type { AnalysisResponse } from "@/lib/mock-data";
import { Loader2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/analyze")({
  component: Analyze,
  head: () => ({
    meta: [
      { title: "Analyze Regulation — NLP-Jurist" },
      { name: "description", content: "Upload an RBI regulation PDF and let AI surface compliance gaps." },
    ],
  }),
});

const API_URL = "http://127.0.0.1:8000/analyze";

function Analyze() {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      
      const res = await fetch(API_URL, { 
        method: "POST", 
        body: fd 
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `Server returned ${res.status}`);
      }
      
      const json = (await res.json()) as AnalysisResponse;
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Failed to analyze regulation. Please try again.");
      console.error("Analysis error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Analyze Regulation">
      <div className="grid lg:grid-cols-[420px_1fr] gap-6 items-start">
        {/* Sidebar - Upload */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <UploadZone onAnalyze={handleAnalyze} isAnalyzing={loading} />
          
          {/* Error Message */}
          {error && (
            <div className="glass rounded-xl p-4 border border-red-500/30 bg-red-500/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-medium text-red-400">Analysis Failed</div>
                  <p className="text-xs text-red-300/80 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="glass rounded-xl p-4">
            <div className="space-y-3">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">How it works</div>
              </div>
              <ol className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-bold text-accent flex-shrink-0">1.</span>
                  <span>Upload RBI regulation PDF</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-accent flex-shrink-0">2.</span>
                  <span>AI analyzes regulation requirements</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-accent flex-shrink-0">3.</span>
                  <span>Cross-checks against your policies</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-accent flex-shrink-0">4.</span>
                  <span>Gaps & remediation surfaced</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Main Content - Results */}
        <div className="min-w-0">
          {loading ? (
            <div className="glass rounded-2xl p-16 flex flex-col items-center justify-center gap-4">
              <Loader2 className="size-12 text-accent animate-spin" />
              <div className="text-center">
                <div className="text-base font-medium text-foreground">Running deep compliance analysis…</div>
                <div className="text-sm text-muted-foreground mt-2">This usually takes 8–12 seconds</div>
              </div>
            </div>
          ) : data ? (
            <AnalysisResultsAdvanced data={data} />
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}

