import PageLayout from "../../primary/PageLayout.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import React, {useEffect} from "react";

export default function ContactPage() {
    useEffect(() => {
        document.title = `Contact Us | Scentanyl`;
    }, []);

    return (
        <PageLayout headerNum={0}>
            <HeroSection primaryText={"Contact Us"} secondaryText={"We'd love to hear from you"} />
            <div className="py-4 px-9 sm:px-6 lg:px-10 mt-10 bg-black/34 backdrop-blur-md">
                <BlurText
                    text={"Whether you're a brand looking to be featured, a fragrance enthusiast noticing a missing scent, or have any business inquiries, we're here to help. Your feedback helps us build a better platform for the fragrance community."}
                    delay={10}
                    animateBy="words"
                    direction="top"
                    className="text-shadow-lg mt-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />

                <BlurText
                    text={"Get in touch for:"}
                    delay={10}
                    animateBy="words"
                    direction="top"
                    className="text-shadow-lg mt-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />

                <BlurText
                    text={"• Adding your brand or fragrances to our database"}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="text-shadow-lg mt-4 pl-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />
                <BlurText
                    text={"• Reporting missing or incorrect fragrance information"}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="text-shadow-lg mt-1 pl-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />
                <BlurText
                    text={"• Business partnerships and collaborations"}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="text-shadow-lg mt-1 pl-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />
                <BlurText
                    text={"• Technical issues or suggestions"}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="text-shadow-lg mt-1 pl-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />
                <BlurText
                    text={"• General feedback and feature requests"}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="text-shadow-lg mt-1 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2 pl-10"
                />

                <BlurText
                    text={"Reach out to us at:"}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="text-shadow-lg mt-10 flex justify-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />

                <div className="mt-4 mb-10 flex justify-center">
                    <a
                        href="mailto:contact@scentanyl.com"
                        className="text-shadow-lg text-blue-400 hover:text-blue-300 transition-colors duration-300 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold hover:scale-105 transform transition-transform"
                    >
                        <BlurText
                            text={"contact@scentanyl.com"}
                            delay={10}
                            animateBy="words"
                            direction="bottom"
                            className="flex justify-center"
                        />
                    </a>
                </div>

                <BlurText
                    text={"We aim to respond to all inquiries within 48 hours. Thank you for helping us make Scentanyl the best fragrance discovery platform."}
                    delay={10}
                    animateBy="words"
                    direction="bottom"
                    className="text-shadow-lg mt-6 mb-10 flex justify-left text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                />
            </div>
        </PageLayout>
    );
}