import React, { useState } from 'react';
import { GarmentKey, OutfitProposal } from '../types/vietphuc';
import { GarmentSchematic } from './GarmentSchematic';
import { CulturalAuditPanel } from './CulturalAuditPanel';
import { Sparkles, Sliders, Layers, Compass, Eye, ShieldCheck, Share2, Wand2, ArrowRight } from 'lucide-react';

interface CoDesignStudioProps {
  activeProposal: OutfitProposal | null;
  onSelectProposal: (proposal: OutfitProposal) => void;
  selectedGarment: GarmentKey;
  onChangeGarment: (g: GarmentKey) => void;
  onOpenCKB: (evidenceId?: string) => void;
  onOpenLookbookCard: (proposal: OutfitProposal) => void;
  onNavigateToWhatIf: () => void;
}

const DIAL_LEVELS = [
  { level: 1, label: 'Heritage Pure', short: 'Nguyên Bản', desc: 'Lụa tơ tằm, gấm sa cổ truyền, tỉ lệ khuy cài 100% chuẩn mực.' },
  { level: 2, label: 'Subtle Modern', short: 'Tối Giản', desc: 'Chất liệu linen thô, cotton dệt thoáng khí, phom dáng nhẹ nhàng.' },
  { level: 3, label: 'Street Hybrid', short: 'Đường Phố', desc: 'Denim selvedge thô, quần tây ống suông rộng, bốt da chunky.' },
  { level: 4, label: 'Editorial Sartorial', short: 'Haute Couture', desc: 'Duster coat mở tà bay bổng, chân váy xếp ly, layer may đo cao cấp.' },
  { level: 5, label: 'Avant-Garde Remix', short: 'Phá Cách', desc: 'Vải dù công nghệ, giải cấu trúc (deconstruction) trong vùng khả biến.' },
];

const GARMENTS = [
  {
    key: 'ngu_than' as GarmentKey,
    name: 'Áo Ngũ Thân Tay Chẽn',
    dynasty: 'Thường phục triều Nguyễn',
    seal: 'LẬP LĨNH',
    desc: 'Cổ đứng 4-5cm ôm khít, vạt Hữu nhậm đè sang phải, tay chẽn thon gọn cử động linh hoạt.',
    badgeColor: 'border-[#1E3A8A] text-[#1E3A8A] bg-[#1E3A8A]/5',
  },
  {
    key: 'ao_tac' as GarmentKey,
    name: 'Áo Tấc Lễ Phục',
    dynasty: 'Đại lễ phục triều Nguyễn',
    seal: 'TAY THỤNG',
    desc: 'Ống tay thụng rộng hình chữ nhật buông quá ngón tay, trang nghiêm; có thể mở khuy làm Duster Coat.',
    badgeColor: 'border-[#065F46] text-[#065F46] bg-[#065F46]/5',
  },
  {
    key: 'nhat_binh' as GarmentKey,
    name: 'Áo Nhật Bình',
    dynasty: 'Cung tần & Mệnh phụ',
    seal: 'ĐỐI KHÂM',
    desc: 'Nẹp cổ to bản chữ nhật đối khâm thêu hoa văn, cổ tay ngũ sắc ngũ hành; phối cùng chân váy xếp ly.',
    badgeColor: 'border-[#991B1B] text-[#991B1B] bg-[#991B1B]/5',
  },
];

const CONTEXT_OPTIONS = [
  { id: 'streetwear', label: 'Dạo phố / Cà phê cuối tuần' },
  { id: 'fashion_week', label: 'Tuần lễ thời trang / Sự kiện nghệ thuật' },
  { id: 'creative_office', label: 'Công sở sáng tạo / Hội thảo văn hóa' },
  { id: 'festival', label: 'Lễ hội truyền thống / Kỷ yếu tốt nghiệp' },
];

const STYLE_OPTIONS = [
  { id: 'indigo_denim', label: 'Indigo Denim & Chunky Footwear' },
  { id: 'modern_minimal', label: 'Modern Minimalist (Linen & Đũi mộc)' },
  { id: 'sartorial_tailored', label: 'Sartorial Tailored (Phối Suit & Trousers)' },
  { id: 'neo_indochine', label: 'Neo-Chic Indochine (Nhung & Váy xếp ly)' },
  { id: 'techwear_utility', label: 'Techwear Utility (Vải dù phản quang)' },
];

export const CoDesignStudio: React.FC<CoDesignStudioProps> = ({
  activeProposal,
  onSelectProposal,
  selectedGarment,
  onChangeGarment,
  onOpenCKB,
  onOpenLookbookCard,
  onNavigateToWhatIf,
}) => {
  const [dialLevel, setDialLevel] = useState<number>(3);
  const [context, setContext] = useState<string>('streetwear');
  const [style, setStyle] = useState<string>('indigo_denim');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [proposals, setProposals] = useState<OutfitProposal[]>([]);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0);
  const [proposalSource, setProposalSource] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'styling' | 'audit'>('styling');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // NOTE: Auto-generate useEffect REMOVED to save quota as requested by user.
  // Generation only happens when user explicitly clicks "Khởi Tạo 2 Phương Án Thiết Kế".

  const handleGenerateOutfits = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/remix/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garment: selectedGarment,
          context,
          style,
          dial_level: dialLevel,
          custom_notes: customNotes,
        }),
      });

      if (!res.ok) {
        throw new Error(`Máy chủ phản hồi mã lỗi ${res.status}`);
      }

      const data = await res.json();
      if (data.proposals && data.proposals.length > 0) {
        setProposals(data.proposals);
        setSelectedPlanIndex(0);
        setProposalSource(data.source || 'gemini');
        // Lift active proposal to App state so What-If tab knows immediately
        onSelectProposal(data.proposals[0]);
      } else {
        throw new Error('Không nhận được dữ liệu thiết kế từ hệ thống.');
      }
    } catch (err: any) {
      console.error('Failed to generate outfits:', err);
      setErrorMsg(err.message || 'Lỗi kết nối khi phối đồ.');
    } finally {
      setLoading(false);
    }
  };

  const currentProposal = proposals[selectedPlanIndex] || activeProposal || null;

  const handleSwitchPlan = (idx: number) => {
    setSelectedPlanIndex(idx);
    if (proposals[idx]) {
      onSelectProposal(proposals[idx]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Banner / Curatorial Subtitle */}
      <div className="bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#991B1B] text-[#FEF3C7] flex items-center justify-center font-serif font-bold text-lg border border-[#7F1D1D] shrink-0">
            ẤN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#991B1B] uppercase tracking-wider">
                CHUYÊN GIA SÁNG TẠO & THẨM ĐỊNH
              </span>
              <span className="text-[#A8A29E]">·</span>
              <span className="text-xs text-[#78716C]">Evidence Registry CKB v2.4</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917] tracking-tight">
              Xưởng Phối Đồ Việt Phục Đương Đại
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-[#57534E]">Tự động đối chiếu:</span>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-[#ECE5D8] border border-[#D5CCBA] text-[#1C1917] rounded-md">
            2 Phương Án (Nguyên Bản vs Phá Cách)
          </span>
        </div>
      </div>

      {/* Main Studio Dual Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Design Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Step 1: Garment Selector */}
          <div className="bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5 font-serif">
                <span>01. Loại Việt Phục Cổ Truyền</span>
              </label>
              <button
                onClick={() => onOpenCKB()}
                className="text-[11px] text-[#991B1B] hover:underline font-medium"
              >
                Tra cứu CKB →
              </button>
            </div>

            <div className="space-y-2">
              {GARMENTS.map((g) => {
                const isSelected = selectedGarment === g.key;
                return (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => onChangeGarment(g.key)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-[#991B1B] bg-white shadow-sm ring-1 ring-[#991B1B]/40'
                        : 'border-[#E7E0D4] bg-[#F5F1E8]/70 hover:bg-[#F2ECE0] text-[#44403C]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1C1917] font-serif">
                        {g.name}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${g.badgeColor}`}>
                        {g.seal}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#57534E] mt-1 leading-snug">
                      {g.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Remix Dial Level Slider */}
          <div className="bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5 font-serif">
                <Sliders className="w-3.5 h-3.5 text-[#B45309]" />
                <span>02. Remix Dial Level: Nấc {dialLevel}/5</span>
              </label>
              <span className="text-xs font-bold text-[#991B1B] font-mono bg-[#991B1B]/10 px-2 py-0.5 rounded">
                {DIAL_LEVELS[dialLevel - 1].label}
              </span>
            </div>

            {/* Dial Slider */}
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={dialLevel}
              onChange={(e) => setDialLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-[#E2DBD0] rounded-lg appearance-none cursor-pointer accent-[#991B1B]"
            />

            {/* Quick dial buttons */}
            <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-mono">
              {DIAL_LEVELS.map((d) => (
                <button
                  key={d.level}
                  type="button"
                  onClick={() => setDialLevel(d.level)}
                  className={`py-1 rounded border transition-all ${
                    dialLevel === d.level
                      ? 'border-[#991B1B] bg-[#991B1B] text-white font-bold'
                      : 'border-[#DDD4C4] bg-white text-[#78716C] hover:border-[#A8A29E]'
                  }`}
                >
                  {d.level}: {d.short}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-[#57534E] bg-white p-2.5 rounded-lg border border-[#E2DBD0] leading-relaxed">
              <span className="font-semibold text-[#1C1917]">Đặc trưng: </span>
              {DIAL_LEVELS[dialLevel - 1].desc}
            </div>
          </div>

          {/* Step 3: Context & Style Selectors */}
          <div className="bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl p-4 shadow-sm space-y-3">
            <div>
              <label className="text-[11px] font-mono uppercase text-[#78716C] block mb-1">
                BỐI CẢNH ỨNG DỤNG (CONTEXT)
              </label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-[#D6CEBE] rounded-lg px-3 py-2 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
              >
                {CONTEXT_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-[#78716C] block mb-1">
                PHONG CÁCH ĐƯƠNG ĐẠI (STYLE DIRECTION)
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-[#D6CEBE] rounded-lg px-3 py-2 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
              >
                {STYLE_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-[#78716C] block mb-1">
                GHI CHÚ SÁNG TẠO CỦA BẠN (TÙY CHỌN)
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="VD: Muốn phối tone xanh chàm, bốt da đen cao cổ..."
                className="w-full text-xs bg-white border border-[#D6CEBE] rounded-lg px-3 py-2 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
              />
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleGenerateOutfits}
              disabled={loading}
              className="w-full py-2.5 bg-[#1C1917] hover:bg-[#991B1B] disabled:bg-[#A8A29E] text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang Phối Đồ & Thẩm Định...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-[#F59E0B]" />
                  <span>Khởi Tạo 2 Phương Án Thiết Kế</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output Showcase & Visual Verification (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Plan Selector Buttons (Phương án A vs Phương án B) */}
          {proposals.length > 0 && (
            <div className="flex items-center gap-2 p-1.5 bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl">
              {proposals.map((prop, idx) => {
                const isActive = selectedPlanIndex === idx;
                return (
                  <button
                    key={prop.id}
                    onClick={() => handleSwitchPlan(idx)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      isActive
                        ? 'bg-[#1C1917] text-white shadow-sm'
                        : 'bg-white border border-[#E2DBD0] text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <span className="truncate">
                      {idx === 0 ? 'PHƯƠNG ÁN A: NGUYÊN BẢN' : `PHƯƠNG ÁN B: REMIX DIAL ${prop.dial_level}`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty State when no proposals generated yet */}
          {!currentProposal && !loading && (
            <div className="bg-[#FAF7F0] border-2 border-dashed border-[#D6CEBE] rounded-xl p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#ECE5D8] flex items-center justify-center mx-auto text-[#B45309]">
                <Wand2 className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-serif font-bold text-[#1C1917]">
                  Chưa Có Thiết Kế Nào Được Khởi Tạo
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Hãy chọn loại cổ phục, nấc phá cách (Dial) và bấm nút <strong className="text-[#1C1917]">"Khởi Tạo 2 Phương Án Thiết Kế"</strong> ở bên trái để xưởng bắt đầu sáng tạo và thẩm định di sản.
                </p>
              </div>
              <button
                onClick={handleGenerateOutfits}
                className="px-4 py-2 bg-[#1C1917] hover:bg-[#991B1B] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors inline-flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Khởi Tạo Ngay Với {GARMENTS.find(g => g.key === selectedGarment)?.name}</span>
              </button>
            </div>
          )}

          {/* Current Outfit Presentation Board */}
          {currentProposal && (
            <div className="bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl p-5 shadow-sm space-y-5">
              {/* Proposal Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#E2DBD0] gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#B45309] font-bold">
                      {currentProposal.concept_tag}
                    </span>
                    {/* Live Gemini vs Demo Fallback Badge */}
                    {proposalSource === 'gemini' && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        Gemini · Live
                      </span>
                    )}
                    {proposalSource && proposalSource !== 'gemini' && (
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300">
                        Demo fallback
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">
                    {currentProposal.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* Shortcut to What-If testing this active look */}
                  <button
                    onClick={onNavigateToWhatIf}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#991B1B] hover:bg-[#7F1D1D] rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-xs"
                    title="Chuyển sang tab What-If để thử nghiệm chi tiết trên look này"
                  >
                    <span>Thử Nghiệm What-If</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenLookbookCard(currentProposal)}
                    className="px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-white border border-[#D6CEBE] hover:bg-[#F2ECE0] rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Thẻ Lookbook</span>
                  </button>
                </div>
              </div>

              {/* Garment Visual Canvas Viewport */}
              <div className="rounded-xl overflow-hidden shadow-inner">
                <GarmentSchematic
                  garment={currentProposal.garment_type}
                  visualDetails={currentProposal.visual_details}
                  dialLevel={currentProposal.dial_level}
                  isOpenFront={currentProposal.garment_type === 'ao_tac' && currentProposal.dial_level >= 3}
                />
              </div>

              {/* Detail Tabs Switcher: Styling vs Cultural Audit */}
              <div>
                <div className="flex items-center gap-2 border-b border-[#E2DBD0] pb-2 mb-4">
                  <button
                    onClick={() => setDetailTab('styling')}
                    className={`text-xs font-bold py-1 px-3 rounded-md transition-colors ${
                      detailTab === 'styling'
                        ? 'bg-[#1C1917] text-white'
                        : 'text-[#57534E] hover:text-[#1C1917] bg-white border border-[#E2DBD0]'
                    }`}
                  >
                    Cấu Trúc Phối Đồ & Lời Khuyên Stylist
                  </button>

                  <button
                    onClick={() => setDetailTab('audit')}
                    className={`text-xs font-bold py-1 px-3 rounded-md transition-colors flex items-center gap-1.5 ${
                      detailTab === 'audit'
                        ? 'bg-[#1C1917] text-white'
                        : 'text-[#57534E] hover:text-[#1C1917] bg-white border border-[#E2DBD0]'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Hồ Sơ Thẩm Định Di Sản CKB</span>
                  </button>
                </div>

                {/* Sub-view 1: Styling Recipe */}
                {detailTab === 'styling' && (
                  <div className="space-y-4">
                    {/* Grid of 4 elements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-lg border border-[#E2DBD0]">
                        <span className="font-mono text-[10px] text-[#A8A29E] uppercase block mb-1">
                          CỔ ÁO & QUY THỨC VẠT
                        </span>
                        <div className="font-semibold text-[#1C1917]">{currentProposal.visual_details.collar_style}</div>
                        <div className="text-[#57534E] text-[11px] mt-0.5">{currentProposal.visual_details.lapel_side}</div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-[#E2DBD0]">
                        <span className="font-mono text-[10px] text-[#A8A29E] uppercase block mb-1">
                          TAY ÁO & ĐỘ DÀI
                        </span>
                        <div className="font-semibold text-[#1C1917]">{currentProposal.visual_details.sleeve_style}</div>
                        <div className="text-[#57534E] text-[11px] mt-0.5">{currentProposal.visual_details.cut_length}</div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-[#E2DBD0]">
                        <span className="font-mono text-[10px] text-[#A8A29E] uppercase block mb-1">
                          CHẤT LIỆU VẢI & LAYER
                        </span>
                        <div className="font-semibold text-[#1C1917]">
                          {currentProposal.visual_details.fabric_materials.join(', ')}
                        </div>
                        <div className="text-[#57534E] text-[11px] mt-0.5">
                          Layer trong: {currentProposal.visual_details.layering_pieces?.join(', ') || 'Áo lót tối giản'}
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-[#E2DBD0]">
                        <span className="font-mono text-[10px] text-[#A8A29E] uppercase block mb-1">
                          THÂN DƯỚI & GIÀY
                        </span>
                        <div className="font-semibold text-[#1C1917]">{currentProposal.visual_details.bottom_garment}</div>
                        <div className="text-[#57534E] text-[11px] mt-0.5">Giày: {currentProposal.visual_details.footwear}</div>
                      </div>
                    </div>

                    {/* Stylist Notes Box */}
                    <div className="p-4 bg-white border border-[#E2DBD0] rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1917] font-serif">
                        <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
                        <span>Lời Khuyên Stylist Dành Riêng Cho Gen Z</span>
                      </div>
                      <p className="text-xs text-[#44403C] italic leading-relaxed">
                        "{currentProposal.stylist_notes.philosophy}"
                      </p>
                      <ul className="space-y-1 pt-1 text-[11px] text-[#57534E] list-disc list-inside">
                        {currentProposal.stylist_notes.gen_z_tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Sub-view 2: Cultural Audit Panel */}
                {detailTab === 'audit' && (
                  <CulturalAuditPanel
                    audit={currentProposal.audit}
                    onOpenCKB={onOpenCKB}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
