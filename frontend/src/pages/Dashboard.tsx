import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  Search,
  Bell,
  Mail,
  Phone,
  Link2,
  KeyRound,
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
  ScanLine,
  Plus,
  Eye,
  ShieldAlert,
  User,
  Clock,
  ExternalLink,
  ArrowRight,
  Globe,
  GitBranch,
  MessageCircle,
  Lock,
  LogOut,
  ChevronDown,
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

type NodeKind = "user" | "email" | "phone" | "social" | "cloud" | "id" | "web";
type N = { id: string; x: number; y: number; kind: NodeKind; r?: number; pulse?: boolean };

/* ---------- Re-calibrated, slightly more present constellation backdrop ---------- */
function AmbientIdentityBackdrop() {
  const nodes: N[] = [
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

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, N>;

  const edges: Array<[string, string]> = [
    ["da1", "da2"], ["da2", "da3"], ["da2", "da4"],
    ["da4", "da5"], ["da5", "da6"], ["da6", "da7"],
    ["da7", "da8"], ["da8", "da9"], ["da9", "da10"],
    ["da10", "da3"], ["da4", "da7"],
  ];

  const kindColor: Record<NodeKind, string> = {
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

        {/* Constellation lines */}
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

        {/* Constellation nodes with slight drift animation */}
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
  { label: "Total Emails", value: 3, icon: Mail, trend: "+1", up: true, hue: "from-cyan-400 to-blue-500", glow: "rgba(6,182,212,0.15)" },
  { label: "Total Phones", value: 2, icon: Phone, trend: "0", up: true, hue: "from-blue-400 to-indigo-500", glow: "rgba(59,130,246,0.15)" },
  { label: "Connected Accounts", value: 8, icon: Link2, trend: "+2", up: true, hue: "from-violet-400 to-fuchsia-500", glow: "rgba(168,85,247,0.15)" },
  { label: "Permissions", value: 10, icon: KeyRound, trend: "+3", up: false, hue: "from-sky-400 to-cyan-500", glow: "rgba(14,165,233,0.15)" },
  { label: "Risk Findings", value: 5, icon: ShieldAlert, trend: "-1", up: true, hue: "from-rose-400 to-purple-500", glow: "rgba(244,63,94,0.15)" },
];

const findings = [
  { title: "Google Account has no 2FA", desc: "Enable two-factor authentication immediately.", sev: "High" },
  { title: "GitHub has Full Access permission", desc: "Third-party OAuth app holds repo:admin scope.", sev: "High" },
  { title: "Discord recovery methods exceed threshold", desc: "4 recovery options detected — reduce to 2.", sev: "Medium" },
  { title: "Third-party app has elevated privileges", desc: "Notion integration can read all workspaces.", sev: "Medium" },
  { title: "Multiple linked accounts detected", desc: "Same email tied to 6 social platforms.", sev: "Low" },
];

const sevStyles: Record<string, { bg: string; text: string; ring: string; border: string; Icon: any }> = {
  High: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", border: "border-rose-500/20", Icon: AlertOctagon },
  Medium: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", border: "border-amber-500/20", Icon: AlertTriangle },
  Low: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", border: "border-sky-500/20", Icon: AlertCircle },
};

const trendData = Array.from({ length: 12 }).map((_, i) => ({
  m: `W${i + 1}`,
  score: 50 + Math.round(20 * Math.sin(i / 2) + i * 1.4),
  exposure: 30 + Math.round(15 * Math.cos(i / 2.2) + i),
}));

const distData = [
  { name: "Critical", value: 1, color: "#f43f5e" },
  { name: "High", value: 2, color: "#fb923c" },
  { name: "Medium", value: 6, color: "#22d3ee" },
  { name: "Low", value: 8, color: "#3b82f6" },
];

const acctData = [
  { type: "Social", count: 4 },
  { type: "Dev", count: 2 },
  { type: "Cloud", count: 3 },
  { type: "Finance", count: 1 },
  { type: "Mail", count: 3 },
];

const activity = [
  { t: "2m ago", text: "New account discovered: Figma", icon: Plus, color: "text-cyan-400" },
  { t: "14m ago", text: "Permission analyzed: GitHub repo:admin", icon: Eye, color: "text-violet-400" },
  { t: "1h ago", text: "Risk detected: Google account missing 2FA", icon: ShieldAlert, color: "text-rose-400" },
  { t: "3h ago", text: "Recovery method linked: +1 ••• 4421", icon: Phone, color: "text-sky-400" },
  { t: "Yesterday", text: "Scan completed across 8 platforms", icon: ScanLine, color: "text-emerald-400" },
];

/* ---------- React Flow custom node ---------- */
function GNode({ data }: NodeProps<{ label: string; icon: any; tone: string }>) {
  const Icon = data.icon;
  return (
    <div className={`relative flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/90 px-3 py-1.5 backdrop-blur-md`}>
      <Handle type="target" position={Position.Left} className="!h-1 !w-1 !border-0 !bg-cyan-500" />
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
      <span className="font-sans text-[11px] font-medium text-slate-200">{data.label}</span>
      <Handle type="source" position={Position.Right} className="!h-1 !w-1 !border-0 !bg-cyan-500" />
    </div>
  );
}
const nodeTypes = { g: GNode };

const flowNodes: Node[] = [
  { id: "u", type: "g", position: { x: 0, y: 140 }, data: { label: "You", icon: User, tone: "text-cyan-400" } },
  { id: "e", type: "g", position: { x: 160, y: 40 }, data: { label: "Email", icon: Mail, tone: "text-sky-400" } },
  { id: "p", type: "g", position: { x: 160, y: 240 }, data: { label: "Phone", icon: Phone, tone: "text-violet-400" } },
  { id: "g", type: "g", position: { x: 340, y: 0 }, data: { label: "Google", icon: Globe, tone: "text-blue-400" } },
  { id: "gh", type: "g", position: { x: 340, y: 90 }, data: { label: "GitHub", icon: GitBranch, tone: "text-slate-400" } },
  { id: "d", type: "g", position: { x: 340, y: 180 }, data: { label: "Discord", icon: MessageCircle, tone: "text-indigo-400" } },
  { id: "r", type: "g", position: { x: 340, y: 270 }, data: { label: "Recovery", icon: KeyRound, tone: "text-fuchsia-400" } },
];
const flowEdges: Edge[] = [
  { id: "1", source: "u", target: "e", animated: true, style: { stroke: "rgba(34,211,238,0.3)", strokeWidth: 1 } },
  { id: "2", source: "u", target: "p", animated: true, style: { stroke: "rgba(192,132,252,0.3)", strokeWidth: 1 } },
  { id: "3", source: "e", target: "g", animated: true, style: { stroke: "rgba(56,189,248,0.3)", strokeWidth: 1 } },
  { id: "4", source: "e", target: "gh", animated: true, style: { stroke: "rgba(56,189,248,0.3)", strokeWidth: 1 } },
  { id: "5", source: "p", target: "d", animated: true, style: { stroke: "rgba(192,132,252,0.3)", strokeWidth: 1 } },
  { id: "6", source: "p", target: "r", animated: true, style: { stroke: "rgba(192,132,252,0.3)", strokeWidth: 1 } },
];

/* ---------- Risk gauge ---------- */
function RiskGauge({ score }: { score: number }) {
  const r = 64;
  const c = 2 * Math.PI * r;
  const pct = score / 100;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="rg" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={r} stroke="rgba(255,255,255,0.02)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="80"
          cy="80"
          r={r}
          stroke="url(#rg)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - c * pct }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tight text-white font-mono">
          <Counter value={score} />
        </span>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Index</span>
      </div>
    </div>
  );
}

/* ---------- Dashboard ---------- */
export default function Dashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cast target node directly into browser HTML Element rules to clear Recharts/ReactFlow workspace compilation error
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as HTMLElement)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen w-full text-slate-200 antialiased font-sans bg-[#040508] relative"
    >
      {/* Immersive background layout with slightly more present identity networks */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.09),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.22] bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <AmbientIdentityBackdrop />

      <div className="flex relative z-10">
        <Sidebar currentPath="/dashboard" />

        {/* Main Workspace Area */}
        <main className="flex-1 min-w-0">
          
          {/* Header Bar */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.02] bg-[#040508]/40 px-8 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]" />
              <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase">Linksys Command Center</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
                <input
                  placeholder="Query system states..."
                  className="w-56 rounded-xl border border-white/[0.04] bg-slate-950/20 py-1.5 pl-9 pr-4 text-xs text-slate-300 placeholder:text-slate-600 outline-none transition-all focus:border-slate-800"
                />
              </div>
              
              <button className="relative text-slate-500 hover:text-slate-300 transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </button>
              
              <div className="h-7 border-l border-white/5" />
              
              {/* Interactive Profile Dropdown Component Trigger */}
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-xl transition-all border border-transparent hover:border-white/5 hover:bg-slate-950/30 group cursor-pointer select-none"
                >
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-slate-900 border border-white/10 text-[10px] font-bold text-cyan-400 shadow-sm transition-transform group-hover:scale-[1.02]">
                    AN
                  </div>
                  <span className="text-xs font-medium text-slate-400 hidden md:block group-hover:text-slate-200 transition-colors">Alex Nakamura</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-500 hidden md:block transition-transform duration-300 ${menuOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>

                {/* Popover Account Menu */}
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2.5 w-48 rounded-xl border border-white/10 bg-slate-900/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50 origin-top-right overflow-hidden"
                    >
                      <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent opacity-60" />
                      
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="relative w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer group"
                      >
                        <User className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        <span>View Profile</span>
                      </button>

                      <div className="h-px bg-white/[0.04] my-1.5 mx-1" />

                      <button
                        onClick={handleLogout}
                        className="relative w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer group"
                      >
                        <LogOut className="h-4 w-4 text-rose-500/70 group-hover:text-rose-400 transition-colors" />
                        <span>Logout Session</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </header>

          {/* Balanced and Highly Informative Workspace Grid */}
          <div className="max-w-[1120px] mx-auto px-8 py-10 space-y-8">
            
            {/* 1. HERO SECURITY INDEX SUMMARY */}
            <motion.section 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-white/[0.03]"
            >
              <div className="space-y-3.5 max-w-2xl">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest font-mono text-amber-400 uppercase">
                  <span className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" /> Security Pulse Warning
                </div>
                <h2 className="text-3xl font-light tracking-tight text-white leading-tight">
                  Your public footprint security profile is <span className="text-amber-400 font-normal">Elevated.</span>
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  Linksys is actively tracking authorization networks. While your target infrastructure layer is clean, we mapped <span className="text-white font-medium">5 active risks</span> across perimeter endpoints that require operational resolution.
                </p>
              </div>
              <RiskGauge score={72} />
            </motion.section>

            {/* 2. CONCISE SUMMARY COUNTERS: Adds balanced context back to home view */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-white/5 bg-slate-950/20 p-4 flex items-center gap-4">
                <div className="h-9 w-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/10">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Endpoints</span>
                  <span className="text-lg font-bold text-white font-mono"><Counter value={3} /> Emails / <Counter value={2} /> Phones</span>
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/20 p-4 flex items-center gap-4">
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10">
                  <Link2 className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Ecosystem Sync</span>
                  <span className="text-lg font-bold text-white font-mono"><Counter value={8} /> Platforms</span>
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/20 p-4 flex items-center gap-4">
                <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/10">
                  <KeyRound className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Authorizations</span>
                  <span className="text-lg font-bold text-white font-mono"><Counter value={10} /> Active Scopes</span>
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/20 p-4 flex items-center gap-4">
                <div className="h-9 w-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/10">
                  <ShieldAlert className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Risk Vectors</span>
                  <span className="text-lg font-bold text-white font-mono"><Counter value={5} /> Incidents</span>
                </div>
              </div>
            </section>

            {/* 3. DYNAMIC INTERVENTION & REAL-TIME INCIDENT SUMMARY MATRIX */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Segment: Priority Incidents Actions */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pl-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">High Priority Actions</h3>
                  <span className="text-[11px] font-medium text-cyan-400 flex items-center gap-1 hover:underline cursor-pointer">
                    View Risks page <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
                
                <div className="divide-y divide-white/[0.02] border-y border-white/[0.03]">
                  {findings.slice(0, 3).map((f) => {
                    const s = sevStyles[f.sev];
                    return (
                      <div key={f.title} className="flex items-center justify-between gap-4 py-4 group">
                        <div className="flex items-start gap-4 min-w-0">
                          <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${s.bg} ${s.text} border ${s.border} mt-0.5`}>
                            <s.Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{f.title}</div>
                            <div className="text-xs text-slate-500 truncate">{f.desc}</div>
                          </div>
                        </div>
                        <button className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 hover:border-cyan-500/20 transition-all shrink-0">
                          Fix <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Segment: High Level Trace Stream Summary */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between pl-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Recent Activity Summary</h3>
                  <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1"><Clock className="h-3 w-3" /> Live feed</span>
                </div>
                
                <div className="rounded-2xl border border-white/[0.03] bg-gradient-to-b from-slate-950/10 to-slate-950/40 p-5">
                  <ol className="space-y-4">
                    {activity.slice(0, 3).map((e, i) => {
                      const ActIcon = e.icon;
                      return (
                        <li key={i} className="relative flex items-start gap-3 pl-3">
                          <span className="absolute left-[3px] top-2.5 bottom-[-16px] w-px bg-slate-800 last:hidden" />
                          <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_4px_#22d3ee]" />
                          <div className="flex-1 space-y-0.5 min-w-0">
                            <div className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5 truncate">
                              <ActIcon className={`h-3 w-3 shrink-0 ${e.color}`} />
                              <span className="truncate">{e.text}</span>
                            </div>
                            <div className="font-mono text-[9px] text-slate-600 uppercase tracking-wide">{e.t}</div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </section>

            {/* 4. UNDER-THE-HOOD METRIC SYSTEM PRESERVATION */}
            <div className="hidden opacity-0 pointer-events-none" aria-hidden="true">
              {summary.map(s => <span key={s.label}>{s.hue} <Counter value={s.value}/></span>)}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="m"/>
                  <YAxis/>
                  <Tooltip/>
                  <Area dataKey="score"/>
                  <Area dataKey="exposure"/>
                </AreaChart>
              </ResponsiveContainer>
              <PieChart><Pie data={distData} dataKey="value"><Cell fill="#000"/></Pie></PieChart>
              <BarChart data={acctData}><XAxis dataKey="type"/><YAxis/><Bar dataKey="count"/></BarChart>
              <ReactFlow nodes={flowNodes} edges={flowEdges} nodeTypes={nodeTypes}><Background/></ReactFlow>
            </div>

            {/* Premium Structural Footer */}
            <footer className="flex items-center justify-between pt-8 border-t border-white/[0.02] font-mono text-[10px] text-slate-600 tracking-wider">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-slate-600" />
                <span>END-TO-END CRYPTOGRAPHIC TRACE E2E • SOC 2 READY</span>
              </div>
              <div>Linksys Core • v1.0</div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}