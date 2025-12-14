import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FloatingCrystal() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color="#8b5cf6"
          roughness={0.1}
          metalness={0.8}
          emissive="#4c1d95"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function FloatingCoins() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2} position={[3, 2, -2]}>
        <mesh rotation={[0.5, 0.5, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.2} />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={1.5} floatIntensity={1.5} position={[-3, -1, -1]}>
        <mesh rotation={[0.2, 0.2, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.08, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.2} />
        </mesh>
      </Float>
    </>
  );
}

export function HeroScene3D() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full opacity-60 dark:opacity-80">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        
        <FloatingCrystal />
        <FloatingCoins />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
