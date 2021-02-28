import React, { useState, useEffect } from "react";
import "../../styles/Eyes.scss";
import Vivus from "vivus";
import KUTE from "kute.js";
import LogoSvgOutline from "./LogoSvgOutline";
import EyesSvg from "./EyesSvg";
import DragonBall from "./DragonBall";

export default () => {
    const [show, setShow] = useState(true);

    const MORPH_DELAY = 4700;

    useEffect(() => {
        if (show) {
            new Vivus("my-svg", { type: "sync", duration: 50 });
            const easing_fn = 'easingQuinticInOut';
            const DURATION = 1000;
            const MORPH_INDEX = 75;
            setTimeout(() => {
                KUTE.fromTo('#left-eye-brow-copy', { path: '#left-eye-brow-copy' }, { path: '#j1' }, { easing: easing_fn, duration: DURATION, morphIndex: MORPH_INDEX }).start();
                KUTE.fromTo('#left-eye-open-copy', { path: '#left-eye-open-copy' }, { path: '#j2' }, { easing: easing_fn, duration: DURATION, morphIndex: MORPH_INDEX }).start();
                KUTE.fromTo('#left-eye-open-clone-copy', { path: '#left-eye-open-clone-copy' }, { path: '#j3' }, { easing: easing_fn, duration: DURATION, morphIndex: MORPH_INDEX }).start();
                KUTE.fromTo('#right-eye-brow-copy', { path: '#right-eye-brow-copy' }, { path: '#k1' }, { easing: easing_fn, duration: DURATION, morphIndex: MORPH_INDEX }).start();
                KUTE.fromTo('#right-eye-open-copy', { path: '#right-eye-open-copy' }, { path: '#k2' }, { easing: easing_fn, duration: DURATION, morphIndex: MORPH_INDEX }).start();
                KUTE.fromTo('#right-eye-open-clone-copy', { path: '#right-eye-open-clone-copy' }, { path: '#k3' }, { easing: easing_fn, duration: DURATION, morphIndex: MORPH_INDEX }).start();
            }, MORPH_DELAY);
        }
    }, [show])

    return (
        <div className="eyes-wrapper">
            <DragonBall />
            <button onClick={() => setShow(!show)}>Toggle</button>
            {show && (
                <div className="eyes-container">
                    <LogoSvgOutline />
                    <EyesSvg />
                </div>
            )}
        </div>
    )
}