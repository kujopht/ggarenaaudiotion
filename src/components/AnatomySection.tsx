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
      <div className="bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#065F46] text-[#FEF3C7] flex items-center justify-center font-serif font-bold text-lg border border-[#047857] shrink-0">
            HÌNH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#065F46] uppercase tracking-wider">
                BẢN VẼ GIẢI PHẪU Y PHỤC
              </span>
              <span className="text-[#A8A29E]">·</span>
              <span className="text-xs text-[#78716C]">Quy Thức Nhận Diện 3 Dòng Cổ Phục</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917] tracking-tight">
              Giải Phẫu Cấu Trúc: Bất Biến & Khả Biến
            </h2>
          </div>
        </div>

        <p className="text-xs text-[#57534E] max-w-md leading-relaxed">
          Phân định rạch ròi giữa Vùng Bất Biến (Invariant - Giữ trọn danh phận y phục) và Vùng Khả Biến (Mutable - Tự do sáng tạo đương đại).
        </p>
      </div>

      {/* Garment Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl max-w-xl">
        <button
          onClick={() => setActiveTab('ngu_than')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'ngu_than' ? 'bg-[#1C1917] text-white shadow-sm' : 'text-[#57534E] hover:text-[#1C1917]'
          }`}
        >
          Áo Ngũ Thân Tay Chẽn
        </button>
        <button
          onClick={() => setActiveTab('ao_tac')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'ao_tac' ? 'bg-[#1C1917] text-white shadow-sm' : 'text-[#57534E] hover:text-[#1C1917]'
          }`}
        >
          Áo Tấc Lễ Phục
        </button>
        <button
          onClick={() => setActiveTab('nhat_binh')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'nhat_binh' ? 'bg-[#1C1917] text-white shadow-sm' : 'text-[#57534E] hover:text-[#1C1917]'
          }`}
        >
          Áo Nhật Bình Hoàng Triều
        </button>
      </div>

      {/* Anatomy Content Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl p-5 sm:p-6 shadow-sm">
        {/* Left: Interactive SVG Schematic Viewport */}
        <div className="lg:col-span-6">
          <GarmentSchematic garment={activeTab} dialLevel={2} />
        </div>

        {/* Right: Architectural Rules Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          {activeTab === 'ngu_than' && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono text-[#991B1B] uppercase tracking-wider font-bold block">
                  NHẬN DIỆN CỐT LÕI · ÁO NGŨ THÂN TAY CHẼN
                </span>
                <h3 className="text-xl font-serif font-bold text-[#1C1917] mt-0.5">
                  Biểu Trưng Của Sự Đoan Chính & Nho Nhã
                </h3>
                <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed font-serif">
                  Áo Ngũ Thân tay chẽn là y phục phổ biến nhất của người Việt thời Nguyễn. Cấu trúc 5 thân tượng trưng cho đạo hiếu (tứ thân phụ mẫu ôm lấy người mặc), kết hợp cổ lập lĩnh đứng thẳng và quy thức cài vạt bên phải (Hữu nhậm).
                </p>
              </div>

              {/* Invariants */}
              <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl space-y-2 text-xs">
                <div className="font-bold text-[#065F46] flex items-center gap-1.5 font-serif">
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>VÙNG BẤT BIẾN (INVARIANTS KHÔNG ĐỔI)</span>
                </div>
                <ul className="space-y-1.5 text-[#065F46] text-[11px] leading-relaxed">
                  <li>
                    <span className="font-bold">KB-RULE-01 (Hữu nhậm):</span> Vạt trái đè lên vạt phải, khuy cài bên phải. CẤM TẢ NHẬM (tang ma).
                  </li>
                  <li>
                    <span className="font-bold">KB-NGUTHAN-01 (Cổ Lập Lĩnh):</span> Cổ đứng cao 4-5cm ôm khít cổ, có 1 khuy cổ cố định.
                  </li>
                  <li>
                    <span className="font-bold">KB-NGUTHAN-02 (Ống tay chẽn):</span> Ống tay thu nhỏ dần về phía cổ tay, cử động hàng ngày.
                  </li>
                </ul>
              </div>

              {/* Mutables */}
              <div className="p-4 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl space-y-2 text-xs">
                <div className="font-bold text-[#0369A1] flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-4 h-4 text-[#0284C7]" />
                  <span>VÙNG KHẢ BIẾN (MUTABLES ĐƯỢC PHÉP CÁCH TÂN)</span>
                </div>
                <p className="text-[#0369A1] text-[11px] leading-relaxed">
                  <span className="font-bold">KB-NGUTHAN-03:</span> Chiều dài vạt áo (vạt lửng ngang hông, midi-cut) và chất liệu (denim selvedge, vải dù techwear, dạ tweed, linen, kaki) cho phép cách tân thoải mái, miễn giữ nguyên vẹn cổ lập lĩnh và vạt ngũ thân.
                </p>
              </div>

              <button
                onClick={() => onOpenCKB('KB-NGUTHAN-01')}
                className="text-xs font-semibold text-[#991B1B] hover:text-[#7F1D1D] flex items-center gap-1.5 underline underline-offset-4"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Xem hồ sơ chứng dẫn KB-NGUTHAN trong CKB</span>
              </button>
            </div>
          )}

          {activeTab === 'ao_tac' && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono text-[#065F46] uppercase tracking-wider font-bold block">
                  NHẬN DIỆN CỐT LÕI · ÁO TẤC (ÁO THỤNG)
                </span>
                <h3 className="text-xl font-serif font-bold text-[#1C1917] mt-0.5">
                  Đại Lễ Phục Trang Nghiêm Hoàng Triều
                </h3>
                <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed font-serif">
                  Áo Tấc là lễ phục mặc trong các dịp đại lễ: cúng tế gia tiên, yết kiến triều đình, hôn lễ. Nhận diện cốt tử nằm ở đôi ống tay thụng rộng hình chữ nhật buông dài quá ngón tay, tạo nên cử chỉ chắp tay trang nghiêm và phong thái thanh tao.
                </p>
              </div>

              {/* Invariants */}
              <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl space-y-2 text-xs">
                <div className="font-bold text-[#065F46] flex items-center gap-1.5 font-serif">
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>VÙNG BẤT BIẾN (INVARIANTS KHÔNG ĐỔI)</span>
                </div>
                <ul className="space-y-1.5 text-[#065F46] text-[11px] leading-relaxed">
                  <li>
                    <span className="font-bold">KB-TAC-01 (Tay thụng chữ nhật):</span> Ống tay thụng rộng hình chữ nhật, thả xuôi dài bằng hoặc qua ngón tay. Tuyệt đối không may chẽn.
                  </li>
                  <li>
                    <span className="font-bold">KB-TAC-02 (Tính lễ nghi):</span> Thân trên luôn phải giữ sự kín đáo, đoan nghiêm khi phối hợp đương đại.
                  </li>
                </ul>
              </div>

              {/* Mutables */}
              <div className="p-4 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl space-y-2 text-xs">
                <div className="font-bold text-[#0369A1] flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-4 h-4 text-[#0284C7]" />
                  <span>VÙNG KHẢ BIẾN (MUTABLES ĐƯỢC PHÉP CÁCH TÂN)</span>
                </div>
                <p className="text-[#0369A1] text-[11px] leading-relaxed">
                  <span className="font-bold">KB-TAC-03:</span> Cho phép cởi mở khuy áo phía trước để biến chiếc áo lễ phục thành áo khoác dáng dài (duster coat) hiện đại, layer cùng áo cổ lọ, quần âu suông và bốt da.
                </p>
              </div>

              <button
                onClick={() => onOpenCKB('KB-TAC-01')}
                className="text-xs font-semibold text-[#065F46] hover:underline flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Xem hồ sơ chứng dẫn KB-TAC trong CKB</span>
              </button>
            </div>
          )}

          {activeTab === 'nhat_binh' && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono text-[#991B1B] uppercase tracking-wider font-bold block">
                  NHẬN DIỆN CỐT LÕI · ÁO NHẬT BÌNH
                </span>
                <h3 className="text-xl font-serif font-bold text-[#1C1917] mt-0.5">
                  Y Phục Quyền Quý Cung Tần Mệnh Phụ
                </h3>
                <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed font-serif">
                  Áo Nhật Bình là triều phục của hoàng hậu, công chúa và cung tần triều Nguyễn. Điểm nhận diện đặc trưng là nẹp cổ đối khâm hình chữ nhật trước ngực và viền tay áo dải màu ngũ hành rực rỡ.
                </p>
              </div>

              {/* Invariants */}
              <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl space-y-2 text-xs">
                <div className="font-bold text-[#065F46] flex items-center gap-1.5 font-serif">
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>VÙNG BẤT BIẾN (INVARIANTS KHÔNG ĐỔI)</span>
                </div>
                <ul className="space-y-1.5 text-[#065F46] text-[11px] leading-relaxed">
                  <li>
                    <span className="font-bold">KB-NHATBINH-01 (Nẹp cổ đối khâm):</span> Nẹp cổ to bản chạy dọc song song từ cổ xuống ngực tạo thành hình chữ nhật đặc trưng, có dải dây buộc ở ngực. Bất biến.
                  </li>
                  <li>
                    <span className="font-bold">KB-NHATBINH-02 (Cổ tay ngũ sắc):</span> Dải màu ngũ hành/ngũ thường ở viền tay áo mang tính nhận diện biểu tượng. Tuyệt đối không đảo lộn.
                  </li>
                </ul>
              </div>

              {/* Mutables */}
              <div className="p-4 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl space-y-2 text-xs">
                <div className="font-bold text-[#0369A1] flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-4 h-4 text-[#0284C7]" />
                  <span>VÙNG KHẢ BIẾN (MUTABLES ĐƯỢC PHÉP CÁCH TÂN)</span>
                </div>
                <p className="text-[#0369A1] text-[11px] leading-relaxed">
                  <span className="font-bold">KB-NHATBINH-03:</span> Cho phép mặc mở tà, thay thế quần lụa trắng bằng chân váy xếp ly dáng midi thanh thoát, quần âu suông hiện đại hoặc biến tấu chất liệu vải dạ tweed, nhung velvet.
                </p>
              </div>

              <button
                onClick={() => onOpenCKB('KB-NHATBINH-01')}
                className="text-xs font-semibold text-[#991B1B] hover:underline flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Xem hồ sơ chứng dẫn KB-NHATBINH trong CKB</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
