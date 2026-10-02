import React, { useState } from 'react';
import { OutfitProposal } from '../types/vietphuc';
import {
  X,
  Share2,
  Check,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  FileCheck,
  Layers,
  Info,
  Smartphone,
  Square,
  Sparkles,
  ArrowRight,
  DownloadCloud,
} from 'lucide-react';
import { FashionEditorialVisual } from './FashionEditorialVisual';
import {
  LookbookFormat,
  LookbookExportResult,
  exportLookbookCard,
  formatLookbookShareText,
} from '../utils/lookbookExport';

interface LookbookCardModalProps {
  proposal: OutfitProposal | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCKB?: (evidenceId?: string) => void;
}

export const LookbookCardModal: React.FC<LookbookCardModalProps> = ({
  proposal,
  isOpen,
  onClose,
  onOpenCKB,
}) => {
  const [format, setFormat] = useState<LookbookFormat>('social_4_5');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [exportResult, setExportResult] = useState<LookbookExportResult | null>(null);

  if (!isOpen || !proposal) return null;

  const garmentLabel =
    proposal.garment_type === 'ngu_than'
      ? 'Áo Ngũ Thân tay chẽn'
      : proposal.garment_type === 'ao_tac'
      ? 'Áo Tấc lễ phục'
      : 'Áo Nhật Bình';

  const planTypeLabel =
    proposal.plan_type === 'heritage_anchored'
      ? 'Heritage Anchored'
      : 'Contemporary Remix';

  const handleShare = async () => {
    try {
      const shareText = formatLookbookShareText(proposal);
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        setCopyStatus('copied');
      } else {
        // Fallback for environments where navigator.clipboard is unavailable
        setCopyStatus('failed');
      }
    } catch {
      setCopyStatus('failed');
    }
    setTimeout(() => setCopyStatus('idle'), 2500);
  };

  const handleExportPreparation = () => {
    const result = exportLookbookCard(proposal, format);
    setExportResult(result);
    setTimeout(() => setExportResult(null), 4000);
  };

  // Prototype compliance label & styling (3 distinct states)
  const isCompliant = proposal.audit.prototype_compliance === 'compliant';
  const isConflict = proposal.audit.prototype_compliance === 'conflict';
  const prototypeLabel = isCompliant
    ? 'Tuân thủ'
    : isConflict
    ? 'Xung đột'
    : 'Chưa đánh giá';

  // Historical confidence label (5 states)
  const confidence = proposal.audit.historical_confidence;
  const historicalLabel =
    confidence === 'verified'
      ? 'Đã kiểm chứng'
      : confidence === 'partially_verified'
      ? 'Đã xác thực một phần'
      : confidence === 'needs_review'
      ? 'Đang chờ đối soát'
      : confidence === 'mixed'
      ? 'Nguồn hỗn hợp'
      : 'Chưa đối soát độc lập';

  // Up to 3 evidence IDs (no fake evidence)
  const evidenceCount = proposal.audit.evidence_ids.length;
  const previewEvidenceIds = proposal.audit.evidence_ids.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-4xl lacquer-card-elevated rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[94vh] my-auto border-2 border-[#C9A66B]/40">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 sm:px-6 py-3 border-b border-[#C9A66B]/20 bg-[#16100E]/90 gap-3 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#E6C88B] uppercase tracking-wider">
              THẺ LOOKBOOK CHIA SẺ
            </span>
            <span className="text-[#8C7E6C]">·</span>
            <span className="text-xs text-[#B8AA96]">KUJO Re:Wear</span>
          </div>

          {/* Ratio switcher & close */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            {/* Format toggle: 4:5 vs 9:16 */}
            <div className="flex items-center p-1 bg-[#120D0B] rounded-xl border border-[#C9A66B]/20">
              <button
                onClick={() => setFormat('social_4_5')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[44px] cursor-pointer ${
                  format === 'social_4_5'
                    ? 'bg-[#C9A66B]/25 text-[#E6C88B] border border-[#C9A66B]/50'
                    : 'text-[#8C7E6C] hover:text-[#D4C7B4]'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>4:5 Social</span>
              </button>
              <button
                onClick={() => setFormat('story_9_16')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[44px] cursor-pointer ${
                  format === 'story_9_16'
                    ? 'bg-[#C9A66B]/25 text-[#E6C88B] border border-[#C9A66B]/50'
                    : 'text-[#8C7E6C] hover:text-[#D4C7B4]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>9:16 Story</span>
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Đóng Lookbook"
              className="p-2 text-[#B8AA96] hover:text-[#F2E9D8] rounded-xl hover:bg-[#261C19] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-transparent hover:border-[#C9A66B]/30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two column layout on desktop */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col lg:flex-row items-center justify-center gap-6">
          {/* Card Preview Frame */}
          <div className="w-full flex justify-center items-center">
            <div
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 border-2 border-[#C9A66B]/50 shadow-2xl bg-gradient-to-b from-[#1C1411] via-[#140F0D] to-[#0D0907] flex flex-col justify-between ${
                format === 'social_4_5'
                  ? 'w-full max-w-sm sm:max-w-md aspect-[4/5] p-5 sm:p-6'
                  : 'w-full max-w-xs sm:max-w-[340px] aspect-[9/16] p-4 sm:p-5'
              }`}
            >
              {/* Card Header Branding */}
              <div className="space-y-2 border-b border-[#C9A66B]/20 pb-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold tracking-widest text-[#E6C88B] uppercase">
                    KUJO Re:Wear
                  </span>
                  <span className="text-[#8C7E6C]">
                    Mức Remix {proposal.dial_level}/5
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C9A66B]/15 text-[#E6C88B] border border-[#C9A66B]/30 font-semibold">
                    {planTypeLabel}
                  </span>
                  <span className="text-[10px] font-mono text-[#B8AA96]">
                    {garmentLabel}
                  </span>
                </div>

                <h3
                  className={`font-serif font-bold text-[#F2E9D8] leading-tight ${
                    format === 'social_4_5' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                  }`}
                >
                  {proposal.title}
                </h3>
                <p className="text-[11px] font-mono text-[#C9A66B] uppercase tracking-wider truncate">
                  {proposal.concept_tag}
                </p>
              </div>

              {/* Editorial Visual Core */}
              <div className="my-2.5 rounded-xl overflow-hidden border border-[#C9A66B]/25 shrink-0">
                <FashionEditorialVisual
                  garment={proposal.garment_type}
                  planType={proposal.plan_type}
                  dialLevel={proposal.dial_level}
                  conceptTag={proposal.concept_tag}
                  colorPalette={proposal.visual_details.color_palette}
                  fabricMaterials={proposal.visual_details.fabric_materials}
                  showImageGenCTA={false}
                />
              </div>

              {/* Fashion Specification Highlights */}
              <div className="space-y-2 text-[11px] text-[#B8AA96]">
                {/* Palette */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[#C9A66B] font-semibold text-[10px] uppercase">
                    Màu:
                  </span>
                  {proposal.visual_details.color_palette.map((colorStr, i) => {
                    const hex = colorStr.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/)?.[0] || '#C9A66B';
                    return (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#181311] border border-[#C9A66B]/20 text-[10px] text-[#E6C88B]"
                      >
                        <span
                          className="w-2 h-2 rounded-full border border-black/40"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="truncate max-w-[90px]">{colorStr.replace(/#\w+\s*/, '')}</span>
                      </span>
                    );
                  })}
                </div>

                {/* Materials & Styling */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#C9A66B]/15 text-[10px]">
                  <div>
                    <span className="text-[#8C7E6C] font-mono block">Chất liệu:</span>
                    <span className="text-[#F2E9D8] line-clamp-1">
                      {proposal.visual_details.fabric_materials.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8C7E6C] font-mono block">Phối cùng:</span>
                    <span className="text-[#F2E9D8] line-clamp-1">
                      {proposal.visual_details.bottom_garment}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8C7E6C] font-mono block">Giày:</span>
                    <span className="text-[#F2E9D8] line-clamp-1">
                      {proposal.visual_details.footwear}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8C7E6C] font-mono block">Phụ kiện:</span>
                    <span className="text-[#F2E9D8] line-clamp-1">
                      {proposal.visual_details.accessories.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cultural Status Section (No Heritage Score) */}
              <div className="pt-2 border-t border-[#C9A66B]/20 mt-1 space-y-1.5">
                <div className="flex items-center justify-between gap-1 flex-wrap text-[10px]">
                  {/* Prototype Status */}
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[#8C7E6C]">Prototype:</span>
                    {isCompliant ? (
                      <span className="font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                        Tuân thủ
                      </span>
                    ) : isConflict ? (
                      <span className="font-semibold text-rose-300 bg-rose-950/60 border border-rose-500/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                        Xung đột
                      </span>
                    ) : (
                      <span className="font-semibold text-[#D4C7B4] bg-slate-800/80 border border-slate-600/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <HelpCircle className="w-2.5 h-2.5 text-[#B8AA96]" />
                        Chưa đánh giá
                      </span>
                    )}
                  </div>

                  {/* Historical Evidence Status */}
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[#8C7E6C]">Sử liệu:</span>
                    {confidence === 'verified' ? (
                      <span className="font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <FileCheck className="w-2.5 h-2.5 text-emerald-400" />
                        Đã kiểm chứng
                      </span>
                    ) : confidence === 'partially_verified' ? (
                      <span className="font-semibold text-amber-200 bg-amber-950/60 border border-amber-500/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Layers className="w-2.5 h-2.5 text-amber-300" />
                        Đã xác thực một phần
                      </span>
                    ) : confidence === 'needs_review' ? (
                      <span className="font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Info className="w-2.5 h-2.5 text-amber-400" />
                        Đang chờ đối soát
                      </span>
                    ) : confidence === 'mixed' ? (
                      <span className="font-semibold text-[#D4C7B4] bg-slate-800/80 border border-slate-600/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Info className="w-2.5 h-2.5 text-[#B8AA96]" />
                        Nguồn hỗn hợp
                      </span>
                    ) : (
                      <span className="font-semibold text-[#D4C7B4] bg-slate-800/80 border border-slate-600/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <HelpCircle className="w-2.5 h-2.5 text-[#B8AA96]" />
                        Chưa đối soát độc lập
                      </span>
                    )}
                  </div>
                </div>

                {/* Evidence count & up to 3 evidence IDs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] text-[#8C7E6C] font-mono pt-1">
                  <span>{`${evidenceCount} căn cứ CKB`}</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {previewEvidenceIds.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onOpenCKB?.(id)}
                        className="min-h-[44px] px-2.5 py-2 inline-flex items-center justify-center bg-[#1F1714] text-[#E6C88B] hover:text-[#FFF] border border-[#C9A66B]/40 hover:border-[#C9A66B] rounded-lg hover:bg-[#2A1F1B] transition-colors cursor-pointer text-[10px] font-mono"
                        title={`Xem chi tiết căn cứ ${id}`}
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback messages */}
        {exportResult && (
          <div className="px-6 py-2 bg-[#C9A66B]/15 border-t border-[#C9A66B]/30 text-xs text-[#E6C88B] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E6C88B]" />
            <span>{exportResult.message}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#16100E]/95 border-t border-[#C9A66B]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 backdrop-blur-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Copy share text */}
            <button
              onClick={handleShare}
              className="px-4 py-2.5 border border-[#C9A66B]/40 hover:bg-[#261C19] text-[#F2E9D8] rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
            >
              {copyStatus === 'copied' ? (
                <>
                  <Check className="w-4 h-4 text-[#43B6A4]" />
                  <span>Đã sao chép nội dung!</span>
                </>
              ) : copyStatus === 'failed' ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Sao chép thất bại</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#C9A66B]" />
                  <span>Sao chép thông tin</span>
                </>
              )}
            </button>

            {/* Export preparation (without fake download) */}
            <button
              onClick={handleExportPreparation}
              className="px-4 py-2.5 bg-[#261C19]/80 hover:bg-[#342622] border border-[#C9A66B]/30 text-[#E6C88B] rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
            >
              <DownloadCloud className="w-4 h-4 text-[#C9A66B]" />
              <span>Chuẩn bị khung xuất ({format === 'social_4_5' ? '4:5' : '9:16'})</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#B8342B] hover:bg-[#A32D25] text-[#F2E9D8] rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
