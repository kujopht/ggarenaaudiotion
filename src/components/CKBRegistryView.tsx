import React, { useState } from 'react';
import { CKB_REGISTRY } from '../data/ckbRegistry';
import { Search, ShieldCheck, Sparkles, AlertOctagon, BookOpen } from 'lucide-react';

interface CKBRegistryViewProps {
  onSelectEntry?: (id: string) => void;
}

export const CKBRegistryView: React.FC<CKBRegistryViewProps> = ({ onSelectEntry }) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'invariant' | 'mutable' | 'sacred_rule'>('all');

  const filteredEntries = CKB_REGISTRY.filter((entry) => {
    const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
    const matchesSearch =
      entry.id.toLowerCase().includes(search.toLowerCase()) ||
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.core_rule.toLowerCase().includes(search.toLowerCase()) ||
      entry.historical_context.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#991B1B] text-[#FEF3C7] flex items-center justify-center font-serif font-bold text-lg border border-[#7F1D1D] shrink-0">
            SỬ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#991B1B] uppercase tracking-wider">
                EVIDENCE REGISTRY · CKB v2.4
              </span>
              <span className="text-[#A8A29E]">·</span>
              <span className="text-xs text-[#78716C]">12 Điều Khoản Thẩm Định Độc Quyền</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917] tracking-tight">
              Cultural Knowledge Base (CKB) Triều Nguyễn
            </h2>
          </div>
        </div>

        <p className="text-xs text-[#57534E] max-w-md leading-relaxed">
          Nguồn chứng cứ duy nhất mà Cultural Auditor sử dụng để đưa ra kết luận (Supported / Supported with Caution / Insufficient Evidence) và cảnh báo Redlines.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã KB, tên quy thức, từ khóa..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-[#D6CEBE] rounded-lg text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[#ECE5D8] rounded-lg text-xs font-semibold w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              filterCategory === 'all'
                ? 'bg-[#1C1917] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            Tất Cả (12)
          </button>
          <button
            onClick={() => setFilterCategory('invariant')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              filterCategory === 'invariant'
                ? 'bg-[#065F46] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#065F46]'
            }`}
          >
            Bất Biến (Invariant)
          </button>
          <button
            onClick={() => setFilterCategory('mutable')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              filterCategory === 'mutable'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#0284C7]'
            }`}
          >
            Khả Biến (Mutable)
          </button>
          <button
            onClick={() => setFilterCategory('sacred_rule')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              filterCategory === 'sacred_rule'
                ? 'bg-[#991B1B] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#991B1B]'
            }`}
          >
            Cấm Kỵ Hoàng Quyền
          </button>
        </div>
      </div>

      {/* Grid of CKB Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl p-5 shadow-xs hover:border-[#991B1B] transition-all space-y-3"
          >
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#E2DBD0]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#1C1917] text-[#FAF7F0] rounded">
                  {entry.id}
                </span>
                <h4 className="text-sm font-serif font-bold text-[#1C1917]">
                  {entry.title}
                </h4>
              </div>

              <div>
                {entry.category === 'invariant' && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded">
                    INVARIANT (BẤT BIẾN)
                  </span>
                )}
                {entry.category === 'mutable' && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#F0F9FF] border border-[#BAE6FD] text-[#0284C7] rounded">
                    MUTABLE (KHẢ BIẾN)
                  </span>
                )}
                {entry.category === 'sacred_rule' && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded">
                    SACRED REDLINE
                  </span>
                )}
              </div>
            </div>

            {/* Core Rule */}
            <p className="text-xs font-bold text-[#1C1917] leading-relaxed">
              {entry.core_rule}
            </p>

            {/* Redline Alert if applicable */}
            {entry.redline_warning && (
              <div className="p-2.5 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] rounded text-[11px] font-medium leading-relaxed">
                {entry.redline_warning}
              </div>
            )}

            {/* Context & Boundary */}
            <div className="pt-2 border-t border-[#EAE3D6] space-y-2 text-[11px]">
              <div>
                <span className="font-bold text-[#1C1917] block">Bối cảnh lịch sử:</span>
                <span className="text-[#57534E] leading-relaxed">{entry.historical_context}</span>
              </div>
              <div>
                <span className="font-bold text-[#1C1917] block">Biên giới sáng tạo:</span>
                <span className="text-[#57534E] leading-relaxed">{entry.creative_boundary}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
