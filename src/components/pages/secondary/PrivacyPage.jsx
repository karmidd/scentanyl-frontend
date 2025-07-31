import PageLayout from "../../utils/PageLayout.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import React from "react";

export default function PrivacyPage() {
    return (
        <PageLayout headerNum={0}>
            <HeroSection primaryText={"Privacy Policy"} secondaryText={"Last updated: July 30, 2025"} />
            <div className="py-4 px-9 mb-20 sm:px-6 lg:px-10 mt-10 bg-black/34 backdrop-blur-md">
                <BlurText
                    text={"At Scentanyl, we respect your privacy. This website does not collect personal information, does not use cookies, and does not track users."}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="mt-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />
                <BlurText
                    text={"What we don’t do:"}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="mt-5 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />
                <BlurText
                    text={"• We do not collect names, emails, or other personal details."}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="mt-4 pl-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />
                <BlurText
                    text={"• We do not require user accounts or logins."}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="mt-1 pl-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />
                <BlurText
                    text={"• We do not use cookies or third-party trackers."}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="mt-1 pl-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />
                <BlurText
                    text={"• We do not display advertisements."}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="mt-1 mb-10 pl-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />
            </div>
        </PageLayout>
    );
}