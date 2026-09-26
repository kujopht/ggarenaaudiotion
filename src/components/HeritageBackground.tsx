import React, { useEffect, useState } from 'react';
import { DongSonBronzeDrum, VietnamesePhoenix, VietnameseSoaringPhoenix } from './MotionMotifs';

interface HeritageBackgroundProps {
  motionEnabled: boolean;
}

/**
 * Global Heritage Background ("Sơn Mài Chuyển Động")
 * Fixed behind all content, pointer-events none, aria-hidden.
 * Features:
 * 1. Warm lacquer vignette & atmospheric depth
 * 2. Grand Dong Son Bronze Drum (700-1000px) on upper-right, cropped at viewport edge
 * 3. Secondary subtle concentric arc on bottom-left for spatial depth
 * 4. Gliding Phoenix flying across the global space BEHIND translucent UI panels
 */
export const HeritageBackground: React.FC<HeritageBackgroundProps> = ({ motionEnabled }) => {
  const [phoenixVisible, setPhoenixVisible] = useState(false);
  const [phoenixVariant, setPhoenixVariant] = useState<0 | 1>(0);

  useEffect(() => {
    if (!motionEnabled) {
      setPhoenixVisible(false);
      return;
    }

    // Respect system prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setPhoenixVisible(false);
      return;
    }

    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let flightInterval: ReturnType<typeof setInterval> | null = null;

    const launchPhoenix = () => {
      if (document.hidden) return;
      setPhoenixVariant((prev) => (prev === 0 ? 1 : 0));
      setPhoenixVisible(true);

      if (hideTimer) clearTimeout(hideTimer);
      // Flight lasts 11 seconds
      hideTimer = setTimeout(() => {
        setPhoenixVisible(false);
      }, 11000);
    };

    // First flight 4 seconds after page arrival
    const initialTimer = setTimeout(launchPhoenix, 4000);

    // Subsequent flights every 58 seconds (flight 11s + rest ~47s)
    flightInterval = setInterval(launchPhoenix, 58000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setPhoenixVisible(false);
        if (hideTimer) clearTimeout(hideTimer);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(initialTimer);
      if (hideTimer) clearTimeout(hideTimer);
      if (flightInterval) clearInterval(flightInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [motionEnabled]);

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Atmospheric Ambient Gradients & Glows */}
      {/* Bronze glow behind Dong Son drum at upper right */}
      <div
        className="absolute top-0 right-0 w-[800px] h-[800px] opacity-70 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 75% 20%, rgba(201, 166, 107, 0.14) 0%, rgba(201, 166, 107, 0.04) 45%, transparent 70%)',
        }}
      />

      {/* Subtle warm cinnabar glow on left-mid viewport */}
      <div
        className="absolute top-[25%] left-0 w-[600px] h-[600px] opacity-60 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 15% 40%, rgba(184, 52, 43, 0.08) 0%, rgba(184, 52, 43, 0.02) 40%, transparent 70%)',
        }}
      />

      {/* Vignette around edges to frame content gracefully */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(12, 9, 8, 0.55) 85%, rgba(8, 6, 5, 0.85) 100%)',
        }}
      />

      {/* 2. Primary Dong Son Bronze Drum Artwork (Top-Right, partially cropped) */}
      <div className="absolute -top-12 -right-24 sm:-top-16 sm:-right-24 md:-top-12 md:-right-20 lg:-top-6 lg:-right-16 translate-x-[15%] sm:translate-x-[10%] lg:translate-x-[8%] opacity-[0.14] sm:opacity-[0.18] transition-opacity duration-1000">
        <DongSonBronzeDrum
          size={920}
          isRotating={motionEnabled}
          className="w-[420px] h-[420px] sm:w-[680px] sm:h-[680px] md:w-[820px] md:h-[820px] lg:w-[940px] lg:h-[940px]"
        />
      </div>

      {/* 3. Secondary Deep Concentric Arc at Bottom-Left (Asymmetric depth balance) */}
      <div className="absolute -bottom-36 -left-36 sm:-bottom-44 sm:-left-44 md:-bottom-52 md:-left-52 opacity-[0.08] sm:opacity-[0.11] pointer-events-none">
        <svg
          width="540"
          height="540"
          viewBox="0 0 540 540"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Concentric rings only, subtle and non-distracting */}
          <circle cx="120" cy="420" r="380" stroke="#C9A66B" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="120" cy="420" r="340" stroke="#C9A66B" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="4 4" />
          <circle cx="120" cy="420" r="300" stroke="#C9A66B" strokeWidth="1" strokeOpacity="0.35" />
          <circle cx="120" cy="420" r="240" stroke="#C9A66B" strokeWidth="0.75" strokeOpacity="0.25" strokeDasharray="3 3" />
          <circle cx="120" cy="420" r="180" stroke="#C9A66B" strokeWidth="1" strokeOpacity="0.3" />
        </svg>
      </div>

      {/* 4. Global Gliding Phoenix in Flight (Flies behind semi-transparent panels) */}
      {motionEnabled && phoenixVisible && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute animate-phoenix-viewport-glide" style={{ top: '8%', left: '0' }}>
            {phoenixVariant === 0 ? (
              <VietnamesePhoenix
                size={180}
                className="opacity-75 drop-shadow-[0_4px_16px_rgba(201,166,107,0.35)]"
              />
            ) : (
              <VietnameseSoaringPhoenix
                size={180}
                className="opacity-75 drop-shadow-[0_4px_16px_rgba(201,166,107,0.35)]"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
