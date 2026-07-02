import Background from "./Background.jsx";
import Header from "./Header.jsx";
import React from "react";
import Footer from "./Footer.jsx";
import {useTheme} from "../contexts/ThemeContext.jsx";

export default function PageLayout({ headerNum = 0, children, style }) {
    const { theme } = useTheme();
    return (
        <>
            <div className="relative min-h-screen overflow-hidden">
                <Background />
                <div className="relative z-10 font-['Source_Serif_4',serif] text-base sm:text-lg md:text-xl lg:text-2xl">
                    <div className={theme.text.primary}>
                        {/* Header */}
                        <Header page={headerNum} />
                        {/* Main Content */}
                        <main className="max-w-[1480px] mx-auto px-4 md:px-8 py-6 pt-[80px]">
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