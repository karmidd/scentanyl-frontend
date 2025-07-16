import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Background from "../primary/Background.jsx";
import Header from "../primary/Header.jsx";
import BlurText from "../../blocks/TextAnimations/BlurText/BlurText.jsx";
import RandomFragranceButton from "../utils/RandomFragranceButton.jsx";
import LoadingPage from "./LoadingPage.jsx";

const FragrancePage = () => {
    // For demo purposes, using props. In a real app, you'd get these from URL params
    const { brand, name } = useParams();
    const [fragrance, setFragrance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('notes');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFragrance = async () => {
            try {
                setLoading(true);
                // Replace with your actual backend URL
                const normalizedName = name.replace(/-/g, ' ');
                const response = await fetch(`http://localhost:8080/fragrances/${brand}/${normalizedName}`);
                if (!response.ok) {
                    throw new Error(`Fragrance "${normalizedName}" from the brand "${brand}" not found`);
                }
                const data = await response.json();
                if (!data || !data.name) {
                    throw new Error(`Fragrance "${normalizedName}" from the brand "${brand}" wasn't found`);
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
                {<div className="text-white">
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
                                    className="flex justify-center text-6xl lg:text-7xl font-bold leading-tight"
                                />
                                <div className="flex items-center justify-center space-x-6">
                                    <span className="text-3xl text-blue-400 font-semibold">
                                        <span className="text-3xl text-gray-400 font-semibold">
                                            by&nbsp;&nbsp;
                                        </span>
                                        <button onClick={() => handleBrandClick(fragrance?.brand)} className="cursor-pointer hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-lg px-2 py-1">
                                            {fragrance?.brand}
                                        </button>
                                    </span>

                                    <span className="px-4 py-2 bg-blue-800 rounded-full text-xl font-medium">
                                        {fragrance?.gender}
                                    </span>
                                </div>
                                {fragrance?.perfumerNames && (
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {parsePerfumers(fragrance.perfumerNames).map((perfumer, index) => (
                                            <span key={index} className="text-gray-400 text-2xl">
                                            Perfumer(s): <span className="text-white">{perfumer?.replaceAll(' | ', ', ')}</span>
                                        </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* View Image Button */}
                            {fragrance?.imageUrl && (
                                <div className="py-6">
                                    <button
                                        onClick={() => window.open(fragrance.imageUrl, '_blank')}
                                        className="group relative inline-flex items-center justify-center px-12 py-6 text-2xl font-bold text-white bg-gradient-to-r from-purple-900 via-blue-850 to-blue-900 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-blue-400/30 cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-blue-800 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center space-x-4">
                                            <span className="text-4xl">🌸</span>
                                            <span>View Image of {fragrance.name} by {fragrance.brand}</span>
                                            <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </div>
                                    </button>
                                    <RandomFragranceButton className={"cursor-pointer group relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-gray-500/30 left-10"}/>
                                    <p className="mt-2 text-[1rem] text-gray-400 text-center">
                                        Image courtesy of Fragrantica.
                                    </p>
                                </div>
                            )}

                            {/* Accords */}
                            {fragrance?.accords && (
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-semibold text-blue-400">Accords</h3>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {parseAccords(fragrance.accords).map((accord, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleAccordClick(accord)}
                                                className="px-4 py-2 bg-gray-800 rounded-lg text-xl border border-gray-700 hover:border-blue-800 hover:bg-gray-700 transition-all duration-300 hover:scale-105 cursor-pointer"
                                            >
                                                {accord}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tab Navigation */}
                            <div className="border-b border-gray-800">
                                <nav className="flex space-x-8 justify-center">
                                    {['notes', 'details'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`py-4 px-2 border-b-2 font-medium text-5xl transition-colors ${
                                                activeTab === tab
                                                    ? 'border-blue-400 text-blue-400'
                                                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                                            }`}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="space-y-8">
                                {activeTab === 'notes' && (
                                    <div className="space-y-8">
                                        {/* Top Notes */}
                                        {fragrance?.topNotes && (
                                            <div className="space-y-4">
                                                <h4 className="text-3xl font-semibold text-blue-400">Top Notes</h4>
                                                <div className="gap-4 flex justify-center flex-wrap">
                                                    {parseNotes(fragrance.topNotes).map((note, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleNoteClick(note)}
                                                            className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-700 hover:border-blue-800 transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer hover:from-gray-800 hover:to-gray-700"
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
                                                <h4 className="text-3xl font-semibold text-blue-400">Middle Notes</h4>
                                                <div className="gap-4 flex justify-center flex-wrap">
                                                    {parseNotes(fragrance.middleNotes).map((note, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleNoteClick(note)}
                                                            className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-700 hover:border-blue-800 transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer hover:from-gray-800 hover:to-gray-700"
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
                                                <h4 className="text-3xl font-semibold text-blue-400">Base Notes</h4>
                                                <div className="gap-4 flex justify-center flex-wrap">
                                                    {parseNotes(fragrance.baseNotes).map((note, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleNoteClick(note)}
                                                            className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-700 hover:border-blue-800 transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer hover:from-gray-800 hover:to-gray-700"
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
                                                <h4 className="text-3xl font-semibold text-blue-400">Uncategorized Notes</h4>
                                                <div className="gap-4 flex justify-center flex-wrap">
                                                    {parseNotes(fragrance.uncategorizedNotes).map((note, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleNoteClick(note)}
                                                            className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-700 hover:border-blue-800 transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer hover:from-gray-800 hover:to-gray-700"
                                                        >
                                                            <span className="text-xl font-medium">{note}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}


                                {activeTab === 'details' && (
                                    <div className="space-y-8">
                                        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
                                            <h4 className="text-2xl font-semibold text-blue-400 mb-6">Fragrance Information</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <span className="text-gray-400 text-lg">Brand</span>
                                                    <p className="text-white font-medium text-xl">{fragrance?.brand}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 text-lg">Gender</span>
                                                    <p className="text-white font-medium text-xl">{fragrance?.gender}</p>
                                                </div>
                                                {fragrance?.perfumerNames && (
                                                    <div className="sm:col-span-2">
                                                        <span className="text-gray-400 text-lg">Perfumer(s)</span>
                                                        <p className="text-white font-medium text-xl">{fragrance.perfumerNames?.replaceAll(' | ', ', ')}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-6 pt-8 justify-center">
                                <button className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl">
                                    Add to Collection
                                </button>
                                <button className="border border-blue-800 text-blue-400 hover:bg-blue-800 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl">
                                    Add to Wishlist
                                </button>
                            </div>
                        </div>
                    </main>
                </div>}
            </div>
        </div>
    );
};

export default FragrancePage;