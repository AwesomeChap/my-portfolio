import gsap from "gsap";
import { EYES_SEQ_PHASES, PHASE_AT } from "./eyesSequenceConfig";
import { getEyesPlayback, killEyesPlayback, clearEyesPlayback } from "./eyesPlayback";
import { appendFocusMorphToTimeline, runPupilFade, resetFocusMorph, snapPupilsHidden } from "./eyesFocusMorph";
import { appendLogoMorphToTimeline, resetLogoMorph } from "./eyesLogoMorph";

export { EYES_SEQ_PHASES, PHASE_AT } from "./eyesSequenceConfig";

export function resetEyesSequencePhases(container) {
  if (!container) return;
  EYES_SEQ_PHASES.forEach((phase) => container.classList.remove(phase));
  container.classList.remove("eyes-seq-pupils-settled");
}

export function createEyesSequenceTimeline(container, { reduced = false } = {}) {
  if (!container?.querySelector("#my-svg")) return null;

  const svg = container.querySelector("#my-svg");
  const session = getEyesPlayback(container);

  resetEyesSequencePhases(container);
  resetFocusMorph(container);
  resetLogoMorph(container);
  killEyesPlayback(container);

  const onPhase = (phase) => {
    container.classList.add(phase);

    if (phase === "eyes-seq-fade-pupils") {
      session.pupilFadeTween = runPupilFade(svg, { reduced });
    }

    if (phase === "eyes-seq-eyes-out") {
      session.pupilFadeTween?.kill();
      session.pupilFadeTween = null;
      snapPupilsHidden(svg);
    }
  };

  const tl = gsap.timeline(reduced ? { paused: true } : undefined);

  EYES_SEQ_PHASES.forEach((phase) => {
    const at = PHASE_AT[phase];

    if (phase === "eyes-seq-focus") {
      appendFocusMorphToTimeline(tl, container, at, { reduced });
      return;
    }

    if (phase === "eyes-seq-eyes-out") {
      tl.call(() => onPhase(phase), null, at);
      appendLogoMorphToTimeline(tl, container, { reduced });
      return;
    }

    tl.call(() => onPhase(phase), null, at);
  });

  return tl;
}

export function killEyesSequenceTimeline(timeline, container) {
  timeline?.kill();
  if (container) killEyesPlayback(container);
}

export function disposeEyesSequence(container) {
  resetEyesSequencePhases(container);
  resetFocusMorph(container);
  resetLogoMorph(container);
  clearEyesPlayback(container);
}
