import React, { useState } from 'react';
import {
  CKB_REGISTRY,
  formatGarmentScopeLabel,
  formatVerificationStatusBadge,
  getCKBStats,
} from '../data/ckbRegistry';
import { Search, ShieldCheck, BookOpen, Layers, Sparkles, AlertCircle, FileText, ExternalLink } from 'lucide-react';

interface CKBRegistryViewProps {
  onSelectEntry?: (id: string) => void;
}

export const CKBRegistryView: React.FC<CKBRegistryViewProps> = ({ onSelectEntry }) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'invariant' | 'mutable' | 'sacred_rule'>('all');
  const [filterVerification, setFilterVerification] = useState<'all' | 'verified' | 'needs_review' | 'unverified'>('all');

  const stats = getCKBStats();

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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="lacquer-panel rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#C9A66B] uppercase tracking-wider">
              QUY TẮC THAM CHIẾU VĂN HÓA & MINH BẠCH NGUỒN SỬ LIỆU
            </span>
            <span className="text-[#8C7E6C]">·</span>
            <span className="text-xs text-[#B8AA96]">{stats.total} Điều khoản thẩm định</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F2E9D8] tracking-tight">
            Cultural Knowledge Base (CKB) & Hồ Sơ Nguồn Khảo Cứu
          </h2>
          <p className="text-sm text-[#B8AA96] max-w-3xl leading-relaxed">
            Hệ thống tham chiếu dùng để đối soát tính phù hợp của bản thiết kế. Trong giai đoạn thử nghiệm, hệ thống phân tách minh bạch giữa <strong className="text-emerald-400">quy tắc đã đối chiếu thư tịch</strong> và <strong className="text-neutral-300">quy ước nội bộ của bản thử nghiệm</strong> nhằm tránh các tuyên ngôn văn hóa võ đoán.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="lacquer-panel rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8C7E6C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã điều khoản, tên quy tắc, nguồn..."
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-[#181311]/60 border border-[#C9A66B]/20 rounded-xl text-[#F2E9D8] placeholder:text-[#6E5D53] focus:outline-none focus:border-[#C9A66B] min-h-[44px] backdrop-blur-xs"
            />
          </div>

          {/* Verification filter toggle */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[#8C7E6C] text-xs font-mono hidden md:inline">Nguồn:</span>
            <button
              onClick={() => setFilterVerification('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                filterVerification === 'all'
                  ? 'border-[#C9A66B] bg-[#C9A66B]/25 text-[#E6C88B]'
                  : 'border-[#C9A66B]/15 text-[#8C7E6C] hover:text-[#B8AA96]'
              }`}
            >
              Tất cả nguồn ({stats.total})
            </button>
            {stats.verified > 0 && (
              <button
                onClick={() => setFilterVerification('verified')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  filterVerification === 'verified'
                    ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                    : 'border-[#C9A66B]/15 text-[#8C7E6C] hover:text-[#B8AA96]'
                }`}
              >
                Đã đối chiếu nguồn ({stats.verified})
              </button>
            )}
            <button
              onClick={() => setFilterVerification('needs_review')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                filterVerification === 'needs_review'
                  ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                  : 'border-[#C9A66B]/15 text-[#8C7E6C] hover:text-[#B8AA96]'
              }`}
            >
              Cần rà soát thêm ({stats.needs_review})
            </button>
            <button
              onClick={() => setFilterVerification('unverified')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                filterVerification === 'unverified'
                  ? 'border-neutral-500/50 bg-neutral-500/20 text-neutral-300'
                  : 'border-[#C9A66B]/15 text-[#8C7E6C] hover:text-[#B8AA96]'
              }`}
            >
              Chưa xác minh ({stats.unverified})
            </button>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-[#C9A66B]/10">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-[#2E201B]/90 text-[#C9A66B] border border-[#C9A66B]/50'
                : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#181311]/50 border border-[#C9A66B]/15'
            }`}
          >
            Tất cả thể loại ({stats.total})
          </button>
          <button
            onClick={() => setFilterCategory('invariant')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
              filterCategory === 'invariant'
                ? 'bg-[#2E201B]/90 text-[#43B6A4] border border-[#43B6A4]/50'
                : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#181311]/50 border border-[#C9A66B]/15'
            }`}
          >
            Bất biến ({stats.invariant})
          </button>
          <button
            onClick={() => setFilterCategory('mutable')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
              filterCategory === 'mutable'
                ? 'bg-[#2E201B]/90 text-[#E6C88B] border border-[#C9A66B]/50'
                : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#181311]/50 border border-[#C9A66B]/15'
            }`}
          >
            Khả biến ({stats.mutable})
          </button>
          <button
            onClick={() => setFilterCategory('sacred_rule')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
              filterCategory === 'sacred_rule'
                ? 'bg-[#2E201B]/90 text-[#F5A39D] border border-[#B8342B]/50'
                : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#181311]/50 border border-[#C9A66B]/15'
            }`}
          >
            Cấm kỵ ({stats.sacred_rule})
          </button>
        </div>
      </div>

      {/* Grid of CKB Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntries.map((entry) => {
          const isInvariant = entry.category === 'invariant';
          const isMutable = entry.category === 'mutable';
          const verificationBadge = formatVerificationStatusBadge(entry.verification_status);

          return (
            <div
              key={entry.id}
              onClick={() => onSelectEntry?.(entry.id)}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3.5 lacquer-card-elevated ${
                isInvariant
                  ? 'border-[#C9A66B]/20 hover:border-[#43B6A4]/60'
                  : isMutable
                  ? 'border-[#C9A66B]/20 hover:border-[#C9A66B]/60'
                  : 'border-[#C9A66B]/20 hover:border-[#B8342B]/60'
              } cursor-pointer`}
            >
              <div className="space-y-2.5">
                {/* ID & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#C9A66B] bg-[#C9A66B]/10 px-2 py-0.5 rounded border border-[#C9A66B]/30">
                      {entry.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${
                        isInvariant
                          ? 'border-[#43B6A4]/40 text-[#43B6A4] bg-[#43B6A4]/10'
                          : isMutable
                          ? 'border-[#C9A66B]/40 text-[#E6C88B] bg-[#C9A66B]/10'
                          : 'border-[#B8342B]/40 text-[#F5A39D] bg-[#B8342B]/10'
                      }`}
                    >
                      {isInvariant ? 'BẤT BIẾN' : isMutable ? 'KHẢ BIẾN' : 'CẤM KỴ'}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border flex items-center gap-1 ${verificationBadge.badgeClass}`}>
                    {verificationBadge.isVerified ? (
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-neutral-400" />
                    )}
                    <span>{verificationBadge.isVerified ? 'Đã có nguồn' : 'Chưa xác minh'}</span>
                  </span>
                </div>

                {/* Garment Scope */}
                <div className="text-[11px] font-mono text-[#D4C7B4] bg-[#261C19]/60 px-2.5 py-1 rounded-md border border-[#8C7E6C]/25">
                  Phạm vi: <strong>{formatGarmentScopeLabel(entry.garment_scope)}</strong>
                </div>

                <h3 className="text-base font-serif font-bold text-[#F2E9D8] leading-snug">
                  {entry.title}
                </h3>

                {/* 3 Information Tiers (Requirement 3: Tách rõ mức độ chắc chắn) */}
                <div className="space-y-2 text-xs pt-1">
                  <div className={`p-2 rounded-lg border text-[#B8AA96] leading-relaxed ${
                    entry.verification_status === 'verified'
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-[#181311]/50 border-[#C9A66B]/15'
                  }`}>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold text-[#D4C7B4] flex items-center gap-1 text-[11px] uppercase font-mono">
                        <BookOpen className="w-3 h-3 text-[#C9A66B]" />
                        <span>1. Căn cứ lịch sử</span>
                      </span>
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
                    <p className="text-[11px] text-[#B8AA96]">
                      {entry.information_tier?.historical_claim || entry.historical_context}
                    </p>
                  </div>

                  <div className="text-[#F2E9D8]/90 leading-relaxed bg-[#181311]/50 p-2 rounded-lg border border-[#43B6A4]/30">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold text-[#43B6A4] flex items-center gap-1 text-[11px] uppercase font-mono">
                        <Layers className="w-3 h-3 text-[#43B6A4]" />
                        <span>2. Quy tắc nội bộ Lab</span>
                      </span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded border border-[#43B6A4]/40 text-[#43B6A4] bg-[#43B6A4]/10">
                        Quy ước Lab
                      </span>
                    </div>
                    <p className="text-[11px]">
                      {entry.information_tier?.prototype_rule || entry.core_rule}
                    </p>
                  </div>

                  <div className="text-[#B8AA96] leading-relaxed bg-[#181311]/50 p-2 rounded-lg border border-[#C9A66B]/15">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold text-[#E6C88B] flex items-center gap-1 text-[11px] uppercase font-mono">
                        <Sparkles className="w-3 h-3 text-[#E6C88B]" />
                        <span>3. Gợi ý đương đại</span>
                      </span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded border border-[#C9A66B]/40 text-[#E6C88B] bg-[#C9A66B]/10">
                        Sáng tạo mở
                      </span>
                    </div>
                    <p className="text-[11px] text-[#B8AA96]">
                      {entry.information_tier?.contemporary_suggestion || entry.creative_boundary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Source Footnote or Unverified Disclaimer */}
              <div className="pt-3 border-t border-[#C9A66B]/15 text-xs space-y-1.5">
                {entry.source_title ? (
                  <div className={`p-2.5 rounded-lg border text-[11px] space-y-1 ${verificationBadge.cardClass}`}>
                    <div className="font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span>{verificationBadge.sourceLeadLabel}</span>
                      <strong className="text-[#F2E9D8]">{entry.source_title}</strong>
                    </div>
                    <div className="text-[10px] opacity-85 flex flex-wrap gap-x-3 gap-y-0.5">
                      {entry.source_author_or_org && <span>Tác giả/Cơ quan: {entry.source_author_or_org}</span>}
                      {entry.source_page && <span>{entry.source_page}</span>}
                      {entry.confidence && <span className="font-mono uppercase">Độ tin cậy: {entry.confidence}</span>}
                    </div>
                    {entry.notes && (
                      <div className="text-[10px] opacity-80 italic pt-0.5">{entry.notes}</div>
                    )}
                    {entry.source_url && (
                      <div className="pt-1">
                        <a
                          href={entry.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#C9A66B] hover:text-[#F2E9D8] underline underline-offset-2 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span>Mở nguồn tham khảo</span>
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-[#211815]/50 border border-neutral-700/50 text-neutral-300 text-[10px] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Chưa có nguồn xác minh trong bản thử nghiệm.</span>
                  </div>
                )}

                {entry.redline_warning && (
                  <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-[11px]">
                    {entry.redline_warning}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
