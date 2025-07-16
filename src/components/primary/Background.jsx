import Silk from "../../blocks/Backgrounds/Silk/Silk.jsx";
import React from "react";

const  Background = () => {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen z-0"> {/* Changed from -z-10 to z-0 */}
            <Silk
                speed={5}
                scale={1}
                color="#080731"
                noiseIntensity={0.3}
                rotation={1.54}
            />
        </div>
    );
};
export default Background;