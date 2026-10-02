import React, { useState } from 'react';
import { GarmentKey } from '../types/vietphuc';
import { GarmentSchematic } from './GarmentSchematic';
import { ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface AnatomySectionProps {
  onOpenCKB: (id?: string) => void;
}

export const AnatomySection: React.FC<AnatomySectionProps> = ({ onOpenCKB }) => {
  const [activeTab, setActiveTab] = useState<GarmentKey>('ngu_than');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="lacquer-panel rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-[#E6C88B] uppercase tracking-wider bg-[#C9A66B]/15 px-2 py-0.5 rounded border border-[#C9A66B]/30">
              Interactive Structural Reference
            </span>
            <span className="text-[#8C7E6C]">·</span>
            <span className="text-xs text-[#B8AA96]">Sơ đồ cấu trúc kỹ thuật & phân định bất biến / khả biến</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F2E9D8] tracking-tight">
            Giải phẫu cấu trúc y phục cổ truyền
          </h2>
          <p className="text-sm text-[#B8AA96] max-w-2xl leading-relaxed">
            Công cụ tham chiếu cấu trúc tương tác (Interactive Structural Reference). Dùng để phân định rạch ròi vị trí khuy, vạt, nẹp cổ giữa Vùng Bất Biến (Invariant) và Vùng Khả Biến (Mutable) của y phục thời Nguyễn, độc lập với ảnh dựng thời trang.
          </p>
        </div>
      </div>

      {/* Garment Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 lacquer-panel-subtle rounded-xl max-w-xl">
        <button
          onClick={() => setActiveTab('ngu_than')}
          className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[40px] cursor-pointer ${
            activeTab === 'ngu_than'
              ? 'bg-[#2E201B]/90 text-[#C9A66B] border border-[#C9A66B]/50 shadow-xs'
              : 'text-[#B8AA96] hover:text-[#F2E9D8]'
          }`}
        >
          Áo Ngũ Thân tay chẽn
        </button>
        <button
          onClick={() => setActiveTab('ao_tac')}
          className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[40px] cursor-pointer ${
            activeTab === 'ao_tac'
              ? 'bg-[#2E201B]/90 text-[#C9A66B] border border-[#C9A66B]/50 shadow-xs'
              : 'text-[#B8AA96] hover:text-[#F2E9D8]'
          }`}
        >
          Áo Tấc lễ phục
        </button>
        <button
          onClick={() => setActiveTab('nhat_binh')}
          className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[40px] cursor-pointer ${
            activeTab === 'nhat_binh'
              ? 'bg-[#2E201B]/90 text-[#C9A66B] border border-[#C9A66B]/50 shadow-xs'
              : 'text-[#B8AA96] hover:text-[#F2E9D8]'
          }`}
        >
          Áo Nhật Bình hoàng triều
        </button>
      </div>

      {/* Anatomy Content Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center lacquer-card-elevated rounded-2xl p-5 sm:p-6">
        {/* Left: Interactive SVG Schematic Viewport */}
        <div className="lg:col-span-6">
          <div className="border border-[#C9A66B]/25 rounded-xl overflow-hidden shadow-inner">
            <GarmentSchematic garment={activeTab} dialLevel={2} />
          </div>
        </div>

        {/* Right: Architectural Rules Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          {activeTab === 'ngu_than' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-[#C9A66B] uppercase tracking-wider font-semibold block">
                  NHẬN DIỆN CỐT LÕI · ÁO NGŨ THÂN TAY CHẼN
                </span>
                <h3 className="text-xl font-serif font-bold text-[#F2E9D8] mt-1">
                  Biểu trưng của sự đoan chính & nho nhã
                </h3>
                <p className="text-sm text-[#B8AA96] mt-1.5 leading-relaxed font-serif">
                  Áo Ngũ Thân tay chẽn là y phục phổ biến nhất của người Việt thời Nguyễn. Cấu trúc 5 thân tượng trưng cho đạo hiếu (tứ thân phụ mẫu ôm lấy người mặc), kết hợp cổ lập lĩnh đứng thẳng và quy thức cài vạt bên phải (Hữu nhậm).
                </p>
              </div>

              {/* Invariants */}
              <div className="p-4 bg-[#B8342B]/15 border border-[#B8342B]/40 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="font-semibold text-[#F5A39D] flex items-center gap-1.5 font-serif">
                  <ShieldCheck className="w-4 h-4 text-[#F5A39D]" />
                  <span>VÙNG BẤT BIẾN (QUY THỨC CỐT LÕI)</span>
                </div>
                <ul className="space-y-1.5 text-[#F2E9D8] text-xs sm:text-sm leading-relaxed">
                  <li>
                    <span className="font-bold text-[#F5A39D]">KB-RULE-01 (Hữu nhậm):</span> Vạt trái đè lên vạt phải, khuy cài bên phải theo quy ước cấu trúc cố định của prototype.
                  </li>
                  <li>
                    <span className="font-bold text-[#F5A39D]">KB-NGUTHAN-01 (Cổ vuông đứng):</span> Cổ vuông đứng kín đáo, giữ phom nhận diện truyền thống.
                  </li>
                  <li>
                    <span className="font-bold text-[#F5A39D]">KB-NGUTHAN-02 (Ống tay chẽn):</span> Ống tay thu nhỏ dần về phía cổ tay, thuận tiện cử động hàng ngày.
                  </li>
                </ul>
              </div>

              {/* Mutables */}
              <div className="p-4 bg-[#C9A66B]/15 border border-[#C9A66B]/40 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="font-semibold text-[#E6C88B] flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-4 h-4 text-[#E6C88B]" />
                  <span>VÙNG KHẢ BIẾN (TỰ DO CÁCH TÂN ĐƯƠNG ĐẠI)</span>
                </div>
                <p className="text-[#F2E9D8] text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-[#E6C88B]">KB-NGUTHAN-03:</span> Chiều dài vạt áo (vạt lửng ngang hông, midi-cut) và chất liệu (denim selvedge, vải dù techwear, dạ tweed, linen, đũi mộc) cho phép cách tân thoải mái, miễn giữ nguyên vẹn cổ lập lĩnh và vạt ngũ thân.
                </p>
              </div>

              <button
                onClick={() => onOpenCKB('KB-NGUTHAN-01')}
                className="text-xs font-semibold text-[#C9A66B] hover:text-[#F2E9D8] flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Xem hồ sơ chứng dẫn KB-NGUTHAN trong CKB →</span>
              </button>
            </div>
          )}

          {activeTab === 'ao_tac' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-[#43B6A4] uppercase tracking-wider font-semibold block">
                  NHẬN DIỆN CỐT LÕI · ÁO TẤC (ÁO THỤNG)
                </span>
                <h3 className="text-xl font-serif font-bold text-[#F2E9D8] mt-1">
                  Đại lễ phục trang nghiêm hoàng triều
                </h3>
                <p className="text-sm text-[#B8AA96] mt-1.5 leading-relaxed font-serif">
                  Áo Tấc là lễ phục mặc trong các dịp đại lễ: cúng tế gia tiên, yết kiến triều đình, hôn lễ. Nhận diện cốt tử nằm ở đôi ống tay thụng rộng buông dài bằng gấu áo, tạo nên cử chỉ chắp tay trang nghiêm và phong thái thanh tao.
                </p>
              </div>

              {/* Invariants */}
              <div className="p-4 bg-[#B8342B]/15 border border-[#B8342B]/40 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="font-semibold text-[#F5A39D] flex items-center gap-1.5 font-serif">
                  <ShieldCheck className="w-4 h-4 text-[#F5A39D]" />
                  <span>VÙNG BẤT BIẾN (QUY THỨC CỐT LÕI)</span>
                </div>
                <ul className="space-y-1.5 text-[#F2E9D8] text-xs sm:text-sm leading-relaxed">
                  <li>
                    <span className="font-bold text-[#F5A39D]">KB-TAC-01 (Tay thụng rộng dài):</span> Ống tay thụng rộng buông dài theo gấu áo. Nhận diện cốt lõi của lễ phục Áo Tấc, không may thu hẹp thành tay chẽn.
                  </li>
                  <li>
                    <span className="font-bold text-[#F5A39D]">KB-TAC-02 (Tính lễ nghi):</span> Thân trên luôn phải giữ sự kín đáo, đoan nghiêm khi phối hợp đương đại.
                  </li>
                </ul>
              </div>

              {/* Mutables */}
              <div className="p-4 bg-[#C9A66B]/15 border border-[#C9A66B]/40 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="font-semibold text-[#E6C88B] flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-4 h-4 text-[#E6C88B]" />
                  <span>VÙNG KHẢ BIẾN (TỰ DO CÁCH TÂN ĐƯƠNG ĐẠI)</span>
                </div>
                <p className="text-[#F2E9D8] text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-[#E6C88B]">KB-TAC-03:</span> Cho phép cởi mở khuy áo phía trước để biến chiếc áo lễ phục thành áo khoác dáng dài (duster coat) hiện đại, layer cùng áo cổ lọ, quần âu suông và bốt da.
                </p>
              </div>

              <button
                onClick={() => onOpenCKB('KB-TAC-01')}
                className="text-xs font-semibold text-[#C9A66B] hover:text-[#F2E9D8] flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Xem hồ sơ chứng dẫn KB-TAC trong CKB →</span>
              </button>
            </div>
          )}

          {activeTab === 'nhat_binh' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-[#B8342B] uppercase tracking-wider font-semibold block">
                  NHẬN DIỆN CỐT LÕI · ÁO NHẬT BÌNH
                </span>
                <h3 className="text-xl font-serif font-bold text-[#F2E9D8] mt-1">
                  Y phục quyền quý cung tần mệnh phụ
                </h3>
                <p className="text-sm text-[#B8AA96] mt-1.5 leading-relaxed font-serif">
                  Áo Nhật Bình là triều phục của hoàng hậu, công chúa và cung tần triều Nguyễn. Điểm nhận diện đặc trưng là nẹp cổ đối khâm hình chữ nhật trước ngực; viền tay áo có dải màu ngũ hành theo phẩm cấp (ngoại lệ Hoàng hậu).
                </p>
              </div>

              {/* Invariants */}
              <div className="p-4 bg-[#B8342B]/15 border border-[#B8342B]/40 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="font-semibold text-[#F5A39D] flex items-center gap-1.5 font-serif">
                  <ShieldCheck className="w-4 h-4 text-[#F5A39D]" />
                  <span>VÙNG BẤT BIẾN (QUY THỨC CỐT LÕI)</span>
                </div>
                <ul className="space-y-1.5 text-[#F2E9D8] text-xs sm:text-sm leading-relaxed">
                  <li>
                    <span className="font-bold text-[#F5A39D]">KB-NHATBINH-01 (Nẹp cổ đối khâm):</span> Nẹp cổ hình chữ nhật chạy dọc đối xứng từ cổ xuống ngực cài cúc ở trục chính giữa.
                  </li>
                  <li>
                    <span className="font-bold text-[#E6C88B]">KB-NHATBINH-02 (Dải ngũ hành theo phẩm cấp):</span> Dải màu viền tay áo xuất hiện trên nhiều phẩm cấp hậu phi nhưng có ngoại lệ ở Hoàng hậu; vùng tham chiếu linh hoạt.
                  </li>
                </ul>
              </div>

              {/* Mutables */}
              <div className="p-4 bg-[#C9A66B]/15 border border-[#C9A66B]/40 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="font-semibold text-[#E6C88B] flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-4 h-4 text-[#E6C88B]" />
                  <span>VÙNG KHẢ BIẾN (TỰ DO CÁCH TÂN ĐƯƠNG ĐẠI)</span>
                </div>
                <p className="text-[#F2E9D8] text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-[#E6C88B]">KB-NHATBINH-03:</span> Cho phép cách tân phần trang phục dưới bằng chân váy xếp ly dài, phối layer áo quây / áo thun cao cấp hoặc thắt lưng hiện đại.
                </p>
              </div>

              <button
                onClick={() => onOpenCKB('KB-NHATBINH-01')}
                className="text-xs font-semibold text-[#C9A66B] hover:text-[#F2E9D8] flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Xem hồ sơ chứng dẫn KB-NHATBINH trong CKB →</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
