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
      <div className="bg-[#181C24] border border-[#272D3A] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#10B981] uppercase tracking-wider">
              BẢN VẼ CẤU TRÚC Y PHỤC
            </span>
            <span className="text-[#64748B]">·</span>
            <span className="text-xs text-[#94A3B8]">Phân định bất biến & khả biến</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F1F5F9] tracking-tight">
            Giải phẫu cấu trúc y phục cổ truyền
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
            Phân định rạch ròi giữa Vùng Bất Biến (Invariant - Giữ trọn danh phận và bản sắc y phục) và Vùng Khả Biến (Mutable - Tự do sáng tạo, biến tấu chất liệu và phom dáng đương đại).
          </p>
        </div>
      </div>

      {/* Garment Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#181C24] border border-[#272D3A] rounded-xl max-w-xl">
        <button
          onClick={() => setActiveTab('ngu_than')}
          className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[40px] cursor-pointer ${
            activeTab === 'ngu_than'
              ? 'bg-[#222834] text-[#2DD4BF] border border-[#0D9488]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#E2E8F0]'
          }`}
        >
          Áo Ngũ Thân tay chẽn
        </button>
        <button
          onClick={() => setActiveTab('ao_tac')}
          className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[40px] cursor-pointer ${
            activeTab === 'ao_tac'
              ? 'bg-[#222834] text-[#2DD4BF] border border-[#0D9488]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#E2E8F0]'
          }`}
        >
          Áo Tấc lễ phục
        </button>
        <button
          onClick={() => setActiveTab('nhat_binh')}
          className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[40px] cursor-pointer ${
            activeTab === 'nhat_binh'
              ? 'bg-[#222834] text-[#2DD4BF] border border-[#0D9488]/40 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#E2E8F0]'
          }`}
        >
          Áo Nhật Bình hoàng triều
        </button>
      </div>

      {/* Anatomy Content Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#181C24] border border-[#272D3A] rounded-2xl p-5 sm:p-6 shadow-sm">
        {/* Left: Interactive SVG Schematic Viewport */}
        <div className="lg:col-span-6">
          <div className="border border-[#272D3A] rounded-xl overflow-hidden">
            <GarmentSchematic garment={activeTab} dialLevel={2} />
          </div>
        </div>

        {/* Right: Architectural Rules Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          {activeTab === 'ngu_than' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-[#14B8A6] uppercase tracking-wider font-semibold block">
                  NHẬN DIỆN CỐT LÕI · ÁO NGŨ THÂN TAY CHẼN
                </span>
                <h3 className="text-xl font-serif font-bold text-[#F1F5F9] mt-1">
                  Biểu trưng của sự đoan chính & nho nhã
                </h3>
                <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed font-serif">
                  Áo Ngũ Thân tay chẽn là y phục phổ biến nhất của người Việt thời Nguyễn. Cấu trúc 5 thân tượng trưng cho đạo hiếu (tứ thân phụ mẫu ôm lấy người mặc), kết hợp cổ lập lĩnh đứng thẳng và quy thức cài vạt bên phải (Hữu nhậm).
                </p>
              </div>

              {/* Invariants */}
              <div className="p-4 bg-[#0D9488]/10 border border-[#0D9488]/30 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="font-semibold text-[#2DD4BF] flex items-center gap-1.5 font-serif">
                  <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
                  <span>VÙNG BẤT BIẾN (INVARIANTS KHÔNG ĐỔI)</span>
                </div>
                <ul className="space-y-1.5 text-[#99F6E4] text-xs sm:text-sm leading-relaxed">
                  <li>
                    <span className="font-bold">KB-RULE-01 (Hữu nhậm):</span> Vạt trái đè lên vạt phải, khuy cài bên phải. CẤM TẢ NHẬM (tang ma).
                  </li>
                  <li>
                    <span className="font-bold">KB-NGUTHAN-01 (Cổ Lập Lĩnh):</span> Cổ đứng cao 4-5cm ôm khít cổ, có 1 khuy cổ cố định.
                  </li>
                  <li>
                    <span className="font-bold">KB-NGUTHAN-02 (Ống tay chẽn):</span> Ống tay thu nhỏ dần về phía cổ tay, thuận tiện cử động hàng ngày.
                  </li>
                </ul>
              </div>

              {/* Mutables */}
              <div className="p-4 bg-[#0284C7]/10 border border-[#0284C7]/30 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="font-semibold text-[#38BDF8] flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                  <span>VÙNG KHẢ BIẾN (MUTABLES ĐƯỢC PHÉP CÁCH TÂN)</span>
                </div>
                <p className="text-[#BAE6FD] text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold">KB-NGUTHAN-03:</span> Chiều dài vạt áo (vạt lửng ngang hông, midi-cut) và chất liệu (denim selvedge, vải dù techwear, dạ tweed, linen, kaki) cho phép cách tân thoải mái, miễn giữ nguyên vẹn cổ lập lĩnh và vạt ngũ thân.
                </p>
              </div>

              <button
                onClick={() => onOpenCKB('KB-NGUTHAN-01')}
                className="text-xs font-semibold text-[#14B8A6] hover:text-[#2DD4BF] flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Xem hồ sơ chứng dẫn KB-NGUTHAN trong CKB →</span>
              </button>
            </div>
          )}

          {activeTab === 'ao_tac' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-[#10B981] uppercase tracking-wider font-semibold block">
                  NHẬN DIỆN CỐT LÕI · ÁO TẤC (ÁO THỤNG)
                </span>
                <h3 className="text-xl font-serif font-bold text-[#F1F5F9] mt-1">
                  Đại lễ phục trang nghiêm hoàng triều
                </h3>
                <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed font-serif">
                  Áo Tấc là lễ phục mặc trong các dịp đại lễ: cúng tế gia tiên, yết kiến triều đình, hôn lễ. Nhận diện cốt tử nằm ở đôi ống tay thụng rộng hình chữ nhật buông dài quá ngón tay, tạo nên cử chỉ chắp tay trang nghiêm và phong thái thanh tao.
                </p>
              </div>

              {/* Invariants */}
              <div className="p-4 bg-[#0D9488]/10 border border-[#0D9488]/30 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="font-semibold text-[#2DD4BF] flex items-center gap-1.5 font-serif">
                  <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
                  <span>VÙNG BẤT BIẾN (INVARIANTS KHÔNG ĐỔI)</span>
                </div>
                <ul className="space-y-1.5 text-[#99F6E4] text-xs sm:text-sm leading-relaxed">
                  <li>
                    <span className="font-bold">KB-TAC-01 (Tay thụng chữ nhật):</span> Ống tay thụng rộng hình chữ nhật, thả xuôi dài bằng hoặc qua ngón tay. Tuyệt đối không may chẽn.
                  </li>
                  <li>
                    <span className="font-bold">KB-TAC-02 (Tính lễ nghi):</span> Thân trên luôn phải giữ sự kín đáo, đoan nghiêm khi phối hợp đương đại.
                  </li>
                </ul>
              </div>

              {/* Mutables */}
              <div className="p-4 bg-[#0284C7]/10 border border-[#0284C7]/30 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="font-semibold text-[#38BDF8] flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                  <span>VÙNG KHẢ BIẾN (MUTABLES ĐƯỢC PHÉP CÁCH TÂN)</span>
                </div>
                <p className="text-[#BAE6FD] text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold">KB-TAC-03:</span> Cho phép cởi mở khuy áo phía trước để biến chiếc áo lễ phục thành áo khoác dáng dài (duster coat) hiện đại, layer cùng áo cổ lọ, quần âu suông và bốt da.
                </p>
              </div>

              <button
                onClick={() => onOpenCKB('KB-TAC-01')}
                className="text-xs font-semibold text-[#14B8A6] hover:text-[#2DD4BF] flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Xem hồ sơ chứng dẫn KB-TAC trong CKB →</span>
              </button>
            </div>
          )}

          {activeTab === 'nhat_binh' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-[#F43F5E] uppercase tracking-wider font-semibold block">
                  NHẬN DIỆN CỐT LÕI · ÁO NHẬT BÌNH
                </span>
                <h3 className="text-xl font-serif font-bold text-[#F1F5F9] mt-1">
                  Y phục quyền quý cung tần mệnh phụ
                </h3>
                <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed font-serif">
                  Áo Nhật Bình là triều phục của hoàng hậu, công chúa và cung tần triều Nguyễn. Điểm nhận diện đặc trưng là nẹp cổ đối khâm hình chữ nhật trước ngực và viền tay áo dải màu ngũ hành rực rỡ.
                </p>
              </div>

              {/* Invariants */}
              <div className="p-4 bg-[#0D9488]/10 border border-[#0D9488]/30 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="font-semibold text-[#2DD4BF] flex items-center gap-1.5 font-serif">
                  <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
                  <span>VÙNG BẤT BIẾN (INVARIANTS KHÔNG ĐỔI)</span>
                </div>
                <ul className="space-y-1.5 text-[#99F6E4] text-xs sm:text-sm leading-relaxed">
                  <li>
                    <span className="font-bold">KB-NHATBINH-01 (Nẹp cổ đối khâm):</span> Nẹp cổ to bản chạy dọc song song từ cổ xuống ngực tạo thành hình chữ nhật đặc trưng, có dải dây buộc ở ngực. Bất biến.
                  </li>
                  <li>
                    <span className="font-bold">KB-NHATBINH-02 (Cổ tay ngũ sắc):</span> Dải màu ngũ hành/ngũ thường ở viền tay áo mang tính nhận diện biểu tượng. Tuyệt đối không đảo lộn.
                  </li>
                </ul>
              </div>

              {/* Mutables */}
              <div className="p-4 bg-[#0284C7]/10 border border-[#0284C7]/30 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="font-semibold text-[#38BDF8] flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                  <span>VÙNG KHẢ BIẾN (MUTABLES ĐƯỢC PHÉP CÁCH TÂN)</span>
                </div>
                <p className="text-[#BAE6FD] text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold">KB-NHATBINH-03:</span> Cho phép mặc mở tà, thay thế quần lụa trắng bằng chân váy xếp ly dáng midi thanh thoát, quần âu suông hiện đại hoặc biến tấu chất liệu vải dạ tweed, nhung velvet.
                </p>
              </div>

              <button
                onClick={() => onOpenCKB('KB-NHATBINH-01')}
                className="text-xs font-semibold text-[#14B8A6] hover:text-[#2DD4BF] flex items-center gap-1.5 cursor-pointer"
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
