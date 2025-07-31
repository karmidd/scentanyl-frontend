import React from "react";
import {useNavigate} from "react-router-dom";

export default function RandomFragranceButton({className, text}) {
    const navigate = useNavigate();
    const handleRandomClick = async () => {
        try {
            const response = await fetch('http://localhost:8080/random');
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
                <span className="text-2xl lg:text-4xl">🎲</span>
                {text? <span>{text}</span> : undefined}
            </div>
        </button>
    );
}