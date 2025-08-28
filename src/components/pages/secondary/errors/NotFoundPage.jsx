import PageLayout from "../../../primary/PageLayout.jsx";
import BlurText from "../../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import React from "react";

export default function NotFoundPage({ headerNum, mainMessage, secondaryMessage }) {
    return (
        <PageLayout headerNum={headerNum}>
                <div className="text-center space-y-4 sm:space-y-6 md:space-y-8">
                    <BlurText
                        text={mainMessage}
                        delay={150}
                        animateBy="words"
                        direction="bottom"
                        className="text-shadow-lg text-3xl text-white sm:text-4xl md:text-5xl lg:text-6xl pt-32 sm:pt-40 md:pt-60 font-bold mb-2 sm:mb-3 md:mb-4 text-center flex justify-center"
                    />
                    <BlurText
                        text={secondaryMessage}
                        delay={80}
                        animateBy="words"
                        direction="bottom"
                        className="text-shadow-md text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl pt-2 sm:pt-3 md:pt-5 mb-2 sm:mb-3 md:mb-4 text-center flex justify-center"
                    />
                </div>
        </PageLayout>
    );
}