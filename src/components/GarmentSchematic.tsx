import React, { useState } from 'react';
import { GarmentKey, VisualDetails } from '../types/vietphuc';

interface GarmentSchematicProps {
  garment: GarmentKey;
  visualDetails?: VisualDetails;
  dialLevel: number;
  isOpenFront?: boolean;
}

export const GarmentSchematic: React.FC<GarmentSchematicProps> = ({
  garment,
  visualDetails,
  dialLevel,
  isOpenFront = false,
}) => {
  const [activePin, setActivePin] = useState<string | null>(null);

  // Palette from visual details or defaults
  const primaryColor = visualDetails?.color_palette?.[0]?.split(' ')?.[0] || (
    garment === 'ngu_than' ? '#1E3A8A' : garment === 'ao_tac' ? '#065F46' : '#991B1B'
  );

  return (
    <div className="relative w-full h-[440px] bg-[#141311] border border-stone-800 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Heritage Watermark Seal */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs text-stone-400 font-mono tracking-wider">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span>SCHEMATIC · {garment === 'ngu_than' ? 'ÁO NGŨ THÂN TAY CHẼN' : garment === 'ao_tac' ? 'ÁO TẤC LỄ PHỤC' : 'ÁO NHẬT BÌNH HOÀNG TỘC'}</span>
      </div>

      <div className="absolute top-4 right-4 z-10 text-[11px] font-mono text-stone-400">
        DIAL LEVEL {dialLevel}/5
      </div>

      {/* SVG Canvas */}
      <div className="relative z-10 w-full max-w-[340px] h-[360px] flex items-center justify-center">
        <svg viewBox="0 0 320 380" className="w-full h-full drop-shadow-2xl">
          <defs>
            {/* Gradients */}
            <linearGradient id="fabricGradNguThan" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="fabricGradAoTac" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#064E3B" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="fabricGradNhatBinh" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0.95" />
            </linearGradient>

            {/* Pattern */}
            <pattern id="silkPattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M0 8 Q4 4, 8 8 T16 8" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.75" />
            </pattern>
          </defs>

          {/* Mannequin / Silhouette Base */}
          <path
            d="M130,55 Q160,50 190,55 L195,75 Q160,80 125,75 Z"
            fill="#292524"
            opacity="0.5"
          />

          {/* 1. ÁO NGŨ THÂN TAY CHẼN */}
          {garment === 'ngu_than' && (
            <g id="ngu-than-group">
              {/* Trousers underneath */}
              <path
                d="M130,230 L115,360 L145,360 L160,250 L175,360 L205,360 L190,230 Z"
                fill="#334155"
                opacity="0.7"
              />

              {/* Main Body Robe (5 Panels) */}
              <path
                d="M120,80 L80,105 L95,200 L125,185 L125,300 Q160,310 195,300 L195,185 L225,200 L240,105 L200,80 Z"
                fill="url(#fabricGradNguThan)"
              />
              <path
                d="M120,80 L80,105 L95,200 L125,185 L125,300 Q160,310 195,300 L195,185 L225,200 L240,105 L200,80 Z"
                fill="url(#silkPattern)"
              />

              {/* 5-panel Seams (KB-RULE-02) */}
              <line x1="160" y1="110" x2="160" y2="305" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
              <line x1="135" y1="130" x2="135" y2="300" stroke="#93C5FD" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.4" />
              <line x1="185" y1="130" x2="185" y2="300" stroke="#93C5FD" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.4" />

              {/* Hữu Nhậm Lapel Seam (Left lapel folding over right, fastening to the right armpit/side) */}
              <path
                d="M165,70 Q170,100 190,120 L195,170"
                fill="none"
                stroke="#FCD34D"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Buttons (Cúc đồng cài bên phải) */}
              <circle cx="163" cy="74" r="3" fill="#FCD34D" stroke="#78350F" strokeWidth="1" />
              <circle cx="172" cy="95" r="2.5" fill="#FCD34D" stroke="#78350F" strokeWidth="1" />
              <circle cx="185" cy="115" r="2.5" fill="#FCD34D" stroke="#78350F" strokeWidth="1" />
              <circle cx="192" cy="140" r="2.5" fill="#FCD34D" stroke="#78350F" strokeWidth="1" />
              <circle cx="194" cy="165" r="2.5" fill="#FCD34D" stroke="#78350F" strokeWidth="1" />

              {/* Sleeves: Tay chẽn ôm thon dần (KB-NGUTHAN-02) */}
              <path
                d="M80,105 L35,160 Q32,166 38,168 L52,170 L95,130"
                fill="url(#fabricGradNguThan)"
                stroke="#60A5FA"
                strokeWidth="1"
              />
              <path
                d="M240,105 L285,160 Q288,166 282,168 L268,170 L225,130"
                fill="url(#fabricGradNguThan)"
                stroke="#60A5FA"
                strokeWidth="1"
              />

              {/* Cổ Lập Lĩnh (Standing Collar 4-5cm - KB-NGUTHAN-01) */}
              <path
                d="M142,52 L178,52 L176,72 L144,72 Z"
                fill="#1E293B"
                stroke="#FCD34D"
                strokeWidth="1.5"
              />
              <line x1="160" y1="52" x2="160" y2="72" stroke="#FCD34D" strokeWidth="1" />
              <circle cx="160" cy="62" r="2" fill="#FCD34D" />

              {/* Interactive Invariant Pins */}
              {/* Pin 1: Cổ lập lĩnh */}
              <g
                className="cursor-pointer"
                onClick={() => setActivePin(activePin === 'collar' ? null : 'collar')}
              >
                <circle cx="195" cy="60" r="8" fill="#10B981" fillOpacity="0.25" className="animate-ping" />
                <circle cx="195" cy="60" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>

              {/* Pin 2: Hữu nhậm */}
              <g
                className="cursor-pointer"
                onClick={() => setActivePin(activePin === 'lapel' ? null : 'lapel')}
              >
                <circle cx="210" cy="120" r="8" fill="#F59E0B" fillOpacity="0.25" className="animate-ping" />
                <circle cx="210" cy="120" r="5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>

              {/* Pin 3: Tay chẽn */}
              <g
                className="cursor-pointer"
                onClick={() => setActivePin(activePin === 'sleeve' ? null : 'sleeve')}
              >
                <circle cx="35" cy="170" r="8" fill="#3B82F6" fillOpacity="0.25" />
                <circle cx="35" cy="170" r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>
            </g>
          )}

          {/* 2. ÁO TẤC LỄ PHỤC */}
          {garment === 'ao_tac' && (
            <g id="ao-tac-group">
              {/* Flowing bottom pants */}
              <path
                d="M130,240 L110,360 L145,360 L160,260 L175,360 L210,360 L190,240 Z"
                fill="#F8FAFC"
                opacity="0.8"
              />

              {/* Main Body Robe */}
              <path
                d="M120,80 L60,110 L80,240 L115,220 L110,340 Q160,350 210,340 L205,220 L240,240 L260,110 L200,80 Z"
                fill="url(#fabricGradAoTac)"
              />
              <path
                d="M120,80 L60,110 L80,240 L115,220 L110,340 Q160,350 210,340 L205,220 L240,240 L260,110 L200,80 Z"
                fill="url(#silkPattern)"
              />

              {/* Tay Thụng Chữ Nhật Buông Dài Qua Ngón Tay (KB-TAC-01) */}
              <path
                d="M60,110 L15,135 L10,270 L75,255 L80,180"
                fill="url(#fabricGradAoTac)"
                stroke="#34D399"
                strokeWidth="1.5"
              />
              <path
                d="M260,110 L305,135 L310,270 L245,255 L240,180"
                fill="url(#fabricGradAoTac)"
                stroke="#34D399"
                strokeWidth="1.5"
              />

              {/* Duster coat open opening if open front */}
              <line x1="160" y1="75" x2="160" y2="345" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray={isOpenFront ? "6 4" : "none"} />

              {/* Standing Collar */}
              <path
                d="M140,55 L180,55 L178,75 L142,75 Z"
                fill="#064E3B"
                stroke="#FCD34D"
                strokeWidth="1.5"
              />

              {/* Pins */}
              <g
                className="cursor-pointer"
                onClick={() => setActivePin(activePin === 'ao_tac_sleeve' ? null : 'ao_tac_sleeve')}
              >
                <circle cx="15" cy="240" r="8" fill="#10B981" fillOpacity="0.25" className="animate-ping" />
                <circle cx="15" cy="240" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>

              <g
                className="cursor-pointer"
                onClick={() => setActivePin(activePin === 'ao_tac_duster' ? null : 'ao_tac_duster')}
              >
                <circle cx="160" cy="180" r="8" fill="#38BDF8" fillOpacity="0.25" />
                <circle cx="160" cy="180" r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>
            </g>
          )}

          {/* 3. ÁO NHẬT BÌNH */}
          {garment === 'nhat_binh' && (
            <g id="nhat-binh-group">
              {/* Bottom skirt / trousers */}
              <path
                d="M115,220 L95,355 Q160,365 225,355 L205,220 Z"
                fill="#FFFBEB"
                opacity="0.9"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              {/* Pleated folds */}
              <line x1="120" y1="230" x2="110" y2="355" stroke="#CBD5E1" strokeWidth="0.75" />
              <line x1="140" y1="230" x2="135" y2="358" stroke="#CBD5E1" strokeWidth="0.75" />
              <line x1="160" y1="230" x2="160" y2="360" stroke="#CBD5E1" strokeWidth="0.75" />
              <line x1="180" y1="230" x2="185" y2="358" stroke="#CBD5E1" strokeWidth="0.75" />
              <line x1="200" y1="230" x2="210" y2="355" stroke="#CBD5E1" strokeWidth="0.75" />

              {/* Main Robe */}
              <path
                d="M120,75 L65,100 L85,220 L115,210 L115,300 Q160,310 205,300 L205,210 L235,220 L255,100 L200,75 Z"
                fill="url(#fabricGradNhatBinh)"
              />
              <path
                d="M120,75 L65,100 L85,220 L115,210 L115,300 Q160,310 205,300 L205,210 L235,220 L255,100 L200,75 Z"
                fill="url(#silkPattern)"
              />

              {/* Sleeves */}
              <path
                d="M65,100 L25,120 L30,220 L85,200"
                fill="url(#fabricGradNhatBinh)"
              />
              <path
                d="M255,100 L295,120 L290,220 L235,200"
                fill="url(#fabricGradNhatBinh)"
              />

              {/* Cổ tay ngũ sắc (KB-NHATBINH-02) Bất biến */}
              {/* Left Cuff 5 stripes */}
              <rect x="23" y="195" width="45" height="4" fill="#2563EB" transform="rotate(-15 23 195)" />
              <rect x="24" y="200" width="45" height="4" fill="#DC2626" transform="rotate(-15 24 200)" />
              <rect x="25" y="205" width="45" height="4" fill="#FBBF24" transform="rotate(-15 25 205)" />
              <rect x="26" y="210" width="45" height="4" fill="#F8FAFC" transform="rotate(-15 26 210)" />
              <rect x="27" y="215" width="45" height="4" fill="#1E293B" transform="rotate(-15 27 215)" />

              {/* Right Cuff 5 stripes */}
              <rect x="252" y="185" width="45" height="4" fill="#2563EB" transform="rotate(15 252 185)" />
              <rect x="251" y="190" width="45" height="4" fill="#DC2626" transform="rotate(15 251 190)" />
              <rect x="250" y="195" width="45" height="4" fill="#FBBF24" transform="rotate(15 250 195)" />
              <rect x="249" y="200" width="45" height="4" fill="#F8FAFC" transform="rotate(15 249 200)" />
              <rect x="248" y="205" width="45" height="4" fill="#1E293B" transform="rotate(15 248 205)" />

              {/* Nẹp Cổ Đối Khâm Hình Chữ Nhật (KB-NHATBINH-01) Bất biến */}
              <rect
                x="142"
                y="65"
                width="36"
                height="150"
                fill="#FEF08A"
                stroke="#B45309"
                strokeWidth="1.5"
              />
              <line x1="160" y1="65" x2="160" y2="215" stroke="#B45309" strokeWidth="1" strokeDasharray="3 3" />

              {/* Dây buộc ngực */}
              <path
                d="M152,145 Q160,165 150,185"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2"
              />
              <path
                d="M168,145 Q160,165 170,185"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2"
              />

              {/* Pins */}
              <g
                className="cursor-pointer"
                onClick={() => setActivePin(activePin === 'nhatbinh_collar' ? null : 'nhatbinh_collar')}
              >
                <circle cx="185" cy="110" r="8" fill="#10B981" fillOpacity="0.25" className="animate-ping" />
                <circle cx="185" cy="110" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>

              <g
                className="cursor-pointer"
                onClick={() => setActivePin(activePin === 'nhatbinh_cuff' ? null : 'nhatbinh_cuff')}
              >
                <circle cx="295" cy="205" r="8" fill="#F59E0B" fillOpacity="0.25" className="animate-ping" />
                <circle cx="295" cy="205" r="5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Interactive Tooltip Card */}
      {activePin && (
        <div className="absolute bottom-3 left-4 right-4 z-20 bg-stone-900/95 backdrop-blur-md border border-stone-700 p-3 rounded-lg text-xs text-stone-200 animate-in fade-in slide-in-from-bottom-2">
          {activePin === 'collar' && (
            <div>
              <div className="flex items-center justify-between font-semibold text-emerald-400 mb-1">
                <span>KB-NGUTHAN-01 · CỔ LẬP LĨNH</span>
                <span className="text-[10px] text-emerald-300 font-mono">INVARIANT</span>
              </div>
              <p className="text-stone-300">
                Cổ đứng cao 4-5cm ôm khít cổ, có 1 khuy cài cổ cố định. Đây là đặc trưng cốt lõi bất biến, thể hiện phong thái đoan chính.
              </p>
            </div>
          )}

          {activePin === 'lapel' && (
            <div>
              <div className="flex items-center justify-between font-semibold text-amber-400 mb-1">
                <span>KB-RULE-01 · QUY THỨC HỮU NHẬM</span>
                <span className="text-[10px] text-amber-300 font-mono">INVARIANT · SỐNG CÒN</span>
              </div>
              <p className="text-stone-300">
                Vạt trái đè lên vạt phải, khuy áo cài bên phải. Tuyệt đối cấm cài vạt sang trái (Tả nhậm - quy thức y phục tang ma).
              </p>
            </div>
          )}

          {activePin === 'sleeve' && (
            <div>
              <div className="flex items-center justify-between font-semibold text-blue-400 mb-1">
                <span>KB-NGUTHAN-02 · ỐNG TAY CHẼN</span>
                <span className="text-[10px] text-blue-300 font-mono">INVARIANT</span>
              </div>
              <p className="text-stone-300">
                Ống tay áo ôm thon dần về phía cổ tay, tạo sự gọn gàng, thuận tiện cho cử động hàng ngày.
              </p>
            </div>
          )}

          {activePin === 'ao_tac_sleeve' && (
            <div>
              <div className="flex items-center justify-between font-semibold text-emerald-400 mb-1">
                <span>KB-TAC-01 · TAY THỤNG CHỮ NHẬT</span>
                <span className="text-[10px] text-emerald-300 font-mono">INVARIANT BẤT BIẾN</span>
              </div>
              <p className="text-stone-300">
                Ống tay áo thụng rộng hình chữ nhật, khi thả xuôi dài bằng hoặc qua ngón tay. Đây là nhận diện cốt lõi của Áo Tấc lễ phục.
              </p>
            </div>
          )}

          {activePin === 'ao_tac_duster' && (
            <div>
              <div className="flex items-center justify-between font-semibold text-sky-400 mb-1">
                <span>KB-TAC-03 · DUSTER COAT KHẢ BIẾN</span>
                <span className="text-[10px] text-sky-300 font-mono">MUTABLE KHẢ BIẾN</span>
              </div>
              <p className="text-stone-300">
                Cho phép cởi mở khuy áo phía trước để tạo layer dạng áo khoác dáng dài (duster coat) hiện đại, phối với quần tây và giày bốt.
              </p>
            </div>
          )}

          {activePin === 'nhatbinh_collar' && (
            <div>
              <div className="flex items-center justify-between font-semibold text-emerald-400 mb-1">
                <span>KB-NHATBINH-01 · NẸP CỔ ĐỐI KHÂM</span>
                <span className="text-[10px] text-emerald-300 font-mono">INVARIANT BẤT BIẾN</span>
              </div>
              <p className="text-stone-300">
                Nẹp cổ to bản chạy dọc song song từ cổ xuống ngực tạo thành hình chữ nhật đặc trưng, có dải dây buộc ở ngực. Bất biến.
              </p>
            </div>
          )}

          {activePin === 'nhatbinh_cuff' && (
            <div>
              <div className="flex items-center justify-between font-semibold text-amber-400 mb-1">
                <span>KB-NHATBINH-02 · CỔ TAY NGŨ SẮC</span>
                <span className="text-[10px] text-amber-300 font-mono">INVARIANT BIỂU TƯỢNG</span>
              </div>
              <p className="text-stone-300">
                Dải màu ngũ hành/ngũ thường ở viền tay áo mang tính nhận diện biểu tượng. Bất biến, không đảo lộn lung tung.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer legend */}
      <div className="w-full flex items-center justify-between pt-2 border-t border-stone-800 text-[11px] text-stone-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Invariant (Bất biến)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Mutable (Khả biến)
          </span>
        </div>
        <span className="text-stone-400">Bấm điểm ghim để xem quy thức</span>
      </div>
    </div>
  );
};
