import GooeyNav from "../../blocks/Components/GooeyNav/GooeyNav.jsx";
import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

const items = [
    { label: "Home", href: "/" },
    { label: "Fragrances", href: "/fragrances" },
    { label: "Brands", href: "/brands" },
    { label: "Notes", href: "/notes" },
    { label: "Accords", href: "/accords" },
    { label: "About", href: "/about" },
];

const  Header = ({ page }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);




    return (
        <div
            className={`fixed top-0 left-0 w-full h-[150px] flex justify-center pt-[40px] text-3xl z-50 transition-all duration-300 ${
                scrolled ? "bg-black/40 backdrop-blur-md" : "bg-transparent"
            }`}
        >
            {/* Absolute-positioned logo on the left */}
            <Link
                to="/"
                className="absolute left-18 top-[50px] text-white hover:scale-101 text-5xl font-['Sarina',serif]"
            >
                scentanyl
            </Link>

            {/* Your centered nav stays untouched */}
            <GooeyNav
                items={items}
                particleCount={15}
                particleDistances={[60, 30]}
                particleR={100}
                initialActiveIndex={page}
                animationTime={600}
                timeVariance={300}
                colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
        </div>
    );
};
export default Header;