import React from "react";
import {useTheme} from "../contexts/ThemeContext.jsx";

export default function LoadMoreButton({onClick, disabled, message}) {
    const { theme } = useTheme();
    return (
        <div className="flex justify-center pt-12">
            <button
                onClick={onClick}
                disabled={disabled}
                className={`cursor-pointer group relative inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-white ${theme.button.primary} rounded-xl ${theme.shadow.button} transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border ${theme.border.accent} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0`}
            >
                <div className="absolute inset-0 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                    {disabled ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            <span>{message}</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </>
                    )}
                </div>
            </button>
        </div>
    );
}