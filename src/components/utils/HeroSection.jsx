import BlurText from "../../blocks/TextAnimations/BlurText/BlurText.jsx";
import React from "react";
import { useTheme } from "../contexts/ThemeContext.jsx";

export default function HeroSection({ primaryText, secondaryText }) {
    const { isDarkMode } = useTheme();
    const ink  = isDarkMode ? '#ece6d6' : '#1a1612';
    const ink3 = isDarkMode ? '#5a5346' : '#a39a8a';

    return (
        <>
            <style>{`
                .hs-primary {
                    font-family: 'Playfair Display','Georgia',serif !important;
                    font-style: italic !important; font-weight: 400 !important;
                    font-size: clamp(48px,8vw,112px) !important;
                    line-height: .92 !important; letter-spacing: -.025em !important;
                    color: ${ink} !important;
                }
                .hs-secondary {
                    font-family: 'JetBrains Mono',ui-monospace,monospace !important;
                    font-size: 10px !important; letter-spacing: .28em !important;
                    text-transform: uppercase !important;
                    color: ${ink3} !important; margin-top: 24px !important;
                }
            `}</style>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <BlurText
                    text={primaryText}
                    delay={100}
                    animateBy="words"
                    direction="top"
                    className="hs-primary capitalize justify-center"
                />
                {secondaryText && (
                    <BlurText
                        text={secondaryText}
                        delay={80}
                        animateBy="words"
                        direction="bottom"
                        className="hs-secondary justify-center"
                    />
                )}
            </div>
        </>
    );
}
