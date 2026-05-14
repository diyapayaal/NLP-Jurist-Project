export type Severity = "low" | "medium" | "high" | "critical";

export interface AnalysisResponse {
  regulation_analysis: {
    regulation_type: string;
    summary: string;
    risk_level: Severity;
    deadline: string;
    affected_departments: string[];
    key_requirements: string[];
    measurable_action_points: string[];
    alignment_score: number;
  };
  gap_analysis: {
    gaps: Array<{ description: string; severity: Severity; affected_policy: string }>;
    remediation_priority: Array<{ title: string; priority: Severity; eta: string }>;
  };
  action_items: Array<{ title: string; owner: string; due: string; status: "pending" | "in_progress" | "done" }>;
}

export const mockAnalysis: AnalysisResponse = {
  regulation_analysis: {
    regulation_type: "RBI Master Direction — KYC (Amendment) 2025",
    summary:
      "Updated customer due diligence, periodic KYC refresh cadence, and PEP screening obligations for scheduled commercial banks. Introduces stricter timelines for adverse media review and beneficial owner identification.",
    risk_level: "high",
    deadline: "2026-09-30",
    affected_departments: ["Compliance", "Retail Banking", "Operations", "IT Risk", "Internal Audit"],
    key_requirements: [
      "Re-KYC every 2 years for high-risk customers",
      "Real-time PEP & sanctions screening at onboarding",
      "Beneficial owner identification at ≥10% threshold",
      "Adverse media review within 24 hours of trigger",
      "Quarterly board reporting on KYC exceptions",
    ],
    measurable_action_points: [
      "Reduce KYC refresh backlog below 1.5%",
      "Achieve <500ms screening latency at onboarding",
      "Train 100% of branch staff on revised CDD norms",
      "Automate beneficial owner attestation workflow",
    ],
    alignment_score: 72,
  },
  gap_analysis: {
    gaps: [
      { description: "PEP screening not running on legacy NRI accounts", severity: "critical", affected_policy: "POL-KYC-014" },
      { description: "Beneficial owner threshold still at 25% in onboarding flow", severity: "high", affected_policy: "POL-CDD-007" },
      { description: "Adverse media monitoring runs daily, not real-time", severity: "medium", affected_policy: "POL-AML-022" },
      { description: "Board MIS missing KYC exception ageing buckets", severity: "medium", affected_policy: "POL-GOV-003" },
      { description: "Branch training records older than 18 months", severity: "low", affected_policy: "POL-HR-031" },
    ],
    remediation_priority: [
      { title: "Patch PEP screening for NRI portfolio", priority: "critical", eta: "2 weeks" },
      { title: "Update onboarding rule engine to 10% BO threshold", priority: "high", eta: "4 weeks" },
      { title: "Procure real-time adverse media feed", priority: "medium", eta: "8 weeks" },
    ],
  },
  action_items: [
    { title: "Form cross-functional KYC taskforce", owner: "Chief Compliance Officer", due: "2026-05-25", status: "in_progress" },
    { title: "Engineering sprint: BO threshold update", owner: "Head of Engineering", due: "2026-06-10", status: "pending" },
    { title: "Vendor RFP — adverse media", owner: "Procurement", due: "2026-06-30", status: "pending" },
    { title: "Branch refresher training rollout", owner: "L&D", due: "2026-07-15", status: "pending" },
    { title: "Board MIS template revision", owner: "Internal Audit", due: "2026-08-01", status: "done" },
  ],
};

export const mockReports = [
  { id: "RPT-2041", title: "RBI KYC Amendment 2025 — Gap Analysis", date: "2026-05-09", size: "2.4 MB", score: 72 },
  { id: "RPT-2038", title: "Digital Lending Guidelines Compliance Review", date: "2026-04-28", size: "1.8 MB", score: 84 },
  { id: "RPT-2031", title: "Cybersecurity Framework Q1 Audit", date: "2026-04-12", size: "3.1 MB", score: 91 },
  { id: "RPT-2025", title: "Outsourcing of IT Services Direction", date: "2026-03-30", size: "1.2 MB", score: 68 },
  { id: "RPT-2017", title: "Fair Practices Code — Branch Network", date: "2026-03-14", size: "950 KB", score: 88 },
  { id: "RPT-2009", title: "Credit Card & Debit Card Issuance Norms", date: "2026-02-22", size: "2.0 MB", score: 76 },
];

export const mockInsights = [
  {
    title: "Predicted compliance drift",
    body: "Based on historical exception trends, KYC refresh backlog is projected to breach 2% threshold by Q3.",
    tone: "warning" as const,
  },
  {
    title: "Cross-regulation overlap",
    body: "PEP screening obligations overlap with PMLA 2024 amendments — consolidating controls can cut effort ~28%.",
    tone: "info" as const,
  },
  {
    title: "Suggested control",
    body: "Introduce a daily reconciliation between onboarding rule engine and core banking BO registry.",
    tone: "success" as const,
  },
  {
    title: "Risk hotspot",
    body: "Branches in tier-3 cities show 3.2× higher adverse media trigger rate than network average.",
    tone: "danger" as const,
  },
];
