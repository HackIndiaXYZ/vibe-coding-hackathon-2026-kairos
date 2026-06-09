import { useState, useRef, useCallback } from "react";
import Sidebar from "../components/Sidebar";

const NODES = [
  {
    id: "center",
    x: 334, y: 212,
    type: "identity",
    label: "Bliss",
    sub: "Primary Identity",
  },
  {
    id: "email1",
    x: 118, y: 100,
    type: "email",
    label: "Gmail",
    tooltip: "Primary email · 6 linked accounts · High risk",
  },
  {
    id: "email2",
    x: 102, y: 216,
    type: "email",
    label: "sanika.work@",
    tooltip: "sanika.work@gmail.com · 3 linked accounts · Medium risk",
  },
  {
    id: "phone1",
    x: 104, y: 336,
    type: "phone",
    label: "+91 XXXXXXXX21",
    tooltip: "+91 XXXXXXXX21 · 4 recovery accounts · Verified",
  },
  {
    id: "instagram",
    x: 541, y: 76,
    type: "platform",
    label: "Instagram",
    tooltip: "Linked via email · Public profile",
  },
  {
    id: "linkedin",
    x: 542, y: 206,
    type: "platform",
    label: "LinkedIn",
    tooltip: "Linked via work email · Professional",
  },
  {
    id: "github",
    x: 538, y: 336,
    type: "platform",
    label: "GitHub",
    tooltip: "sanika_dev · 3 linked platforms",
  },
  {
    id: "risk",
    x: 328, y: 422,
    type: "risk",
    label: "⚠ High Risk Account",
    sub: "Reused credentials detected",
    tooltip: "Credentials reused across 3+ platforms",
  },
];

const EDGES = [
  { from: "center", to: "email1",    color: "#8b5cf6" },
  { from: "center", to: "email2",    color: "#22d3ee" },
  { from: "center", to: "phone1",    color: "#2dd4bf" },
  { from: "center", to: "instagram", color: "#6366f1" },
  { from: "center", to: "linkedin",  color: "#10b981" },
  { from: "center", to: "github",    color: "#3b82f6" },
  { from: "center", to: "risk",      color: "#ef4444" },
];

const NODE_STYLES = {
  email:    { fill: "rgba(139,92,246,0.18)", stroke: "#8b5cf6", text: "#c4b5fd" },
  email2:   { fill: "rgba(34,211,238,0.14)", stroke: "#22d3ee", text: "#67e8f9" },
  phone:    { fill: "rgba(45,212,191,0.14)", stroke: "#2dd4bf", text: "#5eead4" },
  platform: { fill: "rgba(99,102,241,0.18)", stroke: "#818cf8", text: "#a5b4fc" },
  risk:     { fill: "rgba(239,68,68,0.16)",  stroke: "#f87171", text: "#fca5a5" },
};

const NODE_COLOR_MAP = {
  email1:    { fill: "rgba(139,92,246,0.18)", stroke: "#8b5cf6", text: "#c4b5fd" },
  email2:    { fill: "rgba(34,211,238,0.14)", stroke: "#22d3ee", text: "#67e8f9" },
  phone1:    { fill: "rgba(45,212,191,0.14)", stroke: "#2dd4bf", text: "#5eead4" },
  instagram: { fill: "rgba(99,102,241,0.18)", stroke: "#818cf8", text: "#a5b4fc" },
  linkedin:  { fill: "rgba(16,185,129,0.15)", stroke: "#34d399", text: "#6ee7b7" },
  github:    { fill: "rgba(59,130,246,0.15)", stroke: "#60a5fa", text: "#93c5fd" },
  risk:      { fill: "rgba(239,68,68,0.16)",  stroke: "#f87171", text: "#fca5a5" },
};

function getNodePos(id) {
  return NODES.find((n) => n.id === id);
}

export default function LinkSysGraph() {
  const [tooltip, setTooltip] = useState(null);
  const [hovered, setHovered] = useState(null);
  const wrapRef = useRef(null);

  const handleMouseEnter = useCallback((node, e) => {
    if (!node.tooltip) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    let x = e.clientX - rect.left + 12;
    let y = e.clientY - rect.top - 16;
    if (x + 170 > rect.width) x = e.clientX - rect.left - 170;
    setTooltip({ title: node.label, sub: node.tooltip, x, y });
    setHovered(node.id);
  }, []);

  const handleMouseMove = useCallback((node, e) => {
    if (!node.tooltip) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    let x = e.clientX - rect.left + 12;
    let y = e.clientY - rect.top - 16;
    if (x + 170 > rect.width) x = e.clientX - rect.left - 170;
    setTooltip((prev) => prev ? { ...prev, x, y } : null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
    setHovered(null);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#05070d", color: "#e2e8f0" }}>
      <Sidebar currentPath="/graph" />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Inter', sans-serif",
        }}
      >
      {/* Ambient blobs */}
      <div style={{ pointerEvents: "none", position: "absolute", inset: 0, zIndex: 0 }}>
        <div style={{ position: "absolute", top: -80, left: "20%", width: 360, height: 360, borderRadius: "50%", background: "rgba(34,211,238,0.12)", filter: "blur(90px)" }} />
        <div style={{ position: "absolute", top: "30%", right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(99,102,241,0.1)", filter: "blur(90px)" }} />
        <div style={{ position: "absolute", bottom: 0, left: "30%", width: 280, height: 280, borderRadius: "50%", background: "rgba(79,70,229,0.08)", filter: "blur(90px)" }} />
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(rgba(125,211,252,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(125,211,252,0.4) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at top,black 30%,transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at top,black 30%,transparent 75%)",
        }} />
      </div>

      {/* Header */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: "20px 24px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 10px", borderRadius: 999,
          border: "1px solid rgba(34,211,238,0.3)",
          background: "rgba(34,211,238,0.08)",
          fontSize: 10, textTransform: "uppercase",
          letterSpacing: "0.18em", color: "#67e8f9",
          marginBottom: 10,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
          </svg>
          LinkSys Graph
        </div>

        <h1 style={{
          fontSize: 22, fontWeight: 600, marginBottom: 4,
          background: "linear-gradient(90deg,#a78bfa,#22d3ee)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Identity Graph
        </h1>
        <p style={{ fontSize: 12, color: "#94a3b8" }}>
          Visual mapping of accounts, recovery methods and risks
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {[
            { label: "Accounts", value: 8, color: "#f1f5f9" },
            { label: "Identities", value: 5, color: "#f1f5f9" },
            { label: "Risks", value: 3, color: "#f87171" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 10, padding: "8px 14px",
            }}>
              <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {s.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: s.color, lineHeight: 1.2, marginTop: 1 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", gap: 16, padding: "8px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        fontSize: 11,
      }}>
        {[
          { label: "Identity", color: "#a78bfa" },
          { label: "Email",    color: "#22d3ee" },
          { label: "Phone",    color: "#2dd4bf" },
          { label: "Platform", color: "#60a5fa" },
          { label: "Risk",     color: "#f87171" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: l.color,
              boxShadow: `0 0 6px ${l.color}99`,
            }} />
            <span style={{ color: l.color }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Graph canvas */}
      <div ref={wrapRef} style={{ position: "relative", zIndex: 1, flex: 1, overflow: "hidden" }}>
        <style>{`
          @keyframes dashMove { to { stroke-dashoffset: -20; } }
          @keyframes glowPulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
          .edge-animated { stroke-dasharray: 5 5; animation: dashMove 1.5s linear infinite; }
          .center-ring { animation: glowPulse 2.5s ease-in-out infinite; }
        `}</style>

        <svg
          viewBox="0 0 680 480"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <defs>
            <marker id="arrowV" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </marker>
            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="riskGlow">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6"/>
              <stop offset="100%" stopColor="#6366f1"/>
            </radialGradient>
          </defs>

          {/* Edges */}
          {EDGES.map((edge) => {
            const from = getNodePos(edge.from);
            const to   = getNodePos(edge.to);
            if (!from || !to) return null;
            const isRisk = edge.to === "risk";
            
            // Calculate edge endpoints that stop at rectangle borders
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            
            // Rectangle dimensions
            const width = isRisk ? 184 : 112;
            const height = isRisk ? 44 : 40;
            const halfW = width / 2;
            const halfH = height / 2;
            
            // Find intersection point on rectangle edge
            let offset = halfW / Math.abs(Math.cos(angle));
            if (Math.abs(Math.sin(angle)) > 0.01) {
              const offsetY = halfH / Math.abs(Math.sin(angle));
              offset = Math.min(offset, offsetY);
            }
            
            const x2 = to.x - Math.cos(angle) * offset;
            const y2 = to.y - Math.sin(angle) * offset;
            
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                className="edge-animated"
                x1={from.x} y1={from.y}
                x2={x2}   y2={y2}
                stroke={edge.color}
                strokeWidth={isRisk ? 2 : 1.5}
                opacity={hovered === edge.to || hovered === edge.from ? 1 : 0.7}
                markerEnd="url(#arrowV)"
                style={{ transition: "opacity 0.2s" }}
              />
            );
          })}

          {/* Regular nodes */}
          {NODES.filter((n) => n.id !== "center").map((node) => {
            const s = NODE_COLOR_MAP[node.id] || NODE_STYLES[node.type] || NODE_STYLES.platform;
            const isRisk = node.id === "risk";
            const isHov  = hovered === node.id;
            return (
              <g
                key={node.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => handleMouseEnter(node, e)}
                onMouseMove={(e)  => handleMouseMove(node, e)}
                onMouseLeave={handleMouseLeave}
                filter={isRisk ? "url(#riskGlow)" : undefined}
              >
                <rect
                  x={node.x - (isRisk ? 92 : 56)}
                  y={node.y - 22}
                  width={isRisk ? 184 : 112}
                  height={isRisk ? 44 : 40}
                  rx={10}
                  fill={s.fill}
                  stroke={s.stroke}
                  strokeWidth={isRisk ? 2 : 1.5}
                  opacity={isHov ? 1 : 0.9}
                  style={{ transition: "opacity 0.2s" }}
                />
                <text
                  x={node.x} y={node.y + (isRisk ? -5 : 5)}
                  textAnchor="middle"
                  fill={s.text}
                  fontSize={isRisk ? 11 : 12}
                  fontWeight={isRisk ? 600 : 500}
                >
                  {node.label}
                </text>
                {isRisk && (
                  <text x={node.x} y={node.y + 12} textAnchor="middle" fill="#f87171" fontSize={9}>
                    {node.sub}
                  </text>
                )}
              </g>
            );
          })}

          {/* Center identity node */}
          <g filter="url(#glowFilter)" style={{ cursor: "pointer" }}>
            <circle cx={334} cy={212} r={52} fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth={2}/>
            <circle cx={334} cy={212} r={44} fill="url(#centerGrad)" opacity={0.9}/>
            <text x={334} y={208} textAnchor="middle" fill="white" fontSize={14} fontWeight={600}>Bliss</text>
            <text x={334} y={225} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={9}>Primary Identity</text>
            <circle
              className="center-ring"
              cx={334} cy={212} r={52}
              fill="none"
              stroke="#a78bfa"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          </g>
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div style={{
            position: "absolute",
            left: tooltip.x, top: tooltip.y,
            zIndex: 99, pointerEvents: "none",
            background: "rgba(15,23,42,0.92)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "8px 12px",
            fontSize: 11, color: "#e2e8f0",
            backdropFilter: "blur(8px)",
            maxWidth: 180,
          }}>
            <div style={{ fontWeight: 600, color: "#f1f5f9", marginBottom: 3, fontSize: 12 }}>
              {tooltip.title}
            </div>
            <div style={{ color: "#94a3b8", lineHeight: 1.4 }}>
              {tooltip.sub}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}