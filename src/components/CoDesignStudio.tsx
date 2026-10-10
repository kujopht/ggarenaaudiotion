import React, { useState, useEffect, useRef } from 'react';
import { GarmentKey, OutfitProposal, LookImageData, proposalToDesignState } from '../types/vietphuc';
import { CulturalAuditPanel } from './CulturalAuditPanel';
import { formatSourceBadge, getLookSummaryStatus } from '../utils/remixStateHelpers';
import { DongSonDialRing } from './MotionMotifs';
import { FashionEditorialVisual } from './FashionEditorialVisual';
import { QuickCompareSection } from './QuickCompareSection';
import { SideBySideCompareModal } from './SideBySideCompareModal';
import { MannequinFigure2D } from './MannequinFigure2D';
import { WeatherAdvisorCard } from './WeatherAdvisorCard';
import { ColorHarmonyMeter } from './ColorHarmonyMeter';
import { OutfitProposalSkeleton } from './OutfitProposalSkeleton';
import { ProposalErrorBoundary } from './ProposalErrorBoundary';
import { generateDeterministicProposals } from '../utils/deterministicEngines';
import { Sparkles, Sliders, Share2, Wand2, ArrowRight, ChevronDown, ChevronUp, Shirt, AlertTriangle, ShieldCheck, HelpCircle, Info, Columns, User, Image as ImageIcon, Play, History } from 'lucide-react';

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
  colorPreference?: string;
  onChangeColorPreference?: (c: string) => void;
  accessoryPreference?: string;
  onChangeAccessoryPreference?: (a: string) => void;
  customNotes: string;
  onChangeCustomNotes: (n: string) => void;
  onOpenCKB: (evidenceId?: string) => void;
  onOpenLookbookCard: (proposal: OutfitProposal) => void;
  onNavigateToWhatIf: () => void;
  onNavigateToAnatomy?: () => void;
  onOpenHistory?: () => void;
  motionEnabled?: boolean;
  onRunDemo?: () => void;
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

const COLOR_PREFERENCE_OPTIONS = [
  { id: 'auto', label: 'Tự đề xuất', swatch: '#8C7E6C' },
  { id: 'Chàm', label: 'Chàm', swatch: '#1E293B' },
  { id: 'Đen', label: 'Đen', swatch: '#0F172A' },
  { id: 'Ngà', label: 'Ngà', swatch: '#FDFBF7' },
  { id: 'Đỏ son', label: 'Đỏ son', swatch: '#B8342B' },
];

const ACCESSORY_PREFERENCE_OPTIONS = [
  { id: 'auto', label: 'Tự đề xuất' },
  { id: 'Tối giản', label: 'Tối giản' },
  { id: 'Túi hiện đại', label: 'Túi hiện đại' },
  { id: 'Trang sức', label: 'Trang sức' },
  { id: 'Khăn', label: 'Khăn' },
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
  colorPreference = 'auto',
  onChangeColorPreference,
  accessoryPreference = 'auto',
  onChangeAccessoryPreference,
  customNotes,
  onChangeCustomNotes,
  onOpenCKB,
  onOpenLookbookCard,
  onNavigateToWhatIf,
  onNavigateToAnatomy,
  onOpenHistory,
  motionEnabled = true,
  onRunDemo,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detailTab, setDetailTab] = useState<'styling' | 'audit'>('styling');
  const [showAdvancedNotes, setShowAdvancedNotes] = useState<boolean>(false);
  const [expandedGarmentKey, setExpandedGarmentKey] = useState<GarmentKey | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // V2.0 Visual-First Image Generation State & Card Collapses
  const [lookImages, setLookImages] = useState<Record<string, LookImageData>>({});
  const [expandedCardDetails, setExpandedCardDetails] = useState<Record<string, boolean>>({});

  // Feature 1: Side by Side Compare Modal state
  const [isSideBySideOpen, setIsSideBySideOpen] = useState<boolean>(false);

  // Feature 2: Visual Mode Switcher (Editorial vs Mannequin 2D) per card
  const [visualModes, setVisualModes] = useState<Record<string, 'editorial' | 'mannequin'>>({});

  const toggleVisualMode = (id: string, mode: 'editorial' | 'mannequin') => {
    setVisualModes((prev) => ({ ...prev, [id]: mode }));
  };

  const handleApplyWeatherRecommendation = (materialTip: string, suggestedStyle?: string) => {
    if (suggestedStyle) {
      onChangeStyle(suggestedStyle);
    }
    if (materialTip) {
      onChangeCustomNotes(customNotes ? `${customNotes}, Vải: ${materialTip}` : `Vải: ${materialTip}`);
    }
  };

  const toggleCardDetails = (id: string) => {
    setExpandedCardDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleTriggerImageGeneration = async (proposal: OutfitProposal) => {
    setLookImages((prev) => ({
      ...prev,
      [proposal.id]: { status: 'image_generating' },
    }));

    try {
      const designState = proposalToDesignState(proposal);
      const res = await fetch('/api/remix/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designState,
          garment: proposal.garment_type,
          visualDescription: `${proposal.visual_details.collar_style}, ${proposal.visual_details.sleeve_style}, ${proposal.visual_details.cut_length}`,
          palette: proposal.visual_details.color_palette,
          materials: proposal.visual_details.fabric_materials,
          aspectRatio: '3:4',
        }),
      });

      if (!res.ok) throw new Error(`Máy chủ phản hồi mã lỗi ${res.status}`);
      const data = await res.json();
      setLookImages((prev) => ({
        ...prev,
        [proposal.id]: {
          status: data.status || 'image_unavailable',
          imageUrl: data.imageUrl,
          generationSource: data.generationSource || 'server_foundation',
          message: data.message,
        },
      }));
    } catch (err: any) {
      setLookImages((prev) => ({
        ...prev,
        [proposal.id]: {
          status: 'image_unavailable',
          errorMessage: err.message,
        },
      }));
    }
  };

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

    let isTimedOut = false;
    const timeoutId = setTimeout(() => {
      isTimedOut = true;
      controller.abort();
    }, 45000);

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
          color_preference: colorPreference,
          accessory_preference: accessoryPreference,
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Máy chủ phản hồi mã lỗi ${res.status}`);
      }

      const data = await res.json();

      // Check if this request is still the active one and garment has not changed
      if (
        (controller.signal.aborted && !isTimedOut) ||
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
      clearTimeout(timeoutId);
      if ((err.name === 'AbortError' || controller.signal.aborted) && !isTimedOut) {
        return;
      }
      if (reqId === activeReqIdRef.current && activeGarmentRef.current === targetGarment) {
        console.warn('API call failed, timed out, or network offline, activating local CKB engine fallback:', err);
        // Automatic fallback to local CKB Deterministic Engine (Feature 7)
        try {
          const fallbackProposals = generateDeterministicProposals(
            targetGarment,
            context,
            style,
            dialLevel,
            colorPreference,
            accessoryPreference
          );
          if (fallbackProposals && fallbackProposals.length > 0) {
            onUpdateProposals(fallbackProposals, 'deterministic_engine_fallback');
            setErrorMsg(null);
            return;
          }
        } catch (fallbackErr) {
          console.error('Fallback generation error:', fallbackErr);
        }
        setErrorMsg(isTimedOut ? 'Quá thời gian chờ phản hồi (45s). Hệ thống đã tự động chuyển sang chế độ dự phòng.' : (err.message || 'Lỗi kết nối khi phối đồ.'));
      }
    } finally {
      clearTimeout(timeoutId);
      if (reqId === activeReqIdRef.current) {
        setLoading(false);
      }
    }
  };

  const currentProposal = proposals[selectedPlanIndex] || null;

  // Share-link copied feedback
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const shareTimerRef = useRef<number | null>(null);
  const handleCopyShareLink = async () => {
    if (!currentProposal) return;
    const { encodeShareLink, copyTextToClipboard } = await import('../utils/shareLink');
    const url = encodeShareLink({ garment: selectedGarment, context, style, dialLevel, colorPreference, accessoryPreference, proposal: currentProposal, source: proposalSource || 'shared_link' });
    if (url && (await copyTextToClipboard(url))) { setShareCopied(true); if (shareTimerRef.current) window.clearTimeout(shareTimerRef.current); shareTimerRef.current = window.setTimeout(() => setShareCopied(false), 2200); }
  };
  // Ctrl/Cmd + Enter anywhere in the studio = generate (skips when typing in inputs)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const t = e.target as HTMLElement | null;
        const tag = t?.tagName;
        if (tag === 'TEXTAREA' || tag === 'INPUT') return;
        e.preventDefault();
        handleGenerateOutfits();
      }
    };
    const root = document.getElementById('studio-workspace');
    root?.addEventListener('keydown', onKeyDown);
    return () => root?.removeEventListener('keydown', onKeyDown);
  }, [loading, selectedGarment, context, style, dialLevel, colorPreference, accessoryPreference, customNotes]);

  // Helper to map color & accessory preferences to MannequinFigure2D props
  const getMannequinColor = () => {
    if (colorPreference === 'Chàm') return '#1E293B';
    if (colorPreference === 'Đen') return '#0F172A';
    if (colorPreference === 'Ngà') return '#FDFBF7';
    if (colorPreference === 'Đỏ son') return '#B8342B';
    if (currentProposal?.visual_details.color_palette?.[0]) {
      const hexMatch = currentProposal.visual_details.color_palette[0].match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
      if (hexMatch) return hexMatch[0];
    }
    return '#1E293B';
  };

  const getMannequinAccessory = (): 'none' | 'khan' | 'non' | 'tui' | 'all' => {
    if (accessoryPreference === 'Túi hiện đại') return 'tui';
    if (accessoryPreference === 'Khăn') return 'khan';
    if (accessoryPreference === 'Trang sức') return 'all';
    if (accessoryPreference === 'Tối giản') return 'none';
    return 'none';
  };

  const activePalette = (currentProposal?.visual_details.color_palette && currentProposal.visual_details.color_palette.length > 0)
    ? currentProposal.visual_details.color_palette
    : (
        colorPreference === 'Chàm' ? ['#1E293B (Chàm Đậm)', '#FDFBF7 (Trắng Ngà)', '#C9A66B (Vàng Đồng)'] :
        colorPreference === 'Đen' ? ['#0F172A (Đen Tuyền)', '#FDFBF7 (Trắng Ngà)', '#B8342B (Đỏ Son)'] :
        colorPreference === 'Ngà' ? ['#FDFBF7 (Trắng Ngà)', '#C9A66B (Vàng Mộc)', '#1E293B (Chàm)'] :
        colorPreference === 'Đỏ son' ? ['#B8342B (Đỏ Son)', '#FDFBF7 (Trắng Ngà)', '#E6C88B (Vàng Đồng)'] :
        ['#1E293B (Chàm)', '#FDFBF7 (Trắng Ngà)', '#C9A66B (Hoàng Yến)']
      );

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
        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-600/50 shadow-xs">
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

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          {onOpenHistory && (
            <button onClick={onOpenHistory} title="Xem lịch sử các bản phối đã tạo" className="text-xs font-medium text-[#E6C88B] hover:text-[#F2E9D8] bg-[#261C19]/80 hover:bg-[#322521] border border-[#C9A66B]/30 px-3.5 py-2 rounded-xl transition-colors cursor-pointer min-h-[40px] flex items-center gap-1.5 backdrop-blur-xs">
              <History className="w-3.5 h-3.5" />
              <span>Lịch sử</span>
            </button>
          )}
          {currentProposal && (
            <button onClick={handleCopyShareLink} title="Sao chép link chia sẻ bản phối đang xem" className="text-xs font-medium text-[#E6C88B] hover:text-[#F2E9D8] bg-[#261C19]/80 hover:bg-[#322521] border border-[#C9A66B]/30 px-3.5 py-2 rounded-xl transition-colors cursor-pointer min-h-[40px] flex items-center gap-1.5 backdrop-blur-xs">
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareCopied ? 'Đã sao chép!' : 'Chia sẻ link'}</span>
            </button>
          )}
          <button onClick={() => onOpenCKB()} className="text-xs font-medium text-[#E6C88B] hover:text-[#F2E9D8] bg-[#261C19]/80 hover:bg-[#322521] border border-[#C9A66B]/30 px-3.5 py-2 rounded-xl transition-colors cursor-pointer min-h-[40px] flex items-center gap-1.5 backdrop-blur-xs">
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
                  Ngũ Thân Indigo (Mức 3)
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
                  Áo Tấc Duster Coat (Mức 4)
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
                  Nhật Bình Linen (Mức 2)
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

              {/* Feature 4: Gợi ý trang phục theo thời tiết (Open-Meteo) */}
              <div className="pt-1">
                <WeatherAdvisorCard onApplyRecommendation={handleApplyWeatherRecommendation} />
              </div>
            </div>

            {/* 3. Màu chủ đạo & Phụ kiện */}
            <div className="space-y-3 pt-2 border-t border-[#C9A66B]/15">
              {/* Color preference */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#B8AA96] block mb-1.5">
                  Màu chủ đạo
                </label>
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {COLOR_PREFERENCE_OPTIONS.map((c) => {
                    const isSelected = (colorPreference || 'auto') === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => onChangeColorPreference?.(c.id)}
                        className={`py-1.5 px-1 rounded-lg border transition-all flex flex-col items-center gap-1 cursor-pointer min-h-[40px] ${
                          isSelected
                            ? 'border-[#C9A66B] bg-[#C9A66B]/25 text-[#E6C88B] font-semibold ring-1 ring-[#C9A66B]/40'
                            : 'border-[#C9A66B]/15 bg-[#181311]/50 text-[#B8AA96] hover:border-[#C9A66B]/30'
                        }`}
                        title={c.label}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
                          style={{ backgroundColor: c.swatch }}
                        />
                        <span className="text-[10px] truncate max-w-full">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accessory preference */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#B8AA96] block mb-1.5">
                  Phụ kiện
                </label>
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {ACCESSORY_PREFERENCE_OPTIONS.map((a) => {
                    const isSelected = (accessoryPreference || 'auto') === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => onChangeAccessoryPreference?.(a.id)}
                        className={`py-1.5 px-0.5 rounded-lg border transition-all flex items-center justify-center text-center cursor-pointer min-h-[40px] ${
                          isSelected
                            ? 'border-[#C9A66B] bg-[#C9A66B]/25 text-[#E6C88B] font-semibold ring-1 ring-[#C9A66B]/40'
                            : 'border-[#C9A66B]/15 bg-[#181311]/50 text-[#B8AA96] hover:border-[#C9A66B]/30'
                        }`}
                        title={a.label}
                      >
                        <span className="text-[10px] truncate max-w-full leading-tight">{a.label}</span>
                      </button>
                    );
                  })}
                </div>
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

        {/* Right Column: Visual-First Dual Proposal Presentation (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <ProposalErrorBoundary onReset={handleGenerateOutfits}>
            {/* Loading Skeleton during generation (Feature 7) */}
            {loading && (
              <OutfitProposalSkeleton count={2} message="Đang kết nối CKB và đồng sáng tạo 2 bản phối..." />
            )}

            {/* Empty State when no proposals generated yet */}
            {proposals.length === 0 && !loading && (
              <div className="space-y-4">
                {colorPreference !== 'auto' && (
                  <ColorHarmonyMeter colors={activePalette} />
                )}
                <div className="lacquer-panel border-2 border-dashed border-[#C9A66B]/30 rounded-2xl p-8 sm:p-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#261C19]/80 flex items-center justify-center mx-auto text-[#C9A66B] border border-[#C9A66B]/30 shadow-xs">
                    <Shirt className="w-7 h-7" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F2E9D8]">
                      Chưa có bản phối nào cho {GARMENTS.find(g => g.key === selectedGarment)?.name}
                    </h3>
                    <p className="text-sm text-[#B8AA96] leading-relaxed">
                      Hãy chọn mức độ biến tấu bên trái và bấm nút <strong className="text-[#E6C88B]">"Tạo bản phối"</strong> để xem 2 phương án thiết kế độc đáo kèm ảnh phác thảo thời trang, tư vấn stylist và thẩm định di sản CKB.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button
                      onClick={handleGenerateOutfits}
                      className="px-5 py-2.5 bg-[#B8342B] hover:bg-[#A32D25] text-[#F2E9D8] text-sm font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer min-h-[44px]"
                    >
                      <Wand2 className="w-4 h-4 text-[#F5DCA3]" />
                      <span>Tạo 2 bản phối ngay</span>
                    </button>
                    {onRunDemo && (
                      <button
                        type="button"
                        onClick={onRunDemo}
                        className="px-4 py-2.5 bg-[#261C19] hover:bg-[#342621] border border-[#C9A66B]/40 text-[#E6C88B] text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer min-h-[44px]"
                      >
                        <Play className="w-4 h-4 text-[#E6C88B] fill-[#E6C88B]" />
                        <span>▶ Chạy demo mẫu (30s)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* V2.0 Visual-First Design Studio: Dual Proposal Editorial Board */}
            {proposals.length > 0 && !loading && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Header Strip with Section Title & Provenance Badge & Compare Button (Feature 1) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#C9A66B]/20 gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A66B] font-bold">
                      BỘ ĐÔI THIẾT KẾ ĐỐI DIỆN · HERITAGE & CONTEMPORARY
                    </span>
                    <p className="text-xs text-[#B8AA96]">
                      Hai phương án đồng thời: Bản phối A bám sát di sản & Bản phối B phá cách đương đại
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
                    {proposals.length >= 2 && (
                      <button
                        type="button"
                        onClick={() => setIsSideBySideOpen(true)}
                        className="px-3.5 py-1.5 bg-[#C9A66B]/25 hover:bg-[#C9A66B]/40 border border-[#C9A66B] text-[#F2E9D8] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm min-h-[34px]"
                        title="Mở màn hình so sánh song hành 2 bản phối A vs B"
                      >
                        <Columns className="w-3.5 h-3.5 text-[#E6C88B]" />
                        <span>So sánh cạnh nhau</span>
                      </button>
                    )}
                    {renderSourceBadge()}
                  </div>
                </div>

                {/* Feature 2: Interactive 2D Mannequin Figure & Color Harmony Meter in Results Area */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                  {/* 2D Mannequin Figure Preview */}
                  <div className="md:col-span-6 lg:col-span-5 lacquer-panel-subtle rounded-2xl p-4 border border-[#C9A66B]/25 flex flex-col items-center justify-between bg-[#191310]/80 backdrop-blur-xs shadow-sm">
                    <div className="w-full flex items-center justify-between pb-2 border-b border-[#C9A66B]/15">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A66B] font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#E6C88B]" />
                        Figure Mặc Thử Trực Quan 2D
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2C211D] border border-[#C9A66B]/30 text-[#E6C88B]">
                        {GARMENTS.find((g) => g.key === selectedGarment)?.name}
                      </span>
                    </div>

                    <div className="py-2 flex items-center justify-center w-full">
                      <MannequinFigure2D
                        garment={selectedGarment}
                        garmentColor={getMannequinColor()}
                        bottomType={selectedGarment === 'nhat_binh' ? 'skirt' : 'pant'}
                        bottomColor="#F1F5F9"
                        accessory={getMannequinAccessory()}
                        accessoryColor="#C9A66B"
                        height={230}
                        className="w-full max-w-[200px]"
                      />
                    </div>

                    <div className="w-full pt-2 border-t border-[#C9A66B]/15 flex items-center justify-between text-[11px] text-[#B8AA96]">
                      <span className="truncate">
                        Màu: <strong className="text-[#E6C88B]">{colorPreference === 'auto' ? 'Tự đề xuất' : colorPreference}</strong>
                      </span>
                      <span className="truncate">
                        Phụ kiện: <strong className="text-[#E6C88B]">{accessoryPreference === 'auto' ? 'Mặc định' : accessoryPreference}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Color Harmony Meter */}
                  <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-center">
                    <ColorHarmonyMeter colors={activePalette} className="h-full flex flex-col justify-between" />
                  </div>
                </div>

                {/* Side-by-side Dual Proposal Grid: Desktop 2 cols, Tablet 2 cols, Mobile 1 col (stacked, visual on top) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 items-start">
                {proposals.map((prop, idx) => {
                  const isActive = selectedPlanIndex === idx;
                  const isExpanded = !!expandedCardDetails[prop.id];
                  const summary = getLookSummaryStatus(prop.audit);

                  return (
                    <div
                      key={prop.id}
                      className={`lacquer-card-elevated rounded-2xl p-4 sm:p-5 flex flex-col space-y-4 border transition-all duration-300 relative ${
                        isActive
                          ? "border-[#C9A66B] ring-1 ring-[#C9A66B]/40 shadow-lg"
                          : "border-[#C9A66B]/20 hover:border-[#C9A66B]/40"
                      }`}
                    >
                      {/* 1. Header: Plan Type Badge, Selection Status, Title, Concept Tag */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              idx === 0
                                ? "bg-[#C9A66B]/15 border-[#C9A66B]/40 text-[#E6C88B]"
                                : "bg-[#B8342B]/20 border-[#B8342B]/50 text-[#F5A39D]"
                            }`}
                          >
                            {idx === 0 ? "BẢN PHỐI A · HERITAGE" : `BẢN PHỐI B · CONTEMPORARY (LV${prop.dial_level})`}
                          </span>

                          <button
                            type="button"
                            onClick={() => onSelectPlanIndex(idx)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer min-h-[30px] ${
                              isActive
                                ? "bg-[#E6C88B]/20 border-[#E6C88B] text-[#F2E9D8]"
                                : "bg-[#181311]/60 border-[#C9A66B]/20 text-[#8C7E6C] hover:text-[#B8AA96]"
                            }`}
                            title="Chọn bản phối này làm bản phối trọng tâm"
                          >
                            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-[#E6C88B] animate-pulse" : "bg-[#6E5D53]"}`} />
                            <span>{isActive ? "Đang chọn" : "Chọn look này"}</span>
                          </button>
                        </div>

                        <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F2E9D8] leading-snug line-clamp-2" title={prop.title}>
                          {prop.title}
                        </h3>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-[#C9A66B] uppercase tracking-wider">
                            {prop.concept_tag}
                          </span>
                        </div>
                      </div>

                      {/* 2. Visual Area: Large Editorial Fashion Hero Canvas */}
                      <FashionEditorialVisual
                        garment={prop.garment_type}
                        planType={prop.plan_type}
                        dialLevel={prop.dial_level}
                        conceptTag={prop.concept_tag}
                        colorPalette={prop.visual_details.color_palette}
                        fabricMaterials={prop.visual_details.fabric_materials}
                        imageData={lookImages[prop.id]}
                        onTriggerImageGeneration={() => handleTriggerImageGeneration(prop)}
                        onOpenStructuralReference={onNavigateToAnatomy}
                      />

                      {/* 3. Scannable Palette & Materials Row */}
                      <div className="space-y-2 pt-1 border-t border-[#C9A66B]/15 text-xs">
                        {/* Palette */}
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E6C] block mb-1">
                            Bảng màu chính
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {prop.visual_details.color_palette.map((color, i) => {
                              const hexMatch = color.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
                              const hex = hexMatch ? hexMatch[0] : "#C9A66B";
                              const label = color.replace(hex, "").trim() || hex;
                              return (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#181311]/70 border border-[#C9A66B]/20 text-[11px] text-[#D4C7B4]"
                                >
                                  <span
                                    className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
                                    style={{ backgroundColor: hex }}
                                  />
                                  <span className="truncate max-w-[80px]">{label}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Materials */}
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E6C] block mb-1">
                            Chất liệu may mặc
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {prop.visual_details.fabric_materials.map((mat, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-[#241A16]/80 border border-[#C9A66B]/25 text-[11px] text-[#E6C88B] font-medium"
                              >
                                {mat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 4. Cultural Audit Summary Strip */}
                      <div className="bg-[#181311]/80 p-3 rounded-xl border border-[#C9A66B]/20 space-y-2 text-xs backdrop-blur-xs">
                        {/* Quick Scan Badges: Prototype compliance, Historical confidence, Evidence count, Caution count */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Prototype compliance */}
                            {prop.audit.prototype_compliance === 'compliant' ? (
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                Tuân thủ Prototype
                              </span>
                            ) : prop.audit.prototype_compliance === 'conflict' ? (
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-rose-400" />
                                Xung đột Prototype
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800/80 border border-slate-600/40 text-[#D4C7B4] flex items-center gap-1">
                                <HelpCircle className="w-3 h-3 text-[#B8AA96]" />
                                Chưa xác định
                              </span>
                            )}

                            {/* Historical confidence */}
                            {prop.audit.historical_confidence === 'verified' && (
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#C9A66B]/15 border border-[#C9A66B]/40 text-[#E6C88B] flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-[#E6C88B]" />
                                Sử liệu: Đã kiểm chứng
                              </span>
                            )}
                            {prop.audit.historical_confidence === 'partially_verified' && (
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#43B6A4]/15 border border-[#43B6A4]/40 text-[#43B6A4] flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-[#43B6A4]" />
                                Sử liệu: Đã xác thực một phần
                              </span>
                            )}
                            {prop.audit.historical_confidence === 'needs_review' && (
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-950/50 border border-amber-600/40 text-amber-200 flex items-center gap-1">
                                <HelpCircle className="w-3 h-3 text-amber-300" />
                                Sử liệu: Đang chờ đối soát
                              </span>
                            )}
                            {prop.audit.historical_confidence === 'unverified' && (
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-950/50 border border-amber-600/40 text-amber-200 flex items-center gap-1">
                                <HelpCircle className="w-3 h-3 text-amber-300" />
                                Sử liệu: Chưa đối soát độc lập
                              </span>
                            )}
                            {prop.audit.historical_confidence === 'mixed' && (
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800/80 border border-slate-600/40 text-[#D4C7B4] flex items-center gap-1">
                                <HelpCircle className="w-3 h-3 text-[#B8AA96]" />
                                Sử liệu: Nguồn hỗn hợp
                              </span>
                            )}

                            {/* Evidence Count */}
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#211815] border border-[#C9A66B]/25 text-[#D4C7B4]">
                              {prop.audit.evidence_ids.length} CKB IDs
                            </span>

                            {/* Caution count if any */}
                            {prop.audit.cautions_and_redlines && prop.audit.cautions_and_redlines.length > 0 && (
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                {prop.audit.cautions_and_redlines.length} lưu ý
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => onOpenCKB(prop.audit.evidence_ids[0])}
                            className="text-[11px] font-semibold text-[#E6C88B] hover:text-[#F2E9D8] flex items-center gap-1 cursor-pointer min-h-[26px] ml-auto shrink-0"
                          >
                            <span>Xem CKB</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        <p className="text-[11px] text-[#B8AA96] leading-relaxed line-clamp-2" title={summary.summaryText}>
                          {summary.summaryText}
                        </p>
                      </div>

                      {/* 5. Expandable Details (Text details moved down into clean collapse) */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => toggleCardDetails(prop.id)}
                          className="w-full py-2 px-3 bg-[#181311]/60 hover:bg-[#261C19] border border-[#C9A66B]/20 rounded-xl text-xs font-semibold text-[#D4C7B4] hover:text-[#F2E9D8] flex items-center justify-between transition-colors cursor-pointer min-h-[36px]"
                        >
                          <span>{isExpanded ? "Thu gọn chi tiết may đo" : "Chi tiết thiết kế, phụ kiện & thẩm định"}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-[#C9A66B]" /> : <ChevronDown className="w-4 h-4 text-[#C9A66B]" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-3 space-y-3 animate-in fade-in duration-200 text-xs">
                            {/* Garment anatomy breakdown */}
                            <div className="p-3 bg-[#181311]/70 border border-[#C9A66B]/15 rounded-xl space-y-2">
                              <span className="font-mono text-[10px] text-[#C9A66B] uppercase block font-bold">
                                Quy thức cấu trúc & Phối layer
                              </span>
                              <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div>
                                  <span className="text-[#8C7E6C] block">Cổ áo & Khuy:</span>
                                  <span className="text-[#F2E9D8] font-medium">{prop.visual_details.collar_style}</span>
                                </div>
                                <div>
                                  <span className="text-[#8C7E6C] block">Vạt & Cài:</span>
                                  <span className="text-[#F2E9D8] font-medium">{prop.visual_details.lapel_side}</span>
                                </div>
                                <div>
                                  <span className="text-[#8C7E6C] block">Dáng tay:</span>
                                  <span className="text-[#F2E9D8] font-medium">{prop.visual_details.sleeve_style}</span>
                                </div>
                                <div>
                                  <span className="text-[#8C7E6C] block">Chiều dài tà:</span>
                                  <span className="text-[#F2E9D8] font-medium">{prop.visual_details.cut_length}</span>
                                </div>
                                <div>
                                  <span className="text-[#8C7E6C] block">Quần / Chân váy:</span>
                                  <span className="text-[#F2E9D8] font-medium">{prop.visual_details.bottom_garment}</span>
                                </div>
                                <div>
                                  <span className="text-[#8C7E6C] block">Giày dép:</span>
                                  <span className="text-[#F2E9D8] font-medium">{prop.visual_details.footwear}</span>
                                </div>
                              </div>
                            </div>

                            {/* Stylist Notes */}
                            <div className="p-3 bg-[#181311]/70 border border-[#C9A66B]/15 rounded-xl space-y-2">
                              <span className="font-mono text-[10px] text-[#C9A66B] uppercase block font-bold">
                                Triết lý Stylist & Mẹo Gen Z
                              </span>
                              <p className="text-[11px] text-[#F2E9D8] font-serif italic">
                                "{prop.stylist_notes.philosophy}"
                              </p>
                              <ul className="list-disc list-inside text-[11px] text-[#B8AA96] space-y-1">
                                {prop.stylist_notes.gen_z_tips.map((tip, tIdx) => (
                                  <li key={tIdx}>{tip}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Full Cultural Audit Panel component */}
                            <div className="pt-1">
                              <CulturalAuditPanel audit={prop.audit} onOpenCKB={onOpenCKB} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 6. Card Action Buttons (Edit Look, Open Cultural Audit, Open Lookbook) */}
                      <div className="pt-2 border-t border-[#C9A66B]/20 grid grid-cols-3 gap-2 mt-auto">
                        {/* Edit Look: Selects this look and navigates to What-If */}
                        <button
                          type="button"
                          onClick={() => {
                            onSelectPlanIndex(idx);
                            onNavigateToWhatIf();
                          }}
                          className="py-2 px-2 bg-[#B8342B] hover:bg-[#A32D25] text-[#F2E9D8] text-[11px] font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors min-h-[38px] shadow-xs cursor-pointer text-center"
                          title="Thử các kịch bản biến tấu What-If cho riêng bản phối này"
                        >
                          <span>Edit Look</span>
                          <ArrowRight className="w-3 h-3 shrink-0" />
                        </button>

                        {/* Open Cultural Audit */}
                        <button
                          type="button"
                          onClick={() => {
                            onSelectPlanIndex(idx);
                            toggleCardDetails(prop.id);
                          }}
                          className="py-2 px-2 bg-[#261C19]/80 hover:bg-[#322521] border border-[#C9A66B]/30 text-[#E6C88B] text-[11px] font-medium rounded-xl flex items-center justify-center gap-1 transition-colors min-h-[38px] cursor-pointer text-center"
                          title="Mở hồ sơ kiểm chứng di sản văn hóa"
                        >
                          <ShieldCheck className="w-3 h-3 text-[#E6C88B] shrink-0" />
                          <span className="truncate">Thẩm định</span>
                        </button>

                        {/* Open Lookbook Card */}
                        <button
                          type="button"
                          onClick={() => onOpenLookbookCard(prop)}
                          className="py-2 px-2 bg-[#181311]/70 hover:bg-[#261C19] border border-[#C9A66B]/25 text-[#F2E9D8] text-[11px] font-medium rounded-xl flex items-center justify-center gap-1 transition-colors min-h-[38px] cursor-pointer text-center"
                          title="Mở thẻ Lookbook thời trang cao cấp"
                        >
                          <Share2 className="w-3 h-3 text-[#C9A66B] shrink-0" />
                          <span className="truncate">Lookbook</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Compare Section for the 2 proposals */}
              <QuickCompareSection proposals={proposals} onOpenCKB={onOpenCKB} />
            </div>
          )}
          </ProposalErrorBoundary>
        </div>
      </div>
    </div>
  );
};
