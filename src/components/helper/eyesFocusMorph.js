import gsap from "gsap";
import KUTE from "kute.js";

const FOCUS = {
  leftEyeOpen:
    "M80 100c1,-5 48,141 48,141 88,1 174,25 244,36l8 -26c-97,-53 -209,-143 -300,-151z",
  rightEyeOpen:
    "M894 96c-1,-4 -48,142 -48,142 -88,0 -174,24 -244,36l-8 -26c97,-54 208,-143 300,-152z",
  leftBrow:
    "M440 224l-2 38c-117,3 -260,-201 -436,-158l47 -100c177,27 332,247 391,220z",
  rightBrow:
    "M534 220l2 39c117,3 260,-201 436,-159l-48 -99c-177,26 -331,247 -390,219z",
};

const FOCUS_PATH_TARGETS = [
  ["#left-eye-open", FOCUS.leftEyeOpen],
  ["#right-eye-open", FOCUS.rightEyeOpen],
  ["#left-eye-brow", FOCUS.leftBrow],
  ["#right-eye-brow", FOCUS.rightBrow],
];

const FOCUS_DURATION_MS = 200;
export const PUPIL_DROP_DURATION = 0.2;
const PUPIL_FADE_DURATION = 1.5;
const PUPIL_SHIFT_RATIO = 0.14;

/** Seconds after focus beat starts — pupil translate runs here (clip-path applies at focus start) */
export const PUPIL_DROP_DELAY = 0.45;

export function getPupilFadeAt(focusAt) {
  return focusAt + PUPIL_DROP_DELAY + PUPIL_DROP_DURATION;
}

export function getEyePupils(svg) {
  return {
    left: svg.querySelector("#left-eye-ball > .eye-balls"),
    right: svg.querySelector("#right-eye-ball > .eye-balls"),
    leftBall: svg.querySelector("#left-eye-ball"),
    rightBall: svg.querySelector("#right-eye-ball"),
  };
}

/** Paths/ellipses inside pupil groups — fade these, not the <g> (Safari drops group transform on opacity tween). */
function getPupilFadeTargets(svg) {
  const { left, right } = getEyePupils(svg);
  return [left, right]
    .filter(Boolean)
    .flatMap((group) => [...group.querySelectorAll("path, ellipse")]);
}

function pupilShiftY(pupilGroup) {
  if (!pupilGroup) return 0;
  try {
    return pupilGroup.getBBox().height * PUPIL_SHIFT_RATIO;
  } catch {
    return 0;
  }
}

function setPupilTranslate(group, y) {
  if (!group) return;
  if (y === 0) {
    group.removeAttribute("transform");
    return;
  }
  group.setAttribute("transform", `translate(0 ${y})`);
}

function applyFocusBrowFill(svg) {
  svg.querySelector("#left-eye-brow")?.setAttribute("fill", "#b3b3b3");
  svg.querySelector("#right-eye-brow")?.setAttribute("fill", "#b3b3b3");
}

function applyFocusClipPaths(svg) {
  svg.querySelector("#left-eye-ball")?.setAttribute("clip-path", "url(#id3)");
  svg.querySelector("#right-eye-ball")?.setAttribute("clip-path", "url(#id4)");
}

function snapFocusGeometry(svg) {
  FOCUS_PATH_TARGETS.forEach(([selector, d]) => {
    svg.querySelector(selector)?.setAttribute("d", d);
  });
  applyFocusBrowFill(svg);
  applyFocusClipPaths(svg);
}

function settlePupils(container, targets) {
  targets.forEach((group) => {
    gsap.set(group, { clearProps: "transform,opacity,visibility" });
    setPupilTranslate(group, pupilShiftY(group));
  });
  container?.classList.add("eyes-seq-pupils-settled");
}

function startFocusPathMorph(svg, { reduced = false } = {}) {
  if (reduced) {
    snapFocusGeometry(svg);
    return [];
  }

  const tweens = [];

  FOCUS_PATH_TARGETS.forEach(([selector, toPath]) => {
    const el = svg.querySelector(selector);
    if (!el) return;

    const tween = KUTE.fromTo(
      el,
      { path: el },
      { path: toPath },
      {
        duration: FOCUS_DURATION_MS,
        easing: "linear",
        morphIndex: 75,
      }
    );
    tween.start();
    tweens.push(tween);
  });

  return tweens;
}

function runPupilDrop(svg, container, { reduced = false } = {}) {
  const { left, right } = getEyePupils(svg);
  const targets = [left, right].filter(Boolean);
  if (!targets.length) return null;

  gsap.killTweensOf(targets);
  targets.forEach((group) => {
    gsap.set(group, { clearProps: "transform" });
    setPupilTranslate(group, 0);
    gsap.set(group, { opacity: 1, visibility: "visible" });
  });

  if (reduced) {
    settlePupils(container, targets);
    return null;
  }

  const shifts = targets.map((group) => pupilShiftY(group));
  const state = { y: 0 };

  return gsap.to(state, {
    y: 1,
    duration: PUPIL_DROP_DURATION,
    ease: "none",
    onUpdate: () => {
      targets.forEach((group, i) => {
        setPupilTranslate(group, shifts[i] * state.y);
      });
    },
    onComplete: () => settlePupils(container, targets),
  });
}

function stopTweens(tweens) {
  tweens?.forEach((tween) => {
    try {
      tween.stop?.();
    } catch {
      /* already stopped */
    }
  });
}

/** Path morph + angry clip at `at`; pupil translate at `at + PUPIL_DROP_DELAY`. */
export function appendFocusMorphToTimeline(tl, container, at, { reduced = false } = {}) {
  const svg = container?.querySelector("#my-svg");
  if (!svg) return;

  const dropAt = at + PUPIL_DROP_DELAY;

  tl.call(
    () => {
      stopTweens(container._focusMorphTweens);
      container._focusMorphTweens = null;
      container._pupilDropTween?.kill();
      container._pupilDropTween = null;
      container.classList.remove("eyes-seq-pupils-settled");

      container.classList.add("eyes-seq-focus", "eyes-seq-focus-snapped");
      applyFocusBrowFill(svg);
      applyFocusClipPaths(svg);
      container._focusMorphTweens = startFocusPathMorph(svg, { reduced });

      if (reduced) {
        container._pupilDropTween = runPupilDrop(svg, container, { reduced: true });
      }
    },
    null,
    at
  );

  if (reduced) return;

  tl.call(() => {
    container._pupilDropTween = runPupilDrop(svg, container);
  }, null, dropAt);
}

export function runPupilFade(svg, { reduced = false } = {}) {
  const { left, right } = getEyePupils(svg);
  const groups = [left, right].filter(Boolean);
  const parts = getPupilFadeTargets(svg);
  if (!parts.length) return null;

  if (reduced) {
    gsap.set(parts, { opacity: 0 });
    gsap.set(groups, { visibility: "hidden" });
    return null;
  }

  return gsap.to(parts, {
    opacity: 0,
    duration: PUPIL_FADE_DURATION,
    ease: "none",
    onComplete: () => {
      gsap.set(groups, { visibility: "hidden" });
    },
  });
}

export function killFocusMorph(tweens, pupilTween) {
  stopTweens(tweens);
  pupilTween?.kill?.();
}

export function resetFocusMorph(container) {
  if (!container) return;

  stopTweens(container._focusMorphTweens);
  container._focusMorphTweens = null;
  killFocusMorph(null, container._pupilDropTween);
  container._pupilDropTween = null;
  container.classList.remove("eyes-seq-focus-snapped", "eyes-seq-pupils-settled");

  const svg = container.querySelector("#my-svg");
  if (!svg) return;

  const { left, right } = getEyePupils(svg);
  const groups = [left, right].filter(Boolean);
  const parts = getPupilFadeTargets(svg);

  gsap.killTweensOf([...groups, ...parts]);
  gsap.set([...groups, ...parts], { clearProps: "opacity,visibility" });
  groups.forEach((group) => {
    gsap.set(group, { clearProps: "transform" });
    setPupilTranslate(group, 0);
  });

  svg.querySelector("#left-eye-ball")?.setAttribute("clip-path", "url(#id1)");
  svg.querySelector("#right-eye-ball")?.setAttribute("clip-path", "url(#id2)");
}
