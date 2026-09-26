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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#181C24] border border-[#2A313E] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#272D3A] bg-[#161920]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0D9488]/15 text-[#2DD4BF] border border-[#0D9488]/30 flex items-center justify-center font-bold text-xs">
              CKB
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#14B8A6]">
                KHO QUY THỨC DI SẢN
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#F1F5F9]">
                Cultural Knowledge Base (CKB) & Quy Thức Thẩm Định
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#202530] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 px-6 bg-[#161920] border-b border-[#272D3A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm điều khoản..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-[#121418] border border-[#2B3342] rounded-xl text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:border-[#14B8A6]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-[#222834] text-[#2DD4BF] border border-[#0D9488]/40'
                  : 'text-[#94A3B8] hover:text-white bg-[#121418] border border-[#272D3A]'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterCategory('invariant')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'invariant'
                  ? 'bg-[#222834] text-[#10B981] border border-[#10B981]/40'
                  : 'text-[#94A3B8] hover:text-white bg-[#121418] border border-[#272D3A]'
              }`}
            >
              Bất biến
            </button>
            <button
              onClick={() => setFilterCategory('mutable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'mutable'
                  ? 'bg-[#222834] text-[#38BDF8] border border-[#0284C7]/40'
                  : 'text-[#94A3B8] hover:text-white bg-[#121418] border border-[#272D3A]'
              }`}
            >
              Khả biến
            </button>
            <button
              onClick={() => setFilterCategory('sacred_rule')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === 'sacred_rule'
                  ? 'bg-[#222834] text-[#F43F5E] border border-[#F43F5E]/40'
                  : 'text-[#94A3B8] hover:text-white bg-[#121418] border border-[#272D3A]'
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
                    ? 'border-[#14B8A6] bg-[#1E2530] shadow-sm ring-1 ring-[#14B8A6]'
                    : 'border-[#272D3A] bg-[#161920]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#14B8A6]">{entry.id}</span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
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
                </div>

                <h4 className="text-base font-serif font-bold text-[#F1F5F9] mb-1">
                  {entry.title}
                </h4>

                <p className="text-xs sm:text-sm text-[#CBD5E1] mb-2 leading-relaxed">
                  {entry.core_rule}
                </p>

                <div className="text-xs text-[#94A3B8] leading-relaxed border-t border-[#272D3A] pt-2">
                  <span className="font-semibold text-[#E2E8F0]">Sử liệu: </span>
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
