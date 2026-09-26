import React, { useState } from 'react';
import { CKB_REGISTRY } from '../data/ckbRegistry';
import { CKBEntry } from '../types/vietphuc';
import { X, Search, ShieldCheck, AlertTriangle, Sparkles, BookOpen, AlertOctagon } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FAF8F5] border border-stone-300 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-serif font-bold text-sm">
              CKB
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500">
                EVIDENCE REGISTRY
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Cultural Knowledge Base (CKB) & Quy Thức Di Sản
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 px-6 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm quy thức, mã KB..."
              className="w-full text-xs pl-9 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          {/* Category Tabs (Segmented interactive buttons per design guidelines) */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg text-xs font-medium w-full sm:w-auto">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterCategory === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tất cả (12)
            </button>
            <button
              onClick={() => setFilterCategory('invariant')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterCategory === 'invariant' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Bất biến (Invariant)
            </button>
            <button
              onClick={() => setFilterCategory('mutable')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterCategory === 'mutable' ? 'bg-white text-sky-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Khả biến (Mutable)
            </button>
            <button
              onClick={() => setFilterCategory('sacred_rule')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterCategory === 'sacred_rule' ? 'bg-white text-amber-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cấm kỵ Hoàng quyền
            </button>
          </div>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredEntries.map((entry) => {
            const isHighlighted = highlightId === entry.id;

            return (
              <div
                key={entry.id}
                id={`entry-${entry.id}`}
                className={`p-5 rounded-xl border transition-all ${
                  isHighlighted
                    ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-300'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                {/* Entry Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-stone-900 text-stone-100 rounded">
                      {entry.id}
                    </span>
                    <h4 className="text-base font-serif font-bold text-stone-900">
                      {entry.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {entry.category === 'invariant' && (
                      <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        INVARIANT (BẤT BIẾN)
                      </span>
                    )}
                    {entry.category === 'mutable' && (
                      <span className="flex items-center gap-1 font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        MUTABLE (KHẢ BIẾN)
                      </span>
                    )}
                    {entry.category === 'sacred_rule' && (
                      <span className="flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        SACRED CẤM KỴ
                      </span>
                    )}
                  </div>
                </div>

                {/* Core Rule */}
                <div className="mt-3">
                  <div className="text-[11px] font-mono text-stone-500 uppercase">QUY THỨC CỐT LÕI</div>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5 leading-relaxed">
                    {entry.core_rule}
                  </p>
                </div>

                {/* Redline Warning if present */}
                {entry.redline_warning && (
                  <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900 font-medium">
                    {entry.redline_warning}
                  </div>
                )}

                {/* Historical Context & Creative Boundary */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-stone-100">
                  <div>
                    <span className="text-[11px] font-mono text-stone-500 uppercase block mb-1">
                      NGỮ CẢNH LỊCH SỬ & Ý NGHĨA
                    </span>
                    <p className="text-stone-700 leading-relaxed text-[11px]">
                      {entry.historical_context}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-stone-500 uppercase block mb-1">
                      BIÊN GIỚI SÁNG TẠO ĐƯƠNG ĐẠI
                    </span>
                    <p className="text-stone-700 leading-relaxed text-[11px]">
                      {entry.creative_boundary}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Cultural Knowledge Base v2.4 · 12 Điều Khoản Thẩm Định Độc Quyền</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Đóng Tra Cứu
          </button>
        </div>
      </div>
    </div>
  );
};
