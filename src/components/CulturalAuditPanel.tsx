import React, { useState } from 'react';
import { CulturalAuditResult } from '../types/vietphuc';
import { ShieldCheck, AlertTriangle, HelpCircle, CheckCircle2, AlertOctagon, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface CulturalAuditPanelProps {
  audit: CulturalAuditResult;
  onOpenCKB?: (evidenceId?: string) => void;
}

export const CulturalAuditPanel: React.FC<CulturalAuditPanelProps> = ({ audit, onOpenCKB }) => {
  const [showDetails, setShowDetails] = useState(false);

  const hasCaution = Boolean(
    audit.status === 'Supported with Caution' ||
    (audit.cautions_and_redlines && audit.cautions_and_redlines.length > 0)
  );
  const hasUncertainty = Boolean(
    audit.uncertainty_flag ||
    audit.status === 'Insufficient Evidence'
  );
  const isPurelySupported = !hasCaution && !hasUncertainty && audit.status === 'Supported';

  return (
    <div className="lacquer-panel rounded-xl p-4 sm:p-5 space-y-4">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#C9A66B]/20 gap-3">
        <div>
          <span className="text-xs font-mono text-[#C9A66B] font-semibold tracking-wide block mb-0.5">
            GHI CHÚ THAM CHIẾU VĂN HÓA
          </span>
          <h4 className="text-base font-serif font-bold text-[#F2E9D8]">
            Tóm tắt mức độ phù hợp với quy tắc tham chiếu
          </h4>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {isPurelySupported && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A66B]/15 border border-[#C9A66B]/40 text-[#E6C88B] rounded-lg text-xs font-semibold backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-[#E6C88B]" />
              <span>Phù hợp với quy tắc tham chiếu của bản thử nghiệm</span>
            </div>
          )}

          {hasCaution && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold backdrop-blur-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Có điểm cần lưu ý theo quy tắc tham chiếu</span>
            </div>
          )}

          {hasUncertainty && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/15 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-semibold backdrop-blur-xs">
              <HelpCircle className="w-4 h-4 text-rose-400" />
              <span>Chưa đủ dữ liệu tham chiếu</span>
            </div>
          )}
        </div>
      </div>

      {/* Uncertainty Flag Banner (Always visible if present) */}
      {audit.uncertainty_flag && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 text-rose-200 rounded-lg text-sm backdrop-blur-xs">
          <div className="font-semibold flex items-center gap-1.5 mb-1 text-rose-300">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>Chi tiết nằm ngoài dữ liệu tham chiếu của bản thử nghiệm</span>
          </div>
          <p className="text-rose-200/90 leading-relaxed text-xs sm:text-sm">
            {audit.uncertainty_note || 'Chi tiết này chưa có căn cứ trong tài liệu tham chiếu hiện tại của bản thử nghiệm. Nên xem đây là nét sáng tạo tự do.'}
          </p>
        </div>
      )}

      {/* Redlines & Important Warnings (Always visible if present) */}
      {audit.cautions_and_redlines && audit.cautions_and_redlines.length > 0 && (
        <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-lg text-sm text-amber-200 backdrop-blur-xs">
          <div className="font-semibold flex items-center gap-1.5 text-amber-300 mb-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Điểm cần lưu ý theo quy tắc tham chiếu:</span>
          </div>
          <ul className="space-y-1 list-disc list-inside text-amber-200/90 text-xs sm:text-sm leading-relaxed pl-1">
            {audit.cautions_and_redlines.map((caution, idx) => (
              <li key={idx}>{caution}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Auditor Verdict Summary Prose */}
      <div className="text-sm sm:text-base text-[#F2E9D8] leading-relaxed border-l-2 border-[#C9A66B] pl-3 py-1 font-serif">
        "{audit.auditor_verdict}"
      </div>

      {/* Expandable Deep Dive Toggle */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-2 px-3 rounded-lg bg-[#261C19]/70 hover:bg-[#322521] text-xs font-semibold text-[#B8AA96] hover:text-[#F2E9D8] border border-[#C9A66B]/25 flex items-center justify-between transition-colors cursor-pointer min-h-[40px] backdrop-blur-xs"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#C9A66B]" />
            <span>{showDetails ? 'Thu gọn chi tiết quy tắc' : 'Xem chi tiết các quy tắc cốt lõi & vùng sáng tạo'}</span>
          </span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetails && (
          <div className="mt-3 pt-3 border-t border-[#C9A66B]/15 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Core Rules (Invariants) */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#F2E9D8] mb-2">
                  <span>Quy thức cốt lõi (Không nên đổi)</span>
                  <span className="text-[11px] font-mono text-[#8C7E6C]">{audit.invariants_checked.length} hạng mục</span>
                </div>

                <div className="space-y-2">
                  {audit.invariants_checked.map((inv, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-[#211815]/60 border border-[#C9A66B]/15 rounded-lg text-xs backdrop-blur-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[#F2E9D8] flex items-center gap-1.5">
                          {inv.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#43B6A4]" />
                          ) : (
                            <AlertOctagon className="w-3.5 h-3.5 text-[#B8342B]" />
                          )}
                          {inv.rule_name}
                        </span>
                        <button
                          type="button"
                          onClick={() => onOpenCKB?.(inv.evidence_id)}
                          className="text-[10px] font-mono font-medium text-[#C9A66B] hover:underline cursor-pointer"
                        >
                          {inv.evidence_id}
                        </button>
                      </div>
                      <p className="text-[#B8AA96] leading-normal text-[11px]">{inv.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Creative Freedom (Mutables) */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#F2E9D8] mb-2">
                  <span>Vùng tự do sáng tạo (Được phép biến tấu)</span>
                  <span className="text-[11px] font-mono text-[#8C7E6C]">{audit.mutables_used.length} ứng dụng</span>
                </div>

                {audit.mutables_used.length > 0 ? (
                  <div className="space-y-2">
                    {audit.mutables_used.map((mut, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#261C19]/60 border border-[#C9A66B]/25 rounded-lg text-xs backdrop-blur-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-[#E6C88B]">{mut.element}</span>
                          <button
                            type="button"
                            onClick={() => onOpenCKB?.(mut.evidence_id)}
                            className="text-[10px] font-mono font-medium text-[#C9A66B] hover:underline cursor-pointer"
                          >
                            {mut.evidence_id}
                          </button>
                        </div>
                        <p className="text-[#F2E9D8]/80 leading-normal text-[11px]">{mut.application}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-[#211815] border border-[#3A2B25] rounded-lg text-xs text-[#8C7E6C] italic">
                    Bản phối bám sát truyền thống, không can thiệp nhiều vào vùng biến tấu.
                  </div>
                )}
              </div>
            </div>

            {/* Evidence Footnote */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#B8AA96]">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>Hồ sơ dẫn chứng:</span>
                {audit.evidence_ids.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onOpenCKB?.(id)}
                    className="font-mono font-medium text-[#C9A66B] hover:underline cursor-pointer"
                  >
                    {id}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-[#8C7E6C]">Tham chiếu theo Cultural Knowledge Base (CKB) bản thử nghiệm</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
