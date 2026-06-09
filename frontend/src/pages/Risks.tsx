import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Lock,
  KeyRound,
  Users,
  GitBranch,
  Globe,
  MessageSquare,
  Boxes,
  Link2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Eye,
  Zap,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

type Severity = "High" | "Medium" | "Low";

type Finding = {
  id: string;
  title: string;
  severity: Severity;
  platform: string;
  platformIcon: typeof GitBranch;
  status: "Open" | "In Review" | "Mitigated";
  action: string;
  detectedAt: string;
  description: string;
};

const FINDINGS: Finding[] = [
  {
    id: "F-001",
    title: "Google Account has no 2FA",
    severity: "High",
    platform: "Google",
    platformIcon: Globe,
    status: "Open",
    action: "Enable 2FA",
    detectedAt: "2m ago",
    description: "Primary identity provider lacks multi-factor authentication.",
  },
  {
    id: "F-002",
    title: "GitHub has Full Access Permission",
    severity: "High",
    platform: "GitHub",
    platformIcon: GitBranch,
    status: "Open",
    action: "Scope down OAuth permissions",
    detectedAt: "14m ago",
    description: "OAuth token grants repo:* and admin:org scopes.",
  },
  {
    id: "F-003",
    title: "Discord has excessive recovery methods",
    severity: "Medium",
    platform: "Discord",
    platformIcon: MessageSquare,
    status: "In Review",
    action: "Limit account recovery methods",
    detectedAt: "1h ago",
    description: "4 recovery channels enabled — expands attack surface.",
  },
  {
    id: "F-004",
    title: "Third-party app has elevated privileges",
    severity: "Medium",
    platform: "Notion",
    platformIcon: Boxes,
    status: "Open",
    action: "Review connected applications",
    detectedAt: "3h ago",
    description: "Connected workspace app can read/write all pages.",
  },
  {
    id: "F-005",
    title: "Multiple linked accounts detected",
    severity: "Low",
    platform: "Cross-Platform",
    platformIcon: Link2,
    status: "Mitigated",
    action: "Audit linked identities",
    detectedAt: "1d ago",
    description: "6 services share the same recovery email.",
  },
];

const TIMELINE = [
  { time: "Just now", label: "Scan completed", detail: "5 findings indexed", tone: "cyan" },
  { time: "2m ago", label: "High: Google 2FA missing", detail: "Identity exposure", tone: "red" },
  { time: "14m ago", label: "High: GitHub full access", detail: "OAuth over-scoped", tone: "red" },
  { time: "1h ago", label: "Medium: Discord recovery sprawl", detail: "4 recovery methods", tone: "amber" },
  { time: "3h ago", label: "Medium: Notion privileges", detail: "Workspace-wide RW", tone: "amber" },
  { time: "1d ago", label: "Low: Linked accounts", detail: "Shared recovery email", tone: "sky" },
];

const ACTIONS = [
  { icon: Lock, title: "Enable 2FA", detail: "Protect your Google identity in under 60 seconds.", priority: "Critical" },
  { icon: KeyRound, title: "Remove unnecessary permissions", detail: "Revoke admin scopes from 2 OAuth tokens.", priority: "High" },
  { icon: Eye, title: "Review connected applications", detail: "8 third-party apps haven't been used in 30+ days.", priority: "Medium" },
  { icon: Users, title: "Limit account recovery methods", detail: "Reduce Discord recovery channels from 4 → 2.", priority: "Medium" },
];

const severityColor: Record<Severity, { text: string; bg: string; ring: string; dot: string; chart: string }> = {
  High: {
    text: "text-rose-300",
    bg: "bg-rose-500/10",
    ring: "ring-rose-400/30",
    dot: "bg-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.8)]",
    chart: "#fb7185",
  },
  Medium: {
    text: "text-amber-300",
    bg: "bg-amber-500/10",
    ring: "ring-amber-400/30",
    dot: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]",
    chart: "#fbbf24",
  },
  Low: {
    text: "text-sky-300",
    bg: "bg-sky-500/10",
    ring: "ring-sky-400/30",
    dot: "bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]",
    chart: "#38bdf8",
  },
};

const statusStyle = {
  Open: "bg-rose-500/10 text-rose-300 ring-rose-400/30",
  "In Review": "bg-amber-500/10 text-amber-300 ring-amber-400/30",
  Mitigated: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/30",
} as const;

const toneStyle: Record<string, string> = {
  cyan: "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]",
  red: "bg-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.9)]",
  amber: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]",
  sky: "bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]",
};

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_80px_-30px_rgba(8,145,178,0.35)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-blue-500/[0.04]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  delay,
}: {
  label: string;
  value: string | number;
  icon: typeof Shield;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3 }}
    >
      <GlassCard className="p-5 group hover:border-cyan-400/30 transition-colors">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-white tabular-nums">{value}</p>
          </div>
          <div className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${accent}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </GlassCard>
    </motion.div>
  );
}

export default function Risks() {
  const [filter, setFilter] = useState<"All" | Severity>("All");

  const filtered = useMemo(
    () => (filter === "All" ? FINDINGS : FINDINGS.filter((f) => f.severity === filter)),
    [filter]
  );

  const distribution = [
    { name: "High", value: 2, color: "#fb7185" },
    { name: "Medium", value: 2, color: "#fbbf24" },
    { name: "Low", value: 1, color: "#38bdf8" },
  ];

  const riskScore = 72;
  const scoreData = [{ name: "score", value: riskScore, fill: "url(#scoreGradient)" }];

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-[#05070d] text-slate-200">
      <Sidebar currentPath="/risks" />
      <div className="relative flex-1">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/3 h-[520px] w-[520px] rounded-full bg-cyan-500/20 blur-[160px]" />
        <div className="absolute top-40 -right-32 h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-[160px]" />
        <div className="absolute bottom-0 left-0 h-[360px] w-[360px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(56,189,248,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-300/80">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
              LIVE — LINKSYS
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Risk Center
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Identity threats, risky permissions, and suspicious accounts detected across LinkSys.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur transition hover:border-cyan-400/40 hover:bg-cyan-400/5 hover:text-white">
              <Activity className="h-4 w-4 text-cyan-300" /> Re-run scan
            </button>
            <button className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-[0_8px_30px_-8px_rgba(34,211,238,0.7)] transition hover:shadow-[0_10px_40px_-8px_rgba(34,211,238,0.9)]">
              <Shield className="h-4 w-4" /> Mitigate all
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </motion.div>

        {/* Summary */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          <StatCard
            label="Total Findings"
            value={5}
            icon={ShieldAlert}
            accent="bg-cyan-500/10 text-cyan-300 ring-cyan-400/30"
            delay={0.05}
          />
          <StatCard
            label="High Risk"
            value={2}
            icon={AlertTriangle}
            accent="bg-rose-500/10 text-rose-300 ring-rose-400/30"
            delay={0.1}
          />
          <StatCard
            label="Medium Risk"
            value={2}
            icon={Zap}
            accent="bg-amber-500/10 text-amber-300 ring-amber-400/30"
            delay={0.15}
          />
          <StatCard
            label="Low Risk"
            value={1}
            icon={ShieldCheck}
            accent="bg-sky-500/10 text-sky-300 ring-sky-400/30"
            delay={0.2}
          />
          <StatCard
            label="Risk Score"
            value="72/100"
            icon={TrendingUp}
            accent="bg-blue-500/10 text-blue-300 ring-blue-400/30"
            delay={0.25}
          />
        </div>

        {/* Charts row */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">Risk Distribution</h3>
                  <p className="text-xs text-slate-400">Breakdown by severity tier</p>
                </div>
                <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-300 ring-1 ring-white/10">
                  Last 24h
                </span>
              </div>

              <div className="mt-4 grid items-center gap-4 sm:grid-cols-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {distribution.map((d) => (
                          <linearGradient id={`g-${d.name}`} key={d.name} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={d.color} stopOpacity={1} />
                            <stop offset="100%" stopColor={d.color} stopOpacity={0.4} />
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={distribution}
                        innerRadius={62}
                        outerRadius={96}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="rgba(2,6,23,0.6)"
                        strokeWidth={2}
                      >
                        {distribution.map((d) => (
                          <Cell key={d.name} fill={`url(#g-${d.name})`} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "rgba(2,6,23,0.9)",
                          border: "1px solid rgba(34,211,238,0.3)",
                          borderRadius: 12,
                          color: "#e2e8f0",
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {distribution.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ background: d.color, boxShadow: `0 0 12px ${d.color}` }}
                        />
                        <span className="text-sm text-slate-200">{d.name} severity</span>
                      </div>
                      <span className="text-sm font-semibold text-white tabular-nums">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-base font-semibold text-white">Overall Risk Score</h3>
              <p className="text-xs text-slate-400">Composite identity exposure</p>
              <div className="relative mt-2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="72%"
                    outerRadius="100%"
                    data={scoreData}
                    startAngle={220}
                    endAngle={-40}
                  >
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }} dataKey="value" cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Score</span>
                  <span className="mt-1 bg-gradient-to-br from-cyan-300 to-blue-400 bg-clip-text text-5xl font-bold text-transparent tabular-nums">
                    {riskScore}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300 ring-1 ring-amber-400/30">
                    Elevated
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Findings + filter */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6"
        >
          <GlassCard className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-white">Security Findings</h3>
                <p className="text-xs text-slate-400">{filtered.length} of {FINDINGS.length} findings shown</p>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <div className="flex rounded-xl border border-white/10 bg-white/[0.02] p-1">
                  {(["All", "High", "Medium", "Low"] as const).map((s) => {
                    const active = filter === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          active ? "text-slate-950" : "text-slate-300 hover:text-white"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="filter-pill"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-300 to-blue-400 shadow-[0_6px_20px_-6px_rgba(34,211,238,0.8)]"
                          />
                        )}
                        <span className="relative">{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-2 font-medium">Finding</th>
                    <th className="px-4 py-2 font-medium">Severity</th>
                    <th className="px-4 py-2 font-medium">Platform</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {filtered.map((f, i) => {
                      const sev = severityColor[f.severity];
                      const PlatIcon = f.platformIcon;
                      return (
                        <motion.tr
                          key={f.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          className="group"
                        >
                          <td className="rounded-l-xl border-y border-l border-white/5 bg-white/[0.02] px-4 py-3 transition group-hover:bg-cyan-400/5 group-hover:border-cyan-400/20">
                            <div className="flex items-start gap-3">
                              <span className={`mt-1.5 h-2 w-2 rounded-full ${sev.dot}`} />
                              <div>
                                <p className="font-medium text-white">{f.title}</p>
                                <p className="text-xs text-slate-400">{f.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="border-y border-white/5 bg-white/[0.02] px-4 py-3 transition group-hover:bg-cyan-400/5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${sev.bg} ${sev.text} ${sev.ring}`}
                            >
                              {f.severity}
                            </span>
                          </td>
                          <td className="border-y border-white/5 bg-white/[0.02] px-4 py-3 transition group-hover:bg-cyan-400/5">
                            <div className="flex items-center gap-2 text-slate-200">
                              <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                                <PlatIcon className="h-3.5 w-3.5 text-cyan-300" />
                              </span>
                              <span className="text-sm">{f.platform}</span>
                            </div>
                          </td>
                          <td className="border-y border-white/5 bg-white/[0.02] px-4 py-3 transition group-hover:bg-cyan-400/5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyle[f.status]}`}
                            >
                              {f.status === "Mitigated" ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                              {f.status}
                            </span>
                          </td>
                          <td className="rounded-r-xl border-y border-r border-white/5 bg-white/[0.02] px-4 py-3 transition group-hover:bg-cyan-400/5 group-hover:border-cyan-400/20">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-slate-300">{f.action}</span>
                              <button className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-200 transition hover:border-cyan-400/40 hover:bg-cyan-400/15">
                                Fix <ArrowUpRight className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-10 text-center text-sm text-slate-400">No findings at this severity.</div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Actions + Insights */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">Recommended Actions</h3>
                  <p className="text-xs text-slate-400">Prioritized by impact on your risk score</p>
                </div>
                <span className="text-xs text-cyan-300/80">4 actions</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {ACTIONS.map((a, i) => (
                  <motion.div
                    key={a.title}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ transitionDelay: `${i * 40}ms` }}
                    className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-cyan-400/30"
                  >
                    <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 ring-1 ring-cyan-400/20 text-cyan-300">
                        <a.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-white">{a.title}</p>
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-300 ring-1 ring-white/10">
                            {a.priority}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{a.detail}</p>
                        <button className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200">
                          Take action <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GlassCard className="p-6 h-full">
              <h3 className="text-base font-semibold text-white">Security Insights</h3>
              <p className="text-xs text-slate-400">Patterns detected by the analyzer</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">Most vulnerable platform</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                      <Globe className="h-4 w-4 text-cyan-300" />
                    </span>
                    <div>
                      <p className="font-medium text-white">Google</p>
                      <p className="text-xs text-rose-300">2 critical exposures</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">Most common risk type</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                      <KeyRound className="h-4 w-4 text-amber-300" />
                    </span>
                    <div>
                      <p className="font-medium text-white">Excessive permissions</p>
                      <p className="text-xs text-slate-400">3 of 5 findings</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">Permissions analysis</p>
                  <div className="mt-3 space-y-2.5">
                    {[
                      { label: "Over-scoped tokens", value: 68, color: "from-rose-400 to-rose-500" },
                      { label: "Inactive integrations", value: 42, color: "from-amber-400 to-amber-500" },
                      { label: "Healthy grants", value: 86, color: "from-cyan-400 to-blue-500" },
                    ].map((p) => (
                      <div key={p.label}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300">{p.label}</span>
                          <span className="text-slate-400 tabular-nums">{p.value}%</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${p.value}%` }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                            className={`h-full rounded-full bg-gradient-to-r ${p.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 mb-12"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Recent Detections</h3>
                <p className="text-xs text-slate-400">Real-time timeline of discovered risks</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300 ring-1 ring-cyan-400/30">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" /> Streaming
              </span>
            </div>
            <div className="relative mt-6 pl-6">
              <div className="absolute left-2 top-1 bottom-1 w-px bg-gradient-to-b from-cyan-400/60 via-white/10 to-transparent" />
              <ul className="space-y-5">
                {TIMELINE.map((t, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * i }}
                    className="relative"
                  >
                    <span
                      className={`absolute -left-[18px] top-1.5 h-2.5 w-2.5 rounded-full ${toneStyle[t.tone]}`}
                    />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-white">{t.label}</p>
                      <span className="text-xs text-slate-400">{t.time}</span>
                    </div>
                    <p className="text-xs text-slate-400">{t.detail}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </GlassCard>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
