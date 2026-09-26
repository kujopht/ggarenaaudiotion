import React, { useState } from 'react';
import { OutfitProposal } from '../types/vietphuc';
import { X, Share2, Check, ShieldCheck, AlertTriangle, HelpCircle } from 'lucide-react';
import { GarmentSchematic } from './GarmentSchematic';

interface LookbookCardModalProps {
  proposal: OutfitProposal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LookbookCardModal: React.FC<LookbookCardModalProps> = ({
  proposal,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !proposal) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(
      `[VIỆT PHỤC REMIX LAB] ${proposal.title} · Thẩm định: ${proposal.audit.status} · Stylist: ${proposal.stylist_notes.philosophy}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasCaution = proposal.audit.status === 'Supported with Caution' || (proposal.audit.cautions_and_redlines && proposal.audit.cautions_and_redlines.length > 0);
  const hasUncertainty = proposal.audit.uncertainty_flag || proposal.audit.status === 'Insufficient Evidence';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl lacquer-card-elevated rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[92vh]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#C9A66B]/20 bg-[#181311]/70 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#C9A66B]">THẺ LOOKBOOK</span>
            <span className="text-[#8C7E6C]">·</span>
            <span className="text-xs text-[#B8AA96]">Việt Phục Sơn Mài Đương Đại</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#B8AA96] hover:text-[#F2E9D8] rounded-lg hover:bg-[#261C19] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
          {/* Card Marquee */}
          <div className="border-b border-[#C9A66B]/20 pb-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#B8AA96] font-mono">
              <span>BẢN GHI SỐ 2026 // LOOKBOOK ARCHIVE</span>
              <span className="font-bold text-[#E6C88B]">MỨC REMIX {proposal.dial_level}/5</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F2E9D8] leading-tight">
              {proposal.title}
            </h3>
            <div className="text-xs font-mono font-semibold uppercase text-[#C9A66B] tracking-wider">
              {proposal.concept_tag}
            </div>
          </div>

          {/* Schematic Visual */}
          <div className="rounded-xl overflow-hidden border border-[#C9A66B]/25">
            <GarmentSchematic
              garment={proposal.garment_type}
              visualDetails={proposal.visual_details}
              dialLevel={proposal.dial_level}
            />
          </div>

          {/* Cultural Certification Stamp */}
          <div className="p-4 bg-[#181311]/60 border border-[#C9A66B]/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-xs">
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#C9A66B] uppercase tracking-wider font-semibold">
                GHI CHÚ THAM CHIẾU VĂN HÓA
              </div>
              <p className="text-xs sm:text-sm text-[#F2E9D8]/90 italic font-serif">
                "{proposal.audit.auditor_verdict}"
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 flex-wrap">
              {!hasCaution && !hasUncertainty && proposal.audit.status === 'Supported' && (
                <div className="px-3 py-1.5 bg-[#C9A66B]/15 border border-[#C9A66B]/40 text-[#E6C88B] rounded-lg font-semibold text-xs flex items-center gap-1.5 backdrop-blur-xs">
                  <ShieldCheck className="w-4 h-4 text-[#E6C88B]" />
                  <span>Phù hợp quy tắc tham chiếu</span>
                </div>
              )}
              {hasCaution && (
                <div className="px-3 py-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 rounded-lg font-semibold text-xs flex items-center gap-1.5 backdrop-blur-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Có điểm cần lưu ý</span>
                </div>
              )}
              {hasUncertainty && (
                <div className="px-3 py-1.5 bg-rose-500/15 border border-rose-500/40 text-rose-300 rounded-lg font-semibold text-xs flex items-center gap-1.5 backdrop-blur-xs">
                  <HelpCircle className="w-4 h-4 text-rose-400" />
                  <span>Chưa đủ dữ liệu tham chiếu</span>
                </div>
              )}
            </div>
          </div>

          {/* Outfit Anatomy Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="space-y-1.5 p-3.5 bg-[#181311]/60 border border-[#C9A66B]/20 rounded-xl backdrop-blur-xs">
              <span className="font-mono text-xs text-[#C9A66B] uppercase block font-semibold">CẤU TRÚC THÂN TRÊN</span>
              <div className="font-semibold text-[#F2E9D8]">{proposal.visual_details.collar_style}</div>
              <div className="text-[#B8AA96] text-xs">{proposal.visual_details.lapel_side}</div>
              <div className="text-[#B8AA96] text-xs">{proposal.visual_details.sleeve_style}</div>
            </div>

            <div className="space-y-1.5 p-3.5 bg-[#181311]/60 border border-[#C9A66B]/20 rounded-xl backdrop-blur-xs">
              <span className="font-mono text-xs text-[#C9A66B] uppercase block font-semibold">PHỐI HỢP ĐƯƠNG ĐẠI</span>
              <div className="font-semibold text-[#F2E9D8]">{proposal.visual_details.bottom_garment}</div>
              <div className="text-[#B8AA96] text-xs">Giày: {proposal.visual_details.footwear}</div>
              <div className="text-[#B8AA96] text-xs">Vật liệu: {proposal.visual_details.fabric_materials.join(', ')}</div>
            </div>
          </div>

          {/* Stylist Guidance */}
          <div className="p-4 bg-[#181311]/60 border border-[#C9A66B]/20 rounded-xl text-xs sm:text-sm space-y-1.5 backdrop-blur-xs">
            <span className="font-mono text-xs text-[#C9A66B] uppercase tracking-wider block font-semibold">
              LỜI KHUYÊN TỪ STYLIST
            </span>
            <p className="text-[#F2E9D8]/90 leading-relaxed font-serif text-sm italic">
              "{proposal.stylist_notes.philosophy}"
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-[#181311]/70 border-t border-[#C9A66B]/20 flex items-center justify-between gap-3 backdrop-blur-xs">
          <button
            onClick={handleShare}
            className="px-4 py-2 border border-[#C9A66B]/30 hover:bg-[#261C19] text-[#F2E9D8] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer min-h-[40px]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#43B6A4]" />
                <span>Đã sao chép Lookbook!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#C9A66B]" />
                <span>Sao chép công thức</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#B8342B] hover:bg-[#A32D25] text-[#F2E9D8] rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[40px]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
