import React, { useState, useEffect } from "react";
import "../../styles/Eyes.scss";
import Vivus from "vivus";
import KUTE from "kute.js";
import LogoSvgOutline from "./LogoSvgOutline";
import EyesSvg from "./EyesSvg";
import DragonBall from "./DragonBall";

export default (props) => {
    const [show, setShow] = useState(false);

    const MORPH_DELAY = 4700;
    const DURATION = 1000;
    const MORPH_INDEX = 75;
    const TOTAL_ANIM_DURATION = 8000;

    useEffect(() => {
        if (show) {
            new Vivus("my-svg", { type: "sync", duration: 50, 
            // animTimingFunction: Vivus.EASE 
        });
            const easing_fn = 'easingQuinticInOut';

            setTimeout(() => {
                KUTE.fromTo('#left-eye-brow-copy', { path: '#left-eye-brow-copy' }, { path: '#j1' }, { easing: easing_fn, duration: DURATION, morphIndex: MORPH_INDEX }).start();
                KUTE.fromTo('#left-eye-open-copy', { path: '#left-eye-open-copy' }, { path: '#j2' }, { easing: easing_fn, duration: DURATION, morphIndex: MORPH_INDEX }).start();
                KUTE.fromTo('#left-eye-open-clone-copy', { path: '#left-eye-open-clone-copy' }, { path: '#j3' }, { easing: easing_fn, duration: DURATION, morphIndex: MORPH_INDEX }).start();
                KUTE.fromTo('#right-eye-brow-copy', { path: '#right-eye-brow-copy' }, { path: '#k1' }, { easing: easing_fn, duration: DURATION, morphIndex: MORPH_INDEX }).start();
                KUTE.fromTo('#right-eye-open-copy', { path: '#right-eye-open-copy' }, { path: '#k2' }, { easing: easing_fn, duration: DURATION, morphIndex: MORPH_INDEX }).start();
                KUTE.fromTo('#right-eye-open-clone-copy', { path: '#right-eye-open-clone-copy' }, { path: '#k3' }, { easing: easing_fn, duration: DURATION, morphIndex: MORPH_INDEX }).start();
            }, MORPH_DELAY);
            setTimeout(() => {
                setShow(false);
            }, TOTAL_ANIM_DURATION)
        }
    }, [show])

    const onDBClick = () => {
        setShow(!show);
        props.trackClickEvent("Button", "View dragon ball animation")
    }

    return (
        <div className="eyes-wrapper">
            {!show && <DragonBall onClick={onDBClick} />}
            {show && (
                <div className="eyes-container">
                    <div onClick={() => setShow(!show)} className="hide-eyes">
                        <div className="cross"/>
                        <svg><circle r="18" cx="20" cy="20"></circle></svg>
                        <svg className="countdown"><circle r="18" cx="20" cy="20"></circle></svg>
                    </div>
                    <LogoSvgOutline />
                    <EyesSvg />
                </div>
            )}
        </div>
    )
}