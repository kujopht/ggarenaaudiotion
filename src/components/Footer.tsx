import React from 'react';

interface FooterProps {
  onOpenCKB: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCKB, onScrollToTop }) => {
  return (
    <footer className="w-full bg-[#181311]/70 backdrop-blur-md text-[#B8AA96] py-8 px-6 border-t border-[#C9A66B]/20 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#B8342B]/25 text-[#C9A66B] border border-[#C9A66B]/40 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            KR
          </div>
          <div>
            <span className="text-base font-serif font-bold text-[#F2E9D8] block">
              KUJO Re:Wear
            </span>
            <p className="text-xs text-[#8C7E6C] mt-0.5 max-w-md leading-relaxed">
              Vietnamese Heritage Co-Design Studio · Wear heritage differently.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-[#B8AA96]">
          <button
            onClick={onOpenCKB}
            className="hover:text-[#E6C88B] transition-colors cursor-pointer"
          >
            Hồ sơ quy tắc tham chiếu
          </button>
          <button
            onClick={onScrollToTop}
            className="hover:text-[#E6C88B] transition-colors cursor-pointer"
          >
            Lên đầu trang ↑
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-[#C9A66B]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C7E6C] gap-2">
        <div>
          © {new Date().getFullYear()} KUJO Re:Wear. Nền tảng thời trang di sản đương đại.
        </div>
        <div className="font-mono text-[11px] text-[#6E5D53]">
          SƠN MÀI ĐƯƠNG ĐẠI · BẢO TỒN CỐT LÕI · TỰ DO BIẾN TẤU
        </div>
      </div>
    </footer>
  );
};
