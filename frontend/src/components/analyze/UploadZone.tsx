import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileCheck2, Loader2, X, Zap, Shield, Gauge } from "lucide-react";

interface Props {
  onAnalyze: (file: File) => Promise<void> | void;
  isAnalyzing: boolean;
}

export function UploadZone({ onAnalyze, isAnalyzing }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File | undefined) => {
    if (!f) return;
    if (f.type !== "application/pdf") return;
    setFile(f);
    setProgress(0);
    
    // Simulated upload progress with more natural curve
    let p = 0;
    const id = setInterval(() => {
      const increment = Math.random() * 25 + 5;
      p = Math.min(p + increment, 100);
      setProgress(p);
      
      if (p >= 100) {
        clearInterval(id);
        // Trigger analysis
        onAnalyze(f);
      }
    }, 300);
  }, [onAnalyze]);

  return (
    <div className="glass-strong rounded-2xl p-7 border border-border/40 space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">Upload Regulation</h2>
        <p className="text-xs text-muted-foreground/80 font-medium">Drop an RBI PDF to begin compliance analysis</p>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mt-2.5 font-bold">PDF · Max 25MB</div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center
          ${dragOver 
            ? "border-accent bg-gradient-primary/20 ring-glow shadow-xl scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-gradient-primary/10"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
          disabled={isAnalyzing}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="mx-auto size-20 rounded-2xl bg-gradient-primary grid place-items-center glow-primary animate-float shadow-lg">
            <UploadCloud className="size-10 text-white" />
          </div>
          <div>
            <div className="text-base font-bold text-foreground">Drag & drop your PDF</div>
            <div className="text-xs text-muted-foreground/80 mt-1.5 font-medium">or click to browse files</div>
          </div>
        </div>
      </div>

      {/* File Preview & Progress */}
      {file && (
        <div className="glass-strong rounded-2xl p-5 space-y-4 border border-accent/30 bg-accent/5">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-gradient-primary/30 grid place-items-center flex-shrink-0 border border-accent/30">
              <FileCheck2 className="size-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold text-foreground truncate">{file.name}</div>
                {!isAnalyzing && (
                  <button
                    onClick={() => {
                      setFile(null);
                      setProgress(0);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-white/10 rounded"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <div className="text-xs text-muted-foreground/80 mt-1 font-medium">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-2.5 rounded-full bg-muted/40 overflow-hidden relative">
              <div
                className={`h-full ${
                  isAnalyzing 
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500" 
                    : "bg-gradient-to-r from-violet-500 to-purple-500"
                } transition-all duration-200`}
                style={{ width: `${progress}%` }}
              />
              {progress < 100 && <div className="absolute inset-0 shimmer" />}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground/80 font-medium">
                {progress < 100 ? `Uploading ${Math.round(progress)}%` : isAnalyzing ? "Analyzing with AI…" : "Ready to analyze"}
              </span>
              {isAnalyzing && (
                <span className="text-xs text-accent font-bold flex items-center gap-1.5">
                  <Loader2 className="size-3.5 animate-spin" />
                  Processing
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-strong rounded-xl p-4 text-center text-xs border border-border/30 hover:border-accent/40 hover:shadow-md transition-all group">
          <Zap className="size-5 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-semibold text-muted-foreground">Fast</div>
          <div className="text-[11px] text-muted-foreground/70 mt-1">8–12 sec</div>
        </div>
        <div className="glass-strong rounded-xl p-4 text-center text-xs border border-border/30 hover:border-emerald-500/40 hover:shadow-md transition-all group">
          <Shield className="size-5 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-semibold text-muted-foreground">Secure</div>
          <div className="text-[11px] text-muted-foreground/70 mt-1">Encrypted</div>
        </div>
        <div className="glass-strong rounded-xl p-4 text-center text-xs border border-border/30 hover:border-blue-500/40 hover:shadow-md transition-all group">
          <Gauge className="size-5 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-semibold text-muted-foreground">Accurate</div>
          <div className="text-[11px] text-muted-foreground/70 mt-1">AI-Powered</div>
        </div>
      </div>
    </div>
  );
}
