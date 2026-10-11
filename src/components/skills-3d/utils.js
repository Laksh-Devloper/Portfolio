import { Geometry } from 'ogl';

export function drawImageCover(ctx, img, x, y, w, h) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = w / h;

  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = img.naturalWidth;
  let sourceHeight = img.naturalHeight;

  if (imgRatio > canvasRatio) {
    sourceWidth = img.naturalHeight * canvasRatio;
    sourceX = (img.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = img.naturalWidth / canvasRatio;
    sourceY = (img.naturalHeight - sourceHeight) / 2;
  }

  ctx.save();
  ctx.translate(x, y + h);
  ctx.scale(1, -1);
  ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, w, h);
  ctx.restore();
}

export function createCylinderGeometry(gl, config) {
  const { radius, height, radialSegments, heightSegments } = config;

  const positions = [];
  const uvs = [];
  const indices = [];

  for (let y = 0; y <= heightSegments; y++) {
    const v = y / heightSegments;
    const yPos = (v - 0.5) * height;

    for (let x = 0; x <= radialSegments; x++) {
      const u = x / radialSegments;
      const theta = u * Math.PI * 2;

      const xPos = Math.cos(theta) * radius;
      const zPos = Math.sin(theta) * radius;

      positions.push(xPos, yPos, zPos);
      // (1-u, v) is the mathematically correct mapping to render an upright, left-to-right texture
      // given that we are drawing normally to the canvas.
      uvs.push(1 - u, v);
    }
  }

  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < radialSegments; x++) {
      const a = y * (radialSegments + 1) + x;
      const b = a + radialSegments + 1;
      const c = a + 1;
      const d = b + 1;

      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  return new Geometry(gl, {
    position: { size: 3, data: new Float32Array(positions) },
    uv: { size: 2, data: new Float32Array(uvs) },
    index: { data: new Uint16Array(indices) },
  });
}

export function createParticleGeometry(gl, config, index, height) {
  const { numParticles, particleRadius, segments, angleSpan } = config;

  const linePositions = [];
  const startAngle = (index / numParticles) * Math.PI * 2;

  const isTopHalf = index < numParticles / 2;
  const yPosition = isTopHalf
    ? height * 0.7 + Math.random() * height * 0.3
    : -height * 1.0 + Math.random() * height * 0.3;

  for (let j = 0; j <= segments; j++) {
    const t = j / segments;
    const angle = startAngle + angleSpan * t;
    const x = Math.cos(angle) * particleRadius;
    const z = Math.sin(angle) * particleRadius;

    linePositions.push(x, yPosition, z);
  }

  return {
    geometry: new Geometry(gl, {
      position: { size: 3, data: new Float32Array(linePositions) },
    }),
    userData: {
      baseAngle: startAngle,
      angleSpan: angleSpan,
      baseY: yPosition,
      speed: 0.5 + Math.random() * 1.0,
      radius: particleRadius,
    },
  };
}
