import React, { useState } from 'react';
import { OutfitProposal } from '../types/vietphuc';
import { X, Share2, Check, ShieldCheck, AlertTriangle } from 'lucide-react';
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
      `[VIỆTPHỤC REMIX LAB] ${proposal.title} · Audit: ${proposal.audit.status} · Phối đồ: ${proposal.stylist_notes.philosophy}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#FAF7F0] border-2 border-[#1C1917] rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[95vh]">
        {/* Top bar with Vietnamese Seal */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#E2DBD0] bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#991B1B]">ẤN TRIỆN</span>
            <span className="text-[#A8A29E]">·</span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716C]">
              THẺ LOOKBOOK VIỆT PHỤC REMIX
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-lg hover:bg-[#F2ECE0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-5">
          {/* Card Marquee */}
          <div className="border-b-2 border-[#1C1917] pb-3.5">
            <div className="flex items-center justify-between text-xs text-[#78716C] font-mono mb-1">
              <span>BẢN GHI SỐ 2026 // LOOKBOOK ARCHIVE</span>
              <span className="font-bold text-[#991B1B]">DIAL NẤC {proposal.dial_level}/5</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] leading-tight">
              {proposal.title}
            </h3>
            <div className="text-xs font-mono font-bold uppercase text-[#B45309] tracking-wider mt-1">
              {proposal.concept_tag}
            </div>
          </div>

          {/* Schematic Visual */}
          <div className="rounded-xl overflow-hidden shadow-inner">
            <GarmentSchematic
              garment={proposal.garment_type}
              visualDetails={proposal.visual_details}
              dialLevel={proposal.dial_level}
            />
          </div>

          {/* Cultural Certification Stamp */}
          <div className="p-4 bg-white border border-[#E2DBD0] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono text-[#991B1B] uppercase tracking-wider font-bold">
                CULTURAL AUDITOR CERTIFICATION
              </div>
              <div className="text-sm font-serif font-bold text-[#1C1917] mt-0.5">
                Chứng Thư Thẩm Định Di Sản CKB
              </div>
              <p className="text-xs text-[#57534E] mt-1 italic font-serif">
                "{proposal.audit.auditor_verdict}"
              </p>
            </div>

            <div className="shrink-0">
              {proposal.audit.status === 'Supported' && (
                <div className="px-3 py-1.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded-md font-bold text-xs flex items-center gap-1.5 font-sans">
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>SUPPORTED</span>
                </div>
              )}
              {proposal.audit.status === 'Supported with Caution' && (
                <div className="px-3 py-1.5 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] rounded-md font-bold text-xs flex items-center gap-1.5 font-sans">
                  <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                  <span>CAUTION</span>
                </div>
              )}
            </div>
          </div>

          {/* Outfit Anatomy Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1.5 p-3.5 bg-white border border-[#E2DBD0] rounded-lg">
              <span className="font-mono text-[10px] text-[#A8A29E] uppercase block font-semibold">CẤU TRÚC THÂN TRÊN</span>
              <div className="font-bold text-[#1C1917]">{proposal.visual_details.collar_style}</div>
              <div className="text-[#57534E] text-[11px]">{proposal.visual_details.lapel_side}</div>
              <div className="text-[#57534E] text-[11px]">{proposal.visual_details.sleeve_style}</div>
            </div>

            <div className="space-y-1.5 p-3.5 bg-white border border-[#E2DBD0] rounded-lg">
              <span className="font-mono text-[10px] text-[#A8A29E] uppercase block font-semibold">PHỐI HỢP ĐƯƠNG ĐẠI</span>
              <div className="font-bold text-[#1C1917]">{proposal.visual_details.bottom_garment}</div>
              <div className="text-[#57534E] text-[11px]">Giày: {proposal.visual_details.footwear}</div>
              <div className="text-[#57534E] text-[11px]">Vật liệu: {proposal.visual_details.fabric_materials.join(', ')}</div>
            </div>
          </div>

          {/* Stylist Guidance */}
          <div className="p-4 bg-white border border-[#E2DBD0] rounded-xl text-xs space-y-1.5">
            <span className="font-mono text-[10px] text-[#B45309] uppercase tracking-wider block font-bold">
              LỜI KHUYÊN CONTEMPORARY STYLIST
            </span>
            <p className="text-[#44403C] leading-relaxed font-serif text-sm">
              "{proposal.stylist_notes.philosophy}"
            </p>
            <div className="pt-2 border-t border-[#F2ECE0] flex flex-wrap gap-2 text-[11px] text-[#57534E]">
              <span className="font-semibold text-[#1C1917]">Phù hợp:</span>
              {proposal.stylist_notes.occasions.map((occ, i) => (
                <span key={i} className="text-[#57534E]">
                  {occ}{i < proposal.stylist_notes.occasions.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-white border-t border-[#E2DBD0] flex items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2 border border-[#D6CEBE] hover:bg-[#F2ECE0] text-[#1C1917] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#059669]" />
                <span>Đã sao chép Lookbook!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#991B1B]" />
                <span>Sao Chép Công Thức</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1C1917] hover:bg-[#991B1B] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
