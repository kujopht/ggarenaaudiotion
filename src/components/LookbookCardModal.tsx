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
      `[VIỆTPHỤC REMIX LAB] ${proposal.title} · Thẩm định: ${proposal.audit.status} · Stylist: ${proposal.stylist_notes.philosophy}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#181C24] border border-[#2A313E] rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[92vh]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#272D3A] bg-[#161920]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#14B8A6]">THẺ LOOKBOOK</span>
            <span className="text-[#64748B]">·</span>
            <span className="text-xs text-[#94A3B8]">Việt Phục Đương Đại</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#202530] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
          {/* Card Marquee */}
          <div className="border-b border-[#272D3A] pb-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
              <span>BẢN GHI SỐ 2026 // LOOKBOOK ARCHIVE</span>
              <span className="font-bold text-[#2DD4BF]">MỨC REMIX {proposal.dial_level}/5</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F1F5F9] leading-tight">
              {proposal.title}
            </h3>
            <div className="text-xs font-mono font-semibold uppercase text-[#14B8A6] tracking-wider">
              {proposal.concept_tag}
            </div>
          </div>

          {/* Schematic Visual */}
          <div className="rounded-xl overflow-hidden border border-[#272D3A]">
            <GarmentSchematic
              garment={proposal.garment_type}
              visualDetails={proposal.visual_details}
              dialLevel={proposal.dial_level}
            />
          </div>

          {/* Cultural Certification Stamp */}
          <div className="p-4 bg-[#161920] border border-[#272D3A] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#14B8A6] uppercase tracking-wider font-semibold">
                GHI CHÚ THAM CHIẾU VĂN HÓA
              </div>
              <p className="text-xs sm:text-sm text-[#CBD5E1] italic font-serif">
                "{proposal.audit.auditor_verdict}"
              </p>
            </div>

            <div className="shrink-0">
              {proposal.audit.status === 'Supported' && (
                <div className="px-3 py-1.5 bg-[#0D9488]/15 border border-[#0D9488]/40 text-[#2DD4BF] rounded-lg font-semibold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
                  <span>Phù hợp quy tắc tham chiếu</span>
                </div>
              )}
              {proposal.audit.status === 'Supported with Caution' && (
                <div className="px-3 py-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 rounded-lg font-semibold text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Có điểm cần lưu ý</span>
                </div>
              )}
              {proposal.audit.status === 'Insufficient Evidence' && (
                <div className="px-3 py-1.5 bg-rose-500/15 border border-rose-500/40 text-rose-300 rounded-lg font-semibold text-xs flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-rose-400" />
                  <span>Chưa đủ dữ liệu tham chiếu</span>
                </div>
              )}
            </div>
          </div>

          {/* Outfit Anatomy Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="space-y-1.5 p-3.5 bg-[#161920] border border-[#272D3A] rounded-xl">
              <span className="font-mono text-xs text-[#14B8A6] uppercase block font-semibold">CẤU TRÚC THÂN TRÊN</span>
              <div className="font-semibold text-[#F1F5F9]">{proposal.visual_details.collar_style}</div>
              <div className="text-[#94A3B8] text-xs">{proposal.visual_details.lapel_side}</div>
              <div className="text-[#94A3B8] text-xs">{proposal.visual_details.sleeve_style}</div>
            </div>

            <div className="space-y-1.5 p-3.5 bg-[#161920] border border-[#272D3A] rounded-xl">
              <span className="font-mono text-xs text-[#14B8A6] uppercase block font-semibold">PHỐI HỢP ĐƯƠNG ĐẠI</span>
              <div className="font-semibold text-[#F1F5F9]">{proposal.visual_details.bottom_garment}</div>
              <div className="text-[#94A3B8] text-xs">Giày: {proposal.visual_details.footwear}</div>
              <div className="text-[#94A3B8] text-xs">Vật liệu: {proposal.visual_details.fabric_materials.join(', ')}</div>
            </div>
          </div>

          {/* Stylist Guidance */}
          <div className="p-4 bg-[#161920] border border-[#272D3A] rounded-xl text-xs sm:text-sm space-y-1.5">
            <span className="font-mono text-xs text-[#14B8A6] uppercase tracking-wider block font-semibold">
              LỜI KHUYÊN TỪ STYLIST
            </span>
            <p className="text-[#CBD5E1] leading-relaxed font-serif text-sm italic">
              "{proposal.stylist_notes.philosophy}"
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-[#161920] border-t border-[#272D3A] flex items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2 border border-[#2D3546] hover:bg-[#202530] text-[#E2E8F0] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer min-h-[40px]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>Đã sao chép Lookbook!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#2DD4BF]" />
                <span>Sao chép công thức</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[40px]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
