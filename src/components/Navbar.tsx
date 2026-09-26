import React from 'react';
import { BookOpen, Sparkles, Compass, HelpCircle, Layers } from 'lucide-react';

export type WorkspaceTab = 'studio' | 'what-if' | 'anatomy' | 'ckb';

interface NavbarProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  onOpenCKBModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, onOpenCKBModal }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E2DBD0] shadow-[0_1px_4px_rgba(40,30,20,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Lockup: Modern Vietnamese Traditional Seal + Typography */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('studio');
            }}
            className="flex items-center gap-2.5 group"
          >
            {/* Vietnamese Square Heritage Seal */}
            <div className="w-8 h-8 rounded bg-[#991B1B] text-[#FEF3C7] flex items-center justify-center font-serif font-black text-sm tracking-tighter shadow-sm border border-[#7F1D1D] group-hover:scale-105 transition-transform">
              VIỆT
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#1C1917] group-hover:text-[#991B1B] transition-colors leading-none">
                ViệtPhục Remix Lab
              </span>
              <span className="text-[10px] font-sans font-medium text-[#78716C] tracking-wider uppercase mt-0.5">
                Đồng Sáng Tạo & Thẩm Định Di Sản
              </span>
            </div>
          </a>
        </div>

        {/* Tab Navigation: Direct Screen Switchers (No Endless Scrolling) */}
        <nav className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#ECE6DA] rounded-xl border border-[#DCD4C4]">
          <button
            onClick={() => onSelectTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-[#1C1917] text-[#FAF7F0] shadow-sm'
                : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#E2DAD0]/60'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'studio' ? 'text-[#F59E0B]' : 'text-[#78716C]'}`} />
            <span>Xưởng Phối Đồ</span>
          </button>

          <button
            onClick={() => onSelectTab('what-if')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'what-if'
                ? 'bg-[#1C1917] text-[#FAF7F0] shadow-sm'
                : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#E2DAD0]/60'
            }`}
          >
            <HelpCircle className={`w-3.5 h-3.5 ${activeTab === 'what-if' ? 'text-[#38BDF8]' : 'text-[#78716C]'}`} />
            <span>"What If...?" Lab</span>
          </button>

          <button
            onClick={() => onSelectTab('anatomy')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'anatomy'
                ? 'bg-[#1C1917] text-[#FAF7F0] shadow-sm'
                : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#E2DAD0]/60'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${activeTab === 'anatomy' ? 'text-[#34D399]' : 'text-[#78716C]'}`} />
            <span>Giải Phẫu Cổ Phục</span>
          </button>

          <button
            onClick={() => onSelectTab('ckb')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'ckb'
                ? 'bg-[#1C1917] text-[#FAF7F0] shadow-sm'
                : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#E2DAD0]/60'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'ckb' ? 'text-[#F59E0B]' : 'text-[#78716C]'}`} />
            <span>Quy Thức CKB</span>
          </button>
        </nav>

        {/* Traditional Accent Stamp */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="text-[11px] font-mono text-[#78716C] bg-[#FAF7F0] border border-[#D6CEBE] px-2.5 py-1 rounded-md">
            <span>TRIỀU NGUYỄN · CKB v2.4</span>
          </div>
        </div>
      </div>
    </header>
  );
};
