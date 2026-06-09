import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import {
  Mail,
  Phone,
  AtSign,
  Globe,
  Lock,
  ShieldCheck,
  ShieldAlert,
  Link2,
  Search,
  Activity,
  Eye,
  GitBranch,
  MessageSquare,
  Palette,
  FileText,
  Monitor,
  Users,
  CheckCircle2,
  Network,
  Fingerprint,
  TrendingUp,
  ArrowRight,
  Bell,
} from "lucide-react";

/* ---------------- types ---------------- */
type Risk = "low" | "medium" | "high";

type EmailIdentity = {
  address: string;
  verified: boolean;
  linkedAccounts: number;
  risk: Risk;
  primary?: boolean;
};

type PhoneIdentity = {
  number: string;
  verified: boolean;
  recoveryAccounts: number;
  score: number;
};

type UsernameIdentity = {
  handle: string;
  platforms: string[];
  reusedScore: number;
};

type Platform = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  linkedTo: string;
  type: "email" | "username";
  color: string;
};

type NodeKind = "user" | "email" | "phone" | "social" | "cloud" | "id" | "web";

type N = {
  id: string;
  x: number;
  y: number;
  kind: NodeKind;
  r?: number;
  pulse?: boolean;
};

/* ---------------- mock data ---------------- */
const EMAILS: EmailIdentity[] = [
  { address: "sanika@gmail.com", verified: true, linkedAccounts: 6, risk: "high", primary: true },
  { address: "sanika.work@gmail.com", verified: true, linkedAccounts: 3, risk: "medium" },
  { address: "sanika.dev@gmail.com", verified: false, linkedAccounts: 2, risk: "low" },
];

const PHONES: PhoneIdentity[] = [
  { number: "+91 XXXXXXXX21", verified: true, recoveryAccounts: 4, score: 62 },
  { number: "+91 XXXXXXXX84", verified: true, recoveryAccounts: 2, score: 84 },
];

const USERNAMES: UsernameIdentity[] = [
  { handle: "sanika_dev", platforms: ["GitHub", "Notion", "Figma"], reusedScore: 78 },
  { handle: "sanika_it", platforms: ["LinkedIn", "Slack"], reusedScore: 55 },
  { handle: "sanika_official", platforms: ["Discord", "X"], reusedScore: 90 },
];

const PLATFORMS: Platform[] = [
  { name: "Google", icon: Monitor, linkedTo: "sanika@gmail.com", type: "email", color: "from-cyan-400/40 to-blue-500/20" },
  { name: "GitHub", icon: GitBranch, linkedTo: "sanika_dev", type: "username", color: "from-sky-400/40 to-indigo-500/20" },
  { name: "Discord", icon: MessageSquare, linkedTo: "sanika_official", type: "username", color: "from-indigo-400/40 to-violet-500/20" },
  { name: "LinkedIn", icon: Link2, linkedTo: "sanika.work@gmail.com", type: "email", color: "from-blue-400/40 to-cyan-500/20" },
  { name: "Slack", icon: MessageSquare, linkedTo: "sanika_it", type: "username", color: "from-cyan-400/40 to-teal-500/20" },
  { name: "Notion", icon: FileText, linkedTo: "sanika.dev@gmail.com", type: "email", color: "from-slate-400/40 to-blue-500/20" },
  { name: "Figma", icon: Palette, linkedTo: "sanika_dev", type: "username", color: "from-violet-400/40 to-cyan-500/20" },
  { name: "X", icon: Users, linkedTo: "sanika_official", type: "username", color: "from-sky-400/40 to-blue-500/20" },
];

const TIMELINE = [
  { when: "2 min ago", label: "New linked account detected on Figma", kind: "platform" },
  { when: "1 hr ago", label: "Username sanika_official discovered on X", kind: "username" },
  { when: "5 hr ago", label: "Phone +91 XXXXXXXX21 found in 2 breaches", kind: "phone" },
  { when: "Yesterday", label: "Email sanika.dev@gmail.com verified via Notion", kind: "email" },
  { when: "2 days ago", label: "GitHub OAuth token re-issued for sanika_dev", kind: "platform" },
  { when: "4 days ago", label: "Recovery email match on LinkedIn", kind: "email" },
  { when: "1 week ago", label: "Initial identity scan completed", kind: "scan" },
];

const INSIGHTS = [
  { icon: Eye, title: "Primary email reused", desc: "sanika@gmail.com is linked across 6 platforms", tone: "high" as Risk },
  { icon: Phone, title: "Recovery overlap", desc: "+91 XXXXXXXX21 secures 4 different accounts", tone: "medium" as Risk },
  { icon: AtSign, title: "Username collision", desc: "sanika_official appears on 2 public services", tone: "medium" as Risk },
  { icon: ShieldCheck, title: "Strong segmentation", desc: "Dev email isolated from social platforms", tone: "low" as Risk },
];

/* ---------------- helpers ---------------- */
const riskColor: Record<Risk, string> = {
  low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  high: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const riskDot: Record<Risk, string> = {
  low: "bg-emerald-400 shadow-[0_0_8px_#10b981]",
  medium: "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
  high: "bg-rose-400 shadow-[0_0_8px_#f43f5e]",
};

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

/* ---------- Faint atmospheric constellation backdrop (Dashboard Aligned) ---------- */
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

/* ---------------- atoms ---------------- */
function SummaryCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  hint: string;
}) {
  const n = useCounter(value);
  return (
    <div className="rounded-xl border border-white/5 bg-slate-950/20 p-4 flex items-center gap-4 shadow-sm">
      <div className="h-9 w-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/10">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">{label}</span>
        <span className="text-lg font-bold text-white font-mono">{n} <span className="text-xs font-normal text-slate-500">/ {hint}</span></span>
      </div>
    </div>
  );
}

/* ---------------- main ---------------- */
export default function Identities() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "email" | "phone" | "username" | "platform">("all");

  const filteredPlatforms = useMemo(
    () => PLATFORMS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.linkedTo.includes(query)),
    [query],
  );

  return (
    <div className="min-h-screen w-full text-slate-200 antialiased font-sans bg-[#040508] relative selection:bg-cyan-500/20">
      {/* Immersive visual elements mapped dynamically to match Dashboard's blueprint */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.09),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.22] bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <AmbientIdentityBackdrop />

      <div className="flex relative z-10">
        <Sidebar currentPath="/identities" />
        
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

          {/* Core Content Container Grid */}
          <div className="max-w-[1120px] mx-auto px-8 py-10 space-y-10">
            
            {/* Hero Summary Block */}
            <motion.header
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/[0.03]"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest font-mono text-cyan-400 uppercase">
                  <Fingerprint className="h-3.5 w-3.5" /> Identity Explorer
                </div>
                <h1 className="text-3xl font-light tracking-tight text-white leading-tight">
                  Your digital identity, mapped
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  Every discovered email endpoint, communication node, cryptographic username handles, and downstream interconnected ecosystem platform visualised as an aggregated vector summary space.
                </p>
              </div>

              <div className="shrink-0">
                <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-4 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300 transition-all hover:bg-cyan-500 hover:text-slate-950 shadow-md">
                  <Activity className="h-3.5 w-3.5 animate-pulse" /> Re-scan Core
                </button>
              </div>
            </motion.header>

            {/* High-Level Counters Section */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard icon={Mail} label="Emails" value={3} hint="2 verified" />
              <SummaryCard icon={Phone} label="Phones" value={2} hint="all verified" />
              <SummaryCard icon={AtSign} label="Usernames" value={3} hint="3 reused" />
              <SummaryCard icon={Globe} label="Platforms" value={8} hint="8 services" />
            </section>

            {/* Timeline Log stream & Patterns Stack */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Timeline Flow */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pl-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Discovery Timeline</h3>
                  
                  <div className="flex items-center gap-1 bg-slate-950/40 p-0.5 rounded-lg border border-white/5">
                    {(["all", "email", "phone", "username", "platform"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`rounded-md px-2.5 py-1 text-[10px] font-mono capitalize tracking-wide transition-all ${
                          filter === f ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-slate-400 hover:text-white border border-transparent"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.03] bg-gradient-to-b from-slate-900/10 to-slate-950/40 p-5 min-h-[290px]">
                  <ol className="space-y-4 relative pl-4 border-l border-white/5">
                    <AnimatePresence mode="popLayout">
                      {TIMELINE.filter((t) => filter === "all" || t.kind === filter).map((t) => (
                        <motion.li
                          key={t.label}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 5 }}
                          transition={{ duration: 0.2 }}
                          className="relative group space-y-0.5"
                        >
                          <span className="absolute -left-[20px] top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-[12px] text-slate-300 font-medium leading-normal">{t.label}</p>
                            <span className="text-[10px] font-mono text-slate-600 tracking-tight shrink-0">{t.when}</span>
                          </div>
                          <span className="inline-block font-mono text-[9px] uppercase tracking-widest text-slate-500">{t.kind}</span>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ol>
                </div>
              </div>

              {/* Security Insights Panel */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pl-0.5">Identity Insight Analysis</h3>
                
                <div className="space-y-2">
                  {INSIGHTS.map((ins) => (
                    <div
                      key={ins.title}
                      className="flex items-center justify-between gap-4 p-3 rounded-xl border border-white/[0.02] bg-slate-950/20 hover:bg-slate-950/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${riskColor[ins.tone]}`}>
                          <ins.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-200 truncate">{ins.title}</h4>
                          <p className="text-[11px] text-slate-500 truncate leading-normal">{ins.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Email Identities Module Layout */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pl-0.5">Email Footprints</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {EMAILS.map((e) => (
                  <div key={e.address} className="rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900/40 to-slate-950/60 p-5 shadow-lg relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${riskDot[e.risk]}`} />
                        {e.primary && (
                          <span className="rounded-md border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan-400 font-bold">
                            Primary
                          </span>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                        e.verified ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-amber-500/20 bg-amber-500/5 text-amber-400"
                      }`}>
                        {e.verified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                    
                    <p className="mt-4 truncate text-sm font-semibold text-white font-mono tracking-tight">{e.address}</p>
                    
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Link2 className="h-3.5 w-3.5 text-cyan-400 opacity-70" />
                        <span>{e.linkedAccounts} entities discovered</span>
                      </div>
                      <span className={`font-mono text-[9px] font-black uppercase tracking-wider rounded border px-1.5 py-0.5 ${riskColor[e.risk]}`}>{e.risk} risk</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Phones + Usernames Stack Section */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Phones */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pl-0.5">Carrier Ties</h3>
                <div className="space-y-3">
                  {PHONES.map((p) => (
                    <div key={p.number} className="rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900/40 to-slate-950/60 p-4.5 flex flex-col justify-between shadow-lg gap-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-500/10 bg-cyan-500/5 text-cyan-400">
                            <Phone className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-mono text-xs font-bold text-white tracking-wider">{p.number}</p>
                            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                              <span className="text-emerald-400 font-bold flex items-center gap-0.5"><CheckCircle2 className="h-2.5 w-2.5" /> Ok</span>
                              <span>·</span>
                              <span>{p.recoveryAccounts} Vault Links</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold font-mono text-white tracking-tight">{p.score}</div>
                          <div className="text-[8px] uppercase tracking-widest text-slate-500 font-mono font-bold">Health</div>
                        </div>
                      </div>

                      <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.score}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                          className={`h-full rounded-full ${
                            p.score >= 80 ? "bg-cyan-400" : p.score >= 60 ? "bg-amber-400" : "bg-rose-400"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usernames */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pl-0.5">Namespace Identifiers</h3>
                <div className="space-y-3">
                  {USERNAMES.map((u) => (
                    <div key={u.handle} className="rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900/40 to-slate-950/60 p-4.5 shadow-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-500/10 bg-cyan-500/5 text-cyan-400">
                            <AtSign className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-mono text-xs font-bold text-white">@{u.handle}</p>
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Discovered across {u.platforms.length} ecosystems</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-slate-400 bg-slate-950/40 px-2 py-0.5 rounded border border-white/5">
                          <TrendingUp className="h-3 w-3 text-cyan-400" />
                          <span className="text-slate-200">{u.reusedScore}%</span>
                          <span className="text-slate-600">reuse</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {u.platforms.map((pl) => (
                          <span key={pl} className="rounded-xl border border-white/5 bg-slate-950/40 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-400">
                            {pl}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Platform Cross Mapping Layer */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pl-0.5">Downstream Application Matrix</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filteredPlatforms.map((p) => (
                  <div key={p.name} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/30 p-4 shadow-md transition-all duration-300 hover:border-cyan-500/20">
                    <div className={`absolute -inset-px -z-0 bg-gradient-to-br ${p.color} opacity-20`} />
                    <div className="relative space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-slate-900/50 text-white shadow-inner">
                          <p.icon className="h-4 w-4" />
                        </div>
                        <span className="rounded-full border border-white/5 bg-slate-950/60 font-mono text-[8px] font-black uppercase tracking-widest px-2 py-0.5 text-slate-400">
                          {p.type}
                        </span>
                      </div>
                      
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white tracking-tight">{p.name}</p>
                        <div className="flex items-center gap-1 font-mono text-[9px] text-slate-500 max-w-full">
                          <Link2 className="h-2.5 w-2.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{p.linkedTo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Structured Cross Connectivity Trace Panel */}
            <section className="space-y-4">
              <div className="flex items-baseline justify-between pl-0.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Structural Interdependence Graph</h3>
                <span className="text-[11px] font-medium text-cyan-400 flex items-center gap-1 hover:underline cursor-pointer">
                  Go to Graph View <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
              
              <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900/20 to-slate-950/40 p-5 space-y-4 shadow-xl">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 border-b border-white/5 pb-4">
                  {[
                    { icon: Mail, label: "Emails Discovered", count: 3, color: "text-cyan-400" },
                    { icon: Phone, label: "Phones Discovered", count: 2, color: "text-sky-400" },
                    { icon: AtSign, label: "Usernames Discovered", count: 3, color: "text-blue-400" },
                    { icon: Globe, label: "Platforms Discovered", count: 8, color: "text-indigo-400" },
                  ].map((n) => (
                    <div key={n.label} className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg border border-white/5 bg-slate-950/40 flex items-center justify-center">
                        <n.icon className={`h-3.5 w-3.5 ${n.color}`} />
                      </div>
                      <div>
                        <span className="block font-mono text-[8px] uppercase tracking-widest text-slate-500">{n.label}</span>
                        <span className="text-sm font-bold font-mono text-white">{n.count} Node</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    <Network className="h-3 w-3 text-cyan-400" /> Active Endpoint Overlap Tree
                  </div>
                  <ul className="space-y-2 font-mono text-xs">
                    {[
                      ["sanika@gmail.com", "Google · LinkedIn · Notion · GitHub · Slack · Figma"],
                      ["+91 XXXXXXXX21", "Google · Discord · LinkedIn · GitHub"],
                      ["sanika_dev", "GitHub · Notion · Figma"],
                      ["sanika_official", "Discord · X"],
                    ].map(([id, links]) => (
                      <li key={id} className="flex items-start md:items-center gap-2 rounded-xl border border-white/[0.02] bg-slate-950/20 px-3 py-2">
                        <span className="text-cyan-400 font-bold shrink-0">{id}</span>
                        <span className="text-slate-600 shrink-0">→</span>
                        <span className="text-slate-400 text-[11px] truncate">{links}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Re-calibrated Unified Application Footer */}
            <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.02] font-mono text-[10px] text-slate-600 tracking-wider">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-500" />
                <span>CRYPTOGRAPHIC PROFILE SYNCED • SOC 2 VERIFIED</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <ShieldAlert className="h-3 w-3" />
                <span>Linksys Core Pipeline v1.0</span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}