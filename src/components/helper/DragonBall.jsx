import React from "react"
import "../../styles/DragonBall.scss"

export default (props) => {

    const onClick = () => props.onClick();

    return (
        <button type="button" onClick={onClick} className="dragon-ball" aria-label="Play dragon ball animation" title="UI Goku Eyes to JK Transition">
            <div className="dragon-ball__oval-shadow"></div>
            <div className="dragon-ball__star-container">
                <i className="fas fa-star star"></i>
            </div>
            <div className="dragon-ball__btm-shadow"></div>
        </button>
    )
} 