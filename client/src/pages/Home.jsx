import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

// A simple abstract 3D component representing a "document" or "resume"
function DocumentNode(props) {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group {...props} dispose={null}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          castShadow
          receiveShadow
        >
          {/* Abstract Resume Paper Shape */}
          <boxGeometry args={[3, 4, 0.2]} />
          <meshStandardMaterial 
            color={hovered ? '#06B6D4' : '#4F46E5'} 
            roughness={0.1}
            metalness={0.8}
            envMapIntensity={2}
          />
          
          {/* Decorative lines on the document */}
          <mesh position={[0, 1.2, 0.11]}>
            <boxGeometry args={[2, 0.2, 0.05]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0.7, 0.11]}>
            <boxGeometry args={[2, 0.1, 0.05]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[-0.2, 0.4, 0.11]}>
            <boxGeometry args={[1.6, 0.1, 0.05]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
          </mesh>
        </mesh>
      </Float>
    </group>
  );
}

export default function Home() {
  const { user } = useStore();
  const [isLoaded, setIsLoaded] = useState(false);

  // Delay the 3D mount slightly to avoid conflicts with page transitions
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[90vh] flex flex-col md:flex-row items-center justify-center container mx-auto px-4 py-12">
      
      {/* Left Content Area */}
      <motion.div 
        className="flex-1 space-y-8 z-10 text-center md:text-left mt-10 md:mt-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Unlock Your <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-purple-400 animate-gradient-x">
            True Potential
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto md:mx-0 leading-relaxed">
          CVSense uses advanced ATS logic to analyze your resume against real job descriptions. 
          Discover missing skills, optimize your keywords, and land your dream job faster.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
          <Link to="/upload" className="btn-primary text-lg px-8 py-4">
            {user ? 'Go to Tracker' : 'Start Free Analysis'}
          </Link>
          {!user && (
            <Link to="/login" className="px-8 py-4 rounded-lg font-semibold border border-white/20 hover:bg-white/5 transition-colors text-white text-lg flex items-center justify-center">
              Sign In
            </Link>
          )}
        </div>
      </motion.div>

      {/* Right 3D Canvas Area */}
      <motion.div 
        className="flex-1 w-full h-[500px] md:h-[700px] relative z-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <Suspense fallback={<div className="flex items-center justify-center w-full h-full text-white/50">Loading 3D Engine...</div>}>
          {isLoaded && (
            <Canvas 
              flat
              shadows
              dpr={[1, 2]} 
              camera={{ position: [0, 0, 8], fov: 45 }}
              gl={{ 
                antialias: true, 
                alpha: true,
                powerPreference: "high-performance",
                outputColorSpace: THREE.SRGBColorSpace
              }}
            >
              <ambientLight intensity={1} />
              <spotLight position={[10, 10, 10]} intensity={2} penumbra={1} castShadow />
              <pointLight position={[-10, -10, -10]} intensity={1} />
              
              <PresentationControls
                global
                config={{ mass: 2, tension: 500 }}
                snap={{ mass: 4, tension: 1500 }}
                rotation={[0, -0.3, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI / 1.4, Math.PI / 2]}
              >
                <DocumentNode position={[0, 0, 0]} />
              </PresentationControls>

              <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
              <Environment preset="night" />
            </Canvas>
          )}
        </Suspense>
      </motion.div>

    </div>
  );
}
