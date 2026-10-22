"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { profile, type GarageStation, type StationId } from "@/data/profile";

interface CameraRigProps {
  activeStation: StationId;
  zoomDistance: number;
  orbitYawOffset: number;
}

function CameraRig({ activeStation, zoomDistance, orbitYawOffset }: CameraRigProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const targetPos = useRef(new THREE.Vector3(0, 5.2, 10.5));
  const targetLook = useRef(new THREE.Vector3(0, 1.2, -0.5));
  const transitioning = useRef(true);

  useEffect(() => {
    transitioning.current = true;
    const t = setTimeout(() => {
      transitioning.current = false;
    }, 1400);
    return () => clearTimeout(t);
  }, [activeStation]);

  useFrame((_, delta) => {
    const st = profile.stations.find((s) => s.id === activeStation);
    if (st) {
      const baseCam = new THREE.Vector3(...st.cameraPos);
      const look = new THREE.Vector3(...st.lookAt);
      const offset = baseCam.clone().sub(look);
      offset.multiplyScalar(zoomDistance / 10.5);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), orbitYawOffset);
      targetPos.current.copy(look).add(offset);
      targetLook.current.copy(look);
    } else {
      const look = new THREE.Vector3(0, 1.2, -0.6);
      const offset = new THREE.Vector3(0, 4.4 * (zoomDistance / 10.5), zoomDistance);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), orbitYawOffset);
      targetPos.current.copy(look).add(offset);
      targetLook.current.copy(look);
    }

    const damp = transitioning.current ? Math.min(1, delta * 3.8) : Math.min(1, delta * 2.2);
    if (transitioning.current || Math.abs(orbitYawOffset) > 0.001 || Math.abs(zoomDistance - 10.5) > 0.05) {
      camera.position.lerp(targetPos.current, damp);
    }
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook.current, Math.min(1, delta * 4.5));
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.07}
      minDistance={2.2}
      maxDistance={18}
      maxPolarAngle={Math.PI / 2 - 0.04}
      minPolarAngle={0.18}
    />
  );
}

function ReactorStationMesh({ active }: { active: boolean }) {
  const core = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) ring1.current.rotation.z = t * 0.7;
    if (ring2.current) ring2.current.rotation.x = -t * 0.45;
    if (ring3.current) ring3.current.rotation.y = t * 0.35;
    if (core.current) {
      core.current.scale.setScalar(1 + Math.sin(t * 2.8) * 0.08);
    }
  });

  return (
    <group>
      {/* Pedestal base */}
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[1.05, 1.35, 0.35, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.76, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 1.02, 48]} />
        <meshBasicMaterial color="#00d8ff" side={THREE.DoubleSide} />
      </mesh>

      {/* Floating Arc Reactor */}
      <Float speed={2} rotationIntensity={0.25} floatIntensity={0.45}>
        <mesh ref={core}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshBasicMaterial color="#e0faff" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.52, 32, 32]} />
          <meshBasicMaterial color="#00d8ff" transparent opacity={active ? 0.5 : 0.3} />
        </mesh>
        <mesh ref={ring1}>
          <torusGeometry args={[0.78, 0.04, 16, 64]} />
          <meshStandardMaterial color="#38bdf8" emissive="#00d8ff" emissiveIntensity={active ? 2.2 : 1.4} />
        </mesh>
        <mesh ref={ring2} rotation={[Math.PI / 3, 0.3, 0]}>
          <torusGeometry args={[1.05, 0.028, 16, 64]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.2} />
        </mesh>
        <mesh ref={ring3} rotation={[-Math.PI / 4, 0.6, 0]}>
          <torusGeometry args={[1.28, 0.02, 16, 64]} />
          <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={1.1} />
        </mesh>
      </Float>
      <pointLight color="#00d8ff" intensity={active ? 28 : 16} distance={8} />
    </group>
  );
}

function GauntletStationMesh({ active }: { active: boolean }) {
  const handRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (handRef.current) {
      handRef.current.rotation.y = Math.sin(t * 0.9) * 0.45;
      handRef.current.position.y = Math.sin(t * 1.8) * 0.08;
    }
    if (pulseRef.current) {
      pulseRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.15);
    }
  });

  return (
    <group>
      {/* Pedestal */}
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[0.85, 1.05, 0.4, 24]} />
        <meshStandardMaterial color="#1e1b4b" metalness={0.8} roughness={0.25} />
      </mesh>
      <group ref={handRef}>
        {/* Forearm gauntlet */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.26, 0.32, 0.65, 16]} />
          <meshStandardMaterial color="#7f1d1d" metalness={0.85} roughness={0.2} emissive="#a855f7" emissiveIntensity={active ? 0.35 : 0.12} />
        </mesh>
        {/* Palm */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.48, 0.42, 0.16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.18} />
        </mesh>
        {/* Repulsor node */}
        <mesh ref={pulseRef} position={[0, 0.12, 0.1]}>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshBasicMaterial color="#e9d5ff" />
        </mesh>
        {/* 5 articulated fingers */}
        {[-0.2, -0.1, 0, 0.1, 0.2].map((x, idx) => (
          <mesh
            key={idx}
            position={[x, idx === 0 ? 0.18 : 0.48, idx === 0 ? 0.06 : 0]}
            rotation={[0, 0, idx === 0 ? 0.45 : 0]}
          >
            <capsuleGeometry args={[0.04, idx === 0 ? 0.18 : 0.28, 8, 8]} />
            <meshStandardMaterial color="#ef4444" metalness={0.8} roughness={0.25} />
          </mesh>
        ))}
        {/* CV scan ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
          <torusGeometry args={[0.68, 0.018, 12, 48]} />
          <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={1.6} />
        </mesh>
      </group>
      <pointLight color="#a855f7" intensity={active ? 20 : 10} distance={6} />
    </group>
  );
}

function HelmetStationMesh({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const waveRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.7) * 0.4 - 0.3;
    }
    if (waveRef.current) {
      waveRef.current.rotation.z = t * 0.8;
    }
  });

  return (
    <group>
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[0.85, 1.05, 0.4, 24]} />
        <meshStandardMaterial color="#27272a" metalness={0.85} roughness={0.2} />
      </mesh>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.35}>
        <group ref={groupRef}>
          {/* Helmet cranium */}
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.46, 28, 28]} />
            <meshStandardMaterial color="#991b1b" metalness={0.88} roughness={0.18} />
          </mesh>
          {/* Gold faceplate */}
          <mesh position={[0, 0.05, 0.16]}>
            <boxGeometry args={[0.56, 0.62, 0.45]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.15} />
          </mesh>
          {/* Glowing eyes */}
          <mesh position={[-0.14, 0.14, 0.4]}>
            <boxGeometry args={[0.16, 0.045, 0.04]} />
            <meshBasicMaterial color="#00d8ff" />
          </mesh>
          <mesh position={[0.14, 0.14, 0.4]}>
            <boxGeometry args={[0.16, 0.045, 0.04]} />
            <meshBasicMaterial color="#00d8ff" />
          </mesh>
          {/* Mythos Dream headphone earcups + arch */}
          <mesh position={[-0.5, 0.08, 0.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.14, 24]} />
            <meshStandardMaterial color="#0f172a" emissive="#f59e0b" emissiveIntensity={active ? 1.2 : 0.5} />
          </mesh>
          <mesh position={[0.5, 0.08, 0.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.14, 24]} />
            <meshStandardMaterial color="#0f172a" emissive="#f59e0b" emissiveIntensity={active ? 1.2 : 0.5} />
          </mesh>
          <mesh ref={waveRef} position={[0, 0.1, 0]}>
            <torusGeometry args={[0.82, 0.018, 12, 48]} />
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.5} />
          </mesh>
        </group>
      </Float>
      <pointLight color="#f59e0b" intensity={active ? 20 : 10} distance={6} />
    </group>
  );
}

function ServerRackMesh({ active }: { active: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.7;
    }
  });

  return (
    <group>
      {/* Main monolith rack */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.45, 2.3, 0.95]} />
        <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Glowing blade servers */}
      {[-0.8, -0.45, -0.1, 0.25, 0.6, 0.9].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0.49]}>
          <boxGeometry args={[1.2, 0.12, 0.04]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={active ? 2 : 1.1}
          />
        </mesh>
      ))}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.05, 0.02, 12, 48]} />
        <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={1.6} />
      </mesh>
      <pointLight color="#10b981" intensity={active ? 22 : 10} distance={6} />
    </group>
  );
}

function TradingTableMesh({ active }: { active: boolean }) {
  const barsRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (barsRef.current) {
      barsRef.current.children.forEach((child, i) => {
        const s = 0.5 + Math.abs(Math.sin(t * 2.2 + i * 0.7)) * 1.1;
        child.scale.y = s;
        child.position.y = (s * 0.45) / 2;
      });
    }
  });

  return (
    <group>
      {/* Holo table base */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[1.25, 0.9, 0.7, 32]} />
        <meshStandardMaterial color="#0c192c" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial color="#0284c7" emissive="#0ea5e9" emissiveIntensity={0.8} transparent opacity={0.65} />
      </mesh>
      {/* Holographic candlestick / quant bars */}
      <group ref={barsRef} position={[0, -0.15, 0]}>
        {[-0.6, -0.35, -0.1, 0.15, 0.4, 0.65].map((x, idx) => (
          <mesh key={idx} position={[x, 0.3, (idx % 2 === 0 ? -1 : 1) * 0.2]}>
            <boxGeometry args={[0.14, 0.55, 0.14]} />
            <meshStandardMaterial
              color={idx % 3 === 0 ? "#fbbf24" : "#38bdf8"}
              emissive={idx % 3 === 0 ? "#f59e0b" : "#00d8ff"}
              emissiveIntensity={active ? 2 : 1.2}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
      </group>
      <pointLight color="#38bdf8" intensity={active ? 22 : 11} distance={6} />
    </group>
  );
}

function WorkbenchMesh({ active }: { active: boolean }) {
  const holoRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (holoRef.current) {
      holoRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      holoRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.4) * 0.3;
    }
  });

  return (
    <group>
      {/* Heavy industrial desk */}
      <mesh position={[0, -0.45, 0]}>
        <boxGeometry args={[1.9, 0.75, 1.1]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Glowing schematic surface */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[1.75, 0.04, 0.95]} />
        <meshStandardMaterial color="#ec4899" emissive="#db2777" emissiveIntensity={active ? 1.4 : 0.7} />
      </mesh>
      {/* Floating Anki / EdTech polyhedron */}
      <mesh ref={holoRef} position={[0, 0.48, 0]}>
        <octahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial color="#f472b6" emissive="#ec4899" emissiveIntensity={1.6} wireframe />
      </mesh>
      <pointLight color="#ec4899" intensity={active ? 20 : 10} distance={6} />
    </group>
  );
}

function CommsMesh({ active }: { active: boolean }) {
  const dishRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (dishRef.current) {
      dishRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.6 - 0.4;
    }
  });

  return (
    <group>
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.7, 0.95, 0.9, 24]} />
        <meshStandardMaterial color="#1c1917" metalness={0.85} roughness={0.25} />
      </mesh>
      <group ref={dishRef} position={[0, 0.25, 0]}>
        <mesh rotation={[0.45, 0, 0]}>
          <torusGeometry args={[0.55, 0.035, 16, 48]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={active ? 2 : 1.2} />
        </mesh>
        <mesh rotation={[0.45, 0, 0]}>
          <torusGeometry args={[0.32, 0.025, 16, 36]} />
          <meshStandardMaterial color="#38bdf8" emissive="#00d8ff" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0, 0.15, 0.2]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>
      <pointLight color="#fbbf24" intensity={active ? 20 : 10} distance={6} />
    </group>
  );
}

function StationNode({
  station,
  active,
  onSelect,
}: {
  station: GarageStation;
  active: boolean;
  onSelect: (id: StationId) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={station.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(station.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {station.id === "reactor" && <ReactorStationMesh active={active || hovered} />}
      {station.id === "gauntlet" && <GauntletStationMesh active={active || hovered} />}
      {station.id === "helmet" && <HelmetStationMesh active={active || hovered} />}
      {station.id === "server" && <ServerRackMesh active={active || hovered} />}
      {station.id === "trading" && <TradingTableMesh active={active || hovered} />}
      {station.id === "workbench" && <WorkbenchMesh active={active || hovered} />}
      {station.id === "comms" && <CommsMesh active={active || hovered} />}

      {/* 3D Floating Holographic Label (chrisp.design-inspired interactive pin) */}
      <Html
        position={[0, 1.38, 0]}
        center
        distanceFactor={9}
        zIndexRange={[10, 0]}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(station.id);
          }}
          data-station-id={station.id}
          className={`group flex flex-col items-center transition-all duration-200 select-none ${
            active ? "scale-110" : "hover:scale-105"
          }`}
        >
          <div
            className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-wider whitespace-nowrap shadow-lg backdrop-blur-md transition-all"
            style={{
              borderColor: active || hovered ? station.color : "rgba(56, 189, 248, 0.35)",
              backgroundColor: active
                ? "rgba(8, 22, 42, 0.94)"
                : "rgba(5, 10, 22, 0.82)",
              color: "#f8fafc",
              boxShadow:
                active || hovered
                  ? `0 0 24px ${station.color}88`
                  : "0 4px 16px rgba(0,0,0,0.6)",
            }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: station.color }}
            />
            <span className="font-mono text-[10px] opacity-75">{station.code}</span>
            <span>{station.name}</span>
          </div>
          <div
            className="h-4 w-[1.5px]"
            style={{
              background: `linear-gradient(to bottom, ${station.color}, transparent)`,
            }}
          />
        </button>
      </Html>
    </group>
  );
}

function GarageEnvironment() {
  const ringGeom = useMemo(() => new THREE.RingGeometry(5.6, 5.68, 96), []);
  const outerRingGeom = useMemo(() => new THREE.RingGeometry(8.2, 8.26, 96), []);

  return (
    <group>
      {/* Reflective Garage Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#030712" metalness={0.85} roughness={0.28} />
      </mesh>

      {/* Architectural grid */}
      <gridHelper
        args={[36, 36, "#0ea5e9", "#0f172a"]}
        position={[0, 0.01, 0]}
      />

      {/* Glowing Stark Floor Rings */}
      <mesh geometry={ringGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -0.5]}>
        <meshBasicMaterial color="#00d8ff" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={outerRingGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -0.5]}>
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>

      {/* Malibu Workshop Structural Pillars */}
      {[
        [-8.5, 3, -6.5],
        [8.5, 3, -6.5],
        [-8.5, 3, 4.5],
        [8.5, 3, 4.5],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <boxGeometry args={[0.55, 6, 0.55]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[x < 0 ? 0.29 : -0.29, 0, 0]}>
            <boxGeometry args={[0.04, 5.4, 0.12]} />
            <meshBasicMaterial color="#00d8ff" />
          </mesh>
        </group>
      ))}

      {/* Back Hall of Armor Alcoves */}
      {[-5.5, -2.75, 0, 2.75, 5.5].map((x, idx) => (
        <group key={idx} position={[x, 2.1, -8.2]}>
          <mesh>
            <boxGeometry args={[2.1, 4.2, 0.4]} />
            <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.22]}>
            <planeGeometry args={[1.65, 3.6]} />
            <meshBasicMaterial
              color={idx === 2 ? "#fbbf24" : "#00d8ff"}
              transparent
              opacity={0.09}
            />
          </mesh>
          <mesh position={[0, 1.85, 0.23]}>
            <boxGeometry args={[1.5, 0.06, 0.04]} />
            <meshBasicMaterial color={idx === 2 ? "#fbbf24" : "#00d8ff"} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export interface StarkGarage3DProps {
  activeStation: StationId;
  onSelectStation: (id: StationId) => void;
  zoomDistance: number;
  orbitYawOffset: number;
}

export default function StarkGarage3D({
  activeStation,
  onSelectStation,
  zoomDistance,
  orbitYawOffset,
}: StarkGarage3DProps) {
  return (
    <div className="fixed inset-0 z-0 bg-[#030712]">
      <Canvas
        camera={{ position: [0, 5.2, 10.5], fov: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true }}
        onPointerMissed={() => {
          // Clicking empty floor returns to overview if user wants
        }}
      >
        <color attach="background" args={["#030712"]} />
        <fog attach="fog" args={["#030712", 12, 28]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[6, 12, 8]} intensity={1.3} color="#e0f2fe" />
        <directionalLight position={[-6, 8, -6]} intensity={0.7} color="#fef3c7" />
        <Stars radius={45} depth={25} count={2000} factor={3} fade speed={0.5} />

        <CameraRig
          activeStation={activeStation}
          zoomDistance={zoomDistance}
          orbitYawOffset={orbitYawOffset}
        />

        <GarageEnvironment />

        {profile.stations.map((st) => (
          <StationNode
            key={st.id}
            station={st}
            active={activeStation === st.id}
            onSelect={onSelectStation}
          />
        ))}
      </Canvas>

      {/* Subtle Stark HUD scanlines & vignette */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, transparent 45%, rgba(2,6,23,0.95) 100%)",
        }}
      />
    </div>
  );
}
