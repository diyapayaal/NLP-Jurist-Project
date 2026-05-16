import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TrendingUp, AlertTriangle } from "lucide-react";

// Chart Props
interface ChartProps {
  className?: string;
}

interface TrendPoint { date: string; score: number; gaps?: number }

export function ComplianceTrendChart({ data, className = "" }: { data?: TrendPoint[]; className?: string }) {
  const fallback = [
    { date: "Jan", score: 62, gaps: 18 },
    { date: "Feb", score: 65, gaps: 16 },
    { date: "Mar", score: 70, gaps: 12 },
    { date: "Apr", score: 73, gaps: 10 },
    { date: "May", score: 78, gaps: 8 },
  ];
  const chartData = data && data.length ? data : fallback;

  return (
    <div className={`glass rounded-2xl p-7 border border-border/40 hover:border-accent/30 hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-foreground">Compliance Trend</h3>
          <p className="text-xs text-muted-foreground/80 mt-1.5 font-medium">Last alignment trend</p>
        </div>
        <TrendingUp className="size-5 text-accent" />
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              background: "rgba(17, 25, 40, 0.95)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
            }}
            labelStyle={{ color: "#f8fafc" }}
          />
          <Area type="monotone" dataKey="score" stroke="#4f46e5" fillOpacity={1} fill="url(#colorScore)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DepartmentImpactChart({ departments, className = "" }: { departments?: string[]; className?: string }) {
  const colors = ["#4f46e5", "#06b6d4", "#67e8f9", "#818cf8", "#06b6d4", "#ef4444"];
  const data = (departments && departments.length)
    ? departments.map((d, i) => ({ name: d, value: Math.round(100 / departments.length), fill: colors[i % colors.length] }))
    : [];

  return (
    <div className={`glass rounded-2xl p-7 border border-border/40 hover:border-accent/30 hover:shadow-lg transition-all duration-300 ${className}`}>
      <h3 className="text-base font-bold text-foreground mb-1">Department Impact</h3>
      <p className="text-xs text-muted-foreground/80 mb-6 font-medium">Affected teams</p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(17, 25, 40, 0.95)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
            }}
            labelStyle={{ color: "#f8fafc" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskDistributionChart({ gaps, className = "" }: { gaps?: Array<{ severity: string }>; className?: string }) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 } as Record<string, number>;
  (gaps || []).forEach((g) => {
    const s = (g as any).severity || "low";
    counts[s] = (counts[s] || 0) + 1;
  });
  
  // If no gaps provided, use realistic demo data
  const hasData = Object.values(counts).some(v => v > 0);
  if (!hasData) {
    counts.critical = 4;
    counts.high = 8;
    counts.medium = 12;
    counts.low = 6;
  }
  
  const data = [
    { name: "Critical", value: counts.critical || 0, fill: "#ef4444" },
    { name: "High", value: counts.high || 0, fill: "#f59e0b" },
    { name: "Medium", value: counts.medium || 0, fill: "#eab308" },
    { name: "Low", value: counts.low || 0, fill: "#22c55e" },
  ];

  return (
    <div className={`glass rounded-2xl p-7 border border-border/40 hover:border-accent/30 hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-foreground">Risk Distribution</h3>
          <p className="text-xs text-muted-foreground/80 mt-1.5 font-medium">Gap severity breakdown</p>
        </div>
        <AlertTriangle className="size-5 text-warning" />
      </div>
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: item.fill }} />
                <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-foreground">{item.value}</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted/40 overflow-hidden">
              <div
                className="h-full transition-all duration-300 group-hover:shadow-lg"
                style={{ width: `${item.value ? Math.min(100, item.value * 10) : 0}%`, backgroundColor: item.fill }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RemediationTimelineChart({ data, className = "" }: { data?: Array<{ week: string; completed: number; planned: number }>; className?: string }) {
  const fallback = [
    { week: "W1", completed: 2, planned: 4 },
    { week: "W2", completed: 4, planned: 3 },
    { week: "W3", completed: 3, planned: 5 },
    { week: "W4", completed: 5, planned: 2 },
    { week: "W5", completed: 4, planned: 6 },
  ];
  const chartData = data && data.length ? data : fallback;

  return (
    <div className={`glass rounded-2xl p-7 border border-border/40 hover:border-accent/30 hover:shadow-lg transition-all duration-300 ${className}`}>
      <h3 className="text-base font-bold text-foreground mb-1">Remediation Timeline</h3>
      <p className="text-xs text-muted-foreground/80 mb-6 font-medium">Weekly action tracking</p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="week" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              background: "rgba(17, 25, 40, 0.95)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
            }}
            labelStyle={{ color: "#f8fafc" }}
          />
          <Legend />
          <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={3} dot={{ fill: "#22c55e", r: 5 }} activeDot={{ r: 7 }} />
          <Line type="monotone" dataKey="planned" stroke="#4f46e5" strokeWidth={3} dot={{ fill: "#4f46e5", r: 5 }} activeDot={{ r: 7 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
