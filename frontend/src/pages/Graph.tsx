import { useState, useRef } from "react";
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
  }, // Main Identity

  email1: {
    color: "#7C4DFF",
    emissive: "#651FFF",
  },

  email2: {
    color: "#B388FF",
    emissive: "#7C4DFF",
  }, // Emails

  phone1: {
    color: "#00E676",
    emissive: "#00C853",
  }, // Phone

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
  }, // Platforms

  risk: {
    color: "#FF1744",
    emissive: "#D50000",
  }, // Risk
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
          emissiveIntensity={isHovered ? 1 : 0.}
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
        </div>

        {/* Header */}
        <div style={{
          position: "relative", zIndex: 10,
          padding: "20px 24px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(15,23,42,0.8)",
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
            LinkSys Graph 3D
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
            3D visualization of accounts, recovery methods and risks
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
          position: "relative", zIndex: 10,
          display: "flex", gap: 16, padding: "8px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          fontSize: 11,
          background: "rgba(15,23,42,0.4)",
          backdropFilter: "blur(8px)",
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

        {/* 3D Canvas */}
        <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
          <Canvas
            style={{ width: "100%", height: "100%" }}
            camera={{ position: [0, 0, 8], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
          >
            <color attach="background" args={["#05070d"]} />
            <Graph3DContent hoveredNode={hoveredNode} onHover={setHoveredNode} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}