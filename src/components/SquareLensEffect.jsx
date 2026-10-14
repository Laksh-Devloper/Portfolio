import { useRef, useEffect } from 'react';
import {
  TextureLoader,
  PlaneGeometry,
  RawShaderMaterial,
  Mesh,
  Vector2,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

/* ─── GLSL chunks (inlined from the original repo) ─── */

const coverUvChunk = /* glsl */ `
vec2 getCoverUv(vec2 uv, vec2 meshSize, vec2 textureSize) {
  vec2 meshRatio = vec2(meshSize.x / meshSize.y, meshSize.y / meshSize.x);
  vec2 textureRatio = vec2(textureSize.x / textureSize.y, textureSize.y / textureSize.x);
  vec2 resolutionRatio = vec2(
    min(meshRatio.x / textureRatio.x, 1.0),
    min(meshRatio.y / textureRatio.y, 1.0)
  );
  return (uv - 0.5) * resolutionRatio + 0.5;
}
`;

const ccLensChunk = /* glsl */ `
float getCCLensScale(float distortion, float radius2) {
  if (distortion >= 0.0) {
    return 1.0 + distortion * radius2;
  }
  return 1.0 / (1.0 - distortion * radius2);
}

vec2 getCCLensUv(vec2 uv, vec2 resolution, float distortion) {
  vec2 centeredUv = uv - 0.5;
  vec2 aspectScale = vec2(resolution.x / resolution.y, 1.0);
  vec2 centeredPosition = centeredUv * aspectScale;
  float radius2 = dot(centeredPosition, centeredPosition);
  float lensScale = getCCLensScale(distortion, radius2);
  vec2 distortedPosition = centeredPosition * lensScale;
  vec2 distortedCenteredUv = distortedPosition / aspectScale;
  vec2 distortedUv = distortedCenteredUv + 0.5;
  vec2 distortionOffset = distortedUv - uv;
  return uv - distortionOffset;
}
`;

const random3Chunk = /* glsl */ `
vec3 random3(vec3 c) {
  float j = 4096.0 * sin(dot(c, vec3(17.0, 59.4, 15.0)));
  vec3 r;
  r.z = fract(512.0 * j);
  j *= 0.125;
  r.x = fract(512.0 * j);
  j *= 0.125;
  r.y = fract(512.0 * j);
  return r - 0.5;
}
`;

/* ─── Vertex shader ─── */

const vertexShader = /* glsl */ `
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/* ─── Fragment shader ─── */
// Adapted: uses the same image for both inside and outside the square,
// but shows a muted version outside the square and full color inside.

const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D u_texture1;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize1;
uniform vec2 u_mouse;
uniform float u_squareSize;
uniform float u_lensDistortion;
uniform float u_rgbShiftR;
uniform float u_rgbShiftG;
uniform float u_rgbShiftB;
uniform float u_waveFrequency;
uniform float u_waveStrength;
uniform float u_waveSpeed;
uniform float u_randomFrequency;
uniform float u_randomStrength;
uniform float u_randomSpeed;
uniform float u_time;

varying vec2 v_uv;

${coverUvChunk}
${ccLensChunk}
${random3Chunk}

void main() {
  vec2 baseUv = getCoverUv(v_uv, u_meshSize, u_textureSize1);

  // Convert the square UV coordinates from 0–1 to -1–1 range
  vec2 uvSquare = v_uv * 2.0 - 1.0;

  // Offset so the mouse position is the origin for the square test
  uvSquare -= u_mouse;

  // Aspect-ratio correction so the mask stays square
  vec2 squareAspectScale = vec2(
    min((u_meshSize.y / u_meshSize.x), 1.0),
    min((u_meshSize.x / u_meshSize.y), 1.0)
  );
  uvSquare /= squareAspectScale;

  // Square half-size
  float squareHalfSize = u_squareSize;

  // Square edges
  float left   = -squareHalfSize;
  float right  =  squareHalfSize;
  float bottom = -squareHalfSize;
  float top    =  squareHalfSize;

  // 1.0 inside, 0.0 outside
  float squareMask = step(left, uvSquare.x) * (1.0 - step(right, uvSquare.x))
                   * step(bottom, uvSquare.y) * (1.0 - step(top, uvSquare.y));

  // Convert uvSquare to 0–1 for CC Lens distortion
  vec2 squareUv = uvSquare / (squareHalfSize * 2.0) + 0.5;

  // Apply CC Lens distortion inside the square
  vec2 distortedSquareUv = getCCLensUv(squareUv, vec2(1.0), u_lensDistortion);

  // Calculate mesh-relative offset
  vec2 squareLensOffset = distortedSquareUv - squareUv;
  vec2 viewportLensOffset = squareLensOffset * squareHalfSize * squareAspectScale;

  // Texture UV with lens distortion applied
  vec2 lensUv = getCoverUv(v_uv + viewportLensOffset, u_meshSize, u_textureSize1);

  // RGB shift direction from square center
  vec2 rgbShiftDirection = (squareUv - 0.5) * 2.0;

  // Sample each channel with offset for color separation
  float r = texture2D(u_texture1, lensUv + rgbShiftDirection * u_rgbShiftR).r;
  float g = texture2D(u_texture1, lensUv + rgbShiftDirection * u_rgbShiftG).g;
  float b = texture2D(u_texture1, lensUv + rgbShiftDirection * u_rgbShiftB).b;

  // Inside color: full-color with RGB shift and distortion
  vec4 insideColor = vec4(r, g, b, 1.0);

  // Outside: apply wave and random noise to the UV for subtle motion
  vec2 outsideUv = baseUv;
  float wave = sin(outsideUv.y * u_waveFrequency + u_time * u_waveSpeed) * u_waveStrength;
  outsideUv.y += wave;
  outsideUv += random3(vec3(outsideUv * u_randomFrequency, u_time * u_randomSpeed)).x * u_randomStrength;

  vec4 outsideSample = texture2D(u_texture1, outsideUv);
  // Half-desaturated and dimmed, so the anime palette still reads outside the lens
  float gray = dot(outsideSample.rgb, vec3(0.299, 0.587, 0.114));
  vec4 outsideColor = vec4(mix(vec3(gray), outsideSample.rgb, 0.55) * 0.8, 1.0);

  // Blend inside/outside based on square mask
  vec4 finalColor = mix(outsideColor, insideColor, squareMask);

  gl_FragColor = finalColor;
}
`;

/* ─── Helper: camera distance so mesh fills viewport exactly ─── */
const calcViewportDistance = (height, fov) =>
  height / (2 * Math.tan((fov * Math.PI) / 360));

/* ─── React component ─── */

export default function SquareLensEffect({ imageSrc }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId = null;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    let destroyed = false;

    /* Shader params: gentler than the repo defaults so the illustration stays clean */
    const shaderParams = {
      squareSize: 0.32,
      lensDistortion: 0.8,
      rgbShiftR: 0.01,
      rgbShiftG: 0,
      rgbShiftB: -0.01,
      waveFrequency: 10,
      waveStrength: 0.003,
      waveSpeed: 1,
      randomFrequency: 1,
      randomStrength: 0.003,
      randomSpeed: 0.2,
      pointerEase: 0.1,
    };

    /* Scene setup */
    const fov = 45;
    const scene = new Scene();
    const camera = new PerspectiveCamera(fov, 1, 0.01, 10000);
    const renderer = new WebGLRenderer({ canvas, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* Uniforms */
    const uniforms = {
      u_texture1: { value: null },
      u_meshSize: { value: new Vector2(1, 1) },
      u_textureSize1: { value: new Vector2(1, 1) },
      u_mouse: { value: new Vector2() },
      u_squareSize: { value: shaderParams.squareSize },
      u_lensDistortion: { value: shaderParams.lensDistortion },
      u_rgbShiftR: { value: shaderParams.rgbShiftR },
      u_rgbShiftG: { value: shaderParams.rgbShiftG },
      u_rgbShiftB: { value: shaderParams.rgbShiftB },
      u_waveFrequency: { value: shaderParams.waveFrequency },
      u_waveStrength: { value: shaderParams.waveStrength },
      u_waveSpeed: { value: shaderParams.waveSpeed },
      u_randomFrequency: { value: shaderParams.randomFrequency },
      u_randomStrength: { value: shaderParams.randomStrength },
      u_randomSpeed: { value: shaderParams.randomSpeed },
      u_time: { value: 0 },
    };

    /* Geometry + material + mesh */
    const geometry = new PlaneGeometry();
    const material = new RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    /* Mouse tracking with easing (same as the original) */
    const mouse = new Vector2();
    const mouseEase = new Vector2();
    let w = window.innerWidth;
    let h = window.innerHeight;

    const onPointerMove = (e) => {
      mouse.set(
        (e.clientX / w) * 2 - 1,
        -(e.clientY / h) * 2 + 1
      );
    };

    /* Resize handler */
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      camera.position.z = calcViewportDistance(h, fov);
      mesh.scale.set(w, h, 1);
      uniforms.u_meshSize.value.set(w, h);
    };

    /* Load texture then start */
    const loader = new TextureLoader();
    loader.load(imageSrc, (texture) => {
      if (destroyed) return;
      const img = texture.image;
      uniforms.u_texture1.value = texture;
      uniforms.u_textureSize1.value.set(img.width, img.height);

      resize();

      /* RAF loop */
      const tick = () => {
        if (destroyed) return;
        // No cursor on touch screens: let the lens wander the sky instead of parking on the copy.
        if (!finePointer) {
          const t = performance.now() * 0.001;
          mouse.set(0.35 + Math.sin(t * 0.35) * 0.35, 0.45 + Math.cos(t * 0.27) * 0.25);
        }
        mouseEase.lerp(mouse, shaderParams.pointerEase);
        uniforms.u_mouse.value.copy(mouseEase);
        uniforms.u_time.value = performance.now() * 0.001;
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    });

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', resize);

    return () => {
      destroyed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (uniforms.u_texture1.value) uniforms.u_texture1.value.dispose();
    };
  }, [imageSrc]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-bg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
