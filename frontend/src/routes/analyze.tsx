import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UploadZone } from "@/components/analyze/UploadZone";
import { AnalysisResultsAdvanced } from "@/components/analyze/AnalysisResultsAdvanced";
import type { AnalysisResponse } from "@/lib/mock-data";
import { Loader2, AlertCircle, Zap } from "lucide-react";

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
            <div className="glass-strong rounded-2xl p-5 border border-red-500/40 bg-red-500/10 animate-slide-up">
              <div className="flex items-start gap-4">
                <AlertCircle className="size-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-red-400">Analysis Failed</div>
                  <p className="text-sm text-red-300/90 mt-1.5 leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="glass rounded-2xl p-6 border border-border/40 hover:border-accent/30 transition-all">
            <div className="space-y-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold">How it works</div>
              </div>
              <ol className="space-y-3 text-xs text-muted-foreground/90">
                <li className="flex gap-3">
                  <span className="font-bold text-accent flex-shrink-0 bg-accent/20 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">1</span>
                  <span className="pt-0.5">Upload RBI regulation PDF</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-accent flex-shrink-0 bg-accent/20 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">2</span>
                  <span className="pt-0.5">AI analyzes regulation requirements</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-accent flex-shrink-0 bg-accent/20 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">3</span>
                  <span className="pt-0.5">Cross-checks against your policies</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-accent flex-shrink-0 bg-accent/20 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">4</span>
                  <span className="pt-0.5">Gaps & remediation surfaced</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Main Content - Results */}
        <div className="min-w-0">
          {loading ? (
            <div className="glass-strong rounded-2xl p-12 flex flex-col items-center justify-center gap-8 border border-accent/20 animate-slide-up">
              <div className="flex flex-col items-center gap-6">
                <div className="size-20 rounded-2xl bg-gradient-primary/20 grid place-items-center">
                  <Loader2 className="size-10 text-accent animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <div className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
                    <Zap className="size-5 text-accent" />
                    Analyzing with AI…
                  </div>
                  <div className="text-sm text-muted-foreground/90">
                    Deep compliance analysis in progress
                  </div>
                  <div className="text-xs text-muted-foreground/70 mt-3">
                    Typical duration: 8–12 seconds
                  </div>
                </div>
              </div>
              <div className="w-full max-w-xs">
                <div className="h-1 rounded-full bg-muted/30 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shimmer"
                    style={{ width: "100%" }}
                  />
                </div>
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

