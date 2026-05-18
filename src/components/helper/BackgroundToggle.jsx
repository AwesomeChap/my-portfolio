import React from 'react';
import {
  isMobileLiquidBgActive,
  setMobileLiquidBgEnabled,
  subscribeMobileLiquidBg,
} from './mobileBackgroundMode';
import { cx, themeToggleContainerClasses, themeToggleTileClasses } from './glassCtaButton';
import '../../styles/mobile-background.scss';

function LiquidGradientSnap() {
  return <span className="theme-toggle__liquid-snap" aria-hidden="true" />;
}

function DarkThemeSnap() {
  return <span className="theme-toggle__dark-snap" aria-hidden="true" />;
}

export default function BackgroundToggle() {
  const [liquidActive, setLiquidActive] = React.useState(() => isMobileLiquidBgActive());

  React.useEffect(() => subscribeMobileLiquidBg(setLiquidActive), []);

  const switchToLiquid = () => setMobileLiquidBgEnabled(true);
  const switchToDark = () => setMobileLiquidBgEnabled(false);

  return (
    <div
      className={cx('theme-toggle--solo', themeToggleContainerClasses())}
      role="group"
      aria-label="Background theme"
    >
      {liquidActive ? (
        <button
          type="button"
          className={themeToggleTileClasses()}
          onClick={switchToDark}
          aria-label="Switch to standard dark background"
          title="Standard dark"
        >
          <DarkThemeSnap />
        </button>
      ) : (
        <button
          type="button"
          className={themeToggleTileClasses()}
          onClick={switchToLiquid}
          aria-label="Switch to liquid gradient background"
          title="Liquid gradient"
        >
          <LiquidGradientSnap />
        </button>
      )}
    </div>
  );
}
