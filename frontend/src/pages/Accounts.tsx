import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import Sidebar from "../components/Sidebar";
import {
  Mail,
  Phone,
  Lock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Link2,
  Search,
  Eye,
  GitBranch,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Network,
  Fingerprint,
  ShieldOff,
  Zap,
  Download,
  KeyRound,
  LayoutGrid,
  Bell,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

/* ---------------- types ---------------- */
type Risk = "Low" | "Medium" | "High";

interface Account {
  id: string;
  platform: string;
  username: string;
  email: string;
  phone?: string;
  risk: Risk;
  twoFA: boolean;
  health: number;
  lastActive: string;
  permissions: string[];
  icon: string;
  hue: string;
}

/* ---------------- mock data ---------------- */
const ACCOUNTS: Account[] = [
  { id: "google", platform: "Google", username: "sanika.mane", email: "sanika@gmail.com", phone: "+91 XXXXXXXX21", risk: "Low", twoFA: true, health: 95, lastActive: "2h ago", permissions: ["Contacts", "Drive Access"], icon: "G", hue: "#67E8F9" },
  { id: "github", platform: "GitHub", username: "sanika-dev", email: "sanika.dev@gmail.com", phone: "+91 XXXXXXXX21", risk: "High", twoFA: false, health: 58, lastActive: "1d ago", permissions: ["Repository Access", "Admin Access"], icon: "GH", hue: "#A78BFA" },
  { id: "discord", platform: "Discord", username: "sanika#1234", email: "sanika.work@gmail.com", phone: "+91 XXXXXXXX84", risk: "Medium", twoFA: true, health: 78, lastActive: "5h ago", permissions: ["Account Management"], icon: "D", hue: "#818CF8" },
  { id: "linkedin", platform: "LinkedIn", username: "sanika-mane", email: "sanika@gmail.com", risk: "Low", twoFA: true, health: 92, lastActive: "3d ago", permissions: ["Profile"], icon: "in", hue: "#3B82F6" },
  { id: "slack", platform: "Slack", username: "sanika", email: "sanika.work@gmail.com", risk: "Medium", twoFA: false, health: 74, lastActive: "12h ago", permissions: ["Workspace"], icon: "S", hue: "#F472B6" },
  { id: "notion", platform: "Notion", username: "sanika-work", email: "sanika.work@gmail.com", risk: "Low", twoFA: true, health: 90, lastActive: "1h ago", permissions: ["Workspace"], icon: "N", hue: "#E5E7EB" },
  { id: "figma", platform: "Figma", username: "sanika-design", email: "sanika.dev@gmail.com", risk: "Medium", twoFA: true, health: 80, lastActive: "8h ago", permissions: ["Files"], icon: "F", hue: "#F87171" },
  { id: "x", platform: "X (Twitter)", username: "@sanika_it", email: "sanika@gmail.com", risk: "High", twoFA: false, health: 61, lastActive: "6d ago", permissions: ["Tweets", "DMs"], icon: "X", hue: "#E2E8F0" },
];

const ACTIVITY = [
  { id: 1, icon: GitBranch, color: "#A78BFA", text: "GitHub permissions updated", time: "2m ago" },
  { id: 2, icon: ShieldCheck, color: "#67E8F9", text: "Google login detected from new device", time: "1h ago" },
  { id: 3, icon: KeyRound, color: "#818CF8", text: "Discord recovery method changed", time: "4h ago" },
  { id: 4, icon: Sparkles, color: "#00C2FF", text: "New account discovered: Figma", time: "1d ago" },
  { id: 5, icon: Shield, color: "#3B82F6", text: "Security scan completed across 8 platforms", time: "2d ago" },
];

const riskStyles: Record<Risk, { text: string; bg: string; border: string; glow: string }> = {
  Low: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-[0_0_8px_#10b981]" },
  Medium: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "shadow-[0_0_8px_#f59e0b]" },
  High: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", glow: "shadow-[0_0_8px_#f43f5e]" },
};

/* ---------- Animated counter ---------- */
function Counter({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration, ease: [0.22, 1, 0.36, 1] });
      return controls.stop;
    }
  }, [inView, to, duration, mv]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
}

function InsightRow({
  icon: Icon,
  tone,
  title,
  value,
  detail,
}: {
  icon: any;
  tone: "rose" | "amber" | "violet" | "cyan" | "emerald";
  title: string;
  value: string;
  detail: string;
}) {
  const toneStyles: Record<string, string> = {
    rose: "text-rose-300 bg-rose-500/10 border-rose-500/10",
    amber: "text-amber-300 bg-amber-500/10 border-amber-500/10",
    violet: "text-violet-300 bg-violet-500/10 border-violet-500/10",
    cyan: "text-cyan-300 bg-cyan-500/10 border-cyan-500/10",
    emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-500/10",
  };

  return (
    <div className={`rounded-3xl border p-4 ${toneStyles[tone]} border-white/5 bg-slate-950/40`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-slate-200">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-300">{title}</span>
      </div>
      <div className="mt-4 text-sm font-semibold text-white">{value}</div>
      <div className="mt-2 text-xs leading-5 text-slate-400">{detail}</div>
    </div>
  );
}

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

/* ---------------- main ---------------- */
export default function Accounts() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Low" | "Medium" | "High" | "2FA Enabled" | "2FA Disabled">("All");

  const filtered = useMemo(() => {
    return ACCOUNTS.filter((a) => {
      const q = query.toLowerCase();
      const matchesQuery = !q || a.platform.toLowerCase().includes(q) || a.username.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
      const matchesFilter =
        filter === "All" ? true :
        filter === "2FA Enabled" ? a.twoFA :
        filter === "2FA Disabled" ? !a.twoFA :
        a.risk === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  const stats = {
    total: ACCOUNTS.length,
    twoFA: ACCOUNTS.filter((a) => a.twoFA).length,
    high: ACCOUNTS.filter((a) => a.risk === "High").length,
    medium: ACCOUNTS.filter((a) => a.risk === "Medium").length,
    platforms: ACCOUNTS.length,
  };

  const without2FA = ACCOUNTS.filter((a) => !a.twoFA);
  const mostVulnerable = [...ACCOUNTS].sort((a, b) => a.health - b.health)[0];
  const elevated = ACCOUNTS.filter((a) => a.permissions.some((p) => /admin/i.test(p)));
  const emailMap = new Map<string, string[]>();
  const userMap = new Map<string, string[]>();
  ACCOUNTS.forEach((a) => {
    emailMap.set(a.email, [...(emailMap.get(a.email) ?? []), a.platform]);
    userMap.set(a.username, [...(userMap.get(a.username) ?? []), a.platform]);
  });
  const reusedEmails = [...emailMap.entries()].filter(([, v]) => v.length > 1);
  const reusedUsernames = [...userMap.entries()].filter(([, v]) => v.length > 1);

  const healthData = ACCOUNTS.map((a) => ({ name: a.platform, score: a.health }));
  const riskData = [
    { name: "Low", value: ACCOUNTS.filter((a) => a.risk === "Low").length, color: "#34D399" },
    { name: "Medium", value: stats.medium, color: "#F59E0B" },
    { name: "High", value: stats.high, color: "#F43F5E" },
  ];

  const overview = [
    { label: "Total Accounts", value: stats.total, icon: Users, trend: "+2", color: "#00C2FF" },
    { label: "2FA Enabled", value: stats.twoFA, icon: ShieldCheck, trend: "+1", color: "#34D399" },
    { label: "High Risk", value: stats.high, icon: ShieldAlert, trend: "-1", color: "#F43F5E" },
    { label: "Medium Risk", value: stats.medium, icon: AlertTriangle, trend: "0", color: "#F59E0B" },
    { label: "Platforms", value: stats.platforms, icon: Layers, trend: "+1", color: "#A78BFA" },
  ];

  const quickActions = [
    { label: "Analyze Account", icon: Fingerprint, color: "#00C2FF" },
    { label: "Run Security Scan", icon: Shield, color: "#67E8F9" },
    { label: "View Identity", icon: Eye, color: "#A78BFA" },
    { label: "Review Permissions", icon: KeyRound, color: "#3B82F6" },
    { label: "Export Report", icon: Download, color: "#F472B6" },
  ];

  const filters: (typeof filter)[] = ["All", "Low", "Medium", "High", "2FA Enabled", "2FA Disabled"];

  return (
    <div className="min-h-screen w-full text-slate-200 antialiased font-sans bg-[#040508] relative selection:bg-cyan-500/20">
      {/* Immersive background layout to precisely mirror clean dashboard blueprint */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.09),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.22] bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <AmbientIdentityBackdrop />

      <div className="flex relative z-10">
        <Sidebar currentPath="/accounts" />
        
        <main className="flex-1 min-w-0">
          
          {/* Top Header Navigation */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.02] bg-[#040508]/40 px-8 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]" />
              <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase">Linksys Command Center</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter parameters..."
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

          {/* Clean Overview Workspace Flow */}
          <div className="max-w-[1120px] mx-auto px-8 py-10 space-y-10">
            
            {/* Hero Header Space */}
            <motion.header
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/[0.03]"
            >
              <div className="space-y-3.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest font-mono text-cyan-400 uppercase">
                  <Sparkles className="h-3.5 w-3.5" /> Account Intelligence Center
                </div>
                <h1 className="text-3xl font-light tracking-tight text-white leading-tight">
                  Accounts Management
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  Visualize, audit, and cleanly secure every digital ecosystem account connected to Linksys. Manage environment authorization risks, credential tokens, metadata permissions, and alignment integrity in one cohesive space.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button className="group inline-flex h-9 items-center gap-2 rounded-xl border border-white/5 bg-slate-950/40 px-4 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all">
                  <Download className="h-3.5 w-3.5" /> Export
                </button>
                <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-4 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300 transition-all hover:bg-cyan-500 hover:text-slate-950 shadow-md">
                  <Zap className="h-3.5 w-3.5 animate-pulse" /> Run Scan
                </button>
              </div>
            </motion.header>

            {/* High-Level Counters Section */}
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {overview.map((c) => (
                <div key={c.label} className="rounded-xl border border-white/5 bg-slate-950/20 p-4 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center" style={{ color: c.color }}>
                      <c.icon className="h-4 w-4" />
                    </div>
                    <span className={`flex items-center gap-0.5 font-mono text-[8px] font-bold px-1.5 py-0.5 rounded-full ${c.trend.startsWith("-") ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                      {c.trend}
                    </span>
                  </div>
                  <div className="mt-3 text-2xl font-bold font-mono text-white">
                    <Counter to={c.value} />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mt-0.5">{c.label}</div>
                </div>
              ))}
            </section>

            {/* Filter Toggle Sub-row Layout */}
            <div className="flex items-center gap-2 bg-slate-950/20 p-1 rounded-xl border border-white/5 w-fit">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium tracking-wide transition-all ${
                    filter === f ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/15" : "text-slate-400 hover:text-white border border-transparent"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Account Profile Cards Flow */}
            <section className="space-y-4">
              <div className="flex items-baseline justify-between pl-0.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Discovered Footprint Profiles</h3>
                <span className="text-xs text-slate-500 font-mono">{filtered.length} of {ACCOUNTS.length} matching entries</span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((a) => {
                    const risk = riskStyles[a.risk];
                    return (
                      <motion.div
                        key={a.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900/40 to-slate-950/60 p-5 shadow-lg flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-300"
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-bold font-mono" style={{ color: a.hue, borderColor: `${a.hue}33`, background: `${a.hue}10` }}>
                                {a.icon}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white tracking-tight">{a.platform}</div>
                                <div className="text-[11px] text-slate-400 font-mono">@{a.username}</div>
                              </div>
                            </div>
                            <span className={`rounded-full border px-2 py-0.5 font-mono text-[8px] font-black uppercase tracking-wider ${risk.text} ${risk.bg} ${risk.border}`}>
                              {a.risk} Risk
                            </span>
                          </div>

                          <div className="space-y-1.5 font-mono text-[11px] text-slate-400 border-t border-white/5 pt-3">
                            <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-600 shrink-0" /><span className="truncate text-slate-300">{a.email}</span></div>
                            {a.phone && <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-600 shrink-0" /><span className="text-slate-300">{a.phone}</span></div>}
                            <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-slate-600 shrink-0" /><span className="text-slate-500">Active {a.lastActive}</span></div>
                          </div>
                        </div>

                        <div className="space-y-3 mt-4 pt-3 border-t border-white/5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider ${a.twoFA ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-rose-500/20 bg-rose-500/5 text-rose-400"}`}>
                              2FA {a.twoFA ? "Active" : "Off"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                              <KeyRound className="h-3 w-3 text-cyan-400/70" /> {a.permissions.length} perms
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                              <span>Health Score</span>
                              <span className="font-bold text-slate-300">{a.health}%</span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${a.health}%`,
                                  background: a.health >= 85 ? "#34D399" : a.health >= 70 ? "#F59E0B" : "#F43F5E",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </section>

            {/* 3. SECURITY INSIGHT PANEL & ACTIVITY TELEMETRY */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Insight Rows */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pl-0.5">Threat Matrix Observations</h3>
                <div className="rounded-2xl border border-white/[0.03] bg-gradient-to-b from-slate-900/10 to-slate-950/40 p-5 shadow-xl">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InsightRow icon={ShieldOff} tone="rose" title="Accounts without 2FA" value={`${without2FA.length} accounts`} detail={without2FA.map((a) => a.platform).join(", ")} />
                    <InsightRow icon={AlertTriangle} tone="amber" title="Vulnerable Extremity" value={`${mostVulnerable.platform} · Health: ${mostVulnerable.health}%`} detail="Enforce 2FA variables immediately" />
                    <InsightRow icon={KeyRound} tone="violet" title="Elevated Scopes" value={`${elevated.length} platforms`} detail={elevated.map((a) => a.platform).join(", ") || "None flagged"} />
                    <InsightRow icon={Mail} tone="cyan" title="Reused Emails groups" value={`${reusedEmails.length} sets`} detail={reusedEmails.map(([email, plats]) => `${email} → ${plats.join(", ")}`).join(" • ")} />
                    <InsightRow icon={Users} tone="cyan" title="Reused Usernames" value={`${reusedUsernames.length} instances`} detail={reusedUsernames.length ? "Overlap structures discovered" : "None detected"} />
                    <InsightRow icon={CheckCircle2} tone="emerald" title="Prescriptive Recommendation" value="Enforce Multi-Factor Access" detail="Action targets: GitHub, Slack, X" />
                  </div>
                </div>
              </div>

              {/* Activity Feeds stream */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pl-0.5">Trace Events</h3>
                <div className="rounded-2xl border border-white/[0.03] bg-gradient-to-b from-slate-900/10 to-slate-950/40 p-5 shadow-xl">
                  <ol className="relative pl-3 space-y-4.5 border-l border-white/5 font-sans">
                    {ACTIVITY.map((e) => (
                      <li key={e.id} className="relative group space-y-0.5">
                        <span className="absolute -left-[16px] top-1.5 h-1.5 w-1.5 rounded-full" style={{ background: e.color, boxShadow: `0 0 6px ${e.color}` }} />
                        <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
                          <e.icon className="h-3 w-3 shrink-0" style={{ color: e.color }} />
                          <span className="truncate">{e.text}</span>
                        </div>
                        <div className="font-mono text-[9px] text-slate-600 uppercase tracking-wide">{e.time}</div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            {/* Scope Matrix Overview Mapping */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pl-0.5">Authorized Permissions Matrix</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ACCOUNTS.filter((a) => a.permissions.length).map((a) => (
                  <div key={a.id} className="rounded-xl border border-white/5 bg-slate-950/30 p-4.5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 border border-white/5 text-[10px] font-bold" style={{ color: a.hue }}>
                          {a.icon}
                        </div>
                        <span className="text-xs font-bold text-white tracking-tight">{a.platform}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{a.permissions.length} scopes active</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {a.permissions.map((p) => {
                        const severe = /admin|drive|repository|dms/i.test(p);
                        return (
                          <span key={p} className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                            severe ? "border-rose-500/20 bg-rose-500/5 text-rose-400 font-semibold" : "border-white/5 bg-slate-950/40 text-slate-400"
                          }`}>
                            {severe && <ShieldAlert className="h-2.5 w-2.5 shrink-0 text-rose-400" />}
                            <span>{p}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions Action Matrix Panel */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pl-0.5">Workflow Triggers</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {quickActions.map((q) => (
                  <button
                    key={q.label}
                    className="group relative overflow-hidden rounded-xl border border-white/5 bg-slate-950/40 p-4 text-left transition-colors hover:border-cyan-500/30"
                  >
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.06), rgba(99,102,241,0.03))" }} />
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-slate-900/50" style={{ color: q.color }}>
                      <q.icon className="h-4 w-4" />
                    </div>
                    <div className="relative mt-3 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300">{q.label}</div>
                    <div className="relative mt-1 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 transition-colors">
                      <Link2 className="h-2.5 w-2.5" /> Launch
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Distribution Graph Block Metrics */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pl-0.5">Platform Integrity Balance</h3>
                <div className="rounded-2xl border border-white/5 bg-slate-950/10 p-5 h-64 pr-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={healthData} margin={{ left: -25, right: 5, top: 5, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis dataKey="name" stroke="#475569" fontSize={10} fontFamily="monospace" tickLine={false} />
                      <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" tickLine={false} />
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.02)" }}
                        contentStyle={{ background: "#090d1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#cbd5e1", fontSize: 11, fontFamily: "monospace" }}
                      />
                      <Bar dataKey="score" fill="url(#barGrad)" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pl-0.5">Spread Metrics</h3>
                <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900/30 to-slate-950/60 p-5 flex flex-col justify-between h-64">
                  <div className="h-36 w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={riskData} dataKey="value" innerRadius={44} outerRadius={60} paddingAngle={4} stroke="none">
                          {riskData.map((d) => (
                            <Cell key={d.name} fill={d.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#090d1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#cbd5e1", fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <LayoutGrid className="h-4 w-4 text-slate-600" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] pt-1">
                    {riskData.map((r) => (
                      <div key={r.name} className="flex flex-col items-center rounded-lg bg-slate-950/40 border border-white/5 py-1">
                        <span className="text-slate-500 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ background: r.color }} />{r.name}</span>
                        <span className="text-slate-200 font-bold mt-0.5">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Clean System Footer Area */}
            <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.02] font-mono text-[10px] text-slate-600 tracking-wider">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-500" />
                <span>Linksys CORE AUDIT STREAM • SOC 2 READY</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <Network className="h-3.5 w-3.5 opacity-60" />
                <span>Account Intelligence Management Frame v1.0</span>
              </div>
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}