import React from 'react';
import { BookOpen, Sparkles, HelpCircle, Layers, Wind } from 'lucide-react';

export type WorkspaceTab = 'studio' | 'what-if' | 'anatomy' | 'ckb';

interface NavbarProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  onOpenCKBModal: () => void;
  motionEnabled?: boolean;
  onToggleMotion?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  motionEnabled = true,
  onToggleMotion,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#181311]/75 backdrop-blur-xl border-b border-[#C9A66B]/20 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Desktop / Tablet Bar (md:h-16 flex items-center justify-between) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-2.5 md:py-0 md:h-16 gap-2 md:gap-4">
          {/* Brand Lockup & Top Row on Mobile */}
          <div className="flex items-center justify-between w-full md:w-auto gap-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('studio');
              }}
              className="flex items-center gap-2 sm:gap-2.5 group shrink min-w-0"
              aria-label="Về trang chủ Xưởng phối đồ"
            >
              {/* Lacquer Cinnabar & Gold Emblem */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#B8342B]/25 text-[#C9A66B] border border-[#C9A66B]/40 flex items-center justify-center font-bold text-xs tracking-tight group-hover:border-[#C9A66B] group-hover:bg-[#B8342B]/35 transition-all shadow-xs shrink-0">
                KR
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm sm:text-base md:text-lg font-serif font-bold tracking-tight text-[#F2E9D8] group-hover:text-[#C9A66B] transition-colors leading-none truncate">
                  KUJO Re:Wear
                </span>
                {/* Subtitle: Hidden on mobile to prevent crowding */}
                <span className="hidden sm:block text-[11px] font-sans font-medium text-[#B8AA96] tracking-normal mt-0.5 whitespace-nowrap">
                  Vietnamese Heritage Co-Design Studio
                </span>
              </div>
            </a>

            {/* Mobile Motion Toggle (Placed cleanly in top right corner on mobile < md) */}
            {onToggleMotion && (
              <div className="md:hidden shrink-0">
                <button
                  type="button"
                  onClick={onToggleMotion}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-medium border border-[#C9A66B]/25 bg-[#211815]/80 text-[#B8AA96] hover:text-[#C9A66B] active:bg-[#2C211D] transition-colors cursor-pointer min-h-[36px] shadow-xs"
                  title={motionEnabled ? 'Tắt hiệu ứng chuyển động' : 'Bật hiệu ứng chuyển động'}
                  aria-label={`Hiệu ứng chuyển động: ${motionEnabled ? 'Đang bật' : 'Đang tắt'}`}
                >
                  <Wind className={`w-3.5 h-3.5 shrink-0 ${motionEnabled ? 'text-[#43B6A4]' : 'text-[#8C7E6C]'}`} />
                  <span>
                    <span className="hidden min-[380px]:inline">Chuyển động: </span>
                    <span className={motionEnabled ? 'text-[#E6C88B] font-semibold' : 'text-[#8C7E6C]'}>
                      {motionEnabled ? 'Bật' : 'Tắt'}
                    </span>
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Tab Navigation: Horizontal bar on desktop, clean scrolling bar on mobile */}
          <div className="w-full md:w-auto max-w-full">
            <nav
              className="flex items-center gap-1.5 p-1 bg-[#211815]/60 backdrop-blur-md rounded-xl border border-[#C9A66B]/20 overflow-x-auto no-scrollbar w-full md:w-auto overscroll-x-contain touch-pan-x"
              aria-label="Điều hướng không gian làm việc"
            >
              <button
                type="button"
                onClick={() => onSelectTab('studio')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[42px] md:min-h-[38px] cursor-pointer shrink-0 flex-1 sm:flex-initial ${
                  activeTab === 'studio'
                    ? 'bg-[#2E201B] text-[#C9A66B] shadow-xs border border-[#C9A66B]/60 font-bold'
                    : 'text-[#B8AA96] hover:text-[#F2E9D8] hover:bg-[#2A1E1A]/60'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'studio' ? 'text-[#C9A66B]' : 'text-[#8C7E6C]'}`} />
                <span>Xưởng phối đồ</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('what-if')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[42px] md:min-h-[38px] cursor-pointer shrink-0 flex-1 sm:flex-initial ${
                  activeTab === 'what-if'
                    ? 'bg-[#2E201B] text-[#C9A66B] shadow-xs border border-[#C9A66B]/60 font-bold'
                    : 'text-[#B8AA96] hover:text-[#F2E9D8] hover:bg-[#2A1E1A]/60'
                }`}
              >
                <HelpCircle className={`w-3.5 h-3.5 ${activeTab === 'what-if' ? 'text-[#C9A66B]' : 'text-[#8C7E6C]'}`} />
                <span className="hidden sm:inline">Thử thay đổi (What If)</span>
                <span className="sm:hidden">Thử thay đổi</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('anatomy')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[42px] md:min-h-[38px] cursor-pointer shrink-0 flex-1 sm:flex-initial ${
                  activeTab === 'anatomy'
                    ? 'bg-[#2E201B] text-[#43B6A4] shadow-xs border border-[#43B6A4]/60 font-bold'
                    : 'text-[#B8AA96] hover:text-[#F2E9D8] hover:bg-[#2A1E1A]/60'
                }`}
              >
                <Layers className={`w-3.5 h-3.5 ${activeTab === 'anatomy' ? 'text-[#43B6A4]' : 'text-[#8C7E6C]'}`} />
                <span>Cấu trúc áo</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('ckb')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[42px] md:min-h-[38px] cursor-pointer shrink-0 flex-1 sm:flex-initial ${
                  activeTab === 'ckb'
                    ? 'bg-[#2E201B] text-[#C9A66B] shadow-xs border border-[#C9A66B]/60 font-bold'
                    : 'text-[#B8AA96] hover:text-[#F2E9D8] hover:bg-[#2A1E1A]/60'
                }`}
              >
                <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'ckb' ? 'text-[#C9A66B]' : 'text-[#8C7E6C]'}`} />
                <span className="hidden sm:inline">Quy tắc tham chiếu</span>
                <span className="sm:hidden">Quy tắc CKB</span>
              </button>
            </nav>
          </div>

          {/* Desktop/Tablet Motion Toggle (Visible on md and lg, exactly one toggle at every breakpoint) */}
          {onToggleMotion && (
            <div className="hidden md:block shrink-0">
              <button
                type="button"
                onClick={onToggleMotion}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-mono font-medium border border-[#C9A66B]/25 bg-[#211815]/60 hover:bg-[#2C211D]/80 backdrop-blur-md text-[#B8AA96] hover:text-[#C9A66B] transition-colors cursor-pointer min-h-[38px]"
                title={motionEnabled ? 'Tắt hiệu ứng chuyển động' : 'Bật hiệu ứng chuyển động'}
                aria-label={`Hiệu ứng chuyển động: ${motionEnabled ? 'Đang bật' : 'Đang tắt'}`}
              >
                <Wind className={`w-3.5 h-3.5 ${motionEnabled ? 'text-[#43B6A4]' : 'text-[#8C7E6C]'}`} />
                <span>{motionEnabled ? 'Chuyển động: Bật' : 'Chuyển động: Tắt'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
