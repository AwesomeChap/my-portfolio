import * as THREE from 'three';

const INTRO_FONT_FAMILY = 'Futura';
const NOT_FOUND_SUBTITLE = "This page doesn't exist.";

function applyCanvasFont(ctx, fontSize, letterSpacingRatio) {
  ctx.font = `900 ${fontSize}px ${INTRO_FONT_FAMILY}`;
  try {
    ctx.letterSpacing = `${fontSize * letterSpacingRatio}px`;
  } catch (e) {
    /* empty */
  }
}

function measureLineWidth(ctx, text, fontSize, letterSpacingRatio) {
  applyCanvasFont(ctx, fontSize, letterSpacingRatio);
  return ctx.measureText(text).width;
}

/** Scale subtitle so its rendered width matches the title line (e.g. 404). */
export function fitSubtitleToTitleWidth(
  titleText,
  titleSize,
  titleLetterSpacing,
  subText = NOT_FOUND_SUBTITLE,
) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const targetW = measureLineWidth(ctx, titleText, titleSize, titleLetterSpacing);

  let subSize = Math.max(11, titleSize * 0.16);
  let subSpacing = 0.02;
  const maxSub = titleSize * 0.48;

  while (subSize <= maxSub) {
    const w = measureLineWidth(ctx, subText, subSize, subSpacing);
    if (w >= targetW * 0.99) break;
    subSize += 0.5;
  }

  let w = measureLineWidth(ctx, subText, subSize, subSpacing);
  while (w < targetW * 0.995 && subSpacing < 0.4) {
    subSpacing += 0.006;
    w = measureLineWidth(ctx, subText, subSize, subSpacing);
  }
  while (w > targetW * 1.01 && subSpacing > 0) {
    subSpacing -= 0.006;
    w = measureLineWidth(ctx, subText, subSize, subSpacing);
  }

  return {
    fontSize: Math.min(maxSub, subSize),
    letterSpacingRatio: subSpacing,
  };
}

export function notFoundTitleSizeForViewport(width) {
  if (width <= 479) return Math.max(56, width * 0.17);
  if (width <= 767) return Math.max(52, width * 0.15);
  if (width <= 1024) return 88;
  return 128;
}

export function isNotFoundNarrowViewport(width) {
  return width <= 1024;
}

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function buildFragmentShader(mosaicMax) {
  return `
precision highp float;
uniform sampler2D uTexture;
uniform sampler2D uDataTexture;
uniform vec4 resolution;
uniform float uDistortionStrength;
uniform float uReveal;
varying vec2 vUv;
void main() {
  float r = clamp(uReveal, 0.0, 1.0);
  float mosaic = max(1.0, floor(mix(${mosaicMax}.0, 1.0, pow(r, 0.56))));
  vec2 cell = floor(vUv * mosaic) / mosaic;
  vec2 uvUse = mix(cell, vUv, smoothstep(0.28, 0.91, r));
  vec2 newUV = (uvUse - vec2(0.5)) * resolution.zw + vec2(0.5);
  vec4 offset = texture2D(uDataTexture, vUv);
  vec4 tex = texture2D(uTexture, newUV - uDistortionStrength * offset.rg);
  float alpha = tex.a * smoothstep(0.0, 0.14, r);
  gl_FragColor = vec4(tex.rgb, alpha);
}
`;
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

const DEFAULT_SETTINGS = {
  grid: 64,
  mouse: 0.21,
  strength: 0.086,
  relaxation: 0.92,
  distortion: 0.013,
};

/**
 * @param {number} width
 * @param {number} height
 * @param {number} dpr
 * @param {{ lines: { text: string, color: string, fontSize: number, letterSpacingRatio?: number }[], letterSpacingRatio?: number, lineGapRatio?: number, lineGapPx?: number, verticalCenter?: number, align?: 'left' | 'center' }} layout
 */
export function drawLinesCanvas(width, height, dpr, layout) {
  const {
    lines,
    letterSpacingRatio: defaultLetterSpacing = 0.2,
    lineGapRatio = 0.28,
    lineGapPx,
    verticalCenter = 0.5,
    align = 'left',
  } = layout;

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  ctx.textBaseline = 'middle';

  const lineHeights = lines.map((l) => l.fontSize);
  const gap =
    lines.length > 1
      ? (lineGapPx != null ? lineGapPx : lineHeights[0] * lineGapRatio)
      : 0;
  const blockH = lineHeights.reduce((sum, h, i) => sum + h + (i < lines.length - 1 ? gap : 0), 0);
  const cy = height * verticalCenter;
  let y = cy - blockH * 0.5 + lineHeights[0] * 0.35;

  const centerX = width / 2;

  if (align === 'center') {
    ctx.textAlign = 'center';
    lines.forEach((line, i) => {
      const spacing = line.letterSpacingRatio ?? defaultLetterSpacing;
      ctx.font = `900 ${line.fontSize}px ${INTRO_FONT_FAMILY}`;
      try {
        ctx.letterSpacing = `${line.fontSize * spacing}px`;
      } catch (e) {
        /* empty */
      }
      if (line.glass) {
        ctx.shadowColor = 'rgba(255, 255, 255, 0.14)';
        ctx.shadowBlur = line.fontSize * 0.14;
      }
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, centerX, y);
      ctx.shadowBlur = 0;
      y += line.fontSize + (i < lines.length - 1 ? gap : 0);
    });
    return canvas;
  }

  ctx.textAlign = 'left';
  const lineWidths = lines.map((line) => {
    const spacing = line.letterSpacingRatio ?? defaultLetterSpacing;
    ctx.font = `900 ${line.fontSize}px ${INTRO_FONT_FAMILY}`;
    try {
      ctx.letterSpacing = `${line.fontSize * spacing}px`;
    } catch (e) {
      /* empty */
    }
    return ctx.measureText(line.text).width;
  });

  const blockWidth = Math.max(...lineWidths, 1);
  const leftX = (width - blockWidth) / 2;

  lines.forEach((line, i) => {
    const spacing = line.letterSpacingRatio ?? defaultLetterSpacing;
    ctx.font = `900 ${line.fontSize}px ${INTRO_FONT_FAMILY}`;
    try {
      ctx.letterSpacing = `${line.fontSize * spacing}px`;
    } catch (e) {
      /* empty */
    }
    if (line.glass) {
      ctx.shadowColor = 'rgba(255, 255, 255, 0.14)';
      ctx.shadowBlur = line.fontSize * 0.14;
    }
    ctx.fillStyle = line.color;
    ctx.fillText(line.text, leftX, y);
    ctx.shadowBlur = 0;
    y += line.fontSize + (i < lines.length - 1 ? gap : 0);
  });

  return canvas;
}

/** Home hero: HELLO. / I'M JATIN */
const INTRO_HELLO_GLASS_FILL = 'rgba(255, 255, 255, 0.42)';

export function heroLayoutForWidth(width, height) {
  let fontSize;
  if (width <= 767) fontSize = Math.max(44, width * 0.11);
  else if (width <= 1024) fontSize = 80;
  else fontSize = 110;

  return {
    lines: [
      {text: 'HELLO.', color: INTRO_HELLO_GLASS_FILL, fontSize, glass: true},
      {text: "I'M JATIN", color: '#dddddd', fontSize},
    ],
    letterSpacingRatio: 0.2,
    lineGapRatio: 0.28,
    verticalCenter: 0.5,
    minContainerHeight: Math.round(fontSize * 2.65),
  };
}

/** 404 page: large 404 + subtitle */
export function notFoundLayoutForWidth(width, height) {
  const titleSize = notFoundTitleSizeForViewport(width);
  const titleSpacing = 0.18;
  const subSize = Math.max(14, titleSize * 0.2);
  const subSpacing = 0.035;

  return {
    lines: [
      {text: '404', color: '#dddddd', fontSize: titleSize},
      {text: NOT_FOUND_SUBTITLE, color: '#777777', fontSize: subSize, letterSpacingRatio: subSpacing},
    ],
    letterSpacingRatio: titleSpacing,
    lineGapPx: 10,
    verticalCenter: 0.5,
    align: 'center',
    minContainerHeight: Math.round(titleSize * 2.1 + subSize),
  };
}

/**
 * @param {HTMLElement} container
 * @param {{
 *   layoutForWidth: (w: number, h: number) => object,
 *   mosaicMax?: number,
 *   revealDelayMs?: number,
 *   revealDurationMs?: number,
 *   settings?: object,
 * }} config
 */
export function createDistortedPixelsSketch(container, config) {
  const {
    layoutForWidth,
    mosaicMax = 112,
    revealDelayMs = 320,
    revealDurationMs = 1200,
    settings = DEFAULT_SETTINGS,
  } = config;

  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;
  let layout = layoutForWidth(width, height);
  if (height < 2) {
    height = layout.minContainerHeight || Math.round(width * 0.4);
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

  const mouse = {x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0};
  const revealStart = performance.now() + revealDelayMs;

  function regenerateGrid() {
    size = settings.grid;
    const count = size * size;
    const data = new Float32Array(3 * count);
    for (let i = 0; i < count; i += 1) {
      const stride = i * 3;
      data[stride] = Math.random() * 255 - 125;
      data[stride + 1] = Math.random() * 255 - 125;
      data[stride + 2] = Math.random() * 255 - 125;
    }
    if (dataTexture) dataTexture.dispose();
    dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBFormat, THREE.FloatType);
    dataTexture.magFilter = THREE.NearestFilter;
    dataTexture.minFilter = THREE.NearestFilter;
    dataTexture.needsUpdate = true;
    if (material) material.uniforms.uDataTexture.value = dataTexture;
  }

  function setTitleResolution() {
    material.uniforms.resolution.value.set(width, height, 1, 1);
  }

  function buildTitleTexture() {
    layout = layoutForWidth(width, height);
    const canvas = drawLinesCanvas(width, height, dpr, layout);
    if (canvasTex) canvasTex.dispose();
    canvasTex = new THREE.Texture(canvas);
    canvasTex.needsUpdate = true;
    canvasTex.minFilter = THREE.LinearFilter;
    canvasTex.magFilter = THREE.LinearFilter;
    material.uniforms.uTexture.value = canvasTex;
  }

  regenerateGrid();

  const initialCanvas = drawLinesCanvas(width, height, dpr, layout);
  canvasTex = new THREE.Texture(initialCanvas);
  canvasTex.needsUpdate = true;
  canvasTex.minFilter = THREE.LinearFilter;
  canvasTex.magFilter = THREE.LinearFilter;

  material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      resolution: {value: new THREE.Vector4()},
      uTexture: {value: canvasTex},
      uDataTexture: {value: dataTexture},
      uDistortionStrength: {value: settings.distortion},
      uReveal: {value: 0},
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: buildFragmentShader(mosaicMax),
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

  window.addEventListener('mousemove', onMouseMove, {passive: true});

  let resizeTimer;
  function onResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      layout = layoutForWidth(width, height);
      if (height < 2) height = layout.minContainerHeight || Math.round(width * 0.4);
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
    const uReveal = t <= 0 ? 0 : easeOutCubic(Math.min(1, t / revealDurationMs));
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

  return {destroy};
}
