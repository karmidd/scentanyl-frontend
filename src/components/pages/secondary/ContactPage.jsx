import PageLayout from "../../primary/PageLayout.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import React from "react";

export default function ContactPage() {
    return (
        <PageLayout headerNum={0}>
            <HeroSection primaryText={"Contact Us"} secondaryText={"Last updated: July 30, 2025"} />
            <div className="py-4 px-9 sm:px-6 lg:px-10 mt-10 bg-black/34 backdrop-blur-md">
                <BlurText
                    text={"PLACEHOLDER"}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="mt-10 mb-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />
            </div>
        </PageLayout>
    );
}