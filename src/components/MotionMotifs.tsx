import React, { useEffect, useState } from 'react';

interface MotionMotifsProps {
  motionEnabled: boolean;
  className?: string;
  variant?: 'hero' | 'subtle-background';
}

/**
 * High-fidelity Đông Sơn Bronze Drum (Trống đồng Ngọc Lũ / Đông Sơn)
 * Authentic concentric rings:
 * 1. 14-pointed solar star center with peacock feather triangles
 * 2. Flying crane/Lạc bird frieze moving counter-clockwise
 * 3. Sacred geometric sawtooth & spiral concentric rings
 * 4. Outer rim radial rays
 */
export const DongSonBronzeDrum: React.FC<{
  size?: number;
  className?: string;
  isRotating?: boolean;
}> = ({ size = 480, className = '', isRotating = true }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${isRotating ? 'animate-drum-spin' : ''} ${className}`}
      style={{ transformOrigin: '250px 250px' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="drumGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A66B" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#C9A66B" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#C9A66B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bronzeGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6C88B" />
          <stop offset="50%" stopColor="#C9A66B" />
          <stop offset="100%" stopColor="#8C6838" />
        </linearGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="250" cy="250" r="245" fill="url(#drumGlow)" />

      {/* Ring 0: Outermost Rim */}
      <circle cx="250" cy="250" r="240" stroke="url(#bronzeGold)" strokeWidth="1.5" strokeOpacity="0.6" />
      <circle cx="250" cy="250" r="234" stroke="url(#bronzeGold)" strokeWidth="0.75" strokeOpacity="0.35" />

      {/* Ring 1: Outer Radial Teeth (Răng cưa vành ngoài) */}
      {Array.from({ length: 72 }).map((_, i) => {
        const angle = (i * 360) / 72;
        const rad = (angle * Math.PI) / 180;
        const x1 = 250 + 234 * Math.cos(rad);
        const y1 = 250 + 234 * Math.sin(rad);
        const x2 = 250 + 226 * Math.cos(rad);
        const y2 = 250 + 226 * Math.sin(rad);
        return (
          <line
            key={`outer-ray-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#C9A66B"
            strokeWidth="0.75"
            strokeOpacity="0.45"
          />
        );
      })}

      {/* Ring 2: Concentric Separation Band */}
      <circle cx="250" cy="250" r="226" stroke="#C9A66B" strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="250" cy="250" r="218" stroke="#C9A66B" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="3 3" />
      <circle cx="250" cy="250" r="210" stroke="#C9A66B" strokeWidth="1" strokeOpacity="0.5" />

      {/* Ring 3: Flying Chim Lạc (16 stylized cranes flying counter-clockwise) */}
      <circle cx="250" cy="250" r="195" stroke="#C9A66B" strokeWidth="0.5" strokeOpacity="0.2" />
      {Array.from({ length: 16 }).map((_, i) => {
        const rot = (i * 360) / 16;
        return (
          <g key={`lac-bird-${i}`} transform={`rotate(${rot} 250 250)`}>
            {/* Chim Lạc silhouette facing counter-clockwise */}
            <path
              d="M250,56 C245,62 238,65 228,66 C215,67 205,62 195,58 C202,66 214,70 225,69 C235,68 245,74 250,82 C255,74 265,68 275,69 C286,70 298,66 305,58 C295,62 285,67 272,66 C262,65 255,62 250,56 Z"
              fill="#C9A66B"
              fillOpacity="0.55"
            />
            {/* Long beak and crest */}
            <path
              d="M250,56 L248,46 C247,42 249,40 252,42 L250,56 Z"
              fill="#E6C88B"
              fillOpacity="0.75"
            />
            {/* Wing feather detailing */}
            <line x1="235" y1="67" x2="230" y2="76" stroke="#C9A66B" strokeWidth="0.75" strokeOpacity="0.5" />
            <line x1="240" y1="68" x2="238" y2="78" stroke="#C9A66B" strokeWidth="0.75" strokeOpacity="0.5" />
            <line x1="265" y1="67" x2="270" y2="76" stroke="#C9A66B" strokeWidth="0.75" strokeOpacity="0.5" />
            <line x1="260" y1="68" x2="262" y2="78" stroke="#C9A66B" strokeWidth="0.75" strokeOpacity="0.5" />
          </g>
        );
      })}

      {/* Ring 4: Sawtooth & Concentric Circles Band */}
      <circle cx="250" cy="250" r="176" stroke="#C9A66B" strokeWidth="1" strokeOpacity="0.6" />
      {Array.from({ length: 48 }).map((_, i) => {
        const angle = (i * 360) / 48;
        const rad = (angle * Math.PI) / 180;
        const nextRad = (((i + 1) * 360) / 48 * Math.PI) / 180;
        const midRad = ((angle + 360 / 96) * Math.PI) / 180;
        const x1 = 250 + 176 * Math.cos(rad);
        const y1 = 250 + 176 * Math.sin(rad);
        const xm = 250 + 166 * Math.cos(midRad);
        const ym = 250 + 166 * Math.sin(midRad);
        const x2 = 250 + 176 * Math.cos(nextRad);
        const y2 = 250 + 176 * Math.sin(nextRad);
        return (
          <path
            key={`sawtooth-${i}`}
            d={`M${x1},${y1} L${xm},${ym} L${x2},${y2}`}
            stroke="#C9A66B"
            strokeWidth="0.75"
            strokeOpacity="0.4"
            fill="none"
          />
        );
      })}
      <circle cx="250" cy="250" r="164" stroke="#C9A66B" strokeWidth="1" strokeOpacity="0.6" />

      {/* Ring 5: Concentric Circles with Dots (Vòng chấm tròn đồng tâm) */}
      <circle cx="250" cy="250" r="150" stroke="#C9A66B" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="4 4" />
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i * 360) / 32;
        const rad = (angle * Math.PI) / 180;
        const cx = 250 + 150 * Math.cos(rad);
        const cy = 250 + 150 * Math.sin(rad);
        return <circle key={`dot-${i}`} cx={cx} cy={cy} r="1.5" fill="#E6C88B" fillOpacity="0.6" />;
      })}
      <circle cx="250" cy="250" r="136" stroke="#C9A66B" strokeWidth="1" strokeOpacity="0.6" />

      {/* Ring 6: Inner Geometric Meander Band */}
      {Array.from({ length: 28 }).map((_, i) => {
        const rot = (i * 360) / 28;
        return (
          <g key={`inner-meander-${i}`} transform={`rotate(${rot} 250 250)`}>
            <path
              d="M250,118 L246,124 L254,124 Z"
              fill="#C9A66B"
              fillOpacity="0.4"
            />
          </g>
        );
      })}
      <circle cx="250" cy="250" r="114" stroke="#C9A66B" strokeWidth="1" strokeOpacity="0.7" />

      {/* Central Sun / Star: 14-pointed Star (Ngôi sao 14 cánh Ngọc Lũ) */}
      <g>
        {/* Core disc */}
        <circle cx="250" cy="250" r="28" fill="#B8342B" fillOpacity="0.25" stroke="#C9A66B" strokeWidth="1.5" />
        <circle cx="250" cy="250" r="16" fill="#C9A66B" fillOpacity="0.4" />
        <circle cx="250" cy="250" r="6" fill="#F2E9D8" />

        {/* 14 Solar Ray Spikes */}
        {Array.from({ length: 14 }).map((_, i) => {
          const rot = (i * 360) / 14;
          return (
            <g key={`sun-ray-${i}`} transform={`rotate(${rot} 250 250)`}>
              {/* Star Ray point */}
              <polygon
                points="250,140 243,222 257,222"
                fill="url(#bronzeGold)"
                fillOpacity="0.85"
                stroke="#8C6838"
                strokeWidth="0.5"
              />
              {/* Peacock feather / triangle filling between rays */}
              <path
                d="M250,142 L250,165 M248,155 L252,155"
                stroke="#F2E9D8"
                strokeWidth="0.75"
                strokeOpacity="0.7"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/**
 * Stylized Royal Vietnamese Phoenix (Phượng Hoàng Cung Đình)
 * Fine-line golden engraving with wing ribbons and trailing tail feathers.
 * Designed specifically for tasteful, non-intrusive cultural storytelling.
 */
export const VietnamesePhoenix: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = '', size = 180 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="phoenixGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5DCA3" />
          <stop offset="50%" stopColor="#C9A66B" />
          <stop offset="100%" stopColor="#B8342B" />
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Head Crest (Mào phượng uốn lượn) */}
      <path
        d="M135,52 C142,42 152,38 162,40 C156,47 148,49 143,55"
        stroke="url(#phoenixGold)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M138,48 C148,36 160,34 170,37 C164,44 153,46 145,52"
        stroke="#E6C88B"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Eye and Beak */}
      <circle cx="134" cy="58" r="1.5" fill="#F2E9D8" />
      <path
        d="M140,58 L148,60 L140,63 Z"
        fill="#C9A66B"
      />

      {/* Slender Graceful Neck (Cổ phượng thanh thoát) */}
      <path
        d="M132,60 C125,66 120,76 122,86 C124,96 118,105 110,112"
        stroke="url(#phoenixGold)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Body Core */}
      <path
        d="M122,86 C116,92 108,98 98,100 C92,101 88,106 86,114 C94,116 104,114 112,108 C116,104 122,96 122,86 Z"
        fill="url(#phoenixGold)"
        fillOpacity="0.4"
      />

      {/* Majestic Upper Wing (Cánh phượng vươn cao) */}
      <g>
        <path
          d="M118,84 C112,68 100,50 82,38 C72,32 60,30 52,32 C62,40 74,52 82,68 C88,80 94,92 98,100"
          stroke="url(#phoenixGold)"
          strokeWidth="1.75"
          fill="none"
        />
        {/* Feather ribbons */}
        <path
          d="M82,38 C70,44 60,56 55,70 C65,68 76,64 84,56"
          stroke="#E6C88B"
          strokeWidth="1"
          strokeOpacity="0.8"
          fill="none"
        />
        <path
          d="M72,32 C58,40 48,54 44,72 C52,68 62,64 70,58"
          stroke="#C9A66B"
          strokeWidth="0.75"
          strokeOpacity="0.6"
          fill="none"
        />
        <path
          d="M92,54 C82,68 74,84 72,102 C80,96 88,90 94,84"
          stroke="#C9A66B"
          strokeWidth="1"
          strokeOpacity="0.7"
          fill="none"
        />
      </g>

      {/* Flowing Tail Ribbons (Dải đuôi phượng mềm mại như dải lụa) */}
      <g>
        {/* Main Ribbon 1 */}
        <path
          d="M86,114 C75,128 60,142 45,152 C32,160 18,164 8,162 C22,168 38,165 52,156 C68,144 82,130 92,118"
          stroke="url(#phoenixGold)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Main Ribbon 2 */}
        <path
          d="M90,118 C82,136 70,154 54,168 C40,178 24,184 12,182 C28,186 46,182 62,170 C78,154 90,136 96,122"
          stroke="#E6C88B"
          strokeWidth="1.25"
          fill="none"
        />
        {/* Delicate eyelet at tail tip */}
        <circle cx="10" cy="162" r="3" fill="#B8342B" stroke="#E6C88B" strokeWidth="1" />
        <circle cx="14" cy="182" r="2.5" fill="#43B6A4" stroke="#E6C88B" strokeWidth="1" />
      </g>
    </svg>
  );
};

/**
 * Second Phoenix Variant: Soaring Phoenix with Open Wings & Ribbon Tail (Phượng Vỗ Cánh Bay Lượn)
 * Alternates with VietnamesePhoenix for visual richness.
 */
export const VietnameseSoaringPhoenix: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = '', size = 180 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="soaringGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5DCA3" />
          <stop offset="45%" stopColor="#C9A66B" />
          <stop offset="100%" stopColor="#B8342B" />
        </linearGradient>
      </defs>

      {/* Head & Crown Feather */}
      <path
        d="M142,65 C149,52 160,46 172,48 C164,57 154,60 148,68"
        stroke="url(#soaringGold)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="140" cy="72" r="1.5" fill="#F2E9D8" />
      <path d="M146,72 L154,74 L146,77 Z" fill="#C9A66B" />

      {/* Arched Neck */}
      <path
        d="M138,74 C128,82 122,94 125,106"
        stroke="url(#soaringGold)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Primary Wing Rising */}
      <path
        d="M125,106 C115,86 98,62 76,46 C64,37 50,34 38,36 C50,47 64,62 74,80 C82,94 88,110 92,122"
        stroke="url(#soaringGold)"
        strokeWidth="1.75"
        fill="none"
      />
      <path
        d="M76,46 C62,54 52,70 48,86 C58,82 70,76 80,66"
        stroke="#E6C88B"
        strokeWidth="1"
        strokeOpacity="0.85"
        fill="none"
      />
      <path
        d="M86,66 C74,82 66,102 64,122 C74,114 82,106 90,98"
        stroke="#C9A66B"
        strokeWidth="0.75"
        strokeOpacity="0.7"
        fill="none"
      />

      {/* Body & Lower Wing Flap */}
      <path
        d="M125,106 C118,114 108,122 96,125 C88,126 84,132 82,142 C92,144 104,140 114,132 C120,126 126,116 125,106 Z"
        fill="url(#soaringGold)"
        fillOpacity="0.35"
      />
      <path
        d="M102,128 C112,140 128,148 144,152 C132,156 118,154 106,146"
        stroke="#E6C88B"
        strokeWidth="1"
        fill="none"
      />

      {/* Tripartite Tail Ribbons */}
      <g>
        <path
          d="M82,142 C68,158 50,172 32,182 C18,190 6,192 0,188 C14,196 30,192 46,182 C64,168 78,152 88,138"
          stroke="url(#soaringGold)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M86,146 C76,166 62,184 44,198 C30,208 14,212 4,210 C20,214 38,208 54,196 C70,180 84,162 90,146"
          stroke="#E6C88B"
          strokeWidth="1.25"
          fill="none"
        />
        <circle cx="2" cy="188" r="3" fill="#B8342B" stroke="#E6C88B" strokeWidth="1" />
        <circle cx="6" cy="210" r="2.5" fill="#43B6A4" stroke="#E6C88B" strokeWidth="1" />
      </g>
    </svg>
  );
};

/**
 * Controller for the gliding Phoenix motion across the hero section
 * - Alternates between two authentic phoenix designs
 * - Flight duration: 10s arched pass
 * - Rest interval: 50s
 * - Pauses on browser tab hidden (visibilitychange)
 * - Respects prefers-reduced-motion
 * - Lightweight on mobile viewports (< 768px)
 */
export const GlidingPhoenixController: React.FC<{
  enabled: boolean;
}> = ({ enabled }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [phoenixVariant, setPhoenixVariant] = useState<0 | 1>(0);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      return;
    }

    // Check system prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsVisible(false);
      return;
    }

    // On narrow mobile devices (< 640px), keep animations minimal
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      setIsVisible(false);
      return;
    }

    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let flightInterval: ReturnType<typeof setInterval> | null = null;

    const triggerFlight = () => {
      if (document.hidden) return;
      setPhoenixVariant((prev) => (prev === 0 ? 1 : 0));
      setIsVisible(true);

      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 10500);
    };

    // First flight starts 3 seconds after page arrival
    const initialTimer = setTimeout(triggerFlight, 3000);

    // Flight interval every 52 seconds (rest period ~42 seconds)
    flightInterval = setInterval(triggerFlight, 52000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
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
  }, [enabled]);

  if (!enabled || !isVisible) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-20"
      aria-hidden="true"
    >
      <div className="absolute animate-phoenix-glide" style={{ top: '12%', left: '-160px' }}>
        {phoenixVariant === 0 ? (
          <VietnamesePhoenix size={160} className="drop-shadow-lg opacity-85" />
        ) : (
          <VietnameseSoaringPhoenix size={160} className="drop-shadow-lg opacity-85" />
        )}
      </div>
    </div>
  );
};

/**
 * Ornamental Bronze Circular Motif Ring for Remix Dial
 * Decorative rotating circular ring inspired by Dong Son drum motifs,
 * with micro-interaction when the user changes dial level,
 * while the center text and level number remain 100% stationary for readability.
 */
export const DongSonDialRing: React.FC<{
  dialLevel: number;
  isRotating?: boolean;
}> = ({ dialLevel, isRotating = true }) => {
  const [isShifting, setIsShifting] = useState(false);
  const prevLevelRef = React.useRef(dialLevel);

  useEffect(() => {
    if (prevLevelRef.current !== dialLevel) {
      prevLevelRef.current = dialLevel;
      setIsShifting(true);
      const timer = setTimeout(() => setIsShifting(false), 600);
      return () => clearTimeout(timer);
    }
  }, [dialLevel]);

  return (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto flex items-center justify-center select-none pointer-events-none">
      {/* Outer Ring Motif with micro-interaction on level change & slow background spin */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute inset-0 transition-transform duration-500 ${
          isShifting ? 'animate-dial-shift' : isRotating ? 'animate-drum-spin-slow' : ''
        }`}
        style={{ transformOrigin: '60px 60px' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="dialBronze" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5DCA3" />
            <stop offset="50%" stopColor="#C9A66B" />
            <stop offset="100%" stopColor="#8C6838" />
          </linearGradient>
        </defs>

        {/* Ambient Ring Glow */}
        <circle cx="60" cy="60" r="56" stroke="url(#dialBronze)" strokeWidth="1" strokeOpacity={isShifting ? "0.8" : "0.45"} />
        <circle cx="60" cy="60" r="51" stroke="#C9A66B" strokeWidth="0.75" strokeOpacity={isShifting ? "0.6" : "0.3"} strokeDasharray="3 3" />

        {/* 16 Radial Tick Marks */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          const rad = (angle * Math.PI) / 180;
          const x1 = 60 + 56 * Math.cos(rad);
          const y1 = 60 + 56 * Math.sin(rad);
          const x2 = 60 + 51 * Math.cos(rad);
          const y2 = 60 + 51 * Math.sin(rad);
          return (
            <line
              key={`dial-tick-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isShifting ? "#F5DCA3" : "#E6C88B"}
              strokeWidth={isShifting ? "1.5" : "1"}
              strokeOpacity="0.7"
            />
          );
        })}

        {/* Concentric Decorative Band */}
        <circle cx="60" cy="60" r="43" stroke="#C9A66B" strokeWidth="0.75" strokeOpacity="0.35" />
        {/* 8 Tooth points */}
        {Array.from({ length: 8 }).map((_, i) => {
          const rot = (i * 360) / 8;
          return (
            <polygon
              key={`tooth-${i}`}
              points="60,43 58,47 62,47"
              fill="#C9A66B"
              fillOpacity={isShifting ? "0.8" : "0.5"}
              transform={`rotate(${rot} 60 60)`}
            />
          );
        })}
      </svg>

      {/* Stationary Center Core: Clear Level Number and Label */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-mono uppercase text-[#C9A66B] tracking-wider leading-none">
          MỨC
        </span>
        <span className={`text-2xl sm:text-3xl font-serif font-bold text-[#F2E9D8] leading-tight transition-transform duration-300 ${isShifting ? 'scale-110 text-[#F5DCA3]' : ''}`}>
          {dialLevel}
        </span>
        <span className="text-[10px] font-mono text-[#E6C88B] leading-none">
          / 5
        </span>
      </div>
    </div>
  );
};

/**
 * Subtle Lacquer Corner Motif (Quarter Drum Arc)
 * Used in page empty margins without interfering with text or controls.
 */
export const SubtleLacquerMotif: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none select-none overflow-hidden opacity-30 ${className}`}
      aria-hidden="true"
    >
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
        <circle cx="240" cy="240" r="220" stroke="#C9A66B" strokeWidth="0.75" strokeOpacity="0.25" />
        <circle cx="240" cy="240" r="190" stroke="#C9A66B" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4 4" />
        <circle cx="240" cy="240" r="150" stroke="#C9A66B" strokeWidth="0.75" strokeOpacity="0.2" />
        <circle cx="240" cy="240" r="110" stroke="#C9A66B" strokeWidth="0.5" strokeOpacity="0.15" />
      </svg>
    </div>
  );
};
