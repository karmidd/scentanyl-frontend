import PageLayout from "../../primary/PageLayout.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import React, {useEffect} from "react";

export default function AboutPage() {
    useEffect(() => {
        document.title = `About | Scentanyl`;
    }, []);
    return (
        <PageLayout headerNum={0}>
            <HeroSection primaryText={"About Scentanyl"} />
            <div className="py-4 px-9 sm:px-6 lg:px-10 mt-10 bg-black/34 backdrop-blur-md">
                <BlurText
                    text={"\"I started my fragrance journey in the fall of 2023. Like many newcomers, I dove deep—exploring scent profiles, following releases, and slowly building a collection. But as I searched for a place to keep up with the fragrance world, I noticed something frustrating: most websites felt outdated, cluttered, or just not built with the user in mind."}
                    delay={10}
                    animateBy="words"
                    direction="top"
                    className="text-shadow-lg mt-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />

                <BlurText
                    text={"They lacked the clean, modern experience I was looking for. Still, I found myself relying on them simply because there were no better alternatives. That’s why I created Scentanyl — a fragrance platform built from the ground up with simplicity, clarity, and modern design at its core. It’s a place where you can explore fragrances, brands, notes, and more without being overwhelmed.\""}
                    delay={10}
                    animateBy="words"
                    direction="top"
                    className="text-shadow-lg mt-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />

                <BlurText
                    text={"— Founder & Developer of  Scentanyl"}
                    delay={10}
                    animateBy="words"
                    direction="top"
                    className="italic text-shadow-lg mt-8 mb-15 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />

                <BlurText
                    text={"Scentanyl aims to achieve one goal: to give fragrance lovers a seamless and elegant way to discover what they’re looking for. Whether you're just beginning or deep in the world of perfume, Scentanyl is made for you."}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="text-shadow-lg mt-10 mb-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />
            </div>
        </PageLayout>
    );
}