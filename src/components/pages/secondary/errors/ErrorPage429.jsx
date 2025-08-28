import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from "../../../primary/PageLayout.jsx";
import BlurText from "../../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import { useTheme } from "../../../contexts/ThemeContext.jsx";

const ErrorPage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        document.title = "429 - Rate Limit Reached | Scentanyl";
    }, []);

    return (
        <PageLayout headerNum={-1}>
            <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 py-16 sm:py-24 md:py-32">
                <BlurText
                    text="429"
                    delay={100}
                    animateBy="words"
                    direction="top"
                    className="text-shadow-lg flex justify-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-bold"
                />
                <BlurText
                    text="Rate Limit Reached"
                    delay={200}
                    animateBy="words"
                    direction="bottom"
                    className="text-shadow-lg flex justify-center text-2xl sm:text-3xl md:text-4xl text-gray-200"
                />
                <BlurText
                    text="You've made too many requests. Please wait and try again."
                    delay={100}
                    animateBy="words"
                    direction="bottom"
                    className="text-shadow-sm flex justify-center text-base sm:text-lg md:text-xl text-gray-300"
                />
                <button
                    onClick={() => navigate('/')}
                    className={`text-shadow-md shadow-lg cursor-pointer ${theme.button.primary} ${theme.shadow.button} text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl mt-8`}
                >
                    Go to Homepage
                </button>
            </div>
        </PageLayout>
    );
};

export default ErrorPage;