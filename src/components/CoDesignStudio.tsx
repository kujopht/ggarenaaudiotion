import React, { useState, useEffect } from 'react';
import { GarmentKey, OutfitProposal } from '../types/vietphuc';
import { GarmentSchematic } from './GarmentSchematic';
import { CulturalAuditPanel } from './CulturalAuditPanel';
import { Sparkles, Sliders, Layers, Compass, Eye, ShieldCheck, Share2 } from 'lucide-react';

interface CoDesignStudioProps {
  onOpenCKB: (evidenceId?: string) => void;
  onOpenLookbookCard: (proposal: OutfitProposal) => void;
}

const DIAL_DESCRIPTIONS: Record<number, { label: string; desc: string }> = {
  1: {
    label: 'Heritage Pure',
    desc: 'Bảo tồn nguyên bản tỉ lệ và chất liệu cổ truyền (lụa tơ tằm, sa gấm, khuy cài truyền thống).',
  },
  2: {
    label: 'Subtle Modern',
    desc: 'Giữ cấu trúc phom dáng, cách tân nhẹ nhàng với chất liệu hiện đại thoáng khí như Linen dệt thô, Cotton organic.',
  },
  3: {
    label: 'Streetwear Hybrid',
    desc: 'Phối cùng Raw Denim selvedge, quần âu ống rộng suông, bốt da chunky, mang tinh thần đô thị năng động.',
  },
  4: {
    label: 'Editorial Sartorial',
    desc: 'Áo khoác dáng dài mở tà (Duster coat), chân váy midi xếp ly, kết hợp phụ kiện kim loại đương đại.',
  },
  5: {
    label: 'Avant-Garde Remix',
    desc: 'Giải cấu trúc (Deconstruction) trong vùng khả biến, chất liệu công nghệ cao phản quang hoặc dạ Tweed đa lớp.',
  },
};

const CONTEXT_OPTIONS = [
  { id: 'streetwear', label: 'Dạo phố / Cà phê cuối tuần (Casual Streetwear)' },
  { id: 'fashion_week', label: 'Tuần lễ thời trang / Runway (High Fashion)' },
  { id: 'creative_office', label: 'Công sở sáng tạo / Sự kiện văn hóa' },
  { id: 'festival', label: 'Lễ hội truyền thống / Kỷ yếu tốt nghiệp' },
  { id: 'indie_stage', label: 'Sân khấu biểu diễn / Visual Arts' },
];

const STYLE_OPTIONS = [
  { id: 'modern_minimal', label: 'Modern Minimalist (Tối giản thanh lịch)' },
  { id: 'indigo_denim', label: 'Indigo Streetwear (Denim selvedge bụi bặm)' },
  { id: 'sartorial_tailored', label: 'Sartorial Tailored (Phối âu phục cổ điển)' },
  { id: 'neo_indochine', label: 'Neo-Chic Indochine (Nhung & Chân váy xếp ly)' },
  { id: 'techwear_utility', label: 'Techwear Utility (Vải dù công năng)' },
];

export const CoDesignStudio: React.FC<CoDesignStudioProps> = ({
  onOpenCKB,
  onOpenLookbookCard,
}) => {
  const [garment, setGarment] = useState<GarmentKey>('ngu_than');
  const [dialLevel, setDialLevel] = useState<number>(3);
  const [context, setContext] = useState<string>('streetwear');
  const [style, setStyle] = useState<string>('indigo_denim');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [proposals, setProposals] = useState<OutfitProposal[]>([]);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0);

  // Generate initial outfits on mount
  useEffect(() => {
    handleGenerateOutfits();
  }, [garment]);

  const handleGenerateOutfits = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/remix/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garment,
          context,
          style,
          dial_level: dialLevel,
          custom_notes: customNotes,
        }),
      });

      const data = await res.json();
      if (data.proposals && data.proposals.length > 0) {
        setProposals(data.proposals);
        setSelectedPlanIndex(0);
      }
    } catch (err) {
      console.error('Failed to generate outfits:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentProposal = proposals[selectedPlanIndex] || null;

  return (
    <section id="studio" className="py-12 px-6 max-w-7xl mx-auto border-b border-stone-200">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-stone-300 gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 mb-1">
            MODE 1 · CONTEMPORARY CO-DESIGNER WORKSPACE
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-950 tracking-tight">
            Xưởng Đồng Sáng Tạo & Giám Định Song Hành
          </h2>
        </div>
        <p className="text-xs text-stone-600 max-w-md leading-relaxed">
          Tạo đồng thời 2 phương án đối sánh: Phương án A (Bám sát truyền thống) và Phương án B (Phá cách đương đại theo nấc Dial), được giám định chặt chẽ theo CKB.
        </p>
      </div>

      {/* Main Grid: Controls on Left, Visual & Audit on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Garment Selector Tabs */}
          <div className="p-5 bg-white border border-stone-200 rounded-xl space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-900 block">
              1. Chọn Loại Cổ Phục Nền Tảng
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setGarment('ngu_than')}
                className={`p-3 text-left rounded-lg border transition-all ${
                  garment === 'ngu_than'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                    : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Áo Ngũ Thân Tay Chẽn</span>
                  <span className={`text-[10px] font-mono ${garment === 'ngu_than' ? 'text-amber-300' : 'text-stone-500'}`}>
                    KB-NGUTHAN-01..03
                  </span>
                </div>
                <p className={`text-[11px] mt-1 leading-normal ${garment === 'ngu_than' ? 'text-stone-300' : 'text-stone-500'}`}>
                  Cổ lập lĩnh 4-5cm, vạt hữu nhậm cài bên phải, ống tay chẽn thon gọn linh hoạt.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setGarment('ao_tac')}
                className={`p-3 text-left rounded-lg border transition-all ${
                  garment === 'ao_tac'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                    : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Áo Tấc (Áo Thụng Lễ Phục)</span>
                  <span className={`text-[10px] font-mono ${garment === 'ao_tac' ? 'text-amber-300' : 'text-stone-500'}`}>
                    KB-TAC-01..03
                  </span>
                </div>
                <p className={`text-[11px] mt-1 leading-normal ${garment === 'ao_tac' ? 'text-stone-300' : 'text-stone-500'}`}>
                  Ống tay thụng rộng hình chữ nhật buông dài qua ngón tay, trang nghiêm, biến tấu duster coat.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setGarment('nhat_binh')}
                className={`p-3 text-left rounded-lg border transition-all ${
                  garment === 'nhat_binh'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                    : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Áo Nhật Bình Hoàng Tộc</span>
                  <span className={`text-[10px] font-mono ${garment === 'nhat_binh' ? 'text-amber-300' : 'text-stone-500'}`}>
                    KB-NHATBINH-01..03
                  </span>
                </div>
                <p className={`text-[11px] mt-1 leading-normal ${garment === 'nhat_binh' ? 'text-stone-300' : 'text-stone-500'}`}>
                  Nẹp cổ to bản đối khâm hình chữ nhật, cổ tay viền ngũ sắc biểu tượng ngũ hành.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Remix Dial Slider (1 - 5) */}
          <div className="p-5 bg-white border border-stone-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-stone-600" />
                <span>2. Remix Dial Level: Nấc {dialLevel}/5</span>
              </label>
              <span className="text-xs font-bold text-amber-700 font-mono">
                {DIAL_DESCRIPTIONS[dialLevel].label}
              </span>
            </div>

            {/* Slider track */}
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={dialLevel}
              onChange={(e) => setDialLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
            />

            {/* Scale markings */}
            <div className="flex justify-between text-[10px] font-mono text-stone-400 px-0.5">
              <span>1: Pure</span>
              <span>2: Modern</span>
              <span>3: Street</span>
              <span>4: Sartorial</span>
              <span>5: Avant-Garde</span>
            </div>

            {/* Dial Description Box */}
            <div className="p-2.5 bg-stone-50 border border-stone-200 rounded text-xs text-stone-600 leading-relaxed">
              {DIAL_DESCRIPTIONS[dialLevel].desc}
            </div>
          </div>

          {/* 3. Context & Style Pickers */}
          <div className="p-5 bg-white border border-stone-200 rounded-xl space-y-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-stone-500 block mb-1.5">
                3. BỐI CẢNH MẶC (CONTEXT)
              </label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                {CONTEXT_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-stone-500 block mb-1.5">
                4. PHONG CÁCH ĐỊNH HƯỚNG (STYLE DIRECTION)
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                {STYLE_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-stone-500 block mb-1.5">
                5. GHI CHÚ RIÊNG / Ý TƯỞNG CỦA BẠN (TÙY CHỌN)
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="VD: Muốn dùng vải denim wash sáng, quần ống loe nhẹ..."
                className="w-full text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>

            {/* Trigger Button */}
            <button
              onClick={handleGenerateOutfits}
              disabled={loading}
              className="w-full py-3 bg-stone-950 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang Phối Đồ & Thẩm Định Di Sản...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tạo 2 Phương Án Thiết Kế Ngay</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Column: Dual Plans Display (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Plan Selection Tabs (Segmented Buttons) */}
          {proposals.length > 0 && (
            <div className="flex items-center justify-between p-1.5 bg-stone-200/80 rounded-xl">
              <div className="flex items-center gap-1 w-full">
                {proposals.map((prop, idx) => (
                  <button
                    key={prop.id}
                    onClick={() => setSelectedPlanIndex(idx)}
                    className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all text-center ${
                      selectedPlanIndex === idx
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <div className="truncate">
                      {idx === 0 ? 'PHƯƠNG ÁN A: NGUYÊN BẢN' : `PHƯƠNG ÁN B: REMIX DIAL ${prop.dial_level}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Current Proposal Display */}
          {currentProposal && (
            <div className="space-y-6">
              {/* Proposal Header Banner */}
              <div className="p-6 bg-white border border-stone-200 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                  <div>
                    <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest block">
                      {currentProposal.concept_tag}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-stone-950 mt-0.5">
                      {currentProposal.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => onOpenLookbookCard(currentProposal)}
                    className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <Share2 className="w-3.5 h-3.5 text-stone-600" />
                    <span>Xuất Thẻ Lookbook</span>
                  </button>
                </div>

                {/* Garment Visual Canvas */}
                <div className="mt-4">
                  <GarmentSchematic
                    garment={currentProposal.garment_type}
                    visualDetails={currentProposal.visual_details}
                    dialLevel={currentProposal.dial_level}
                    isOpenFront={currentProposal.garment_type === 'ao_tac' && currentProposal.dial_level >= 3}
                  />
                </div>

                {/* Styling Recipe Breakdown */}
                <div className="mt-6 pt-5 border-t border-stone-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                    Bóc Tách Cấu Trúc Mix-Match (Outfit Breakdown)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80">
                      <span className="font-mono text-[10px] text-stone-400 uppercase block mb-1">
                        CỔ ÁO & VẠT
                      </span>
                      <p className="font-semibold text-stone-800">{currentProposal.visual_details.collar_style}</p>
                      <p className="text-stone-600 text-[11px] mt-0.5">{currentProposal.visual_details.lapel_side}</p>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80">
                      <span className="font-mono text-[10px] text-stone-400 uppercase block mb-1">
                        ỐNG TAY & CHIỀU DÀI
                      </span>
                      <p className="font-semibold text-stone-800">{currentProposal.visual_details.sleeve_style}</p>
                      <p className="text-stone-600 text-[11px] mt-0.5">{currentProposal.visual_details.cut_length}</p>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80">
                      <span className="font-mono text-[10px] text-stone-400 uppercase block mb-1">
                        CHẤT LIỆU VẢI & LAYER
                      </span>
                      <p className="font-semibold text-stone-800">
                        {currentProposal.visual_details.fabric_materials.join(', ')}
                      </p>
                      <p className="text-stone-600 text-[11px] mt-0.5">
                        Layer trong: {currentProposal.visual_details.layering_pieces?.join(', ') || 'Áo lót tối giản'}
                      </p>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80">
                      <span className="font-mono text-[10px] text-stone-400 uppercase block mb-1">
                        PHẦN THÂN DƯỚI & GIÀY
                      </span>
                      <p className="font-semibold text-stone-800">{currentProposal.visual_details.bottom_garment}</p>
                      <p className="text-stone-600 text-[11px] mt-0.5">{currentProposal.visual_details.footwear}</p>
                    </div>
                  </div>
                </div>

                {/* Stylist Notes & Tips for Gen Z */}
                <div className="mt-5 p-4 bg-[#FAF7F0] border border-stone-300 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-stone-800 font-bold uppercase font-mono text-[10px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>LỜI KHUYÊN TỪ CONTEMPORARY CO-DESIGNER</span>
                  </div>
                  <p className="text-stone-800 italic leading-relaxed text-xs">
                    "{currentProposal.stylist_notes.philosophy}"
                  </p>
                  <ul className="space-y-1 pt-1 list-disc list-inside text-stone-700 text-[11px]">
                    {currentProposal.stylist_notes.gen_z_tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cultural Audit Panel (Strict 3 states governance) */}
              <CulturalAuditPanel
                audit={currentProposal.audit}
                onOpenCKB={onOpenCKB}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
