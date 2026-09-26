import React, { useState, useEffect, useRef } from 'react';
import { GarmentKey, OutfitProposal } from '../types/vietphuc';
import { GarmentSchematic } from './GarmentSchematic';
import { CulturalAuditPanel } from './CulturalAuditPanel';
import { formatSourceBadge, getLookSummaryStatus } from '../utils/remixStateHelpers';
import { Sparkles, Sliders, Share2, Wand2, ArrowRight, ChevronDown, ChevronUp, Shirt, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface CoDesignStudioProps {
  proposals: OutfitProposal[];
  selectedPlanIndex: number;
  onSelectPlanIndex: (idx: number) => void;
  onUpdateProposals: (newProposals: OutfitProposal[], source: string) => void;
  proposalSource: string | null;
  selectedGarment: GarmentKey;
  onChangeGarment: (g: GarmentKey) => void;
  dialLevel: number;
  onChangeDialLevel: (d: number) => void;
  context: string;
  onChangeContext: (c: string) => void;
  style: string;
  onChangeStyle: (s: string) => void;
  customNotes: string;
  onChangeCustomNotes: (n: string) => void;
  onOpenCKB: (evidenceId?: string) => void;
  onOpenLookbookCard: (proposal: OutfitProposal) => void;
  onNavigateToWhatIf: () => void;
}

const DIAL_LEVELS = [
  { level: 1, label: 'Nguyên bản tham chiếu', short: 'Nguyên bản', desc: 'Bảo lưu trọn vẹn chất liệu gấm, lụa tơ tằm cổ truyền và quy thức khuy cài chuẩn mực.' },
  { level: 2, label: 'Tối giản đương đại', short: 'Tối giản', desc: 'Thay bằng linen thô mộc, cotton dệt thoáng mát, phom dáng nhẹ nhàng thường nhật.' },
  { level: 3, label: 'Phố thị đương đại', short: 'Đường phố', desc: 'Phối denim selvedge thô, quần tây ống suông rộng, bốt da chunky trẻ trung.' },
  { level: 4, label: 'May đo cao cấp', short: 'May đo', desc: 'Dáng áo khoác duster coat mở tà bay bổng, phối layer blazer và chân váy xếp ly.' },
  { level: 5, label: 'Phá cách thể nghiệm', short: 'Phá cách', desc: 'Ứng dụng chất liệu kỹ thuật (techwear), cấu trúc giải tỏa trong vùng biến tấu an toàn.' },
];

const GARMENTS = [
  {
    key: 'ngu_than' as GarmentKey,
    name: 'Áo Ngũ Thân Tay Chẽn',
    dynasty: 'Thường phục triều Nguyễn',
    seal: 'LẬP LĨNH',
    desc: 'Cổ đứng 4-5cm ôm khít, vạt Hữu nhậm cài sang phải, tay chẽn gọn gàng cử động linh hoạt.',
    badgeColor: 'border-[#38BDF8]/40 text-[#38BDF8] bg-[#38BDF8]/10',
  },
  {
    key: 'ao_tac' as GarmentKey,
    name: 'Áo Tấc Lễ Phục',
    dynasty: 'Đại lễ phục triều Nguyễn',
    seal: 'TAY THỤNG',
    desc: 'Ống tay thụng hình chữ nhật buông quá ngón tay trang trọng; có thể mở khuy mặc như áo khoác dáng dài.',
    badgeColor: 'border-[#34D399]/40 text-[#34D399] bg-[#34D399]/10',
  },
  {
    key: 'nhat_binh' as GarmentKey,
    name: 'Áo Nhật Bình',
    dynasty: 'Cung tần & Mệnh phụ',
    seal: 'ĐỐI KHÂM',
    desc: 'Nẹp cổ chữ nhật đối khâm thêu hoa văn, dải màu ngũ sắc ở viền tay; phối cùng chân váy xếp ly hiện đại.',
    badgeColor: 'border-[#F43F5E]/40 text-[#F43F5E] bg-[#F43F5E]/10',
  },
];

const CONTEXT_OPTIONS = [
  { id: 'streetwear', label: 'Dạo phố / Cà phê cuối tuần' },
  { id: 'fashion_week', label: 'Sự kiện thời trang / Triển lãm nghệ thuật' },
  { id: 'creative_office', label: 'Công sở sáng tạo / Giao lưu văn hóa' },
  { id: 'festival', label: 'Lễ hội truyền thống / Kỷ yếu tốt nghiệp' },
];

const STYLE_OPTIONS = [
  { id: 'indigo_denim', label: 'Indigo Denim & Giày Chunky hiện đại' },
  { id: 'modern_minimal', label: 'Tối giản tự nhiên (Linen & Đũi mộc)' },
  { id: 'sartorial_tailored', label: 'Sartorial may đo (Phối Trousers & Layer)' },
  { id: 'neo_indochine', label: 'Neo-Chic Indochine (Nhung & Váy xếp ly)' },
  { id: 'techwear_utility', label: 'Techwear tiện ích (Vải dù chống nước)' },
];

export const CoDesignStudio: React.FC<CoDesignStudioProps> = ({
  proposals,
  selectedPlanIndex,
  onSelectPlanIndex,
  onUpdateProposals,
  proposalSource,
  selectedGarment,
  onChangeGarment,
  dialLevel,
  onChangeDialLevel,
  context,
  onChangeContext,
  style,
  onChangeStyle,
  customNotes,
  onChangeCustomNotes,
  onOpenCKB,
  onOpenLookbookCard,
  onNavigateToWhatIf,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detailTab, setDetailTab] = useState<'styling' | 'audit'>('styling');
  const [showAdvancedNotes, setShowAdvancedNotes] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Request lifecycle management refs to invalidate late/stale responses
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeGarmentRef = useRef<GarmentKey>(selectedGarment);
  const activeReqIdRef = useRef<number>(0);

  activeGarmentRef.current = selectedGarment;

  // Abort ongoing request on component unmount (e.g. tab change)
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // When garment changes, abort any ongoing in-flight request and reset loading/error
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setErrorMsg(null);
  }, [selectedGarment]);

  const handleGenerateOutfits = async () => {
    // 3. Prevent duplicate requests inside handler
    if (loading) return;

    // Abort previous in-flight request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const reqId = ++activeReqIdRef.current;
    const targetGarment = selectedGarment;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/remix/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          garment: targetGarment,
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

      // Check if this request is still the active one and garment has not changed
      if (
        controller.signal.aborted ||
        reqId !== activeReqIdRef.current ||
        activeGarmentRef.current !== targetGarment
      ) {
        return;
      }

      if (data.proposals && data.proposals.length > 0) {
        // 1. Only pass actual source, no 'gemini' default fallback
        onUpdateProposals(data.proposals, data.source || '');
      } else {
        throw new Error('Không nhận được dữ liệu thiết kế từ hệ thống.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || controller.signal.aborted) {
        // Request was aborted cleanly, do nothing
        return;
      }
      if (reqId === activeReqIdRef.current && activeGarmentRef.current === targetGarment) {
        console.error('Failed to generate outfits:', err);
        setErrorMsg(err.message || 'Lỗi kết nối khi phối đồ.');
      }
    } finally {
      if (reqId === activeReqIdRef.current && !controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const currentProposal = proposals[selectedPlanIndex] || null;

  // 1. Format source badge display safely (Gemini only when source === 'gemini')
  const renderSourceBadge = () => {
    const info = formatSourceBadge(proposalSource);
    if (info.badgeType === 'gemini') {
      return (
        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-[#0D9488]/15 text-[#2DD4BF] border border-[#0D9488]/30 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
          {info.label}
        </span>
      );
    }
    if (info.badgeType === 'fallback') {
      return (
        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
          {info.label}
        </span>
      );
    }
    return (
      <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-700/30 text-slate-400 border border-slate-700">
        {info.label}
      </span>
    );
  };

  // Determine caution status for the quick summary strip under look title
  const summaryStatus = getLookSummaryStatus(currentProposal?.audit);

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-[#181C24] border border-[#272D3A] rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#14B8A6] uppercase tracking-wider">
              Studio Phối Đồ Việt Phục Đương Đại
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F1F5F9] tracking-tight">
            Tạo bản phối Việt phục theo phong cách riêng của bạn
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl leading-relaxed">
            Chọn loại áo cổ truyền, dịp mặc và mức độ phá cách mong muốn. Hệ thống sẽ khởi tạo 2 phương án thiết kế độc đáo kèm ghi chú tham chiếu văn hóa.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => onOpenCKB()}
            className="text-xs font-medium text-[#2DD4BF] hover:text-white bg-[#0D9488]/10 hover:bg-[#0D9488]/20 border border-[#0D9488]/30 px-3 py-2 rounded-xl transition-colors cursor-pointer min-h-[40px] flex items-center gap-1.5"
          >
            <span>Xem quy tắc tham chiếu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Studio Layout: Dominant Outfit Center (8 cols) & Compact Controls (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Compact Design Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#181C24] border border-[#272D3A] rounded-2xl p-4 sm:p-5 shadow-sm space-y-5">
            <h3 className="text-base font-serif font-bold text-[#F1F5F9] pb-3 border-b border-[#272D3A] flex items-center justify-between">
              <span>Tùy chỉnh bản phối</span>
              <span className="text-xs font-mono font-normal text-[#94A3B8]">4 bước đơn giản</span>
            </h3>

            {/* 1. Chọn loại áo */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block">
                1. Loại áo cổ truyền
              </label>
              <div className="space-y-2">
                {GARMENTS.map((g) => {
                  const isSelected = selectedGarment === g.key;
                  return (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => onChangeGarment(g.key)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer min-h-[52px] ${
                        isSelected
                          ? 'border-[#14B8A6] bg-[#1E2530] text-white shadow-xs ring-1 ring-[#14B8A6]/40'
                          : 'border-[#28303E] bg-[#161920] hover:bg-[#1E232D] text-[#94A3B8]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-serif font-bold ${isSelected ? 'text-[#F1F5F9]' : 'text-[#CBD5E1]'}`}>
                          {g.name}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${g.badgeColor}`}>
                          {g.seal}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                        {g.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Dịp mặc & Phong cách */}
            <div className="space-y-3 pt-1 border-t border-[#272D3A]/60">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">
                  2. Dịp mặc (Bối cảnh)
                </label>
                <select
                  value={context}
                  onChange={(e) => onChangeContext(e.target.value)}
                  className="w-full text-sm font-medium bg-[#161920] border border-[#2B3342] rounded-xl px-3 py-2.5 text-[#E2E8F0] focus:outline-none focus:border-[#14B8A6] min-h-[44px]"
                >
                  {CONTEXT_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">
                  3. Phong cách đương đại
                </label>
                <select
                  value={style}
                  onChange={(e) => onChangeStyle(e.target.value)}
                  className="w-full text-sm font-medium bg-[#161920] border border-[#2B3342] rounded-xl px-3 py-2.5 text-[#E2E8F0] focus:outline-none focus:border-[#14B8A6] min-h-[44px]"
                >
                  {STYLE_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Mức độ Remix (Dial) */}
            <div className="space-y-2.5 pt-1 border-t border-[#272D3A]/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#14B8A6]" />
                  <span>4. Mức độ biến tấu ({dialLevel}/5)</span>
                </label>
                <span className="text-xs font-semibold text-[#2DD4BF] font-mono bg-[#0D9488]/15 border border-[#0D9488]/30 px-2 py-0.5 rounded">
                  {DIAL_LEVELS[dialLevel - 1].short}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={dialLevel}
                onChange={(e) => onChangeDialLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-[#262C38] rounded-lg appearance-none cursor-pointer accent-[#14B8A6]"
              />

              <div className="grid grid-cols-5 gap-1 text-[11px] text-center font-mono">
                {DIAL_LEVELS.map((d) => (
                  <button
                    key={d.level}
                    type="button"
                    onClick={() => onChangeDialLevel(d.level)}
                    className={`py-1.5 rounded-lg border transition-all cursor-pointer min-h-[34px] ${
                      dialLevel === d.level
                        ? 'border-[#14B8A6] bg-[#0D9488]/25 text-[#2DD4BF] font-bold'
                        : 'border-[#28303E] bg-[#161920] text-[#94A3B8] hover:border-[#384356]'
                    }`}
                  >
                    {d.level}
                  </button>
                ))}
              </div>

              <p className="text-xs text-[#94A3B8] bg-[#161920] p-3 rounded-xl border border-[#272D3A] leading-relaxed">
                <span className="font-semibold text-[#E2E8F0]">Đặc trưng: </span>
                {DIAL_LEVELS[dialLevel - 1].desc}
              </p>
            </div>

            {/* Ghi chú nâng cao (Collapsible) */}
            <div className="pt-1 border-t border-[#272D3A]/60">
              <button
                type="button"
                onClick={() => setShowAdvancedNotes(!showAdvancedNotes)}
                className="text-xs font-medium text-[#94A3B8] hover:text-[#E2E8F0] flex items-center justify-between w-full py-1.5 cursor-pointer"
              >
                <span>Ghi chú sáng tạo (tùy chọn)</span>
                {showAdvancedNotes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvancedNotes && (
                <div className="mt-2 animate-in fade-in duration-150">
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => onChangeCustomNotes(e.target.value)}
                    placeholder="VD: Phối tone xanh chàm, bốt da đen cao cổ..."
                    className="w-full text-xs sm:text-sm bg-[#161920] border border-[#2B3342] rounded-xl px-3 py-2.5 text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:border-[#14B8A6] min-h-[44px]"
                  />
                </div>
              )}
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Primary Action Button (>= 44px) */}
            <button
              onClick={handleGenerateOutfits}
              disabled={loading}
              className="w-full py-3 bg-[#0D9488] hover:bg-[#0F766E] disabled:bg-[#334155] text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm min-h-[46px] cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang phối đồ & tham chiếu...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-[#99F6E4]" />
                  <span>Tạo bản phối</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Hero Outfit Presentation (8 cols - The Centerpiece) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Plan Selector Buttons: Look A vs Look B */}
          {proposals.length > 0 && (
            <div className="flex items-center gap-2 p-1.5 bg-[#181C24] border border-[#272D3A] rounded-2xl">
              {proposals.map((prop, idx) => {
                const isActive = selectedPlanIndex === idx;
                return (
                  <button
                    key={prop.id}
                    onClick={() => onSelectPlanIndex(idx)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                      isActive
                        ? 'bg-[#222834] text-[#2DD4BF] border border-[#0D9488]/50 shadow-xs'
                        : 'bg-[#161920] border border-[#262C38] text-[#94A3B8] hover:text-[#E2E8F0]'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#2DD4BF]' : 'bg-[#64748B]'}`} />
                    <span className="truncate">
                      {idx === 0 ? 'Bản phối A: Bám sát di sản' : `Bản phối B: Phá cách (Mức ${prop.dial_level})`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty State when no proposals generated yet */}
          {!currentProposal && !loading && (
            <div className="bg-[#181C24] border-2 border-dashed border-[#28303E] rounded-2xl p-8 sm:p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#202530] flex items-center justify-center mx-auto text-[#14B8A6] border border-[#2A313E]">
                <Shirt className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F1F5F9]">
                  Chưa có bản phối nào cho {GARMENTS.find(g => g.key === selectedGarment)?.name}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Hãy chọn mức độ biến tấu bên trái và bấm nút <strong className="text-[#2DD4BF]">"Tạo bản phối"</strong> để xem 2 phương án thiết kế độc đáo kèm lời khuyên từ stylist và ghi chú tham chiếu văn hóa.
                </p>
              </div>
              <button
                onClick={handleGenerateOutfits}
                className="px-5 py-2.5 bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Wand2 className="w-4 h-4 text-[#99F6E4]" />
                <span>Tạo bản phối ngay</span>
              </button>
            </div>
          )}

          {/* Current Outfit Presentation Board */}
          {currentProposal && (
            <div className="bg-[#181C24] border border-[#272D3A] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              {/* Proposal Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#272D3A] gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#14B8A6]">
                      {currentProposal.concept_tag}
                    </span>
                    {/* Safe source provenance badge */}
                    {renderSourceBadge()}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F1F5F9] leading-snug">
                    {currentProposal.title}
                  </h3>

                  {/* 4. Quick Cultural Reference & Caution Summary Strip directly under Look Title */}
                  <div className="pt-1.5 flex items-center justify-between gap-3 flex-wrap bg-[#14171E] p-2.5 rounded-xl border border-[#232834]">
                    <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                      {summaryStatus.badges.map((badge, idx) => {
                        if (badge.variant === 'caution') {
                          return (
                            <span key={idx} className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-1 shrink-0">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                              {badge.label}
                            </span>
                          );
                        }
                        if (badge.variant === 'uncertainty') {
                          return (
                            <span key={idx} className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-center gap-1 shrink-0">
                              <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                              {badge.label}
                            </span>
                          );
                        }
                        return (
                          <span key={idx} className="text-xs font-semibold px-2 py-0.5 rounded bg-[#0D9488]/15 border border-[#0D9488]/40 text-[#2DD4BF] flex items-center gap-1 shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
                            {badge.label}
                          </span>
                        );
                      })}

                      <span className="text-xs text-[#94A3B8] truncate" title={summaryStatus.summaryText}>
                        {summaryStatus.summaryText}
                      </span>
                    </div>

                    <button
                      onClick={() => setDetailTab('audit')}
                      className="text-xs font-semibold text-[#2DD4BF] hover:text-[#5EEAD4] flex items-center gap-1 shrink-0 cursor-pointer min-h-[32px] px-2 py-1 rounded-lg hover:bg-[#222834] transition-colors"
                    >
                      <span>Xem giải thích</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Direct Action Buttons near Result */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap self-start sm:self-center">
                  {/* Button to test modifications on this active look */}
                  <button
                    onClick={onNavigateToWhatIf}
                    className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap min-h-[40px] shadow-xs cursor-pointer"
                    title="Chuyển sang tab Thử thay đổi để khám phá các kịch bản What-If trên bản phối này"
                  >
                    <span>Thử thay đổi cho bản phối này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenLookbookCard(currentProposal)}
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-[#E2E8F0] bg-[#222834] border border-[#2E3646] hover:bg-[#2A3140] rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap min-h-[40px] cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    <span>Thẻ Lookbook</span>
                  </button>
                </div>
              </div>

              {/* Garment Visual Canvas Viewport */}
              <div className="rounded-xl overflow-hidden border border-[#272D3A]">
                <GarmentSchematic
                  garment={currentProposal.garment_type}
                  visualDetails={currentProposal.visual_details}
                  dialLevel={currentProposal.dial_level}
                  isOpenFront={currentProposal.garment_type === 'ao_tac' && currentProposal.dial_level >= 3}
                />
                <div className="bg-[#14171E] px-4 py-2 border-t border-[#272D3A] text-center text-xs text-[#94A3B8]">
                  Khám phá cấu trúc trang phục · Sơ đồ hình họa tương tác (Minh họa quy thức, không phải bản rập may hoặc ảnh AI)
                </div>
              </div>

              {/* Detail Tabs Switcher: Styling vs Cultural Reference */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#272D3A] pb-2">
                  <button
                    onClick={() => setDetailTab('styling')}
                    className={`text-xs sm:text-sm font-semibold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer min-h-[38px] ${
                      detailTab === 'styling'
                        ? 'bg-[#222834] text-[#2DD4BF] border border-[#0D9488]/40'
                        : 'text-[#94A3B8] hover:text-[#E2E8F0]'
                    }`}
                  >
                    Chi tiết phối đồ & Stylist
                  </button>

                  <button
                    onClick={() => setDetailTab('audit')}
                    className={`text-xs sm:text-sm font-semibold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                      detailTab === 'audit'
                        ? 'bg-[#222834] text-[#2DD4BF] border border-[#0D9488]/40'
                        : 'text-[#94A3B8] hover:text-[#E2E8F0]'
                    }`}
                  >
                    <span>Tham chiếu văn hóa</span>
                    <span className={`w-2 h-2 rounded-full ${
                      currentProposal.audit.status === 'Supported'
                        ? 'bg-[#10B981]'
                        : currentProposal.audit.status === 'Supported with Caution'
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#F43F5E]'
                    }`} />
                  </button>
                </div>

                {/* Tab Content: Styling Architecture */}
                {detailTab === 'styling' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Garment Pieces Specification */}
                      <div className="bg-[#161920] p-4 rounded-xl border border-[#272D3A] space-y-3">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#14B8A6] font-semibold block">
                          Cấu trúc y phục chính
                        </span>

                        <div className="space-y-2 text-xs sm:text-sm">
                          <div>
                            <span className="text-[#64748B] block text-[11px] uppercase">Cổ áo & Khuy cài</span>
                            <span className="font-medium text-[#F1F5F9]">{currentProposal.visual_details.collar_style}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block text-[11px] uppercase">Quy thức vạt áo</span>
                            <span className="font-medium text-[#F1F5F9]">{currentProposal.visual_details.lapel_side}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block text-[11px] uppercase">Dáng tay áo</span>
                            <span className="font-medium text-[#F1F5F9]">{currentProposal.visual_details.sleeve_style}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block text-[11px] uppercase">Chiều dài tà áo</span>
                            <span className="font-medium text-[#F1F5F9]">{currentProposal.visual_details.cut_length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Modern Mix & Match Breakdown */}
                      <div className="bg-[#161920] p-4 rounded-xl border border-[#272D3A] space-y-3">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#14B8A6] font-semibold block">
                          Phối cùng phụ kiện & giày
                        </span>

                        <div className="space-y-2 text-xs sm:text-sm">
                          <div>
                            <span className="text-[#64748B] block text-[11px] uppercase">Trang phục dưới (Quần / Váy)</span>
                            <span className="font-medium text-[#F1F5F9]">{currentProposal.visual_details.bottom_garment}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block text-[11px] uppercase">Giày dép đề xuất</span>
                            <span className="font-medium text-[#F1F5F9]">{currentProposal.visual_details.footwear}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block text-[11px] uppercase">Lớp áo trong</span>
                            <span className="font-medium text-[#F1F5F9]">{currentProposal.visual_details.layering_pieces?.join(', ') || 'Áo thun lót mộc'}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block text-[11px] uppercase">Bảng màu chính</span>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              {currentProposal.visual_details.color_palette.map((color, i) => (
                                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[#222834] text-[#CBD5E1] border border-[#2E3646]">
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stylist Notes Box */}
                    <div className="bg-[#161920] p-4 sm:p-5 rounded-xl border border-[#272D3A] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#14B8A6] font-semibold">
                          Lời khuyên từ Stylist đương đại
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed font-serif italic">
                        "{currentProposal.stylist_notes.philosophy}"
                      </p>

                      <div className="pt-2 border-t border-[#272D3A] space-y-1">
                        <span className="text-xs font-semibold text-[#94A3B8]">Mẹo mặc đẹp cho Gen Z:</span>
                        <ul className="list-disc list-inside text-xs sm:text-sm text-[#94A3B8] space-y-1 pl-1">
                          {currentProposal.stylist_notes.gen_z_tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content: Cultural Reference */}
                {detailTab === 'audit' && (
                  <div className="animate-in fade-in duration-150">
                    <CulturalAuditPanel
                      audit={currentProposal.audit}
                      onOpenCKB={onOpenCKB}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
