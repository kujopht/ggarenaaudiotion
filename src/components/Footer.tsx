import React from 'react';

interface FooterProps {
  onOpenCKB: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCKB, onScrollToTop }) => {
  return (
    <footer className="w-full bg-[#0F1115] text-[#94A3B8] py-8 px-6 border-t border-[#202530] mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0D9488]/15 text-[#2DD4BF] border border-[#0D9488]/30 flex items-center justify-center font-bold text-sm shrink-0">
            VP
          </div>
          <div>
            <span className="text-base font-serif font-bold text-[#F1F5F9] block">
              ViệtPhục Remix Lab
            </span>
            <p className="text-xs text-[#64748B] mt-0.5 max-w-md leading-relaxed">
              Studio đồng sáng tạo thời trang đương đại song hành cùng ghi chú tham chiếu văn hóa Việt phục.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-[#94A3B8]">
          <button
            onClick={onOpenCKB}
            className="hover:text-[#2DD4BF] transition-colors cursor-pointer"
          >
            Hồ sơ quy tắc tham chiếu
          </button>
          <button
            onClick={onScrollToTop}
            className="hover:text-[#2DD4BF] transition-colors cursor-pointer"
          >
            Lên đầu trang ↑
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-[#1C212B] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
        <div>
          © {new Date().getFullYear()} Việt Phục Remix Lab. Nền tảng thời trang di sản đương đại.
        </div>
        <div className="font-mono text-[11px] text-[#475569]">
          BẢO TỒN CỐT LÕI · TỰ DO BIẾN TẤU
        </div>
      </div>
    </footer>
  );
};
