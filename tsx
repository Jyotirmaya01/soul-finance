import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { HeroScene3D } from "@/components/HeroScene3D";
import { TreeVisualization } from "@/components/TreeVisualization";
import { ParallaxBackground } from "./ParallaxBackground";
import { AICoachWidget } from "./AICoachWidget";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, Stars, Sparkles } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

export function HeroScene3D() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full opacity-80 dark:opacity-90 pointer-events-none">
      <Canvas gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.5} penumbra={1} />
        
        <Suspense fallback={null}>
          <GlassCrystal />
          <FloatingElements />
          
          <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.4} color="#ffffff" />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function TreeVisualization() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
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