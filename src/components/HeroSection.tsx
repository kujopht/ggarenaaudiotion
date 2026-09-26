import React from 'react';
import { ArrowDown, BookOpen, Sparkles, Wind } from 'lucide-react';
import { DongSonBronzeDrum, VietnamesePhoenix, GlidingPhoenixController } from './MotionMotifs';

interface HeroSectionProps {
  onStartCoDesign: () => void;
  onOpenCKB: () => void;
  motionEnabled: boolean;
  onToggleMotion: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartCoDesign,
  onOpenCKB,
  motionEnabled,
  onToggleMotion,
}) => {
  return (
    <section className="relative w-full rounded-2xl bg-[#1C1513] border border-[#3A2B25] overflow-hidden mb-6 shadow-xl">
      {/* Gliding Phoenix Animation Layer (active only when motion is enabled) */}
      <GlidingPhoenixController enabled={motionEnabled} />

      {/* Main Content Layout: Asymmetric 2-column */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center min-h-[320px] md:min-h-[360px] p-6 sm:p-8 lg:p-10 gap-6">
        {/* Left Column: Editorial Headline & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4 max-w-xl">
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
              className="px-4 py-2.5 bg-[#261C19] hover:bg-[#322521] border border-[#4A3830] text-[#E6C88B] rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer min-h-[44px]"
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

        {/* Right Column: Visual Artwork (Bronze Drum + Phoenix Composition) (5 cols) */}
        <div className="lg:col-span-5 relative h-[220px] sm:h-[280px] lg:h-[320px] flex items-center justify-center lg:justify-end overflow-hidden">
          {/* Bronze Drum Artwork: Positioned with subtle crop on the right edge */}
          <div className="relative w-[280px] sm:w-[320px] lg:w-[380px] h-[280px] sm:h-[320px] lg:h-[380px] flex items-center justify-center translate-x-4 lg:translate-x-12 opacity-90 pointer-events-none select-none">
            <DongSonBronzeDrum
              size={360}
              isRotating={motionEnabled}
              className="max-w-none transition-transform duration-700"
            />

            {/* Resting Stylized Phoenix in Center-Right foreground */}
            <div className="absolute top-[28%] left-[22%] transform -translate-x-4">
              <VietnamesePhoenix size={140} className="opacity-95 drop-shadow-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Motion Controls Bar (Bottom right pill for easy discovery) */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20">
        <button
          onClick={onToggleMotion}
          className="text-xs font-mono font-medium px-3 py-1.5 rounded-lg bg-[#261C19]/90 hover:bg-[#322521] border border-[#4A3830] text-[#C9A66B] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm backdrop-blur-sm"
          title={motionEnabled ? 'Tắt chuyển động trống & phượng' : 'Bật chuyển động trống & phượng'}
        >
          <Wind className={`w-3.5 h-3.5 ${motionEnabled ? 'text-[#43B6A4]' : 'text-[#8C7E6C]'}`} />
          <span>Hiệu ứng: {motionEnabled ? 'Bật' : 'Tắt'}</span>
        </button>
      </div>
    </section>
  );
};
