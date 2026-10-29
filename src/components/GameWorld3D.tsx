"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const stops = [
  { id: "ai", name: "AI LAB", color: "#a8e6cf", position: [-3.1, 0.55, -1.5] as [number, number, number] },
  { id: "vision", name: "VISION STUDIO", color: "#b9b0ff", position: [0, 0.55, -2.3] as [number, number, number] },
  { id: "mythos", name: "MYTHOS WORKSHOP", color: "#ffd18b", position: [3.05, 0.55, -1.2] as [number, number, number] },
  { id: "quant", name: "QUANT ARCADE", color: "#8ddcff", position: [1.9, 0.55, 2.1] as [number, number, number] },
  { id: "studio", name: "BUILD STUDIO", color: "#f3a6cf", position: [-2.1, 0.55, 2.1] as [number, number, number] },
];

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <group position={position} scale={scale}>
    <mesh position={[0, 0.35, 0]} castShadow><cylinderGeometry args={[0.08, 0.12, 0.7, 7]} /><meshStandardMaterial color="#80644d" roughness={0.9} /></mesh>
    <mesh position={[0, 0.92, 0]} castShadow><coneGeometry args={[0.48, 1.15, 7]} /><meshStandardMaterial color="#4f8e75" roughness={0.95} /></mesh>
    <mesh position={[0, 1.35, 0]} castShadow><coneGeometry args={[0.34, 0.88, 7]} /><meshStandardMaterial color="#77b993" roughness={0.95} /></mesh>
  </group>;
}

function ProjectStop({ stop, active, onClick }: { stop: typeof stops[number]; active: boolean; onClick: () => void }) {
  return <group position={stop.position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
    <Float speed={active ? 2.2 : 1.1} rotationIntensity={0.04} floatIntensity={active ? 0.12 : 0.04}>
      <mesh position={[0, 0.72, 0]} castShadow>
        <dodecahedronGeometry args={[0.47, 0]} />
        <meshStandardMaterial color={stop.color} roughness={0.28} metalness={0.12} emissive={stop.color} emissiveIntensity={active ? 0.4 : 0.08} />
      </mesh>
      <mesh position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.64, 0.025, 8, 40]} />
        <meshBasicMaterial color={stop.color} transparent opacity={active ? 0.95 : 0.5} />
      </mesh>
    </Float>
    <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.64, 0.72, 0.24, 8]} />
      <meshStandardMaterial color={active ? "#435b60" : "#34474e"} roughness={0.65} metalness={0.15} />
    </mesh>
    <mesh position={[0, 0.26, 0]}>
      <cylinderGeometry args={[0.52, 0.52, 0.035, 8]} />
      <meshStandardMaterial color={stop.color} emissive={stop.color} emissiveIntensity={active ? 1.3 : 0.45} />
    </mesh>
  </group>;
}

function World() {
  const [active, setActive] = useState("vision");
  return <>
    <color attach="background" args={["#101a23"]} />
    <fog attach="fog" args={["#101a23", 13, 28]} />
    <ambientLight intensity={1.35} />
    <directionalLight position={[-5, 9, 5]} intensity={2.2} color="#fff0d7" castShadow shadow-mapSize={[1024, 1024]} />
    <pointLight position={[0, 4, -3]} intensity={18} distance={12} color="#76e5d4" />
    <mesh position={[0, -0.36, 0]} receiveShadow castShadow>
      <cylinderGeometry args={[5.9, 6.2, 0.65, 8]} />
      <meshStandardMaterial color="#34494a" roughness={0.92} />
    </mesh>
    <mesh position={[0, -0.02, 0]} receiveShadow>
      <cylinderGeometry args={[5.65, 5.65, 0.12, 8]} />
      <meshStandardMaterial color="#6f8b79" roughness={1} />
    </mesh>
    <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[5.3, 8]} />
      <meshStandardMaterial color="#b5b18d" roughness={1} />
    </mesh>
    {/* A clear, readable stone path through the level */}
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0, 0.08, 2.8 - i * 0.83]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[0.27, 6]} />
      <meshStandardMaterial color={i % 2 ? "#d4c9a7" : "#e2d8b8"} roughness={0.95} />
    </mesh>)}
    {stops.map((stop) => <ProjectStop key={stop.id} stop={stop} active={active === stop.id} onClick={() => setActive(stop.id)} />)}
    <Tree position={[-4.2, 0.03, -2.8]} scale={0.85} />
    <Tree position={[-4.25, 0.03, 0.4]} scale={0.72} />
    <Tree position={[4.25, 0.03, -2.5]} scale={0.9} />
    <Tree position={[4.1, 0.03, 1.1]} scale={0.78} />
    <Tree position={[-0.1, 0.03, 4.15]} scale={0.68} />
    {/* Landmark gateway at the back of the island */}
    <group position={[0, 0.05, -4.05]}>
      <mesh position={[-0.82, 0.82, 0]} castShadow><boxGeometry args={[0.22, 1.65, 0.25]} /><meshStandardMaterial color="#475e61" roughness={0.45} metalness={0.25} /></mesh>
      <mesh position={[0.82, 0.82, 0]} castShadow><boxGeometry args={[0.22, 1.65, 0.25]} /><meshStandardMaterial color="#475e61" roughness={0.45} metalness={0.25} /></mesh>
      <mesh position={[0, 1.65, 0]} castShadow><boxGeometry args={[1.86, 0.22, 0.25]} /><meshStandardMaterial color="#d7b477" roughness={0.35} metalness={0.3} emissive="#d7b477" emissiveIntensity={0.1} /></mesh>
      <mesh position={[0, 0.86, -0.01]}><planeGeometry args={[1.4, 1.45]} /><meshBasicMaterial color="#6fe3d3" transparent opacity={0.22} side={THREE.DoubleSide} /></mesh>
    </group>
    <ContactShadows position={[0, -0.01, 0]} opacity={0.34} scale={14} blur={2.4} far={6} />
    <OrbitControls makeDefault enablePan={false} minDistance={10} maxDistance={17} minPolarAngle={0.55} maxPolarAngle={1.2} autoRotate autoRotateSpeed={0.3} />
  </>;
}

export default function GameWorld3D() {
  return <div className="game-world-canvas" aria-label="Interactive low-poly portfolio world">
    <Canvas shadows camera={{ position: [9, 8, 11], fov: 36 }} dpr={[1, 1.5]}>
      <World />
    </Canvas>
    <div className="world-hint"><span className="hint-dot" /> DRAG TO ORBIT <span>·</span> SCROLL TO ZOOM</div>
  </div>;
}
