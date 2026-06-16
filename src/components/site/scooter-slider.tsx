'use client';

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Gauge, Battery, Clock, Cpu } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   MODEL DATA
   ═══════════════════════════════════════════════════════════════════ */

const models = [
  {
    id: '450x-gen3',
    name: 'Ather 450X Gen 3',
    tagline: 'The Flagship Performance Scooter',
    price: '₹1,89,999',
    topSpeed: '90 km/h',
    range: '150 km',
    chargingTime: '3.3 hrs',
    motorPower: '6.2 kW',
    color: '#00FF88',
    accentColor: '#00CC6A',
    features: ['7" Touchscreen', 'Google Maps', 'Warp Mode', '4G Connectivity'],
    badge: 'FLAGSHIP',
  },
  {
    id: '450s',
    name: 'Ather 450S',
    tagline: 'Smart Performance, Accessible Price',
    price: '₹1,39,999',
    topSpeed: '80 km/h',
    range: '115 km',
    chargingTime: '4.5 hrs',
    motorPower: '4.3 kW',
    color: '#00E5FF',
    accentColor: '#0099CC',
    features: ['Ride Statistics', 'Bluetooth', 'Over-the-air Updates', 'Regenerative Braking'],
    badge: 'POPULAR',
  },
  {
    id: 'rizta',
    name: 'Ather Rizta',
    tagline: 'Designed for the Family',
    price: '₹1,09,999',
    topSpeed: '70 km/h',
    range: '125 km',
    chargingTime: '5.2 hrs',
    motorPower: '3.5 kW',
    color: '#FFD700',
    accentColor: '#CC9900',
    features: ['Extra Storage', 'Comfortable Seat', 'Ride Modes', 'Smart Key'],
    badge: 'NEW',
  },
];

/* ═══════════════════════════════════════════════════════════════════
   DYNAMIC SCOOTER — Abstract 3D EV Scooter from primitives
   ═══════════════════════════════════════════════════════════════════ */

function DynamicScooter({
  color,
  accentColor,
  isActive,
  index,
  activeIndex,
}: {
  color: string;
  accentColor: string;
  isActive: boolean;
  index: number;
  activeIndex: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  /* ── Materials (memoized per scooter instance) ── */
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

  const glowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 2,
        toneMapped: false,
      }),
    [color]
  );

  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accentColor,
        emissive: accentColor,
        emissiveIntensity: 1.5,
        toneMapped: false,
      }),
    [accentColor]
  );

  const batteryMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6,
        toneMapped: false,
      }),
    [color]
  );

  const tailLightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#FF3333',
        emissive: '#FF3333',
        emissiveIntensity: 3,
        toneMapped: false,
      }),
    []
  );

  /* ── Calculate target position based on active state ── */
  const offset = index - activeIndex;
  const targetX = -offset * 3.2;
  const targetScale = isActive ? 1.0 : 0.75;
  const targetOpacity = isActive ? 1 : 0.4;

  useFrame(() => {
    if (!groupRef.current) return;

    // Lerp position
    const pos = groupRef.current.position;
    pos.x = THREE.MathUtils.lerp(pos.x, targetX, 0.06);
    pos.y = THREE.MathUtils.lerp(pos.y, isActive ? 0.2 : -0.1, 0.06);

    // Lerp scale
    const s = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(s, targetScale, 0.06);
    groupRef.current.scale.setScalar(newScale);

    // Auto-rotate
    groupRef.current.rotation.y += isActive ? 0.005 : 0.001;

    // Mouse follow (only when active)
    if (isActive) {
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
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0,
        0.04
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        0,
        0.04
      );
    }

  });

  return (
    <group ref={groupRef} position={[targetX, 0.2, 0]}>
      {/* ── Main body — sleek elongated deck ── */}
      <mesh position={[0, 0.35, 0]} material={bodyMat}>
        <boxGeometry args={[0.7, 0.18, 2.2]} />
      </mesh>

      {/* ── Front fairing — tapered nose ── */}
      <mesh position={[0, 0.4, 0.95]} material={darkMat}>
        <boxGeometry args={[0.5, 0.28, 0.65]} />
      </mesh>

      {/* Front fairing top cap */}
      <mesh position={[0, 0.55, 1.05]} material={bodyMat}>
        <boxGeometry args={[0.42, 0.04, 0.35]} />
      </mesh>

      {/* ── Rear body panel ── */}
      <mesh position={[0, 0.38, -0.7]} material={darkMat}>
        <boxGeometry args={[0.6, 0.2, 0.8]} />
      </mesh>

      {/* Rear panel top edge */}
      <mesh position={[0, 0.5, -0.75]} material={bodyMat}>
        <boxGeometry args={[0.52, 0.04, 0.6]} />
      </mesh>

      {/* ── Seat ── */}
      <mesh position={[0, 0.53, -0.25]} material={bodyMat}>
        <boxGeometry args={[0.34, 0.06, 0.85]} />
      </mesh>

      {/* Seat cushion (slightly wider/rounded) */}
      <mesh position={[0, 0.57, -0.25]} material={darkMat}>
        <boxGeometry args={[0.3, 0.035, 0.7]} />
      </mesh>

      {/* ── Steering column ── */}
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
      <mesh position={[-0.32, 1.12, 0.95]} material={glowMat}>
        <sphereGeometry args={[0.04, 12, 12]} />
      </mesh>
      <mesh position={[0.32, 1.12, 0.95]} material={glowMat}>
        <sphereGeometry args={[0.04, 12, 12]} />
      </mesh>

      {/* ── Dashboard / instrument cluster — glowing display ── */}
      <mesh position={[0, 0.85, 1.1]} material={glowMat}>
        <boxGeometry args={[0.28, 0.06, 0.04]} />
      </mesh>

      {/* Dashboard bezel */}
      <mesh position={[0, 0.85, 1.08]} material={chromeMat}>
        <boxGeometry args={[0.32, 0.09, 0.02]} />
      </mesh>

      {/* ── Battery pack — translucent glow underneath ── */}
      <mesh position={[0, 0.12, 0.05]} material={batteryMat}>
        <boxGeometry args={[0.52, 0.1, 1.3]} />
      </mesh>

      {/* Battery underglow light */}
      {isActive && (
        <pointLight
          position={[0, 0.05, 0.05]}
          color={color}
          intensity={1.5}
          distance={3}
          decay={2}
        />
      )}

      {/* ── Front wheel — torus + hub ── */}
      <mesh
        position={[0, 0, 1.25]}
        rotation={[Math.PI / 2, 0, 0]}
        material={chromeMat}
      >
        <torusGeometry args={[0.26, 0.055, 10, 28]} />
      </mesh>
      <mesh position={[0, 0, 1.25]} material={glowMat}>
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
      <mesh position={[0, 0, -1.05]} material={glowMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.11, 12]} />
      </mesh>

      {/* ── Front fork ── */}
      <mesh
        position={[0, 0.45, 1.12]}
        rotation={[0.12, 0, 0]}
        material={chromeMat}
      >
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
      </mesh>

      {/* Front fork secondary */}
      <mesh
        position={[0.06, 0.46, 1.12]}
        rotation={[0.12, 0, 0]}
        material={chromeMat}
      >
        <cylinderGeometry args={[0.015, 0.015, 0.65, 8]} />
      </mesh>

      {/* ── Rear suspension arm ── */}
      <mesh
        position={[0, 0.15, -0.85]}
        rotation={[0.05, 0, 0]}
        material={chromeMat}
      >
        <cylinderGeometry args={[0.018, 0.018, 0.5, 8]} />
      </mesh>

      {/* ── Neon accent lines on both sides ── */}
      {/* Left side running light */}
      <mesh position={[0.36, 0.36, 0.15]} material={accentMat}>
        <boxGeometry args={[0.008, 0.008, 1.3]} />
      </mesh>
      {/* Right side running light */}
      <mesh position={[-0.36, 0.36, 0.15]} material={accentMat}>
        <boxGeometry args={[0.008, 0.008, 1.3]} />
      </mesh>
      {/* Front accent bar */}
      <mesh position={[0, 0.36, 0.85]} material={accentMat}>
        <boxGeometry args={[0.72, 0.008, 0.015]} />
      </mesh>
      {/* Rear accent bar */}
      <mesh position={[0, 0.3, -0.85]} material={glowMat}>
        <boxGeometry args={[0.72, 0.008, 0.015]} />
      </mesh>

      {/* ── Tail light ── */}
      <mesh position={[0, 0.42, -1.1]} material={tailLightMat}>
        <boxGeometry args={[0.12, 0.025, 0.015]} />
      </mesh>

      {/* Tail light bar extension */}
      <mesh position={[0, 0.42, -1.1]} material={tailLightMat}>
        <boxGeometry args={[0.45, 0.015, 0.015]} />
      </mesh>

      {/* ── Headlight — point light ── */}
      <pointLight
        position={[0, 0.55, 1.5]}
        color={color}
        intensity={isActive ? 5 : 1}
        distance={8}
        decay={2}
      />

      {/* Headlight mesh */}
      <mesh position={[0, 0.52, 1.28]} material={glowMat}>
        <boxGeometry args={[0.2, 0.05, 0.02]} />
      </mesh>

      {/* ── Foot peg area ── */}
      <mesh position={[0.2, 0.27, 0.2]} material={darkMat}>
        <boxGeometry args={[0.15, 0.02, 0.3]} />
      </mesh>
      <mesh position={[-0.2, 0.27, 0.2]} material={darkMat}>
        <boxGeometry args={[0.15, 0.02, 0.3]} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE — Lighting, Stars, Grid, All 3 Scooters
   ═══════════════════════════════════════════════════════════════════ */

function Scene({ activeIndex }: { activeIndex: number }) {
  const activeColor = models[activeIndex].color;

  return (
    <>
      <color attach="background" args={['#050816']} />
      <fog attach="fog" args={['#050816', 10, 45]} />
      <ambientLight intensity={0.15} />

      <Stars
        radius={100}
        depth={60}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0.6}
      />

      <Grid
        position={[0, -0.3, 0]}
        cellSize={0.6}
        cellThickness={0.4}
        cellColor={activeColor}
        sectionSize={3}
        sectionThickness={1.2}
        sectionColor={activeColor}
        fadeDistance={30}
        fadeStrength={1.5}
        infiniteGrid
      />

      {/* All 3 scooters in the scene */}
      {models.map((model, i) => (
        <DynamicScooter
          key={model.id}
          color={model.color}
          accentColor={model.accentColor}
          isActive={i === activeIndex}
          index={i}
          activeIndex={activeIndex}
        />
      ))}

      {/* Scene accent lights */}
      <pointLight
        position={[4, 4, 3]}
        color={activeColor}
        intensity={1.2}
        distance={15}
        decay={2}
      />
      <pointLight
        position={[-4, 3, -2]}
        color={models[(activeIndex + 1) % 3].color}
        intensity={0.6}
        distance={12}
        decay={2}
      />
      <pointLight
        position={[0, 6, -4]}
        color="#ffffff"
        intensity={0.3}
        distance={20}
        decay={2}
      />

      <Environment preset="night" />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════════ */

const infoVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const pillVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
};

const specCard = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

const badgeColors: Record<string, string> = {
  FLAGSHIP: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  POPULAR: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
  NEW: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
};

/* ═══════════════════════════════════════════════════════════════════
   SPEC ICON HELPER
   ═══════════════════════════════════════════════════════════════════ */

function SpecIcon({ type, color }: { type: string; color: string }) {
  const props = { size: 16, color, strokeWidth: 2 };
  switch (type) {
    case 'speed':
      return <Gauge {...props} />;
    case 'range':
      return <Zap {...props} />;
    case 'charging':
      return <Clock {...props} />;
    case 'motor':
      return <Cpu {...props} />;
    case 'battery':
      return <Battery {...props} />;
    default:
      return <Zap {...props} />;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPORT — ScooterSlider
   ═══════════════════════════════════════════════════════════════════ */

export function ScooterSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const activeModel = models[activeIndex];

  const goTo = useCallback(
    (newIndex: number) => {
      setDirection(newIndex > activeIndex ? 1 : -1);
      setActiveIndex(newIndex);
    },
    [activeIndex]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % models.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + models.length) % models.length);
  }, []);

  return (
    <section
      id="models"
      className="relative w-full min-h-[800px] md:min-h-[900px] overflow-hidden bg-midnight"
    >
      {/* ── 3D Canvas — absolute fill ── */}
      <div className="absolute inset-0" style={{ touchAction: 'none' }}>
        <Canvas
          camera={{ position: [5, 3, 5], fov: 38 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <Scene activeIndex={activeIndex} />
        </Canvas>
      </div>

      {/* ── Gradient overlays for readability ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050816] via-transparent to-[#050816]/50 pointer-events-none z-[5]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-[#050816]/40 pointer-events-none z-[5]" />

      {/* ══════════════════════════════════════════════════════════════
          UI OVERLAY
          ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col w-full h-full min-h-[800px] md:min-h-[900px]">
        {/* ── Section Title (top, centered) ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="glass-card-static px-6 py-3 md:px-8 md:py-4 text-center">
            <h2 className="text-lg md:text-xl font-bold text-premium-silver tracking-wide">
              Explore Our Lineup
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Choose Your Electric Ride
            </p>
          </div>
        </motion.div>

        {/* ── Left Arrow Button ── */}
        <motion.button
          onClick={goPrev}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-14 md:h-14 rounded-full glass-card-static flex items-center justify-center cursor-pointer group hover:scale-110 transition-transform duration-200"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous model"
        >
          <ChevronLeft
            size={22}
            className="text-premium-silver group-hover:text-white transition-colors md:w-6 md:h-6"
          />
        </motion.button>

        {/* ── Right Arrow Button ── */}
        <motion.button
          onClick={goNext}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-14 md:h-14 rounded-full glass-card-static flex items-center justify-center cursor-pointer group hover:scale-110 transition-transform duration-200"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next model"
        >
          <ChevronRight
            size={22}
            className="text-premium-silver group-hover:text-white transition-colors md:w-6 md:h-6"
          />
        </motion.button>

        {/* ── Left Info Panel (desktop: absolute, mobile: bottom) ── */}
        <div className="hidden md:block absolute left-10 lg:left-16 xl:left-20 top-1/2 -translate-y-1/2 z-20 w-[380px] lg:w-[420px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeModel.id}
              custom={direction}
              variants={infoVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Badge */}
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-widest border mb-4 ${badgeColors[activeModel.badge] || 'bg-white/10 text-white border-white/20'}`}
              >
                {activeModel.badge}
              </div>

              {/* Model name */}
              <h3 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight gradient-text-green">
                {activeModel.name}
              </h3>

              {/* Tagline */}
              <p className="mt-2 text-base text-premium-silver/70">
                {activeModel.tagline}
              </p>

              {/* Price */}
              <motion.p
                className="mt-4 text-3xl lg:text-4xl font-black text-neon-green neon-text-green"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {activeModel.price}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ex-showroom
                </span>
              </motion.p>

              {/* Specs Grid */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { label: 'Top Speed', value: activeModel.topSpeed, type: 'speed' },
                  { label: 'Range', value: activeModel.range, type: 'range' },
                  { label: 'Charging', value: activeModel.chargingTime, type: 'charging' },
                  { label: 'Motor', value: activeModel.motorPower, type: 'motor' },
                ].map((spec, i) => (
                  <motion.div
                    key={spec.label}
                    custom={i}
                    variants={specCard}
                    initial="hidden"
                    animate="visible"
                    className="glass-card-static p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <SpecIcon type={spec.type} color={activeModel.color} />
                      <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                        {spec.label}
                      </span>
                    </div>
                    <span
                      className="text-lg font-bold"
                      style={{ color: activeModel.color }}
                    >
                      {spec.value}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Features pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                {activeModel.features.map((feature, i) => (
                  <motion.span
                    key={feature}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + i * 0.06, duration: 0.3 }}
                    className="glass-card-static px-3 py-1.5 rounded-full text-xs font-medium text-premium-silver flex items-center gap-1.5"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{ backgroundColor: activeModel.color }}
                    />
                    {feature}
                  </motion.span>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                className="btn-neon-green mt-6 w-full text-sm cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                Configure &amp; Book Now
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Mobile Info Panel (visible only on mobile) ── */}
        <div className="md:hidden mt-auto z-20 px-4 pb-24">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeModel.id}
              custom={direction}
              variants={infoVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-center"
            >
              {/* Badge */}
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border mb-2 ${badgeColors[activeModel.badge] || 'bg-white/10 text-white border-white/20'}`}
              >
                {activeModel.badge}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight gradient-text-green">
                {activeModel.name}
              </h3>
              <p className="mt-1 text-sm text-premium-silver/70">
                {activeModel.tagline}
              </p>

              <p className="mt-3 text-3xl font-black text-neon-green neon-text-green">
                {activeModel.price}
              </p>

              {/* Specs — horizontal scroll on mobile */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { label: 'Speed', value: activeModel.topSpeed, type: 'speed' },
                  { label: 'Range', value: activeModel.range, type: 'range' },
                  { label: 'Charge', value: activeModel.chargingTime, type: 'charging' },
                  { label: 'Motor', value: activeModel.motorPower, type: 'motor' },
                ].map((spec) => (
                  <div
                    key={spec.label}
                    className="glass-card-static p-2.5 rounded-lg min-w-[100px] flex-shrink-0"
                  >
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <SpecIcon type={spec.type} color={activeModel.color} />
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {spec.label}
                      </span>
                    </div>
                    <span
                      className="text-base font-bold block"
                      style={{ color: activeModel.color }}
                    >
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Features — compact pills */}
              <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                {activeModel.features.map((feature) => (
                  <span
                    key={feature}
                    className="glass-card-static px-2.5 py-1 rounded-full text-[10px] font-medium text-premium-silver flex items-center gap-1"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{ backgroundColor: activeModel.color }}
                    />
                    {feature}
                  </span>
                ))}
              </div>

              <button className="btn-neon-green mt-4 w-full text-sm cursor-pointer">
                Configure &amp; Book Now
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom Selector Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="glass-card-static p-2 md:p-2.5 flex gap-2 md:gap-3 items-center rounded-full">
            {models.map((model, i) => {
              const isActive = i === activeIndex;
              return (
                <motion.button
                  key={model.id}
                  onClick={() => goTo(i)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full
                    text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer
                    ${
                      isActive
                        ? 'bg-white/10 shadow-lg'
                        : 'hover:bg-white/5'
                    }
                  `}
                  style={
                    isActive
                      ? {
                          boxShadow: `0 0 20px ${model.color}33, 0 0 40px ${model.color}11, inset 0 0 20px ${model.color}11`,
                        }
                      : undefined
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Select ${model.name}`}
                >
                  {/* Active glow border */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBorder"
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        border: `1.5px solid ${model.color}88`,
                        boxShadow: `0 0 12px ${model.color}44`,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Color dot */}
                  <span
                    className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: model.color,
                      boxShadow: isActive ? `0 0 8px ${model.color}` : 'none',
                    }}
                  />

                  {/* Model name */}
                  <span
                    className={isActive ? 'text-white' : 'text-premium-silver/70'}
                  >
                    {model.name.replace('Ather ', '')}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}