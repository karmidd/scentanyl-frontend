import Background from "../../primary/Background.jsx";
import React from "react";
import {useTheme} from "../../contexts/ThemeContext.jsx";
export default function LoadingPage() {
    const {theme} = useTheme();
    return (<>
        <Background/>
        <div className="min-h-screen bg-black flex items-center justify-center font-['Source_Serif_4',serif]">
            <div className="text-center space-y-4 z-20">
                <div
                    className={`animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 ${theme.border.accent} mx-auto`}></div>
                <div className="text-white text-xl">Loading notes and analyzing fragrances...</div>
                <div className="text-gray-200">This may take a moment</div>
            </div>
        </div>
    </>);
}