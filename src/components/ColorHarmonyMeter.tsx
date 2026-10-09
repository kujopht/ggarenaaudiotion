import React from 'react';
import { Palette, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface ColorHarmonyMeterProps {
  colors: string[]; // List of color strings (e.g., ["#172554 (Chàm Đậm)", "#F1F5F9 (Trắng Ngà)"])
  className?: string;
}

interface HSL {
  h: number;
  s: number;
  l: number;
  hex: string;
  name: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 180, g: 150, b: 120 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

function parseColors(colorList: string[]): HSL[] {
  return colorList.map((str) => {
    const hexMatch = str.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
    const hex = hexMatch ? hexMatch[0] : '#C9A66B';
    const name = str.replace(hex, '').replace(/[()]/g, '').trim() || hex;
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
    return { h, s, l, hex, name };
  });
}

function calculateHarmony(hsls: HSL[]): { score: number; verdict: string; explanation: string; harmonyType: string } {
  if (hsls.length < 2) {
    return {
      score: 85,
      verdict: 'Đơn sắc tinh tế',
      explanation: 'Sắc thái đồng nhất tạo vẻ đẹp tối giản, chuẩn mực và dễ mặc trong đời sống.',
      harmonyType: 'Đơn sắc (Monochrome)',
    };
  }

  let baseScore = 75;
  let hasNeutral = false;
  let maxHueDiff = 0;
  let minHueDiff = 360;

  hsls.forEach((c) => {
    // Check if neutral: very low saturation or very high/low lightness (white, black, ivory, slate)
    if (c.s < 20 || c.l > 85 || c.l < 15) {
      hasNeutral = true;
    }
  });

  // Check hue distances
  for (let i = 0; i < hsls.length; i++) {
    for (let j = i + 1; j < hsls.length; j++) {
      let diff = Math.abs(hsls[i].h - hsls[j].h);
      if (diff > 180) diff = 360 - diff;
      maxHueDiff = Math.max(maxHueDiff, diff);
      minHueDiff = Math.min(minHueDiff, diff);
    }
  }

  // Bonus for neutral anchor (trắng ngà, chàm đậm, đen tuyền làm nền)
  if (hasNeutral) {
    baseScore += 10;
  }

  let harmonyType = 'Phối màu kết hợp';
  let explanation = '';

  if (maxHueDiff <= 40) {
    // Analogous / Monochromatic
    baseScore += 12;
    harmonyType = 'Tương đồng (Analogous)';
    explanation = 'Bảng màu tương đồng mang lại sự êm dịu thị giác, liền mạch với phom dáng truyền thống và phong cách tối giản.';
  } else if (Math.abs(maxHueDiff - 180) <= 35) {
    // Complementary
    baseScore += 12;
    harmonyType = 'Bổ túc trực tiếp (Complementary)';
    explanation = 'Cặp màu bổ túc tạo điểm nhấn tương phản sắc sảo, nổi bật các đường may nẹp cổ và chi tiết phụ kiện đương đại.';
  } else if (Math.abs(maxHueDiff - 120) <= 30) {
    // Triadic
    baseScore += 8;
    harmonyType = 'Tam giác màu (Triadic)';
    explanation = 'Phối màu tam giác phong phú nhưng cân bằng nhờ sắc độ tự nhiên của vật liệu dệt.';
  } else {
    // Mixed
    if (hasNeutral) {
      baseScore += 5;
      harmonyType = 'Nhấn màu trên nền trung tính';
      explanation = 'Sự xuất hiện của sắc trung tính (ngà/chàm) giúp kết nối các gam màu khác nhau, tránh cảm giác rối mắt.';
    } else {
      baseScore -= 6;
      harmonyType = 'Đa sắc tự do';
      explanation = 'Các sắc độ có độ chênh lệch cao, tạo ấn tượng phá cách đậm chất thể nghiệm.';
    }
  }

  const finalScore = Math.max(65, Math.min(98, baseScore));
  let verdict = 'Hài hòa xuất sắc';
  if (finalScore < 75) verdict = 'Phá cách thể nghiệm';
  else if (finalScore < 85) verdict = 'Hài hòa cân đối';

  return { score: finalScore, verdict, explanation, harmonyType };
}

export const ColorHarmonyMeter: React.FC<ColorHarmonyMeterProps> = ({
  colors,
  className = '',
}) => {
  const parsed = parseColors(colors);
  const { score, verdict, explanation, harmonyType } = calculateHarmony(parsed);

  // 12 hue anchors around the 360deg wheel for SVG rendering
  const wheelRadius = 38;
  const wheelCenter = 44;

  return (
    <div className={`lacquer-panel-subtle rounded-xl p-3 border border-[#C9A66B]/20 text-xs space-y-2.5 ${className}`}>
      {/* Top title */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A66B] font-semibold flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-[#E6C88B]" />
          Kiểm Tra Hài Hòa Màu Sắc
        </span>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#C9A66B]/15 text-[#E6C88B] border border-[#C9A66B]/30">
          {score}/100 ĐIỂM
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* SVG Mini Color Wheel with Selected Color Pins */}
        <div className="relative w-[88px] h-[88px] shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 88 88" className="w-full h-full">
            {/* 12-segment ring */}
            <circle
              cx={wheelCenter}
              cy={wheelCenter}
              r={wheelRadius}
              stroke="#2C211D"
              strokeWidth="5"
              fill="none"
            />
            {/* 12 rainbow hue dots around circle */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = (deg - 90) * (Math.PI / 180);
              const x = wheelCenter + wheelRadius * Math.cos(rad);
              const y = wheelCenter + wheelRadius * Math.sin(rad);
              return (
                <circle
                  key={deg}
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill={`hsl(${deg}, 70%, 55%)`}
                  opacity="0.5"
                />
              );
            })}

            {/* Selected Color Markers */}
            {parsed.map((c, i) => {
              const rad = (c.h - 90) * (Math.PI / 180);
              const x = wheelCenter + wheelRadius * Math.cos(rad);
              const y = wheelCenter + wheelRadius * Math.sin(rad);
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill={c.hex}
                    stroke="#F2E9D8"
                    strokeWidth="1.5"
                    className="filter drop-shadow-xs"
                  />
                  {/* Line to center */}
                  <line
                    x1={wheelCenter}
                    y1={wheelCenter}
                    x2={x}
                    y2={y}
                    stroke={c.hex}
                    strokeWidth="1"
                    strokeOpacity="0.4"
                  />
                </g>
              );
            })}

            {/* Center hub */}
            <circle cx={wheelCenter} cy={wheelCenter} r="4" fill="#C9A66B" />
          </svg>
        </div>

        {/* Score bar & description */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#F2E9D8]">{verdict}</span>
            <span className="text-[#8C7E6C] text-[10px] font-mono">{harmonyType}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#261C19] rounded-full overflow-hidden border border-[#C9A66B]/20">
            <div
              className="h-full bg-linear-to-r from-[#C9A66B] via-[#E6C88B] to-[#43B6A4] transition-all duration-500 rounded-full"
              style={{ width: `${score}%` }}
            />
          </div>

          <p className="text-[10px] text-[#B8AA96] leading-relaxed line-clamp-2" title={explanation}>
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
};
