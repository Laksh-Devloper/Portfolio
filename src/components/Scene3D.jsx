import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Battlefield Embers (Rising Fire Particles) ──
function Embers({ count = 2000 }) {
  const mesh = useRef();
  const dummy = new THREE.Object3D();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 40;
        const y = (Math.random() - 0.5) * 20 - 10;
        const z = (Math.random() - 0.5) * 40;
        
        // Random drift and rise speed
        temp.push({ 
            x, y, z, 
            speed: Math.random() * 0.05 + 0.02,
            driftX: (Math.random() - 0.5) * 0.02,
            driftZ: (Math.random() - 0.5) * 0.02,
            scale: Math.random() * 0.5 + 0.5
        });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    particles.forEach((particle, i) => {
      // Particles rise up like floating embers in a fire
      particle.y += particle.speed;
      particle.x += Math.sin(time + i) * particle.driftX;
      particle.z += Math.cos(time + i) * particle.driftZ;
      
      // Reset if they go too high
      if (particle.y > 10) {
        particle.y = -10;
      }

      dummy.position.set(particle.x, particle.y, particle.z);
      
      // Pulsing scale based on time and index for flickering effect
      const currentScale = particle.scale * (Math.sin(time * 3 + i) * 0.2 + 0.8);
      dummy.scale.setScalar(currentScale);
      
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <planeGeometry args={[0.08, 0.08]} />
      {/* Intense glowing fire color */}
      <meshBasicMaterial color="#ff5500" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

// ── Smoke Particles (Slow floating dark clouds) ──
function Smoke({ count = 100 }) {
    const mesh = useRef();
    const dummy = new THREE.Object3D();
  
    const particles = useMemo(() => {
      const temp = [];
      for (let i = 0; i < count; i++) {
          const x = (Math.random() - 0.5) * 50;
          const y = (Math.random() - 0.5) * 30;
          const z = (Math.random() - 0.5) * 20 - 5;
          temp.push({ x, y, z, rotOffset: Math.random() * Math.PI, speed: Math.random() * 0.005 + 0.001 });
      }
      return temp;
    }, [count]);
  
    useFrame((state) => {
      particles.forEach((particle, i) => {
        particle.x += particle.speed;
        if (particle.x > 25) particle.x = -25;
        
        dummy.position.set(particle.x, particle.y, particle.z);
        dummy.rotation.z = particle.rotOffset + state.clock.getElapsedTime() * 0.1;
        dummy.scale.setScalar(10);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
      });
      mesh.current.instanceMatrix.needsUpdate = true;
    });
  
    return (
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#1a1c20" transparent opacity={0.1} depthWrite={false} />
      </instancedMesh>
    );
  }

// ── Distant Artillery Flashes ──
function ArtilleryFlashes() {
  const flash1 = useRef();
  const flash2 = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Simulate chaotic gunfire/explosions
    flash1.current.intensity = Math.pow(Math.sin(time * 12 + Math.sin(time * 3)), 8) * 5;
    flash2.current.intensity = Math.pow(Math.cos(time * 8 + Math.cos(time * 5)), 6) * 4;
  });

  return (
    <group>
      <pointLight ref={flash1} position={[-15, -5, -10]} color="#ffaa00" distance={30} decay={2} />
      <pointLight ref={flash2} position={[20, -2, -15]} color="#ff3300" distance={40} decay={2} />
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="canvas-container" style={{ opacity: 0.6 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Dense heavy battle fog */}
        <fog attach="fog" args={['#0a0b0d', 2, 25]} />
        
        <ambientLight intensity={0.1} />
        
        <ArtilleryFlashes />
        <Smoke count={150} />
        <Embers count={2500} />
      </Canvas>
      
      {/* Vignette & Grime Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(circle at 50% 50%, transparent 20%, #0a0b0d 95%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
