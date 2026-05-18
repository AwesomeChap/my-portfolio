import gsap from "gsap";
import KUTE from "kute.js";
import { FOCUS_MORPH, PUPIL } from "./eyesSequenceConfig";
import { getEyesPlayback } from "./eyesPlayback";

const FOCUS_PATHS = {
  "#left-eye-open":
    "M80 100c1,-5 48,141 48,141 88,1 174,25 244,36l8 -26c-97,-53 -209,-143 -300,-151z",
  "#right-eye-open":
    "M894 96c-1,-4 -48,142 -48,142 -88,0 -174,24 -244,36l-8 -26c97,-54 208,-143 300,-152z",
  "#left-eye-brow":
    "M440 224l-2 38c-117,3 -260,-201 -436,-158l47 -100c177,27 332,247 391,220z",
  "#right-eye-brow":
    "M534 220l2 39c117,3 260,-201 436,-159l-48 -99c-177,26 -331,247 -390,219z",
};

const FOCUS_TARGETS = Object.entries(FOCUS_PATHS);

function syncClipsFromEyes(svg) {
  const leftD = svg.querySelector("#left-eye-open")?.getAttribute("d");
  const rightD = svg.querySelector("#right-eye-open")?.getAttribute("d");
  if (leftD) document.querySelector("#id3 path")?.setAttribute("d", leftD);
  if (rightD) document.querySelector("#id4 path")?.setAttribute("d", rightD);
}

function applyFocusClips(svg) {
  svg.querySelector("#left-eye-ball")?.setAttribute("clip-path", "url(#id3)");
  svg.querySelector("#right-eye-ball")?.setAttribute("clip-path", "url(#id4)");
}

function snapFocusGeometry(svg) {
  FOCUS_TARGETS.forEach(([selector, d]) => {
    svg.querySelector(selector)?.setAttribute("d", d);
  });
  svg.querySelector("#left-eye-brow")?.setAttribute("fill", "#b3b3b3");
  svg.querySelector("#right-eye-brow")?.setAttribute("fill", "#b3b3b3");
  syncClipsFromEyes(svg);
  applyFocusClips(svg);
}

function stopKuteTweens(tweens) {
  tweens?.forEach((tween) => {
    try {
      tween.stop?.();
    } catch {
      /* empty */
    }
  });
}

function startFocusMorph(svg, session) {
  stopKuteTweens(session.focusPathTweens);
  session.focusPathTweens = [];

  FOCUS_TARGETS.forEach(([selector, toPath]) => {
    const el = svg.querySelector(selector);
    if (!el) return;

    const tween = KUTE.fromTo(
      el,
      { path: el },
      { path: toPath },
      {
        duration: FOCUS_MORPH.durationMs,
        easing: FOCUS_MORPH.easing,
        morphIndex: FOCUS_MORPH.morphIndex,
      }
    );
    tween.start();
    session.focusPathTweens.push(tween);
  });
}

function getPupilRoots(svg) {
  return [svg.querySelector("#left-eye-ball"), svg.querySelector("#right-eye-ball")].filter(Boolean);
}

function resetPupilFadeStyles(svg) {
  getPupilRoots(svg).forEach((root) => {
    gsap.killTweensOf(root);
    root.style.removeProperty("opacity");
    root.style.removeProperty("visibility");
    root.removeAttribute("opacity");
  });
}

function clearPupilStyles(svg) {
  svg.querySelectorAll("#left-eye-ball > .eye-balls, #right-eye-ball > .eye-balls").forEach((el) => {
    gsap.killTweensOf(el);
    el.style.removeProperty("transform");
    el.style.removeProperty("transform-origin");
  });
}

/** Hide pupil clip groups before #eyes goEyes — avoids nested opacity in Firefox */
export function snapPupilsHidden(svg) {
  getPupilRoots(svg).forEach((root) => {
    gsap.killTweensOf(root);
    root.setAttribute("opacity", "0");
    root.style.visibility = "hidden";
    root.style.removeProperty("opacity");
  });
}

export function appendFocusMorphToTimeline(tl, container, at, { reduced = false } = {}) {
  const svg = container?.querySelector("#my-svg");
  const session = getEyesPlayback(container);
  if (!svg || !session) return;

  tl.call(
    () => {
      stopKuteTweens(session.focusPathTweens);
      session.focusPathTweens = [];
      container.classList.remove("eyes-seq-pupils-settled");
      resetPupilFadeStyles(svg);
      clearPupilStyles(svg);
      container.classList.add("eyes-seq-focus", "eyes-seq-focus-snapped");

      if (reduced) {
        snapFocusGeometry(svg);
        container.classList.add("eyes-seq-pupils-settled");
        return;
      }

      applyFocusClips(svg);
      startFocusMorph(svg, session);
    },
    null,
    at
  );

  if (reduced) return;

  tl.call(
    () => {
      syncClipsFromEyes(svg);
      container.classList.add("eyes-seq-pupils-settled");
    },
    null,
    at + PUPIL.dropDuration
  );
}

export function runPupilFade(svg, { reduced = false } = {}) {
  const roots = getPupilRoots(svg);
  if (!roots.length) return null;

  resetPupilFadeStyles(svg);

  if (reduced) {
    snapPupilsHidden(svg);
    return null;
  }

  roots.forEach((root) => {
    root.setAttribute("opacity", "1");
    root.style.visibility = "visible";
    root.style.removeProperty("opacity");
  });

  return gsap.to(roots, {
    attr: { opacity: 0 },
    duration: PUPIL.fadeDuration,
    ease: "none",
    overwrite: true,
    onComplete: () => snapPupilsHidden(svg),
  });
}

export function resetFocusMorph(container) {
  if (!container) return;

  const session = getEyesPlayback(container);
  if (session) {
    stopKuteTweens(session.focusPathTweens);
    session.focusPathTweens = [];
  }

  container.classList.remove("eyes-seq-focus-snapped", "eyes-seq-pupils-settled");

  const svg = container.querySelector("#my-svg");
  if (!svg) return;

  resetPupilFadeStyles(svg);
  clearPupilStyles(svg);

  svg.querySelector("#left-eye-ball")?.setAttribute("clip-path", "url(#id1)");
  svg.querySelector("#right-eye-ball")?.setAttribute("clip-path", "url(#id2)");
}
