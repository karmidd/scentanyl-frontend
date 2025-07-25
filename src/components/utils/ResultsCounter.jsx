import BlurText from "../../blocks/TextAnimations/BlurText/BlurText.jsx";
import React from "react";

export default function ResultsCounter({ displayedCount, filteredCount, type}) {
    return (
        <div className="text-center">
            <BlurText
                text={`Showing ${displayedCount} of ${filteredCount} ${type}`}
                delay={150}
                animateBy="words"
                direction="bottom"
                className="flex justify-center text-xl text-gray-200"
            />
        </div>
    );
}