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
    <header className="sticky top-0 z-40 w-full bg-[#181311]/95 backdrop-blur-md border-b border-[#3A2B25]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Lockup: Vietnamese Contemporary Fashion Studio */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('studio');
            }}
            className="flex items-center gap-2.5 group"
          >
            {/* Lacquer Cinnabar & Gold Emblem */}
            <div className="w-8 h-8 rounded-lg bg-[#B8342B]/20 text-[#C9A66B] border border-[#C9A66B]/40 flex items-center justify-center font-bold text-sm tracking-tight group-hover:border-[#C9A66B] group-hover:bg-[#B8342B]/30 transition-all shadow-xs">
              VP
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#F2E9D8] group-hover:text-[#C9A66B] transition-colors leading-none">
                Việt Phục Remix Lab
              </span>
              <span className="text-[11px] font-sans font-medium text-[#B8AA96] tracking-normal mt-0.5">
                Studio thời trang đương đại & tham chiếu văn hóa
              </span>
            </div>
          </a>
        </div>

        {/* Tab Navigation & Utilities */}
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#211815] rounded-xl border border-[#3A2B25] overflow-x-auto max-w-full">
            <button
              onClick={() => onSelectTab('studio')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-[#2E201B] text-[#C9A66B] shadow-xs border border-[#C9A66B]/50 font-bold'
                  : 'text-[#B8AA96] hover:text-[#F2E9D8] hover:bg-[#2A1E1A]'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'studio' ? 'text-[#C9A66B]' : 'text-[#8C7E6C]'}`} />
              <span>Xưởng phối đồ</span>
            </button>

            <button
              onClick={() => onSelectTab('what-if')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] cursor-pointer ${
                activeTab === 'what-if'
                  ? 'bg-[#2E201B] text-[#C9A66B] shadow-xs border border-[#C9A66B]/50 font-bold'
                  : 'text-[#B8AA96] hover:text-[#F2E9D8] hover:bg-[#2A1E1A]'
              }`}
            >
              <HelpCircle className={`w-3.5 h-3.5 ${activeTab === 'what-if' ? 'text-[#C9A66B]' : 'text-[#8C7E6C]'}`} />
              <span>Thử thay đổi (What If)</span>
            </button>

            <button
              onClick={() => onSelectTab('anatomy')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] cursor-pointer ${
                activeTab === 'anatomy'
                  ? 'bg-[#2E201B] text-[#43B6A4] shadow-xs border border-[#43B6A4]/50 font-bold'
                  : 'text-[#B8AA96] hover:text-[#F2E9D8] hover:bg-[#2A1E1A]'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${activeTab === 'anatomy' ? 'text-[#43B6A4]' : 'text-[#8C7E6C]'}`} />
              <span>Cấu trúc áo</span>
            </button>

            <button
              onClick={() => onSelectTab('ckb')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] cursor-pointer ${
                activeTab === 'ckb'
                  ? 'bg-[#2E201B] text-[#C9A66B] shadow-xs border border-[#C9A66B]/50 font-bold'
                  : 'text-[#B8AA96] hover:text-[#F2E9D8] hover:bg-[#2A1E1A]'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'ckb' ? 'text-[#C9A66B]' : 'text-[#8C7E6C]'}`} />
              <span>Quy tắc tham chiếu</span>
            </button>
          </nav>

          {/* Quick Motion Toggle in Navbar */}
          {onToggleMotion && (
            <button
              onClick={onToggleMotion}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-mono font-medium border border-[#3A2B25] bg-[#211815] hover:bg-[#2C211D] text-[#B8AA96] hover:text-[#C9A66B] transition-colors cursor-pointer min-h-[38px]"
              title={motionEnabled ? 'Tắt hiệu ứng chuyển động' : 'Bật hiệu ứng chuyển động'}
            >
              <Wind className={`w-3.5 h-3.5 ${motionEnabled ? 'text-[#43B6A4]' : 'text-[#8C7E6C]'}`} />
              <span>{motionEnabled ? 'Chuyển động: Bật' : 'Chuyển động: Tắt'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
