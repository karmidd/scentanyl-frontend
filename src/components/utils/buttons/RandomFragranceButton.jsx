import React from "react";
import {useNavigate} from "react-router-dom";
import {apiFetch} from "../apiFetch.jsx";

export default function RandomFragranceButton({className, text}) {
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_URL

    const handleRandomClick = async () => {
        try {
            const response = await apiFetch(`${API_BASE_URL}/api/random-frag`);
            const fragrance = await response.json();

            // Encode for URL safety
            const encodedBrand = encodeURIComponent(fragrance.brand);
            const encodedName = encodeURIComponent(fragrance.name);
            // Navigate to the fragrance page
            navigate(`/fragrances/${encodedBrand}/${encodedName}/${fragrance.id}`);
        } catch (error) {
            console.error('Error fetching random fragrance:', error);
            // Optionally handle error
            navigate('/error');
        }
    };

    return (
        <button
            onClick={handleRandomClick}
            className={className}
        >
            <div className="relative flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 lg:size-6 xl:size-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>

                {text? <span>{text}</span> : undefined}
            </div>
        </button>
    );
}