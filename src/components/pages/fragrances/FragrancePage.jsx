import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Background from "../../primary/Background.jsx";
import Header from "../../primary/Header.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import RandomFragranceButton from "../../utils/RandomFragranceButton.jsx";
import LoadingPage from "../LoadingPage.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";

const FragrancePage = () => {
    // For demo purposes, using props. In a real app, you'd get these from URL params
    const { brand, name } = useParams();
    const [fragrance, setFragrance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        const fetchFragrance = async () => {
            try {
                setLoading(true);
                // Replace with your actual backend URL
                const response = await fetch(`http://localhost:8080/fragrances/${brand}/${name}`);
                if (!response.ok) {
                    throw new Error(`Fragrance "${name}" from the brand "${brand}" not found`);
                }
                const data = await response.json();
                if (!data || !data.name) {
                    throw new Error(`Fragrance "${name}" from the brand "${brand}" wasn't found`);
                }
                setFragrance(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFragrance();
    }, [brand, name]);

    if (loading) {
        return (
            <LoadingPage/>
        );
    }

    if (error) {
        return (
            <div className="relative min-h-screen overflow-hidden">
                <Background />
                <div className="relative z-10 font-['Viaoda_Libre',serif] text-2xl">
                    {<div className="text-white">
                        {/* Header */}
                        <Header page={1}/>
                        {/* Main Content */}
                        <main className="max-w-4xl mx-auto px-4 py-8">
                            <div className="text-center space-y-8">
                                <BlurText
                                    text="Fragrance Not Found"
                                    delay={150}
                                    animateBy="words"
                                    direction="bottom"
                                    className="text-6xl pt-60 font-bold mb-4 text-center flex justify-center space-y-8"
                                />
                                <BlurText
                                    text={error}
                                    delay={80}
                                    animateBy="words"
                                    direction="bottom"
                                    className="text-gray-400 text-2xl pt-5 mb-4 text-center flex justify-center space-y-8"
                                />
                            </div>
                        </main>
                    </div>}
                </div>
            </div>
        );
    }

    const handleNoteClick = (note) => {
        navigate(`/notes/${encodeURIComponent(note)}`);
    };

    const handleAccordClick = (accord) => {
        navigate(`/accords/${encodeURIComponent(accord)}`);
    };

    const handleBrandClick = (brand) => {
        navigate(`/brands/${encodeURIComponent(brand)}`);
    };

    const parseNotes = (notes) => {
        if (!notes) return [];
        return notes.split(',').map(note => note.trim()).filter(note => note);
    };

    const parseAccords = (accords) => {
        if (!accords) return [];
        return accords.split(',').map(accord => accord.trim()).filter(accord => accord);
    };

    const parsePerfumers = (perfumers) => {
        if (!perfumers) return [];
        return perfumers.split(',').map(perfumer => perfumer.trim()).filter(perfumer => perfumer);
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Background />
            <div className="relative z-10 font-['Viaoda_Libre',serif] text-2xl">
                {<div className={theme.text.primary}>
                    {/* Header */}
                    <Header page={1}/>
                    {/* Main Content */}
                    <main className="max-w-4xl mx-auto px-4 py-8 pt-[160px]">
                        <div className="text-center space-y-8">
                            {/* Title Section */}
                            <div className="space-y-6">
                                <BlurText
                                    text={fragrance?.name}
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="flex justify-center text-6xl text-white lg:text-7xl font-bold leading-tight"
                                />
                                <div className="flex items-center justify-center space-x-1">
                                    <BlurText
                                        text="by"
                                        delay={200}
                                        animateBy="words"
                                        direction="top"
                                        className="text-3xl text-gray-300 font-semibold"
                                    />
                                    <button onClick={() => handleBrandClick(fragrance?.brand)} className="cursor-pointer hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-lg px-2 py-1">
                                        <BlurText
                                            text={fragrance?.brand}
                                            delay={250}
                                            animateBy="words"
                                            direction="top"
                                            className={`text-3xl ${theme.text.accent} font-semibold`}
                                        />
                                    </button>
                                    <span className={`px-4 py-2 ${fragrance.gender === "men" ? "bg-blue-800" : fragrance.gender === "women" ? "bg-pink-600" : "bg-gradient-to-r from-pink-600 via-purple-500 to-blue-800"} rounded-full text-xl font-medium`}>
                                        <BlurText
                                            text={fragrance?.gender}
                                            delay={300}
                                            animateBy="words"
                                            direction="top"
                                            className="text-xl text-white font-medium"
                                        />
                                    </span>
                                </div>
                                {fragrance?.perfumerNames && (
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {parsePerfumers(fragrance.perfumerNames).map((perfumer, index) => (
                                            <span key={index} className="inline-flex gap-2 items-center">
                                                <BlurText
                                                    text={`Perfumer(s): `}
                                                    delay={200}
                                                    animateBy="words"
                                                    direction="top"
                                                    className="text-gray-200 text-2xl"
                                                />
                                                <BlurText
                                                    text={perfumer?.replaceAll(' | ', ', ')}
                                                    delay={200}
                                                    animateBy="words"
                                                    direction="top"
                                                    className="text-white text-2xl"
                                                />
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* View Image Button */}
                            {fragrance?.imageUrl && (
                                <div className="pt-4 flex justify-center">
                                    <div className="flex items-start gap-6">
                                        {/* First Button + Caption */}
                                        <div className="flex flex-col items-center">
                                            <button
                                                onClick={() => window.open(fragrance.imageUrl, '_blank')}
                                                className={`group relative inline-flex items-center justify-center px-12 py-6 text-2xl font-bold text-white ${theme.button.browseAll} rounded-2xl shadow-2xl ${theme.shadow.button} transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border ${theme.border.accent} cursor-pointer`}
                                            >
                                                <div className={`absolute inset-0 ${theme.button.browseAll} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                                                <div className="relative flex items-center space-x-4">
                                                    <span className="text-4xl">🌸</span>
                                                    <BlurText
                                                        text={`View Image of ${fragrance.name} by ${fragrance.brand}`}
                                                        delay={50}
                                                        animateBy="words"
                                                        direction="top"
                                                        className="text-2xl font-bold flex justify-center"
                                                    />
                                                    <svg
                                                        className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                        />
                                                    </svg>
                                                </div>
                                            </button>

                                        </div>

                                        {/* Random Button */}
                                        <RandomFragranceButton className={`cursor-pointer group relative inline-flex items-center justify-center w-24 h-24 text-xl font-bold ${theme.text.primary} bg-gradient-to-r ${theme.randomDiscoveryButton.primary} rounded-full shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-gray-500/30`} />
                                    </div>
                                </div>

                            )}
                            {fragrance?.imageUrl && (
                                <p className="mb-12 text-gray-400 text-center flex justify-center ">
                                    <BlurText
                                        text="Image courtesy of Fragrantica."
                                        delay={200}
                                        animateBy="words"
                                        direction="top"
                                        className="text-[1.1rem] text-gray-200 text-center"
                                    />
                                </p>
                            )}

                            {/* Accords */}
                            {fragrance?.accords && (
                                <div className="space-y-4">
                                    <BlurText
                                        text="Accords"
                                        delay={500}
                                        animateBy="words"
                                        direction="top"
                                        className={`text-3xl font-semibold ${theme.text.accent} flex justify-center`}
                                    />
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {parseAccords(fragrance.accords).map((accord, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleAccordClick(accord)}
                                                className={`px-4 py-2 ${theme.card.primary} rounded-lg text-xl border border-gray-700 ${theme.border.hover} transition-all duration-300 hover:scale-105 ${theme.card.hover} cursor-pointer animate-fadeIn`}
                                                style={{animationDelay: `${550 + index * 100}ms`}}
                                            >
                                                {accord.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notes Section */}
                            <div className="space-y-8">
                                {/* Top Notes */}
                                {fragrance?.topNotes && (
                                    <div className="space-y-4">
                                        <BlurText
                                            text="Top Notes"
                                            delay={700}
                                            animateBy="words"
                                            direction="top"
                                            className={`text-3xl font-semibold ${theme.text.accent} flex justify-center`}
                                        />
                                        <div className="gap-4 flex justify-center flex-wrap">
                                            {parseNotes(fragrance.topNotes).map((note, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleNoteClick(note)}
                                                    className={`${theme.card.primary} p-5 rounded-xl border border-gray-700 ${theme.border.hover} transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer ${theme.card.hover} animate-fadeIn`}
                                                    style={{animationDelay: `${750 + index * 100}ms`}}
                                                >
                                                    <span className="text-xl font-medium">{note}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Middle Notes */}
                                {fragrance?.middleNotes && (
                                    <div className="space-y-4">
                                        <BlurText
                                            text="Middle Notes"
                                            delay={900}
                                            animateBy="words"
                                            direction="top"
                                            className={`text-3xl font-semibold ${theme.text.accent} flex justify-center`}
                                        />
                                        <div className="gap-4 flex justify-center flex-wrap">
                                            {parseNotes(fragrance.middleNotes).map((note, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleNoteClick(note)}
                                                    className={`${theme.card.primary} p-5 rounded-xl border border-gray-700 ${theme.border.hover} transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer ${theme.card.hover} animate-fadeIn`}
                                                    style={{animationDelay: `${950 + index * 100}ms`}}
                                                >
                                                    <span className="text-xl font-medium">{note}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Base Notes */}
                                {fragrance?.baseNotes && (
                                    <div className="space-y-4">
                                        <BlurText
                                            text="Base Notes"
                                            delay={1100}
                                            animateBy="words"
                                            direction="top"
                                            className={`text-3xl font-semibold ${theme.text.accent} flex justify-center`}
                                        />
                                        <div className="gap-4 flex justify-center flex-wrap">
                                            {parseNotes(fragrance.baseNotes).map((note, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleNoteClick(note)}
                                                    className={`${theme.card.primary} p-5 rounded-xl border border-gray-700 ${theme.border.hover} transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer ${theme.card.hover} animate-fadeIn`}
                                                    style={{animationDelay: `${1150 + index * 100}ms`}}
                                                >
                                                    <span className="text-xl font-medium">{note}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Uncategorized Notes */}
                                {fragrance?.uncategorizedNotes && (
                                    <div className="space-y-4">
                                        <BlurText
                                            text="Uncategorized Notes"
                                            delay={1300}
                                            animateBy="words"
                                            direction="top"
                                            className={`text-3xl font-semibold ${theme.text.accent} flex justify-center`}
                                        />
                                        <div className="gap-4 flex justify-center flex-wrap">
                                            {parseNotes(fragrance.uncategorizedNotes).map((note, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleNoteClick(note)}
                                                    className={`${theme.card.primary} p-5 rounded-xl border border-gray-700 ${theme.border.hover} transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer ${theme.card.hover} animate-fadeIn`}
                                                    style={{animationDelay: `${1350 + index * 100}ms`}}
                                                >
                                                    <span className="text-xl font-medium">{note}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-6 pt-8 justify-center">
                                <button className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl">
                                    <BlurText
                                        text="Add to Collection"
                                        delay={100}
                                        animateBy="words"
                                        direction="top"
                                        className="text-xl font-semibold"
                                    />
                                </button>
                                <button className="border border-blue-800 text-blue-400 hover:bg-blue-800 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl">
                                    <BlurText
                                        text="Add to Wishlist"
                                        delay={300}
                                        animateBy="words"
                                        direction="top"
                                        className="text-xl font-semibold"
                                    />
                                </button>
                            </div>
                        </div>
                    </main>
                </div>}
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                    opacity: 0;
                    animation-fill-mode: forwards;
                }
            `}</style>
        </div>
    );
};

export default FragrancePage;