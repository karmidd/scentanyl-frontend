import React from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../apiFetch.jsx";

/** Fetches a random fragrance and navigates to it. Styled via className. */
export default function RandomFragranceButton({ className = "btn", children = "Random ⤳" }) {
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const handleRandomClick = async () => {
        try {
            const response = await apiFetch(`${API_BASE_URL}/api/random-frag`);
            const fragrance = await response.json();
            navigate(`/fragrances/${encodeURIComponent(fragrance.brand)}/${encodeURIComponent(fragrance.name)}/${fragrance.id}`);
        } catch (error) {
            console.error('Error fetching random fragrance:', error);
        }
    };

    return (
        <button type="button" onClick={handleRandomClick} className={className}>
            {children}
        </button>
    );
}
