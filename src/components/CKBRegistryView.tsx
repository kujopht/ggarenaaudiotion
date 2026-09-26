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
      <div className="bg-[#181C24] border border-[#272D3A] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#F59E0B] uppercase tracking-wider">
              KHO QUY THỨC DI SẢN (CKB)
            </span>
            <span className="text-[#64748B]">·</span>
            <span className="text-xs text-[#94A3B8]">12 Điều khoản chuẩn hóa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F1F5F9] tracking-tight">
            Cultural Knowledge Base (CKB) Triều Nguyễn
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
            Nguồn đối chiếu chuẩn mực duy nhất được Auditor sử dụng để thẩm định tính hợp thức di sản, bảo lưu các quy thức cốt lõi và hướng dẫn vùng sáng tạo an toàn.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#181C24] border border-[#272D3A] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã điều khoản, tên quy thức..."
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-[#161920] border border-[#2B3342] rounded-xl text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:border-[#14B8A6] min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-[#222834] text-[#2DD4BF] border border-[#0D9488]/40'
                : 'text-[#94A3B8] hover:text-white bg-[#161920] border border-[#272D3A]'
            }`}
          >
            Tất cả (12)
          </button>
          <button
            onClick={() => setFilterCategory('invariant')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
              filterCategory === 'invariant'
                ? 'bg-[#222834] text-[#10B981] border border-[#10B981]/40'
                : 'text-[#94A3B8] hover:text-white bg-[#161920] border border-[#272D3A]'
            }`}
          >
            Bất biến (Invariants)
          </button>
          <button
            onClick={() => setFilterCategory('mutable')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
              filterCategory === 'mutable'
                ? 'bg-[#222834] text-[#38BDF8] border border-[#0284C7]/40'
                : 'text-[#94A3B8] hover:text-white bg-[#161920] border border-[#272D3A]'
            }`}
          >
            Khả biến (Mutables)
          </button>
          <button
            onClick={() => setFilterCategory('sacred_rule')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
              filterCategory === 'sacred_rule'
                ? 'bg-[#222834] text-[#F43F5E] border border-[#F43F5E]/40'
                : 'text-[#94A3B8] hover:text-white bg-[#161920] border border-[#272D3A]'
            }`}
          >
            Cấm kỵ (Redlines)
          </button>
        </div>
      </div>

      {/* Grid of CKB Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntries.map((entry) => {
          const isInvariant = entry.category === 'invariant';
          const isMutable = entry.category === 'mutable';
          const isSacred = entry.category === 'sacred_rule';

          return (
            <div
              key={entry.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 bg-[#181C24] ${
                isInvariant
                  ? 'border-[#272D3A] hover:border-[#10B981]/60'
                  : isMutable
                  ? 'border-[#272D3A] hover:border-[#0284C7]/60'
                  : 'border-[#272D3A] hover:border-[#F43F5E]/60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#14B8A6]">{entry.id}</span>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${
                      isInvariant
                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                        : isMutable
                        ? 'border-sky-500/40 text-sky-400 bg-sky-500/10'
                        : 'border-rose-500/40 text-rose-400 bg-rose-500/10'
                    }`}
                  >
                    {isInvariant ? 'BẤT BIẾN' : isMutable ? 'KHẢ BIẾN' : 'CẤM KỴ'}
                  </span>
                </div>

                <h3 className="text-base font-serif font-bold text-[#F1F5F9] leading-snug">
                  {entry.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  {entry.core_rule}
                </p>
              </div>

              <div className="pt-3 border-t border-[#272D3A] text-xs space-y-1.5">
                <div className="text-[#94A3B8] leading-relaxed">
                  <span className="font-semibold text-[#E2E8F0]">Bối cảnh sử liệu: </span>
                  {entry.historical_context}
                </div>
                {entry.redline_warning && (
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
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
