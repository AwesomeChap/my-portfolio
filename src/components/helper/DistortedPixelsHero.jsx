import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Desktop: full-viewport transparent WebGL over the liquid gradient — only the intro
 * title is drawn (canvas texture). Same DataTexture distortion + pixelated entry (uReveal)
 * as Codrops-style demos, without a photo background.
 */

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
  float mosaic = max(1.0, floor(mix(48.0, 1.0, pow(r, 0.62))));
  vec2 cell = floor(vUv * mosaic) / mosaic;
  vec2 uvUse = mix(cell, vUv, smoothstep(0.5, 1.0, r));
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

const INTRO_FONT_FAMILY = 'Futura';

function fontSizeForWidth(w) {
  if (w <= 767) return Math.max(44, w * 0.11);
  if (w <= 1024) return 80;
  return 110;
}

function drawIntroCanvas(width, height, dpr) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));
  const ctx = canvas.getContext('2d');
  const fontSize = fontSizeForWidth(width);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  ctx.font = `900 ${fontSize}px ${INTRO_FONT_FAMILY}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  try {
    ctx.letterSpacing = `${fontSize * 0.2}px`;
  } catch (e) {
    /* empty */
  }

  const line1 = 'HELLO.';
  const line2 = "I'M JATIN";
  const w1 = ctx.measureText(line1).width;
  const w2 = ctx.measureText(line2).width;
  const blockWidth = Math.max(w1, w2);
  const leftX = (width - blockWidth) / 2;

  const lineGap = fontSize * 0.28;
  const blockH = fontSize * 2 + lineGap;
  const cy = height * 0.5;
  const y1 = cy - blockH * 0.5 + fontSize * 0.35;
  const y2 = y1 + fontSize + lineGap;

  ctx.fillStyle = '#777777';
  ctx.fillText(line1, leftX, y1);
  ctx.fillStyle = '#dddddd';
  ctx.fillText(line2, leftX, y2);

  return canvas;
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

function createHeroSketch(container) {
  const settings = SETTINGS;

  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;
  if (height < 2) {
    height = Math.round(fontSizeForWidth(width) * 2.65);
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const renderer = new THREE.WebGLRenderer({
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
  container.appendChild(renderer.domElement);

  const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1000, 1000);
  camera.position.set(0, 0, 2);

  const scene = new THREE.Scene();

  let size = settings.grid;
  let dataTexture;
  let material;
  let plane;
  let geometry;
  let canvasTex;
  let rafId;
  let isPlaying = true;

  const mouse = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    vX: 0,
    vY: 0,
  };

  const revealStart = performance.now() + REVEAL_DELAY_MS;

  function regenerateGrid() {
    size = settings.grid;
    const w = size;
    const h = size;
    const count = w * h;
    const data = new Float32Array(3 * count);
    for (let i = 0; i < count; i += 1) {
      const stride = i * 3;
      data[stride] = Math.random() * 255 - 125;
      data[stride + 1] = Math.random() * 255 - 125;
      data[stride + 2] = Math.random() * 255 - 125;
    }
    if (dataTexture) {
      dataTexture.dispose();
    }
    dataTexture = new THREE.DataTexture(data, w, h, THREE.RGBFormat, THREE.FloatType);
    dataTexture.magFilter = THREE.NearestFilter;
    dataTexture.minFilter = THREE.NearestFilter;
    dataTexture.needsUpdate = true;
    if (material) {
      material.uniforms.uDataTexture.value = dataTexture;
    }
  }

  function setTitleResolution() {
    material.uniforms.resolution.value.set(width, height, 1, 1);
  }

  function buildTitleTexture() {
    const canvas = drawIntroCanvas(width, height, dpr);
    if (canvasTex) {
      canvasTex.dispose();
    }
    canvasTex = new THREE.Texture(canvas);
    canvasTex.needsUpdate = true;
    canvasTex.minFilter = THREE.LinearFilter;
    canvasTex.magFilter = THREE.LinearFilter;
    material.uniforms.uTexture.value = canvasTex;
  }

  regenerateGrid();

  const titleCanvasEl = drawIntroCanvas(width, height, dpr);
  canvasTex = new THREE.Texture(titleCanvasEl);
  canvasTex.needsUpdate = true;
  canvasTex.minFilter = THREE.LinearFilter;
  canvasTex.magFilter = THREE.LinearFilter;

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
  setTitleResolution();

  geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  function updateDataTexture() {
    const data = dataTexture.image.data;
    for (let i = 0; i < data.length; i += 3) {
      data[i] *= settings.relaxation;
      data[i + 1] *= settings.relaxation;
    }

    const gridMouseX = size * mouse.x;
    const gridMouseY = size * (1 - mouse.y);
    const maxDist = size * settings.mouse;
    const aspect = height / Math.max(width, 1);
    const maxDistSq = maxDist ** 2;

    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        const distance = ((gridMouseX - i) ** 2) / aspect + (gridMouseY - j) ** 2;
        if (distance < maxDistSq) {
          const index = 3 * (i + size * j);
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
    const nx = (e.clientX - rect.left) / Math.max(rect.width, 1);
    const ny = (e.clientY - rect.top) / Math.max(rect.height, 1);
    mouse.vX = nx - mouse.prevX;
    mouse.vY = ny - mouse.prevY;
    mouse.prevX = nx;
    mouse.prevY = ny;
    mouse.x = nx;
    mouse.y = ny;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  let resizeTimer;
  function onResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      if (height < 2) {
        height = Math.round(fontSizeForWidth(width) * 2.65);
      }
      if (width < 2) return;
      renderer.setSize(width, height);
      setTitleResolution();
      buildTitleTexture();
      regenerateGrid();
    }, 80);
  }
  window.addEventListener('resize', onResize);

  function renderLoop() {
    if (!isPlaying) return;
    const now = performance.now();
    const t = Math.max(0, now - revealStart);
    const uReveal = t <= 0 ? 0 : easeOutCubic(Math.min(1, t / REVEAL_DURATION_MS));
    material.uniforms.uReveal.value = uReveal;

    updateDataTexture();
    renderer.render(scene, camera);
    rafId = window.requestAnimationFrame(renderLoop);
  }
  renderLoop();

  function destroy() {
    isPlaying = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    window.clearTimeout(resizeTimer);
    if (rafId) window.cancelAnimationFrame(rafId);
    if (geometry) geometry.dispose();
    if (material) material.dispose();
    if (dataTexture) dataTexture.dispose();
    if (canvasTex) canvasTex.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  }

  return { destroy };
}

export default function DistortedPixelsHero() {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    let sketch;
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      sketch = createHeroSketch(el);
    };

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(run).catch(run);
    } else {
      run();
    }

    return () => {
      cancelled = true;
      if (sketch) sketch.destroy();
    };
  }, []);

  return <div className="distorted-pixels-hero" ref={rootRef} aria-hidden="true" />;
}
