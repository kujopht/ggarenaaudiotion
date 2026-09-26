import React, { useState } from 'react';
import { CulturalAuditResult } from '../types/vietphuc';
import { CKB_REGISTRY, formatGarmentScopeLabel, formatVerificationStatusBadge } from '../data/ckbRegistry';
import { ShieldCheck, AlertTriangle, HelpCircle, CheckCircle2, AlertOctagon, ChevronDown, ChevronUp, BookOpen, FileCheck, Layers, Sparkles, FileText, Info } from 'lucide-react';

interface CulturalAuditPanelProps {
  audit: CulturalAuditResult;
  onOpenCKB?: (evidenceId?: string) => void;
}

export const CulturalAuditPanel: React.FC<CulturalAuditPanelProps> = ({ audit, onOpenCKB }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedEvidenceId, setExpandedEvidenceId] = useState<string | null>(null);

  const toggleEvidenceDetail = (evidenceId: string) => {
    setExpandedEvidenceId((prev) => (prev === evidenceId ? null : evidenceId));
  };

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
            GHI CHÚ THAM CHIẾU VĂN HÓA (SUBMISSION HARDENING)
          </span>
          <h4 className="text-base font-serif font-bold text-[#F2E9D8]">
            Đối soát quy tắc tham chiếu & nguồn sử liệu
          </h4>
        </div>

        {/* Two-Layer Status Badges (Requirement 4, 5 & 7) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Lớp 1: Prototype Compliance */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-xs border bg-[#241A17] border-[#C9A66B]/30">
            {audit.prototype_compliance === 'conflict' ? (
              <div className="flex items-center gap-1.5 text-rose-300">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Có xung đột với quy tắc prototype</span>
              </div>
            ) : audit.prototype_compliance === 'unassessed' || audit.status === 'Insufficient Evidence' ? (
              <div className="flex items-center gap-1.5 text-neutral-300">
                <HelpCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>Chưa đối soát quy tắc prototype</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[#E6C88B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A66B] shrink-0" />
                <span>Phù hợp với quy tắc prototype</span>
              </div>
            )}
          </div>

          {/* Badge cảnh báo thiết kế (chỉ hiện khi có design caution thật và không phải conflict) */}
          {audit.has_design_caution && audit.prototype_compliance !== 'conflict' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-xs border bg-[#241A17] border-amber-600/40 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Có điểm cần lưu ý về thiết kế</span>
            </div>
          )}

          {/* Lớp 2: Historical Confidence */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-xs border bg-[#1A1412] border-neutral-700/50">
            {audit.historical_confidence === 'verified' ? (
              <div className="flex items-center gap-1.5 text-emerald-300">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Đã đối chiếu nguồn thư tịch</span>
              </div>
            ) : audit.historical_confidence === 'needs_review' ? (
              <div className="flex items-center gap-1.5 text-amber-300">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Nguồn lịch sử cần rà soát thêm</span>
              </div>
            ) : audit.historical_confidence === 'partially_verified' ? (
              <div className="flex items-center gap-1.5 text-amber-200">
                <Layers className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Nguồn đối chiếu một phần</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>Nguồn lịch sử chưa xác minh độc lập</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System & Data Warnings (Technical info in neutral blue-gray, not red or yellow) */}
      {audit.system_warnings && audit.system_warnings.length > 0 && (
        <div className="p-3 bg-slate-900/60 border border-slate-700/60 text-slate-300 rounded-lg text-xs backdrop-blur-xs">
          <div className="font-semibold flex items-center gap-1.5 text-slate-200 mb-1">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Thông tin dữ liệu kỹ thuật:</span>
          </div>
          <ul className="space-y-0.5 list-disc list-inside text-slate-300/90 pl-1 leading-relaxed">
            {audit.system_warnings.map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Uncertainty Flag Banner (Always visible if present) */}
      {audit.uncertainty_flag && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 text-rose-200 rounded-lg text-sm backdrop-blur-xs">
          <div className="font-semibold flex items-center gap-1.5 mb-1 text-rose-300">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Minh bạch về độ tin cậy của nguồn tham chiếu:</span>
          </div>
          <p className="text-rose-200/90 leading-relaxed text-xs sm:text-sm">
            {audit.uncertainty_note || audit.verification_summary || 'Các quy tắc tham chiếu trong bản thử nghiệm hiện chưa được đối chiếu thư tịch độc lập. Vui lòng xem đây là đề xuất thử nghiệm mang tính chất tham khảo.'}
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
            <span>{showDetails ? 'Thu gọn chi tiết nguồn & quy tắc' : 'Xem chi tiết các quy tắc cốt lõi, vùng sáng tạo & nguồn tham chiếu'}</span>
          </span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetails && (
          <div className="mt-3 pt-3 border-t border-[#C9A66B]/15 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Core Rules (Invariants) */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#F2E9D8] mb-2">
                  <span>Quy thức cốt lõi (Invariants)</span>
                  <span className="text-[11px] font-mono text-[#8C7E6C]">{audit.invariants_checked.length} hạng mục</span>
                </div>

                <div className="space-y-2">
                  {audit.invariants_checked.map((inv, idx) => {
                    const ckbEntry = CKB_REGISTRY.find((e) => e.id === inv.evidence_id);
                    const isVerified = ckbEntry?.verification_status === 'verified';
                    const isExpanded = expandedEvidenceId === inv.evidence_id;
                    const verificationBadge = ckbEntry ? formatVerificationStatusBadge(ckbEntry.verification_status) : null;

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 bg-[#211815]/60 border rounded-lg text-xs backdrop-blur-xs space-y-2 transition-all ${
                          isExpanded ? 'border-[#C9A66B]/50 bg-[#281E1A]' : 'border-[#C9A66B]/15'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="font-medium text-[#F2E9D8] flex items-center gap-1.5">
                            {inv.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#43B6A4] shrink-0" />
                            ) : (
                              <AlertOctagon className="w-3.5 h-3.5 text-[#B8342B] shrink-0" />
                            )}
                            <span>{inv.rule_name}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleEvidenceDetail(inv.evidence_id)}
                            className={`text-[10px] font-mono font-medium hover:underline cursor-pointer flex items-center gap-1 px-1.5 py-0.5 rounded border transition-colors ${
                              isExpanded
                                ? 'bg-[#C9A66B]/20 text-[#E6C88B] border-[#C9A66B]'
                                : 'bg-[#261C19] text-[#C9A66B] border-[#C9A66B]/30'
                            }`}
                            title="Bấm để mở hồ sơ nguồn tham chiếu"
                          >
                            <span>{inv.evidence_id}</span>
                            {isVerified ? (
                              <span className="text-[9px] text-emerald-400 font-sans">✓ Có nguồn</span>
                            ) : ckbEntry?.verification_status === 'needs_review' ? (
                              <span className="text-[9px] text-amber-400 font-sans">! Cần rà soát</span>
                            ) : (
                              <span className="text-[9px] text-neutral-400 font-sans">? Chưa xác minh</span>
                            )}
                          </button>
                        </div>

                        <p className="text-[#B8AA96] leading-normal text-[11px]">{inv.detail}</p>

                        {/* Inline Expandable Drawer: Requirement 6 */}
                        {isExpanded && ckbEntry && (
                          <div className="p-3 bg-[#181311] border border-[#C9A66B]/30 rounded-lg space-y-2.5 text-xs animate-in fade-in duration-150">
                            <div>
                              <div className="text-[10px] font-mono text-[#8C7E6C] uppercase">Tên quy tắc:</div>
                              <div className="font-serif font-bold text-[#F2E9D8] text-sm">{ckbEntry.title}</div>
                            </div>

                            <div>
                              <div className="text-[10px] font-mono text-[#8C7E6C] uppercase">Nội dung quy tắc:</div>
                              <div className="text-[#D4C7B4] leading-relaxed text-[11px]">{ckbEntry.core_rule}</div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-[11px]">
                              <span className="text-[#8C7E6C] font-mono">Phạm vi áp dụng:</span>
                              <strong className="text-[#E6C88B] font-mono px-1.5 py-0.5 bg-[#261C19] rounded border border-[#C9A66B]/20">
                                {formatGarmentScopeLabel(ckbEntry.garment_scope)}
                              </strong>
                              <span className="text-[#8C7E6C]">·</span>
                              <span className={`px-1.5 py-0.5 rounded border text-[10px] font-mono ${verificationBadge?.badgeClass}`}>
                                {verificationBadge?.label}
                              </span>
                            </div>

                            {/* 3 Information Tiers (Requirement 3) */}
                            <div className="space-y-1.5 pt-1 border-t border-[#C9A66B]/15 text-[11px]">
                              <div className="p-1.5 bg-[#211815] rounded border border-[#C9A66B]/10">
                                <span className="text-emerald-400 font-semibold block text-[10px] font-mono uppercase">
                                  1. Căn cứ lịch sử:
                                </span>
                                <span className="text-[#B8AA96]">
                                  {ckbEntry.information_tier?.historical_claim || ckbEntry.historical_context}
                                </span>
                              </div>
                              <div className="p-1.5 bg-[#211815] rounded border border-[#C9A66B]/10">
                                <span className="text-[#43B6A4] font-semibold block text-[10px] font-mono uppercase">
                                  2. Quy ước nội bộ prototype:
                                </span>
                                <span className="text-[#D4C7B4]">
                                  {ckbEntry.information_tier?.prototype_rule || ckbEntry.core_rule}
                                </span>
                              </div>
                              <div className="p-1.5 bg-[#211815] rounded border border-[#C9A66B]/10">
                                <span className="text-[#E6C88B] font-semibold block text-[10px] font-mono uppercase">
                                  3. Gợi ý sáng tạo đương đại:
                                </span>
                                <span className="text-[#B8AA96]">
                                  {ckbEntry.information_tier?.contemporary_suggestion || ckbEntry.creative_boundary}
                                </span>
                              </div>
                            </div>

                            {/* Source reference citation */}
                            <div className="pt-1.5 border-t border-[#C9A66B]/15">
                              {ckbEntry.source_title ? (
                                <div
                                  className={`font-mono text-[11px] space-y-0.5 ${
                                    isVerified
                                      ? 'text-emerald-300'
                                      : ckbEntry.verification_status === 'needs_review'
                                      ? 'text-amber-300'
                                      : 'text-neutral-300'
                                  }`}
                                >
                                  <div>
                                    {isVerified
                                      ? 'Nguồn đã đối chiếu: '
                                      : ckbEntry.verification_status === 'needs_review'
                                      ? 'Nguồn tham chiếu đang chờ đối soát: '
                                      : 'Nguồn tham chiếu chưa xác minh: '}
                                    <strong>{ckbEntry.source_title}</strong>
                                  </div>
                                  {ckbEntry.source_author_or_org && (
                                    <div className="text-[10px] opacity-80">
                                      Tác giả/Cơ quan: {ckbEntry.source_author_or_org}
                                    </div>
                                  )}
                                  {ckbEntry.source_page && (
                                    <div className="text-[10px] opacity-80">
                                      Trang/Quyển: {ckbEntry.source_page}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-neutral-400 text-[11px] italic">
                                  Chưa có nguồn xác minh trong bản thử nghiệm. {ckbEntry.notes}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => onOpenCKB?.(inv.evidence_id)}
                              className="w-full mt-2 py-1 px-2 rounded bg-[#2E201B] hover:bg-[#3E2C25] text-[#C9A66B] text-[11px] font-semibold text-center border border-[#C9A66B]/30 cursor-pointer"
                            >
                              Mở toàn màn hình trong CKB Explorer →
                            </button>
                          </div>
                        )}

                        {/* Source reference citation inline */}
                        <div className="text-[10px] pt-1 border-t border-[#C9A66B]/10 flex items-center justify-between text-[#8C7E6C]">
                          {ckbEntry?.source_title ? (
                            <span
                              className={`font-mono ${
                                isVerified
                                  ? 'text-emerald-300/90'
                                  : ckbEntry.verification_status === 'needs_review'
                                  ? 'text-amber-300/90'
                                  : 'text-neutral-400'
                              }`}
                            >
                              {isVerified
                                ? 'Nguồn đã đối chiếu: '
                                : ckbEntry.verification_status === 'needs_review'
                                ? 'Nguồn chờ đối soát: '
                                : 'Nguồn tham khảo: '}
                              {ckbEntry.source_title}
                            </span>
                          ) : (
                            <span className="text-neutral-400 italic">
                              Chưa có nguồn xác minh trong bản thử nghiệm
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleEvidenceDetail(inv.evidence_id)}
                            className="text-[#C9A66B] hover:underline cursor-pointer text-[10px]"
                          >
                            {isExpanded ? 'Đóng hồ sơ ↑' : 'Xem hồ sơ →'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Creative Freedom (Mutables) */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#F2E9D8] mb-2">
                  <span>Vùng tự do sáng tạo (Mutables)</span>
                  <span className="text-[11px] font-mono text-[#8C7E6C]">{audit.mutables_used.length} ứng dụng</span>
                </div>

                {audit.mutables_used.length > 0 ? (
                  <div className="space-y-2">
                    {audit.mutables_used.map((mut, idx) => {
                      const ckbEntry = CKB_REGISTRY.find((e) => e.id === mut.evidence_id);
                      const isVerified = ckbEntry?.verification_status === 'verified';
                      const isExpanded = expandedEvidenceId === mut.evidence_id;
                      const verificationBadge = ckbEntry ? formatVerificationStatusBadge(ckbEntry.verification_status) : null;

                      return (
                        <div
                          key={idx}
                          className={`p-2.5 bg-[#261C19]/60 border rounded-lg text-xs backdrop-blur-xs space-y-2 transition-all ${
                            isExpanded ? 'border-[#C9A66B]/50 bg-[#281E1A]' : 'border-[#C9A66B]/25'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <span className="font-medium text-[#E6C88B]">{mut.element}</span>
                            <button
                              type="button"
                              onClick={() => toggleEvidenceDetail(mut.evidence_id)}
                              className={`text-[10px] font-mono font-medium hover:underline cursor-pointer flex items-center gap-1 px-1.5 py-0.5 rounded border transition-colors ${
                                isExpanded
                                  ? 'bg-[#C9A66B]/20 text-[#E6C88B] border-[#C9A66B]'
                                  : 'bg-[#181311] text-[#C9A66B] border-[#C9A66B]/30'
                              }`}
                              title="Bấm để mở hồ sơ nguồn tham chiếu"
                            >
                              <span>{mut.evidence_id}</span>
                              {isVerified ? (
                                <span className="text-[9px] text-emerald-400 font-sans">✓ Có nguồn</span>
                              ) : ckbEntry?.verification_status === 'needs_review' ? (
                                <span className="text-[9px] text-amber-400 font-sans">! Cần rà soát</span>
                              ) : (
                                <span className="text-[9px] text-neutral-400 font-sans">? Chưa xác minh</span>
                              )}
                            </button>
                          </div>
                          <p className="text-[#F2E9D8]/80 leading-normal text-[11px]">{mut.application}</p>

                          {/* Inline Expandable Drawer for Mutables: Requirement 6 */}
                          {isExpanded && ckbEntry && (
                            <div className="p-3 bg-[#181311] border border-[#C9A66B]/30 rounded-lg space-y-2.5 text-xs animate-in fade-in duration-150">
                              <div>
                                <div className="text-[10px] font-mono text-[#8C7E6C] uppercase">Tên quy tắc:</div>
                                <div className="font-serif font-bold text-[#F2E9D8] text-sm">{ckbEntry.title}</div>
                              </div>

                              <div>
                                <div className="text-[10px] font-mono text-[#8C7E6C] uppercase">Nội dung quy tắc:</div>
                                <div className="text-[#D4C7B4] leading-relaxed text-[11px]">{ckbEntry.core_rule}</div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                <span className="text-[#8C7E6C] font-mono">Phạm vi áp dụng:</span>
                                <strong className="text-[#E6C88B] font-mono px-1.5 py-0.5 bg-[#261C19] rounded border border-[#C9A66B]/20">
                                  {formatGarmentScopeLabel(ckbEntry.garment_scope)}
                                </strong>
                                <span className="text-[#8C7E6C]">·</span>
                                <span className={`px-1.5 py-0.5 rounded border text-[10px] font-mono ${verificationBadge?.badgeClass}`}>
                                  {verificationBadge?.label}
                                </span>
                              </div>

                              {/* 3 Information Tiers (Requirement 3) */}
                              <div className="space-y-1.5 pt-1 border-t border-[#C9A66B]/15 text-[11px]">
                                <div className="p-1.5 bg-[#211815] rounded border border-[#C9A66B]/10">
                                  <span className="text-emerald-400 font-semibold block text-[10px] font-mono uppercase">
                                    1. Căn cứ lịch sử:
                                  </span>
                                  <span className="text-[#B8AA96]">
                                    {ckbEntry.information_tier?.historical_claim || ckbEntry.historical_context}
                                  </span>
                                </div>
                                <div className="p-1.5 bg-[#211815] rounded border border-[#C9A66B]/10">
                                  <span className="text-[#43B6A4] font-semibold block text-[10px] font-mono uppercase">
                                    2. Quy ước nội bộ prototype:
                                  </span>
                                  <span className="text-[#D4C7B4]">
                                    {ckbEntry.information_tier?.prototype_rule || ckbEntry.core_rule}
                                  </span>
                                </div>
                                <div className="p-1.5 bg-[#211815] rounded border border-[#C9A66B]/10">
                                  <span className="text-[#E6C88B] font-semibold block text-[10px] font-mono uppercase">
                                    3. Gợi ý sáng tạo đương đại:
                                  </span>
                                  <span className="text-[#B8AA96]">
                                    {ckbEntry.information_tier?.contemporary_suggestion || ckbEntry.creative_boundary}
                                  </span>
                                </div>
                              </div>

                              <div className="pt-1.5 border-t border-[#C9A66B]/15 text-neutral-400 text-[11px] italic">
                                Quy ước thử nghiệm nội bộ của lab. {ckbEntry.notes}
                              </div>

                              <button
                                type="button"
                                onClick={() => onOpenCKB?.(mut.evidence_id)}
                                className="w-full mt-2 py-1 px-2 rounded bg-[#2E201B] hover:bg-[#3E2C25] text-[#C9A66B] text-[11px] font-semibold text-center border border-[#C9A66B]/30 cursor-pointer"
                              >
                                Mở toàn màn hình trong CKB Explorer →
                              </button>
                            </div>
                          )}

                          <div className="text-[10px] pt-1 border-t border-[#C9A66B]/10 flex items-center justify-between text-[#8C7E6C]">
                            <span className="text-neutral-400 italic">
                              Quy ước thử nghiệm nội bộ của lab
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleEvidenceDetail(mut.evidence_id)}
                              className="text-[#C9A66B] hover:underline cursor-pointer text-[10px]"
                            >
                              {isExpanded ? 'Đóng hồ sơ ↑' : 'Xem hồ sơ →'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 bg-[#211815] border border-[#3A2B25] rounded-lg text-xs text-[#8C7E6C] italic">
                    Bản phối bám sát truyền thống, không can thiệp nhiều vào vùng biến tấu.
                  </div>
                )}
              </div>
            </div>

            {/* Evidence Footnote with verification tags */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#B8AA96] border-t border-[#C9A66B]/15">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-[#D4C7B4]">Hồ sơ quy tắc tham chiếu:</span>
                {audit.evidence_ids.map((id) => {
                  const entry = CKB_REGISTRY.find((e) => e.id === id);
                  const isVerified = entry?.verification_status === 'verified';

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onOpenCKB?.(id)}
                      className={`font-mono text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                        isVerified
                          ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:border-emerald-400'
                          : 'border-[#C9A66B]/25 bg-[#211815] text-[#C9A66B] hover:border-[#C9A66B]'
                      }`}
                      title={isVerified ? `Đã có nguồn: ${entry?.source_title}` : 'Chưa có nguồn xác minh trong bản thử nghiệm'}
                    >
                      <span>{id}</span>
                      {isVerified ? (
                        <span className="text-[9px] text-emerald-400">✓</span>
                      ) : entry?.verification_status === 'needs_review' ? (
                        <span className="text-[9px] text-amber-400">!</span>
                      ) : (
                        <span className="text-[9px] text-neutral-400">?</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] text-[#8C7E6C]">
                Phân tách minh bạch giữa quy tắc có nguồn khảo cứu và quy ước giả định thử nghiệm.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
