import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

function CrystalLeaf({ position, scale, color, speed = 1 }: { position: [number, number, number], scale: number, color: string, speed?: number }) {
  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={1.5} position={position}>
      <mesh scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          color={color}
          roughness={0.05}
          metalness={0.2}
          transmission={0.7} // Glass-like transmission
          thickness={1.5} // Refraction volume
          ior={1.7} // Index of refraction for crystal/gem look
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function TreeCrown({ growth }: { growth: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Slow rotation for the whole crown
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2;
      
      // Smoothly interpolate scale based on growth prop
      // Crown starts growing after trunk is 50% done (growth > 0.5)
      const targetScale = Math.max(0, (growth - 0.3) * 1.45); // 0.3 -> 1.0 maps to 0 -> 1 approx
      
      // Apply smooth lerp
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
      const y = r * Math.sin(phi) * Math.sin(theta) + 1.5; // Lift up
      const z = r * Math.cos(phi);
      
      // Color gradient from emerald to teal/blue
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
      {/* Core glowing energy */}
      <mesh position={[0, 1.5, 0]} scale={1.2}>
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
        <CrystalLeaf key={i} {...crystal} />
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
      // Trunk grows first: 0 -> 0.6 maps to 0 -> 1
      const targetScaleY = Math.min(1, growth * 1.6);
      const targetScaleXZ = Math.min(1, growth * 2); // Thicken faster
      
      groupRef.current.scale.lerp(new THREE.Vector3(targetScaleXZ, targetScaleY, targetScaleXZ), 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]} scale={[0, 0, 0]}>
      {/* Main trunk - stylized cone/cylinder */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.4, 3.5, 6]} />
        <meshStandardMaterial 
          color="#064e3b" // Dark emerald/forest green
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      
      {/* Spiral accent around trunk */}
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

export function TreeVisualization({ progress = 100 }: { progress?: number }) {
  const isMobile = useIsMobile();
  
  // Normalize progress to 0-1
  const normalizedGrowth = Math.min(100, Math.max(0, progress)) / 100;

  return (
    <div className="relative w-full h-[350px] lg:h-[500px] flex items-center justify-center">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 10 : 8]} fov={45} />
        
        {/* Lighting Setup for Glass */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-10, -5, -10]} intensity={1} color="#3b82f6" />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#10b981" />
        
        <Suspense fallback={null}>
          <group position={[0, -0.5, 0]} scale={isMobile ? 0.85 : 1}>
            <StylizedTrunk growth={normalizedGrowth} />
            <TreeCrown growth={normalizedGrowth} />
          </group>
          
          <ContactShadows opacity={0.4} scale={10} blur={2.5} far={4} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}