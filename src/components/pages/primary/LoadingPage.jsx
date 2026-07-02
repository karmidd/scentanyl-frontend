import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

/*
  Spritz loader — drop-in replacement for the old spinner LoadingPage.
  Keeps the same export + props contract (none), so every page that does
  `if (loading) return <LoadingPage />` gets the new animation for free.
*/
export default function LoadingPage() {
    const { isDarkMode } = useTheme();
    const stageRef = useRef(null);

    const ink = isDarkMode ? '#ece6d6' : '#1a1612';
    const accent = isDarkMode ? '#d8a878' : '#8b5a1f';
    const bg = isDarkMode ? '#070605' : '#f3efe5';

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const N = 22;
        const made = [];
        for (let i = 0; i < N; i++) {
            const ang = (Math.PI * 2 * i) / N + (Math.random() * 0.2 - 0.1);
            const dist = 90 + Math.random() * 90;
            const d = document.createElement('div');
            d.className = 'sl-droplet';
            d.style.setProperty('--tx', `calc(-50% + ${Math.cos(ang) * dist}px)`);
            d.style.setProperty('--ty', `calc(-50% + ${Math.sin(ang) * dist}px)`);
            d.style.animationDelay = `${0.05 + Math.random() * 0.3}s`;
            d.style.width = d.style.height = `${2 + Math.random() * 3}px`;
            d.style.background = accent;
            stage.appendChild(d);
            made.push(d);
        }
        return () => made.forEach((d) => d.remove());
    }, [accent]);

    return (
        <div className="sl-loader" style={{ backgroundColor: bg }}>
            <style>{`
        .sl-loader{position:fixed;inset:0;z-index:3000;display:flex;align-items:center;justify-content:center}
        .sl-spritz{position:relative;width:520px;max-width:90vw;height:240px;display:flex;align-items:center;justify-content:center}
        .sl-nozzle{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
          font-family:'Playfair Display','Georgia',serif;font-style:italic;font-weight:400;
          font-size:clamp(64px,12vw,120px);letter-spacing:-.02em;color:${ink};
          opacity:0;animation:slWordIn 1.4s cubic-bezier(.2,.6,.2,1) .35s forwards;white-space:nowrap}
        .sl-nozzle em{font-style:italic;color:${accent}}
        .sl-tag{position:absolute;left:50%;bottom:14px;transform:translate(-50%,0);
          font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.32em;text-transform:uppercase;
          color:${ink};opacity:0;animation:slTagIn .6s ease 1.1s forwards}
        .sl-droplet{position:absolute;left:50%;top:50%;border-radius:50%;opacity:0;
          animation:slDroplet 1.4s cubic-bezier(.2,.7,.2,1) forwards}
        @keyframes slWordIn{0%{opacity:0;letter-spacing:.4em;filter:blur(20px)}60%{opacity:1;letter-spacing:-.02em;filter:blur(0)}100%{opacity:1}}
        @keyframes slTagIn{from{opacity:0;transform:translate(-50%,8px)}to{opacity:.55;transform:translate(-50%,0)}}
        @keyframes slDroplet{0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}20%{opacity:1}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(.2)}}
      `}</style>
            <div className="sl-spritz" ref={stageRef}>
                <div className="sl-nozzle">Scentanyl<em>.</em></div>
                <div className="sl-tag">A working archive of considered perfumery</div>
            </div>
        </div>
    );
}
