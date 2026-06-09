import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Fingerprint,
  Users,
  ShieldAlert,
  Share2,
  User,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";

const nav = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
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

interface SidebarProps {
  currentPath?: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
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
              <div className="text-sm font-semibold">LinkSys</div>
              <div className="text-[10px] text-cyan-300/80">PRO</div>
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
          const isActive = currentPath === n.path;

          return (
            <button
              key={n.label}
              onClick={() => navigate(n.path)}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/15 to-violet-500/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive && (
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
  );
}
