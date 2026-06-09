import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import Sidebar from "../components/Sidebar";

const NODES = [
  {
    id: "center",
    x: 0, y: 0, z: 0,
    type: "identity",
    label: "Bliss",
    sub: "Primary Identity",
  },
  {
    id: "email1",
    x: -3, y: 2, z: 2,
    type: "email",
    label: "Gmail",
    tooltip: "Primary email · 6 linked accounts · High risk",
  },
  {
    id: "email2",
    x: -3, y: 0, z: -2,
    type: "email",
    label: "sanika.work@",
    tooltip: "sanika.work@gmail.com · 3 linked accounts · Medium risk",
  },
  {
    id: "phone1",
    x: -3, y: -2, z: 2,
    type: "phone",
    label: "+91 XXXXXXXX21",
    tooltip: "+91 XXXXXXXX21 · 4 recovery accounts · Verified",
  },
  {
    id: "instagram",
    x: 3, y: 2, z: 1,
    type: "platform",
    label: "Instagram",
    tooltip: "Linked via email · Public profile",
  },
  {
    id: "linkedin",
    x: 3, y: 0, z: -1,
    type: "platform",
    label: "LinkedIn",
    tooltip: "Linked via work email · Professional",
  },
  {
    id: "github",
    x: 3, y: -2, z: 1,
    type: "platform",
    label: "GitHub",
    tooltip: "sanika_dev · 3 linked platforms",
  },
  {
    id: "risk",
    x: 0, y: -3.5, z: 0,
    type: "risk",
    label: "⚠ High Risk",
    sub: "Reused credentials",
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

const NODE_COLOR_MAP: Record<string, { color: string; emissive: string }> = {
  center: {
    color: "#00E5FF",
    emissive: "#00B8D4",
  },
  email1: {
    color: "#7C4DFF",
    emissive: "#651FFF",
  },
  email2: {
    color: "#B388FF",
    emissive: "#7C4DFF",
  },
  phone1: {
    color: "#00E676",
    emissive: "#00C853",
  },
  instagram: {
    color: "#FF4081",
    emissive: "#F50057",
  },
  linkedin: {
    color: "#448AFF",
    emissive: "#2962FF",
  },
  github: {
    color: "#64FFDA",
    emissive: "#1DE9B6",
  },
  risk: {
    color: "#FF1744",
    emissive: "#D50000",
  },
};

function getNodePos(id: string) {
  return NODES.find((n) => n.id === id);
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  } : { r: 1, g: 1, b: 1 };
}

function Node3D({ node, isHovered, onHover }: { node: any; isHovered: boolean; onHover: (id: string | null) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colorData = NODE_COLOR_MAP[node.id] || NODE_COLOR_MAP.center;
  const colorRgb = hexToRgb(colorData.color);
  const emissiveRgb = hexToRgb(colorData.emissive);
  const isCenter = node.id === "center";
  const radius = isCenter ? 0.5 : 0.35;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={[node.x, node.y, node.z]}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover(node.id)}
        onPointerLeave={() => onHover(null)}
        scale={isHovered ? 1.2 : 1}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhongMaterial
          color={new THREE.Color(colorRgb.r, colorRgb.g, colorRgb.b)}
          emissive={new THREE.Color(emissiveRgb.r, emissiveRgb.g, emissiveRgb.b)}
          emissiveIntensity={isHovered ? 1 : 0.2}
          wireframe={false}
        />
      </mesh>
      <Text
        position={[0, -1.2, 0.1]}
        fontSize={0.3}
        color={colorData.color}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
      >
        {node.label}
      </Text>
      {node.sub && (
        <Text
          position={[0, -1.5, 0.1]}
          fontSize={0.15}
          color={colorData.color}
          anchorX="center"
          anchorY="middle"
        >
          {node.sub}
        </Text>
      )}
    </group>
  );
}

function Edge3D({ from, to, color }: { from: any; to: any; color: string }) {
  const points = [
    new THREE.Vector3(from.x, from.y, from.z),
    new THREE.Vector3(to.x, to.y, to.z),
  ];
  const colorRgb = hexToRgb(color);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      new Float32Array(points.flatMap(p => [p.x, p.y, p.z])),
      3
    )
  );

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color={new THREE.Color(colorRgb.r, colorRgb.g, colorRgb.b)}
        linewidth={2}
        transparent
        opacity={0.6}
      />
    </lineSegments>
  );
}

function Graph3DContent({ hoveredNode, onHover }: { hoveredNode: string | null; onHover: (id: string | null) => void }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Edges */}
      {EDGES.map((edge) => {
        const fromNode = getNodePos(edge.from);
        const toNode = getNodePos(edge.to);
        if (!fromNode || !toNode) return null;
        return (
          <Edge3D key={`${edge.from}-${edge.to}`} from={fromNode} to={toNode} color={edge.color} />
        );
      })}

      {/* Nodes */}
      {NODES.map((node) => (
        <Node3D
          key={node.id}
          node={node}
          isHovered={hoveredNode === node.id}
          onHover={onHover}
        />
      ))}

      <OrbitControls autoRotate autoRotateSpeed={2} />
    </>
  );
}

export default function LinkSysGraph() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Safely grab selected active node metadata info to surface cleanly on the UI layer
  const activeNodeData = NODES.find(n => n.id === hoveredNode);

  return (
    <div className="min-h-screen w-full text-slate-200 antialiased font-sans bg-[#040508] flex relative selection:bg-cyan-500/20">
      
      {/* Immersive design system ambient layouts precisely aligned with dashboard blueprint */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.09),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.22] bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <Sidebar currentPath="/graph" />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen relative z-10">
        
        {/* Top Header Navigation (Dashboard Aligned) */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.02] bg-[#040508]/40 px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]" />
            <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase">Linksys Command Center</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group hidden sm:block">
              <span className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
              <input
                placeholder="Query system clusters..."
                className="w-56 rounded-xl border border-white/[0.04] bg-slate-950/20 py-1.5 pl-9 pr-4 text-xs text-slate-300 placeholder:text-slate-600 outline-none transition-all focus:border-slate-800"
              />
            </div>
            
            <button className="relative text-slate-500 hover:text-slate-300 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9m1.73 14a2.4 2.4 0 0 0 4.54 0"/></svg>
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

        {/* Core Layout Layer splitting workspace gracefully */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
          
          {/* LEFT SUB PANEL: Premium Supportive Content Metadata Info (Apple / Linear Inspired) */}
          <div className="w-full md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-white/[0.02] bg-[#040508]/40 backdrop-blur-md p-6 flex flex-col justify-between overflow-y-auto z-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-[9px] font-bold tracking-widest font-mono text-cyan-400 uppercase bg-cyan-500/5 border border-cyan-500/10 px-2.5 py-1 rounded-full w-fit">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="m10 15 5-3-5-3v6Z"/></svg>
                  Interactive Graph 3D
                </div>
                <h1 className="text-2xl font-light tracking-tight text-white leading-tight">
                  Identity Graph
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Three-dimensional volumetric exploration of structural dependencies, verified data endpoints, and cross-platform risk attributions.
                </p>
              </div>

              {/* Minimalist Micro Summary Status Blocks */}
              <div className="grid grid-cols-3 gap-2 font-mono">
                {[
                  { label: "Accounts", value: 8, color: "text-slate-200" },
                  { label: "Identities", value: 5, color: "text-slate-200" },
                  { label: "Risks", value: 3, color: "text-rose-400" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/5 bg-slate-950/40 p-2.5 shadow-sm text-center">
                    <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">{s.label}</span>
                    <span className={`text-base font-bold mt-0.5 block ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Live Relational Focus Node Inspector Card Component */}
              <div className="pt-4 border-t border-white/5">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-2">Cluster Inspector</span>
                <AnimatePresence mode="wait">
                  {activeNodeData ? (
                    <motion.div
                      key={activeNodeData.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="rounded-xl border border-white/5 bg-slate-950/20 p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: NODE_COLOR_MAP[activeNodeData.id]?.color || "#fff" }} />
                        <span className="text-xs font-bold text-white font-mono truncate">{activeNodeData.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal font-normal">
                        {activeNodeData.tooltip || activeNodeData.sub || "Discovered edge target parameters indexed."}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-white/5 p-4 text-center text-[11px] text-slate-600 font-normal">
                      Hover over any structural constellation node to inspect lineage dependencies.
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Supportive Elegant Legend Panel mapping categories neatly */}
            <div className="pt-6 border-t border-white/5 space-y-2 font-mono text-[9px]">
              <span className="block font-bold text-slate-500 uppercase tracking-widest mb-1">Matrix Index</span>
              {[
                { label: "Primary Identity", color: "#00E5FF" },
                { label: "Email Endpoints", color: "#7C4DFF" },
                { label: "Carrier Channels", color: "#00E676" },
                { label: "Platform Nodes", color: "#64FFDA" },
                { label: "Threat Anomalies", color: "#FF1744" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: l.color }} />
                  <span>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT VIEWPORT CONTAINER: The Hero 3D Canvas Canvas Space */}
          <div className="flex-1 h-full w-full relative bg-[#05070d]/20 overflow-hidden">
            <Canvas
              camera={{ position: [0, 0, 8], fov: 50 }}
              gl={{ alpha: true, antialias: true }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            >
              <color attach="background" args={["#05070d"]} />
              <Graph3DContent hoveredNode={hoveredNode} onHover={setHoveredNode} />
            </Canvas>

            {/* Micro Interaction Hint overlay anchor */}
            <div className="absolute bottom-6 right-6 pointer-events-none font-mono text-[9px] uppercase tracking-widest text-slate-600 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/5 backdrop-blur-sm shadow-md">
              Drag to Rotate • Scroll to Zoom
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}