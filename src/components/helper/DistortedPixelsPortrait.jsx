import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * DataTexture distortion + mosaic. Unlike the hero, the portrait keeps visible
 * macro-blocks after reveal (hero ends at mosaic 1 = fully smooth, so changing
 * “48 vs 18” there was invisible at rest).
 */

/** Mosaic grid at start of reveal (higher = smaller blocks). */
const PORTRAIT_MOSAIC_START = 56;
/** Mosaic grid once reveal finishes — higher = finer “pixels” but still visibly gridded. */
const PORTRAIT_MOSAIC_END = 32;
/** 0..1: blend toward smooth UVs at full reveal (higher = softer / smaller-looking blocks). */
const PORTRAIT_MOSAIC_BLEND_AT_REST = 0.62;

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D uTexture;
uniform sampler2D uDataTexture;
uniform vec4 resolution;
uniform float uDistortionStrength;
uniform float uReveal;
varying vec2 vUv;
void main() {
  float r = clamp(uReveal, 0.0, 1.0);
  float mosaic = max(2.0, floor(mix(${PORTRAIT_MOSAIC_START}.0, ${PORTRAIT_MOSAIC_END}.0, pow(r, 0.62))));
  vec2 cell = floor(vUv * mosaic) / mosaic;
  float revealBlend = smoothstep(0.5, 1.0, r) * ${PORTRAIT_MOSAIC_BLEND_AT_REST};
  vec2 uvUse = mix(cell, vUv, revealBlend);
  vec2 newUV = (uvUse - vec2(0.5)) * resolution.zw + vec2(0.5);
  vec4 offset = texture2D(uDataTexture, vUv);
  vec4 tex = texture2D(uTexture, newUV - uDistortionStrength * offset.rg);
  float alpha = tex.a * smoothstep(0.0, 0.14, r);
  gl_FragColor = vec4(tex.rgb, alpha);
}
`;

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

const SETTINGS = {
  grid: 50,
  mouse: 0.25,
  strength: 0.11,
  relaxation: 0.9,
  distortion: 0.02,
};

const REVEAL_DELAY_MS = 320;
const REVEAL_DURATION_MS = 1200;

/** ~8% overscan so UV distortion at borders samples real pixels (less clamp banding). */
const TEXTURE_BLEED = 1.085;

function drawSmoothSquarePortraitToCanvas(ctx, img, cssSize) {
  if (!img.complete || !img.naturalWidth) return;

  const iw = img.naturalWidth || 1;
  const ih = img.naturalHeight || 1;
  const scale = Math.max(cssSize / iw, cssSize / ih) * TEXTURE_BLEED;
  const drawW = iw * scale;
  const drawH = ih * scale;
  const drawX = (cssSize - drawW) / 2;
  const drawY = 0;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, cssSize, cssSize);
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

function createPortraitSketch(container, src) {
  const settings = SETTINGS;

  const img = new Image();
  img.decoding = 'async';
  img.src = src;

  let width = 0;
  let height = 0;
  let cssSize = 0;

  const sourceCanvas = document.createElement('canvas');
  const sourceCtx = sourceCanvas.getContext('2d');
  if (!sourceCtx) return { destroy() {} };

  let renderer;
  let scene;
  let camera;
  let material;
  let geometry;
  let canvasTex;
  let dataTexture;
  let gridSize = settings.grid;
  let rafId = 0;
  let isPlaying = true;
  let resizeTimer;
  let resizeObserver;
  let initialized = false;

  const mouse = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    vX: 0,
    vY: 0,
  };

  const revealStart = performance.now() + REVEAL_DELAY_MS;

  function measure() {
    const w = container.clientWidth || 0;
    const h = container.clientHeight || 0;
    cssSize = Math.max(1, Math.round(Math.min(w, h)));
    width = cssSize;
    height = cssSize;
  }

  function regenerateGrid() {
    const w = gridSize;
    const h = gridSize;
    const count = w * h;
    const data = new Float32Array(3 * count);
    for (let i = 0; i < count; i += 1) {
      const stride = i * 3;
      data[stride] = Math.random() * 255 - 125;
      data[stride + 1] = Math.random() * 255 - 125;
      data[stride + 2] = Math.random() * 255 - 125;
    }
    if (dataTexture) dataTexture.dispose();
    dataTexture = new THREE.DataTexture(data, w, h, THREE.RGBFormat, THREE.FloatType);
    dataTexture.magFilter = THREE.NearestFilter;
    dataTexture.minFilter = THREE.NearestFilter;
    dataTexture.needsUpdate = true;
    if (material) material.uniforms.uDataTexture.value = dataTexture;
  }

  function buildPortraitTexture() {
    measure();
    if (cssSize < 2 || !img.complete || !img.naturalWidth) return;

    sourceCanvas.width = cssSize;
    sourceCanvas.height = cssSize;
    drawSmoothSquarePortraitToCanvas(sourceCtx, img, cssSize);

    if (canvasTex) canvasTex.dispose();
    canvasTex = new THREE.Texture(sourceCanvas);
    canvasTex.needsUpdate = true;
    canvasTex.minFilter = THREE.LinearFilter;
    canvasTex.magFilter = THREE.LinearFilter;
    canvasTex.wrapS = THREE.ClampToEdgeWrapping;
    canvasTex.wrapT = THREE.ClampToEdgeWrapping;
    if (material) material.uniforms.uTexture.value = canvasTex;
  }

  function setResolutionUniform() {
    if (material) material.uniforms.resolution.value.set(width, height, 1, 1);
  }

  function tryInit() {
    if (initialized) return;
    measure();
    if (cssSize < 2 || !img.complete || !img.naturalWidth) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    if (renderer.outputEncoding !== undefined) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
    renderer.domElement.className = 'about-pixel__canvas';
    container.appendChild(renderer.domElement);

    camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1000, 1000);
    camera.position.set(0, 0, 2);

    scene = new THREE.Scene();

    regenerateGrid();

    buildPortraitTexture();

    material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        resolution: { value: new THREE.Vector4() },
        uTexture: { value: canvasTex },
        uDataTexture: { value: dataTexture },
        uDistortionStrength: { value: settings.distortion },
        uReveal: { value: 0 },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });
    setResolutionUniform();

    geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    scene.add(new THREE.Mesh(geometry, material));

    initialized = true;
  }

  function updateDataTexture() {
    if (!dataTexture) return;
    const data = dataTexture.image.data;
    for (let i = 0; i < data.length; i += 3) {
      data[i] *= settings.relaxation;
      data[i + 1] *= settings.relaxation;
    }

    const gridMouseX = gridSize * mouse.x;
    const gridMouseY = gridSize * (1 - mouse.y);
    const maxDist = gridSize * settings.mouse;
    const aspect = height / Math.max(width, 1);
    const maxDistSq = maxDist ** 2;

    for (let i = 0; i < gridSize; i += 1) {
      for (let j = 0; j < gridSize; j += 1) {
        const distance = (gridMouseX - i) ** 2 / aspect + (gridMouseY - j) ** 2;
        if (distance < maxDistSq) {
          const index = 3 * (i + gridSize * j);
          let power = maxDist / Math.sqrt(distance);
          power = clamp(power, 0, 10);
          data[index] += settings.strength * 100 * mouse.vX * power;
          data[index + 1] -= settings.strength * 100 * mouse.vY * power;
        }
      }
    }

    mouse.vX *= 0.9;
    mouse.vY *= 0.9;
    dataTexture.needsUpdate = true;
  }

  function onMouseMove(e) {
    const rect = container.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    mouse.vX = nx - mouse.prevX;
    mouse.vY = ny - mouse.prevY;
    mouse.prevX = nx;
    mouse.prevY = ny;
    mouse.x = nx;
    mouse.y = ny;
  }

  function onResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      tryInit();
      if (!initialized || !renderer) return;
      measure();
      if (cssSize < 2) return;
      renderer.setSize(width, height);
      buildPortraitTexture();
      setResolutionUniform();
      regenerateGrid();
    }, 80);
  }

  function renderLoop() {
    if (!isPlaying) return;
    if (!initialized || !renderer || !material) {
      rafId = window.requestAnimationFrame(renderLoop);
      return;
    }

    const now = performance.now();
    const t = Math.max(0, now - revealStart);
    const uReveal = t <= 0 ? 0 : easeOutCubic(Math.min(1, t / REVEAL_DURATION_MS));
    material.uniforms.uReveal.value = uReveal;

    updateDataTexture();
    renderer.render(scene, camera);
    rafId = window.requestAnimationFrame(renderLoop);
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('resize', onResize);

  img.onload = () => {
    tryInit();
  };
  if (img.complete) tryInit();

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      tryInit();
      onResize();
    });
    resizeObserver.observe(container);
  }

  rafId = window.requestAnimationFrame(renderLoop);

  function destroy() {
    isPlaying = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    window.clearTimeout(resizeTimer);
    if (resizeObserver) resizeObserver.disconnect();
    if (rafId) window.cancelAnimationFrame(rafId);
    if (geometry) geometry.dispose();
    if (material) material.dispose();
    if (dataTexture) dataTexture.dispose();
    if (canvasTex) canvasTex.dispose();
    if (renderer) {
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    }
  }

  return { destroy };
}

export default function DistortedPixelsPortrait({ src, alt }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    const sketch = createPortraitSketch(el, src);
    return () => sketch.destroy();
  }, [src]);

  return <div className="about-pixel about-pixel--distorted" ref={rootRef} role="img" aria-label={alt} />;
}
