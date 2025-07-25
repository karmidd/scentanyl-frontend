// Solution: Dual-layer background with smooth transition
import Silk from "../../blocks/Backgrounds/Silk/Silk.jsx";
import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const Background = () => {
    const { theme, isDarkMode } = useTheme();
    const [showingLayer, setShowingLayer] = useState('A');
    const [layerAColor, setLayerAColor] = useState(theme.background.primary);
    const [layerBColor, setLayerBColor] = useState(theme.background.primary);
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        // Skip the transition effect on initial load
        if (!hasInitialized) {
            setHasInitialized(true);
            return;
        }

        const newColor = theme.background.primary;

        // Update the hidden layer with new color
        if (showingLayer === 'A') {
            setLayerBColor(newColor);
        } else {
            setLayerAColor(newColor);
        }

        // Small delay to ensure the hidden layer is ready
        const timer = setTimeout(() => {
            setShowingLayer(prev => prev === 'A' ? 'B' : 'A');
        }, 50);

        return () => clearTimeout(timer);
    }, [isDarkMode]); // Trigger on theme change

    return (
        <div className="fixed top-0 left-0 w-screen h-screen z-0">
            {/* Fallback solid background to prevent white flash - behind everything */}
            <div
                className="absolute inset-0 z-0"
                style={{ backgroundColor: theme.background.primary }}
            />

            {/* Layer A */}
            <div
                className={`absolute inset-0 z-10 transition-opacity duration-500 ${
                    showingLayer === 'A' ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <Silk
                    key={`A-${layerAColor}`}
                    speed={5}
                    scale={1}
                    color={layerAColor}
                    noiseIntensity={0.3}
                    rotation={1.54}
                />
            </div>

            {/* Layer B */}
            <div
                className={`absolute inset-0 z-10 transition-opacity duration-500 ${
                    showingLayer === 'B' ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <Silk
                    key={`B-${layerBColor}`}
                    speed={5}
                    scale={1}
                    color={layerBColor}
                    noiseIntensity={0.3}
                    rotation={1.54}
                />
            </div>
        </div>
    );
};

export default Background;