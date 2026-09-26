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
    <div className="border border-stone-200 bg-white rounded-lg p-5">
      {/* Institutional Audit Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-widest font-mono text-stone-500 mb-1">
            CULTURAL HERITAGE AUDIT · THẨM ĐỊNH DI SẢN CKB
          </div>
          <h4 className="text-base font-serif font-semibold text-stone-900">
            Kết Luận Thẩm Định Chuẩn Hóa
          </h4>
        </div>

        {/* Audit Status Display - Clean Editorial Stamp (No Candy Pills) */}
        <div className="flex items-center gap-2">
          {isSupported && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>SUPPORTED (HỢP THỨC DI SẢN)</span>
            </div>
          )}

          {isCaution && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>SUPPORTED WITH CAUTION (KHUYẾN CÁO)</span>
            </div>
          )}

          {isInsufficient && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs font-semibold">
              <HelpCircle className="w-4 h-4 text-rose-700" />
              <span>INSUFFICIENT EVIDENCE (THIẾU SỬ LIỆU)</span>
            </div>
          )}
        </div>
      </div>

      {/* Uncertainty Flag Banner (When applicable) */}
      {audit.uncertainty_flag && (
        <div className="mt-4 p-3.5 bg-rose-50 border-l-4 border-rose-600 text-rose-900 rounded-r text-xs">
          <div className="font-semibold flex items-center gap-1.5 mb-1">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span>UNCERTAINTY FLAG: DỮ LIỆU NGOÀI PHẠM VI CKB</span>
          </div>
          <p className="text-rose-800 leading-relaxed">
            {audit.uncertainty_note || 'Chi tiết này không tồn tại trong Cultural Knowledge Base (CKB) được cấp. Cần thận trọng đối chiếu trước khi hiện thực hóa.'}
          </p>
        </div>
      )}

      {/* Redline Warnings Banner (If any) */}
      {audit.cautions_and_redlines && audit.cautions_and_redlines.length > 0 && (
        <div className="mt-4 p-3.5 bg-amber-50/90 border border-amber-200 rounded text-xs text-amber-950">
          <div className="font-semibold flex items-center gap-1.5 text-amber-800 mb-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>KHUYẾN CÁO & ĐIỀU KHOẢN GIÁM SÁT (CAUTIONS / REDLINES)</span>
          </div>
          <ul className="space-y-1.5 list-disc list-inside text-amber-900 pl-1">
            {audit.cautions_and_redlines.map((caution, idx) => (
              <li key={idx} className="leading-relaxed">
                {caution}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Auditor Verdict Prose */}
      <div className="mt-4 text-xs text-stone-700 leading-relaxed italic border-l-2 border-stone-400 pl-3">
        "{audit.auditor_verdict}"
      </div>

      {/* Invariants & Mutables Breakdown Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-200">
        {/* Left Column: Invariants Checked */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-stone-900 mb-2">
            <span>QUY THỨC BẤT BIẾN (INVARIANTS)</span>
            <span className="text-[11px] font-mono text-stone-500">{audit.invariants_checked.length} hạng mục</span>
          </div>

          <div className="space-y-2">
            {audit.invariants_checked.map((inv, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-stone-50 border border-stone-200 rounded text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                    {inv.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    {inv.rule_name}
                  </span>
                  <button
                    onClick={() => onOpenCKB?.(inv.evidence_id)}
                    className="text-[10px] font-mono text-stone-600 hover:text-stone-900 underline underline-offset-2"
                  >
                    {inv.evidence_id}
                  </button>
                </div>
                <p className="text-stone-600 leading-normal text-[11px]">{inv.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Mutables Used */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-stone-900 mb-2">
            <span>VÙNG KHẢ BIẾN CÁCH TÂN (MUTABLES)</span>
            <span className="text-[11px] font-mono text-stone-500">{audit.mutables_used.length} ứng dụng</span>
          </div>

          {audit.mutables_used.length > 0 ? (
            <div className="space-y-2">
              {audit.mutables_used.map((mut, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-sky-50/60 border border-sky-200/80 rounded text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sky-900">{mut.element}</span>
                    <button
                      onClick={() => onOpenCKB?.(mut.evidence_id)}
                      className="text-[10px] font-mono text-sky-700 hover:text-sky-950 underline underline-offset-2"
                    >
                      {mut.evidence_id}
                    </button>
                  </div>
                  <p className="text-stone-600 leading-normal text-[11px]">{mut.application}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-stone-50 border border-stone-200 rounded text-xs text-stone-500 italic">
              Phương án bám sát truyền thống, không can thiệp sâu vào vùng khả biến.
            </div>
          )}
        </div>
      </div>

      {/* CKB Evidence Footnote */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span>Hồ sơ dẫn chứng:</span>
          {audit.evidence_ids.map((id) => (
            <button
              key={id}
              onClick={() => onOpenCKB?.(id)}
              className="font-mono text-stone-700 hover:text-stone-950 underline underline-offset-2"
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
