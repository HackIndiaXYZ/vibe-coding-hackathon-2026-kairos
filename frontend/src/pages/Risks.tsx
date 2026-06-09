import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import {
  ShieldAlert,
  Activity,
  Lock,
  KeyRound,
  Users,
  GitBranch,
  Globe,
  Search,
  MessageSquare,
  Boxes,
  Link2,
  Eye,
  ArrowUpRight,
  Bell,
  Terminal,
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

const severityColor: Record<Severity, { text: string; bg: string; ring: string; dot: string; border: string; chart: string }> = {
  High: {
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/20",
    dot: "bg-rose-400 shadow-[0_0_8px_#f43f5e]",
    border: "border-rose-500/20",
    chart: "#fb7185",
  },
  Medium: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
    dot: "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
    border: "border-amber-500/20",
    chart: "#fbbf24",
  },
  Low: {
    text: "text-sky-400",
    bg: "bg-sky-500/10",
    ring: "ring-sky-500/20",
    dot: "bg-sky-400 shadow-[0_0_8px_#38bdf8]",
    border: "border-sky-500/20",
    chart: "#38bdf8",
  },
};

const statusStyle = {
  Open: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "In Review": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Mitigated: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
} as const;

const toneStyle: Record<string, string> = {
  cyan: "bg-cyan-500 shadow-[0_0_6px_#22d3ee]",
  red: "bg-rose-400 shadow-[0_0_6px_#f43f5e]",
  amber: "bg-amber-400 shadow-[0_0_6px_#f59e0b]",
  sky: "bg-sky-400 shadow-[0_0_6px_#38bdf8]",
};

/* ---------- Faint atmospheric constellation backdrop (Dashboard Aligned) ---------- */
function AmbientIdentityBackdrop() {
  type N_Backdrop = { id: string; x: number; y: number; kind: string; r?: number; pulse?: boolean };
  const nodes: N_Backdrop[] = [
    { id: "da1", x: 8, y: 15, kind: "email" },
    { id: "da2", x: 25, y: 12, kind: "user", r: 3, pulse: true },
    { id: "da3", x: 12, y: 38, kind: "phone" },
    { id: "da4", x: 32, y: 42, kind: "social" },
    { id: "da5", x: 55, y: 22, kind: "cloud" },
    { id: "da6", x: 78, y: 14, kind: "email" },
    { id: "da7", x: 88, y: 35, kind: "user", r: 3, pulse: true },
    { id: "da8", x: 92, y: 65, kind: "social" },
    { id: "da9", x: 74, y: 82, kind: "web" },
    { id: "da10", x: 48, y: 88, kind: "id" },
  ];

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, N_Backdrop>;

  const edges: Array<[string, string]> = [
    ["da1", "da2"], ["da2", "da3"], ["da2", "da4"],
    ["da4", "da5"], ["da5", "da6"], ["da6", "da7"],
    ["da7", "da8"], ["da8", "da9"], ["da9", "da10"],
    ["da10", "da3"], ["da4", "da7"],
  ];

  const kindColor: Record<string, string> = {
    user: "#67E8F9",
    email: "#00C2FF",
    phone: "#38BDF8",
    social: "#60A5FA",
    cloud: "#22D3EE",
    id: "#A5F3FC",
    web: "#3B82F6",
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.11] mix-blend-screen overflow-hidden">
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="dash-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C2FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="dash-node-glow">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00C2FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {edges.map(([a, b], i) => {
          const A = byId[a];
          const B = byId[b];
          if (!A || !B) return null;
          return (
            <motion.line
              key={`de-${i}`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke="url(#dash-edge)"
              strokeWidth="0.1"
              strokeLinecap="round"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{
                duration: 5 + (i % 4),
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {nodes.filter((n) => n.pulse).map((n) => (
          <motion.circle
            key={`dh-${n.id}`}
            cx={n.x}
            cy={n.y}
            r="2.2"
            fill="url(#dash-node-glow)"
            animate={{ scale: [0.95, 1.25, 0.95], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="0.3" fill={kindColor[n.kind]} opacity="0.9" />
            <circle cx={n.x} cy={n.y} r="0.9" fill="none" stroke={kindColor[n.kind]} strokeWidth="0.06" opacity="0.4" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ---------- Counter Atomic Component ---------- */
function Counter({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{n}</>;
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
    <div className="min-h-screen w-full text-slate-200 antialiased font-sans bg-[#040508] relative selection:bg-cyan-500/20">
      {/* Immersive background layouts to maintain product consistency matrix */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.09),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.22] bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <AmbientIdentityBackdrop />

      <div className="flex relative z-10">
        <Sidebar currentPath="/risks" />
        
        <main className="flex-1 min-w-0">
          
          {/* Top Header Navigation */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.02] bg-[#040508]/40 px-8 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]" />
              <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase">Linksys Command Center</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative group hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
                <input
                  placeholder="Query threat anomalies..."
                  className="w-56 rounded-xl border border-white/[0.04] bg-slate-950/20 py-1.5 pl-9 pr-4 text-xs text-slate-300 placeholder:text-slate-600 outline-none transition-all focus:border-slate-800"
                />
              </div>
              
              <button className="relative text-slate-500 hover:text-slate-300 transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </button>
              
              <div className="h-7 border-l border-white/5" />
              <div className="flex items-center gap-2.5">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-slate-900 border border-white/10 text-[10px] font-bold text-cyan-400">
                  AN
                </div>
                <span className="text-xs font-medium text-slate-400 hidden md:block">Alex Nakamura</span>
              </div>
            </div>
          </header>

          {/* Core Structured Content Padding Container */}
          <div className="max-w-[1120px] mx-auto px-8 py-10 space-y-10">
            
            {/* 1. HERO THREAT STABILIZATION STATE SUMMARY */}
            <motion.header
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-white/[0.03]"
            >
              <div className="space-y-3.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest font-mono text-rose-400 uppercase">
                  <ShieldAlert className="h-4 w-4" /> Threat Matrix Center
                </div>
                <h1 className="text-3xl font-light tracking-tight text-white leading-tight">
                  Risk Assessment & Threat Index
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  Linksys is actively evaluating vulnerabilities across discovered endpoints. Review security gaps, revoke high-privilege permissions, and mitigate over-scoped OAuth frameworks inside connected integrations below.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/5 bg-slate-950/40 px-4 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all">
                  <Activity className="h-3.5 w-3.5" /> Re-run Scan
                </button>
                <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-4 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300 transition-all hover:bg-cyan-500 hover:text-slate-950 shadow-md">
                  Mitigate All Risks <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.header>

            {/* 2. SIMPLIFIED HIGH LEVEL SUMMARY INDEXING METRICS */}
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="rounded-xl border border-white/5 bg-slate-950/20 p-4 shadow-sm relative overflow-hidden">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Total Findings</span>
                <span className="text-2xl font-black font-mono text-white mt-1 block"><Counter value={5} /></span>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/20 p-4 shadow-sm relative overflow-hidden">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono text-rose-500/80">High Severity</span>
                <span className="text-2xl font-black font-mono text-rose-400 mt-1 block"><Counter value={2} /></span>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/20 p-4 shadow-sm relative overflow-hidden">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono text-amber-500/80">Medium Severity</span>
                <span className="text-2xl font-black font-mono text-amber-400 mt-1 block"><Counter value={2} /></span>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/20 p-4 shadow-sm relative overflow-hidden">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono text-sky-500/80">Low Severity</span>
                <span className="text-2xl font-black font-mono text-sky-400 mt-1 block"><Counter value={1} /></span>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/20 p-4 shadow-sm relative overflow-hidden">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono text-cyan-500/80">Composite Score</span>
                <span className="text-2xl font-black font-mono text-cyan-400 mt-1 block">{riskScore}%</span>
              </div>
            </section>

            {/* 3. CORE FINDINGS LIST BLOCK — Clean, Balanced Layout Grid */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pl-0.5">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Security Findings Matrix</h3>
                  <p className="text-[11px] text-slate-500">Isolate operational perimeters by threat levels</p>
                </div>
                
                {/* Clean Filter Element Toggles */}
                <div className="flex rounded-xl border border-white/5 bg-slate-950/30 p-1">
                  {(["All", "High", "Medium", "Low"] as const).map((s) => {
                    const active = filter === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`relative rounded-lg px-3 py-1.5 text-xs font-medium tracking-wide transition-all ${
                          active ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/15" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <span>{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Redesigned Clean List Interface (Prioritizes Scanning & Focus) */}
              <div className="divide-y divide-white/[0.02] border-y border-white/[0.03]">
                <AnimatePresence mode="popLayout">
                  {filtered.map((f) => {
                    const sev = severityColor[f.severity];
                    const PlatIcon = f.platformIcon;
                    return (
                      <motion.div
                        key={f.id}
                        layout
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 group"
                      >
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${sev.bg} ${sev.text} border ${sev.border} mt-0.5`}>
                            <PlatIcon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{f.title}</h4>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[8px] font-black uppercase tracking-wider ${sev.bg} ${sev.text} border ${sev.border}`}>
                                {f.severity}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[8px] font-medium border ${statusStyle[f.status]}`}>
                                {f.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-normal leading-normal max-w-xl">{f.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 md:justify-end justify-between border-t border-white/[0.02] md:border-none pt-3 md:pt-0">
                          <div className="font-mono text-[11px] text-slate-400">
                            Action: <span className="text-slate-200 font-medium">{f.action}</span>
                          </div>
                          <button className="flex items-center gap-1 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300 transition-all hover:bg-cyan-500 hover:text-slate-950 shadow-sm">
                            Fix <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <div className="py-8 text-center text-xs font-mono text-slate-500">No active incidents matching selected severity criteria parameters.</div>
                )}
              </div>
            </section>

            {/* 4. BALANCED RECOMMENDATION & METRIC FEED BLOCKS */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Prioritized Action Center */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-0.5 pl-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Recommended Interventions</h3>
                  <p className="text-[11px] text-slate-500">Calculated remediation steps indexed by exposure density reduction</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACTIONS.map((a) => (
                    <div key={a.title} className="group rounded-xl border border-white/5 bg-slate-950/20 p-4.5 space-y-3 shadow-md relative hover:border-cyan-500/20 transition-all duration-300">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-900 border border-white/5 text-cyan-400">
                          <a.icon className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                          {a.priority}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-200 tracking-tight">{a.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-normal font-normal">{a.detail}</p>
                      </div>

                      <div className="pt-1">
                        <button className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors">
                          Execute Workflow <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Discovery Logs Tracking Stream */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-0.5 pl-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Incident Detection Stream</h3>
                  <p className="text-[11px] text-slate-500">Real-time chronicle log of tracked asset changes</p>
                </div>

                <div className="rounded-2xl border border-white/[0.03] bg-gradient-to-b from-slate-900/10 to-slate-950/40 p-5 shadow-xl min-h-[295px]">
                  <ol className="relative pl-3 space-y-4 border-l border-white/5 font-sans">
                    {TIMELINE.map((t, i) => (
                      <li key={i} className="relative space-y-0.5">
                        <span className={`absolute -left-[16px] top-1.5 h-1.5 w-1.5 rounded-full ${toneStyle[t.tone]}`} />
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-[11px] font-medium text-slate-300 truncate">{t.label}</span>
                          <span className="font-mono text-[9px] text-slate-600 tracking-tight shrink-0 uppercase">{t.time}</span>
                        </div>
                        <div className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">{t.detail}</div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            {/* 5. FUNCTIONAL BALANCING CHART MODULES (Architecture Integrity Preservation) */}
            <div className="hidden opacity-0 pointer-events-none" aria-hidden="true">
              {/* Preserves charting dependency state elements completely hidden without cluttering layout */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {distribution.map((d) => (
                      <linearGradient id={`g-${d.name}`} key={d.name}><stop offset="0%" stopColor={d.color}/></linearGradient>
                    ))}
                  </defs>
                  <Pie data={distribution} dataKey="value"><Cell fill="#fff"/></Pie>
                  <Tooltip/>
                </PieChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="72%" outerRadius="100%" data={scoreData} startAngle={220} endAngle={-40}>
                  <PolarAngleAxis type="number" domain={[0, 100]} />
                  <RadialBar dataKey="value" />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {/* Clean Operating System Footer Design */}
            <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.02] font-mono text-[10px] text-slate-600 tracking-wider">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-500" />
                <span>Linksys ARCHITECTURAL ANALYSIS • SOC 2 READY</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <Terminal className="h-3.5 w-3.5 opacity-60" />
                <span>Risk Intelligence Management Frame v1.0</span>
              </div>
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}