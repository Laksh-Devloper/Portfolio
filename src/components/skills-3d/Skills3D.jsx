import { useEffect, useRef, useState } from 'react';
import { Renderer, Camera, Transform, Texture, Program, Mesh } from 'ogl';
import { gsap } from '../../motion'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cylinderVertex, cylinderFragment, particleVertex, particleFragment } from './shaders';
import { createCylinderGeometry, createParticleGeometry } from './utils';
import Split from '../Split';

const LOGOS = {
  Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  JavaScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  React: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  Django: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg',
  FastAPI: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',
  Pandas: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg',
  NumPy: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg',
  'scikit-learn': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg',
  SQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg',
  Git: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  GitHub: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
  Jupyter: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jupyter/jupyter-original.svg',
};

const topTech = [
  { name: 'Python', icon: LOGOS.Python, desc: 'Backend & ML' },
  { name: 'JavaScript', icon: LOGOS.JavaScript, desc: 'Frontend Web' },
  { name: 'React', icon: LOGOS.React, desc: 'UI Library' },
  { name: 'Django', icon: LOGOS.Django, desc: 'Web Framework' },
  { name: 'FastAPI', icon: LOGOS.FastAPI, desc: 'API Framework' },
  { name: 'Pandas', icon: LOGOS.Pandas, desc: 'Data Analysis' },
  { name: 'NumPy', icon: LOGOS.NumPy, desc: 'Scientific Calc' },
  { name: 'scikit-learn', icon: LOGOS['scikit-learn'], desc: 'Machine Learning' },
  { name: 'SQL', icon: LOGOS.SQL, desc: 'Databases' },
  { name: 'Git', icon: LOGOS.Git, desc: 'Version Control' },
  { name: 'GitHub', icon: LOGOS.GitHub, desc: 'Code Hosting' },
  { name: 'Jupyter', icon: LOGOS.Jupyter, desc: 'Notebooks' },
];

const perspectives = [
  { title: 'My Toolkit', description: 'Languages & Frameworks' },
  { title: 'Full Stack', description: 'From database to UI' },
  { title: 'Machine Learning', description: 'Data & Intelligence' },
  { title: 'Agentic AI', description: 'Building the future' },
];

const cylinderConfig = {
  radius: 2.5,
  height: 2,
  radialSegments: 64,
  heightSegments: 1,
};

const particleConfig = {
  numParticles: 12,
  particleRadius: 3.3,
  segments: 20,
  angleSpan: 0.3,
};

export default function Skills3D() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const textRefs = useRef([]);
  const cylinderRef = useRef(null);
  const particlesRef = useRef([]);
  const cameraAnimRef = useRef({ x: 0, y: 0, z: 8 });
  const velocityRef = useRef(0);
  const lastRotationRef = useRef(0);
  const momentumRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // We do NOT use ScrollSmoother here because `motion.js` already sets up Lenis.
    // Instead we just hook into standard ScrollTrigger.
    
    const renderer = new Renderer({
      canvas: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    gl.disable(gl.CULL_FACE);

    const getDimensions = () => {
      const w = window.innerWidth;
      const isMobile = w < 768;
      const isTablet = w >= 768 && w < 1024;
      return {
        cylinderScale: isMobile ? 1.8 / cylinderConfig.radius : isTablet ? 2.2 / cylinderConfig.radius : 1,
        cameraZ: isMobile ? 6 : isTablet ? 7 : 8,
        fov: isMobile ? 50 : 45,
        isMobile
      };
    };

    let dims = getDimensions();
    const camera = new Camera(gl, { fov: dims.fov });
    if (dims.isMobile) camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.set(0, 0, dims.cameraZ);

    const scene = new Transform();
    const geometry = createCylinderGeometry(gl, cylinderConfig);

    // Build the dynamic texture using canvas 2D
    const texCanvas = document.createElement('canvas');
    const ctx = texCanvas.getContext('2d');
    
    const numCards = topTech.length;
    const cardWidth = 670; // 670 * 12 = 8040, matching the cylinder's ~7.85 aspect ratio
    const cardHeight = 1024;
    texCanvas.width = numCards * cardWidth;
    texCanvas.height = cardHeight;

    const texture = new Texture(gl, {
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      generateMipmaps: false,
    });

    // Draw dark polished background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, texCanvas.width, texCanvas.height);

    let loadedCount = 0;
    const images = topTech.map(tech => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = tech.icon;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === numCards) {
          // All images loaded, draw the layout
          // We draw the canvas naturally without flipping.
          // The cylinder geometry UVs have been updated to map it upright and left-to-right.
          
          topTech.forEach((t, i) => {
            const x = i * cardWidth;
            
            // Draw card background
            ctx.fillStyle = i % 2 === 0 ? '#111' : '#151515';
            ctx.fillRect(x, 0, cardWidth, cardHeight);

            // Draw subtle border
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 4;
            ctx.strokeRect(x, 0, cardWidth, cardHeight);

            // Draw icon
            const iconSize = 256;
            const ix = x + (cardWidth - iconSize) / 2;
            const iy = cardHeight / 2 - iconSize / 2 + 50; // offset upwards
            ctx.drawImage(images[i], ix, iy, iconSize, iconSize);

            // Draw text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 48px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(t.name, x + cardWidth / 2, iy - 60);

            ctx.fillStyle = '#888888';
            ctx.font = '32px sans-serif';
            ctx.fillText(t.desc, x + cardWidth / 2, iy - 10);
          });
          
          texture.image = texCanvas;
          texture.needsUpdate = true;
        }
      };
      return img;
    });

    const program = new Program(gl, {
      vertex: cylinderVertex,
      fragment: cylinderFragment,
      uniforms: {
        tMap: { value: texture },
        uDarkness: { value: 0.1 },
      },
      cullFace: null,
    });

    const cylinder = new Mesh(gl, { geometry, program });
    cylinder.setParent(scene);
    cylinder.rotation.y = 0.5;
    cylinder.scale.set(dims.cylinderScale, dims.cylinderScale, dims.cylinderScale);
    cylinderRef.current = cylinder;

    // Animations using GSAP ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // Camera fly-around animation
    tl.to(cameraAnimRef.current, { x: 0, y: 0, z: dims.cameraZ, duration: 1, ease: 'power2.inOut' })
      .to(cameraAnimRef.current, { x: 0, y: 5, z: 5, duration: 1, ease: 'power2.inOut' })
      .to(cameraAnimRef.current, { x: 1.5, y: 2, z: 2, duration: 2, ease: 'none' })
      .to(cameraAnimRef.current, { x: 0.5, y: 0, z: 0.8, duration: 3.5, ease: 'power1.inOut' })
      .to(cameraAnimRef.current, { x: -6, y: -1, z: dims.cameraZ, duration: 1, ease: 'power2.inOut' });

    // Rotate the cylinder a lot across the scroll
    tl.to(cylinder.rotation, { y: '+=28.27', duration: 9, ease: 'none' }, 0);

    // Text fade in/out
    textRefs.current.forEach((textEl, index) => {
      if (!textEl) return;
      const sectionDuration = 100 / perspectives.length;
      const start = index * sectionDuration;
      const end = (index + 1) * sectionDuration;

      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: `${start}% top`,
          end: `${end}% top`,
          scrub: 0.8,
        },
      });

      textTl
        .fromTo(textEl, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' })
        .to(textEl, { opacity: 1, duration: 0.6, ease: 'none' })
        .to(textEl, { opacity: 0, y: -30, duration: 0.2, ease: 'power2.in' });
    });

    // Setup Particles
    for (let i = 0; i < particleConfig.numParticles; i++) {
      const { geometry: lineGeo, userData } = createParticleGeometry(gl, particleConfig, i, cylinderConfig.height);
      const lineProg = new Program(gl, {
        vertex: particleVertex,
        fragment: particleFragment,
        uniforms: {
          uColor: { value: [1.0, 1.0, 1.0] },
          uOpacity: { value: 0.0 },
        },
        transparent: true,
        depthTest: true,
      });
      const particle = new Mesh(gl, { geometry: lineGeo, program: lineProg, mode: gl.LINE_STRIP });
      particle.userData = userData;
      particle.setParent(scene);
      particlesRef.current.push(particle);
    }

    // Resize
    const handleResize = () => {
      dims = getDimensions();
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.perspective({ fov: dims.fov, aspect: window.innerWidth / window.innerHeight });
      cylinder.scale.set(dims.cylinderScale, dims.cylinderScale, dims.cylinderScale);
      
      // Update camera z if not deep in anim
      if (cameraAnimRef.current.z >= 6) {
        cameraAnimRef.current.z = dims.cameraZ;
      }
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);

      camera.position.set(cameraAnimRef.current.x, cameraAnimRef.current.y, cameraAnimRef.current.z);
      camera.lookAt([0, 0, 0]);

      if (cylinder) {
        const curRot = cylinder.rotation.y;
        velocityRef.current = curRot - lastRotationRef.current;
        lastRotationRef.current = curRot;

        momentumRef.current = momentumRef.current * 0.92 + velocityRef.current * 0.15;
        const speed = Math.abs(velocityRef.current) * 100;
        const isRotating = speed > 0.01;

        particlesRef.current.forEach((particle) => {
          const ud = particle.userData;
          const targetOp = isRotating ? Math.min(speed * 3, 0.95) : 0;
          const curOp = particle.program.uniforms.uOpacity.value;
          particle.program.uniforms.uOpacity.value = curOp + (targetOp - curOp) * 0.15;

          if (isRotating) {
            const rotOffset = velocityRef.current * ud.speed * 1.5;
            ud.baseAngle += rotOffset;
            const pos = particle.geometry.attributes.position.data;
            for (let j = 0; j <= particleConfig.segments; j++) {
              const t = j / particleConfig.segments;
              const angle = ud.baseAngle + ud.angleSpan * t;
              pos[j * 3] = Math.cos(angle) * ud.radius;
              pos[j * 3 + 1] = ud.baseY;
              pos[j * 3 + 2] = Math.sin(angle) * ud.radius;
            }
            particle.geometry.attributes.position.needsUpdate = true;
          }
        });
      }

      renderer.render({ scene, camera });
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      tl.kill();
      // Avoid loseContext on the canvas because React StrictMode will reuse the same DOM node 
      // and WebGL context cannot be recreated on it once lost.
    };
  }, []);

  return (
    <section id="skills" style={{ position: 'relative', backgroundColor: '#000', height: '500vh' }} ref={containerRef}>
      <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          {perspectives.map((p, i) => (
            <div
              key={i}
              ref={el => textRefs.current[i] = el}
              style={{ position: 'absolute', textAlign: 'center', opacity: 0, padding: '0 1rem', width: '100%' }}
            >
              <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 'bold', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                {p.title}
              </h2>
              <p style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)', color: '#9ca3af', fontWeight: '300' }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
