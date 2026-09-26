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
      <div className="bg-[#1C1513] border border-[#3A2B25] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#C9A66B] uppercase tracking-wider">
              QUY TẮC THAM CHIẾU VĂN HÓA
            </span>
            <span className="text-[#8C7E6C]">·</span>
            <span className="text-xs text-[#B8AA96]">12 Điều khoản tham chiếu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F2E9D8] tracking-tight">
            Quy tắc tham chiếu cổ phục triều Nguyễn (CKB)
          </h2>
          <p className="text-sm text-[#B8AA96] max-w-2xl leading-relaxed">
            Nguồn tài liệu tham chiếu được sử dụng để đối chiếu tính phù hợp với quy tắc tham chiếu của bản thử nghiệm, bảo lưu các quy thức cốt lõi và hướng dẫn vùng sáng tạo an toàn.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#1C1513] border border-[#3A2B25] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C7E6C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã điều khoản, tên quy thức..."
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-[#181311] border border-[#3A2B25] rounded-xl text-[#F2E9D8] placeholder:text-[#6E5D53] focus:outline-none focus:border-[#C9A66B] min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-[#2E201B] text-[#C9A66B] border border-[#C9A66B]/50'
                : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#181311] border border-[#3A2B25]'
            }`}
          >
            Tất cả (12)
          </button>
          <button
            onClick={() => setFilterCategory('invariant')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
              filterCategory === 'invariant'
                ? 'bg-[#2E201B] text-[#43B6A4] border border-[#43B6A4]/50'
                : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#181311] border border-[#3A2B25]'
            }`}
          >
            Bất biến (Invariants)
          </button>
          <button
            onClick={() => setFilterCategory('mutable')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
              filterCategory === 'mutable'
                ? 'bg-[#2E201B] text-[#E6C88B] border border-[#C9A66B]/50'
                : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#181311] border border-[#3A2B25]'
            }`}
          >
            Khả biến (Mutables)
          </button>
          <button
            onClick={() => setFilterCategory('sacred_rule')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
              filterCategory === 'sacred_rule'
                ? 'bg-[#2E201B] text-[#F5A39D] border border-[#B8342B]/50'
                : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#181311] border border-[#3A2B25]'
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
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 bg-[#1C1513] ${
                isInvariant
                  ? 'border-[#3A2B25] hover:border-[#43B6A4]/60'
                  : isMutable
                  ? 'border-[#3A2B25] hover:border-[#C9A66B]/60'
                  : 'border-[#3A2B25] hover:border-[#B8342B]/60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#C9A66B]">{entry.id}</span>
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

                <h3 className="text-base font-serif font-bold text-[#F2E9D8] leading-snug">
                  {entry.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#B8AA96] leading-relaxed">
                  {entry.core_rule}
                </p>
              </div>

              <div className="pt-3 border-t border-[#3A2B25] text-xs space-y-1.5">
                <div className="text-[#8C7E6C] leading-relaxed">
                  <span className="font-semibold text-[#D4C7B4]">Bối cảnh sử liệu: </span>
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
