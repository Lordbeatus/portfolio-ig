"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function ReactorCore() {
  const core = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) ring1.current.rotation.z = t * 0.4;
    if (ring2.current) ring2.current.rotation.z = -t * 0.25;
    if (ring3.current) ring3.current.rotation.z = t * 0.15;
    if (core.current) {
      const s = 1 + Math.sin(t * 2.2) * 0.06;
      core.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      {/* glowing core */}
      <mesh ref={core}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#bdf3ff" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.72, 32, 32]} />
        <meshBasicMaterial color="#00d8ff" transparent opacity={0.35} />
      </mesh>
      {/* coil rings */}
      <mesh ref={ring1}>
        <torusGeometry args={[1.05, 0.05, 12, 64]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#00d8ff" emissiveIntensity={1.4} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2.4, 0.4, 0]}>
        <torusGeometry args={[1.45, 0.035, 12, 72]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.9} />
      </mesh>
      <mesh ref={ring3} rotation={[Math.PI / 1.8, -0.5, 0]}>
        <torusGeometry args={[1.85, 0.025, 12, 80]} />
        <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={1} transparent opacity={0.85} />
      </mesh>
      <pointLight color="#00d8ff" intensity={30} distance={12} />
    </group>
  );
}

export default function ArcReactor() {
  return (
    <div className="absolute inset-0 -z-0" aria-hidden>
      <Canvas camera={{ position: [0, 0, 5.2], fov: 55 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <Stars radius={40} depth={20} count={2200} factor={3} fade speed={0.6} />
        <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.9}>
          <ReactorCore />
        </Float>
      </Canvas>
      {/* HUD grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,216,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,216,255,.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}
