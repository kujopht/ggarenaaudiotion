import React, { useState } from 'react';
import { GarmentKey } from '../types/vietphuc';
import { GarmentSchematic } from './GarmentSchematic';
import { ShieldCheck, Sparkles, BookOpen, AlertOctagon } from 'lucide-react';

interface AnatomySectionProps {
  onOpenCKB: (id?: string) => void;
}

export const AnatomySection: React.FC<AnatomySectionProps> = ({ onOpenCKB }) => {
  const [activeTab, setActiveTab] = useState<GarmentKey>('ngu_than');

  return (
    <section id="schematic" className="py-16 px-6 max-w-7xl mx-auto border-b border-stone-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-stone-300 gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 mb-1">
            ANATOMICAL KNOWLEDGE & EVIDENCE BLUEPRINT
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-950 tracking-tight">
            Giải Phẫu Cấu Trúc 3 Kiểu Thức Cốt Lõi
          </h2>
        </div>
        <p className="text-xs text-stone-600 max-w-md leading-relaxed">
          Nắm vững sự phân định rạch ròi giữa Vùng Bất Biến (Invariant - Tuyệt đối gìn giữ) và Vùng Khả Biến (Mutable - Tự do biến tấu) của y phục triều Nguyễn.
        </p>
      </div>

      {/* Garment Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 rounded-xl max-w-xl mx-auto mb-8">
        <button
          onClick={() => setActiveTab('ngu_than')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'ngu_than' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Áo Ngũ Thân Tay Chẽn
        </button>
        <button
          onClick={() => setActiveTab('ao_tac')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'ao_tac' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Áo Tấc Lễ Phục
        </button>
        <button
          onClick={() => setActiveTab('nhat_binh')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'nhat_binh' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Áo Nhật Bình Hoàng Triều
        </button>
      </div>

      {/* Anatomy Content Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Left: Interactive SVG Schematic Viewport */}
        <div className="lg:col-span-6">
          <GarmentSchematic garment={activeTab} dialLevel={2} />
        </div>

        {/* Right: Architectural Rules Breakdown */}
        <div className="lg:col-span-6 space-y-6">
          {activeTab === 'ngu_than' && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest block">
                  NHẬN DIỆN DI SẢN · ÁO NGŨ THÂN TAY CHẼN
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  Biểu Trưng Của Sự Đoan Chính & Nho Nhã
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed font-serif">
                  Áo Ngũ Thân tay chẽn là trang phục thường nhật của người Việt thời Nguyễn. Cấu trúc 5 thân tượng trưng cho đạo hiếu (tứ thân phụ mẫu che chở con cái), kết hợp cổ lập lĩnh đứng thẳng và quy thức cài vạt bên phải (Hữu nhậm).
                </p>
              </div>

              {/* Invariants */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>VÙNG BẤT BIẾN (INVARIANTS KHÔNG ĐỔI)</span>
                </div>
                <ul className="space-y-1.5 text-emerald-900 text-[11px] leading-relaxed">
                  <li>
                    <span className="font-semibold">KB-RULE-01 (Hữu nhậm):</span> Vạt trái đè lên vạt phải, khuy cài bên phải. CẤM TẢ NHẬM (áo tang ma).
                  </li>
                  <li>
                    <span className="font-semibold">KB-NGUTHAN-01 (Cổ Lập Lĩnh):</span> Cổ đứng cao 4-5cm ôm khít cổ, có 1 khuy cố định vị trí.
                  </li>
                  <li>
                    <span className="font-semibold">KB-NGUTHAN-02 (Ống tay chẽn):</span> Ống tay thu nhỏ dần về phía cổ tay, cử động linh hoạt.
                  </li>
                </ul>
              </div>

              {/* Mutables */}
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-sky-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-700" />
                  <span>VÙNG KHẢ BIẾN (MUTABLES ĐƯỢC PHÉP CÁCH TÂN)</span>
                </div>
                <p className="text-sky-900 text-[11px] leading-relaxed">
                  <span className="font-semibold">KB-NGUTHAN-03:</span> Chiều dài vạt áo (vạt lửng, midi-cut) và chất liệu (denim selvedge, vải dù techwear, dạ tweed, linen, kaki) cho phép cách tân không giới hạn, miễn giữ nguyên vẹn cổ lập lĩnh và vạt ngũ thân.
                </p>
              </div>

              <button
                onClick={() => onOpenCKB('KB-NGUTHAN-01')}
                className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1.5 underline underline-offset-4"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Xem chi tiết hồ sơ chứng dẫn KB-NGUTHAN trong CKB</span>
              </button>
            </div>
          )}

          {activeTab === 'ao_tac' && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest block">
                  NHẬN DIỆN DI SẢN · ÁO TẤC (ÁO THỤNG)
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  Đại Lễ Phục Trang Nghiêm Hoàng Triều
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed font-serif">
                  Áo Tấc là lễ phục mặc trong các nghi thức trọng đại: tế tự, hôn lễ, yết triều. Nhận diện cốt tử nằm ở đôi ống tay thụng rộng hình chữ nhật buông dài quá ngón tay, tạo nên cử chỉ chắp tay trang nghiêm và phong thái uy nghi.
                </p>
              </div>

              {/* Invariants */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>VÙNG BẤT BIẾN (INVARIANTS KHÔNG ĐỔI)</span>
                </div>
                <ul className="space-y-1.5 text-emerald-900 text-[11px] leading-relaxed">
                  <li>
                    <span className="font-semibold">KB-TAC-01 (Tay thụng chữ nhật):</span> Ống tay thụng rộng hình chữ nhật, khi thả xuôi dài bằng hoặc qua ngón tay. Tuyệt đối không may chẽn.
                  </li>
                  <li>
                    <span className="font-semibold">KB-TAC-02 (Tính lễ nghi):</span> Thân trên luôn phải giữ sự kín đáo, đoan nghiêm khi phối hợp đương đại.
                  </li>
                </ul>
              </div>

              {/* Mutables */}
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-sky-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-700" />
                  <span>VÙNG KHẢ BIẾN (MUTABLES ĐƯỢC PHÉP CÁCH TÂN)</span>
                </div>
                <p className="text-sky-900 text-[11px] leading-relaxed">
                  <span className="font-semibold">KB-TAC-03:</span> Cho phép cởi mở cúc khuy áo phía trước để biến chiếc áo lễ phục thành một chiếc áo khoác dáng dài (duster coat) hiện đại, layer cùng áo cổ lọ, quần âu suông và bốt da.
                </p>
              </div>

              <button
                onClick={() => onOpenCKB('KB-TAC-01')}
                className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1.5 underline underline-offset-4"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Xem chi tiết hồ sơ chứng dẫn KB-TAC trong CKB</span>
              </button>
            </div>
          )}

          {activeTab === 'nhat_binh' && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest block">
                  NHẬN DIỆN DI SẢN · ÁO NHẬT BÌNH
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  Y Phục Quyền Quý Cung Tần Mệnh Phụ
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed font-serif">
                  Áo Nhật Bình là thường phục của Hoàng hậu, Công chúa và triều phục của các cung tần mệnh phụ triều Nguyễn. Điểm nhận diện đặc trưng là nẹp cổ đối khâm hình chữ nhật và viền tay áo dải màu ngũ hành rực rỡ.
                </p>
              </div>

              {/* Invariants */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>VÙNG BẤT BIẾN (INVARIANTS KHÔNG ĐỔI)</span>
                </div>
                <ul className="space-y-1.5 text-emerald-900 text-[11px] leading-relaxed">
                  <li>
                    <span className="font-semibold">KB-NHATBINH-01 (Nẹp cổ đối khâm):</span> Nẹp cổ to bản chạy dọc song song từ cổ xuống ngực tạo thành hình chữ nhật đặc trưng, có dải dây buộc ở ngực. Bất biến.
                  </li>
                  <li>
                    <span className="font-semibold">KB-NHATBINH-02 (Cổ tay ngũ sắc):</span> Dải màu ngũ hành/ngũ thường ở viền tay áo mang tính biểu tượng vũ trụ quan. Tuyệt đối không đảo lộn lung tung.
                  </li>
                </ul>
              </div>

              {/* Mutables */}
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-sky-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-700" />
                  <span>VÙNG KHẢ BIẾN (MUTABLES ĐƯỢC PHÉP CÁCH TÂN)</span>
                </div>
                <p className="text-sky-900 text-[11px] leading-relaxed">
                  <span className="font-semibold">KB-NHATBINH-03:</span> Cho phép mặc mở tà, thay thế quần lụa trắng bằng chân váy xếp ly dáng midi thanh thoát, quần âu suông hiện đại hoặc biến tấu chất liệu vải dạ tweed, nhung velvet.
                </p>
              </div>

              <button
                onClick={() => onOpenCKB('KB-NHATBINH-01')}
                className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1.5 underline underline-offset-4"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Xem chi tiết hồ sơ chứng dẫn KB-NHATBINH trong CKB</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
