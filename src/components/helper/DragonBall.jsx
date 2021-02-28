import React from "react"
import "../../styles/DragonBall.scss"

export default () => {
    return (
        <div class="dragon-ball">
            <div class="dragon-ball__oval-shadow"></div>
            <div class="dragon-ball__star-container">
                <div className="star star-center"></div>
                {/* <div class="star star__top-left"></div>
                <div class="star star__top-right"></div>
                <div class="star star__btm-left"></div>
                <div class="star star__btm-right"></div> */}
            </div>
            <div class="dragon-ball__btm-shadow"></div>
        </div>
    )
}