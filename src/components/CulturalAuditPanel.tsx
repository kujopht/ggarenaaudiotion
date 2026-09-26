import React from 'react';
import { CulturalAuditResult } from '../types/vietphuc';
import { ShieldCheck, AlertTriangle, HelpCircle, CheckCircle2, AlertOctagon } from 'lucide-react';

interface CulturalAuditPanelProps {
  audit: CulturalAuditResult;
  onOpenCKB?: (evidenceId?: string) => void;
}

export const CulturalAuditPanel: React.FC<CulturalAuditPanelProps> = ({ audit, onOpenCKB }) => {
  const isSupported = audit.status === 'Supported';
  const isCaution = audit.status === 'Supported with Caution';
  const isInsufficient = audit.status === 'Insufficient Evidence';

  return (
    <div className="border border-[#E2DBD0] bg-white rounded-xl p-5 shadow-xs space-y-4">
      {/* Institutional Audit Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#E2DBD0] gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-mono text-[#78716C] mb-0.5">
            CULTURAL HERITAGE AUDIT · THẨM ĐỊNH DI SẢN CKB
          </div>
          <h4 className="text-base font-serif font-bold text-[#1C1917]">
            Kết Luận Thẩm Định Chuẩn Hóa
          </h4>
        </div>

        {/* Audit Status Display */}
        <div className="flex items-center gap-2">
          {isSupported && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded-md text-xs font-bold font-sans">
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
              <span>SUPPORTED (HỢP THỨC DI SẢN)</span>
            </div>
          )}

          {isCaution && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] rounded-md text-xs font-bold font-sans">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>SUPPORTED WITH CAUTION (KHUYẾN CÁO)</span>
            </div>
          )}

          {isInsufficient && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded-md text-xs font-bold font-sans">
              <HelpCircle className="w-4 h-4 text-[#DC2626]" />
              <span>INSUFFICIENT EVIDENCE (THIẾU SỬ LIỆU)</span>
            </div>
          )}
        </div>
      </div>

      {/* Uncertainty Flag Banner */}
      {audit.uncertainty_flag && (
        <div className="p-3.5 bg-[#FEF2F2] border-l-4 border-[#DC2626] text-[#991B1B] rounded-r text-xs">
          <div className="font-bold flex items-center gap-1.5 mb-1 font-serif">
            <AlertOctagon className="w-4 h-4 text-[#DC2626]" />
            <span>UNCERTAINTY FLAG: DỮ LIỆU NGOÀI PHẠM VI CKB</span>
          </div>
          <p className="text-[#7F1D1D] leading-relaxed">
            {audit.uncertainty_note || 'Chi tiết này không tồn tại trong Cultural Knowledge Base (CKB) được cấp. Cần thận trọng đối chiếu trước khi hiện thực hóa.'}
          </p>
        </div>
      )}

      {/* Redline Warnings Banner */}
      {audit.cautions_and_redlines && audit.cautions_and_redlines.length > 0 && (
        <div className="p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-xs text-[#92400E]">
          <div className="font-bold flex items-center gap-1.5 text-[#B45309] mb-1.5 font-serif">
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
            <span>KHUYẾN CÁO & ĐIỀU KHOẢN GIÁM SÁT (CAUTIONS / REDLINES)</span>
          </div>
          <ul className="space-y-1.5 list-disc list-inside text-[#78350F] pl-1 font-medium leading-relaxed">
            {audit.cautions_and_redlines.map((caution, idx) => (
              <li key={idx}>
                {caution}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Auditor Verdict Prose */}
      <div className="text-xs text-[#44403C] leading-relaxed italic border-l-2 border-[#991B1B] pl-3 py-1 font-serif text-sm">
        "{audit.auditor_verdict}"
      </div>

      {/* Invariants & Mutables Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E2DBD0]">
        {/* Left Column: Invariants Checked */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-[#1C1917] mb-2 font-serif">
            <span>QUY THỨC BẤT BIẾN (INVARIANTS)</span>
            <span className="text-[11px] font-mono text-[#78716C]">{audit.invariants_checked.length} hạng mục</span>
          </div>

          <div className="space-y-2">
            {audit.invariants_checked.map((inv, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-[#FAF7F0] border border-[#E2DBD0] rounded-lg text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#1C1917] flex items-center gap-1.5">
                    {inv.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                    ) : (
                      <AlertOctagon className="w-3.5 h-3.5 text-[#DC2626]" />
                    )}
                    {inv.rule_name}
                  </span>
                  <button
                    onClick={() => onOpenCKB?.(inv.evidence_id)}
                    className="text-[10px] font-mono font-bold text-[#991B1B] hover:underline"
                  >
                    {inv.evidence_id}
                  </button>
                </div>
                <p className="text-[#57534E] leading-normal text-[11px]">{inv.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Mutables Used */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-[#1C1917] mb-2 font-serif">
            <span>VÙNG KHẢ BIẾN CÁCH TÂN (MUTABLES)</span>
            <span className="text-[11px] font-mono text-[#78716C]">{audit.mutables_used.length} ứng dụng</span>
          </div>

          {audit.mutables_used.length > 0 ? (
            <div className="space-y-2">
              {audit.mutables_used.map((mut, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#0369A1]">{mut.element}</span>
                    <button
                      onClick={() => onOpenCKB?.(mut.evidence_id)}
                      className="text-[10px] font-mono font-bold text-[#0284C7] hover:underline"
                    >
                      {mut.evidence_id}
                    </button>
                  </div>
                  <p className="text-[#0369A1] leading-normal text-[11px]">{mut.application}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-[#FAF7F0] border border-[#E2DBD0] rounded-lg text-xs text-[#78716C] italic">
              Phương án bám sát truyền thống, không can thiệp sâu vào vùng khả biến.
            </div>
          )}
        </div>
      </div>

      {/* CKB Evidence Footnote */}
      <div className="pt-3 border-t border-[#E2DBD0] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#78716C]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span>Hồ sơ dẫn chứng:</span>
          {audit.evidence_ids.map((id) => (
            <button
              key={id}
              onClick={() => onOpenCKB?.(id)}
              className="font-mono font-bold text-[#991B1B] hover:underline"
            >
              {id}
            </button>
          ))}
        </div>
        <span className="italic">Nguồn thẩm định độc quyền: Cultural Knowledge Base</span>
      </div>
    </div>
  );
};
