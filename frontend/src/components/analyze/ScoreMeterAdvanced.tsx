import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Check, AlertCircle, CheckCircle2, Target } from "lucide-react";

interface ScoreMeterProps {
  score: number;
  target?: number;
  className?: string;
}

export function ScoreMeterAdvanced({ score, target = 80, className = "" }: ScoreMeterProps) {
  const scoreStatus = useMemo(() => {
    if (score >= target) return { label: "Excellent", color: "#22c55e", textColor: "text-emerald-400" };
    if (score >= target - 10) return { label: "Good", color: "#eab308", textColor: "text-yellow-400" };
    if (score >= target - 20) return { label: "Fair", color: "#f59e0b", textColor: "text-orange-400" };
    return { label: "Action Required", color: "#ef4444", textColor: "text-red-400" };
  }, [score, target]);

  const chartData = [
    { name: "Score", value: score, fill: scoreStatus.color },
    { name: "Gap", value: 100 - score, fill: "rgba(255,255,255,0.05)" },
  ];

  const gap = 100 - score;

  return (
    <div className={`glass rounded-2xl p-9 border border-border/40 hover:border-accent/30 hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-10">
          <h3 className="text-base font-bold text-foreground mb-2">Alignment Score</h3>
          <p className="text-xs text-muted-foreground/80 font-medium">Compliance with current regulation</p>
        </div>

        {/* Gauge Chart */}
        <div className="relative size-52 mb-4">
          <ResponsiveContainer width={208} height={208}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                startAngle={180}
                endAngle={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-6xl font-bold ${scoreStatus.textColor}`}>
              {Math.round(score)}
            </div>
            <div className="text-xs text-muted-foreground/80 font-medium">%</div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`mt-6 px-4 py-2.5 rounded-full glass border transition-all ${
          score >= target
            ? "border-emerald-500/40 bg-emerald-500/15"
            : score >= target - 10
            ? "border-yellow-500/40 bg-yellow-500/15"
            : score >= target - 20
            ? "border-orange-500/40 bg-orange-500/15"
            : "border-red-500/40 bg-red-500/15"
        }`}>
          <div className="flex items-center gap-2.5">
            {score >= target ? (
              <CheckCircle2 className={`size-5 ${scoreStatus.textColor}`} />
            ) : (
              <AlertCircle className={`size-5 ${scoreStatus.textColor}`} />
            )}
            <span className={`text-sm font-bold ${scoreStatus.textColor}`}>
              {scoreStatus.label}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-8 w-full grid grid-cols-3 gap-4">
          <div className="glass-strong rounded-xl p-4 text-center border border-border/30 hover:border-emerald-500/40 hover:shadow-md transition-all group">
            <Check className="size-6 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-foreground">{score}</div>
            <div className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold mt-1">Aligned</div>
          </div>
          <div className="glass-strong rounded-xl p-4 text-center border border-border/30 hover:border-red-500/40 hover:shadow-md transition-all group">
            <AlertCircle className="size-6 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-foreground">{gap}</div>
            <div className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold mt-1">Gaps</div>
          </div>
          <div className="glass-strong rounded-xl p-4 text-center border border-border/30 hover:border-accent/40 hover:shadow-md transition-all group">
            <Target className="size-6 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-foreground">{target}</div>
            <div className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold mt-1">Target</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Keep a canonical `ScoreMeter` export for existing imports that expect this name.
export const ScoreMeter = ScoreMeterAdvanced;
