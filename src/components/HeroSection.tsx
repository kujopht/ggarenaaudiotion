import React from 'react';
import { ArrowDown, BookOpen, Wind } from 'lucide-react';
import { VietnamesePhoenix } from './MotionMotifs';

interface HeroSectionProps {
  onStartCoDesign: () => void;
  onOpenCKB: () => void;
  motionEnabled: boolean;
  onToggleMotion: () => void;
}

/**
 * Editorial Hero Section ("Sơn Mài Đương Đại")
 * Open, breathable layout that blends seamlessly into the global heritage background.
 * The grand rotating Dong Son bronze drum shines through from the background behind the right side.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartCoDesign,
  onOpenCKB,
  motionEnabled,
  onToggleMotion,
}) => {
  return (
    <section className="relative w-full mb-6 min-h-[300px] sm:min-h-[340px] md:min-h-[360px] flex items-center">
      {/* 2-Column Asymmetric Flow */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-6 py-4">
        {/* Left Column: Editorial Headline & Actions (7 cols) with soft legibility backdrop */}
        <div className="lg:col-span-7 space-y-4 max-w-xl p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-[#181311]/85 via-[#181311]/60 to-[#181311]/20 border border-[#C9A66B]/20 backdrop-blur-[10px] shadow-sm">
          {/* Subtle Category Kicker */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#C9A66B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8342B]" />
            <span className="uppercase">Sơn mài & Thời trang Việt đương đại</span>
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
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onStartCoDesign}
              className="px-5 py-2.5 bg-[#B8342B] hover:bg-[#A32D25] active:bg-[#8F251E] text-[#F2E9D8] rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer min-h-[44px]"
            >
              <span>Bắt đầu phối</span>
              <ArrowDown className="w-4 h-4 text-[#F5DCA3]" />
            </button>

            <button
              onClick={onOpenCKB}
              className="px-4 py-2.5 bg-[#261C19]/80 hover:bg-[#322521] border border-[#C9A66B]/30 text-[#E6C88B] rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer min-h-[44px] backdrop-blur-sm"
            >
              <BookOpen className="w-4 h-4 text-[#C9A66B]" />
              <span>Xem quy tắc tham chiếu</span>
            </button>
          </div>

          {/* Disclaimer Note */}
          <p className="text-[11px] text-[#8C7E6C] leading-normal pt-1">
            * Họa tiết trống đồng và phượng hoàng là nghệ thuật thị giác lấy cảm hứng văn hóa, không thay thế cho mẫu rập may hoặc bảo chứng khảo cổ.
          </p>
        </div>

        {/* Right Column: Open Atmospheric Stage (5 cols) */}
        {/* Allows the background drum to emerge with subtle foreground watermark accent */}
        <div className="lg:col-span-5 relative h-[180px] sm:h-[220px] lg:h-[280px] flex items-center justify-center lg:justify-end pointer-events-none select-none">
          <div className="relative flex flex-col items-center lg:items-end justify-center pr-2 lg:pr-8 text-right space-y-2">
            {/* Resting Phoenix motif glowing softly in foreground */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 opacity-80 drop-shadow-md">
              <VietnamesePhoenix size={110} />
            </div>

            <div className="hidden sm:block">
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

      {/* Motion Controls Toggle (Floating lacquer glass pill) */}
      <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20">
        <button
          onClick={onToggleMotion}
          className="text-xs font-mono font-medium px-3 py-1.5 rounded-lg bg-[#211815]/75 hover:bg-[#2C211D] border border-[#C9A66B]/30 text-[#C9A66B] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs backdrop-blur-md"
          title={motionEnabled ? 'Tắt chuyển động nền di sản' : 'Bật chuyển động nền di sản'}
        >
          <Wind className={`w-3.5 h-3.5 ${motionEnabled ? 'text-[#43B6A4]' : 'text-[#8C7E6C]'}`} />
          <span>Chuyển động: {motionEnabled ? 'Bật' : 'Tắt'}</span>
        </button>
      </div>
    </section>
  );
};
