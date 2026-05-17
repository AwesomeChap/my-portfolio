import React from "react";
import "../../styles/DragonBall.scss";

export default function DragonBall({ onClick, hidden = false, enter = false }) {
  const className = [
    "dragon-ball",
    hidden && "dragon-ball--hidden",
    enter && !hidden && "dragon-ball--enter",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-label="Play dragon ball animation"
      title="UI Goku Eyes to JK Transition"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
    >
      <div className="dragon-ball__oval-shadow" />
      <div className="dragon-ball__star-container">
        <i className="fas fa-star star" />
      </div>
      <div className="dragon-ball__btm-shadow" />
    </button>
  );
}
