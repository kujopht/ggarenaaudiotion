import React from 'react';
import { OutfitProposal } from '../types/vietphuc';
import { ShieldCheck, AlertTriangle, HelpCircle, ArrowRightLeft } from 'lucide-react';

interface QuickCompareSectionProps {
  proposals: OutfitProposal[];
  onOpenCKB?: (evidenceId?: string) => void;
}

const DIAL_DESCRIPTIONS: Record<number, string> = {
  1: 'Bám sát tham chiếu',
  2: 'Tối giản đương đại',
  3: 'Phố thị đương đại',
  4: 'May đo cao cấp',
  5: 'Phá cách thể nghiệm',
};

export const QuickCompareSection: React.FC<QuickCompareSectionProps> = ({
  proposals,
  onOpenCKB,
}) => {
  // Only render when there are exactly 2 proposals
  if (proposals.length !== 2) {
    return null;
  }

  const propA = proposals[0];
  const propB = proposals[1];

  const renderAuditCell = (prop: OutfitProposal) => {
    const isCompliant = prop.audit.prototype_compliance === 'compliant';
    const confidence = prop.audit.historical_confidence;
    const cautionCount = prop.audit.cautions_and_redlines?.length || 0;

    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {isCompliant ? (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
              Tuân thủ Prototype
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
              Xung đột Prototype
            </span>
          )}

          {confidence === 'verified' && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#C9A66B]/15 border border-[#C9A66B]/40 text-[#E6C88B]">
              Sử liệu: Đã kiểm chứng
            </span>
          )}
          {confidence === 'partially_verified' && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#43B6A4]/15 border border-[#43B6A4]/40 text-[#43B6A4]">
              Sử liệu: Đã xác thực một phần
            </span>
          )}
          {confidence === 'needs_review' && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-950/50 border border-amber-600/40 text-amber-200">
              Sử liệu: Đang chờ đối soát
            </span>
          )}
          {confidence === 'unverified' && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-950/50 border border-amber-600/40 text-amber-200">
              Sử liệu: Chưa đối soát độc lập
            </span>
          )}
          {confidence === 'mixed' && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-600/40 text-[#D4C7B4]">
              Sử liệu: Nguồn hỗn hợp
            </span>
          )}

          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#211815] border border-[#C9A66B]/25 text-[#D4C7B4]">
            {prop.audit.evidence_ids.length} CKB IDs
          </span>

          {cautionCount > 0 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
              {cautionCount} lưu ý
            </span>
          )}
        </div>

        {prop.audit.evidence_ids.length > 0 && onOpenCKB && (
          <button
            type="button"
            onClick={() => onOpenCKB(prop.audit.evidence_ids[0])}
            className="text-[10px] font-mono text-[#C9A66B] hover:text-[#F2E9D8] underline decoration-[#C9A66B]/40 cursor-pointer block"
          >
            Mã tham chiếu: {prop.audit.evidence_ids.join(', ')}
          </button>
        )}
      </div>
    );
  };

  const renderPaletteCell = (colors: string[]) => (
    <div className="flex items-center gap-1.5 flex-wrap">
      {colors.map((c, i) => {
        const hexMatch = c.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
        const hex = hexMatch ? hexMatch[0] : '#C9A66B';
        const label = c.replace(hex, '').trim() || hex;
        return (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#181311]/70 border border-[#C9A66B]/20 text-[10px] text-[#D4C7B4]"
          >
            <span
              className="w-2 h-2 rounded-full border border-white/30 shrink-0"
              style={{ backgroundColor: hex }}
            />
            <span className="truncate max-w-[70px]">{label}</span>
          </span>
        );
      })}
    </div>
  );

  return (
    <div className="lacquer-panel rounded-2xl p-4 sm:p-5 border border-[#C9A66B]/30 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#C9A66B]/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#C9A66B]/15 border border-[#C9A66B]/30 flex items-center justify-center text-[#E6C88B]">
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-sm font-serif font-bold text-[#F2E9D8] tracking-wide">
              So sánh nhanh
            </h4>
            <p className="text-[11px] text-[#8C7E6C]">
              Đối chiếu song song hai hướng thiết kế từ cùng một nguyên mẫu di sản
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#C9A66B] px-2 py-0.5 rounded bg-[#211815] border border-[#C9A66B]/25">
          2 Phương án
        </span>
      </div>

      {/* Desktop Comparison Table (md:block) */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-[#C9A66B]/20 text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#181311]/90 border-b border-[#C9A66B]/20 text-[#C9A66B] font-mono text-[11px]">
              <th className="p-3 w-[150px] font-bold uppercase tracking-wider">Tiêu chí</th>
              <th className="p-3 w-[42%] border-l border-[#C9A66B]/15 font-serif font-bold text-[#E6C88B]">
                Bản phối A · Heritage Anchored
              </th>
              <th className="p-3 w-[42%] border-l border-[#C9A66B]/15 font-serif font-bold text-[#F5A39D]">
                Bản phối B · Contemporary Remix
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C9A66B]/15 bg-[#140F0E]/60 text-[#D4C7B4]">
            {/* 1. Cấu trúc và phom */}
            <tr>
              <td className="p-3 font-semibold text-[#B8AA96] bg-[#181311]/40">Cấu trúc và phom</td>
              <td className="p-3 border-l border-[#C9A66B]/15 leading-relaxed">
                <div><span className="text-[#8C7E6C]">Cổ & Vạt:</span> {propA.visual_details.collar_style} · {propA.visual_details.lapel_side}</div>
                <div className="mt-0.5"><span className="text-[#8C7E6C]">Tay & Chiều dài:</span> {propA.visual_details.sleeve_style} · {propA.visual_details.cut_length}</div>
              </td>
              <td className="p-3 border-l border-[#C9A66B]/15 leading-relaxed">
                <div><span className="text-[#8C7E6C]">Cổ & Vạt:</span> {propB.visual_details.collar_style} · {propB.visual_details.lapel_side}</div>
                <div className="mt-0.5"><span className="text-[#8C7E6C]">Tay & Chiều dài:</span> {propB.visual_details.sleeve_style} · {propB.visual_details.cut_length}</div>
              </td>
            </tr>

            {/* 2. Chất liệu */}
            <tr>
              <td className="p-3 font-semibold text-[#B8AA96] bg-[#181311]/40">Chất liệu</td>
              <td className="p-3 border-l border-[#C9A66B]/15 leading-relaxed">
                {propA.visual_details.fabric_materials.join(', ')}
              </td>
              <td className="p-3 border-l border-[#C9A66B]/15 leading-relaxed">
                {propB.visual_details.fabric_materials.join(', ')}
              </td>
            </tr>

            {/* 3. Bảng màu */}
            <tr>
              <td className="p-3 font-semibold text-[#B8AA96] bg-[#181311]/40">Bảng màu</td>
              <td className="p-3 border-l border-[#C9A66B]/15">
                {renderPaletteCell(propA.visual_details.color_palette)}
              </td>
              <td className="p-3 border-l border-[#C9A66B]/15">
                {renderPaletteCell(propB.visual_details.color_palette)}
              </td>
            </tr>

            {/* 4. Giày và phụ kiện */}
            <tr>
              <td className="p-3 font-semibold text-[#B8AA96] bg-[#181311]/40">Giày và phụ kiện</td>
              <td className="p-3 border-l border-[#C9A66B]/15 leading-relaxed">
                <div><span className="text-[#8C7E6C]">Giày:</span> {propA.visual_details.footwear}</div>
                <div className="mt-0.5"><span className="text-[#8C7E6C]">Phụ kiện:</span> {propA.visual_details.accessories.join(', ')}</div>
              </td>
              <td className="p-3 border-l border-[#C9A66B]/15 leading-relaxed">
                <div><span className="text-[#8C7E6C]">Giày:</span> {propB.visual_details.footwear}</div>
                <div className="mt-0.5"><span className="text-[#8C7E6C]">Phụ kiện:</span> {propB.visual_details.accessories.join(', ')}</div>
              </td>
            </tr>

            {/* 5. Mức Remix */}
            <tr>
              <td className="p-3 font-semibold text-[#B8AA96] bg-[#181311]/40">Mức Remix</td>
              <td className="p-3 border-l border-[#C9A66B]/15">
                <span className="font-mono text-[#E6C88B] font-bold">Mức {propA.dial_level}/5</span>
                <span className="text-[#8C7E6C] ml-1.5">({DIAL_DESCRIPTIONS[propA.dial_level] || 'Bám sát tham chiếu'})</span>
              </td>
              <td className="p-3 border-l border-[#C9A66B]/15">
                <span className="font-mono text-[#F5A39D] font-bold">Mức {propB.dial_level}/5</span>
                <span className="text-[#8C7E6C] ml-1.5">({DIAL_DESCRIPTIONS[propB.dial_level] || 'Phá cách đương đại'})</span>
              </td>
            </tr>

            {/* 6. Cultural Audit summary */}
            <tr>
              <td className="p-3 font-semibold text-[#B8AA96] bg-[#181311]/40">Cultural Audit summary</td>
              <td className="p-3 border-l border-[#C9A66B]/15">
                {renderAuditCell(propA)}
              </td>
              <td className="p-3 border-l border-[#C9A66B]/15">
                {renderAuditCell(propB)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Comparison Cards (md:hidden) - Zero Horizontal Overflow */}
      <div className="md:hidden space-y-3">
        {[
          {
            title: 'Cấu trúc và phom',
            valA: `${propA.visual_details.collar_style} · ${propA.visual_details.lapel_side} · ${propA.visual_details.sleeve_style}`,
            valB: `${propB.visual_details.collar_style} · ${propB.visual_details.lapel_side} · ${propB.visual_details.sleeve_style}`,
          },
          {
            title: 'Chất liệu',
            valA: propA.visual_details.fabric_materials.join(', '),
            valB: propB.visual_details.fabric_materials.join(', '),
          },
          {
            title: 'Bảng màu',
            customRender: true,
            renderA: () => renderPaletteCell(propA.visual_details.color_palette),
            renderB: () => renderPaletteCell(propB.visual_details.color_palette),
          },
          {
            title: 'Giày và phụ kiện',
            valA: `${propA.visual_details.footwear} · ${propA.visual_details.accessories.join(', ')}`,
            valB: `${propB.visual_details.footwear} · ${propB.visual_details.accessories.join(', ')}`,
          },
          {
            title: 'Mức Remix',
            valA: `Mức ${propA.dial_level}/5 (${DIAL_DESCRIPTIONS[propA.dial_level] || 'Bám sát'})`,
            valB: `Mức ${propB.dial_level}/5 (${DIAL_DESCRIPTIONS[propB.dial_level] || 'Phá cách'})`,
          },
          {
            title: 'Cultural Audit summary',
            customRender: true,
            renderA: () => renderAuditCell(propA),
            renderB: () => renderAuditCell(propB),
          },
        ].map((item, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-[#181311]/70 border border-[#C9A66B]/15 space-y-2 text-xs">
            <span className="font-semibold text-[#E6C88B] block font-mono text-[11px] uppercase tracking-wider">
              {idx + 1}. {item.title}
            </span>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <div className="p-2 rounded-lg bg-[#211815]/80 border border-[#C9A66B]/20">
                <span className="text-[10px] font-mono uppercase text-[#E6C88B] font-bold block mb-1">
                  Bản A (Heritage)
                </span>
                {item.customRender && item.renderA ? (
                  item.renderA()
                ) : (
                  <p className="text-[#D4C7B4] leading-relaxed text-[11px]">{item.valA}</p>
                )}
              </div>
              <div className="p-2 rounded-lg bg-[#261A17]/80 border border-[#B8342B]/30">
                <span className="text-[10px] font-mono uppercase text-[#F5A39D] font-bold block mb-1">
                  Bản B (Contemporary)
                </span>
                {item.customRender && item.renderB ? (
                  item.renderB()
                ) : (
                  <p className="text-[#D4C7B4] leading-relaxed text-[11px]">{item.valB}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
