import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Background from "../../primary/Background.jsx";
import Header from "../../primary/Header.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import RandomFragranceButton from "../../utils/buttons/RandomFragranceButton.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import PageLayout from "../../primary/PageLayout.jsx";

const FragrancePage = () => {
    const { brand, name, id } = useParams();
    const [fragrance, setFragrance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        const fetchFragrance = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/fragrances/${brand}/${name}/${id}`);
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
    }, [brand, name, id]);

    if (loading) {
        return <LoadingPage/>;
    }

    if (error) {
        return (
            <div className="relative min-h-screen overflow-hidden">
                <Background />
                <div className="relative z-10 font-['Viaoda_Libre',serif] text-base sm:text-lg md:text-xl lg:text-2xl">
                    <div className="text-white">
                        <Header page={1}/>
                        <main className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
                            <div className="text-center space-y-4 sm:space-y-6 md:space-y-8">
                                <BlurText
                                    text="Fragrance Not Found"
                                    delay={150}
                                    animateBy="words"
                                    direction="bottom"
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl pt-32 sm:pt-40 md:pt-60 font-bold mb-2 sm:mb-3 md:mb-4 text-center flex justify-center"
                                />
                                <BlurText
                                    text={error}
                                    delay={80}
                                    animateBy="words"
                                    direction="bottom"
                                    className="text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl pt-2 sm:pt-3 md:pt-5 mb-2 sm:mb-3 md:mb-4 text-center flex justify-center"
                                />
                            </div>
                        </main>
                    </div>
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

    const handlePerfumerClick = (perfumer) => {
        navigate(`/perfumers/${encodeURIComponent(perfumer)}`);
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
        <PageLayout headerNum={1} style={<style jsx>{`
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
            `}</style>}
        >
            <div className="text-center space-y-4 sm:space-y-6 md:space-y-8">
                {/* Title Section */}
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                    <BlurText
                        text={fragrance?.name}
                        delay={100}
                        animateBy="words"
                        direction="top"
                        className="flex justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold leading-tight px-2"
                    />
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-1">
                        <div className="flex items-center space-x-1">
                            <BlurText
                                text="by"
                                delay={200}
                                animateBy="words"
                                direction="top"
                                className="text-xl sm:text-2xl md:text-3xl text-gray-200"
                            />
                            <button onClick={() => handleBrandClick(fragrance?.brand)} className="cursor-pointer hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-lg px-1 sm:px-2 py-0.5 sm:py-1">
                                <BlurText
                                    text={fragrance?.brand}
                                    delay={250}
                                    animateBy="words"
                                    direction="top"
                                    className={`text-xl sm:text-2xl md:text-3xl ${theme.text.accent} font-semibold`}
                                />
                            </button>
                        </div>
                        <span className={`px-3 sm:px-4 py-1.5 sm:py-2 ${fragrance.gender === "men" ? "bg-blue-800" : fragrance.gender === "women" ? "bg-pink-600" : "bg-gradient-to-r from-pink-600 via-purple-500 to-blue-800"} rounded-full shadow-lg text-sm sm:text-base md:text-lg lg:text-xl font-medium mt-2 sm:mt-0 sm:ml-2`}>
                                        <BlurText
                                            text={fragrance?.gender}
                                            delay={300}
                                            animateBy="words"
                                            direction="top"
                                            className="text-sm sm:text-base md:text-lg lg:text-xl text-white font-medium"
                                        />
                                    </span>
                    </div>
                    {fragrance?.perfumerNames && (
                        <div className="flex flex-wrap gap-2 justify-center">
                            <div className="flex flex-wrap justify-center">
                                <BlurText
                                    text="Perfumer(s): "
                                    delay={200}
                                    animateBy="words"
                                    direction="top"
                                    className="inline-flex items-center text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl"
                                />
                                {parsePerfumers(fragrance.perfumerNames).map((perfumerGroup, groupIndex) => {
                                    // Split each perfumer group by comma to get individual names
                                    const individualPerfumers = perfumerGroup.replaceAll(' | ', ', ').split(',').map(p => p.trim());

                                    return (
                                        <span key={groupIndex} className="inline-flex gap-2 items-center">
                                                        {individualPerfumers.map((perfumer, perfumerIndex) => {
                                                            const isClickable = perfumer && perfumer.toLowerCase() !== 'n/a';
                                                            return (
                                                                <span key={perfumerIndex} className="inline-flex items-center">
                                                                    {isClickable ? (
                                                                        <button
                                                                            onClick={() => handlePerfumerClick(perfumer)}
                                                                            className="cursor-pointer hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-lg px-2 py-1">
                                                                            <BlurText
                                                                                text={perfumer}
                                                                                delay={200}
                                                                                animateBy="words"
                                                                                direction="top"
                                                                                className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${theme.text.accent}`}
                                                                            />
                                                                        </button>
                                                                    ) : (
                                                                        <BlurText
                                                                            text={perfumer}
                                                                            delay={200}
                                                                            animateBy="words"
                                                                            direction="top"
                                                                            className="text-white text-base sm:text-lg md:text-xl lg:text-2xl"
                                                                        />
                                                                    )}
                                                                    {perfumerIndex < individualPerfumers.length - 1 && (
                                                                        <span className="text-gray-200 text-2xl mx-1">,</span>
                                                                    )}
                                                                </span>
                                                            );
                                                        })}
                                            {groupIndex < parsePerfumers(fragrance.perfumerNames).length - 1 && (
                                                <span className="text-gray-200 text-2xl mx-1">;</span>
                                            )}
                                                    </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* View Image Button */}
                {fragrance?.imageUrl && (
                    <div className="pt-2 sm:pt-3 md:pt-4 flex justify-center px-2">
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6">
                            {/* First Button + Caption */}
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={() => window.open(fragrance.imageUrl, '_blank')}
                                    className={`group relative inline-flex items-center justify-center px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 lg:py-6 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white ${theme.button.browseAll} rounded-xl sm:rounded-2xl shadow-2xl ${theme.shadow.button} transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border ${theme.border.accent} cursor-pointer`}
                                >
                                    <div className={`absolute inset-0 ${theme.button.browseAll} rounded-xl sm:rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                                    <div className="relative flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                                        </svg>

                                        <BlurText
                                            text={`View Image of ${fragrance.name} by ${fragrance.brand}`}
                                            delay={50}
                                            animateBy="words"
                                            direction="top"
                                            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold flex justify-center"
                                        />
                                        <svg
                                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transform group-hover:translate-x-2 transition-transform duration-300"
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
                            <RandomFragranceButton className={`cursor-pointer group relative inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-base sm:text-lg md:text-xl font-bold ${theme.text.primary} bg-gradient-to-r ${theme.randomDiscoveryButton.primary} rounded-full shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-gray-500/30`} />
                        </div>
                    </div>
                )}
                {fragrance?.imageUrl && (
                    <div className="mb-6 sm:mb-8 md:mb-12 text-gray-400 text-center flex justify-center">
                        <BlurText
                            text="Image courtesy of Fragrantica."
                            delay={200}
                            animateBy="words"
                            direction="top"
                            className="text-xs sm:text-sm md:text-base lg:text-[1.1rem] text-gray-200 text-center"
                        />
                    </div>
                )}

                {/* Accords */}
                {fragrance?.accords && (
                    <div className="space-y-3 sm:space-y-4">
                        <BlurText
                            text="Accords"
                            delay={500}
                            animateBy="words"
                            direction="top"
                            className={`text-2xl sm:text-3xl font-semibold ${theme.text.accent} flex justify-center`}
                        />
                        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-2">
                            {parseAccords(fragrance.accords).map((accord, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAccordClick(accord)}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 ${theme.card.primary} rounded-lg text-sm sm:text-base md:text-lg lg:text-xl border border-gray-700 ${theme.border.hover} transition-all duration-300 hover:scale-105 ${theme.card.hover} cursor-pointer animate-fadeIn`}
                                    style={{animationDelay: `${550 + index * 100}ms`}}
                                >
                                    {accord.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Notes Section */}
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    {/* Top Notes */}
                    {fragrance?.topNotes && (
                        <div className="space-y-3 sm:space-y-4">
                            <BlurText
                                text="Top Notes"
                                delay={700}
                                animateBy="words"
                                direction="top"
                                className={`text-2xl sm:text-3xl font-semibold ${theme.text.accent} flex justify-center`}
                            />
                            <div className="gap-2 sm:gap-3 md:gap-4 flex justify-center flex-wrap px-2">
                                {parseNotes(fragrance.topNotes).map((note, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleNoteClick(note)}
                                        className={`${theme.card.primary} p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-gray-700 ${theme.border.hover} transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer ${theme.card.hover} animate-fadeIn`}
                                        style={{animationDelay: `${750 + index * 100}ms`}}
                                    >
                                        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">{note}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Middle Notes */}
                    {fragrance?.middleNotes && (
                        <div className="space-y-3 sm:space-y-4">
                            <BlurText
                                text="Middle Notes"
                                delay={900}
                                animateBy="words"
                                direction="top"
                                className={`text-2xl sm:text-3xl font-semibold ${theme.text.accent} flex justify-center`}
                            />
                            <div className="gap-2 sm:gap-3 md:gap-4 flex justify-center flex-wrap px-2">
                                {parseNotes(fragrance.middleNotes).map((note, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleNoteClick(note)}
                                        className={`${theme.card.primary} p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-gray-700 ${theme.border.hover} transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer ${theme.card.hover} animate-fadeIn`}
                                        style={{animationDelay: `${950 + index * 100}ms`}}
                                    >
                                        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">{note}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Base Notes */}
                    {fragrance?.baseNotes && (
                        <div className="space-y-3 sm:space-y-4">
                            <BlurText
                                text="Base Notes"
                                delay={1100}
                                animateBy="words"
                                direction="top"
                                className={`text-2xl sm:text-3xl font-semibold ${theme.text.accent} flex justify-center`}
                            />
                            <div className="gap-2 sm:gap-3 md:gap-4 flex justify-center flex-wrap px-2">
                                {parseNotes(fragrance.baseNotes).map((note, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleNoteClick(note)}
                                        className={`${theme.card.primary} p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-gray-700 ${theme.border.hover} transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer ${theme.card.hover} animate-fadeIn`}
                                        style={{animationDelay: `${1150 + index * 100}ms`}}
                                    >
                                        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">{note}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Uncategorized Notes */}
                    {fragrance?.uncategorizedNotes && (
                        <div className="space-y-3 sm:space-y-4">
                            <BlurText
                                text="Uncategorized Notes"
                                delay={1300}
                                animateBy="words"
                                direction="top"
                                className={`text-2xl sm:text-3xl font-semibold ${theme.text.accent} flex justify-center`}
                            />
                            <div className="gap-2 sm:gap-3 md:gap-4 flex justify-center flex-wrap px-2">
                                {parseNotes(fragrance.uncategorizedNotes).map((note, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleNoteClick(note)}
                                        className={`${theme.card.primary} p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-gray-700 ${theme.border.hover} transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer ${theme.card.hover} animate-fadeIn`}
                                        style={{animationDelay: `${1350 + index * 100}ms`}}
                                    >
                                        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">{note}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* Back to Fragrances Button */}
                <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 pt-8 sm:pt-12 md:pt-16">
                    <BlurText
                        text="Explore More Fragrances"
                        delay={300}
                        animateBy="words"
                        direction="bottom"
                        className="flex justify-center text-2xl sm:text-3xl font-bold text-white px-2"
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
                        <button
                            onClick={() => navigate('/fragrances')}
                            className={`cursor-pointer ${theme.button.primary} ${theme.shadow.button} text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl`}
                        >
                            Back to All Fragrances
                        </button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default FragrancePage;