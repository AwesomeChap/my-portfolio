/** Single schedule for the eyes → logo sequence (seconds from sketch start). */

export const FOCUS_AT = 3.5;

export const PHASE_AT = {
  "eyes-seq-ui": 0.7,
  "eyes-seq-lashes-closed": 1.4,
  "eyes-seq-eyes-open": 1.5,
  "eyes-seq-mui": 2,
  "eyes-seq-shines": 3,
  "eyes-seq-focus": FOCUS_AT,
  "eyes-seq-fade-pupils": FOCUS_AT + 0.5,
  "eyes-seq-logo-layer": 4,
  "eyes-seq-brows-decolor": 4.5,
  "eyes-seq-eyes-out": 4.7,
  "eyes-seq-logo-fill": 5.55,
};

export const EYES_SEQ_PHASES = Object.keys(PHASE_AT);

export const FOCUS_MORPH = {
  durationMs: 200,
  morphIndex: 75,
  easing: "linear",
};

export const LOGO_MORPH = {
  at: PHASE_AT["eyes-seq-eyes-out"],
  durationMs: 1000,
  morphIndex: 75,
  easing: "easingQuinticInOut",
};

export const PUPIL = {
  dropDuration: FOCUS_MORPH.durationMs / 1000,
  fadeDuration: 1.5,
};
