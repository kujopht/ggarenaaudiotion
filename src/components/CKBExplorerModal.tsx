import React, { useState, useEffect } from 'react';
import { CKB_REGISTRY, formatGarmentScopeLabel, formatVerificationStatusBadge } from '../data/ckbRegistry';
import { X, Search, BookOpen, ShieldCheck, AlertCircle, FileText, Layers, Sparkles } from 'lucide-react';

interface CKBExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightId?: string | null;
}

export const CKBExplorerModal: React.FC<CKBExplorerModalProps> = ({
  isOpen,
  onClose,
  highlightId,
}) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'invariant' | 'mutable' | 'sacred_rule'>('all');
  const [filterVerification, setFilterVerification] = useState<'all' | 'verified' | 'needs_review' | 'unverified'>('all');

  const verifiedCount = CKB_REGISTRY.filter((r) => r.verification_status === 'verified').length;
  const needsReviewCount = CKB_REGISTRY.filter((r) => r.verification_status === 'needs_review' || r.verification_status === 'needs_research').length;
  const unverifiedCount = CKB_REGISTRY.filter((r) => r.verification_status === 'unverified').length;

  useEffect(() => {
    if (isOpen && highlightId) {
      setTimeout(() => {
        const el = document.getElementById(`ckb-modal-${highlightId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [isOpen, highlightId]);

  if (!isOpen) return null;

  const filteredEntries = CKB_REGISTRY.filter((entry) => {
    const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
    const matchesVerification =
      filterVerification === 'all' ||
      (filterVerification === 'verified' && entry.verification_status === 'verified') ||
      (filterVerification === 'needs_review' && (entry.verification_status === 'needs_review' || entry.verification_status === 'needs_research')) ||
      (filterVerification === 'unverified' && entry.verification_status === 'unverified');

    const matchesSearch =
      entry.id.toLowerCase().includes(search.toLowerCase()) ||
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.core_rule.toLowerCase().includes(search.toLowerCase()) ||
      entry.historical_context.toLowerCase().includes(search.toLowerCase()) ||
      (entry.source_title && entry.source_title.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesVerification && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] lacquer-card-elevated rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-[#C9A66B]/30">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#C9A66B]/20 bg-[#181311]/85 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#B8342B]/25 text-[#C9A66B] border border-[#C9A66B]/40 flex items-center justify-center font-bold text-xs shrink-0">
              CKB
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#C9A66B] font-semibold">
                KHO QUY THỨC & NGUỒN THAM CHIẾU (SUBMISSION HARDENING)
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#F2E9D8]">
                Cultural Knowledge Base (CKB) & Minh Bạch Nguồn Sử Liệu
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#B8AA96] hover:text-[#F2E9D8] rounded-lg hover:bg-[#261C19] transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ tra cứu CKB"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3.5 sm:p-4 px-5 sm:px-6 bg-[#181311]/70 border-b border-[#C9A66B]/20 flex flex-col gap-3 backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#8C7E6C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm mã điều khoản, tên quy tắc, nguồn..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#140F0E]/80 border border-[#C9A66B]/25 rounded-xl text-[#F2E9D8] placeholder:text-[#6E5D53] focus:outline-none focus:border-[#C9A66B]"
              />
            </div>

            {/* Verification status quick filter */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-mono">
              <span className="text-[#8C7E6C] text-[11px] mr-1 hidden sm:inline">Trạng thái nguồn:</span>
              <button
                type="button"
                onClick={() => setFilterVerification('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                  filterVerification === 'all'
                    ? 'border-[#C9A66B] bg-[#C9A66B]/20 text-[#E6C88B]'
                    : 'border-[#C9A66B]/20 text-[#8C7E6C] hover:text-[#B8AA96]'
                }`}
              >
                Tất cả ({CKB_REGISTRY.length})
              </button>
              {verifiedCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilterVerification('verified')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                    filterVerification === 'verified'
                      ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                      : 'border-[#C9A66B]/20 text-[#8C7E6C] hover:text-[#B8AA96]'
                  }`}
                >
                  Đã có nguồn ({verifiedCount})
                </button>
              )}
              <button
                type="button"
                onClick={() => setFilterVerification('needs_review')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                  filterVerification === 'needs_review'
                    ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                    : 'border-[#C9A66B]/20 text-[#8C7E6C] hover:text-[#B8AA96]'
                }`}
              >
                Cần rà soát ({needsReviewCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterVerification('unverified')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                  filterVerification === 'unverified'
                    ? 'border-neutral-500/50 bg-neutral-500/20 text-neutral-200'
                    : 'border-[#C9A66B]/20 text-[#8C7E6C] hover:text-[#B8AA96]'
                }`}
              >
                Chưa xác minh ({unverifiedCount})
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-[#2E201B] text-[#C9A66B] border border-[#C9A66B]/60'
                  : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#140F0E]/70 border border-[#C9A66B]/20'
              }`}
            >
              Tất cả thể loại
            </button>
            <button
              onClick={() => setFilterCategory('invariant')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'invariant'
                  ? 'bg-[#2E201B] text-[#43B6A4] border border-[#43B6A4]/60'
                  : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#140F0E]/70 border border-[#C9A66B]/20'
              }`}
            >
              Bất biến (Invariants)
            </button>
            <button
              onClick={() => setFilterCategory('mutable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'mutable'
                  ? 'bg-[#2E201B] text-[#E6C88B] border border-[#C9A66B]/60'
                  : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#140F0E]/70 border border-[#C9A66B]/20'
              }`}
            >
              Khả biến (Mutables)
            </button>
            <button
              onClick={() => setFilterCategory('sacred_rule')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'sacred_rule'
                  ? 'bg-[#2E201B] text-[#F5A39D] border border-[#B8342B]/60'
                  : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#140F0E]/70 border border-[#C9A66B]/20'
              }`}
            >
              Cấm kỵ (Redlines)
            </button>
          </div>
        </div>

        {/* List of Entries */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {filteredEntries.map((entry) => {
            const isHighlighted = highlightId === entry.id;
            const isInvariant = entry.category === 'invariant';
            const isMutable = entry.category === 'mutable';
            const verificationBadge = formatVerificationStatusBadge(entry.verification_status);

            return (
              <div
                key={entry.id}
                id={`ckb-modal-${entry.id}`}
                className={`p-4 sm:p-5 rounded-xl border transition-all space-y-3.5 ${
                  isHighlighted
                    ? 'border-[#C9A66B] bg-[#2E201B]/95 shadow-lg ring-2 ring-[#C9A66B]/70'
                    : 'border-[#C9A66B]/20 bg-[#181311]/70'
                }`}
              >
                {/* Header Row: ID, Category, Garment Scope, Verification Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#C9A66B]/15">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#C9A66B] bg-[#C9A66B]/10 px-2 py-0.5 rounded border border-[#C9A66B]/30">
                      {entry.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                        isInvariant
                          ? 'border-[#43B6A4]/40 text-[#43B6A4] bg-[#43B6A4]/10'
                          : isMutable
                          ? 'border-[#C9A66B]/40 text-[#E6C88B] bg-[#C9A66B]/10'
                          : 'border-[#B8342B]/40 text-[#F5A39D] bg-[#B8342B]/10'
                      }`}
                    >
                      {isInvariant ? 'BẤT BIẾN' : isMutable ? 'KHẢ BIẾN' : 'CẤM KỴ'}
                    </span>
                    {/* Garment Scope Badge */}
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-[#8C7E6C]/30 text-[#D4C7B4] bg-[#261C19]/60">
                      Phạm vi: {formatGarmentScopeLabel(entry.garment_scope)}
                    </span>
                  </div>

                  {/* Verification Status Badge */}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border flex items-center gap-1 ${verificationBadge.badgeClass}`}>
                      {verificationBadge.isVerified ? (
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-neutral-400" />
                      )}
                      <span>{verificationBadge.label}</span>
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-base sm:text-lg font-serif font-bold text-[#F2E9D8]">
                  {entry.title}
                </h4>

                {/* Requirement 3: 3 distinct information tiers with explicit certainty separation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                  {/* Tier 1: Căn cứ lịch sử */}
                  <div className={`p-3 rounded-lg border space-y-1.5 ${
                    entry.verification_status === 'verified'
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-[#211815]/70 border-[#C9A66B]/15'
                  }`}>
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <div className="font-semibold text-[#D4C7B4] flex items-center gap-1.5 text-[11px] uppercase font-mono">
                        <BookOpen className="w-3.5 h-3.5 text-[#C9A66B]" />
                        <span>1. Căn cứ lịch sử</span>
                      </div>
                      <span className={`text-[9px] font-mono px-1 py-0.2 rounded border ${
                        entry.verification_status === 'verified'
                          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                          : entry.verification_status === 'needs_review'
                          ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                          : 'border-neutral-600/40 text-neutral-400 bg-neutral-800/30'
                      }`}>
                        {entry.verification_status === 'verified'
                          ? 'Có nguồn sử liệu'
                          : entry.verification_status === 'needs_review'
                          ? 'Cần rà soát thêm'
                          : 'Chưa đối chiếu'}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8C7E6C] italic">Thông tin tham chiếu từ thư tịch/hiện vật hoặc truyền ngôn</div>
                    <p className="text-[#B8AA96] leading-relaxed text-[11px]">
                      {entry.information_tier?.historical_claim || entry.historical_context}
                    </p>
                  </div>

                  {/* Tier 2: Quy tắc nội bộ prototype */}
                  <div className="p-3 rounded-lg bg-[#211815]/70 border border-[#43B6A4]/25 space-y-1.5">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <div className="font-semibold text-[#43B6A4] flex items-center gap-1.5 text-[11px] uppercase font-mono">
                        <Layers className="w-3.5 h-3.5 text-[#43B6A4]" />
                        <span>2. Quy tắc nội bộ</span>
                      </div>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded border border-[#43B6A4]/40 text-[#43B6A4] bg-[#43B6A4]/10">
                        Quy ước Lab
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8C7E6C] italic">Quy chuẩn kỹ thuật nội bộ của prototype dùng để thẩm định logic</div>
                    <p className="text-[#F2E9D8]/90 leading-relaxed text-[11px]">
                      {entry.information_tier?.prototype_rule || entry.core_rule}
                    </p>
                  </div>

                  {/* Tier 3: Gợi ý sáng tạo đương đại */}
                  <div className="p-3 rounded-lg bg-[#211815]/70 border border-[#C9A66B]/20 space-y-1.5">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <div className="font-semibold text-[#E6C88B] flex items-center gap-1.5 text-[11px] uppercase font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-[#E6C88B]" />
                        <span>3. Gợi ý đương đại</span>
                      </div>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded border border-[#C9A66B]/40 text-[#E6C88B] bg-[#C9A66B]/10">
                        Sáng tạo mở
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8C7E6C] italic">Ý tưởng định hướng thẩm mỹ mở, không phải quy tắc văn hóa bắt buộc</div>
                    <p className="text-[#B8AA96] leading-relaxed text-[11px]">
                      {entry.information_tier?.contemporary_suggestion || entry.creative_boundary}
                    </p>
                  </div>
                </div>

                {/* Requirement 1 & 6: Source Reference Metadata Section */}
                <div className="pt-2 text-xs border-t border-[#C9A66B]/15">
                  {entry.source_title ? (
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-600/30 text-emerald-200 text-xs space-y-1">
                      <div className="font-semibold flex items-center gap-1.5 text-emerald-300">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Nguồn khảo cứu thư tịch:</span>
                        <span className="font-serif font-bold text-[#F2E9D8]">{entry.source_title}</span>
                      </div>
                      <div className="text-[11px] text-emerald-200/80 flex flex-wrap gap-x-4 gap-y-1">
                        {entry.source_author_or_org && (
                          <span>Cơ quan / Tác giả: <strong>{entry.source_author_or_org}</strong></span>
                        )}
                        {entry.source_type && (
                          <span>Loại nguồn: <strong>{entry.source_type === 'primary_text' ? 'Sử liệu sơ cấp' : entry.source_type}</strong></span>
                        )}
                        {entry.confidence && (
                          <span>Độ tin cậy: <strong className="uppercase font-mono">{entry.confidence}</strong></span>
                        )}
                      </div>
                      {entry.notes && (
                        <p className="text-[11px] text-emerald-300/80 italic pt-0.5">{entry.notes}</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-[#211815]/50 border border-dashed border-neutral-700 text-neutral-300 text-[11px] flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-neutral-200">Chưa có nguồn xác minh trong bản thử nghiệm: </span>
                        <span>{entry.notes || 'Quy tắc này hiện mang tính chất giả định trong khuôn khổ phần mềm thử nghiệm. Cần bổ sung khảo cứu độc lập để chứng thực học thuật.'}</span>
                      </div>
                    </div>
                  )}

                  {entry.redline_warning && (
                    <div className="mt-2 p-2 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-[11px]">
                      {entry.redline_warning}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
