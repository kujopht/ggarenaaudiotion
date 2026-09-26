import React from 'react';
import { BookOpen, Sparkles, HelpCircle, Layers } from 'lucide-react';

export type WorkspaceTab = 'studio' | 'what-if' | 'anatomy' | 'ckb';

interface NavbarProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  onOpenCKBModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#161920]/90 backdrop-blur-md border-b border-[#262C38]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Lockup: Modern Studio Identity */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('studio');
            }}
            className="flex items-center gap-2.5 group"
          >
            {/* Sleek Jade Minimal Emblem */}
            <div className="w-8 h-8 rounded-lg bg-[#0D9488]/15 text-[#2DD4BF] border border-[#0D9488]/30 flex items-center justify-center font-bold text-sm tracking-tight group-hover:border-[#14B8A6] group-hover:bg-[#0D9488]/25 transition-all">
              VP
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#F1F5F9] group-hover:text-[#2DD4BF] transition-colors leading-none">
                ViệtPhục Remix Lab
              </span>
              <span className="text-[11px] font-sans font-medium text-[#94A3B8] tracking-normal mt-0.5">
                Studio phối đồ đương đại & thẩm định di sản
              </span>
            </div>
          </a>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#1A1E26] rounded-xl border border-[#28303E] overflow-x-auto max-w-full">
          <button
            onClick={() => onSelectTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] ${
              activeTab === 'studio'
                ? 'bg-[#222834] text-[#2DD4BF] shadow-xs border border-[#0D9488]/40'
                : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#202530]'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'studio' ? 'text-[#2DD4BF]' : 'text-[#64748B]'}`} />
            <span>Xưởng phối đồ</span>
          </button>

          <button
            onClick={() => onSelectTab('what-if')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] ${
              activeTab === 'what-if'
                ? 'bg-[#222834] text-[#38BDF8] shadow-xs border border-[#0284C7]/40'
                : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#202530]'
            }`}
          >
            <HelpCircle className={`w-3.5 h-3.5 ${activeTab === 'what-if' ? 'text-[#38BDF8]' : 'text-[#64748B]'}`} />
            <span>Thử thay đổi (What If)</span>
          </button>

          <button
            onClick={() => onSelectTab('anatomy')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] ${
              activeTab === 'anatomy'
                ? 'bg-[#222834] text-[#34D399] shadow-xs border border-[#059669]/40'
                : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#202530]'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${activeTab === 'anatomy' ? 'text-[#34D399]' : 'text-[#64748B]'}`} />
            <span>Cấu trúc áo</span>
          </button>

          <button
            onClick={() => onSelectTab('ckb')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] ${
              activeTab === 'ckb'
                ? 'bg-[#222834] text-[#F59E0B] shadow-xs border border-[#D97706]/40'
                : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#202530]'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'ckb' ? 'text-[#F59E0B]' : 'text-[#64748B]'}`} />
            <span>Quy thức di sản</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

