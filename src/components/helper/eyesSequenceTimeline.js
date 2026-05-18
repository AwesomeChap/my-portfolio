import gsap from "gsap";
import {
  appendFocusMorphToTimeline,
  runPupilFade,
  killFocusMorph,
  resetFocusMorph,
  getPupilFadeAt,
} from "./eyesFocusMorph";

export const EYES_SEQ_PHASES = [
  "eyes-seq-ui",
  "eyes-seq-lashes-closed",
  "eyes-seq-eyes-open",
  "eyes-seq-mui",
  "eyes-seq-shines",
  "eyes-seq-focus",
  "eyes-seq-fade-pupils",
  "eyes-seq-logo-layer",
  "eyes-seq-brows-decolor",
  "eyes-seq-eyes-out",
  "eyes-seq-logo-fill",
];

const FOCUS_AT = 3.62;

/** Seconds from sequence start (--eyes-seq-delay must be 0 when sketching). */
export const PHASE_AT = {
  "eyes-seq-ui": 0.7,
  "eyes-seq-lashes-closed": 1.4,
  "eyes-seq-eyes-open": 1.5,
  "eyes-seq-mui": 2,
  "eyes-seq-shines": 3,
  "eyes-seq-focus": FOCUS_AT,
  "eyes-seq-fade-pupils": getPupilFadeAt(FOCUS_AT),
  "eyes-seq-logo-layer": 4,
  "eyes-seq-brows-decolor": 4.5,
  "eyes-seq-eyes-out": 4.7,
  "eyes-seq-logo-fill": 5.55,
};

export function resetEyesSequencePhases(container) {
  if (!container) return;
  EYES_SEQ_PHASES.forEach((phase) => container.classList.remove(phase));
  container.classList.remove("eyes-seq-pupils-settled");
}

export function createEyesSequenceTimeline(container, { reduced = false } = {}) {
  if (!container?.querySelector("#my-svg")) return null;

  resetEyesSequencePhases(container);
  resetFocusMorph(container);
  killFocusMorph(null, container._pupilFadeTween);
  container._pupilFadeTween = null;

  const svg = container.querySelector("#my-svg");

  const addPhase = (phase) => {
    container.classList.add(phase);
    if (phase === "eyes-seq-fade-pupils") {
      container._pupilFadeTween = runPupilFade(svg, { reduced });
    }
  };

  const tl = gsap.timeline(reduced ? { paused: true } : undefined);

  EYES_SEQ_PHASES.forEach((phase) => {
    const at = PHASE_AT[phase];
    if (phase === "eyes-seq-focus") {
      appendFocusMorphToTimeline(tl, container, at, { reduced });
      return;
    }
    tl.call(() => addPhase(phase), null, at);
  });

  return tl;
}

export function killEyesSequenceTimeline(timeline, container) {
  timeline?.kill();
  if (!container) return;
  killFocusMorph(container._focusMorphTweens, container._pupilDropTween);
  container._focusMorphTweens = null;
  container._pupilDropTween = null;
  killFocusMorph(null, container._pupilFadeTween);
  container._pupilFadeTween = null;
}
