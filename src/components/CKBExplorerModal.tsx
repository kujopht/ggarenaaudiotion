import React, { useState } from 'react';
import { CKB_REGISTRY } from '../data/ckbRegistry';
import { X, Search } from 'lucide-react';

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#1C1513] border border-[#3A2B25] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3A2B25] bg-[#181311]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#B8342B]/20 text-[#C9A66B] border border-[#C9A66B]/40 flex items-center justify-center font-bold text-xs">
              CKB
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#C9A66B]">
                KHO QUY THỨC DI SẢN
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#F2E9D8]">
                Cultural Knowledge Base (CKB) & Quy Thức Thẩm Định
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#B8AA96] hover:text-[#F2E9D8] rounded-lg hover:bg-[#261C19] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 px-6 bg-[#181311] border-b border-[#3A2B25] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#8C7E6C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm điều khoản..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-[#140F0E] border border-[#3A2B25] rounded-xl text-[#F2E9D8] placeholder:text-[#6E5D53] focus:outline-none focus:border-[#C9A66B]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-[#2E201B] text-[#C9A66B] border border-[#C9A66B]/50'
                  : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#140F0E] border border-[#3A2B25]'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterCategory('invariant')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'invariant'
                  ? 'bg-[#2E201B] text-[#43B6A4] border border-[#43B6A4]/50'
                  : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#140F0E] border border-[#3A2B25]'
              }`}
            >
              Bất biến
            </button>
            <button
              onClick={() => setFilterCategory('mutable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'mutable'
                  ? 'bg-[#2E201B] text-[#E6C88B] border border-[#C9A66B]/50'
                  : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#140F0E] border border-[#3A2B25]'
              }`}
            >
              Khả biến
            </button>
            <button
              onClick={() => setFilterCategory('sacred_rule')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'sacred_rule'
                  ? 'bg-[#2E201B] text-[#F5A39D] border border-[#B8342B]/50'
                  : 'text-[#B8AA96] hover:text-[#F2E9D8] bg-[#140F0E] border border-[#3A2B25]'
              }`}
            >
              Cấm kỵ
            </button>
          </div>
        </div>

        {/* List of Entries */}
        <div className="p-6 overflow-y-auto space-y-4">
          {filteredEntries.map((entry) => {
            const isHighlighted = highlightId === entry.id;
            const isInvariant = entry.category === 'invariant';
            const isMutable = entry.category === 'mutable';

            return (
              <div
                key={entry.id}
                id={`ckb-${entry.id}`}
                className={`p-4 rounded-xl border transition-all ${
                  isHighlighted
                    ? 'border-[#C9A66B] bg-[#261C19] shadow-sm ring-1 ring-[#C9A66B]'
                    : 'border-[#3A2B25] bg-[#181311]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#C9A66B]">{entry.id}</span>
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
                  </div>
                </div>

                <h4 className="text-base font-serif font-bold text-[#F2E9D8] mb-1">
                  {entry.title}
                </h4>

                <p className="text-xs sm:text-sm text-[#B8AA96] mb-2 leading-relaxed">
                  {entry.core_rule}
                </p>

                <div className="text-xs text-[#8C7E6C] leading-relaxed border-t border-[#3A2B25] pt-2">
                  <span className="font-semibold text-[#D4C7B4]">Sử liệu: </span>
                  {entry.historical_context}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
