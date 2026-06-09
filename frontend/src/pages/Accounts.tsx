import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import Sidebar from "../components/Sidebar";
import {
  Activity, AlertTriangle, BarChart3, CheckCircle2, Download, Eye, Fingerprint,
  GitBranch, Globe, KeyRound, Layers, Link2, Lock, Mail, Phone, PieChart as PieIcon,
  Search, Shield, ShieldAlert, ShieldCheck, ShieldOff, Sparkles, TrendingUp,
  Users, Zap,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";

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
  Low: { text: "text-emerald-300", bg: "bg-emerald-400/10", border: "border-emerald-400/30", glow: "shadow-[0_0_20px_-5px_rgba(52,211,153,0.5)]" },
  Medium: { text: "text-amber-300", bg: "bg-amber-400/10", border: "border-amber-400/30", glow: "shadow-[0_0_20px_-5px_rgba(251,191,36,0.5)]" },
  High: { text: "text-rose-300", bg: "bg-rose-400/10", border: "border-rose-400/30", glow: "shadow-[0_0_20px_-5px_rgba(244,63,94,0.5)]" },
};

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

function GlassCard({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div
      className={[
        "relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl",
        "shadow-[0_8px_40px_-12px_rgba(0,194,255,0.15)]",
        hover ? "transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_8px_50px_-12px_rgba(0,194,255,0.35)] hover:-translate-y-0.5" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle?: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_20px_-5px_rgba(0,194,255,0.6)]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-base font-semibold tracking-tight text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

function InsightRow({ icon: Icon, tone, title, value, detail }: { icon: React.ComponentType<{ className?: string }>; tone: "rose" | "amber" | "violet" | "cyan" | "emerald"; title: string; value: string; detail: string }) {
  const tones: Record<string, { c: string }> = {
    rose: { c: "#F43F5E" }, amber: { c: "#F59E0B" }, violet: { c: "#A78BFA" }, cyan: { c: "#00C2FF" }, emerald: { c: "#34D399" },
  };
  const t = tones[tone];
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-cyan-400/30">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border" style={{ color: t.c, borderColor: `${t.c}55`, background: `${t.c}15`, boxShadow: `0 0 18px -6px ${t.c}` }}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs text-slate-400">{title}</div>
          <div className="truncate text-sm font-semibold text-white">{value}</div>
          {detail && <div className="mt-1 truncate text-[11px] text-slate-500" title={detail}>{detail}</div>}
        </div>
      </div>
    </div>
  );
}

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
    <div className="flex min-h-screen overflow-hidden bg-[#050816] text-slate-200">
      <Sidebar currentPath="/accounts" />
      <div className="relative flex-1">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[460px] w-[460px] rounded-full bg-purple-600/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(0,194,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,255,.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-3 py-1 text-xs text-cyan-300 shadow-[0_0_20px_-5px_rgba(0,194,255,0.6)]">
              <Sparkles className="h-3 w-3" />
              Account Intelligence Center
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Accounts <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">Management</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Visualize, audit and secure every digital account connected to LinkSys — risk, 2FA, permissions and health, in one place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 backdrop-blur transition hover:border-cyan-400/40 hover:text-cyan-200">
              <Download className="h-4 w-4" /> Export
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 px-4 py-2 text-sm font-medium text-cyan-100 shadow-[0_0_30px_-5px_rgba(0,194,255,0.6)] transition hover:from-cyan-500/30 hover:to-blue-600/30">
              <Zap className="h-4 w-4" /> Run Scan
            </button>
          </div>
        </motion.div>

        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {overview.map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.06 }}>
              <GlassCard className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border" style={{ borderColor: `${c.color}55`, background: `${c.color}15`, boxShadow: `0 0 24px -8px ${c.color}`, color: c.color }}>
                    <c.icon className="h-5 w-5" />
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${c.trend.startsWith("-") ? "border-rose-400/30 bg-rose-400/10 text-rose-300" : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"}`}>
                    <TrendingUp className="h-3 w-3" /> {c.trend}
                  </span>
                </div>
                <div className="mt-4 text-3xl font-semibold tracking-tight text-white">
                  <Counter to={c.value} />
                </div>
                <div className="mt-1 text-xs text-slate-400">{c.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="mb-6">
          <GlassCard className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between" hover={false}>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by platform, username, or email..."
                className="w-full rounded-xl border border-white/10 bg-[#0B1120]/70 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(0,194,255,0.15)]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${active ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-100 shadow-[0_0_20px_-5px_rgba(0,194,255,0.7)]" : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-400/30 hover:text-cyan-200"}`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        <SectionTitle icon={Globe} title="Connected Accounts" subtitle={`${filtered.length} of ${ACCOUNTS.length} accounts`} />
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a, i) => {
            const risk = riskStyles[a.risk];
            return (
              <motion.div key={a.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4, delay: i * 0.04 }} whileHover={{ y: -4 }}>
                <GlassCard className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold" style={{ color: a.hue, borderColor: `${a.hue}55`, background: `${a.hue}12`, boxShadow: `0 0 24px -10px ${a.hue}` }}>
                        {a.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{a.platform}</div>
                        <div className="text-xs text-slate-400">{a.username}</div>
                      </div>
                    </div>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${risk.text} ${risk.bg} ${risk.border} ${risk.glow}`}>
                      {a.risk} Risk
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-500" /><span className="truncate text-slate-300">{a.email}</span></div>
                    {a.phone && <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-500" /><span className="text-slate-300">{a.phone}</span></div>}
                    <div className="flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-slate-500" /><span>Last active {a.lastActive}</span></div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${a.twoFA ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-rose-400/30 bg-rose-400/10 text-rose-300"}`}>
                      {a.twoFA ? <Lock className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                      2FA {a.twoFA ? "Enabled" : "Disabled"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-300">
                      <KeyRound className="h-3 w-3 text-cyan-300" /> {a.permissions.length} perms
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Health Score</span>
                      <span className="font-semibold text-white">{a.health}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${a.health}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{
                          background: a.health >= 85 ? "linear-gradient(90deg, #34D399, #67E8F9)" : a.health >= 70 ? "linear-gradient(90deg, #F59E0B, #67E8F9)" : "linear-gradient(90deg, #F43F5E, #A78BFA)",
                          boxShadow: "0 0 14px rgba(0,194,255,0.5)",
                        }}
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="lg:col-span-2">
            <SectionTitle icon={ShieldAlert} title="Security Insights" subtitle="Risk intelligence across your accounts" />
            <GlassCard className="p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InsightRow icon={ShieldOff} tone="rose" title="Accounts without 2FA" value={`${without2FA.length} accounts`} detail={without2FA.map((a) => a.platform).join(", ")} />
                <InsightRow icon={AlertTriangle} tone="amber" title="Most vulnerable account" value={`${mostVulnerable.platform} · ${mostVulnerable.health}`} detail="Enable 2FA and review permissions" />
                <InsightRow icon={KeyRound} tone="violet" title="Elevated permissions" value={`${elevated.length} accounts`} detail={elevated.map((a) => a.platform).join(", ") || "None"} />
                <InsightRow icon={Mail} tone="cyan" title="Reused emails" value={`${reusedEmails.length} groups`} detail={reusedEmails.map(([email, plats]) => `${email} → ${plats.join(", ")}`).join(" • ")} />
                <InsightRow icon={Users} tone="cyan" title="Reused usernames" value={`${reusedUsernames.length} groups`} detail={reusedUsernames.length ? "Variants across platforms detected" : "None"} />
                <InsightRow icon={CheckCircle2} tone="emerald" title="Recommendation" value="Enforce 2FA on 3 accounts" detail="GitHub, Slack, X (Twitter)" />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <SectionTitle icon={Activity} title="Activity Timeline" subtitle="Real-time account events" />
            <GlassCard className="p-5">
              <ol className="relative ml-3 space-y-5 border-l border-white/10">
                {ACTIVITY.map((e, i) => (
                  <motion.li key={e.id} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="pl-5">
                    <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border" style={{ borderColor: `${e.color}66`, background: `${e.color}22`, boxShadow: `0 0 14px ${e.color}66` }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: e.color }} />
                    </span>
                    <div className="flex items-center gap-2 text-sm text-white">
                      <e.icon className="h-3.5 w-3.5" style={{ color: e.color }} />
                      {e.text}
                    </div>
                    <div className="text-[11px] text-slate-500">{e.time}</div>
                  </motion.li>
                ))}
              </ol>
            </GlassCard>
          </motion.div>
        </div>

        <SectionTitle icon={KeyRound} title="Permissions Overview" subtitle="Granted scopes per platform" />
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ACCOUNTS.filter((a) => a.permissions.length).map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }}>
              <GlassCard className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold" style={{ color: a.hue, borderColor: `${a.hue}55`, background: `${a.hue}12` }}>
                      {a.icon}
                    </div>
                    <div className="text-sm font-medium text-white">{a.platform}</div>
                  </div>
                  <span className="text-[11px] text-slate-400">{a.permissions.length} scopes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {a.permissions.map((p) => {
                    const severe = /admin|drive|repository|dms/i.test(p);
                    return (
                      <span key={p} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] ${severe ? "border-rose-400/30 bg-rose-400/10 text-rose-200" : "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"}`}>
                        {severe ? <ShieldAlert className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                        {p}
                      </span>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <SectionTitle icon={Zap} title="Quick Actions" subtitle="Run common workflows in one click" />
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((q, i) => (
            <motion.button
              key={q.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left backdrop-blur-xl transition hover:border-cyan-400/40"
              style={{ boxShadow: `0 8px 40px -16px ${q.color}66` }}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-3xl transition group-hover:opacity-60" style={{ background: q.color }} />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border" style={{ color: q.color, borderColor: `${q.color}55`, background: `${q.color}15`, boxShadow: `0 0 24px -8px ${q.color}` }}>
                <q.icon className="h-5 w-5" />
              </div>
              <div className="relative mt-3 text-sm font-medium text-white">{q.label}</div>
              <div className="relative mt-1 inline-flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-cyan-200">
                <Link2 className="h-3 w-3" /> Launch
              </div>
            </motion.button>
          ))}
        </div>

        <SectionTitle icon={BarChart3} title="Account Health & Risk" subtitle="Visual breakdown of your portfolio" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="lg:col-span-2">
            <GlassCard className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-medium text-white">Health Scores</div>
                <div className="text-[11px] text-slate-400">Higher is better</div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthData} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#67E8F9" stopOpacity={1} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(0,194,255,0.06)" }}
                      contentStyle={{ background: "rgba(11,17,32,0.95)", border: "1px solid rgba(0,194,255,0.3)", borderRadius: 12, color: "#E2E8F0", boxShadow: "0 0 30px -10px rgba(0,194,255,0.5)" }}
                    />
                    <Bar dataKey="score" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <GlassCard className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-cyan-300" />
                <div className="text-sm font-medium text-white">Risk Distribution</div>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={4} stroke="none">
                      {riskData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "rgba(11,17,32,0.95)", border: "1px solid rgba(0,194,255,0.3)", borderRadius: 12, color: "#E2E8F0" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-2">
                {riskData.map((r) => (
                  <div key={r.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color, boxShadow: `0 0 10px ${r.color}` }} />
                      {r.name} Risk
                    </div>
                    <span className="font-medium text-white">{r.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <Shield className="h-3.5 w-3.5 text-cyan-400/70" />
          LinkSys · Account Intelligence v1.0
        </div>
      </div>
      </div>
    </div>
  );
}
