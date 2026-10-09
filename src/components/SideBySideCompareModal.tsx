import React, { useState } from 'react';
import { OutfitProposal, GarmentKey } from '../types/vietphuc';
import { FashionEditorialVisual } from './FashionEditorialVisual';
import {
  X,
  Columns,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Share2,
  CheckCircle2,
  ArrowRightLeft,
  ChevronRight,
  Palette,
  Shirt,
  Compass,
} from 'lucide-react';

interface SideBySideCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposals: OutfitProposal[];
  onSelectAndOpenLookbook: (proposal: OutfitProposal) => void;
  onOpenCKB?: (evidenceId?: string) => void;
  onNavigateToAnatomy?: () => void;
}

const DIAL_DESCRIPTIONS: Record<number, string> = {
  1: 'Bám sát tham chiếu (Nguyên bản)',
  2: 'Tối giản đương đại (Mộc mạc)',
  3: 'Phố thị đương đại (Streetwear)',
  4: 'May đo cao cấp (Editorial)',
  5: 'Phá cách thể nghiệm (Avant-Garde)',
};

/**
 * Computes 3-5 key architectural and aesthetic differences between Proposal A and Proposal B
 */
function computeKeyDifferences(propA: OutfitProposal, propB: OutfitProposal): string[] {
  const diffs: string[] = [];

  // 1. Remix Dial level & philosophy difference
  diffs.push(
    `Triết lý thiết kế: Bản A bám sát di sản (Mức 1/5 - ${DIAL_DESCRIPTIONS[propA.dial_level] || 'Nguyên bản'}), trong khi Bản B đưa vào cảm hứng đương đại (Mức ${propB.dial_level}/5 - ${DIAL_DESCRIPTIONS[propB.dial_level] || 'Đương đại'}).`
  );

  // 2. Fabric materials difference
  const matsA = propA.visual_details.fabric_materials.join(', ');
  const matsB = propB.visual_details.fabric_materials.join(', ');
  if (matsA !== matsB) {
    diffs.push(`Chất liệu vải: Bản A sử dụng [${matsA}], trong khi Bản B thử nghiệm với [${matsB}].`);
  }

  // 3. Silhouette / Bottom Garment / Cut Length
  const bottomA = propA.visual_details.bottom_garment;
  const bottomB = propB.visual_details.bottom_garment;
  if (bottomA !== bottomB) {
    diffs.push(`Phom dáng & phối lớp: Bản A kết hợp với "${bottomA}", trong khi Bản B chuyển tiếp thành "${bottomB}".`);
  }

  // 4. Accessories & Footwear
  const accA = propA.visual_details.accessories.join(', ') || 'Truyền thống';
  const accB = propB.visual_details.accessories.join(', ') || 'Hiện đại';
  const footA = propA.visual_details.footwear;
  const footB = propB.visual_details.footwear;
  diffs.push(
    `Phụ kiện & giày dép: Bản A chọn [${accA} · Giày: ${footA}], Bản B phá cách với [${accB} · Giày: ${footB}].`
  );

  // 5. Palette mood difference
  const palA = propA.visual_details.color_palette.slice(0, 2).map((c) => c.replace(/#[0-9A-Fa-f]{3,6}/, '').trim()).filter(Boolean).join(' - ');
  const palB = propB.visual_details.color_palette.slice(0, 2).map((c) => c.replace(/#[0-9A-Fa-f]{3,6}/, '').trim()).filter(Boolean).join(' - ');
  if (palA && palB && palA !== palB) {
    diffs.push(`Bảng màu chủ đạo: Bản A thiên về sắc độ [${palA}], Bản B mang năng lượng [${palB}].`);
  }

  return diffs.slice(0, 5);
}

export const SideBySideCompareModal: React.FC<SideBySideCompareModalProps> = ({
  isOpen,
  onClose,
  proposals,
  onSelectAndOpenLookbook,
  onOpenCKB,
  onNavigateToAnatomy,
}) => {
  // Mobile active tab: 'both' | 0 | 1
  const [mobileTab, setMobileTab] = useState<'both' | 0 | 1>('both');

  if (!isOpen || proposals.length < 2) return null;

  const propA = proposals[0];
  const propB = proposals[1];
  const differences = computeKeyDifferences(propA, propB);

  const renderAuditBadge = (prop: OutfitProposal) => {
    const isCompliant = prop.audit.prototype_compliance === 'compliant';
    const isConflict = prop.audit.prototype_compliance === 'conflict';
    const conf = prop.audit.historical_confidence;

    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Prototype compliance */}
        {isCompliant ? (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Tuân thủ Prototype
          </span>
        ) : isConflict ? (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Xung đột Prototype
          </span>
        ) : (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800/80 border border-slate-600/40 text-[#D4C7B4] flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-[#B8AA96]" />
            Chưa xác định
          </span>
        )}

        {/* Historical confidence */}
        {conf === 'verified' && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#C9A66B]/15 border border-[#C9A66B]/40 text-[#E6C88B]">
            Sử liệu: Đã kiểm chứng
          </span>
        )}
        {conf === 'partially_verified' && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#43B6A4]/15 border border-[#43B6A4]/40 text-[#43B6A4]">
            Sử liệu: Đã xác thực
          </span>
        )}
        {conf === 'needs_review' && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950/50 border border-amber-600/40 text-amber-200">
            Sử liệu: Chờ đối soát
          </span>
        )}
        {conf === 'unverified' && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950/50 border border-amber-600/40 text-amber-200">
            Sử liệu: Chưa đối soát
          </span>
        )}
        {conf === 'mixed' && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800/80 border border-slate-600/40 text-[#D4C7B4]">
            Sử liệu: Nguồn hỗn hợp
          </span>
        )}

        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#211815] border border-[#C9A66B]/25 text-[#D4C7B4]">
          {prop.audit.evidence_ids.length} CKB IDs
        </span>
      </div>
    );
  };

  const renderColorSwatches = (palette: string[]) => (
    <div className="flex items-center gap-1.5 flex-wrap">
      {palette.map((color, idx) => {
        const hexMatch = color.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
        const hex = hexMatch ? hexMatch[0] : '#C9A66B';
        const label = color.replace(hex, '').trim() || hex;
        return (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#181311]/80 border border-[#C9A66B]/25 text-[11px] text-[#E6C88B]"
            title={color}
          >
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0 shadow-xs"
              style={{ backgroundColor: hex }}
            />
            <span className="truncate max-w-[85px]">{label}</span>
          </span>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl lacquer-card-elevated rounded-2xl border border-[#C9A66B]/40 bg-[#140F0E] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-[#C9A66B]/25 bg-[#1B1412] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C9A66B]/15 border border-[#C9A66B]/30 flex items-center justify-center text-[#E6C88B] shrink-0">
              <Columns className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#F2E9D8] tracking-wide flex items-center gap-2">
                <span>So Sánh Song Hành 2 Bản Phối</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C9A66B]/20 text-[#E6C88B] font-semibold border border-[#C9A66B]/40 hidden sm:inline-block">
                  A vs B
                </span>
              </h3>
              <p className="text-[11px] text-[#B8AA96]">
                Đối chiếu trực quan chi tiết phom dáng, chất liệu, phụ kiện và thẩm định văn hóa CKB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#261C19] hover:bg-[#342622] border border-[#C9A66B]/30 text-[#D4C7B4] hover:text-[#FFF] flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng bảng so sánh"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Tab Switcher (< md) */}
        <div className="md:hidden px-3 py-2 bg-[#181311] border-b border-[#C9A66B]/20 flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setMobileTab('both')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer min-h-[36px] ${
              mobileTab === 'both'
                ? 'bg-[#C9A66B]/25 text-[#E6C88B] border border-[#C9A66B]/50'
                : 'text-[#8C7E6C] hover:text-[#B8AA96]'
            }`}
          >
            Xem cả hai
          </button>
          <button
            type="button"
            onClick={() => setMobileTab(0)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer min-h-[36px] ${
              mobileTab === 0
                ? 'bg-[#C9A66B]/25 text-[#E6C88B] border border-[#C9A66B]/50'
                : 'text-[#8C7E6C] hover:text-[#B8AA96]'
            }`}
          >
            Bản A (Heritage)
          </button>
          <button
            type="button"
            onClick={() => setMobileTab(1)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer min-h-[36px] ${
              mobileTab === 1
                ? 'bg-[#B8342B]/25 text-[#F5A39D] border border-[#B8342B]/50'
                : 'text-[#8C7E6C] hover:text-[#B8AA96]'
            }`}
          >
            Bản B (Remix)
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* Key Differences Banner */}
          <div className="bg-[#1C1513] border border-[#C9A66B]/30 rounded-xl p-4 sm:p-5 space-y-2.5 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E6C88B]" />
              <h4 className="text-xs sm:text-sm font-serif font-bold text-[#E6C88B] tracking-wide uppercase">
                Điểm Khác Biệt Nổi Bật (3–5 Yếu Tố Cốt Lõi)
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-[#D4C7B4] leading-relaxed">
              {differences.map((diff, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] mt-1.5 shrink-0" />
                  <span>{diff}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Two Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            {/* Column A: Heritage Anchored */}
            {(mobileTab === 'both' || mobileTab === 0) && (
              <div className="lacquer-panel rounded-2xl p-4 sm:p-5 border border-[#C9A66B]/40 bg-[#16100E] flex flex-col space-y-4 shadow-md">
                {/* Header */}
                <div className="space-y-1.5 pb-3 border-b border-[#C9A66B]/20">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A66B]/20 border border-[#C9A66B]/50 text-[#E6C88B]">
                      BẢN PHỐI A · HERITAGE ANCHORED
                    </span>
                    <span className="text-[11px] font-mono text-[#8C7E6C]">
                      Mức 1/5
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-[#F2E9D8]">
                    {propA.title}
                  </h4>
                  <p className="text-xs text-[#C9A66B] font-mono">
                    {propA.concept_tag}
                  </p>
                </div>

                {/* Visual preview */}
                <div className="rounded-xl overflow-hidden border border-[#C9A66B]/20 bg-[#0E0A09]">
                  <FashionEditorialVisual
                    garment={propA.garment_type}
                    planType={propA.plan_type}
                    dialLevel={propA.dial_level}
                    conceptTag={propA.concept_tag}
                    colorPalette={propA.visual_details.color_palette}
                    fabricMaterials={propA.visual_details.fabric_materials}
                    onOpenStructuralReference={onNavigateToAnatomy}
                  />
                </div>

                {/* Palette Swatches */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono uppercase text-[#8C7E6C] font-semibold flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#C9A66B]" />
                    Dải màu chủ đạo:
                  </span>
                  {renderColorSwatches(propA.visual_details.color_palette)}
                </div>

                {/* Materials & Structure */}
                <div className="space-y-2 text-xs bg-[#1A1311] p-3 rounded-xl border border-[#C9A66B]/15">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[#8C7E6C] shrink-0">Chất liệu:</span>
                    <span className="text-[#F2E9D8] text-right font-medium">
                      {propA.visual_details.fabric_materials.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[#8C7E6C] shrink-0">Cấu trúc cổ & vạt:</span>
                    <span className="text-[#E6C88B] text-right">
                      {propA.visual_details.collar_style} · {propA.visual_details.lapel_side}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[#8C7E6C] shrink-0">Phần dưới & giày:</span>
                    <span className="text-[#F2E9D8] text-right">
                      {propA.visual_details.bottom_garment} · {propA.visual_details.footwear}
                    </span>
                  </div>
                </div>

                {/* Accessories */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-mono uppercase text-[#8C7E6C] font-semibold block">
                    Phụ kiện đi kèm:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {propA.visual_details.accessories.map((acc, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-[#221815] border border-[#C9A66B]/20 text-[11px] text-[#D4C7B4]"
                      >
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Occasions / Dịp mặc */}
                <div className="space-y-1 text-xs">
                  <span className="text-[11px] font-mono uppercase text-[#8C7E6C] font-semibold flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#C9A66B]" />
                    Dịp mặc phù hợp:
                  </span>
                  <p className="text-[#D4C7B4] leading-relaxed text-[11px] italic">
                    {propA.stylist_notes.occasions?.join(' · ') || 'Lễ nghi, đại lễ, sự kiện văn hóa nghệ thuật trang trọng'}
                  </p>
                </div>

                {/* Cultural Audit Badges */}
                <div className="space-y-1.5 pt-2 border-t border-[#C9A66B]/20">
                  <span className="text-[10px] font-mono uppercase text-[#8C7E6C] block">
                    Thẩm định văn hóa CKB:
                  </span>
                  {renderAuditBadge(propA)}
                  {propA.audit.evidence_ids.length > 0 && onOpenCKB && (
                    <button
                      type="button"
                      onClick={() => onOpenCKB(propA.audit.evidence_ids[0])}
                      className="text-[10px] font-mono text-[#E6C88B] hover:text-[#FFF] underline decoration-[#C9A66B]/40 cursor-pointer block pt-0.5"
                    >
                      Mã căn cứ: {propA.audit.evidence_ids.join(', ')}
                    </button>
                  )}
                </div>

                {/* Button "Chốt bản này" */}
                <div className="pt-3 mt-auto">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectAndOpenLookbook(propA);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-[#C9A66B]/20 hover:bg-[#C9A66B]/35 border border-[#C9A66B] text-[#F2E9D8] hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[42px] shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#E6C88B]" />
                    <span>Chốt Bản A · Đưa vào Lookbook</span>
                  </button>
                </div>
              </div>
            )}

            {/* Column B: Contemporary Remix */}
            {(mobileTab === 'both' || mobileTab === 1) && (
              <div className="lacquer-panel rounded-2xl p-4 sm:p-5 border border-[#B8342B]/40 bg-[#16100E] flex flex-col space-y-4 shadow-md">
                {/* Header */}
                <div className="space-y-1.5 pb-3 border-b border-[#B8342B]/25">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#B8342B]/25 border border-[#B8342B]/50 text-[#F5A39D]">
                      BẢN PHỐI B · CONTEMPORARY REMIX
                    </span>
                    <span className="text-[11px] font-mono text-[#F5A39D] font-semibold">
                      Mức {propB.dial_level}/5
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-[#F2E9D8]">
                    {propB.title}
                  </h4>
                  <p className="text-xs text-[#F5A39D] font-mono">
                    {propB.concept_tag}
                  </p>
                </div>

                {/* Visual preview */}
                <div className="rounded-xl overflow-hidden border border-[#B8342B]/30 bg-[#0E0A09]">
                  <FashionEditorialVisual
                    garment={propB.garment_type}
                    planType={propB.plan_type}
                    dialLevel={propB.dial_level}
                    conceptTag={propB.concept_tag}
                    colorPalette={propB.visual_details.color_palette}
                    fabricMaterials={propB.visual_details.fabric_materials}
                    onOpenStructuralReference={onNavigateToAnatomy}
                  />
                </div>

                {/* Palette Swatches */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono uppercase text-[#8C7E6C] font-semibold flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#F5A39D]" />
                    Dải màu chủ đạo:
                  </span>
                  {renderColorSwatches(propB.visual_details.color_palette)}
                </div>

                {/* Materials & Structure */}
                <div className="space-y-2 text-xs bg-[#1A1311] p-3 rounded-xl border border-[#B8342B]/20">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[#8C7E6C] shrink-0">Chất liệu:</span>
                    <span className="text-[#F2E9D8] text-right font-medium">
                      {propB.visual_details.fabric_materials.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[#8C7E6C] shrink-0">Cấu trúc cổ & vạt:</span>
                    <span className="text-[#F5A39D] text-right">
                      {propB.visual_details.collar_style} · {propB.visual_details.lapel_side}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[#8C7E6C] shrink-0">Phần dưới & giày:</span>
                    <span className="text-[#F2E9D8] text-right">
                      {propB.visual_details.bottom_garment} · {propB.visual_details.footwear}
                    </span>
                  </div>
                </div>

                {/* Accessories */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-mono uppercase text-[#8C7E6C] font-semibold block">
                    Phụ kiện đi kèm:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {propB.visual_details.accessories.map((acc, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-[#241715] border border-[#B8342B]/25 text-[11px] text-[#D4C7B4]"
                      >
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Occasions / Dịp mặc */}
                <div className="space-y-1 text-xs">
                  <span className="text-[11px] font-mono uppercase text-[#8C7E6C] font-semibold flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#F5A39D]" />
                    Dịp mặc phù hợp:
                  </span>
                  <p className="text-[#D4C7B4] leading-relaxed text-[11px] italic">
                    {propB.stylist_notes.occasions?.join(' · ') || 'Dạo phố cuối tuần, triển lãm, sự kiện sáng tạo Gen Z'}
                  </p>
                </div>

                {/* Cultural Audit Badges */}
                <div className="space-y-1.5 pt-2 border-t border-[#B8342B]/25">
                  <span className="text-[10px] font-mono uppercase text-[#8C7E6C] block">
                    Thẩm định văn hóa CKB:
                  </span>
                  {renderAuditBadge(propB)}
                  {propB.audit.evidence_ids.length > 0 && onOpenCKB && (
                    <button
                      type="button"
                      onClick={() => onOpenCKB(propB.audit.evidence_ids[0])}
                      className="text-[10px] font-mono text-[#F5A39D] hover:text-[#FFF] underline decoration-[#B8342B]/40 cursor-pointer block pt-0.5"
                    >
                      Mã căn cứ: {propB.audit.evidence_ids.join(', ')}
                    </button>
                  )}
                </div>

                {/* Button "Chốt bản này" */}
                <div className="pt-3 mt-auto">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectAndOpenLookbook(propB);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-[#B8342B] hover:bg-[#A32D25] border border-[#B8342B]/80 text-[#F2E9D8] hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[42px] shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#F5DCA3]" />
                    <span>Chốt Bản B · Đưa vào Lookbook</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-4 sm:px-6 py-3 bg-[#181311] border-t border-[#C9A66B]/20 flex items-center justify-between shrink-0">
          <span className="text-xs text-[#8C7E6C] hidden sm:inline">
            Cả hai phương án đều giữ nguyên vẹn cấu trúc cốt lõi từ CKB Registry
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#221815] hover:bg-[#2E201B] border border-[#C9A66B]/30 text-[#D4C7B4] text-xs font-semibold rounded-xl transition-colors cursor-pointer min-h-[38px] ml-auto"
          >
            Đóng so sánh
          </button>
        </div>
      </div>
    </div>
  );
};
