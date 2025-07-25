import TiltedCard from "../../blocks/Components/TiltedCard/TiltedCard.jsx";
import React from "react";
import {useNavigate} from "react-router-dom";

export default function BrandCard({brand, image}){
    const navigate = useNavigate();
    const handleBrandClick = (brand) => {
        const brandName = brand.replace(/-/g, ' ').toLowerCase();
        navigate(`/brands/${brandName}`);
    };
    return (
        <button
            onClick={() => handleBrandClick(brand)}
            className="cursor-pointer"
        >
            <TiltedCard
                imageSrc={image}
                altText={brand}
                captionText={brand}
                containerHeight="170px"
                containerWidth="170px"
                imageHeight="170px"
                imageWidth="170px"
                rotateAmplitude={8}
                scaleOnHover={1.1}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
                overlayContent={
                    <p className="tilted-card-demo-text">
                        {brand}
                    </p>}
            />
        </button>
    );
}