import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Environment, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { Suspense } from "react";

function TreeCrown() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.5, 0]}>
      {/* Main Crown Volume - Abstract Glassy Shapes */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]} scale={1.2}>
          <dodecahedronGeometry args={[1.2, 0]} />
          <meshPhysicalMaterial 
            color="#10b981" // Emerald-500
            roughness={0.1}
            metalness={0.1}
            transmission={0.6}
            thickness={2}
            ior={1.5}
            clearcoat={1}
          />
        </mesh>
      </Float>

      {/* Floating surrounding crystals */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 1.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <Float key={i} speed={1.5} rotationIntensity={1} floatIntensity={1} position={[x, Math.sin(i) * 0.5, z]}>
            <mesh scale={0.4}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial 
                color="#34d399" // Emerald-400
                emissive="#059669"
                emissiveIntensity={0.5}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
          </Float>
        );
      })}
      
      <Sparkles count={30} scale={4} size={4} speed={0.4} opacity={0.5} color="#6ee7b7" />
    </group>
  );
}

function TreeTrunk() {
  return (
    <mesh position={[0, -1, 0]}>
      <cylinderGeometry args={[0.2, 0.4, 3, 8]} />
      <meshStandardMaterial 
        color="#78350f" // Amber-900
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}

function FloatingParticles() {
  return (
    <group>
       {[...Array(15)].map((_, i) => (
         <Float key={i} speed={0.5} rotationIntensity={0.5} floatIntensity={2} position={[
           (Math.random() - 0.5) * 6,
           (Math.random() - 0.5) * 6,
           (Math.random() - 0.5) * 4
         ]}>
           <mesh scale={Math.random() * 0.1 + 0.05}>
             <sphereGeometry args={[1, 16, 16]} />
             <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
           </mesh>
         </Float>
       ))}
    </group>
  )
}

export function TreeVisualization() {
  return (
    <div className="relative w-full h-[300px] lg:h-[500px] flex items-center justify-center">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
        
        <Suspense fallback={null}>
          <group position={[0, -0.5, 0]}>
            <TreeTrunk />
            <TreeCrown />
            <FloatingParticles />
          </group>

          <Environment preset="forest" />
        </Suspense>
      </Canvas>
    </div>
  );
}