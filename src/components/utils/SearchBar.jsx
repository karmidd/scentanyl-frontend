import RandomFragranceButton from "./RandomFragranceButton.jsx";
import React from "react";
import {useTheme} from "../contexts/ThemeContext.jsx";

export default function SearchBar({size, onSubmit, value, onChange, message, includeRandomButton = false}) {
    const { theme } = useTheme();
    return (
        <form onSubmit={onSubmit} className={`max-w-${size}xl mx-auto`}>
            <div className="flex items-center gap-4">
                <div className="relative flex-1 group">
                    <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder={message}
                        className={`
                                            w-full px-8 py-6 text-2xl ${theme.bg.input} 
                                            ${theme.border.primary} ${theme.text.primary}
                                            border rounded-2xl focus:outline-none
                                            transition-all duration-300 ${theme.border.hover} 
                                            placeholder-gray-500
                                        `}
                    />
                    <button
                        type="submit"
                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${theme.button.primary} p-4 rounded-xl transition-all duration-300 hover:scale-105`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
                {includeRandomButton && <RandomFragranceButton className={`cursor-pointer group relative inline-flex items-center justify-center w-24 h-24 text-xl font-bold ${theme.text.primary} bg-gradient-to-r ${theme.randomDiscoveryButton.primary} rounded-full shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-gray-500/30`} />}
            </div>
        </form>
    );
}