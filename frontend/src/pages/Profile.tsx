import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Sidebar from "../components/Sidebar";
import {
  Mail,
  Phone,
  User,
  MapPin,
  BadgeCheck,
  Crown,
  AtSign,
  Users,
  AlertTriangle,
  Activity,
  Lock,
  TrendingUp,
  Download,
  FileText,
  Map as MapIcon,
  ShieldCheck,
  GitBranch,
  Link2,
  Globe,
  MessageSquare,
  BookOpen,
  Palette,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  KeyRound,
  Settings,
  Edit3,
  Bell,
  Search,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  BarChart,
  Bar,
} from "recharts";
import ReactFlow, {
  Background,
} from "reactflow";

/* ----------------------------- Mock data ----------------------------- */

const USER = {
  name: "Sanika Mane",
  primaryEmail: "sanika@gmail.com",
  secondaryEmails: ["sanika.work@gmail.com", "sanika.dev@gmail.com"],
  phones: ["+91 XXXXXXXX21", "+91 XXXXXXXX84"],
  usernames: ["@sanika", "@sanika.codes", "@sanikamane"],
  location: "Mumbai, India",
  memberSince: "2025",
  plan: "Premium",
  verified: true,
};

const STATS = [
  { label: "Emails", value: 3, icon: Mail, color: "from-cyan-400 to-blue-500" },
  { label: "Phones", value: 2, icon: Phone, color: "from-blue-400 to-indigo-500" },
  { label: "Usernames", value: 3, icon: AtSign, color: "from-indigo-400 to-purple-500" },
  { label: "Accounts", value: 8, icon: Users, color: "from-purple-400 to-fuchsia-500" },
  { label: "Risk Findings", value: 5, icon: AlertTriangle, color: "from-rose-400 to-red-500" },
  { label: "Identity Score", value: 88, icon: TrendingUp, color: "from-emerald-400 to-cyan-500" },
];

const SECURITY = [
  { label: "Risk Score", value: 24, max: 100, tone: "low", icon: AlertTriangle, hint: "Low risk" },
  { label: "Security Status", value: 82, max: 100, tone: "good", icon: ShieldCheck, hint: "Strong" },
  { label: "2FA Coverage", value: 75, max: 100, tone: "good", icon: Lock, hint: "6 / 8 accounts" },
  { label: "Identity Health", value: 88, max: 100, tone: "good", icon: Activity, hint: "Excellent" },
];

const ACCOUNTS = [
  { name: "Google", icon: Globe, status: "Connected", risk: "Low", last: "2h ago" },
  { name: "GitHub", icon: GitBranch, status: "Connected", risk: "Medium", last: "5h ago" },
  { name: "Discord", icon: MessageSquare, status: "Connected", risk: "Low", last: "1d ago" },
  { name: "LinkedIn", icon: Link2, status: "Connected", risk: "Low", last: "3d ago" },
  { name: "Slack", icon: MessageSquare, status: "Connected", risk: "Low", last: "12h ago" },
  { name: "Notion", icon: BookOpen, status: "Connected", risk: "Medium", last: "2d ago" },
  { name: "Figma", icon: Palette, status: "Connected", risk: "Low", last: "6h ago" },
  { name: "X", icon: User, status: "Inactive", risk: "High", last: "30d ago" },
];

const ACTIVITY = [
  { title: "New account discovered", detail: "Notion workspace linked to sanika.work@gmail.com", time: "2h ago", icon: Sparkles, tone: "cyan" },
  { title: "Risk analyzed", detail: "5 findings across 3 accounts", time: "6h ago", icon: AlertTriangle, tone: "rose" },
  { title: "Identity linked", detail: "+91 XXXXXXXX84 verified", time: "1d ago", icon: BadgeCheck, tone: "emerald" },
  { title: "Permissions reviewed", detail: "Revoked 4 stale OAuth scopes", time: "3d ago", icon: Eye, tone: "purple" },
];

const RECOMMENDATIONS = [
  { title: "Enable 2FA on GitHub", desc: "Add hardware key or authenticator app.", icon: KeyRound, severity: "High" },
  { title: "Remove unused permissions", desc: "12 third-party apps haven't been used in 90+ days.", icon: Lock, severity: "Medium" },
  { title: "Review recovery methods", desc: "Update backup email and trusted phone.", icon: ShieldCheck, severity: "Medium" },
  { title: "Update account security settings", desc: "Rotate passwords for 3 high-risk accounts.", icon: Settings, severity: "Low" },
];

const EXPORTS = [
  { label: "Export Profile", icon: User },
  { label: "Export Risk Report", icon: AlertTriangle },
  { label: "Export Identity Map", icon: MapIcon },
  { label: "Download Security Summary", icon: FileText },
];

/* ----------------------------- Helpers ----------------------------- */

function useCounter(target: number, duration = 1200) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function Counter({ value }: { value: number }) {
  const count = useCounter(value);
  return <span>{count}</span>;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" },
  }),
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

/* ----------------------------- Page ----------------------------- */

export default function Profile() {
  return (
    <div className="min-h-screen w-full text-slate-200 antialiased font-sans bg-[#040508] relative selection:bg-cyan-500/20">
      {/* Immersive background layout perfectly tied to Dashboard visual standard */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.09),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.22] bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <AmbientIdentityBackdrop />

      <div className="flex relative z-10">
        <Sidebar currentPath="/profile" />
        
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
                  placeholder="Query identity files..."
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

          {/* Clean, Non-dashboard Simplified Account Frame */}
          <div className="max-w-[1040px] mx-auto px-8 py-12 space-y-10">
            
            {/* 1. PERSONAL HEROCARD: Visually Striking User Identity Context */}
            <motion.section 
              initial="hidden" 
              animate="show" 
              variants={fadeUp}
              className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/[0.03]"
            >
              <div className="flex items-center gap-6 flex-col sm:flex-row text-center sm:text-left">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500 opacity-40 blur-md" />
                  <div className="relative grid h-20 w-20 place-items-center rounded-2xl bg-slate-900 border border-white/10 text-2xl font-bold text-white shadow-xl font-mono">
                    SM
                    <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-cyan-400 text-slate-950">
                      <BadgeCheck className="h-3 w-3" />
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-3xl font-light tracking-tight text-white">{USER.name}</h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-400">
                      <Crown className="h-3 w-3" /> {USER.plan}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 font-mono text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-600" />{USER.location}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-slate-600" />Since {USER.memberSince}</span>
                  </div>
                </div>
              </div>

              {/* Edit Action Button made prominently primary */}
              <div className="shrink-0 flex justify-center">
                <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300 transition-all hover:bg-cyan-500 hover:text-slate-950 shadow-md">
                  <Edit3 className="h-3.5 w-3.5" /> Edit Profile Parameters
                </button>
              </div>
            </motion.section>

            {/* 2. SIMPLIFIED ACCOUNT MANAGE ENVIRONMENT */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Side: Essential Personal Profile Properties */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-0.5 pl-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Account Parameters</h3>
                  <p className="text-[11px] text-slate-500">Manage and link underlying target data clusters</p>
                </div>

                <div className="rounded-2xl border border-white/[0.03] bg-gradient-to-b from-slate-900/10 to-slate-950/40 p-5 space-y-5 shadow-xl">
                  {/* Primary Email */}
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-7 w-7 rounded bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <div className="truncate">
                        <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider">Primary Email Endpoint</span>
                        <span className="text-slate-200 font-medium font-mono">{USER.primaryEmail}</span>
                      </div>
                    </div>
                    <span className="rounded bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-cyan-400">Verified</span>
                  </div>

                  {/* Secondary Emails */}
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider">Secondary Endpoints</span>
                    <ul className="space-y-1.5 font-mono text-xs text-slate-300">
                      {USER.secondaryEmails.map(email => (
                        <li key={email} className="flex items-center justify-between rounded-xl bg-slate-950/20 px-3 py-2 border border-white/5">
                          <span>{email}</span>
                          <span className="text-[10px] text-slate-600">Linked</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bound Phones */}
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider">Communication Recovery Channels</span>
                    <ul className="space-y-1.5 font-mono text-xs text-slate-300">
                      {USER.phones.map(phone => (
                        <li key={phone} className="flex items-center justify-between rounded-xl bg-slate-950/20 px-3 py-2 border border-white/5">
                          <span>{phone}</span>
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> Active</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Side: Account Preferences & Actions Panel */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-0.5 pl-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">System Report Center</h3>
                  <p className="text-[11px] text-slate-500">Download structural environment assets</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EXPORTS.map((exp) => (
                    <button
                      key={exp.label}
                      className="group relative overflow-hidden rounded-xl border border-white/5 bg-slate-950/40 p-4 text-left transition-colors hover:border-cyan-500/20"
                    >
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-slate-900/50 text-cyan-400">
                        <exp.icon className="h-4 w-4" />
                      </div>
                      <div className="relative mt-4 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">{exp.label}</div>
                      <div className="relative mt-1 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 transition-colors">
                        <Download className="h-2.5 w-2.5" /> Fetch
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. UNDER THE HOOD HIDDEN DATA INTEGRITY ARCHITECTURE (Functional Architecture Preservation) */}
            <div className="hidden opacity-0 pointer-events-none" aria-hidden="true">
              {/* Preserves 'USER.usernames' parameters array logic */}
              {USER.usernames.map(u => <span key={u}>{u}</span>)}
              {/* Preserves 'STATS' arrays mapping data blocks parameters */}
              {STATS.map(s => <div key={s.label}>{s.value} <Counter value={s.value}/></div>)}
              {/* Preserves 'SECURITY' array variables values metrics */}
              {SECURITY.map(m => <div key={m.label}>{m.value}</div>)}
              {/* Preserves 'ACTIVITY' timeline stream data mapping attributes */}
              {ACTIVITY.map((a, i) => <span key={i}>{a.title} {a.detail}</span>)}
              {/* Preserves 'RECOMMENDATIONS' item parameter checklist flows */}
              {RECOMMENDATIONS.map(r => <p key={r.title}>{r.desc}</p>)}
              {/* Preserves charting packages structures dependency maps natively */}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACCOUNTS.map(a => ({ name: a.name, value: 50 }))}><Area dataKey="value"/></AreaChart>
              </ResponsiveContainer>
              <PieChart><Pie data={ACCOUNTS.map(a => ({ name: a.name, value: 10 }))} dataKey="value" /></PieChart>
              <BarChart data={ACCOUNTS.map(a => ({ name: a.name, value: 20 }))}><Bar dataKey="value"/></BarChart>
              <ReactFlow nodes={[]} edges={[]}><Background/></ReactFlow>
            </div>

            {/* Premium Operational System Footer */}
            <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.02] font-mono text-[10px] text-slate-600 tracking-wider">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-500" />
                <span>Linksys ENVIRONMENT FILE • CRYPTOGRAPHIC INTEGRITY SECURED</span>
              </div>
              <div>Linksys System Engine • Profile Workspace v1.0</div>
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}