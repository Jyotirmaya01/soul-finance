import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { useRef, useMemo, useState, useCallback } from "react";
import * as THREE from "three";
import { Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import confetti from "canvas-confetti";

// Mouse position context for interaction
const mouse = { x: 0, y: 0 };

function CrystalLeaf({ 
  position, 
  scale, 
  color, 
  speed = 1,
  onClick 
}: { 
  position: [number, number, number]; 
  scale: number; 
  color: string; 
  speed?: number;
  onClick?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      // Subtle mouse follow effect
      const targetX = mouse.x * 0.3;
      const targetY = mouse.y * 0.3;
      meshRef.current.position.x = position[0] + targetX * scale;
      meshRef.current.position.y = position[1] + targetY * scale;
      
      // Hover scale effect
      const targetScale = hovered ? scale * 1.3 : scale;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        0.1
      );
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={1.5}>
      <mesh 
        ref={meshRef} 
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          color={hovered ? "#ffffff" : color}
          roughness={0.05}
          metalness={0.2}
          transmission={0.7}
          thickness={1.5}
          ior={1.7}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={hovered ? color : color}
          emissiveIntensity={hovered ? 0.8 : 0.2}
        />
      </mesh>
    </Float>
  );
}

function TreeCrown({ growth, onCrystalClick }: { growth: number; onCrystalClick?: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Slow rotation for the whole crown
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2;
      
      // Mouse influence on rotation
      groupRef.current.rotation.x = mouse.y * 0.1;
      groupRef.current.rotation.z = mouse.x * 0.05;
      
      // Smoothly interpolate scale based on growth prop
      const targetScale = Math.max(0, (growth - 0.3) * 1.45);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  // Generate crystal positions in a spiral/spherical pattern
  const crystals = useMemo(() => {
    const items = [];
    const count = 18;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < count; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const r = 1.8 + Math.random() * 0.5;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) + 1.5;
      const z = r * Math.cos(phi);
      
      const color = i % 2 === 0 ? "#10b981" : (i % 3 === 0 ? "#3b82f6" : "#34d399");
      
      items.push({
        position: [x, y, z] as [number, number, number],
        scale: 0.3 + Math.random() * 0.4,
        color,
        speed: 1 + Math.random()
      });
    }
    return items;
  }, []);

  return (
    <group ref={groupRef} scale={[0, 0, 0]}>
      {/* Core glowing energy - clickable */}
      <mesh 
        position={[0, 1.5, 0]} 
        scale={1.2}
        onClick={onCrystalClick}
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          color="#6ee7b7"
          roughness={0.2}
          metalness={0.1}
          transmission={0.8}
          thickness={3}
          ior={1.4}
          opacity={0.6}
          transparent
        />
      </mesh>
      
      {/* Floating Crystals */}
      {crystals.map((crystal, i) => (
        <CrystalLeaf 
          key={i} 
          {...crystal} 
          onClick={onCrystalClick}
        />
      ))}
      
      {/* Magical particles rising */}
      <Sparkles 
        count={40} 
        scale={5} 
        size={3} 
        speed={0.8} 
        opacity={0.6} 
        color="#a7f3d0" 
        position={[0, 1, 0]}
      />
    </group>
  );
}

function StylizedTrunk({ growth }: { growth: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const targetScaleY = Math.min(1, growth * 1.6);
      const targetScaleXZ = Math.min(1, growth * 2);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScaleXZ, targetScaleY, targetScaleXZ), 0.1);
      
      // Subtle mouse sway
      groupRef.current.rotation.z = mouse.x * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]} scale={[0, 0, 0]}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.4, 3.5, 6]} />
        <meshStandardMaterial color="#064e3b" roughness={0.4} metalness={0.6} />
      </mesh>
      
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.3, 0.02, 16, 32]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 8, 0, 0]}>
        <torusGeometry args={[0.45, 0.03, 16, 32]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// Mouse tracker component
function MouseTracker() {
  const { viewport } = useThree();
  
  useFrame((state) => {
    // Update global mouse position normalized to viewport
    mouse.x = (state.pointer.x / viewport.width) * 2;
    mouse.y = (state.pointer.y / viewport.height) * 2;
  });
  
  return null;
}

// Celebration effect
function triggerCelebration() {
  const colors = ["#10b981", "#3b82f6", "#34d399", "#6ee7b7", "#a7f3d0"];
  
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: colors,
  });
  
  // Second burst
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: colors,
    });
  }, 100);
  
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: colors,
    });
  }, 200);
}

export function TreeVisualization({ progress = 100 }: { progress?: number }) {
  const isMobile = useIsMobile();
  const normalizedGrowth = Math.min(100, Math.max(0, progress)) / 100;
  const [clickCount, setClickCount] = useState(0);

  const handleCrystalClick = useCallback(() => {
    setClickCount(prev => prev + 1);
    triggerCelebration();
  }, []);

  return (
    <div className="relative w-full h-[350px] lg:h-[500px] flex items-center justify-center">
      {/* Interaction hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-xs text-muted-foreground bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full">
        ✨ Click crystals to celebrate! ({clickCount} clicks)
      </div>
      
      <Canvas dpr={[1, 2]}>
        <MouseTracker />
        <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 10 : 8]} fov={45} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-10, -5, -10]} intensity={1} color="#3b82f6" />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#10b981" />
        
        <Suspense fallback={null}>
          <group position={[0, -0.5, 0]} scale={isMobile ? 0.85 : 1}>
            <StylizedTrunk growth={normalizedGrowth} />
            <TreeCrown growth={normalizedGrowth} onCrystalClick={handleCrystalClick} />
          </group>
          
          <ContactShadows opacity={0.4} scale={10} blur={2.5} far={4} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}