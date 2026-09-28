import React from 'react';
import { ArrowDown, BookOpen } from 'lucide-react';
import { VietnamesePhoenix } from './MotionMotifs';

interface HeroSectionProps {
  onStartCoDesign: () => void;
  onOpenCKB: () => void;
  motionEnabled: boolean;
  onToggleMotion: () => void;
}

/**
 * Editorial Hero Section ("Sơn Mài Đương Đại")
 * Fashion Editorial Cover layout:
 * - Mobile: Headline is centerstage, touch-friendly CTAs, airy breathing room, no cluttered motifs.
 * - Desktop: Asymmetric 2-column with artistic resting phoenix and glowing background drum.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartCoDesign,
  onOpenCKB,
}) => {
  return (
    <section className="relative w-full mb-6 min-h-[260px] sm:min-h-[300px] md:min-h-[340px] flex items-center">
      {/* Editorial Content Container */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-6 py-2 md:py-4">
        {/* Main Column: Fashion Editorial Headline & Actions (7 cols desktop, full width mobile) */}
        <div className="lg:col-span-7 space-y-3.5 sm:space-y-4.5 max-w-xl py-2 relative">
          {/* Subtle local soft contrast gradient behind text, avoiding big enclosing card feel */}
          <div className="absolute -inset-x-3 -inset-y-2 bg-gradient-to-r from-[#120E0D]/90 via-[#120E0D]/65 to-transparent -z-10 rounded-2xl pointer-events-none blur-sm" />

          {/* Subtle Editorial Kicker */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#C9A66B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8342B] shrink-0" />
            <span className="uppercase text-[11px] sm:text-xs">Sơn mài & Thời trang Việt đương đại</span>
          </div>

          {/* Big Editorial Headline blending seamlessly into background */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F2E9D8] tracking-tight leading-[1.12]">
            Việt phục. <br />
            <span className="text-[#C9A66B]">Theo cách của bạn.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#B8AA96] leading-relaxed max-w-lg">
            Phối lại nét xưa bằng gu riêng, cùng những gợi ý tham chiếu văn hóa.
          </p>

          {/* Primary Action Buttons - Each with its own tactile surface */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
            <button
              type="button"
              onClick={onStartCoDesign}
              className="px-5 py-3 bg-[#B8342B] hover:bg-[#A32D25] active:bg-[#8F251E] text-[#F2E9D8] rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer min-h-[46px]"
            >
              <span>Bắt đầu phối</span>
              <ArrowDown className="w-4 h-4 text-[#F5DCA3]" />
            </button>

            <button
              type="button"
              onClick={onOpenCKB}
              className="px-4 py-3 bg-[#261C19]/90 hover:bg-[#322521] border border-[#C9A66B]/35 text-[#E6C88B] rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[46px] shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-[#C9A66B]" />
              <span>Xem quy tắc tham chiếu</span>
            </button>
          </div>

          {/* Compact Footnote Disclaimer */}
          <p className="text-[11px] text-[#8C7E6C] leading-normal pt-0.5">
            * Họa tiết nghệ thuật thị giác lấy cảm hứng văn hóa, không thay thế cho mẫu rập may hoặc bảo chứng khảo cổ.
          </p>
        </div>

        {/* Right Column: Desktop Open Atmospheric Stage (5 cols, hidden on mobile for clean focus) */}
        <div className="hidden lg:flex lg:col-span-5 relative h-[220px] items-center justify-end pointer-events-none select-none">
          <div className="relative flex flex-col items-end justify-center pr-6 text-right space-y-2 opacity-85">
            {/* Resting Phoenix motif glowing softly in background edge */}
            <div className="w-24 h-24 opacity-75">
              <VietnamesePhoenix size={96} />
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C9A66B]/75 block">
                Không Gian Di Sản
              </span>
              <span className="text-xs font-serif italic text-[#B8AA96]/80 block">
                Nét chạm đồng & sắc đỏ chu sa
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
