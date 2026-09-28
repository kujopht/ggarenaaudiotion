import React, { useState, useEffect, useRef } from 'react';
import { GarmentKey, OutfitProposal } from '../types/vietphuc';
import { GarmentSchematic } from './GarmentSchematic';
import { CulturalAuditPanel } from './CulturalAuditPanel';
import { formatSourceBadge, getLookSummaryStatus } from '../utils/remixStateHelpers';
import { DongSonDialRing } from './MotionMotifs';
import { Sparkles, Sliders, Share2, Wand2, ArrowRight, ChevronDown, ChevronUp, Shirt, AlertTriangle, ShieldCheck, HelpCircle, Info } from 'lucide-react';

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
  motionEnabled?: boolean;
}

const DIAL_LEVELS = [
  { level: 1, label: 'Bám sát tham chiếu', short: 'Bám sát', desc: 'Bảo lưu trọn vẹn phom dáng, chất liệu gấm lụa truyền thống và quy thức khuy cài chuẩn mực.' },
  { level: 2, label: 'Tối giản đương đại', short: 'Tối giản', desc: 'Thay bằng linen thô mộc, cotton dệt thoáng mát, phom dáng nhẹ nhàng thường nhật.' },
  { level: 3, label: 'Phố thị đương đại', short: 'Đường phố', desc: 'Phối denim selvedge thô, quần tây ống suông rộng, bốt da chunky trẻ trung.' },
  { level: 4, label: 'May đo cao cấp', short: 'May đo', desc: 'Dáng áo khoác duster coat mở tà bay bổng, phối layer blazer và chân váy xếp ly.' },
  { level: 5, label: 'Phá cách thể nghiệm', short: 'Phá cách', desc: 'Ứng dụng chất liệu kỹ thuật (techwear), cấu trúc giải tỏa trong vùng biến tấu an toàn.' },
];

/**
 * Garment Icon Silhouettes - Stylized authentic vector line sketches
 */
const GarmentSketchIcon: React.FC<{ garment: GarmentKey; isSelected: boolean }> = ({ garment, isSelected }) => {
  const strokeColor = isSelected ? '#C9A66B' : '#8C7E6C';

  if (garment === 'ngu_than') {
    return (
      <svg width="40" height="40" viewBox="0 0 44 44" fill="none" className="shrink-0">
        {/* Standing collar */}
        <rect x="18" y="6" width="8" height="5" rx="1" stroke={strokeColor} strokeWidth="1.5" />
        {/* Left overlap seam (Hữu nhậm to right) */}
        <path d="M22,11 Q24,18 29,22 L31,38 L13,38 L15,22 Q20,18 22,11 Z" stroke={strokeColor} strokeWidth="1.5" fill={isSelected ? '#C9A66B15' : 'none'} />
        <path d="M22,11 Q24,17 29,21" stroke="#E6C88B" strokeWidth="1.5" />
        {/* Narrow sleeves */}
        <path d="M17,13 L8,24 L12,25 L16,18" stroke={strokeColor} strokeWidth="1.25" />
        <path d="M27,13 L36,24 L32,25 L28,18" stroke={strokeColor} strokeWidth="1.25" />
      </svg>
    );
  }

  if (garment === 'ao_tac') {
    return (
      <svg width="40" height="40" viewBox="0 0 44 44" fill="none" className="shrink-0">
        {/* Standing collar */}
        <rect x="18" y="6" width="8" height="5" rx="1" stroke={strokeColor} strokeWidth="1.5" />
        {/* Wide rectangular loose sleeves (Tay thụng) */}
        <path d="M16,13 L4,17 L6,34 L14,30 L15,21" stroke={strokeColor} strokeWidth="1.25" fill={isSelected ? '#C9A66B15' : 'none'} />
        <path d="M28,13 L40,17 L38,34 L30,30 L29,21" stroke={strokeColor} strokeWidth="1.25" fill={isSelected ? '#C9A66B15' : 'none'} />
        {/* Robe body */}
        <path d="M17,11 L27,11 L29,38 L15,38 Z" stroke={strokeColor} strokeWidth="1.5" />
      </svg>
    );
  }

  // Nhật Bình
  return (
    <svg width="40" height="40" viewBox="0 0 44 44" fill="none" className="shrink-0">
      {/* Rectangular straight collar band (Đối khâm) */}
      <rect x="18" y="6" width="8" height="32" stroke="#E6C88B" strokeWidth="1.5" fill={isSelected ? '#B8342B25' : 'none'} />
      {/* Outer panels */}
      <path d="M18,10 L10,13 L12,38 L18,38" stroke={strokeColor} strokeWidth="1.25" />
      <path d="M26,10 L34,13 L32,38 L26,38" stroke={strokeColor} strokeWidth="1.25" />
      {/* 5-color striped cuffs indicator */}
      <line x1="8" y1="26" x2="13" y2="27" stroke="#43B6A4" strokeWidth="1.5" />
      <line x1="31" y1="27" x2="36" y2="26" stroke="#43B6A4" strokeWidth="1.5" />
    </svg>
  );
};

const GARMENTS = [
  {
    key: 'ngu_than' as GarmentKey,
    name: 'Áo Ngũ Thân Tay Chẽn',
    dynasty: 'Thường phục triều Nguyễn',
    seal: 'CỔ ĐỨNG · HỮU NHẬM',
    desc: 'Cổ vuông đứng, tay chẽn, kết cấu 5 thân',
    badgeColor: 'border-[#C9A66B]/50 text-[#E6C88B] bg-[#C9A66B]/15',
  },
  {
    key: 'ao_tac' as GarmentKey,
    name: 'Áo Tấc Lễ Phục',
    dynasty: 'Đại lễ phục triều Nguyễn',
    seal: 'TAY THỤNG · LỄ PHỤC',
    desc: 'Lễ phục ngũ thân với tay thụng rộng và dài',
    badgeColor: 'border-[#43B6A4]/50 text-[#43B6A4] bg-[#43B6A4]/15',
  },
  {
    key: 'nhat_binh' as GarmentKey,
    name: 'Áo Nhật Bình',
    dynasty: 'Cung tần & Mệnh phụ',
    seal: 'ĐỐI KHÂM · THEO PHẨM CẤP',
    desc: 'Nẹp cổ đối khâm hình chữ nhật, hoa văn và chi tiết tay thay đổi theo phẩm cấp',
    badgeColor: 'border-[#B8342B]/50 text-[#F5A39D] bg-[#B8342B]/15',
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
  motionEnabled = true,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detailTab, setDetailTab] = useState<'styling' | 'audit'>('styling');
  const [showAdvancedNotes, setShowAdvancedNotes] = useState<boolean>(false);
  const [expandedGarmentKey, setExpandedGarmentKey] = useState<GarmentKey | null>(null);
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
    // Prevent duplicate requests inside handler
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
        onUpdateProposals(data.proposals, data.source || '');
      } else {
        throw new Error('Không nhận được dữ liệu thiết kế từ hệ thống.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || controller.signal.aborted) {
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

  // Safe format source badge display (Gemini only when source === 'gemini')
  const renderSourceBadge = () => {
    const info = formatSourceBadge(proposalSource);
    if (info.badgeType === 'gemini') {
      return (
        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-[#C9A66B]/15 text-[#E6C88B] border border-[#C9A66B]/40 flex items-center gap-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E6C88B]" />
          {info.label}
        </span>
      );
    }
    if (info.badgeType === 'fallback') {
      return (
        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-[#B8342B]/15 text-[#F5A39D] border border-[#B8342B]/40 shadow-xs">
          {info.label}
        </span>
      );
    }
    return (
      <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-[#2C211D] text-[#B8AA96] border border-[#4A3830]">
        {info.label}
      </span>
    );
  };

  // Determine caution status for the quick summary strip under look title
  const summaryStatus = getLookSummaryStatus(currentProposal?.audit);

  // Helper to render real color swatch tile with authentic shade labels
  const renderColorSwatch = (colorStr: string, idx: number) => {
    const hexMatch = colorStr.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
    const hex = hexMatch ? hexMatch[0] : '#3A2B25';
    const label = colorStr.replace(hex, '').trim() || hex;

    return (
      <div
        key={idx}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#181311] border border-[#3A2B25] shadow-xs"
      >
        <span
          className="w-4 h-4 rounded-md border border-white/20 shadow-xs shrink-0"
          style={{ backgroundColor: hex }}
        />
        <span className="text-xs font-medium text-[#F2E9D8]">{label}</span>
        {hexMatch && label !== hex && (
          <span className="text-[10px] font-mono text-[#8C7E6C]">{hex}</span>
        )}
      </div>
    );
  };

  return (
    <div id="studio-workspace" className="space-y-6">
      {/* Studio Header Bar */}
      <div className="lacquer-panel rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#C9A66B] uppercase tracking-wider">
              Xưởng Phối Đồ Sơn Mài Đương Đại
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F2E9D8] tracking-tight">
            Tạo bản phối Việt phục theo phong cách riêng của bạn
          </h2>
          <p className="text-sm sm:text-base text-[#B8AA96] max-w-2xl leading-relaxed">
            Chọn loại áo cổ truyền, dịp mặc và mức độ phá cách mong muốn. Hệ thống sẽ khởi tạo 2 phương án thiết kế độc đáo kèm ghi chú tham chiếu văn hóa.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => onOpenCKB()}
            className="text-xs font-medium text-[#E6C88B] hover:text-[#F2E9D8] bg-[#261C19]/80 hover:bg-[#322521] border border-[#C9A66B]/30 px-3.5 py-2 rounded-xl transition-colors cursor-pointer min-h-[40px] flex items-center gap-1.5 backdrop-blur-xs"
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
          <div className="lacquer-panel rounded-2xl p-4 sm:p-5 space-y-5">
            <h3 className="text-base font-serif font-bold text-[#F2E9D8] pb-3 border-b border-[#C9A66B]/20 flex items-center justify-between">
              <span>Tùy chỉnh bản phối</span>
              <span className="text-xs font-mono font-semibold text-[#E6C88B] bg-[#C9A66B]/15 px-2 py-0.5 rounded border border-[#C9A66B]/30">5 bước tạo kiểu nhanh</span>
            </h3>

            {/* Quick Presets for Demo / Judging Flow (1-Click Setup) */}
            <div className="space-y-1.5 pb-2 border-b border-[#C9A66B]/15">
              <span className="text-[11px] font-mono text-[#8C7E6C] uppercase tracking-wider block">
                Gợi ý nhanh (1-chạm):
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    onChangeGarment('ngu_than');
                    onChangeContext('streetwear');
                    onChangeStyle('indigo_denim');
                    onChangeDialLevel(3);
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#211815]/90 hover:bg-[#2C211D] border border-[#C9A66B]/30 text-[#E6C88B] hover:text-[#F2E9D8] transition-colors cursor-pointer"
                >
                  ⚡ Ngũ Thân Indigo (Mức 3)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeGarment('ao_tac');
                    onChangeContext('fashion_week');
                    onChangeStyle('sartorial_tailored');
                    onChangeDialLevel(4);
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#211815]/90 hover:bg-[#2C211D] border border-[#43B6A4]/30 text-[#43B6A4] hover:text-[#F2E9D8] transition-colors cursor-pointer"
                >
                  ⚡ Áo Tấc Duster Coat (Mức 4)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeGarment('nhat_binh');
                    onChangeContext('creative_office');
                    onChangeStyle('modern_minimal');
                    onChangeDialLevel(2);
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#211815]/90 hover:bg-[#2C211D] border border-[#B8342B]/30 text-[#F5A39D] hover:text-[#F2E9D8] transition-colors cursor-pointer"
                >
                  ⚡ Nhật Bình Linen (Mức 2)
                </button>
              </div>
            </div>

            {/* 1. Chọn loại áo với hình phác họa vector riêng biệt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#B8AA96] block">
                  1. Loại áo cổ truyền
                </label>
                <span className="text-[11px] font-sans text-[#8C7E6C]">
                  Phác họa quy thức minh họa
                </span>
              </div>

              <div className="space-y-2.5">
                {GARMENTS.map((g) => {
                  const isSelected = selectedGarment === g.key;
                  const isExpanded = expandedGarmentKey === g.key;
                  return (
                    <div
                      key={g.key}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isSelected
                          ? 'border-[#C9A66B] bg-[#2E201B]/85 shadow-md ring-1 ring-[#C9A66B]/50'
                          : 'border-[#C9A66B]/15 bg-[#181311]/50 hover:bg-[#211815]/70 hover:border-[#C9A66B]/30'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onChangeGarment(g.key)}
                        className="w-full text-left p-3 cursor-pointer min-h-[60px] flex items-start gap-3"
                      >
                        {/* Stylized Vector Sketch */}
                        <GarmentSketchIcon garment={g.key} isSelected={isSelected} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className={`text-sm font-serif font-bold truncate ${isSelected ? 'text-[#F2E9D8]' : 'text-[#D4C7B4]'}`}>
                              {g.name}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${g.badgeColor}`}>
                              {g.seal}
                            </span>
                          </div>
                          <p className="text-xs text-[#8C7E6C] leading-relaxed line-clamp-2">
                            {g.desc}
                          </p>
                        </div>
                      </button>

                      {/* Expandable deeper info toggle */}
                      <div className="px-3 pb-2.5 pt-0 flex items-center justify-between border-t border-[#C9A66B]/15">
                        <span className="text-[11px] text-[#8C7E6C] italic">
                          {g.dynasty}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedGarmentKey(isExpanded ? null : g.key);
                          }}
                          className="text-[11px] font-mono text-[#C9A66B] hover:text-[#F2E9D8] flex items-center gap-1 cursor-pointer py-0.5 px-1.5 rounded hover:bg-[#322521] transition-colors"
                        >
                          <Info className="w-3 h-3" />
                          <span>{isExpanded ? 'Thu gọn' : 'Quy thức cổ'}</span>
                        </button>
                      </div>

                      {/* Deep Info Drawer */}
                      {isExpanded && (
                        <div className="px-3 py-2.5 bg-[#140F0E]/75 border-t border-[#C9A66B]/15 text-xs text-[#B8AA96] space-y-1.5 animate-in fade-in duration-150">
                          {g.key === 'ngu_than' && (
                            <>
                              <p><strong className="text-[#E6C88B]">Quy thức cấu trúc:</strong> Kết cấu 5 thân (2 thân trước, 2 thân sau, 1 thân con bên trong), cài 5 khuy bên phải (Hữu nhậm).</p>
                              <p><strong className="text-[#E6C88B]">Đặc điểm cốt lõi:</strong> Cổ vuông đứng kín đáo, vạt Hữu nhậm cài khuy bên phải theo quy ước prototype.</p>
                            </>
                          )}
                          {g.key === 'ao_tac' && (
                            <>
                              <p><strong className="text-[#E6C88B]">Quy thức cấu trúc:</strong> Lễ phục ngũ thân với đôi tay thụng rộng buông dài bằng gấu áo, cài khuy bên phải.</p>
                              <p><strong className="text-[#E6C88B]">Khả biến đương đại:</strong> Cho phép mở khuy làm áo khoác duster coat hiện đại, phối quần tây ống rộng.</p>
                            </>
                          )}
                          {g.key === 'nhat_binh' && (
                            <>
                              <p><strong className="text-[#E6C88B]">Quy thức cấu trúc:</strong> Nẹp cổ đối khâm hình chữ nhật cài ở trục chính giữa; dải màu tay áo thay đổi theo phẩm cấp (ngoại lệ Hoàng hậu).</p>
                              <p><strong className="text-[#E6C88B]">Khả biến đương đại:</strong> Phối cùng chân váy xếp ly dài hiện đại hoặc layer áo quây / áo hai dây bên trong.</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Dịp mặc & Phong cách */}
            <div className="space-y-3 pt-2 border-t border-[#C9A66B]/15">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#B8AA96] block mb-1.5">
                  2. Dịp mặc (Bối cảnh)
                </label>
                <select
                  value={context}
                  onChange={(e) => onChangeContext(e.target.value)}
                  className="w-full text-sm font-medium bg-[#181311]/60 border border-[#C9A66B]/20 rounded-xl px-3 py-2.5 text-[#F2E9D8] focus:outline-none focus:border-[#C9A66B] min-h-[44px] backdrop-blur-xs"
                >
                  {CONTEXT_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#B8AA96] block mb-1.5">
                  3. Phong cách đương đại
                </label>
                <select
                  value={style}
                  onChange={(e) => onChangeStyle(e.target.value)}
                  className="w-full text-sm font-medium bg-[#181311]/60 border border-[#C9A66B]/20 rounded-xl px-3 py-2.5 text-[#F2E9D8] focus:outline-none focus:border-[#C9A66B] min-h-[44px] backdrop-blur-xs"
                >
                  {STYLE_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Mức độ Remix (Dial) với vành trang trí vàng đồng */}
            <div className="space-y-3 pt-2 border-t border-[#C9A66B]/15">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#B8AA96] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>4. Chọn mức Remix ({dialLevel}/5)</span>
                </label>
                <span className="text-xs font-semibold text-[#E6C88B] font-mono bg-[#C9A66B]/15 border border-[#C9A66B]/30 px-2 py-0.5 rounded">
                  {DIAL_LEVELS[dialLevel - 1].short}
                </span>
              </div>

              {/* Ornamental Circular Bronze Ring Display: Rotating Motif, Stationary Number */}
              <div className="py-1">
                <DongSonDialRing dialLevel={dialLevel} isRotating={motionEnabled} />
              </div>

              {/* Slider track for touch, mouse, and keyboard */}
              <div className="relative py-1">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={dialLevel}
                  onChange={(e) => onChangeDialLevel(parseInt(e.target.value))}
                  aria-label="Thanh kéo chọn mức độ biến tấu"
                  className="w-full h-2 bg-[#2C211D] rounded-lg appearance-none cursor-pointer accent-[#B8342B]"
                />
              </div>

              {/* 5 discrete level buttons */}
              <div className="grid grid-cols-5 gap-1.5 text-xs text-center font-mono">
                {DIAL_LEVELS.map((d) => (
                  <button
                    key={d.level}
                    type="button"
                    onClick={() => onChangeDialLevel(d.level)}
                    className={`py-2 rounded-lg border transition-all cursor-pointer min-h-[38px] ${
                      dialLevel === d.level
                        ? 'border-[#C9A66B] bg-[#C9A66B]/25 text-[#E6C88B] font-bold shadow-xs ring-1 ring-[#C9A66B]/40'
                        : 'border-[#C9A66B]/15 bg-[#181311]/50 text-[#8C7E6C] hover:border-[#C9A66B]/30 hover:text-[#B8AA96]'
                    }`}
                  >
                    {d.level}
                  </button>
                ))}
              </div>

              <p className="text-xs text-[#B8AA96] bg-[#181311]/60 p-3 rounded-xl border border-[#C9A66B]/15 leading-relaxed backdrop-blur-xs">
                <span className="font-semibold text-[#E6C88B]">{DIAL_LEVELS[dialLevel - 1].label}: </span>
                {DIAL_LEVELS[dialLevel - 1].desc}
              </p>
            </div>

            {/* Ghi chú nâng cao (Collapsible) */}
            <div className="pt-1 border-t border-[#C9A66B]/15">
              <button
                type="button"
                onClick={() => setShowAdvancedNotes(!showAdvancedNotes)}
                className="text-xs font-medium text-[#B8AA96] hover:text-[#F2E9D8] flex items-center justify-between w-full py-1.5 cursor-pointer"
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
                    className="w-full text-xs sm:text-sm bg-[#181311]/60 border border-[#C9A66B]/20 rounded-xl px-3 py-2.5 text-[#F2E9D8] placeholder:text-[#6E5D53] focus:outline-none focus:border-[#C9A66B] min-h-[44px] backdrop-blur-xs"
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

            {/* Step 5: Primary Action Button (>= 44px) */}
            <button
              onClick={handleGenerateOutfits}
              disabled={loading}
              className="w-full py-3 bg-[#B8342B] hover:bg-[#A32D25] disabled:bg-[#3A2B25] text-[#F2E9D8] rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm min-h-[46px] cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang phối đồ & tham chiếu...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-[#F5DCA3]" />
                  <span>5. Tạo 2 bản phối</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Hero Lookbook Centerpiece Presentation (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Plan Selector Buttons: Look A vs Look B */}
          {proposals.length > 0 && (
            <div className="flex items-center gap-2 p-1.5 lacquer-panel-subtle rounded-2xl">
              {proposals.map((prop, idx) => {
                const isActive = selectedPlanIndex === idx;
                return (
                  <button
                    key={prop.id}
                    onClick={() => onSelectPlanIndex(idx)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                      isActive
                        ? 'bg-[#2E201B]/90 text-[#E6C88B] border border-[#C9A66B]/60 shadow-xs'
                        : 'bg-[#181311]/50 border border-[#C9A66B]/15 text-[#B8AA96] hover:text-[#F2E9D8]'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#E6C88B]' : 'bg-[#6E5D53]'}`} />
                    <span className="truncate">
                      {idx === 0 ? 'Bản phối A: Bám sát tham chiếu' : 'Bản phối B: Phá cách đương đại'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty State when no proposals generated yet */}
          {!currentProposal && !loading && (
            <div className="lacquer-panel border-2 border-dashed border-[#C9A66B]/30 rounded-2xl p-8 sm:p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#261C19]/80 flex items-center justify-center mx-auto text-[#C9A66B] border border-[#C9A66B]/30 shadow-xs">
                <Shirt className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F2E9D8]">
                  Chưa có bản phối nào cho {GARMENTS.find(g => g.key === selectedGarment)?.name}
                </h3>
                <p className="text-sm text-[#B8AA96] leading-relaxed">
                  Hãy chọn mức độ biến tấu bên trái và bấm nút <strong className="text-[#E6C88B]">"Tạo bản phối"</strong> để xem 2 phương án thiết kế độc đáo kèm lời khuyên từ stylist và ghi chú tham chiếu văn hóa.
                </p>
              </div>
              <button
                onClick={handleGenerateOutfits}
                className="px-5 py-2.5 bg-[#B8342B] hover:bg-[#A32D25] text-[#F2E9D8] text-sm font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Wand2 className="w-4 h-4 text-[#F5DCA3]" />
                <span>Tạo bản phối ngay</span>
              </button>
            </div>
          )}

          {/* Current Outfit Presentation Board (Lookbook Style) */}
          {currentProposal && (
            <div className="lacquer-card-elevated rounded-2xl p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
              {/* Proposal Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C9A66B]/20 gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C9A66B]">
                      {currentProposal.concept_tag}
                    </span>
                    {/* Safe source provenance badge */}
                    {renderSourceBadge()}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F2E9D8] leading-snug">
                    {currentProposal.title}
                  </h3>

                  {/* Cultural Reference & Caution Summary Strip directly under Look Title */}
                  <div className="pt-1.5 flex items-center justify-between gap-3 flex-wrap bg-[#181311]/60 p-2.5 rounded-xl border border-[#C9A66B]/20 backdrop-blur-xs">
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
                          <span key={idx} className="text-xs font-semibold px-2 py-0.5 rounded bg-[#C9A66B]/15 border border-[#C9A66B]/40 text-[#E6C88B] flex items-center gap-1 shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#E6C88B]" />
                            {badge.label}
                          </span>
                        );
                      })}

                      <span className="text-xs text-[#B8AA96] truncate" title={summaryStatus.summaryText}>
                        {summaryStatus.summaryText}
                      </span>
                    </div>

                    <button
                      onClick={() => setDetailTab('audit')}
                      className="text-xs font-semibold text-[#E6C88B] hover:text-[#F2E9D8] flex items-center gap-1 shrink-0 cursor-pointer min-h-[32px] px-2 py-1 rounded-lg hover:bg-[#261C19] transition-colors"
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
                    className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#F2E9D8] bg-[#B8342B] hover:bg-[#A32D25] rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap min-h-[40px] shadow-xs cursor-pointer"
                    title="Chuyển sang tab Thử thay đổi để khám phá các kịch bản What-If trên bản phối này"
                  >
                    <span>Thử thay đổi cho bản phối này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenLookbookCard(currentProposal)}
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-[#F2E9D8] bg-[#261C19]/80 border border-[#C9A66B]/30 hover:bg-[#322521] rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap min-h-[40px] cursor-pointer backdrop-blur-xs"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Thẻ Lookbook</span>
                  </button>
                </div>
              </div>

              {/* Scannable At-a-Glance Spec Bar: Instant 3-second read of key design & heritage attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#181311]/75 border border-[#C9A66B]/20 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8C7E6C] block">Cấu trúc / Phom</span>
                  <span className="font-semibold text-[#F2E9D8] truncate block" title={`${currentProposal.visual_details.collar_style} · ${currentProposal.visual_details.sleeve_style}`}>
                    {currentProposal.visual_details.collar_style}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8C7E6C] block">Bảng màu chính</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {currentProposal.visual_details.color_palette.slice(0, 3).map((color, i) => {
                      const hexMatch = color.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
                      return (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block shrink-0"
                          style={{ backgroundColor: hexMatch ? hexMatch[0] : '#C9A66B' }}
                          title={color}
                        />
                      );
                    })}
                    <span className="text-[11px] text-[#B8AA96] truncate">
                      {currentProposal.visual_details.color_palette[0]?.split('(')[0]?.trim() || 'Phối tone'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8C7E6C] block">Phụ kiện & Dưới</span>
                  <span className="font-semibold text-[#F2E9D8] truncate block" title={`${currentProposal.visual_details.bottom_garment} · ${currentProposal.visual_details.footwear}`}>
                    {currentProposal.visual_details.bottom_garment}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8C7E6C] block">Dịp mặc đề xuất</span>
                  <span className="font-semibold text-[#E6C88B] truncate block" title={currentProposal.stylist_notes.occasions?.join(', ') || currentProposal.concept_tag}>
                    {currentProposal.stylist_notes.occasions?.[0] || currentProposal.concept_tag || 'Dạo phố / Sự kiện'}
                  </span>
                </div>
              </div>

              {/* Garment Visual Canvas Viewport */}
              <div className="rounded-xl overflow-hidden border border-[#C9A66B]/25">
                <GarmentSchematic
                  garment={currentProposal.garment_type}
                  visualDetails={currentProposal.visual_details}
                  dialLevel={currentProposal.dial_level}
                  isOpenFront={currentProposal.garment_type === 'ao_tac' && currentProposal.dial_level >= 3}
                />
                <div className="bg-[#181311]/70 px-4 py-2 border-t border-[#C9A66B]/15 text-center text-xs text-[#8C7E6C] backdrop-blur-xs">
                  Khám phá cấu trúc trang phục · Sơ đồ hình họa tương tác (Minh họa quy thức, không phải bản rập may hoặc ảnh chụp)
                </div>
              </div>

              {/* Detail Tabs Switcher: Styling vs Cultural Reference */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#C9A66B]/20 pb-2">
                  <button
                    onClick={() => setDetailTab('styling')}
                    className={`text-xs sm:text-sm font-semibold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer min-h-[38px] ${
                      detailTab === 'styling'
                        ? 'bg-[#2E201B]/90 text-[#E6C88B] border border-[#C9A66B]/50'
                        : 'text-[#B8AA96] hover:text-[#F2E9D8]'
                    }`}
                  >
                    Chi tiết phối đồ & Stylist
                  </button>

                  <button
                    onClick={() => setDetailTab('audit')}
                    className={`text-xs sm:text-sm font-semibold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                      detailTab === 'audit'
                        ? 'bg-[#2E201B]/90 text-[#E6C88B] border border-[#C9A66B]/50'
                        : 'text-[#B8AA96] hover:text-[#F2E9D8]'
                    }`}
                  >
                    <span>Tham chiếu văn hóa</span>
                    <span className={`w-2 h-2 rounded-full ${
                      currentProposal.audit.status === 'Supported' && !currentProposal.audit.uncertainty_flag
                        ? 'bg-[#43B6A4]'
                        : currentProposal.audit.status === 'Supported with Caution'
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#B8342B]'
                    }`} />
                  </button>
                </div>

                {/* Tab Content: Styling Architecture */}
                {detailTab === 'styling' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Garment Pieces Specification */}
                      <div className="bg-[#181311]/60 p-4 rounded-xl border border-[#C9A66B]/20 space-y-3 backdrop-blur-xs">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#C9A66B] font-semibold block">
                          Cấu trúc y phục chính
                        </span>

                        <div className="space-y-2 text-xs sm:text-sm">
                          <div>
                            <span className="text-[#8C7E6C] block text-[11px] uppercase">Cổ áo & Khuy cài</span>
                            <span className="font-medium text-[#F2E9D8]">{currentProposal.visual_details.collar_style}</span>
                          </div>
                          <div>
                            <span className="text-[#8C7E6C] block text-[11px] uppercase">Quy thức vạt áo</span>
                            <span className="font-medium text-[#F2E9D8]">{currentProposal.visual_details.lapel_side}</span>
                          </div>
                          <div>
                            <span className="text-[#8C7E6C] block text-[11px] uppercase">Dáng tay áo</span>
                            <span className="font-medium text-[#F2E9D8]">{currentProposal.visual_details.sleeve_style}</span>
                          </div>
                          <div>
                            <span className="text-[#8C7E6C] block text-[11px] uppercase">Chiều dài tà áo</span>
                            <span className="font-medium text-[#F2E9D8]">{currentProposal.visual_details.cut_length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Modern Mix & Match Breakdown */}
                      <div className="bg-[#181311]/60 p-4 rounded-xl border border-[#C9A66B]/20 space-y-3 backdrop-blur-xs">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#C9A66B] font-semibold block">
                          Phối cùng phụ kiện & giày
                        </span>

                        <div className="space-y-2 text-xs sm:text-sm">
                          <div>
                            <span className="text-[#8C7E6C] block text-[11px] uppercase">Trang phục dưới (Quần / Váy)</span>
                            <span className="font-medium text-[#F2E9D8]">{currentProposal.visual_details.bottom_garment}</span>
                          </div>
                          <div>
                            <span className="text-[#8C7E6C] block text-[11px] uppercase">Giày dép đề xuất</span>
                            <span className="font-medium text-[#F2E9D8]">{currentProposal.visual_details.footwear}</span>
                          </div>
                          <div>
                            <span className="text-[#8C7E6C] block text-[11px] uppercase">Lớp áo trong</span>
                            <span className="font-medium text-[#F2E9D8]">{currentProposal.visual_details.layering_pieces?.join(', ') || 'Áo thun lót mộc'}</span>
                          </div>
                          <div>
                            <span className="text-[#8C7E6C] block text-[11px] uppercase mb-1">Bảng màu chính (Màu thực tế)</span>
                            {/* Visual Color Swatches with Actual Colors & Labels */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {currentProposal.visual_details.color_palette.map((color, i) =>
                                renderColorSwatch(color, i)
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stylist Notes Box */}
                    <div className="bg-[#181311]/60 p-4 sm:p-5 rounded-xl border border-[#C9A66B]/20 space-y-2.5 backdrop-blur-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#C9A66B] font-semibold">
                          Lời khuyên từ Stylist đương đại
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-[#F2E9D8] leading-relaxed font-serif italic">
                        "{currentProposal.stylist_notes.philosophy}"
                      </p>

                      <div className="pt-2 border-t border-[#C9A66B]/15 space-y-1">
                        <span className="text-xs font-semibold text-[#B8AA96]">Mẹo mặc đẹp cho Gen Z:</span>
                        <ul className="list-disc list-inside text-xs sm:text-sm text-[#B8AA96] space-y-1 pl-1">
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
