import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Sidebar from "../components/Sidebar";
import {
  Shield,
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
  XCircle,
  Clock,
  Sparkles,
  Eye,
  KeyRound,
  Settings,
  ArrowUpRight,
} from "lucide-react";

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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" },
  }),
};

function riskTone(r: string) {
  if (r === "Low") return "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";
  if (r === "Medium") return "text-amber-300 bg-amber-400/10 border-amber-400/20";
  return "text-rose-300 bg-rose-400/10 border-rose-400/20";
}

function statusTone(s: string) {
  if (s === "Connected") return "text-cyan-300 bg-cyan-400/10 border-cyan-400/20";
  return "text-slate-400 bg-slate-400/10 border-slate-400/20";
}

/* ----------------------------- Reusable UI ----------------------------- */

function GlassCard({
  children,
  className = "",
  glow = "cyan",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "blue" | "purple";
}) {
  const glowMap = {
    cyan: "before:bg-cyan-500/10",
    blue: "before:bg-blue-500/10",
    purple: "before:bg-purple-500/10",
  };
  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl
        shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]
        before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:blur-2xl ${glowMap[glow]}
        ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ kicker, title, icon: Icon }: { kicker?: string; title: string; icon?: any }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {Icon && (
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_24px_-6px_rgba(34,211,238,0.6)]">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div>
        {kicker && <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-300/70">{kicker}</div>}
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
    </div>
  );
}

function Counter({ value }: { value: number }) {
  const n = useCounter(value);
  return <span>{n.toLocaleString()}</span>;
}

function Ring({ value, max = 100, color = "#22d3ee" }: { value: number; max?: number; color?: string }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
        <motion.circle
          cx="40"
          cy="40"
          r={r}
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - c * pct }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-white">
        <div className="text-center">
          <div className="text-xl font-semibold leading-none">
            <Counter value={value} />
          </div>
          <div className="text-[10px] uppercase tracking-widest text-white/40">/ {max}</div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Page ----------------------------- */

export default function Profile() {
  return (
    <div className="flex min-h-screen overflow-hidden bg-[#05070d] text-slate-200">
      <Sidebar currentPath="/profile" />
      <div className="relative flex-1">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/3 h-[520px] w-[520px] rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute top-40 -right-32 h-[460px] w-[460px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {/* ---------------- Hero ---------------- */}
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <GlassCard glow="purple" className="overflow-hidden p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative"
                >
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 opacity-70 blur-md" />
                  <div className="relative grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-3xl font-bold text-white shadow-2xl">
                    SM
                    <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-[#05070d] bg-cyan-400 text-[#05070d]">
                      <BadgeCheck className="h-4 w-4" />
                    </span>
                  </div>
                </motion.div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-semibold text-white lg:text-4xl">{USER.name}</h1>
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-gradient-to-r from-amber-400/20 to-yellow-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-200">
                      <Crown className="h-3.5 w-3.5" /> {USER.plan}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4 text-cyan-300/80" />{USER.primaryEmail}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-purple-300/80" />{USER.location}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-blue-300/80" />Member since {USER.memberSince}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <div className="text-[11px] uppercase tracking-[0.25em] text-cyan-300/70">Identity Score</div>
                <div className="flex items-end gap-3">
                  <div className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-5xl font-bold leading-none text-transparent">
                    <Counter value={88} />
                  </div>
                  <div className="pb-1 text-sm text-emerald-300">+4 this week</div>
                </div>
                <div className="h-2 w-64 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "88%" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]"
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ---------------- Stats ---------------- */}
        <section className="mt-10">
          <SectionTitle kicker="Overview" title="Digital Identity Stats" icon={Activity} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -4 }}
              >
                <GlassCard className="group p-4 transition-shadow hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)]">
                  <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-semibold text-white">
                    <Counter value={s.value} />
                  </div>
                  <div className="text-xs uppercase tracking-wider text-slate-400">{s.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------------- Security ---------------- */}
        <section className="mt-12">
          <SectionTitle kicker="Posture" title="Security Overview" icon={Shield} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SECURITY.map((m, i) => {
              const color = m.tone === "good" ? "#22d3ee" : m.tone === "low" ? "#34d399" : "#f59e0b";
              return (
                <motion.div key={m.label} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} whileHover={{ y: -4 }}>
                  <GlassCard glow="blue" className="flex items-center gap-4 p-5">
                    <Ring value={m.value} max={m.max} color={color} />
                    <div>
                      <div className="flex items-center gap-2 text-white">
                        <m.icon className="h-4 w-4 text-cyan-300" />
                        <span className="font-medium">{m.label}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-400">{m.hint}</div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ---------------- Connected Identities + Accounts ---------------- */}
        <section className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Identities */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-1">
            <SectionTitle kicker="Linked" title="Connected Identities" icon={User} />
            <GlassCard glow="purple" className="divide-y divide-white/5">
              <div className="p-5">
                <div className="mb-2 text-xs uppercase tracking-wider text-cyan-300/70">Emails</div>
                <ul className="space-y-2">
                  {[USER.primaryEmail, ...USER.secondaryEmails].map((e, i) => (
                    <li key={e} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.02] px-3 py-2 transition hover:bg-white/[0.05]">
                      <div className="flex items-center gap-2 text-sm text-slate-200">
                        <Mail className="h-4 w-4 text-cyan-300" />
                        {e}
                        {i === 0 && (
                          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] text-cyan-300">Primary</span>
                        )}
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5">
                <div className="mb-2 text-xs uppercase tracking-wider text-cyan-300/70">Phones</div>
                <ul className="space-y-2">
                  {USER.phones.map((p) => (
                    <li key={p} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.02] px-3 py-2 transition hover:bg-white/[0.05]">
                      <div className="flex items-center gap-2 text-sm text-slate-200">
                        <Phone className="h-4 w-4 text-blue-300" />
                        {p}
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5">
                <div className="mb-2 text-xs uppercase tracking-wider text-cyan-300/70">Usernames</div>
                <ul className="space-y-2">
                  {USER.usernames.map((u, i) => (
                    <li key={u} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.02] px-3 py-2 transition hover:bg-white/[0.05]">
                      <div className="flex items-center gap-2 text-sm text-slate-200">
                        <AtSign className="h-4 w-4 text-purple-300" />
                        {u}
                      </div>
                      {i === 2 ? <XCircle className="h-4 w-4 text-amber-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </motion.div>

          {/* Accounts */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-2">
            <SectionTitle kicker="Integrations" title="Connected Accounts" icon={Users} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ACCOUNTS.map((a, i) => (
                <motion.div key={a.name} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} whileHover={{ y: -3, scale: 1.01 }}>
                  <GlassCard className="flex items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/0 text-white">
                        <a.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{a.name}</div>
                        <div className="text-xs text-slate-400">Last activity · {a.last}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${statusTone(a.status)}`}>
                        {a.status}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${riskTone(a.risk)}`}>
                        {a.risk} risk
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ---------------- Activity + Recommendations ---------------- */}
        <section className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <SectionTitle kicker="Timeline" title="Recent Activity" icon={Activity} />
            <GlassCard glow="cyan" className="p-6">
              <ol className="relative space-y-6 border-l border-white/10 pl-6">
                {ACTIVITY.map((a, i) => {
                  const toneMap: Record<string, string> = {
                    cyan: "bg-cyan-400/15 text-cyan-300 border-cyan-400/30",
                    rose: "bg-rose-400/15 text-rose-300 border-rose-400/30",
                    emerald: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
                    purple: "bg-purple-400/15 text-purple-300 border-purple-400/30",
                  };
                  return (
                    <motion.li key={i} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
                      <span className={`absolute -left-[14px] grid h-7 w-7 place-items-center rounded-full border ${toneMap[a.tone]}`}>
                        <a.icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-white">{a.title}</div>
                          <div className="text-sm text-slate-400">{a.detail}</div>
                        </div>
                        <div className="whitespace-nowrap text-xs text-slate-500">{a.time}</div>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            </GlassCard>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <SectionTitle kicker="Action Items" title="Security Recommendations" icon={ShieldCheck} />
            <div className="space-y-3">
              {RECOMMENDATIONS.map((r, i) => (
                <motion.div key={r.title} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} whileHover={{ x: 4 }}>
                  <GlassCard glow="purple" className="flex items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-cyan-200">
                        <r.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{r.title}</div>
                        <div className="text-sm text-slate-400">{r.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${riskTone(r.severity)}`}>
                        {r.severity}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-cyan-300" />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ---------------- Export Center ---------------- */}
        <section className="mt-12 mb-6">
          <SectionTitle kicker="Reports" title="Export Center" icon={Download} />
          <GlassCard glow="blue" className="p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {EXPORTS.map((e, i) => (
                <motion.button
                  key={e.label}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-4 text-left transition-shadow hover:shadow-[0_0_30px_-8px_rgba(34,211,238,0.55)]"
                >
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 group-hover:opacity-100" />
                  <div className="flex items-center justify-between">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-500/30 text-white">
                      <e.icon className="h-4 w-4" />
                    </div>
                    <Download className="h-4 w-4 text-cyan-300 opacity-60 transition-transform group-hover:translate-y-0.5" />
                  </div>
                  <div className="mt-3 font-medium text-white">{e.label}</div>
                  <div className="text-xs text-slate-400">PDF · CSV · JSON</div>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </section>
      </div>
      </div>
    </div>
  );
}