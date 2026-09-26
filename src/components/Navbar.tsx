import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenCKB: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCKB, onScrollToSection }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8F6F0]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in display face */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl font-serif font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:text-amber-900 transition-colors"
        >
          ViệtPhục Remix Lab
        </a>

        {/* Zone 2: 4-6 clean text navigation links (single line, subtle hover underline) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onScrollToSection('studio')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap underline-offset-4 hover:underline"
          >
            Co-Designer
          </button>
          <button
            onClick={() => onScrollToSection('what-if')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap underline-offset-4 hover:underline"
          >
            What-If Lab
          </button>
          <button
            onClick={() => onScrollToSection('schematic')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap underline-offset-4 hover:underline"
          >
            Anatomy
          </button>
          <button
            onClick={onOpenCKB}
            className="hover:text-stone-900 transition-colors whitespace-nowrap underline-offset-4 hover:underline"
          >
            Evidence CKB
          </button>
          <button
            onClick={() => onScrollToSection('manifesto')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap underline-offset-4 hover:underline"
          >
            Tôn Chỉ
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCKB}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-stone-800 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Tra Cứu CKB</span>
          </button>
          <button
            onClick={() => onScrollToSection('studio')}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            Phối Đồ Ngay
          </button>
        </div>
      </div>
    </header>
  );
};
