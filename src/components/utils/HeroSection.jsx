import BlurText from "../../blocks/TextAnimations/BlurText/BlurText.jsx";
import React from "react";

export default function HeroSection({ primaryText, secondaryText }) {
    return (
        <div className="space-y-6 text-center">
            <BlurText
                text={primaryText}
                delay={100}
                animateBy="words"
                direction="top"
                className="text-white flex justify-center text-6xl lg:text-7xl font-bold leading-tight"
            />
            {secondaryText && <BlurText
                text={secondaryText}
                delay={80}
                animateBy="words"
                direction="bottom"
                className="flex justify-center text-2xl text-gray-200 max-w-3xl mx-auto"
            />}
        </div>
    );
}