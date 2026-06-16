'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useInView, animate } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   PARTICLE GROUP — InstancedMesh for high-performance rendering
   ═══════════════════════════════════════════════════════════════════ */

function ParticleGroup({
  count,
  color,
}: {
  count: number;
  color: string;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          Math.random() * 14 - 2,
          (Math.random() - 0.5) * 30
        ),
        speed: 0.1 + Math.random() * 0.28,
        offset: Math.random() * Math.PI * 2,
        scale: 0.012 + Math.random() * 0.038,
      })),
    [count]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      dummy.position.set(
        p.pos.x + Math.sin(t * p.speed + p.offset) * 1.2,
        p.pos.y + Math.sin(t * p.speed * 0.5 + p.offset) * 0.6,
        p.pos.z + Math.cos(t * p.speed * 0.35 + p.offset) * 1.2
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        transparent
        opacity={0.75}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function Particles() {
  return (
    <>
      <ParticleGroup count={120} color="#00FF88" />
      <ParticleGroup count={80} color="#00E5FF" />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FUTURISTIC EV SCOOTER — Abstract 3D silhouette
   ═══════════════════════════════════════════════════════════════════ */

function ScooterModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.004;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.12,
      0.04
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -pointer.x * 0.08,
      0.04
    );
  });

  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0A0E27',
        metalness: 0.92,
        roughness: 0.08,
      }),
    []
  );
  const darkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#151833',
        metalness: 0.9,
        roughness: 0.1,
      }),
    []
  );
  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#333344',
        metalness: 0.98,
        roughness: 0.02,
      }),
    []
  );
  const greenGlow = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00FF88',
        emissive: '#00FF88',
        emissiveIntensity: 2,
        toneMapped: false,
      }),
    []
  );
  const cyanGlow = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00E5FF',
        emissive: '#00E5FF',
        emissiveIntensity: 1.5,
        toneMapped: false,
      }),
    []
  );
  const batteryMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00FF88',
        emissive: '#00FF88',
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6,
        toneMapped: false,
      }),
    []
  );

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      {/* ── Main body — sleek elongated deck ── */}
      <mesh position={[0, 0.35, 0]} material={bodyMat}>
        <boxGeometry args={[0.7, 0.18, 2.2]} />
      </mesh>

      {/* Front fairing — tapered nose */}
      <mesh position={[0, 0.4, 0.95]} material={darkMat}>
        <boxGeometry args={[0.5, 0.28, 0.65]} />
      </mesh>

      {/* Rear body panel */}
      <mesh position={[0, 0.38, -0.7]} material={darkMat}>
        <boxGeometry args={[0.6, 0.2, 0.8]} />
      </mesh>

      {/* Seat */}
      <mesh position={[0, 0.53, -0.25]} material={bodyMat}>
        <boxGeometry args={[0.34, 0.06, 0.85]} />
      </mesh>

      {/* ── Stem / steering column ── */}
      <mesh
        position={[0, 0.75, 0.95]}
        rotation={[0.12, 0, 0]}
        material={chromeMat}
      >
        <cylinderGeometry args={[0.035, 0.04, 0.65, 12]} />
      </mesh>

      {/* ── Handlebar — horizontal bar ── */}
      <mesh
        position={[0, 1.12, 0.95]}
        rotation={[0, 0, Math.PI / 2]}
        material={chromeMat}
      >
        <cylinderGeometry args={[0.022, 0.022, 0.65, 12]} />
      </mesh>

      {/* Handlebar end grips — glowing spheres */}
      <mesh position={[-0.32, 1.12, 0.95]} material={greenGlow}>
        <sphereGeometry args={[0.04, 12, 12]} />
      </mesh>
      <mesh position={[0.32, 1.12, 0.95]} material={greenGlow}>
        <sphereGeometry args={[0.04, 12, 12]} />
      </mesh>

      {/* Dashboard / instrument cluster */}
      <mesh position={[0, 0.85, 1.1]} material={cyanGlow}>
        <boxGeometry args={[0.28, 0.06, 0.04]} />
      </mesh>

      {/* ── Battery pack — glowing underneath ── */}
      <mesh position={[0, 0.12, 0.05]} material={batteryMat}>
        <boxGeometry args={[0.52, 0.1, 1.3]} />
      </mesh>

      {/* ── Front wheel — torus + hub ── */}
      <mesh
        position={[0, 0, 1.25]}
        rotation={[Math.PI / 2, 0, 0]}
        material={chromeMat}
      >
        <torusGeometry args={[0.26, 0.055, 10, 28]} />
      </mesh>
      <mesh position={[0, 0, 1.25]} material={cyanGlow}>
        <cylinderGeometry args={[0.04, 0.04, 0.11, 12]} />
      </mesh>

      {/* ── Rear wheel — torus + hub ── */}
      <mesh
        position={[0, 0, -1.05]}
        rotation={[Math.PI / 2, 0, 0]}
        material={chromeMat}
      >
        <torusGeometry args={[0.26, 0.055, 10, 28]} />
      </mesh>
      <mesh position={[0, 0, -1.05]} material={cyanGlow}>
        <cylinderGeometry args={[0.04, 0.04, 0.11, 12]} />
      </mesh>

      {/* Front fork */}
      <mesh
        position={[0, 0.45, 1.12]}
        rotation={[0.12, 0, 0]}
        material={chromeMat}
      >
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
      </mesh>

      {/* ── Neon accent lines ── */}
      {/* Left side */}
      <mesh position={[0.36, 0.36, 0.15]} material={cyanGlow}>
        <boxGeometry args={[0.008, 0.008, 1.3]} />
      </mesh>
      {/* Right side */}
      <mesh position={[-0.36, 0.36, 0.15]} material={cyanGlow}>
        <boxGeometry args={[0.008, 0.008, 1.3]} />
      </mesh>
      {/* Rear accent */}
      <mesh position={[0, 0.3, -0.85]} material={greenGlow}>
        <boxGeometry args={[0.72, 0.008, 0.015]} />
      </mesh>

      {/* Tail light */}
      <mesh position={[0, 0.42, -1.1]}>
        <boxGeometry args={[0.12, 0.025, 0.015]} />
        <meshStandardMaterial
          color="#FF3333"
          emissive="#FF3333"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* ── Headlight — bright point light ── */}
      <pointLight
        position={[0, 0.55, 1.5]}
        color="#00FF88"
        intensity={4}
        distance={8}
        decay={2}
      />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   3D SCENE — Environment, lighting, grid, particles, scooter
   ═══════════════════════════════════════════════════════════════════ */

function Scene() {
  return (
    <>
      <color attach="background" args={['#050816']} />
      <fog attach="fog" args={['#050816', 8, 38]} />
      <ambientLight intensity={0.15} />

      <Stars
        radius={100}
        depth={60}
        count={4000}
        factor={4}
        saturation={0}
        fade
        speed={0.8}
      />

      {/* Tron-like grid floor */}
      <Grid
        position={[0, -0.3, 0]}
        cellSize={0.6}
        cellThickness={0.4}
        cellColor="#00FF88"
        sectionSize={3}
        sectionThickness={1.2}
        sectionColor="#00FF88"
        fadeDistance={28}
        fadeStrength={1.5}
        infiniteGrid
      />

      <Particles />
      <ScooterModel />

      {/* Scene accent lights */}
      <pointLight
        position={[3, 4, 3]}
        color="#00FF88"
        intensity={1.5}
        distance={15}
        decay={2}
      />
      <pointLight
        position={[-3, 3, -2]}
        color="#00E5FF"
        intensity={0.8}
        distance={12}
        decay={2}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ANIMATED COUNTER — framer-motion useInView + countUp
   ═══════════════════════════════════════════════════════════════════ */

function AnimatedCounter({
  target,
  prefix = '',
  suffix = '',
}: {
  target: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration: 2.5,
      ease: 'easeOut',
      onUpdate: (value: number) => setDisplay(Math.floor(value)),
    });
    return () => controls.stop();
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HERO 3D SECTION — Canvas + Overlay UI
   ═══════════════════════════════════════════════════════════════════ */

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function Hero3D() {
  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-midnight">
      {/* 3D Canvas — absolute fill */}
      <div className="absolute inset-0" style={{ touchAction: 'none' }}>
        <Canvas
          camera={{ position: [4.5, 2.8, 4.5], fov: 40 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Gradient overlay — dark from bottom, transparent top */}
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-transparent pointer-events-none" />

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-8 md:pb-16 px-4">
        {/* Hero text + buttons */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10 md:mb-16"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight gradient-text-green"
          >
            Experience the Future
            <br />
            of Electric Riding
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-premium-silver/80 max-w-2xl leading-relaxed"
          >
            Patna&apos;s #1 Ather Energy Dealer. Test ride the 450X, 450S
            &amp; Rizta today.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-8"
          >
            <button
              className="btn-neon-green text-sm sm:text-base cursor-pointer"
              onClick={() =>
                document
                  .querySelector('#test-ride')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Book Test Ride
            </button>
            <button
              className="btn-glass text-sm sm:text-base cursor-pointer"
              onClick={() =>
                document
                  .querySelector('#models')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore Models
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator flex flex-col items-center gap-2 cursor-pointer"
          onClick={() =>
            document
              .querySelector('#models')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <ChevronDown className="text-white/40 w-5 h-5" />
          <span className="text-white/30 text-xs tracking-widest uppercase">
            Scroll to explore
          </span>
        </motion.div>
      </div>
    </section>
  );
}