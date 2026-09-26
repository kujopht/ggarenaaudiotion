import React from 'react';

interface FooterProps {
  onOpenCKB: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCKB, onScrollToTop }) => {
  return (
    <footer className="w-full bg-[#181614] text-stone-300 py-12 px-6 border-t border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <span className="text-xl font-serif font-bold text-stone-100 block">
            ViệtPhục Remix Lab
          </span>
          <p className="text-xs text-stone-400 mt-1 max-w-md leading-relaxed">
            Hệ thống đồng sáng tạo thời trang đương đại song hành cùng chuyên gia thẩm định di sản văn hóa Việt phục chuẩn mực.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400">
          <button
            onClick={onOpenCKB}
            className="hover:text-stone-100 transition-colors underline underline-offset-4"
          >
            Cultural Knowledge Base (CKB)
          </button>
          <a
            href="#studio"
            className="hover:text-stone-100 transition-colors"
          >
            Xưởng Phối Đồ
          </a>
          <a
            href="#what-if"
            className="hover:text-stone-100 transition-colors"
          >
            What-If Simulator
          </a>
          <button
            onClick={onScrollToTop}
            className="hover:text-stone-100 transition-colors"
          >
            Về Đầu Trang ↑
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
        <div>
          © {new Date().getFullYear()} Việt Phục Remix Lab. Di sản triều Nguyễn (1802 - 1945).
        </div>
        <div className="font-mono">
          EVIDENCE REGISTRY v2.4 · DUAL-ROLE SYSTEM ARCHITECTURE
        </div>
      </div>
    </footer>
  );
};
