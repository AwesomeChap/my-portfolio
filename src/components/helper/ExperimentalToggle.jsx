import React from 'react';
import {
  isExperimentalModeActive,
  toggleExperimentalMode,
} from './experimentalMode';
import { cx, iconGlassButtonClasses } from './glassCtaButton';
import '../../styles/experimental.scss';

function ExperimentalIcon() {
  return (
    <svg
      className="experimental-toggle__icon"
      viewBox="0 0 40 56"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="experimental-toggle__flask"
        d="M15 7h10v11l9.5 33.5a3.5 3.5 0 0 1-3.5 3.5h-22a3.5 3.5 0 0 1-3.5-3.5L15 18V7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="experimental-toggle__liquid"
        d="M12.5 36.5c2.2-2.2 4.4-2.2 6.6 0s4.4 2.2 6.6 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ExperimentalToggle() {
  const [active, setActive] = React.useState(isExperimentalModeActive);

  React.useEffect(() => {
    const onChange = () => setActive(isExperimentalModeActive());
    window.addEventListener('portfolio-experimental-change', onChange);
    return () => window.removeEventListener('portfolio-experimental-change', onChange);
  }, []);

  return (
    <button
      type="button"
      className={cx(
        'experimental-toggle',
        iconGlassButtonClasses(),
        active && 'experimental-toggle--active'
      )}
      onClick={toggleExperimentalMode}
      aria-pressed={active}
      aria-label={active ? 'Disable experimental mode' : 'Enable experimental mode'}
      title={active ? 'Experimental mode on' : 'Experimental mode off'}
    >
      <ExperimentalIcon />
    </button>
  );
}
