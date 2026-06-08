import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Network,
  Fingerprint,
  Cloud,
  AtSign,
  Phone,
  User,
  Globe,
} from "lucide-react";

/**
 * Faint, full-screen digital-identity network backdrop.
 * Represents User -> Email -> Social -> Recovery -> Connected Services.
 * Stays at low opacity to sit behind all content.
 */
function IdentityBackdrop() {
  type NodeKind = "user" | "email" | "phone" | "social" | "cloud" | "id" | "web";
  type N = { id: string; x: number; y: number; kind: NodeKind; r?: number; pulse?: boolean };

  // Clustered + isolated nodes spread across the whole viewport (% units).
  const nodes: N[] = [
    // Cluster A — primary identity (top-left quadrant)
    { id: "u1", x: 18, y: 30, kind: "user", r: 4, pulse: true },
    { id: "e1", x: 8, y: 18, kind: "email" },
    { id: "e2", x: 28, y: 14, kind: "email" },
    { id: "p1", x: 6, y: 40, kind: "phone" },
    { id: "s1", x: 26, y: 44, kind: "social" },
    { id: "s2", x: 14, y: 52, kind: "social" },
    { id: "c1", x: 32, y: 30, kind: "cloud" },

    // Cluster B — work identity (center)
    { id: "u2", x: 52, y: 58, kind: "user", r: 4, pulse: true },
    { id: "e3", x: 44, y: 48, kind: "email" },
    { id: "c2", x: 62, y: 50, kind: "cloud" },
    { id: "c3", x: 60, y: 68, kind: "cloud" },
    { id: "s3", x: 44, y: 70, kind: "social" },
    { id: "id1", x: 54, y: 44, kind: "id" },

    // Cluster C — secondary identity (right)
    { id: "u3", x: 82, y: 28, kind: "user", r: 4, pulse: true },
    { id: "e4", x: 92, y: 20, kind: "email" },
    { id: "p2", x: 94, y: 36, kind: "phone" },
    { id: "s4", x: 76, y: 18, kind: "social" },
    { id: "c4", x: 88, y: 46, kind: "cloud" },

    // Cluster D — bottom-right services
    { id: "c5", x: 78, y: 78, kind: "cloud" },
    { id: "c6", x: 88, y: 86, kind: "cloud" },
    { id: "w1", x: 70, y: 88, kind: "web" },
    { id: "id2", x: 84, y: 70, kind: "id" },

    // Isolated / disconnected identities
    { id: "iso1", x: 5, y: 85, kind: "social" },
    { id: "iso2", x: 38, y: 92, kind: "email" },
    { id: "iso3", x: 96, y: 60, kind: "web" },
    { id: "iso4", x: 50, y: 8, kind: "phone" },
  ];

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, N>;

  // Edges express: user -> email/phone/social -> recovery/cloud,
  // plus cross-cluster bridges (linked accounts).
  const edges: Array<[string, string]> = [
    // Cluster A
    ["u1", "e1"], ["u1", "e2"], ["u1", "p1"], ["u1", "s1"], ["u1", "s2"], ["u1", "c1"],
    ["e1", "s2"], ["e2", "c1"], ["p1", "s1"],
    // Cluster B
    ["u2", "e3"], ["u2", "c2"], ["u2", "s3"], ["u2", "id1"], ["c2", "c3"], ["e3", "s3"], ["id1", "c2"],
    // Cluster C
    ["u3", "e4"], ["u3", "p2"], ["u3", "s4"], ["u3", "c4"], ["e4", "c4"],
    // Cluster D services
    ["c5", "c6"], ["c5", "w1"], ["id2", "c5"], ["id2", "c4"],
    // Cross-cluster bridges (account linkage discovery)
    ["c1", "e3"], ["s2", "u2"], ["c4", "id1"], ["u2", "id2"],
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
    <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.18]">
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="bg-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C2FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="bg-node-glow">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00C2FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges */}
        {edges.map(([a, b], i) => {
          const A = byId[a];
          const B = byId[b];
          if (!A || !B) return null;
          return (
            <motion.line
              key={`e-${i}`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke="url(#bg-edge)"
              strokeWidth="0.12"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0.25, 0.7, 0.25] }}
              transition={{
                pathLength: { duration: 2, delay: (i % 8) * 0.15 },
                opacity: { duration: 6 + (i % 4), repeat: Infinity, ease: "easeInOut" },
              }}
            />
          );
        })}

        {/* Traveling packets along edges */}
        {edges.slice(0, 18).map(([a, b], i) => {
          const A = byId[a];
          const B = byId[b];
          if (!A || !B) return null;
          const dur = 4 + ((i * 1.3) % 5);
          return (
            <motion.circle
              key={`pk-${i}`}
              r="0.35"
              fill="#A5F3FC"
              animate={{
                cx: [A.x, B.x, A.x],
                cy: [A.y, B.y, A.y],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: dur,
                repeat: Infinity,
                delay: (i % 9) * 0.5,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Node halos for primary identities */}
        {nodes.filter((n) => n.pulse).map((n) => (
          <motion.circle
            key={`h-${n.id}`}
            cx={n.x}
            cy={n.y}
            r="2.5"
            fill="url(#bg-node-glow)"
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.8, 1.6, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={(n.r ?? 2.2) * 0.35}
              fill={kindColor[n.kind]}
              opacity="0.95"
            />
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r ?? 1.4}
              fill="none"
              stroke={kindColor[n.kind]}
              strokeWidth="0.12"
              opacity="0.55"
            />
          </g>
        ))}
      </svg>

      {/* Subtle icon overlay near key nodes — communicates node type */}
      <div className="absolute inset-0">
        {nodes
          .filter((n) => ["user", "email", "cloud", "social", "phone"].includes(n.kind))
          .filter((_, i) => i % 2 === 0)
          .map((n) => {
            const Icon =
              n.kind === "user"
                ? User
                : n.kind === "email"
                  ? AtSign
                  : n.kind === "cloud"
                    ? Cloud
                    : n.kind === "phone"
                      ? Phone
                      : Globe;
            return (
              <div
                key={`ic-${n.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-cyan-200/70"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <Icon className="h-3 w-3" strokeWidth={1.5} />
              </div>
            );
          })}
      </div>
    </div>
  );
}


function NetworkGraph() {
  const nodes = [
    { x: 50, y: 20, icon: AtSign, label: "Email", delay: 0 },
    { x: 80, y: 35, icon: Phone, label: "Phone", delay: 0.2 },
    { x: 75, y: 70, icon: Cloud, label: "Cloud", delay: 0.4 },
    { x: 40, y: 80, icon: Globe, label: "Web", delay: 0.6 },
    { x: 15, y: 55, icon: User, label: "Social", delay: 0.8 },
    { x: 20, y: 25, icon: Fingerprint, label: "ID", delay: 1.0 },
  ];
  const center = { x: 50, y: 50 };

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C2FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="node-glow">
          <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00C2FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {nodes.map((n, i) => (
        <motion.line
          key={`l-${i}`}
          x1={center.x}
          y1={center.y}
          x2={n.x}
          y2={n.y}
          stroke="url(#line-grad)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0.5, 1] }}
          transition={{
            pathLength: { duration: 1.2, delay: n.delay },
            opacity: { duration: 3, delay: n.delay + 1.2, repeat: Infinity },
          }}
        />
      ))}
      {nodes.map((_, i) => (
        <motion.circle
          key={`p-${i}`}
          r="0.5"
          fill="#67E8F9"
          initial={{ offsetDistance: "0%" }}
          animate={{
            cx: [center.x, nodes[i].x],
            cy: [center.y, nodes[i].y],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2.5,
            delay: nodes[i].delay + 1.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
    </svg>
  );
}

function NetworkNodes() {
  const nodes = [
    { x: 50, y: 20, icon: AtSign, label: "Email", delay: 0 },
    { x: 80, y: 35, icon: Phone, label: "Phone", delay: 0.2 },
    { x: 75, y: 70, icon: Cloud, label: "Cloud", delay: 0.4 },
    { x: 40, y: 80, icon: Globe, label: "Web", delay: 0.6 },
    { x: 15, y: 55, icon: User, label: "Social", delay: 0.8 },
    { x: 20, y: 25, icon: Fingerprint, label: "ID", delay: 1.0 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* center node */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400/30" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/40 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 backdrop-blur-md shadow-[0_0_40px_rgba(0,194,255,0.6)]">
            <Shield className="h-7 w-7 text-cyan-200" />
          </div>
        </div>
      </motion.div>
      {nodes.map((n, i) => {
        const Icon = n.icon;
        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
            transition={{
              scale: { duration: 0.5, delay: n.delay + 0.5 },
              opacity: { duration: 0.5, delay: n.delay + 0.5 },
              y: { duration: 4 + i, delay: n.delay + 1, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <div className="group flex flex-col items-center gap-2">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-slate-900/70 backdrop-blur-sm shadow-[0_0_20px_rgba(0,194,255,0.25)]">
                <Icon className="h-5 w-5 text-cyan-300" />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-cyan-200/70">
                {n.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function Particles() {
  const particles = Array.from({ length: 25 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, i) => {
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 10;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-cyan-300/60"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: `-10px`,
              boxShadow: "0 0 8px rgba(103, 232, 249, 0.8)",
              animation: `float-up ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError(null);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  setLoading(true);

  await new Promise((r) => setTimeout(r, 1400));

  setLoading(false);
  setSuccess(true);

  setTimeout(() => {
    navigate("/dashboard");
  }, 1000);
};
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050816] text-slate-100">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,194,255,0.18),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <IdentityBackdrop />
      <Particles />
      {/* Scanline */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT — Network visualization */}
        <div className="relative hidden flex-col justify-between p-10 lg:flex xl:p-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(0,194,255,0.5)]">
              <Shield className="h-5 w-5 text-slate-950" />
              <Network className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-cyan-200" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
              DFM • Identity Intel
            </span>
          </motion.div>

          <div className="relative my-8 flex-1">
            <NetworkGraph />
            <NetworkNodes />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-lg"
          >
            <h1 className="text-5xl font-bold leading-tight tracking-tight xl:text-6xl">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                Map. Analyze.
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent glow-text">
                Protect.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-400">
              Discover your digital footprint, connected identities, account
              dependencies, and hidden security risks across the open web.
            </p>
            <div className="mt-6 flex items-center gap-6 text-xs uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Live OSINT
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,194,255,0.8)]" />
                Zero-Knowledge
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                SOC 2
              </span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT — Login card */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="glass-card relative rounded-2xl p-8 sm:p-10">
              {/* Gradient border glow */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-400/30 via-transparent to-blue-500/20 opacity-60 blur-sm" />

              <div className="relative">
                <div className="mb-8 flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.7, type: "spring" }}
                    className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_30px_rgba(0,194,255,0.6)]"
                  >
                    <Shield className="h-7 w-7 text-slate-950" strokeWidth={2.5} />
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#0B1120] bg-cyan-300">
                      <Network className="h-2.5 w-2.5 text-slate-950" strokeWidth={3} />
                    </div>
                  </motion.div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Digital Footprint Mapper
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-400">
                    Monitor, Analyze and Secure Your Online Presence
                  </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-slate-300">
                      Email
                    </label>
                    <div className="group relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="analyst@company.com"
                        autoComplete="email"
                        className="w-full rounded-lg border border-white/10 bg-slate-950/50 py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-cyan-400/60 focus:bg-slate-950/80 focus:shadow-[0_0_0_3px_rgba(0,194,255,0.15)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                    <div className="group relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                      <input
                        id="password"
                        type={showPwd ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-white/10 bg-slate-950/50 py-3 pl-10 pr-11 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-cyan-400/60 focus:bg-slate-950/80 focus:shadow-[0_0_0_3px_rgba(0,194,255,0.15)]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        aria-label={showPwd ? "Hide password" : "Show password"}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 transition-colors hover:text-cyan-300"
                      >
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex cursor-pointer items-center gap-2 text-slate-400 hover:text-slate-200">
                      <span className="relative flex h-4 w-4 items-center justify-center">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="peer absolute h-4 w-4 cursor-pointer appearance-none rounded border border-white/20 bg-slate-950/60 checked:border-cyan-400 checked:bg-cyan-400/20"
                        />
                        <CheckCircle2 className="pointer-events-none h-3 w-3 text-cyan-300 opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                      </span>
                      Remember me
                    </label>
                    <a href="#" className="font-medium text-cyan-400 transition-colors hover:text-cyan-300">
                      Forgot password?
                    </a>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-300"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={loading || success}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(0,194,255,0.35)] transition-all hover:shadow-[0_0_40px_rgba(0,194,255,0.6)] disabled:opacity-80"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                    {success ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Authenticated
                      </>
                    ) : loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Authenticating…
                      </>
                    ) : (
                      <>Sign In Securely</>
                    )}
                  </motion.button>
                </form>

                <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
                  Discover hidden digital identities, connected accounts, and
                  security risks across your online footprint.
                </p>

                <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/5 pt-5 text-[11px] uppercase tracking-wider text-slate-600">
                  <Lock className="h-3 w-3" />
                  End-to-end encrypted • TLS 1.3
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}