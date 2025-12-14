import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, Stars, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function GlassCrystal() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.2}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshPhysicalMaterial
          color="#8b5cf6" // Violet
          roughness={0.05}
          metalness={0.1}
          transmission={0.9} // Glass effect
          thickness={1.5}
          ior={1.6}
          clearcoat={1}
          attenuationColor="#4c1d95"
          attenuationDistance={0.5}
        />
      </mesh>
    </Float>
  );
}

function FloatingElements() {
  return (
    <>
      {/* Gold Coins / Tokens */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2} position={[3, 2, -2]}>
        <mesh rotation={[0.5, 0.5, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            metalness={0.9} 
            roughness={0.1} 
          />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={1.5} floatIntensity={1.5} position={[-3, -1, -1]}>
        <mesh rotation={[0.2, 0.2, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.08, 32]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            metalness={0.9} 
            roughness={0.1} 
          />
        </mesh>
      </Float>

      {/* Glass Shards */}
      <Float speed={1} rotationIntensity={2} floatIntensity={1} position={[-4, 3, -3]}>
        <mesh>
          <tetrahedronGeometry args={[0.5]} />
          <meshPhysicalMaterial
            color="#3b82f6"
            transmission={0.8}
            roughness={0.1}
            thickness={1}
          />
        </mesh>
      </Float>
      
      <Float speed={0.8} rotationIntensity={1} floatIntensity={1.5} position={[4, -2, -2]}>
        <mesh>
          <octahedronGeometry args={[0.6]} />
          <meshPhysicalMaterial
            color="#ec4899"
            transmission={0.8}
            roughness={0.1}
            thickness={1}
          />
        </mesh>
      </Float>
    </>
  );
}

export function HeroScene3D() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full opacity-80 dark:opacity-90 pointer-events-none">
      <Canvas gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.5} penumbra={1} />
        
        <GlassCrystal />
        <FloatingElements />
        
        <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.4} color="#ffffff" />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}