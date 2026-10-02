import React from 'react';
import { GarmentKey, LookImageData } from '../types/vietphuc';
import { Sparkles, Eye, AlertCircle, Compass } from 'lucide-react';

interface FashionEditorialVisualProps {
  garment: GarmentKey;
  planType: 'heritage_anchored' | 'contemporary_remix';
  dialLevel: number;
  conceptTag: string;
  colorPalette: string[];
  fabricMaterials: string[];
  imageData?: LookImageData;
  onTriggerImageGeneration?: () => void;
  onOpenStructuralReference?: () => void;
  showImageGenCTA?: boolean;
}

export const FashionEditorialVisual: React.FC<FashionEditorialVisualProps> = ({
  garment,
  planType,
  dialLevel,
  conceptTag,
  colorPalette,
  fabricMaterials,
  imageData,
  onTriggerImageGeneration,
  onOpenStructuralReference,
  showImageGenCTA = false,
}) => {
  const status = imageData?.status || 'image_unavailable';
  const imageUrl = imageData?.imageUrl;

  // Extract iconic hues for editorial background wash
  const primaryColor = colorPalette[0]?.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/)?.[0] || (
    garment === 'ngu_than' ? '#2A201A' : garment === 'ao_tac' ? '#1D2A24' : '#2D1B1B'
  );
  const accentColor = colorPalette[1]?.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/)?.[0] || '#C9A66B';

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden bg-[#120D0B] border border-[#C9A66B]/25 group select-none shadow-xl">
      {/* 1. STATE: IMAGE READY */}
      {status === 'image_ready' && imageUrl ? (
        <div className="relative w-full h-full">
          <img
            src={imageUrl}
            alt={`${conceptTag} - ${garment}`}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle editorial gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0907] via-transparent to-black/30 pointer-events-none" />
        </div>
      ) : (
        /* 2. STATE: EDITORIAL FASHION CROQUIS PLACEHOLDER (or image_generating) */
        <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-5 overflow-hidden">
          {/* Background Atmospheric Layers: Lacquer & Bronze subtle gradient */}
          <div
            className="absolute inset-0 opacity-40 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 35%, ${primaryColor}40 0%, #150F0D 70%, #0E0907 100%)`,
            }}
          />

          {/* High-fashion architectural hairlines framing */}
          <div className="absolute inset-2 sm:inset-3 border border-[#C9A66B]/15 rounded-xl pointer-events-none" />
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#C9A66B]/40 pointer-events-none" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#C9A66B]/40 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#C9A66B]/40 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#C9A66B]/40 pointer-events-none" />

          {/* Central High-Fashion Vector Silhouette / Croquis */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              viewBox="0 0 300 420"
              className="w-[85%] h-[85%] max-h-[380px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] opacity-90 transition-all duration-700"
            >
              <defs>
                <linearGradient id={`croquisGrad_${planType}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#E6C88B" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#C9A66B" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8C7E6C" stopOpacity="0.3" />
                </linearGradient>
                <radialGradient id={`glow_${planType}`} cx="50%" cy="30%" r="50%">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ambient aura */}
              <circle cx="150" cy="140" r="110" fill={`url(#glow_${planType})`} />

              {/* Silhouette Vector according to Garment Key */}
              {garment === 'ngu_than' && (
                <g stroke={`url(#croquisGrad_${planType})`} strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  {/* Head & Elegant Stance */}
                  <ellipse cx="150" cy="52" rx="14" ry="19" stroke="#C9A66B" strokeWidth="1" fill="#1C1411" />
                  {/* High Standing Collar (Lập lĩnh) */}
                  <path d="M142,70 L142,79 L158,79 L158,70" stroke="#E6C88B" strokeWidth="1.75" />
                  {/* Right Overlap (Hữu nhậm) curving down */}
                  <path d="M150,79 Q158,105 174,130 L180,240 L120,240 L126,130 Q142,105 150,79" fill="#18110E/80" stroke="#C9A66B" strokeWidth="1.5" />
                  <path d="M150,79 Q158,102 172,126" stroke="#E6C88B" strokeWidth="1.75" />
                  {/* Narrow sleeves (Tay chẽn) */}
                  <path d="M136,88 L104,155 L116,160 L140,118" stroke="#C9A66B" strokeWidth="1.2" />
                  <path d="M164,88 L196,155 L184,160 L160,118" stroke="#C9A66B" strokeWidth="1.2" />
                  {/* Undergarment Trousers & Modern Footwear stance */}
                  <line x1="135" y1="240" x2="132" y2="340" stroke="#8C7E6C" strokeWidth="1.5" />
                  <line x1="165" y1="240" x2="168" y2="340" stroke="#8C7E6C" strokeWidth="1.5" />
                  {/* Modern Streetwear Boots/Shoes line */}
                  <path d="M125,340 L135,340 L138,355 L120,355 Z" fill="#2E201B" stroke="#C9A66B" strokeWidth="1" />
                  <path d="M175,340 L165,340 L162,355 L180,355 Z" fill="#2E201B" stroke="#C9A66B" strokeWidth="1" />
                  {/* Fine decorative buttons (Ngũ khuy) */}
                  <circle cx="151" cy="84" r="1.5" fill="#E6C88B" />
                  <circle cx="157" cy="98" r="1.5" fill="#E6C88B" />
                  <circle cx="166" cy="116" r="1.5" fill="#E6C88B" />
                  <circle cx="174" cy="140" r="1.5" fill="#E6C88B" />
                  <circle cx="176" cy="165" r="1.5" fill="#E6C88B" />
                </g>
              )}

              {garment === 'ao_tac' && (
                <g stroke={`url(#croquisGrad_${planType})`} strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  {/* Head & Pose */}
                  <ellipse cx="150" cy="52" rx="14" ry="19" stroke="#C9A66B" strokeWidth="1" fill="#1C1411" />
                  {/* High Standing Collar */}
                  <path d="M142,70 L142,79 L158,79 L158,70" stroke="#E6C88B" strokeWidth="1.75" />
                  {/* Broad flowing robe with wide loose rectangular sleeves (Tay thụng) */}
                  <path d="M136,86 L70,120 L76,230 L126,200 L132,130" fill="#18110E/80" stroke="#C9A66B" strokeWidth="1.5" />
                  <path d="M164,86 L230,120 L224,230 L174,200 L168,130" fill="#18110E/80" stroke="#C9A66B" strokeWidth="1.5" />
                  {/* Center Robe Body flowing to knees/shin */}
                  <path d="M140,86 L160,86 L175,270 L125,270 Z" fill="#150E0C" stroke="#E6C88B" strokeWidth="1.5" />
                  {/* Trouser legs */}
                  <line x1="140" y1="270" x2="138" y2="340" stroke="#8C7E6C" strokeWidth="1.5" />
                  <line x1="160" y1="270" x2="162" y2="340" stroke="#8C7E6C" strokeWidth="1.5" />
                  <path d="M130,340 L142,340 L143,355 L126,355 Z" fill="#2E201B" stroke="#C9A66B" strokeWidth="1" />
                  <path d="M170,340 L158,340 L157,355 L174,355 Z" fill="#2E201B" stroke="#C9A66B" strokeWidth="1" />
                </g>
              )}

              {garment === 'nhat_binh' && (
                <g stroke={`url(#croquisGrad_${planType})`} strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  {/* Head with Khăn vành / contemporary updo silhouette */}
                  <ellipse cx="150" cy="50" rx="15" ry="19" stroke="#C9A66B" strokeWidth="1" fill="#1C1411" />
                  {/* Iconic Rectangular Chest Band (Đối khâm nẹp cổ) */}
                  <rect x="142" y="72" width="16" height="180" stroke="#E6C88B" strokeWidth="1.75" fill="#B8342B/30" />
                  <line x1="150" y1="72" x2="150" y2="252" stroke="#E6C88B" strokeWidth="1" strokeDasharray="3 2" />
                  {/* Robe outer panels */}
                  <path d="M142,75 L105,95 L112,260 L142,260" fill="#18110E/80" stroke="#C9A66B" strokeWidth="1.5" />
                  <path d="M158,75 L195,95 L188,260 L158,260" fill="#18110E/80" stroke="#C9A66B" strokeWidth="1.5" />
                  {/* Characteristic Multi-color Five-Element Cuffs (Ngũ hành) */}
                  <g strokeWidth="2">
                    <line x1="95" y1="180" x2="115" y2="182" stroke="#2563EB" />
                    <line x1="95" y1="184" x2="115" y2="186" stroke="#FFFFFF" />
                    <line x1="95" y1="188" x2="115" y2="190" stroke="#EAB308" />
                    <line x1="95" y1="192" x2="115" y2="194" stroke="#DC2626" />
                    <line x1="95" y1="196" x2="115" y2="198" stroke="#16A34A" />

                    <line x1="185" y1="182" x2="205" y2="180" stroke="#2563EB" />
                    <line x1="185" y1="186" x2="205" y2="184" stroke="#FFFFFF" />
                    <line x1="185" y1="190" x2="205" y2="188" stroke="#EAB308" />
                    <line x1="185" y1="194" x2="205" y2="192" stroke="#DC2626" />
                    <line x1="185" y1="198" x2="205" y2="196" stroke="#16A34A" />
                  </g>
                  {/* Modern Pleated Skirt or Tailored Trousers */}
                  <path d="M125,260 L115,340 L185,340 L175,260 Z" stroke="#8C7E6C" strokeWidth="1.25" fill="#201713/70" />
                  {/* Shoes */}
                  <path d="M130,340 L140,340 L142,354 L126,354 Z" fill="#2E201B" stroke="#C9A66B" strokeWidth="1" />
                  <path d="M170,340 L160,340 L158,354 L174,354 Z" fill="#2E201B" stroke="#C9A66B" strokeWidth="1" />
                </g>
              )}
            </svg>
          </div>

          {/* Shimmer Effect during image_generating */}
          {status === 'image_generating' && (
            <div className="absolute inset-0 bg-[#0E0907]/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-20 animate-in fade-in duration-300">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <span className="absolute inset-0 border-2 border-[#C9A66B]/30 border-t-[#E6C88B] rounded-full animate-spin" />
                <Sparkles className="w-5 h-5 text-[#E6C88B] animate-pulse" />
              </div>
              <p className="text-xs font-serif font-semibold text-[#F2E9D8] tracking-wide text-center">
                Đang phác họa thị giác AI...
              </p>
              <span className="text-[10px] text-[#B8AA96] font-mono">
                Chuẩn hóa tỷ lệ & chất liệu vải
              </span>
            </div>
          )}

          {/* Top Banner: Plan Badge & Concept Tag */}
          <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap">
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border backdrop-blur-xs ${
                planType === 'heritage_anchored'
                  ? 'bg-[#C9A66B]/15 border-[#C9A66B]/40 text-[#E6C88B]'
                  : 'bg-[#B8342B]/20 border-[#B8342B]/50 text-[#F5A39D]'
              }`}
            >
              {planType === 'heritage_anchored' ? 'HERITAGE ANCHORED · 01' : `CONTEMPORARY REMIX · LV${dialLevel}`}
            </span>

            {/* Status indicator chip */}
            <span className="text-[10px] font-mono text-[#B8AA96] bg-[#181311]/70 px-2 py-0.5 rounded border border-[#C9A66B]/20 backdrop-blur-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B]" />
              <span>Phác thảo thời trang</span>
            </span>
          </div>

          {/* Bottom Floating Visual Strip */}
          <div className="relative z-10 space-y-2 mt-auto">
            {/* Color Swatch Dots & Key Material Chips */}
            <div className="flex items-center justify-between gap-2 flex-wrap bg-[#150F0D]/85 border border-[#C9A66B]/25 p-2 rounded-xl backdrop-blur-xs">
              {/* Palette */}
              <div className="flex items-center gap-1.5">
                {colorPalette.slice(0, 3).map((col, idx) => {
                  const hex = col.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/)?.[0] || '#C9A66B';
                  return (
                    <span
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={col}
                    />
                  );
                })}
                <span className="text-[11px] font-medium text-[#D4C7B4] truncate max-w-[90px] sm:max-w-[120px]">
                  {colorPalette[0]?.split('(')[0]?.trim() || 'Phối sắc'}
                </span>
              </div>

              {/* Material hint */}
              <span className="text-[10px] font-mono text-[#E6C88B] bg-[#C9A66B]/10 px-2 py-0.5 rounded border border-[#C9A66B]/25 truncate max-w-[120px]">
                {fabricMaterials[0] || 'Vải may'}
              </span>
            </div>

            {/* Quick Action bar inside visual */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              {/* Trigger Image Generation (Hidden in production until provider is live) */}
              {showImageGenCTA && onTriggerImageGeneration && status === 'image_unavailable' && (
                <button
                  type="button"
                  onClick={onTriggerImageGeneration}
                  className="px-2.5 py-1 text-[11px] font-medium text-[#E6C88B] bg-[#2E201B]/90 hover:bg-[#3D2B24] border border-[#C9A66B]/40 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer backdrop-blur-xs min-h-[30px]"
                  title="Thử kích hoạt phác họa thị giác AI cho bản phối này"
                >
                  <Sparkles className="w-3 h-3 text-[#E6C88B]" />
                  <span>Phác họa thị giác</span>
                </button>
              )}

              {/* Link to Technical Garment Schematic (Interactive Structural Reference) */}
              {onOpenStructuralReference && (
                <button
                  type="button"
                  onClick={onOpenStructuralReference}
                  className="ml-auto px-2.5 py-1 text-[11px] font-medium text-[#B8AA96] hover:text-[#F2E9D8] bg-[#181311]/80 hover:bg-[#261C19] border border-[#C9A66B]/20 rounded-lg flex items-center gap-1 transition-colors cursor-pointer backdrop-blur-xs min-h-[30px]"
                  title="Chuyển sang xem sơ đồ cấu trúc giải phẫu tương tác"
                >
                  <Compass className="w-3 h-3 text-[#C9A66B]" />
                  <span>Sơ đồ cấu trúc</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
