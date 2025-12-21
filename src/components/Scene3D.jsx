import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Minimal Floating Ring - Apple Style
function FloatingRing({ position, radius, color, speed }) {
    const ringRef = useRef();

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Gentle floating
        ringRef.current.position.y = position[1] + Math.sin(time * speed) * 0.3;

        // Slow rotation
        ringRef.current.rotation.x = time * 0.1;
        ringRef.current.rotation.y = time * 0.15;
    });

    return (
        <mesh ref={ringRef} position={position}>
            <torusGeometry args={[radius, 0.05, 16, 100]} />
            <meshStandardMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
                transparent
                opacity={0.4}
            />
        </mesh>
    );
}

// Minimal Sphere - Subtle and Clean
function MinimalSphere({ position, scale, color }) {
    const sphereRef = useRef();

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Very subtle movement
        sphereRef.current.position.y = position[1] + Math.sin(time * 0.4) * 0.2;
        sphereRef.current.position.x = position[0] + Math.cos(time * 0.3) * 0.15;
    });

    return (
        <mesh ref={sphereRef} position={position} scale={scale}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
                color={color}
                metalness={0.3}
                roughness={0.7}
                transparent
                opacity={0.25}
            />
        </mesh>
    );
}

// Ambient Light Orb - Very Subtle
function AmbientOrb({ position, color, intensity }) {
    return (
        <mesh position={position}>
            <sphereGeometry args={[3, 32, 32]} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={intensity}
            />
        </mesh>
    );
}

// Main Scene - Apple Minimalist Style
export default function Scene3D() {
    return (
        <div className="canvas-container">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                gl={{ alpha: true, antialias: true }}
            >
                {/* Soft Lighting - Apple Style */}
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 5, 5]} intensity={0.4} color="#F4B4A4" />
                <directionalLight position={[-5, -5, -5]} intensity={0.2} color="#CD8B76" />

                {/* Large Ambient Orbs - Very Subtle Background */}
                <AmbientOrb position={[-8, 4, -20]} color="#F4B4A4" intensity={0.08} />
                <AmbientOrb position={[10, -3, -25]} color="#CD8B76" intensity={0.06} />
                <AmbientOrb position={[0, 8, -22]} color="#F5E6D3" intensity={0.05} />

                {/* Minimal Floating Rings */}
                <FloatingRing position={[-3, 2, -5]} radius={1.5} color="#CD8B76" speed={0.5} />
                <FloatingRing position={[4, -1, -7]} radius={1.2} color="#F4B4A4" speed={0.6} />

                {/* Subtle Spheres */}
                <MinimalSphere position={[-5, 1, -8]} scale={1.5} color="#F4B4A4" />
                <MinimalSphere position={[6, 2, -10]} scale={1.2} color="#CD8B76" />
                <MinimalSphere position={[0, -2, -6]} scale={1} color="#F5E6D3" />
            </Canvas>
        </div>
    );
}
