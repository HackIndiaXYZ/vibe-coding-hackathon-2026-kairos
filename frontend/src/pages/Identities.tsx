import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import {
  Mail,
  Phone,
  AtSign,
  Globe,
  Shield,
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
  AlertTriangle,
  Clock,
  Sparkles,
  Network,
  Fingerprint,
  TrendingUp,
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
  low: "text-emerald-300 bg-emerald-400/10 border-emerald-400/30",
  medium: "text-amber-300 bg-amber-400/10 border-amber-400/30",
  high: "text-rose-300 bg-rose-400/10 border-rose-400/30",
};

const riskDot: Record<Risk, string> = {
  low: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]",
  medium: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]",
  high: "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.8)]",
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

/* ---------------- atoms ---------------- */
function GlassCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className={
        "relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl " +
        "shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_60px_-30px_rgba(56,189,248,0.25)] " +
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-cyan-400/[0.06] before:to-transparent before:pointer-events-none " +
        className
      }
    >
      {children}
    </motion.div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  hint,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  hint: string;
  delay: number;
}) {
  const n = useCounter(value);
  return (
    <GlassCard delay={delay} className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-semibold text-white tabular-nums">{n}</span>
            <span className="text-xs text-cyan-300/80">{hint}</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-xl" />
          <div className="relative grid h-11 w-11 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  right,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {right}
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
    <div className="flex min-h-screen overflow-hidden bg-[#05070d] text-slate-200 antialiased">
      <Sidebar currentPath="/identities" />
      <div className="relative flex-1">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[480px] w-[480px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-indigo-500/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(125,211,252,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.4) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at top, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:py-14">
        {/* hero */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-300">
              <Fingerprint className="h-3.5 w-3.5" />
              Identity Explorer
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your digital identity, mapped
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Every email, phone, username and connected platform we've discovered for you — visualised as one
              intelligence graph.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search identity…"
                className="h-10 w-64 rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-cyan-400/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
              />
            </div>
            <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-cyan-400/40 bg-gradient-to-b from-cyan-400/20 to-cyan-500/10 px-4 text-sm font-medium text-cyan-200 transition hover:from-cyan-400/30 hover:to-cyan-500/20">
              <Activity className="h-4 w-4" />
              Re-scan
            </button>
          </div>
        </motion.header>

        {/* summary */}
        <section className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard icon={Mail} label="Emails" value={3} hint="2 verified" delay={0.05} />
          <SummaryCard icon={Phone} label="Phones" value={2} hint="all verified" delay={0.1} />
          <SummaryCard icon={AtSign} label="Usernames" value={3} hint="3 reused" delay={0.15} />
          <SummaryCard icon={Globe} label="Linked Platforms" value={8} hint="across 8 services" delay={0.2} />
        </section>

        {/* timeline + filters */}
        <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <GlassCard className="p-5 lg:col-span-2" delay={0.05}>
            <SectionHeader
              icon={Clock}
              title="Digital Identity Timeline"
              subtitle="When each identity was first discovered"
              right={
                <div className="flex flex-wrap gap-1.5">
                  {(["all", "email", "phone", "username", "platform"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className="relative rounded-full px-3 py-1 text-xs capitalize text-slate-300 transition hover:text-white"
                    >
                      {filter === f && (
                        <motion.span
                          layoutId="ident-filter"
                          className="absolute inset-0 rounded-full border border-cyan-400/40 bg-cyan-400/15"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative">{f}</span>
                    </button>
                  ))}
                </div>
              }
            />
            <ol className="relative ml-2 border-l border-white/10 pl-5">
              {TIMELINE.filter((t) => filter === "all" || t.kind === filter).map((t, i) => (
                <motion.li
                  key={t.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="relative mb-4 last:mb-0"
                >
                  <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm text-slate-200">{t.label}</p>
                    <span className="text-xs text-slate-500">{t.when}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wider text-cyan-300/70">{t.kind}</p>
                </motion.li>
              ))}
            </ol>
          </GlassCard>

          <GlassCard className="p-5" delay={0.1}>
            <SectionHeader icon={Sparkles} title="Security Insights" subtitle="Patterns across your identity graph" />
            <ul className="space-y-3">
              {INSIGHTS.map((ins, i) => (
                <motion.li
                  key={ins.title}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-cyan-400/30 hover:bg-white/[0.04]"
                >
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${riskColor[ins.tone]}`}>
                    <ins.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{ins.title}</p>
                    <p className="text-xs text-slate-400">{ins.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </GlassCard>
        </section>

        {/* emails */}
        <section className="mb-10">
          <SectionHeader icon={Mail} title="Email Identities" subtitle="Addresses linked to LinkSys" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <AnimatePresence>
              {EMAILS.map((e, i) => (
                <GlassCard key={e.address} delay={0.05 * i} className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${riskDot[e.risk]}`} />
                      {e.primary && (
                        <span className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-cyan-300">
                          Primary
                        </span>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${
                        e.verified
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                          : "border-amber-400/30 bg-amber-400/10 text-amber-300"
                      }`}
                    >
                      {e.verified ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                      {e.verified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <p className="mt-3 truncate text-base font-medium text-white">{e.address}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Link2 className="h-3.5 w-3.5 text-cyan-300" />
                      <span>{e.linkedAccounts} linked accounts</span>
                    </div>
                    <span className={`rounded-md border px-2 py-0.5 capitalize ${riskColor[e.risk]}`}>{e.risk} risk</span>
                  </div>
                </GlassCard>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* phones + usernames */}
        <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <SectionHeader icon={Phone} title="Phone Identities" subtitle="Numbers tied to recovery and 2FA" />
            <div className="space-y-3">
              {PHONES.map((p, i) => (
                <GlassCard key={p.number} delay={0.05 * i} className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                        <Phone className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="font-mono text-base text-white">{p.number}</p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="inline-flex items-center gap-1 text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" /> Verified
                          </span>
                          <span>·</span>
                          <span>{p.recoveryAccounts} recovery accounts</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold tabular-nums text-white">{p.score}</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">Security</div>
                    </div>
                  </div>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.score}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className={`h-full rounded-full ${
                        p.score >= 80
                          ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                          : p.score >= 60
                            ? "bg-gradient-to-r from-amber-400 to-cyan-400"
                            : "bg-gradient-to-r from-rose-400 to-amber-400"
                      }`}
                    />
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader icon={AtSign} title="Username Discovery" subtitle="Handles found across the web" />
            <div className="space-y-3">
              {USERNAMES.map((u, i) => (
                <GlassCard key={u.handle} delay={0.05 * i} className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                        <AtSign className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="font-mono text-base text-white">@{u.handle}</p>
                        <p className="text-[11px] text-slate-400">found on {u.platforms.length} platforms</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3.5 w-3.5 text-cyan-300" />
                      <span className="tabular-nums text-white">{u.reusedScore}</span>
                      <span className="text-slate-500">reuse</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {u.platforms.map((pl) => (
                      <span
                        key={pl}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-300"
                      >
                        {pl}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* platform mapping */}
        <section className="mb-10">
          <SectionHeader
            icon={Globe}
            title="Linked Platform Mapping"
            subtitle="Each platform → the identity it's linked to"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filteredPlatforms.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.04 * i, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl"
              >
                <div className={`absolute -inset-px -z-0 bg-gradient-to-br ${p.color} opacity-50`} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 text-white shadow-inner">
                      <p.icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-cyan-300">
                      {p.type}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-white">{p.name}</p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                    <Link2 className="h-3 w-3 text-cyan-300" />
                    <span className="truncate font-mono">{p.linkedTo}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* relationships */}
        <section className="mb-10">
          <SectionHeader
            icon={Network}
            title="Identity Relationship Panel"
            subtitle="How emails, phones, usernames and platforms connect"
          />
          <GlassCard className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {[
                { icon: Mail, label: "Emails", count: 3, color: "text-cyan-300", ring: "border-cyan-400/40" },
                { icon: Phone, label: "Phones", count: 2, color: "text-sky-300", ring: "border-sky-400/40" },
                { icon: AtSign, label: "Usernames", count: 3, color: "text-blue-300", ring: "border-blue-400/40" },
                { icon: Globe, label: "Platforms", count: 8, color: "text-indigo-300", ring: "border-indigo-400/40" },
              ].map((n, i) => (
                <div key={n.label} className="relative flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * i, type: "spring", stiffness: 200, damping: 18 }}
                    className={`relative grid h-20 w-20 place-items-center rounded-full border ${n.ring} bg-white/[0.04]`}
                  >
                    <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl" />
                    <n.icon className={`relative h-7 w-7 ${n.color}`} />
                  </motion.div>
                  <p className="mt-3 text-sm font-medium text-white">{n.label}</p>
                  <p className="text-xs text-slate-400">{n.count} discovered</p>
                  {i < 3 && (
                    <div className="absolute right-0 top-10 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-cyan-400/40 to-transparent md:block" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
                <Shield className="h-3.5 w-3.5 text-cyan-300" />
                Key Connections
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  ["sanika@gmail.com", "Google · LinkedIn · Notion · GitHub · Slack · Figma"],
                  ["+91 XXXXXXXX21", "Google · Discord · LinkedIn · GitHub"],
                  ["sanika_dev", "GitHub · Notion · Figma"],
                  ["sanika_official", "Discord · X"],
                ].map(([id, links]) => (
                  <li
                    key={id}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                  >
                    <span className="font-mono text-cyan-300">{id}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-slate-300">{links}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>
        </section>

        {/* recent discoveries */}
        <section className="mb-4">
          <SectionHeader icon={Activity} title="Recent Discoveries" subtitle="Latest signals from the scanner" />
          <GlassCard className="p-2">
            <ul className="divide-y divide-white/5">
              {TIMELINE.slice(0, 5).map((t, i) => (
                <motion.li
                  key={t.label + i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                    <span className="text-sm text-slate-200">{t.label}</span>
                    <span className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                      {t.kind}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{t.when}</span>
                </motion.li>
              ))}
            </ul>
          </GlassCard>
        </section>

        <footer className="mt-10 flex items-center justify-between text-xs text-slate-500">
          <span>Identity graph synced just now</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-cyan-300" />
            All data shown is mocked for preview
          </span>
        </footer>
      </div>
      </div>
    </div>
  );
}
