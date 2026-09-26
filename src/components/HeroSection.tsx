import React from 'react';
import { ArrowRight, BookOpen, Compass, Sparkles, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onStartCoDesign: () => void;
  onOpenCKB: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartCoDesign,
  onOpenCKB,
}) => {
  return (
    <section className="relative pt-12 pb-16 px-6 border-b border-stone-200">
      <div className="max-w-7xl mx-auto">
        {/* Curatorial Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-8 border-b border-stone-300 text-xs font-mono text-stone-500">
          <div className="flex items-center gap-2">
            <span>VOL. 2026 · HỆ THỐNG ĐỒNG SÁNG TẠO & THẨM ĐỊNH</span>
            <span aria-hidden="true">·</span>
            <span>DI SẢN TRIỀU NGUYỄN</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <span>AUDITOR EVIDENCE PROTOCOL: CKB v2.4</span>
          </div>
        </div>

        {/* Marquee Editorial Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-950 tracking-tight leading-[1.12] text-balance">
              Giao Thoa Giữa Sáng Tạo Đương Đại & Thẩm Định Di Sản Chuẩn Mực
            </h1>

            {/* Editorial Lead Paragraph with Drop Cap */}
            <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-serif max-w-3xl first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-900">
              Việt Phục Remix Lab vận hành đồng thời hai vai trò song song: một nhà thiết kế đồng hành giúp Gen Z giải phóng phom dáng cổ truyền thành trang phục streetwear và high-fashion đương đại; cùng một chuyên gia giám định di sản nghiêm ngặt, đảm bảo mọi biến tấu đều tôn trọng ranh giới thiêng liêng của văn hóa tiền nhân.
            </p>

            {/* Interactive CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartCoDesign}
                className="px-6 py-3 bg-stone-950 hover:bg-stone-800 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-md group"
              >
                <span>Khởi Tạo Phối Đồ Ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenCKB}
                className="px-5 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-sm"
              >
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Xem Hồ Sơ CKB & Redlines</span>
              </button>
            </div>
          </div>

          {/* Right Column: Dual-Role Curatorial Cards */}
          <div className="lg:col-span-4 space-y-4 pt-2">
            {/* Role 1 Card */}
            <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-2.5 text-xs font-mono text-stone-500 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>VAI TRÒ 01</span>
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Contemporary Fashion Co-Designer
              </h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Tư vấn mix-match trang phục Áo Ngũ Thân, Áo Tấc, Nhật Bình theo các nấc Dial (1 đến 5) kết hợp cùng denim thô, chân váy xếp ly, suit tailoring và chunky footwear.
              </p>
            </div>

            {/* Role 2 Card */}
            <div className="p-5 bg-[#FAF7F0] border-2 border-stone-800 rounded-xl shadow-sm">
              <div className="flex items-center gap-2.5 text-xs font-mono text-stone-700 uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>VAI TRÒ 02</span>
              </div>
              <h3 className="text-base font-serif font-bold text-stone-950">
                Rigorous Cultural Auditor
              </h3>
              <p className="text-xs text-stone-700 mt-1.5 leading-relaxed">
                Thẩm định độc quyền trên 12 điều khoản CKB: kiểm soát Invariant (Cổ lập lĩnh, Hữu nhậm, Ống tay thụng) và kích hoạt cảnh báo Redline với Tả nhậm tang ma & Rồng 5 móng hoàng quyền.
              </p>
            </div>
          </div>
        </div>

        {/* Operational Ribbon */}
        <div className="mt-12 pt-6 border-t border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-600">
          <div>
            <span className="font-mono text-[10px] text-stone-400 uppercase block">TRỌNG TÂM DI SẢN</span>
            <span className="font-semibold text-stone-800">Y phục triều Nguyễn (1802 - 1945)</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-stone-400 uppercase block">QUY TẮC THẨM ĐỊNH</span>
            <span className="font-semibold text-stone-800">3 Trạng thái chuẩn (Không dùng điểm số)</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-stone-400 uppercase block">CƠ CHẾ XỬ LÝ</span>
            <span className="font-semibold text-stone-800">Tạo 2 Phương án + "What-If" Simulator</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-stone-400 uppercase block">BẢO CHỨNG DI SẢN</span>
            <span className="font-semibold text-stone-800">Evidence Registry CKB Bất biến</span>
          </div>
        </div>
      </div>
    </section>
  );
};
