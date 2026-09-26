import React, { useState } from 'react';
import { OutfitProposal } from '../types/vietphuc';
import { X, Download, Share2, Check, ShieldCheck, AlertTriangle } from 'lucide-react';
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
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-stone-300 rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[95vh]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-stone-200 bg-white">
          <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500">
            EDITORIAL LOOKBOOK CARD · CỘNG ĐỒNG SÁNG TẠO
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Card Marquee */}
          <div className="border-b-2 border-stone-900 pb-4">
            <div className="flex items-center justify-between text-xs text-stone-500 font-mono mb-1">
              <span>VOL. 2026 // LOOKBOOK ARCHIVE</span>
              <span>DIAL LEVEL {proposal.dial_level}/5</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
              {proposal.title}
            </h3>
            <div className="text-xs font-mono uppercase text-amber-700 tracking-wider mt-1">
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
          <div className="p-4 bg-white border border-stone-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                CULTURAL AUDITOR CERTIFICATION
              </div>
              <div className="text-sm font-serif font-bold text-stone-900 mt-0.5">
                Chứng Thư Thẩm Định Di Sản CKB
              </div>
              <p className="text-xs text-stone-600 mt-1 italic">
                "{proposal.audit.auditor_verdict}"
              </p>
            </div>

            <div className="shrink-0">
              {proposal.audit.status === 'Supported' && (
                <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded font-semibold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>SUPPORTED</span>
                </div>
              )}
              {proposal.audit.status === 'Supported with Caution' && (
                <div className="px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded font-semibold text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>SUPPORTED W/ CAUTION</span>
                </div>
              )}
            </div>
          </div>

          {/* Outfit Anatomy Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 p-3 bg-white border border-stone-200 rounded-lg">
              <span className="font-mono text-[10px] text-stone-400 uppercase block">CẤU TRÚC THÂN TRÊN</span>
              <div className="font-semibold text-stone-900">{proposal.visual_details.collar_style}</div>
              <div className="text-stone-600">{proposal.visual_details.lapel_side}</div>
              <div className="text-stone-600">{proposal.visual_details.sleeve_style}</div>
            </div>

            <div className="space-y-2 p-3 bg-white border border-stone-200 rounded-lg">
              <span className="font-mono text-[10px] text-stone-400 uppercase block">PHỐI HỢP ĐƯƠNG ĐẠI</span>
              <div className="font-semibold text-stone-900">{proposal.visual_details.bottom_garment}</div>
              <div className="text-stone-600">Giày: {proposal.visual_details.footwear}</div>
              <div className="text-stone-600">Vật liệu: {proposal.visual_details.fabric_materials.join(', ')}</div>
            </div>
          </div>

          {/* Stylist Guidance */}
          <div className="p-4 bg-stone-100/70 border border-stone-200 rounded-xl text-xs space-y-2">
            <span className="font-mono text-[10px] text-stone-500 uppercase tracking-wider block">
              STYLIST CO-DESIGNER DIRECTIVES
            </span>
            <p className="text-stone-800 leading-relaxed font-serif text-sm">
              "{proposal.stylist_notes.philosophy}"
            </p>
            <div className="pt-2 border-t border-stone-200 flex flex-wrap gap-2 text-[11px] text-stone-600">
              <span className="font-semibold">Ứng dụng phù hợp:</span>
              {proposal.stylist_notes.occasions.map((occ, i) => (
                <span key={i} className="text-stone-700 font-medium">
                  {occ}{i < proposal.stylist_notes.occasions.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Đã sao chép Lookbook!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-stone-500" />
                <span>Chia Sẻ Công Thức</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Hoàn Tất
          </button>
        </div>
      </div>
    </div>
  );
};
