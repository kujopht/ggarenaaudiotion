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
 * 2. Grand Dong Son Bronze Drum on upper-right, cropped at viewport edge
 * 3. Secondary subtle concentric arc on bottom-left for spatial depth
 * 4. Majestic soaring phoenix gliding across the global space (22s slow flight, 50-75s rest)
 * 5. Mobile optimized: phoenix disabled on mobile, drum opacity reduced to 0.08
 */
export const HeritageBackground: React.FC<HeritageBackgroundProps> = ({ motionEnabled }) => {
  const [phoenixVisible, setPhoenixVisible] = useState(false);
  const [phoenixVariant, setPhoenixVariant] = useState<0 | 1>(0);
  const [verticalLane, setVerticalLane] = useState(14); // percentage top
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : false));
  const [prefersReduced, setPrefersReduced] = useState(() => (typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false));

  // Dynamic viewport & preference tracking across resizes without reload
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop((prev) => {
        if (prev !== desktop) {
          if (!desktop) {
            setPhoenixVisible(false);
          }
          return desktop;
        }
        return prev;
      });
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
      if (e.matches) {
        setPhoenixVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    // Immediate cancellation if motion is disabled, reduced-motion is requested, or viewport is mobile
    if (!motionEnabled || prefersReduced || !isDesktop) {
      setPhoenixVisible(false);
      return;
    }

    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let nextFlightTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleNextFlight = (delayMs: number) => {
      nextFlightTimer = setTimeout(() => {
        if (document.hidden) {
          // If tab is backgrounded, reschedule when visible
          return;
        }

        // Randomize phoenix variant (0 or 1) and gentle vertical altitude lane (12% to 22%)
        setPhoenixVariant((prev) => (prev === 0 ? 1 : 0));
        setVerticalLane(12 + Math.floor(Math.random() * 10));
        setPhoenixVisible(true);

        if (hideTimer) clearTimeout(hideTimer);
        // Serene majestic flight duration: 28 seconds
        hideTimer = setTimeout(() => {
          setPhoenixVisible(false);
          // Rest period between 55 to 80 seconds between flights
          const restPeriod = 55000 + Math.floor(Math.random() * 25000);
          scheduleNextFlight(restPeriod);
        }, 28500);
      }, delayMs);
    };

    // First flight begins 6 seconds after arrival
    scheduleNextFlight(6000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setPhoenixVisible(false);
        if (hideTimer) clearTimeout(hideTimer);
        if (nextFlightTimer) clearTimeout(nextFlightTimer);
      } else {
        // Reschedule when user returns to tab
        if (nextFlightTimer) clearTimeout(nextFlightTimer);
        scheduleNextFlight(8000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      setPhoenixVisible(false);
      if (hideTimer) clearTimeout(hideTimer);
      if (nextFlightTimer) clearTimeout(nextFlightTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [motionEnabled, prefersReduced, isDesktop]);

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Atmospheric Ambient Gradients & Glows */}
      {/* Bronze glow behind Dong Son drum at upper right */}
      <div
        className="absolute top-0 right-0 w-[500px] sm:w-[700px] lg:w-[850px] h-[500px] sm:h-[700px] lg:h-[850px] opacity-60 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 75% 20%, rgba(201, 166, 107, 0.12) 0%, rgba(201, 166, 107, 0.02) 45%, transparent 70%)',
        }}
      />

      {/* Subtle warm cinnabar glow on left-mid viewport */}
      <div
        className="absolute top-[25%] left-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] opacity-50 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 15% 40%, rgba(184, 52, 43, 0.06) 0%, rgba(184, 52, 43, 0.01) 40%, transparent 70%)',
        }}
      />

      {/* Vignette around edges to frame content gracefully */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(12, 9, 8, 0.55) 85%, rgba(8, 6, 5, 0.85) 100%)',
        }}
      />

      {/* 2. Primary Dong Son Bronze Drum Artwork (Top-Right, partially cropped, light on mobile) */}
      <div className="absolute -top-16 -right-24 sm:-top-16 sm:-right-24 md:-top-12 md:-right-20 lg:-top-6 lg:-right-16 translate-x-[15%] sm:translate-x-[10%] lg:translate-x-[8%] opacity-[0.05] sm:opacity-[0.09] lg:opacity-[0.14] transition-opacity duration-1000">
        <DongSonBronzeDrum
          size={940}
          isRotating={motionEnabled && !prefersReduced}
          className="w-[340px] h-[340px] sm:w-[620px] sm:h-[620px] md:w-[780px] md:h-[780px] lg:w-[940px] lg:h-[940px]"
        />
      </div>

      {/* 3. Secondary Deep Concentric Arc at Bottom-Left (Asymmetric depth balance) */}
      <div className="hidden sm:block absolute -bottom-36 -left-36 md:-bottom-52 md:-left-52 opacity-[0.08] sm:opacity-[0.10] pointer-events-none">
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

      {/* 4. Global Majestic Phoenix in Flight (22s slow graceful sweep, desktop only) */}
      {motionEnabled && !prefersReduced && isDesktop && phoenixVisible && (
        <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute animate-phoenix-majestic-glide"
            style={{ top: `${verticalLane}%`, left: '0' }}
          >
            {phoenixVariant === 0 ? (
              <VietnamesePhoenix
                size={190}
                className="opacity-75 drop-shadow-[0_6px_20px_rgba(201,166,107,0.4)]"
              />
            ) : (
              <VietnameseSoaringPhoenix
                size={190}
                className="opacity-75 drop-shadow-[0_6px_20px_rgba(201,166,107,0.4)]"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
