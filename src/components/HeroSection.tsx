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
        <div className="lg:col-span-7 space-y-3.5 sm:space-y-4 max-w-xl p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-[#181311]/90 via-[#181311]/70 to-[#181311]/30 border border-[#C9A66B]/20 backdrop-blur-md shadow-sm">
          {/* Subtle Editorial Kicker */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#C9A66B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8342B] shrink-0" />
            <span className="uppercase text-[11px] sm:text-xs">Sơn mài & Thời trang Việt đương đại</span>
          </div>

          {/* Big Editorial Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F2E9D8] tracking-tight leading-[1.12]">
            Việt phục. <br />
            <span className="text-[#C9A66B]">Theo cách của bạn.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#B8AA96] leading-relaxed max-w-lg">
            Phối lại nét xưa bằng gu riêng, cùng những gợi ý tham chiếu văn hóa.
          </p>

          {/* Primary Action Buttons */}
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
              className="px-4 py-3 bg-[#261C19]/80 hover:bg-[#322521] border border-[#C9A66B]/30 text-[#E6C88B] rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[46px] backdrop-blur-sm"
            >
              <BookOpen className="w-4 h-4 text-[#C9A66B]" />
              <span>Xem quy tắc tham chiếu</span>
            </button>
          </div>

          {/* Compact Footnote Disclaimer */}
          <p className="text-[11px] text-[#8C7E6C] leading-normal pt-1">
            * Họa tiết nghệ thuật thị giác lấy cảm hứng văn hóa, không thay thế cho mẫu rập may hoặc bảo chứng khảo cổ.
          </p>
        </div>

        {/* Right Column: Desktop Open Atmospheric Stage (5 cols, hidden on mobile for clean focus) */}
        <div className="hidden lg:flex lg:col-span-5 relative h-[240px] items-center justify-end pointer-events-none select-none">
          <div className="relative flex flex-col items-end justify-center pr-6 text-right space-y-2">
            {/* Resting Phoenix motif glowing softly in foreground */}
            <div className="w-28 h-28 opacity-80 drop-shadow-md">
              <VietnamesePhoenix size={110} />
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C9A66B]/70 block">
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
