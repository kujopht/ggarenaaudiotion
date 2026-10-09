import React from 'react';
import { GarmentKey } from '../types/vietphuc';

export interface MannequinFigureProps {
  garment: GarmentKey;
  garmentColor?: string; // hex or color string
  bottomType?: 'pant' | 'skirt';
  bottomColor?: string;
  accessory?: 'none' | 'khan' | 'non' | 'tui' | 'all';
  accessoryColor?: string;
  height?: number | string;
  className?: string;
  interactive?: boolean;
  onSelectPart?: (partName: string) => void;
}

export const MannequinFigure2D: React.FC<MannequinFigureProps> = ({
  garment = 'ngu_than',
  garmentColor = '#172554', // default indigo
  bottomType = 'pant',
  bottomColor = '#F1F5F9', // default ivory pant
  accessory = 'none',
  accessoryColor = '#C9A66B',
  height = 360,
  className = '',
  interactive = false,
  onSelectPart,
}) => {
  // Normalize hex color
  const primaryColor = garmentColor.startsWith('#')
    ? garmentColor
    : garmentColor.match(/#[0-9A-Fa-f]{3,6}/)?.[0] || '#2A3B5C';

  const pantColor = bottomColor.startsWith('#')
    ? bottomColor
    : bottomColor.match(/#[0-9A-Fa-f]{3,6}/)?.[0] || '#E2E8F0';

  const accColor = accessoryColor.startsWith('#')
    ? accessoryColor
    : accessoryColor.match(/#[0-9A-Fa-f]{3,6}/)?.[0] || '#C9A66B';

  const showKhan = accessory === 'khan' || accessory === 'all';
  const showNon = accessory === 'non';
  const showTui = accessory === 'tui' || accessory === 'all';

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ height }}
    >
      <svg
        viewBox="0 0 320 520"
        className="w-full h-full max-h-full transition-all duration-300 filter drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle gradient for body mannequin */}
          <linearGradient id="mannequinSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A3B32" />
            <stop offset="100%" stopColor="#2E231E" />
          </linearGradient>

          {/* Garment fabric texture gradient */}
          <linearGradient id="garmentShade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </linearGradient>

          {/* Gold embroidery accents */}
          <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E6C88B" />
            <stop offset="50%" stopColor="#FFF2D6" />
            <stop offset="100%" stopColor="#C9A66B" />
          </linearGradient>
        </defs>

        {/* ---------------- LAYER 1: BASE MANNEQUIN FORM (NEUTRAL FIGURE) ---------------- */}
        <g id="base-mannequin" className="transition-opacity duration-300">
          {/* Head & Neck */}
          <ellipse cx="160" cy="72" rx="22" ry="29" fill="url(#mannequinSkin)" stroke="#6E5D53" strokeWidth="1" />
          {/* Neck */}
          <path d="M152,98 L152,122 L168,122 L168,98 Z" fill="url(#mannequinSkin)" />

          {/* Shoulders & Torso reference */}
          <path
            d="M110,135 Q160,126 210,135 L204,260 L116,260 Z"
            fill="url(#mannequinSkin)"
            opacity="0.8"
          />

          {/* Arms */}
          {/* Left Arm (viewer's left) */}
          <path d="M112,136 Q92,190 98,280 L108,280 Q106,195 120,140 Z" fill="url(#mannequinSkin)" />
          {/* Right Arm (viewer's right) */}
          <path d="M208,136 Q228,190 222,280 L212,280 Q214,195 200,140 Z" fill="url(#mannequinSkin)" />

          {/* Hands */}
          <ellipse cx="102" cy="288" rx="7" ry="11" fill="url(#mannequinSkin)" />
          <ellipse cx="218" cy="288" rx="7" ry="11" fill="url(#mannequinSkin)" />

          {/* Legs */}
          {/* Left Leg */}
          <path d="M132,320 L134,475 L148,475 L153,320 Z" fill="url(#mannequinSkin)" />
          {/* Right Leg */}
          <path d="M167,320 L172,475 L186,475 L188,320 Z" fill="url(#mannequinSkin)" />

          {/* Feet / Shoes base */}
          <path d="M130,475 L124,495 L150,495 L149,475 Z" fill="#181311" stroke="#3A2B25" strokeWidth="1" />
          <path d="M171,475 L170,495 L196,495 L190,475 Z" fill="#181311" stroke="#3A2B25" strokeWidth="1" />
        </g>

        {/* ---------------- LAYER 2: BOTTOM (PANTS OR SKIRT) ---------------- */}
        <g id="bottom-garment" className="transition-all duration-300">
          {bottomType === 'skirt' ? (
            /* Chân váy A-line xếp ly */
            <g
              className="cursor-pointer"
              onClick={() => interactive && onSelectPart?.('Chân váy')}
            >
              <path
                d="M125,245 L195,245 L222,440 L98,440 Z"
                fill={pantColor}
                className="transition-colors duration-300"
              />
              <path d="M125,245 L195,245 L222,440 L98,440 Z" fill="url(#garmentShade)" />
              {/* Pleat lines */}
              <line x1="135" y1="245" x2="120" y2="440" stroke="#000" strokeOpacity="0.15" strokeWidth="1" />
              <line x1="150" y1="245" x2="148" y2="440" stroke="#000" strokeOpacity="0.15" strokeWidth="1" />
              <line x1="170" y1="245" x2="172" y2="440" stroke="#000" strokeOpacity="0.15" strokeWidth="1" />
              <line x1="185" y1="245" x2="200" y2="440" stroke="#000" strokeOpacity="0.15" strokeWidth="1" />
            </g>
          ) : (
            /* Quần suông dài hai ống */
            <g
              className="cursor-pointer"
              onClick={() => interactive && onSelectPart?.('Quần suông')}
            >
              {/* Left leg */}
              <path
                d="M124,245 L158,245 L155,470 L122,470 Z"
                fill={pantColor}
                className="transition-colors duration-300"
              />
              <path d="M124,245 L158,245 L155,470 L122,470 Z" fill="url(#garmentShade)" />
              {/* Right leg */}
              <path
                d="M162,245 L196,245 L198,470 L165,470 Z"
                fill={pantColor}
                className="transition-colors duration-300"
              />
              <path d="M162,245 L196,245 L198,470 L165,470 Z" fill="url(#garmentShade)" />
              {/* Crotch line */}
              <path d="M158,245 Q160,285 162,245" stroke="#000" strokeOpacity="0.25" strokeWidth="1" />
            </g>
          )}
        </g>

        {/* ---------------- LAYER 3: TRADITIONAL VIETNAMESE ROBE (ÁO DÀI) ---------------- */}
        <g id="traditional-robe" className="transition-all duration-300">
          {/* ===================== TYPE A: ÁO NGŨ THÂN TAY CHẼN ===================== */}
          {garment === 'ngu_than' && (
            <g
              className="cursor-pointer"
              onClick={() => interactive && onSelectPart?.('Áo Ngũ Thân')}
            >
              {/* Main Robe Body (5 thân, vạt xòe nhẹ qua gối) */}
              <path
                d="M128,122 Q160,118 192,122 L206,170 Q215,260 216,360 L104,360 Q105,260 114,170 Z"
                fill={primaryColor}
                className="transition-colors duration-300"
              />
              <path
                d="M128,122 Q160,118 192,122 L206,170 Q215,260 216,360 L104,360 Q105,260 114,170 Z"
                fill="url(#garmentShade)"
              />

              {/* Hữu Nhậm Seam (Vạt trái đè vạt phải, chéo sang nách phải) */}
              <path
                d="M160,128 Q175,160 196,178 L198,360"
                stroke="#E6C88B"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />

              {/* 5 Traditional Buttons (Khuy cài cổ, nách và sườn phải) */}
              <circle cx="160" cy="126" r="3" fill="#E6C88B" stroke="#785926" strokeWidth="0.8" />
              <circle cx="170" cy="144" r="2.8" fill="#E6C88B" stroke="#785926" strokeWidth="0.8" />
              <circle cx="184" cy="162" r="2.8" fill="#E6C88B" stroke="#785926" strokeWidth="0.8" />
              <circle cx="196" cy="180" r="2.8" fill="#E6C88B" stroke="#785926" strokeWidth="0.8" />
              <circle cx="197" cy="215" r="2.8" fill="#E6C88B" stroke="#785926" strokeWidth="0.8" />

              {/* Sleeves: Tay chẽn ôm vừa vặn cổ tay */}
              {/* Left Sleeve */}
              <path
                d="M128,124 L94,155 L96,275 L108,275 L114,175 Z"
                fill={primaryColor}
                className="transition-colors duration-300"
              />
              <path d="M128,124 L94,155 L96,275 L108,275 L114,175 Z" fill="url(#garmentShade)" />
              {/* Left Cuff */}
              <rect x="96" y="271" width="12" height="4" fill="url(#goldTrim)" rx="1" />

              {/* Right Sleeve */}
              <path
                d="M192,124 L226,155 L224,275 L212,275 L206,175 Z"
                fill={primaryColor}
                className="transition-colors duration-300"
              />
              <path d="M192,124 L226,155 L224,275 L212,275 L206,175 Z" fill="url(#garmentShade)" />
              {/* Right Cuff */}
              <rect x="212" y="271" width="12" height="4" fill="url(#goldTrim)" rx="1" />

              {/* Standing Collar (Cổ đứng vuông vức) */}
              <path
                d="M146,110 L174,110 L174,124 L146,124 Z"
                fill={primaryColor}
                stroke="#E6C88B"
                strokeWidth="1.5"
                rx="2"
              />
            </g>
          )}

          {/* ===================== TYPE B: ÁO TẤC LỄ PHỤC ===================== */}
          {garment === 'ao_tac' && (
            <g
              className="cursor-pointer"
              onClick={() => interactive && onSelectPart?.('Áo Tấc')}
            >
              {/* Main Robe Body (Trang trọng, dài qua đầu gối) */}
              <path
                d="M126,122 Q160,116 194,122 L212,175 Q224,275 225,385 L95,385 Q96,275 108,175 Z"
                fill={primaryColor}
                className="transition-colors duration-300"
              />
              <path
                d="M126,122 Q160,116 194,122 L212,175 Q224,275 225,385 L95,385 Q96,275 108,175 Z"
                fill="url(#garmentShade)"
              />

              {/* Hữu Nhậm Seam & Buttons */}
              <path
                d="M160,128 Q176,162 198,180 L200,385"
                stroke="#E6C88B"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="160" cy="126" r="3.2" fill="#E6C88B" stroke="#785926" strokeWidth="0.8" />
              <circle cx="172" cy="144" r="3" fill="#E6C88B" stroke="#785926" strokeWidth="0.8" />
              <circle cx="186" cy="164" r="3" fill="#E6C88B" stroke="#785926" strokeWidth="0.8" />
              <circle cx="198" cy="182" r="3" fill="#E6C88B" stroke="#785926" strokeWidth="0.8" />
              <circle cx="199" cy="220" r="3" fill="#E6C88B" stroke="#785926" strokeWidth="0.8" />

              {/* Sleeves: TAY THỤNG (Rộng dài buông thõng xuống qua bàn tay) */}
              {/* Left Wide Sleeve */}
              <path
                d="M126,124 L60,165 L68,340 L112,310 L108,175 Z"
                fill={primaryColor}
                className="transition-colors duration-300"
              />
              <path d="M126,124 L60,165 L68,340 L112,310 L108,175 Z" fill="url(#garmentShade)" />
              {/* Left Sleeve broad hem */}
              <path d="M68,340 L112,310" stroke="url(#goldTrim)" strokeWidth="2.5" />

              {/* Right Wide Sleeve */}
              <path
                d="M194,124 L260,165 L252,340 L208,310 L212,175 Z"
                fill={primaryColor}
                className="transition-colors duration-300"
              />
              <path d="M194,124 L260,165 L252,340 L208,310 L212,175 Z" fill="url(#garmentShade)" />
              {/* Right Sleeve broad hem */}
              <path d="M252,340 L208,310" stroke="url(#goldTrim)" strokeWidth="2.5" />

              {/* Standing Collar (Cổ đứng cao quý phái) */}
              <path
                d="M145,108 L175,108 L175,124 L145,124 Z"
                fill={primaryColor}
                stroke="#E6C88B"
                strokeWidth="1.8"
                rx="2"
              />
            </g>
          )}

          {/* ===================== TYPE C: ÁO NHẬT BÌNH ===================== */}
          {garment === 'nhat_binh' && (
            <g
              className="cursor-pointer"
              onClick={() => interactive && onSelectPart?.('Áo Nhật Bình')}
            >
              {/* Main Robe Body */}
              <path
                d="M126,122 L194,122 L214,175 Q220,270 218,375 L102,375 Q100,270 106,175 Z"
                fill={primaryColor}
                className="transition-colors duration-300"
              />
              <path
                d="M126,122 L194,122 L214,175 Q220,270 218,375 L102,375 Q100,270 106,175 Z"
                fill="url(#garmentShade)"
              />

              {/* Central Opening (Đối khâm xẻ giữa ngực) */}
              <line x1="160" y1="122" x2="160" y2="375" stroke="#B8342B" strokeWidth="2" />

              {/* Rectangular Collar Band (Nẹp cổ đối khâm hình chữ nhật đặc trưng) */}
              <rect
                x="147"
                y="114"
                width="26"
                height="260"
                fill="#B8342B"
                stroke="#E6C88B"
                strokeWidth="1.8"
                rx="1"
              />
              {/* Decorative inner pattern on rectangular band */}
              <line x1="160" y1="114" x2="160" y2="374" stroke="#FFF" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" />

              {/* Central Chest Button / Tie knot */}
              <circle cx="160" cy="155" r="3.5" fill="#E6C88B" stroke="#4A1813" strokeWidth="1" />
              {/* Secondary knots */}
              <circle cx="160" cy="200" r="2.8" fill="#E6C88B" stroke="#4A1813" strokeWidth="0.8" />
              <circle cx="160" cy="245" r="2.8" fill="#E6C88B" stroke="#4A1813" strokeWidth="0.8" />

              {/* Sleeves */}
              {/* Left Sleeve */}
              <path
                d="M126,124 L82,158 L84,285 L106,285 L106,175 Z"
                fill={primaryColor}
                className="transition-colors duration-300"
              />
              <path d="M126,124 L82,158 L84,285 L106,285 L106,175 Z" fill="url(#garmentShade)" />

              {/* 5-Color Striped Cuffs on Left Sleeve (Dải ngũ sắc) */}
              <rect x="84" y="265" width="22" height="3" fill="#1E40AF" />
              <rect x="84" y="268" width="22" height="3" fill="#FACC15" />
              <rect x="84" y="271" width="22" height="3" fill="#FFFFFF" />
              <rect x="84" y="274" width="22" height="3" fill="#DC2626" />
              <rect x="84" y="277" width="22" height="3" fill="#16A34A" />

              {/* Right Sleeve */}
              <path
                d="M194,124 L238,158 L236,285 L214,285 L214,175 Z"
                fill={primaryColor}
                className="transition-colors duration-300"
              />
              <path d="M194,124 L238,158 L236,285 L214,285 L214,175 Z" fill="url(#garmentShade)" />

              {/* 5-Color Striped Cuffs on Right Sleeve (Dải ngũ sắc) */}
              <rect x="214" y="265" width="22" height="3" fill="#1E40AF" />
              <rect x="214" y="268" width="22" height="3" fill="#FACC15" />
              <rect x="214" y="271" width="22" height="3" fill="#FFFFFF" />
              <rect x="214" y="274" width="22" height="3" fill="#DC2626" />
              <rect x="214" y="277" width="22" height="3" fill="#16A34A" />
            </g>
          )}
        </g>

        {/* ---------------- LAYER 4: ACCESSORIES ---------------- */}
        <g id="accessories" className="transition-all duration-300">
          {/* Accessory: KHĂN ĐÓNG / KHĂN LỤA */}
          {showKhan && (
            <g
              className="cursor-pointer"
              onClick={() => interactive && onSelectPart?.('Khăn đóng')}
            >
              {/* Turban wrapping head */}
              <ellipse
                cx="160"
                cy="62"
                rx="25"
                ry="15"
                fill={accColor}
                stroke="#181311"
                strokeWidth="1.2"
              />
              <path
                d="M136,64 Q160,56 184,64 Q160,72 136,64 Z"
                fill="#000000"
                fillOpacity="0.2"
              />
              <ellipse cx="160" cy="58" rx="20" ry="8" fill="#181311" stroke="#3A2B25" strokeWidth="0.8" />
            </g>
          )}

          {/* Accessory: NÓN LÁ TRUYỀN THỐNG */}
          {showNon && (
            <g
              className="cursor-pointer"
              onClick={() => interactive && onSelectPart?.('Nón lá')}
            >
              {/* Conical hat silhouette */}
              <polygon
                points="160,20 100,68 220,68"
                fill="#EBDCB8"
                stroke="#C9A66B"
                strokeWidth="1.5"
              />
              <line x1="160" y1="20" x2="160" y2="68" stroke="#C9A66B" strokeWidth="0.8" strokeOpacity="0.6" />
              <line x1="160" y1="20" x2="130" y2="68" stroke="#C9A66B" strokeWidth="0.8" strokeOpacity="0.6" />
              <line x1="160" y1="20" x2="190" y2="68" stroke="#C9A66B" strokeWidth="0.8" strokeOpacity="0.6" />
              {/* Chin ribbon */}
              <path d="M125,68 Q160,95 195,68" stroke={accColor} strokeWidth="1.5" fill="none" />
            </g>
          )}

          {/* Accessory: TÚI ĐEO CHÉO / TOTE BAG */}
          {showTui && (
            <g
              className="cursor-pointer"
              onClick={() => interactive && onSelectPart?.('Túi xách')}
            >
              {/* Strap across shoulder */}
              <path
                d="M130,126 Q165,210 215,260"
                stroke="#2B201B"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Leather bag */}
              <rect
                x="202"
                y="245"
                width="34"
                height="38"
                rx="5"
                fill={accColor}
                stroke="#3D291F"
                strokeWidth="1.5"
              />
              {/* Flap & buckle */}
              <path d="M202,245 L236,245 L236,262 L202,262 Z" fill="#2B201B" />
              <rect x="215" y="258" width="8" height="6" fill="#E6C88B" rx="1" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
