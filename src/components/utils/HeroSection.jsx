import BlurText from "../../blocks/TextAnimations/BlurText/BlurText.jsx";
import React from "react";

export default function HeroSection({ primaryText, secondaryText }) {
    return (
        <div className="space-y-3 sm:space-y-4 md:space-y-6 text-center">
            <BlurText
                text={primaryText}
                delay={100}
                animateBy="words"
                direction="top"
                className="capitalize text-shadow-lg text-white flex justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight px-2"
            />
            {secondaryText && <BlurText
                text={secondaryText}
                delay={80}
                animateBy="words"
                direction="bottom"
                className="text-shadow-lg flex justify-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-200 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
            />}
        </div>
    );
}