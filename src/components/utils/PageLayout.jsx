import Background from "../primary/Background.jsx";
import Header from "../primary/Header.jsx";
import React from "react";
import Footer from "../primary/Footer.jsx";
import {useTheme} from "../contexts/ThemeContext.jsx";

export default function PageLayout({ headerNum = 0, children, style }) {
    const { theme } = useTheme();
    return (
        <>
            <div className="relative min-h-screen overflow-hidden">
                <Background />
                <div className="relative z-10 font-['Viaoda_Libre',serif] text-base sm:text-lg md:text-xl lg:text-2xl">
                    <div className={theme.text.primary}>
                        {/* Header */}
                        <Header page={headerNum} />
                        {/* Main Content */}
                        <main className="mt-5 max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pt-[80px] sm:pt-[100px] md:pt-[160px]">
                            {children}
                        </main>
                    </div>
                </div>
                {style}
            </div>
            {/* Footer */}
            <Footer/>
        </>
    );
}