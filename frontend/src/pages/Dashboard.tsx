import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Fingerprint,
  Users,
  ShieldAlert,
  Share2,
  User,
  Search,
  Bell,
  Mail,
  Phone,
  Link2,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
  ScanLine,
  Sparkles,
  Download,
  GitBranch,
  Globe,
  MessageCircle,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  Lock,
  Plus,
  Eye,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
import ReactFlow, {
  Background,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

/* ---------- Animated counter ---------- */
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

/* ---------- Mock data ---------- */
const summary = [
  { label: "Total Emails", value: 3, icon: Mail, trend: "+1", up: true, hue: "from-cyan-400 to-blue-500" },
  { label: "Total Phones", value: 2, icon: Phone, trend: "0", up: true, hue: "from-blue-400 to-indigo-500" },
  { label: "Connected Accounts", value: 8, icon: Link2, trend: "+2", up: true, hue: "from-violet-400 to-fuchsia-500" },
  { label: "Permissions", value: 10, icon: KeyRound, trend: "+3", up: false, hue: "from-sky-400 to-cyan-500" },
  { label: "Risk Findings", value: 5, icon: ShieldAlert, trend: "-1", up: true, hue: "from-rose-400 to-purple-500" },
];

const findings = [
  { title: "Google Account has no 2FA", desc: "Enable two-factor authentication immediately.", sev: "High" },
  { title: "GitHub has Full Access permission", desc: "Third-party OAuth app holds repo:admin scope.", sev: "High" },
  { title: "Discord recovery methods exceed threshold", desc: "4 recovery options detected — reduce to 2.", sev: "Medium" },
  { title: "Third-party app has elevated privileges", desc: "Notion integration can read all workspaces.", sev: "Medium" },
  { title: "Multiple linked accounts detected", desc: "Same email tied to 6 social platforms.", sev: "Low" },
];

const sevStyles: Record<string, { bg: string; text: string; ring: string; Icon: any }> = {
  High: { bg: "bg-rose-500/10", text: "text-rose-300", ring: "ring-rose-500/30", Icon: AlertOctagon },
  Medium: { bg: "bg-amber-500/10", text: "text-amber-300", ring: "ring-amber-500/30", Icon: AlertTriangle },
  Low: { bg: "bg-sky-500/10", text: "text-sky-300", ring: "ring-sky-500/30", Icon: AlertCircle },
};

const trendData = Array.from({ length: 12 }).map((_, i) => ({
  m: `W${i + 1}`,
  score: 50 + Math.round(20 * Math.sin(i / 2) + i * 1.4),
  exposure: 30 + Math.round(15 * Math.cos(i / 2.2) + i),
}));

const distData = [
  { name: "Critical", value: 1, color: "#f43f5e" },
  { name: "High", value: 2, color: "#fb923c" },
  { name: "Medium", value: 5, color: "#67E8F9" },
  { name: "Low", value: 8, color: "#3B82F6" },
];

const acctData = [
  { type: "Social", count: 4 },
  { type: "Dev", count: 2 },
  { type: "Cloud", count: 3 },
  { type: "Finance", count: 1 },
  { type: "Mail", count: 3 },
];

const activity = [
  { t: "2m ago", text: "New account discovered: Figma", icon: Plus, color: "text-cyan-300" },
  { t: "14m ago", text: "Permission analyzed: GitHub repo:admin", icon: Eye, color: "text-violet-300" },
  { t: "1h ago", text: "Risk detected: Google account missing 2FA", icon: ShieldAlert, color: "text-rose-300" },
  { t: "3h ago", text: "Recovery method linked: +1 ••• 4421", icon: Phone, color: "text-sky-300" },
  { t: "Yesterday", text: "Scan completed across 8 platforms", icon: ScanLine, color: "text-emerald-300" },
];

const nav = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    active: true,
  },
  {
    label: "Identities",
    icon: Fingerprint,
    path: "/identities",
  },
  {
    label: "Accounts",
    icon: Users,
    path: "/accounts",
  },
  {
    label: "Risks",
    icon: ShieldAlert,
    path: "/risks",
  },
  {
    label: "Graph View",
    icon: Share2,
    path: "/graph",
  },
  {
    label: "Profile",
    icon: User,
    path: "/profile",
  },
];


/* ---------- React Flow custom node ---------- */
function GNode({ data }: NodeProps<{ label: string; icon: any; tone: string }>) {
  const Icon = data.icon;
  return (
    <div
      className={`relative flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md ${data.tone}`}
      style={{ boxShadow: "0 0 24px rgba(0,194,255,0.25)" }}
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !border-0 !bg-cyan-300" />
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium text-slate-100">{data.label}</span>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-0 !bg-cyan-300" />
    </div>
  );
}
const nodeTypes = { g: GNode };

const flowNodes: Node[] = [
  { id: "u", type: "g", position: { x: 0, y: 140 }, data: { label: "You", icon: User, tone: "text-cyan-200" } },
  { id: "e", type: "g", position: { x: 200, y: 40 }, data: { label: "Email", icon: Mail, tone: "text-sky-200" } },
  { id: "p", type: "g", position: { x: 200, y: 240 }, data: { label: "Phone", icon: Phone, tone: "text-violet-200" } },
  { id: "g", type: "g", position: { x: 420, y: 0 }, data: { label: "Google", icon: Globe, tone: "text-blue-200" } },
  { id: "gh", type: "g", position: { x: 420, y: 90 }, data: { label: "GitHub", icon: GitBranch, tone: "text-slate-200" } },
  { id: "d", type: "g", position: { x: 420, y: 180 }, data: { label: "Discord", icon: MessageCircle, tone: "text-indigo-200" } },
  { id: "r", type: "g", position: { x: 420, y: 270 }, data: { label: "Recovery", icon: KeyRound, tone: "text-fuchsia-200" } },
];
const flowEdges: Edge[] = [
  { id: "1", source: "u", target: "e", animated: true, style: { stroke: "#67E8F9" } },
  { id: "2", source: "u", target: "p", animated: true, style: { stroke: "#a78bfa" } },
  { id: "3", source: "e", target: "g", animated: true, style: { stroke: "#00C2FF" } },
  { id: "4", source: "e", target: "gh", animated: true, style: { stroke: "#00C2FF" } },
  { id: "5", source: "p", target: "d", animated: true, style: { stroke: "#a78bfa" } },
  { id: "6", source: "p", target: "r", animated: true, style: { stroke: "#a78bfa" } },
];

/* ---------- Risk gauge ---------- */
function RiskGauge({ score }: { score: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const pct = score / 100;
  return (
    <div className="relative h-44 w-44">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="rg" x1="0" x2="1">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
        <motion.circle
          cx="80"
          cy="80"
          r={r}
          stroke="url(#rg)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - c * pct }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 8px rgba(0,194,255,0.6))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-white">
          <Counter value={score} />
        </div>
        <div className="text-xs text-slate-400">/ 100</div>
      </div>
    </div>
  );
}

/* ---------- Dashboard ---------- */
export default function Dashboard() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="min-h-screen w-full text-slate-100"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% -10%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(900px 500px at 110% 10%, rgba(168,85,247,0.18), transparent 60%), linear-gradient(180deg, #050816 0%, #0B1120 100%)",
      }}
    >
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          animate={{ width: collapsed ? 76 : 240 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
          className="sticky top-0 h-screen border-r border-white/5 bg-white/[0.02] backdrop-blur-xl"
        >
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500">
                <Fingerprint className="absolute inset-1 text-slate-950" />
                <div className="absolute inset-0 rounded-lg blur-md opacity-60 bg-gradient-to-br from-cyan-400 to-violet-500" />
              </div>
              {!collapsed && (
                <div className="leading-tight">
                  <div className="text-sm font-semibold">Footprint</div>
                  <div className="text-[10px] text-cyan-300/80">MAPPER</div>
                </div>
              )}
            </div>
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
          <nav className="mt-4 space-y-1 px-3">
            {nav.map((n) => {
  const Icon = n.icon;

  return (
    <button
      key={n.label}
      onClick={() => {
  if (n.label === "Dashboard") {
    navigate("/dashboard");
  } else if (n.label === "Identities") {
    navigate("/identities");
  } else if (n.label === "Accounts") {
    navigate("/accounts");
  } else if (n.label === "Risks") {
    navigate("/risks");
  } else if (n.label === "Profile") {
    navigate("/profile");
  }
}}
      className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        n.active
          ? "bg-gradient-to-r from-cyan-500/15 to-violet-500/10 text-white"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {n.active && (
        <span className="absolute inset-y-1 left-0 w-0.5 rounded-r bg-gradient-to-b from-cyan-300 to-violet-400 shadow-[0_0_10px_#00C2FF]" />
      )}

      <Icon className="h-4 w-4 shrink-0" />

      {!collapsed && <span>{n.label}</span>}
    </button>
  );
})}
          </nav>
          {!collapsed && (
            <div className="absolute bottom-4 left-3 right-3 rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-3">
              <div className="flex items-center gap-2 text-xs text-cyan-200">
                <Shield className="h-4 w-4" /> Protection Active
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Last scan 4 min ago</div>
            </div>
          )}
        </motion.aside>

        {/* Main */}
        <main className="flex-1">
          {/* Topbar */}
          <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-white/5 bg-[#050816]/60 px-6 backdrop-blur-xl">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-cyan-300/80">Overview</div>
              <h1 className="text-lg font-semibold">Digital Footprint Dashboard</h1>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  placeholder="Search identities, accounts, risks…"
                  className="w-80 rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
              <button className="relative rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00C2FF]" />
              </button>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-1 pl-1 pr-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-xs font-bold text-slate-950">
                  AN
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-medium">Alex Nakamura</div>
                  <div className="text-[10px] text-slate-400">Pro · Secured</div>
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-6">
            {/* Summary */}
            <motion.section
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5"
            >
              {summary.map((s) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl"
                  >
                    <div
                      className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${s.hue} opacity-0 blur-xl transition group-hover:opacity-20`}
                    />
                    <div className="relative flex items-start justify-between">
                      <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.hue} text-slate-950 shadow-[0_0_20px_rgba(0,194,255,0.35)]`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${s.up ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>
                        {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {s.trend}
                      </span>
                    </div>
                    <div className="relative mt-4 text-3xl font-bold tracking-tight">
                      <Counter value={s.value} />
                    </div>
                    <div className="relative text-xs text-slate-400">{s.label}</div>
                  </motion.div>
                );
              })}
            </motion.section>

            {/* Risk + Identity */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Risk score */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 backdrop-blur-xl lg:col-span-1"
              >
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-cyan-300/80">Risk Score</div>
                    <div className="mt-1 text-sm text-slate-300">Your exposure level</div>
                  </div>
                  <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-medium text-amber-300 ring-1 ring-amber-500/30">
                    Elevated
                  </span>
                </div>
                <div className="relative mt-4 flex flex-col items-center">
                  <RiskGauge score={72} />
                  <p className="mt-4 text-center text-xs text-slate-400">
                    72 / 100 indicates an <span className="text-amber-300">elevated</span> exposure across 3 connected
                    identities. Resolve 2 high-severity findings to drop below 50.
                  </p>
                </div>
              </motion.div>

              {/* Identity overview */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:col-span-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Identity Overview</h3>
                  <span className="text-[11px] text-slate-400">Mapped 14 entities</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { l: "Emails", v: "3", sub: "1 primary", Icon: Mail, c: "from-cyan-400/20 to-blue-500/20" },
                    { l: "Phones", v: "2", sub: "1 verified", Icon: Phone, c: "from-blue-400/20 to-indigo-500/20" },
                    { l: "Recovery", v: "5", sub: "Methods", Icon: KeyRound, c: "from-fuchsia-400/20 to-violet-500/20" },
                    { l: "Platforms", v: "8", sub: "Linked", Icon: Link2, c: "from-sky-400/20 to-cyan-500/20" },
                  ].map((x) => (
                    <div key={x.l} className={`rounded-xl border border-white/10 bg-gradient-to-br ${x.c} p-4`}>
                      <x.Icon className="h-4 w-4 text-cyan-200" />
                      <div className="mt-2 text-2xl font-semibold">{x.v}</div>
                      <div className="text-xs text-slate-300">{x.l}</div>
                      <div className="text-[10px] text-slate-400">{x.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Linked Platforms</span>
                    <span>Last sync · just now</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { n: "Google", I: Globe },
                      { n: "GitHub", I: GitBranch },
                      { n: "Discord", I: MessageCircle },
                      { n: "Notion", I: Sparkles },
                      { n: "Figma", I: Activity },
                      { n: "X", I: Share2 },
                      { n: "LinkedIn", I: Users },
                      { n: "Slack", I: MessageCircle },
                    ].map((p) => (
                      <div
                        key={p.n}
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200 hover:border-cyan-400/40"
                      >
                        <p.I className="h-3.5 w-3.5 text-cyan-300" />
                        {p.n}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Findings + Quick actions */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:col-span-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Risk Findings</h3>
                  <span className="text-[11px] text-slate-400">{findings.length} active</span>
                </div>
                <div className="mt-4 space-y-2">
                  <AnimatePresence>
                    {findings.map((f, i) => {
                      const s = sevStyles[f.sev];
                      return (
                        <motion.div
                          key={f.title}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:border-cyan-400/30"
                        >
                          <div className={`grid h-9 w-9 place-items-center rounded-lg ${s.bg} ${s.text} ring-1 ${s.ring}`}>
                            <s.Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{f.title}</div>
                            <div className="truncate text-xs text-slate-400">{f.desc}</div>
                          </div>
                          <span className={`hidden rounded-full px-2 py-0.5 text-[10px] sm:inline ${s.bg} ${s.text} ring-1 ${s.ring}`}>
                            {f.sev}
                          </span>
                          <button className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200 transition hover:bg-cyan-400/20">
                            Resolve
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                  <h3 className="text-sm font-semibold">Quick Actions</h3>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[
                      { l: "Scan Accounts", I: ScanLine },
                      { l: "Analyze Risks", I: ShieldAlert },
                      { l: "View Graph", I: Share2 },
                      { l: "Export Report", I: Download },
                    ].map((a) => (
                      <motion.button
                        key={a.l}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-3 text-left"
                      >
                        <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: "linear-gradient(135deg, rgba(0,194,255,0.15), rgba(168,85,247,0.15))" }} />
                        <a.I className="relative h-4 w-4 text-cyan-300" />
                        <div className="relative mt-2 text-xs font-medium">{a.l}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                  <h3 className="text-sm font-semibold">Recent Activity</h3>
                  <ol className="mt-3 space-y-3">
                    {activity.map((e, i) => {
                      const I = e.icon;
                      return (
                        <li key={i} className="relative flex gap-3 pl-4">
                          <span className="absolute left-1 top-2 h-full w-px bg-gradient-to-b from-cyan-400/40 to-transparent" />
                          <span className={`absolute left-0 top-1.5 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#00C2FF]`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-xs">
                              <I className={`h-3.5 w-3.5 ${e.color}`} />
                              <span className="text-slate-200">{e.text}</span>
                            </div>
                            <div className="text-[10px] text-slate-500">{e.t}</div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </motion.div>
            </section>

            {/* Analytics */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:col-span-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Security Posture Trend</h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-400" />Risk Score</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-violet-400" />Exposure</span>
                  </div>
                </div>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#00C2FF" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#00C2FF" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="m" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(11,17,32,0.95)",
                          border: "1px solid rgba(0,194,255,0.3)",
                          borderRadius: 12,
                          color: "#e2e8f0",
                          fontSize: 12,
                        }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#00C2FF" strokeWidth={2} fill="url(#g1)" />
                      <Area type="monotone" dataKey="exposure" stroke="#a78bfa" strokeWidth={2} fill="url(#g2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
              >
                <h3 className="text-sm font-semibold">Risk Distribution</h3>
                <div className="mt-2 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={distData} dataKey="value" innerRadius={42} outerRadius={70} paddingAngle={3}>
                        {distData.map((d) => (
                          <Cell key={d.name} fill={d.color} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "rgba(11,17,32,0.95)",
                          border: "1px solid rgba(0,194,255,0.3)",
                          borderRadius: 12,
                          color: "#e2e8f0",
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {distData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between rounded-md bg-white/[0.03] px-2 py-1">
                      <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: d.color }} />{d.name}</span>
                      <span className="text-slate-400">{d.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Account types + Graph */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
              >
                <h3 className="text-sm font-semibold">Account Types</h3>
                <div className="mt-4 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={acctData}>
                      <defs>
                        <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#67E8F9" />
                          <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="type" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(11,17,32,0.95)",
                          border: "1px solid rgba(0,194,255,0.3)",
                          borderRadius: 12,
                          color: "#e2e8f0",
                          fontSize: 12,
                        }}
                        cursor={{ fill: "rgba(0,194,255,0.06)" }}
                      />
                      <Bar dataKey="count" fill="url(#bg)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:col-span-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Identity Graph</h3>
                  <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-400/30">
                    <Share2 className="h-3 w-3" /> Expand
                  </button>
                </div>
                <div className="mt-3 h-72 overflow-hidden rounded-xl border border-white/10 bg-[#050816]">
                  <ReactFlow
                    nodes={flowNodes}
                    edges={flowEdges}
                    nodeTypes={nodeTypes}
                    fitView
                    nodesDraggable={false}
                    panOnDrag={false}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    zoomOnDoubleClick={false}
                    proOptions={{ hideAttribution: true }}
                  >
                    <Background gap={20} size={1} color="rgba(103,232,249,0.15)" />
                  </ReactFlow>
                </div>
              </motion.div>
            </section>

            <footer className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> End-to-end encrypted · SOC2 ready</span>
              <span>Digital Footprint Mapper · v1.0</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
