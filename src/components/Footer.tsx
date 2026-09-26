import React from 'react';

interface FooterProps {
  onOpenCKB: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCKB, onScrollToTop }) => {
  return (
    <footer className="w-full bg-[#1C1917] text-[#D6CEBE] py-10 px-6 border-t border-[#2E2824] mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#991B1B] text-[#FEF3C7] flex items-center justify-center font-serif font-black text-sm shrink-0 border border-[#7F1D1D]">
            VIỆT
          </div>
          <div>
            <span className="text-base font-serif font-bold text-[#FAF7F0] block">
              ViệtPhục Remix Lab
            </span>
            <p className="text-xs text-[#A8A29E] mt-0.5 max-w-md leading-relaxed">
              Hệ thống đồng sáng tạo thời trang đương đại song hành cùng chuyên gia thẩm định di sản văn hóa Việt phục chuẩn mực triều Nguyễn (1802 - 1945).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-[#A8A29E]">
          <button
            onClick={onOpenCKB}
            className="hover:text-[#FEF3C7] transition-colors underline underline-offset-4"
          >
            Hồ sơ CKB & Evidence
          </button>
          <button
            onClick={onScrollToTop}
            className="hover:text-[#FEF3C7] transition-colors"
          >
            Lên Đầu Trang ↑
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-5 border-t border-[#2E2824] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#78716C] gap-2">
        <div>
          © {new Date().getFullYear()} Việt Phục Remix Lab. Nền tảng thời trang di sản thế hệ mới.
        </div>
        <div className="font-mono text-[10px]">
          GOVERNANCE: INVARIANT · MUTABLE · REDLINES PROTOCOL
        </div>
      </div>
    </footer>
  );
};
