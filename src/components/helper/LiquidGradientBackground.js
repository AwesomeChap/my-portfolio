import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Liquid gradient (CodePen base: https://codepen.io/cameronknight/pen/ogxWmBP).
 * Accent red = theme $neon_red (#ff0d2d), scaled down for dark background strips.
 */
const BRAND_RED = new THREE.Vector3(1, 13 / 255, 45 / 255);

const SCHEME_1 = {
  /** Darkened neon_red at two strengths so bands don’t flatten */
  ACCENT_A: new THREE.Vector3(
    BRAND_RED.x * 0.31,
    BRAND_RED.y * 0.31,
    BRAND_RED.z * 0.31,
  ),
  ACCENT_B: new THREE.Vector3(
    BRAND_RED.x * 0.23,
    BRAND_RED.y * 0.23,
    BRAND_RED.z * 0.23,
  ),
  /** Four void tones — all still dark, different hue/luma so strips stay readable */
  VOID_COOL: new THREE.Vector3(0.038, 0.034, 0.048),
  VOID_WARM: new THREE.Vector3(0.042, 0.034, 0.03),
  VOID_GRAPHITE: new THREE.Vector3(0.034, 0.034, 0.038),
  /** Global floor — deep neutral so layered voids still read above it */
  VOID_BASE: new THREE.Vector3(0.022, 0.021, 0.026),
  sceneBackground: 0x050508,
  /** Smaller radius + higher count = more overlapping black “cells” */
  uGradientSize: 0.29,
  uGradientCount: 18,
  uSpeed: 1.3,
  uColor1Weight: 0.42,
  uColor2Weight: 1.92,
  uIntensity: 1.52,
  uGrainIntensity: 0.095,
};

/** Trail texture driving water-style distortion in the fragment shader (from CodePen). */
class TouchTexture {
  constructor() {
    this.size = 64;
    this.width = this.height = this.size;
    this.maxAge = 64;
    this.radius = 0.25 * this.size;
    this.speed = 1 / this.maxAge;
    this.trail = [];
    this.last = null;
    this.initTexture();
  }

  initTexture() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.texture = new THREE.Texture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
  }

  update() {
    this.clear();
    const speed = this.speed;
    for (let i = this.trail.length - 1; i >= 0; i -= 1) {
      const point = this.trail[i];
      const f = point.force * speed * (1 - point.age / this.maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age += 1;
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1);
      } else {
        this.drawPoint(point);
      }
    }
    this.texture.needsUpdate = true;
  }

  clear() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addTouch(point) {
    let force = 0;
    let vx = 0;
    let vy = 0;
    const last = this.last;
    if (last) {
      const dx = point.x - last.x;
      const dy = point.y - last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      const d = Math.sqrt(dd);
      vx = dx / d;
      vy = dy / d;
      force = Math.min(dd * 20000, 2.0);
    }
    this.last = { x: point.x, y: point.y };
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
  }

  drawPoint(point) {
    const pos = {
      x: point.x * this.width,
      y: (1 - point.y) * this.height,
    };
    let intensity = 1;
    if (point.age < this.maxAge * 0.3) {
      intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
    } else {
      const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
      intensity = -t * (t - 2);
    }
    intensity *= point.force;
    const radius = this.radius;
    const color = `${((point.vx + 1) / 2) * 255}, ${
      ((point.vy + 1) / 2) * 255
    }, ${intensity * 255}`;
    const offset = this.size * 5;
    this.ctx.shadowOffsetX = offset;
    this.ctx.shadowOffsetY = offset;
    this.ctx.shadowBlur = radius * 1;
    this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;
    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(255,0,0,1)';
    this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform vec3 uColor6;
uniform float uSpeed;
uniform float uIntensity;
uniform float uGrainIntensity;
uniform vec3 uDarkNavy;
uniform float uGradientSize;
uniform float uGradientCount;
uniform float uColor1Weight;
uniform float uColor2Weight;
uniform sampler2D uTouchTexture;
varying vec2 vUv;

float grain(vec2 uv, float time) {
  vec2 grainUv = uv * uResolution * 0.5;
  float grainValue = fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453);
  return grainValue * 2.0 - 1.0;
}

vec3 getGradientColor(vec2 uv, float time) {
  float gradientRadius = uGradientSize;
  vec2 center1 = vec2(
    0.5 + sin(time * uSpeed * 0.4) * 0.4,
    0.5 + cos(time * uSpeed * 0.5) * 0.4
  );
  vec2 center2 = vec2(
    0.5 + cos(time * uSpeed * 0.6) * 0.5,
    0.5 + sin(time * uSpeed * 0.45) * 0.5
  );
  vec2 center3 = vec2(
    0.5 + sin(time * uSpeed * 0.35) * 0.45,
    0.5 + cos(time * uSpeed * 0.55) * 0.45
  );
  vec2 center4 = vec2(
    0.5 + cos(time * uSpeed * 0.5) * 0.4,
    0.5 + sin(time * uSpeed * 0.4) * 0.4
  );
  vec2 center5 = vec2(
    0.5 + sin(time * uSpeed * 0.7) * 0.35,
    0.5 + cos(time * uSpeed * 0.6) * 0.35
  );
  vec2 center6 = vec2(
    0.5 + cos(time * uSpeed * 0.45) * 0.5,
    0.5 + sin(time * uSpeed * 0.65) * 0.5
  );
  vec2 center7 = vec2(
    0.5 + sin(time * uSpeed * 0.55) * 0.38,
    0.5 + cos(time * uSpeed * 0.48) * 0.42
  );
  vec2 center8 = vec2(
    0.5 + cos(time * uSpeed * 0.65) * 0.36,
    0.5 + sin(time * uSpeed * 0.52) * 0.44
  );
  vec2 center9 = vec2(
    0.5 + sin(time * uSpeed * 0.42) * 0.41,
    0.5 + cos(time * uSpeed * 0.58) * 0.39
  );
  vec2 center10 = vec2(
    0.5 + cos(time * uSpeed * 0.48) * 0.37,
    0.5 + sin(time * uSpeed * 0.62) * 0.43
  );
  vec2 center11 = vec2(
    0.5 + sin(time * uSpeed * 0.68) * 0.33,
    0.5 + cos(time * uSpeed * 0.44) * 0.46
  );
  vec2 center12 = vec2(
    0.5 + cos(time * uSpeed * 0.38) * 0.39,
    0.5 + sin(time * uSpeed * 0.56) * 0.41
  );
  vec2 center13 = vec2(
    0.5 + sin(time * uSpeed * 0.33) * 0.34,
    0.5 + cos(time * uSpeed * 0.51) * 0.36
  );
  vec2 center14 = vec2(
    0.5 + cos(time * uSpeed * 0.47) * 0.42,
    0.5 + sin(time * uSpeed * 0.39) * 0.37
  );
  vec2 center15 = vec2(
    0.5 + sin(time * uSpeed * 0.41) * 0.4,
    0.5 + cos(time * uSpeed * 0.53) * 0.35
  );
  vec2 center16 = vec2(
    0.5 + cos(time * uSpeed * 0.36) * 0.33,
    0.5 + sin(time * uSpeed * 0.44) * 0.4
  );
  vec2 center17 = vec2(
    0.5 + sin(time * uSpeed * 0.49) * 0.37,
    0.5 + cos(time * uSpeed * 0.37) * 0.43
  );
  vec2 center18 = vec2(
    0.5 + cos(time * uSpeed * 0.54) * 0.35,
    0.5 + sin(time * uSpeed * 0.5) * 0.38
  );

  float dist1 = length(uv - center1);
  float dist2 = length(uv - center2);
  float dist3 = length(uv - center3);
  float dist4 = length(uv - center4);
  float dist5 = length(uv - center5);
  float dist6 = length(uv - center6);
  float dist7 = length(uv - center7);
  float dist8 = length(uv - center8);
  float dist9 = length(uv - center9);
  float dist10 = length(uv - center10);
  float dist11 = length(uv - center11);
  float dist12 = length(uv - center12);
  float dist13 = length(uv - center13);
  float dist14 = length(uv - center14);
  float dist15 = length(uv - center15);
  float dist16 = length(uv - center16);
  float dist17 = length(uv - center17);
  float dist18 = length(uv - center18);

  float influence1 = 1.0 - smoothstep(0.0, gradientRadius, dist1);
  float influence2 = 1.0 - smoothstep(0.0, gradientRadius, dist2);
  float influence3 = 1.0 - smoothstep(0.0, gradientRadius, dist3);
  float influence4 = 1.0 - smoothstep(0.0, gradientRadius, dist4);
  float influence5 = 1.0 - smoothstep(0.0, gradientRadius, dist5);
  float influence6 = 1.0 - smoothstep(0.0, gradientRadius, dist6);
  float influence7 = 1.0 - smoothstep(0.0, gradientRadius, dist7);
  float influence8 = 1.0 - smoothstep(0.0, gradientRadius, dist8);
  float influence9 = 1.0 - smoothstep(0.0, gradientRadius, dist9);
  float influence10 = 1.0 - smoothstep(0.0, gradientRadius, dist10);
  float influence11 = 1.0 - smoothstep(0.0, gradientRadius, dist11);
  float influence12 = 1.0 - smoothstep(0.0, gradientRadius, dist12);
  float influence13 = 1.0 - smoothstep(0.0, gradientRadius, dist13);
  float influence14 = 1.0 - smoothstep(0.0, gradientRadius, dist14);
  float influence15 = 1.0 - smoothstep(0.0, gradientRadius, dist15);
  float influence16 = 1.0 - smoothstep(0.0, gradientRadius, dist16);
  float influence17 = 1.0 - smoothstep(0.0, gradientRadius, dist17);
  float influence18 = 1.0 - smoothstep(0.0, gradientRadius, dist18);

  vec2 rotatedUv1 = uv - 0.5;
  float angle1 = time * uSpeed * 0.15;
  rotatedUv1 = vec2(
    rotatedUv1.x * cos(angle1) - rotatedUv1.y * sin(angle1),
    rotatedUv1.x * sin(angle1) + rotatedUv1.y * cos(angle1)
  );
  rotatedUv1 += 0.5;

  vec2 rotatedUv2 = uv - 0.5;
  float angle2 = -time * uSpeed * 0.12;
  rotatedUv2 = vec2(
    rotatedUv2.x * cos(angle2) - rotatedUv2.y * sin(angle2),
    rotatedUv2.x * sin(angle2) + rotatedUv2.y * cos(angle2)
  );
  rotatedUv2 += 0.5;

  float radialGradient1 = length(rotatedUv1 - 0.5);
  float radialGradient2 = length(rotatedUv2 - 0.5);
  float radialInfluence1 = 1.0 - smoothstep(0.0, 0.8, radialGradient1);
  float radialInfluence2 = 1.0 - smoothstep(0.0, 0.8, radialGradient2);

  vec3 color = vec3(0.0);
  color += uColor1 * influence1 * (0.55 + 0.45 * sin(time * uSpeed)) * uColor1Weight;
  color += uColor2 * influence2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2)) * uColor2Weight;
  color += uColor3 * influence3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8)) * uColor1Weight;
  color += uColor4 * influence4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3)) * uColor2Weight;
  color += uColor5 * influence5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1)) * uColor1Weight;
  color += uColor6 * influence6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9)) * uColor2Weight;

  if (uGradientCount > 6.0) {
    color += uColor1 * influence7 * (0.55 + 0.45 * sin(time * uSpeed * 1.4)) * uColor1Weight;
    color += uColor2 * influence8 * (0.55 + 0.45 * cos(time * uSpeed * 1.5)) * uColor2Weight;
    color += uColor3 * influence9 * (0.55 + 0.45 * sin(time * uSpeed * 1.6)) * uColor1Weight;
    color += uColor4 * influence10 * (0.55 + 0.45 * cos(time * uSpeed * 1.7)) * uColor2Weight;
  }
  if (uGradientCount > 10.0) {
    color += uColor5 * influence11 * (0.55 + 0.45 * sin(time * uSpeed * 1.8)) * uColor1Weight;
    color += uColor6 * influence12 * (0.55 + 0.45 * cos(time * uSpeed * 1.9)) * uColor2Weight;
  }
  if (uGradientCount > 12.0) {
    color += uColor1 * influence13 * (0.55 + 0.45 * sin(time * uSpeed * 2.0)) * uColor1Weight;
    color += uColor2 * influence14 * (0.55 + 0.45 * cos(time * uSpeed * 2.1)) * uColor2Weight;
    color += uColor3 * influence15 * (0.55 + 0.45 * sin(time * uSpeed * 2.2)) * uColor1Weight;
    color += uColor4 * influence16 * (0.55 + 0.45 * cos(time * uSpeed * 2.3)) * uColor2Weight;
    color += uColor5 * influence17 * (0.55 + 0.45 * sin(time * uSpeed * 2.4)) * uColor1Weight;
    color += uColor6 * influence18 * (0.55 + 0.45 * cos(time * uSpeed * 2.5)) * uColor2Weight;
  }

  color += mix(uColor1, uColor3, radialInfluence1) * 0.52 * uColor1Weight;
  color += mix(uColor2, uColor4, radialInfluence2) * 0.46 * uColor2Weight;

  float rf3 = length(uv - vec2(0.5));
  float radial3 = 1.0 - smoothstep(0.0, 0.55, rf3);
  color += mix(uColor2, uColor6, radial3) * 0.14 * uColor2Weight;

  float w1 = sin(dot(uv * 88.0, vec2(1.0, 1.7)) + time * uSpeed * 0.14);
  float w2 = sin(dot(uv * 72.0, vec2(-1.2, 0.9)) - time * uSpeed * 0.11);
  float w3 = sin(dot(uv * 105.0, vec2(0.7, -1.1)) + time * uSpeed * 0.09);
  vec3 weave = mix(uColor2, uColor4, w1 * 0.5 + 0.5);
  weave = mix(weave, uColor6, w2 * 0.5 + 0.5);
  color += weave * (0.014 + 0.009 * (w3 * 0.5 + 0.5)) * uColor2Weight;

  color = clamp(color, vec3(0.0), vec3(1.0)) * uIntensity;

  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(luminance), color, 1.22);
  color = pow(color, vec3(0.91));

  float brightness1 = length(color);
  float mixFactor1 = max(brightness1 * 1.28, 0.22);
  color = mix(uDarkNavy, color, mixFactor1);

  float maxB = 1.0;
  float br = length(color);
  if (br > maxB) {
    color = color * (maxB / br);
  }
  return color;
}

void main() {
  vec2 uv = vUv;
  vec4 touchTex = texture2D(uTouchTexture, uv);
  float vx = -(touchTex.r * 2.0 - 1.0);
  float vy = -(touchTex.g * 2.0 - 1.0);
  float touchAmt = touchTex.b;
  uv.x += vx * 0.8 * touchAmt;
  uv.y += vy * 0.8 * touchAmt;
  vec2 ctr = vec2(0.5);
  float dist = length(uv - ctr);
  float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.04 * touchAmt;
  float wave = sin(dist * 15.0 - uTime * 2.0) * 0.03 * touchAmt;
  uv += vec2(ripple + wave);
  vec3 color = getGradientColor(uv, uTime);

  float grainValue = grain(uv, uTime);
  color += grainValue * uGrainIntensity;

  float timeShift = uTime * 0.35;
  color.r += sin(timeShift) * 0.012;
  color.g += sin(timeShift * 1.1) * 0.004;
  color.b += sin(timeShift * 0.9) * 0.004;

  float brightness2 = length(color);
  float mixFactor2 = max(brightness2 * 1.28, 0.22);
  color = mix(uDarkNavy, color, mixFactor2);
  color = clamp(color, vec3(0.0), vec3(1.0));

  float maxB = 1.0;
  float br = length(color);
  if (br > maxB) {
    color = color * (maxB / br);
  }

  gl_FragColor = vec4(color, 1.0);
}
`;

function resolveScrollContainer() {
  const candidates = [
    document.body,
    document.documentElement,
    document.scrollingElement,
    document.getElementById('root'),
    document.querySelector('.router-wrapper'),
  ].filter(Boolean);

  const seen = new Set();
  for (const el of candidates) {
    if (seen.has(el)) continue;
    seen.add(el);
    if (el.scrollHeight - el.clientHeight > 2) return el;
  }

  return document.scrollingElement || document.body;
}

function viewPlaneSize(camera) {
  const fovRad = (camera.fov * Math.PI) / 180;
  const height = Math.abs(camera.position.z * Math.tan(fovRad / 2) * 2);
  const width = height * camera.aspect;
  return { width, height };
}

export default function LiquidGradientBackground() {
  const mountRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const clock = new THREE.Clock();
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      10000,
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    const maxDpr = 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(SCHEME_1.sceneBackground);

    const { width: planeW, height: planeH } = viewPlaneSize(camera);

    const touchTexture = new TouchTexture();

    const uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(mount.clientWidth, mount.clientHeight),
      },
      uTouchTexture: { value: touchTexture.texture },
      uColor1: { value: SCHEME_1.ACCENT_A.clone() },
      uColor2: { value: SCHEME_1.VOID_COOL.clone() },
      uColor3: { value: SCHEME_1.ACCENT_B.clone() },
      uColor4: { value: SCHEME_1.VOID_WARM.clone() },
      uColor5: { value: SCHEME_1.ACCENT_A.clone() },
      uColor6: { value: SCHEME_1.VOID_GRAPHITE.clone() },
      uSpeed: { value: SCHEME_1.uSpeed },
      uIntensity: { value: SCHEME_1.uIntensity },
      uGrainIntensity: { value: SCHEME_1.uGrainIntensity },
      uDarkNavy: { value: SCHEME_1.VOID_BASE.clone() },
      uGradientSize: { value: SCHEME_1.uGradientSize },
      uGradientCount: { value: SCHEME_1.uGradientCount },
      uColor1Weight: { value: SCHEME_1.uColor1Weight },
      uColor2Weight: { value: SCHEME_1.uColor2Weight },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(planeW, planeH, 1, 1),
      material,
    );
    scene.add(mesh);

    mount.appendChild(renderer.domElement);
    renderer.domElement.style.transition = 'opacity 120ms linear';

    const updateScrollFade = () => {
      // Fade by top visible route section progress.
      const hostSection = document.querySelector('.section');
      if (!hostSection) {
        renderer.domElement.style.opacity = '1';
        return;
      }
      const rect = hostSection.getBoundingClientRect();
      const localScrolled = Math.max(0, -rect.top);
      const fadeDistance = Math.max(window.innerHeight * 0.75, 280);
      const opacity = 1 - Math.min(localScrolled / fadeDistance, 1);
      renderer.domElement.style.opacity = `${opacity}`;
    };

    /** Canvas is behind content (`z-index: -1`), so we listen on `window` and map to mount UVs. */
    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const { clientX, clientY } = e;
      if (
        clientX < rect.left
        || clientX > rect.right
        || clientY < rect.top
        || clientY > rect.bottom
      ) {
        return;
      }
      const x = (clientX - rect.left) / rect.width;
      const y = 1 - (clientY - rect.top) / rect.height;
      touchTexture.addTouch({ x, y });
    };

    const onTouchMove = (ev) => {
      if (ev.touches.length === 0) return;
      const t = ev.touches[0];
      onPointerMove({ clientX: t.clientX, clientY: t.clientY });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('scroll', updateScrollFade, { passive: true });
    document.addEventListener('scroll', updateScrollFade, { passive: true });
    document.documentElement.addEventListener('scroll', updateScrollFade, { passive: true });
    document.body.addEventListener('scroll', updateScrollFade, { passive: true });
    const root = document.getElementById('root');
    if (root) root.addEventListener('scroll', updateScrollFade, { passive: true });

    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);

      const vs = viewPlaneSize(camera);
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(vs.width, vs.height, 1, 1);
    };

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      uniforms.uTime.value += delta;
      touchTexture.update();
      renderer.render(scene, camera);
    };

    window.addEventListener('resize', onResize);
    updateScrollFade();
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', updateScrollFade);
      document.removeEventListener('scroll', updateScrollFade);
      document.documentElement.removeEventListener('scroll', updateScrollFade);
      document.body.removeEventListener('scroll', updateScrollFade);
      if (root) root.removeEventListener('scroll', updateScrollFade);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      mesh.geometry.dispose();
      material.dispose();
      touchTexture.texture.dispose();
    };
  }, []);

  return <div ref={mountRef} className="liquid-gradient-bg" />;
}
