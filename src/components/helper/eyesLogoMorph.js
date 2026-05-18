import KUTE from "kute.js";
import { LOGO_MORPH } from "./eyesSequenceConfig";
import { getEyesPlayback } from "./eyesPlayback";

const MORPH_PAIRS = [
  ["#left-eye-brow-copy", "#j1"],
  ["#left-eye-open-copy", "#j2"],
  ["#left-eye-open-clone-copy", "#j3"],
  ["#right-eye-brow-copy", "#k1"],
  ["#right-eye-open-copy", "#k2"],
  ["#right-eye-open-clone-copy", "#k3"],
];

/** Focus-state paths for #eyes-2 copies — reset target on replay. */
const COPY_PATH_D = {
  "left-eye-brow-copy":
    "M440 224l-2 38c-117,3 -260,-201 -436,-158l47 -100c177,27 332,247 391,220z",
  "left-eye-open-copy":
    "M80 100c1,-5 48,141 48,141 88,1 174,25 244,36l8 -26c-97,-53 -209,-143 -300,-151z",
  "left-eye-open-clone-copy":
    "M80 100c1,-5 48,141 48,141 88,1 174,25 244,36l8 -26c-97,-53 -209,-143 -300,-151z",
  "right-eye-brow-copy":
    "M534 220l2 39c117,3 260,-201 436,-159l-48 -99c-177,26 -331,247 -390,219z",
  "right-eye-open-copy":
    "M894 96c-1,-4 -48,142 -48,142 -88,0 -174,24 -244,36l-8 -26c97,-54 208,-143 300,-152z",
  "right-eye-open-clone-copy":
    "M894 96c-1,-4 -48,142 -48,142 -88,0 -174,24 -244,36l-8 -26c97,-54 208,-143 300,-152z",
};

function snapCopyPaths(svg) {
  Object.entries(COPY_PATH_D).forEach(([id, d]) => {
    svg.querySelector(`#${id}`)?.setAttribute("d", d);
  });
}

function snapMorphComplete() {
  MORPH_PAIRS.forEach(([fromSel, toSel]) => {
    const fromEl = document.querySelector(fromSel);
    const toEl = document.querySelector(toSel);
    if (!fromEl || !toEl) return;
    const d = toEl.getAttribute("d");
    if (d) fromEl.setAttribute("d", d);
  });
}

function runLogoMorph(container, { reduced = false } = {}) {
  const svg = container?.querySelector("#my-svg");
  const session = getEyesPlayback(container);
  if (!svg || !session) return;

  session.logoMorphTweens.forEach((t) => {
    try {
      t.stop?.();
    } catch {
      /* empty */
    }
  });
  session.logoMorphTweens = [];

  snapCopyPaths(svg);

  if (reduced) {
    snapMorphComplete();
    return;
  }

  MORPH_PAIRS.forEach(([fromSel, toSel]) => {
    const fromEl = document.querySelector(fromSel);
    const toEl = document.querySelector(toSel);
    if (!fromEl || !toEl) return;

    const tween = KUTE.fromTo(
      fromEl,
      { path: fromEl },
      { path: toEl },
      {
        easing: LOGO_MORPH.easing,
        duration: LOGO_MORPH.durationMs,
        morphIndex: LOGO_MORPH.morphIndex,
      }
    );
    tween.start();
    session.logoMorphTweens.push(tween);
  });
}

export function appendLogoMorphToTimeline(tl, container, { reduced = false } = {}) {
  tl.call(() => runLogoMorph(container, { reduced }), null, LOGO_MORPH.at);
}

export function resetLogoMorph(container) {
  if (!container) return;
  const svg = container.querySelector("#my-svg");
  if (svg) snapCopyPaths(svg);
}
