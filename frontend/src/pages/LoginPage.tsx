import { useNavigate } from "react-router-dom";
import { useState, type FormEvent, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
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
  User,
  Terminal,
  Cpu,
  Binary,
  Layers,
} from "lucide-react";

type NodeKind = "user" | "email" | "phone" | "social" | "cloud" | "id" | "web";
type N = { id: string; x: number; y: number; kind: NodeKind; r?: number; pulse?: boolean };

function IdentityBackdrop() {
  const nodes: N[] = [
    { id: "u1", x: 18, y: 30, kind: "user", r: 4, pulse: true },
    { id: "e1", x: 8, y: 18, kind: "email" },
    { id: "e2", x: 28, y: 14, kind: "email" },
    { id: "p1", x: 6, y: 40, kind: "phone" },
    { id: "s1", x: 26, y: 44, kind: "social" },
    { id: "s2", x: 14, y: 52, kind: "social" },
    { id: "c1", x: 32, y: 30, kind: "cloud" },
    { id: "u2", x: 52, y: 58, kind: "user", r: 4, pulse: true },
    { id: "e3", x: 44, y: 48, kind: "email" },
    { id: "c2", x: 62, y: 50, kind: "cloud" },
    { id: "c3", x: 60, y: 68, kind: "cloud" },
    { id: "s3", x: 44, y: 70, kind: "social" },
    { id: "id1", x: 54, y: 44, kind: "id" },
    { id: "u3", x: 82, y: 28, kind: "user", r: 4, pulse: true },
    { id: "e4", x: 92, y: 20, kind: "email" },
    { id: "p2", x: 94, y: 36, kind: "phone" },
    { id: "s4", x: 76, y: 18, kind: "social" },
    { id: "c4", x: 88, y: 46, kind: "cloud" },
    { id: "c5", x: 78, y: 78, kind: "cloud" },
    { id: "c6", x: 88, y: 86, kind: "cloud" },
    { id: "w1", x: 70, y: 88, kind: "web" },
    { id: "id2", x: 84, y: 70, kind: "id" },
    { id: "iso1", x: 5, y: 85, kind: "social" },
    { id: "iso2", x: 38, y: 92, kind: "email" },
    { id: "iso3", x: 96, y: 60, kind: "web" },
    { id: "iso4", x: 50, y: 8, kind: "phone" },
  ];

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, N>;

  const edges: Array<[string, string]> = [
    ["u1", "e1"], ["u1", "e2"], ["u1", "p1"], ["u1", "s1"], ["u1", "s2"], ["u1", "c1"],
    ["e1", "s2"], ["e2", "c1"], ["p1", "s1"],
    ["u2", "e3"], ["u2", "c2"], ["u2", "s3"], ["u2", "id1"], ["c2", "c3"], ["e3", "s3"], ["id1", "c2"],
    ["u3", "e4"], ["u3", "p2"], ["u3", "s4"], ["u3", "c4"], ["e4", "c4"],
    ["c5", "c6"], ["c5", "w1"], ["id2", "c5"], ["id2", "c4"],
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
    <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.25] mix-blend-screen overflow-hidden">
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="bg-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C2FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="bg-node-glow">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00C2FF" stopOpacity="0" />
          </radialGradient>
        </defs>

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
              animate={{ pathLength: 1, opacity: [0.25, 0.75, 0.25] }}
              transition={{
                pathLength: { duration: 2, delay: (i % 8) * 0.1 },
                opacity: { duration: 6 + (i % 4), repeat: Infinity, ease: "easeInOut" },
              }}
            />
          );
        })}

        {edges.slice(0, 18).map(([a, b], i) => {
          const A = byId[a];
          const B = byId[b];
          if (!A || !B) return null;
          const dur = 4 + ((i * 1.2) % 4);
          return (
            <motion.circle
              key={`pk-${i}`}
              r="0.35"
              fill="#E0F2FE"
              animate={{
                cx: [A.x, B.x, A.x],
                cy: [A.y, B.y, A.y],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: dur,
                repeat: Infinity,
                delay: (i % 9) * 0.35,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {nodes.filter((n) => n.pulse).map((n) => (
          <motion.circle
            key={`h-${n.id}`}
            cx={n.x}
            cy={n.y}
            r="2.8"
            fill="url(#bg-node-glow)"
            initial={{ opacity: 0.3, scale: 0.85 }}
            animate={{ opacity: [0.2, 0.75, 0.2], scale: [0.85, 1.5, 0.85] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={(n.r ?? 2.2) * 0.32} fill={kindColor[n.kind]} opacity="0.9" />
            <circle cx={n.x} cy={n.y} r={n.r ?? 1.4} fill="none" stroke={kindColor[n.kind]} strokeWidth="0.1" opacity="0.5" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function SecurityConsoleMoat() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block overflow-hidden">
      <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-cyan-500/10 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="w-[92%] h-[92%] rounded-full border border-dashed border-blue-500/10 flex items-center justify-center"
        >
          <div className="w-[85%] h-[85%] rounded-full border border-cyan-400/5" />
        </motion.div>
      </div>

      <div className="absolute right-12 top-12 font-mono text-[9px] text-cyan-500/40 space-y-1 text-right">
        <div>CORE_ENV // SECURE_COMM_v1.3</div>
        <div>SYS_MATRIX_LOAD: NOMINAL</div>
        <div className="flex items-center gap-1.5 justify-end">
          <span className="h-1 w-1 rounded-full bg-cyan-400 animate-ping" />
          <span>NODE_STREAM: STABLE</span>
        </div>
      </div>
    </div>
  );
}

function CyberPillars() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-6 border-t border-white/5">
      <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 backdrop-blur-sm relative group hover:border-cyan-500/20 transition-all duration-300">
        <div className="flex items-center gap-2.5 mb-1.5">
          <Cpu className="h-4 w-4 text-cyan-400" />
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-200">OSINT Recon</h3>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">Continuous automated asset lineage discovery across surface layers.</p>
      </div>

      <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 backdrop-blur-sm relative group hover:border-cyan-500/20 transition-all duration-300">
        <div className="flex items-center gap-2.5 mb-1.5">
          <Binary className="h-4 w-4 text-sky-400" />
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-200">Threat Graph</h3>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">Structural dependency cross-referencing to isolate vulnerability leaks.</p>
      </div>

      <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 backdrop-blur-sm relative group hover:border-cyan-500/20 transition-all duration-300">
        <div className="flex items-center gap-2.5 mb-1.5">
          <Layers className="h-4 w-4 text-blue-400" />
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-200">Zero-Logs</h3>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">Cryptographically validated perimeters engineered without tracking maps.</p>
      </div>
    </div>
  );
}

// Google SVG Icon — inline so no extra dependency needed
function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError(null);
    // Redirects to FastAPI which handles the OAuth flow
    window.location.href = "http://localhost:8001/auth/google/login";
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegister && !fullName.trim()) {
      setError("Please supply your full legal name parameters.");
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please supply a valid intelligence identity endpoint.");
      return;
    }

    if (password.length < 6) {
      setError("Passphrase frame token mismatch. Access parameters rejected.");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError("Passphrase validation failed. Keys do not intersect.");
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

  const toggleAuthMode = () => {
    setIsRegister(!isRegister);
    setError(null);
    setSuccess(false);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#03050d] text-slate-100 flex items-center justify-center selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,194,255,0.2),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15),transparent_60%)] animate-pulse [animation-duration:12s]" />
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: "linear-gradient(to right, rgba(0, 194, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 194, 255, 0.03) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      <IdentityBackdrop />
      <SecurityConsoleMoat />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.7)]"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center px-6 lg:px-16 gap-12">

        {/* LEFT COLUMN */}
        <div className="relative hidden h-full flex-col justify-between py-12 lg:col-span-6 lg:flex pr-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_30px_rgba(0,194,255,0.5)] border border-cyan-300/20">
              <Shield className="h-5.5 w-5.5 text-slate-950" strokeWidth={2.5} />
              <Network className="absolute -bottom-1 -right-1 h-4 w-4 text-cyan-100 bg-slate-950 rounded-full p-0.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-black uppercase tracking-[0.25em] bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Linksys • IDENTITY INTEL
              </span>
              <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">Enterprise Security Gateway</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 font-mono text-[9px] uppercase tracking-wider">
                <Terminal className="h-3 w-3" /> Reconnaissance Interface Active
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight xl:text-5xl text-white">
                Map. Analyze.{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(34,211,238,0.55)] font-black">
                  Protect Footprints.
                </span>
              </h1>
              <p className="max-w-md text-xs leading-relaxed text-slate-400 font-normal">
                Isolate leaked network nodes, reconstruct complex credential lineage graphs, and discover systemic security anomalies across the surface perimeter.
              </p>
            </div>
            <CyberPillars />
          </motion.div>

          <div className="flex items-center gap-6 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-500 border-t border-white/5 pt-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              SOC 2 CERTIFIED
            </span>
            <span className="text-slate-600">|</span>
            <span>Linksys DEPLOYMENT NODE</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Form */}
        <div className="flex items-center justify-center lg:col-span-6 w-full h-full py-6">
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-[480px]"
          >
            <div
              style={{ transform: "translateZ(40px)" }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#090f24]/90 to-[#030612]/95 p-8 sm:p-11 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.9)] backdrop-blur-3xl"
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-[60px]" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-600/10 blur-[60px]" />
              <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-cyan-400/40 via-transparent to-blue-500/20 opacity-100" />

              <div className="relative space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_35px_rgba(0,194,255,0.4)] border border-cyan-300/20">
                    <Shield className="h-6.5 w-6.5 text-slate-950" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                    {isRegister ? "Register Architecture" : "Reconstruct Identity"}
                  </h2>
                  <p className="mt-1.5 text-xs text-slate-400 max-w-xs">
                    {isRegister
                      ? "Create an identity profile layer to map open network footprint assets."
                      : "Pass systemic authentication layers to map real-time exposure matrices inside Linksys."
                    }
                  </p>
                </div>

                {/* ── GOOGLE SSO BUTTON ── */}
                <motion.button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3.5 text-xs font-mono font-bold uppercase tracking-widest text-slate-200 transition-all duration-300 hover:border-cyan-500/30 hover:bg-slate-900/80 hover:shadow-[0_0_20px_rgba(0,194,255,0.1)] disabled:opacity-50"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {googleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                  ) : (
                    <GoogleIcon />
                  )}
                  <span>{googleLoading ? "Routing OAuth Vector..." : "Continue with Google"}</span>
                </motion.button>

                {/* ── DIVIDER ── */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">or authenticate manually</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* ── MANUAL FORM ── */}
                <form onSubmit={onSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isRegister ? "register-fields" : "login-fields"}
                      initial={{ opacity: 0, x: isRegister ? 15 : -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRegister ? -15 : 15 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="space-y-4"
                    >
                      {isRegister && (
                        <div className="space-y-2">
                          <label htmlFor="fullName" className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400/90 flex items-center gap-1.5">
                            <User className="h-3 w-3" /> Full Name Parameter
                          </label>
                          <div className="group relative">
                            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                            <input
                              id="fullName"
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Alex Nakamura"
                              className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-3.5 pl-11 pr-4 text-xs font-mono text-white placeholder:text-slate-700 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-slate-950/90 focus:shadow-[0_0_20px_rgba(0,194,255,0.15)]"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label htmlFor="email" className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400/90 flex items-center gap-1.5">
                          <Terminal className="h-3 w-3" /> Identity Endpoint Token
                        </label>
                        <div className="group relative">
                          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="analyst@company.com"
                            autoComplete="email"
                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-3.5 pl-11 pr-4 text-xs font-mono text-white placeholder:text-slate-700 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-slate-950/90 focus:shadow-[0_0_20px_rgba(0,194,255,0.15)]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="password" className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400/90 flex items-center gap-1.5">
                          <Lock className="h-3 w-3" /> System Passphrase Key
                        </label>
                        <div className="group relative">
                          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                          <input
                            id="password"
                            type={showPwd ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            autoComplete={isRegister ? "new-password" : "current-password"}
                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-3.5 pl-11 pr-12 text-xs font-mono text-white placeholder:text-slate-700 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-slate-950/90 focus:shadow-[0_0_20px_rgba(0,194,255,0.15)]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPwd((v) => !v)}
                            aria-label={showPwd ? "Hide password" : "Show password"}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition-colors hover:text-cyan-400"
                          >
                            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {isRegister && (
                        <div className="space-y-2">
                          <label htmlFor="confirmPassword" className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400/90 flex items-center gap-1.5">
                            <Lock className="h-3 w-3" /> Intersect Passphrase Key
                          </label>
                          <div className="group relative">
                            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                            <input
                              id="confirmPassword"
                              type={showPwd ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="••••••••••••"
                              autoComplete="new-password"
                              className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-3.5 pl-11 pr-12 text-xs font-mono text-white placeholder:text-slate-700 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-slate-950/90 focus:shadow-[0_0_20px_rgba(0,194,255,0.15)]"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {!isRegister && (
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <label className="flex cursor-pointer items-center gap-2 text-slate-400 select-none hover:text-slate-200 transition-colors">
                        <span className="relative flex h-4 w-4 items-center justify-center">
                          <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="peer absolute h-4 w-4 cursor-pointer appearance-none rounded-md border border-white/20 bg-slate-950/60 checked:border-cyan-400 checked:bg-cyan-400/20 transition-all"
                          />
                          <CheckCircle2 className="pointer-events-none h-3 w-3 text-cyan-400 opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={2.5} />
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">Remember Environment Node</span>
                      </label>
                      <a href="#" className="font-mono text-[9px] uppercase tracking-wider text-cyan-400 font-bold transition-colors hover:text-cyan-300">
                        Recovery System
                      </a>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                        <span className="font-mono text-[10px]">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={loading || success || googleLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-950 shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,194,255,0.6)] disabled:opacity-50"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                    {success ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 animate-bounce" strokeWidth={2.5} />
                        {isRegister ? "COMPILING INDEX..." : "ACCESS GRANTED"}
                      </>
                    ) : loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isRegister ? "GENERATING LAYER..." : "COMPILING VECTOR..."}
                      </>
                    ) : (
                      <>{isRegister ? "Deploy Identity Node" : "Initialize Linksys Decryption"}</>
                    )}
                  </motion.button>
                </form>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="font-mono text-[10px] uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors duration-200 cursor-pointer"
                  >
                    {isRegister ? (
                      <>Already have an account? <span className="text-cyan-400 font-bold underline decoration-cyan-500/40">Login here</span></>
                    ) : (
                      <>Don't have an account? <span className="text-cyan-400 font-bold underline decoration-cyan-500/40">Register here</span></>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 border-t border-white/5 pt-4 font-mono text-[9px] uppercase tracking-widest text-slate-500">
                  <Fingerprint className="h-4 w-4 text-slate-600" />
                  E2E Encrypted Protocol • TLS 1.3
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}