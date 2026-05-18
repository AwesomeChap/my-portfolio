/** Per-container runtime for eyes sequence tweens (no DOM property hacks). */

const sessions = new WeakMap();

export function getEyesPlayback(container) {
  if (!container) return null;
  let session = sessions.get(container);
  if (!session) {
    session = {
      focusPathTweens: [],
      logoMorphTweens: [],
      pupilFadeTween: null,
    };
    sessions.set(container, session);
  }
  return session;
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

export function killEyesPlayback(container) {
  const session = sessions.get(container);
  if (!session) return;

  stopKuteTweens(session.focusPathTweens);
  stopKuteTweens(session.logoMorphTweens);
  session.pupilFadeTween?.kill?.();

  session.focusPathTweens = [];
  session.logoMorphTweens = [];
  session.pupilFadeTween = null;
}

export function clearEyesPlayback(container) {
  killEyesPlayback(container);
  sessions.delete(container);
}
