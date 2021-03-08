import React from "react"
import "../../styles/DragonBall.scss"

export default (props) => {

    const onClick = () => props.onClick();

    return (
        <div onClick={onClick} className="dragon-ball">
            <div className="dragon-ball__oval-shadow"></div>
            <div className="dragon-ball__star-container">
                <i className="fas fa-star star"></i>
            </div>
            <div className="dragon-ball__btm-shadow"></div>
        </div>
    )
} 