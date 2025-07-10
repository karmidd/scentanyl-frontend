import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Silk from "../blocks/Backgrounds/Silk/Silk.jsx";

const FragrancePage = () => {
    // For demo purposes, using props. In a real app, you'd get these from URL params
    const { brand, name } = useParams();
    const [fragrance, setFragrance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('notes');

    useEffect(() => {
        const fetchFragrance = async () => {
            try {
                setLoading(true);
                // Replace with your actual backend URL
                const response = await fetch(`http://localhost:8080/brands/${brand}/${name}`);
                if (!response.ok) {
                    throw new Error('Fragrance not found');
                }
                const data = await response.json();
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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-800"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-center">
                    <h2 className="text-2xl font-bold mb-4">Fragrance Not Found</h2>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

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
            <div className="fixed top-0 left-0 w-screen h-screen z-0"> {/* Changed from -z-10 to z-0 */}
                <Silk
                    speed={5}
                    scale={1}
                    color="#080731"
                    noiseIntensity={1}
                    rotation={1.54}
                />
            </div>
            <div className="relative z-10">
                {<div className="min-h-screen text-white">
                    {/* Header */}
                    <header className="bg-gradient-to-r from-black to-gray-900 py-6 px-4">
                        <div className="max-w-7xl mx-auto">
                            <nav className="flex items-center space-x-4 text-gray-400 mb-4">
                                <span>Home</span>
                                <span>/</span>
                                <span>Brands</span>
                                <span>/</span>
                                <span className="text-blue-400">{fragrance?.brand}</span>
                                <span>/</span>
                                <span className="text-white">{fragrance?.name}</span>
                            </nav>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Left Column - Image */}
                            <div className="space-y-6 pl-20">
                                <div className="w-[375px] h-[500px] rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-800 transition-all duration-300">
                                    {fragrance?.imageUrl ? (
                                        <img
                                            src={fragrance.imageUrl}
                                            alt={fragrance.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-gray-600 text-center">
                                                <div className="text-6xl mb-4">🌸</div>
                                                <p>No image available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Details */}
                            <div className="space-y-8">
                                {/* Title Section */}
                                <div className="space-y-4">
                                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                                        {fragrance?.name}
                                    </h1>
                                    <div className="flex items-center space-x-4">
                <span className="text-2xl text-blue-400 font-semibold">
                  <span className="text-2xl text-gray-400 font-semibold">
                    by&nbsp;
                  </span>
                    {fragrance?.brand}
                </span>
                                        <span className="px-3 py-1 bg-blue-800 rounded-full text-sm font-medium">
                  {fragrance?.gender}
                </span>
                                    </div>
                                    {fragrance?.perfumerNames && (
                                        <div className="flex flex-wrap gap-2">
                                            {parsePerfumers(fragrance.perfumerNames).map((perfumer, index) => (
                                                <span key={index} className="text-gray-400 text-sm">
                      Perfumer(s): <span className="text-white">{perfumer?.replaceAll(' | ', ', ')}</span>
                    </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Accords */}
                                {fragrance?.accords && (
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold text-blue-400">Accords</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {parseAccords(fragrance.accords).map((accord, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-800 rounded-lg text-sm border border-gray-700 hover:border-blue-800 transition-colors"
                                                >
                      {accord}
                    </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tab Navigation */}
                                <div className="border-b border-gray-800">
                                    <nav className="flex space-x-8">
                                        {['notes', 'details'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
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
                                <div className="space-y-6">
                                    {activeTab === 'notes' && (
                                        <div className="space-y-6">
                                            {/* Top Notes */}
                                            {fragrance?.topNotes && (
                                                <div className="space-y-3">
                                                    <h4 className="text-lg font-semibold text-blue-400">Top Notes</h4>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        {parseNotes(fragrance.topNotes).map((note, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-gradient-to-r from-gray-900 to-gray-800 p-3 rounded-xl border border-gray-700 hover:border-blue-800 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                                                            >
                                                                <span className="text-sm font-medium">{note}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Middle Notes */}
                                            {fragrance?.middleNotes && (
                                                <div className="space-y-3">
                                                    <h4 className="text-lg font-semibold text-blue-400">Middle Notes</h4>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        {parseNotes(fragrance.middleNotes).map((note, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-gradient-to-r from-gray-900 to-gray-800 p-3 rounded-xl border border-gray-700 hover:border-blue-800 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                                                            >
                                                                <span className="text-sm font-medium">{note}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Base Notes */}
                                            {fragrance?.baseNotes && (
                                                <div className="space-y-3">
                                                    <h4 className="text-lg font-semibold text-blue-400">Base Notes</h4>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        {parseNotes(fragrance.baseNotes).map((note, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-gradient-to-r from-gray-900 to-gray-800 p-3 rounded-xl border border-gray-700 hover:border-blue-800 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                                                            >
                                                                <span className="text-sm font-medium">{note}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Uncategorized Notes */}
                                            {fragrance?.uncategorizedNotes && (
                                                <div className="space-y-3">
                                                    <h4 className="text-lg font-semibold text-blue-400">Other Notes</h4>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        {parseNotes(fragrance.uncategorizedNotes).map((note, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-gradient-to-r from-gray-900 to-gray-800 p-3 rounded-xl border border-gray-700 hover:border-blue-800 transition-all duration-300 hover:scale-105"
                                                            >
                                                                <span className="text-sm font-medium">{note}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'details' && (
                                        <div className="space-y-6">
                                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                                <h4 className="text-lg font-semibold text-blue-400 mb-4">Fragrance Information</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-gray-400 text-sm">Brand</span>
                                                        <p className="text-white font-medium">{fragrance?.brand}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 text-sm">Gender</span>
                                                        <p className="text-white font-medium">{fragrance?.gender}</p>
                                                    </div>
                                                    {fragrance?.perfumerNames && (
                                                        <div className="sm:col-span-2">
                                                            <span className="text-gray-400 text-sm">Perfumer(s)</span>
                                                            <p className="text-white font-medium">{fragrance.perfumerNames?.replaceAll(' | ', ', ')}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-6">
                                    <button className="flex-1 bg-blue-800 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105">
                                        Add to Collection
                                    </button>
                                    <button className="flex-1 border border-blue-800 text-blue-400 hover:bg-blue-800 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105">
                                        Add to Wishlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>}
            </div>
        </div>
    );
};

export default FragrancePage;