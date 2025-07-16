import Background from "../primary/Background.jsx";
import React from "react";
export default function LoadingPage() {
    return (<>
        <Background/>
        <div className="min-h-screen bg-black flex items-center justify-center font-['Viaoda_Libre',serif]">
            <div className="text-center space-y-4 z-20">
                <div
                    className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-800 mx-auto"></div>
                <div className="text-white text-xl">Loading notes and analyzing fragrances...</div>
                <div className="text-gray-400">This may take a moment</div>
            </div>
        </div>
    </>);
}