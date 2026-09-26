import React, { useState } from 'react';
import { WhatIfEvaluation, GarmentKey } from '../types/vietphuc';
import { HelpCircle, Sparkles, ShieldCheck, AlertTriangle, AlertOctagon, Lightbulb, Compass, ArrowRight } from 'lucide-react';

interface WhatIfLabProps {
  currentGarment: GarmentKey;
  onOpenCKB?: (evidenceId?: string) => void;
}

const PRESET_QUERIES = [
  {
    title: 'Cài vạt sang trái (Tả nhậm)',
    garment: 'ngu_than' as GarmentKey,
    query: 'What if đổi vạt áo và cài khuy sang bên trái (Tả nhậm) để người thuận tay trái dễ mặc?',
    hint: 'Thử nghiệm KB-RULE-01 (Redline Tang Ma)',
  },
  {
    title: 'Thêu Rồng 5 móng dạo phố',
    garment: 'ao_tac' as GarmentKey,
    query: 'What if thêu họa tiết Rồng 5 móng ánh kim lên tà áo Tấc đi dự tiệc cưới và dạo phố?',
    hint: 'Thử nghiệm KB-RULE-03 (Hoàng Quyền)',
  },
  {
    title: 'Đổi cổ Lập Lĩnh thành cổ Vest chữ V',
    garment: 'ngu_than' as GarmentKey,
    query: 'What if đổi cổ áo lập lĩnh của áo Ngũ thân thành cổ vest khoét sâu thoáng mát?',
    hint: 'Thử nghiệm KB-NGUTHAN-01 (Invariant)',
  },
  {
    title: 'Áo Tấc mở khuy làm Duster Coat',
    garment: 'ao_tac' as GarmentKey,
    query: 'What if cởi mở toàn bộ khuy áo Tấc mặc buông làm áo khoác duster coat phối với quần tây và boots?',
    hint: 'Thử nghiệm KB-TAC-03 (Mutable)',
  },
  {
    title: 'Bỏ dải Ngũ sắc ở cổ tay Nhật Bình',
    garment: 'nhat_binh' as GarmentKey,
    query: 'What if bỏ dải màu ngũ sắc ở viền tay áo Nhật Bình để chuyển sang phối màu monochrome tối giản?',
    hint: 'Thử nghiệm KB-NHATBINH-02 (Invariant)',
  },
  {
    title: 'Thêu chim Lạc thời Đông Sơn / Lý',
    garment: 'ngu_than' as GarmentKey,
    query: 'What if thêu hình chim Lạc trống đồng thời Đông Sơn và rồng thời Lý lên tà áo ngũ thân?',
    hint: 'Thử nghiệm Insufficient Evidence',
  },
];

export const WhatIfLab: React.FC<WhatIfLabProps> = ({ currentGarment, onOpenCKB }) => {
  const [selectedGarment, setSelectedGarment] = useState<GarmentKey>(currentGarment);
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<WhatIfEvaluation | null>(null);

  const handleRunWhatIf = async (queryText: string, targetGarment: GarmentKey = selectedGarment) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setQueryInput(queryText);

    try {
      const res = await fetch('/api/remix/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garment: targetGarment,
          query: queryText,
        }),
      });

      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
      }
    } catch (err) {
      console.error('Failed to run What-If evaluation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border border-stone-200 bg-white rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="max-w-2xl mb-6">
        <div className="text-[11px] uppercase tracking-widest font-mono text-stone-500 mb-1">
          MODE 2 · HERITAGE EXPERIMENTATION SIMULATOR
        </div>
        <h3 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
          "What If...?" Thử Nghiệm & Phản Biện Di Sản
        </h3>
        <p className="text-sm text-stone-600 mt-1 leading-relaxed">
          Đưa ra bất kỳ giả định táo bạo nào về việc thay đổi kết cấu, chất liệu, họa tiết. Hệ thống sẽ kích hoạt 
          <span className="font-semibold text-stone-800"> what_if_evaluation</span> để thẩm định tác động theo CKB và kiến tạo 
          <span className="font-semibold text-stone-800"> giải pháp thay thế thông minh (Stylist counter-proposal)</span>.
        </p>
      </div>

      {/* Preset Scenario Cards */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-stone-800 mb-3 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-stone-500" />
          <span>TÌNH HUỐNG GIẢ ĐỊNH KINH ĐIỂN CỦA GEN Z</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESET_QUERIES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedGarment(item.garment);
                handleRunWhatIf(item.query, item.garment);
              }}
              className="text-left p-3 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 hover:border-stone-300 transition-colors"
            >
              <div className="text-xs font-semibold text-stone-900 mb-1">{item.title}</div>
              <div className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">{item.query}</div>
              <div className="mt-2 text-[10px] font-mono text-stone-400">{item.hint}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Query Bar */}
      <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="sm:w-48 shrink-0">
            <label className="text-[11px] font-mono text-stone-500 block mb-1">LOẠI VIỆT PHỤC</label>
            <select
              value={selectedGarment}
              onChange={(e) => setSelectedGarment(e.target.value as GarmentKey)}
              className="w-full text-xs font-medium bg-white border border-stone-300 rounded px-2.5 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              <option value="ngu_than">Áo Ngũ Thân tay chẽn</option>
              <option value="ao_tac">Áo Tấc lễ phục</option>
              <option value="nhat_binh">Áo Nhật Bình hoàng tộc</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="text-[11px] font-mono text-stone-500 block mb-1">CÂU HỎI THỬ NGHIỆM CHI TIẾT</label>
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="VD: What if đổi vải áo sang dạ tweed và cắt tà áo ngắn tới hông?"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunWhatIf(queryInput);
              }}
              className="w-full text-xs bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          <div className="sm:self-end">
            <button
              onClick={() => handleRunWhatIf(queryInput)}
              disabled={loading || !queryInput.trim()}
              className="w-full sm:w-auto px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang Thẩm Định...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Kích Hoạt What-If</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="border border-stone-300 bg-white rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
            <div>
              <div className="text-[11px] font-mono text-stone-500 uppercase tracking-widest mb-1">
                KẾT QUẢ THẨM ĐỊNH WHAT-IF
              </div>
              <h4 className="text-lg font-serif font-bold text-stone-900">
                "{evaluation.query}"
              </h4>
            </div>

            {/* Audit Status Display */}
            <div>
              {evaluation.status === 'Supported' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>SUPPORTED (HỢP THỨC DI SẢN)</span>
                </div>
              )}
              {evaluation.status === 'Supported with Caution' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>SUPPORTED WITH CAUTION (CẢNH BÁO)</span>
                </div>
              )}
              {evaluation.status === 'Insufficient Evidence' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-900 rounded text-xs font-bold">
                  <HelpCircle className="w-4 h-4 text-rose-700" />
                  <span>INSUFFICIENT EVIDENCE (THIẾU SỬ LIỆU)</span>
                </div>
              )}
            </div>
          </div>

          {/* Uncertainty Flag Banner */}
          {evaluation.uncertainty_flag && (
            <div className="mt-4 p-3.5 bg-rose-50 border-l-4 border-rose-600 rounded-r text-xs text-rose-900">
              <div className="font-semibold flex items-center gap-1.5 mb-1">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>UNCERTAINTY FLAG ĐƯỢC KÍCH HOẠT</span>
              </div>
              <p className="text-rose-800 leading-relaxed">
                Chi tiết hoặc họa tiết bạn vừa hỏi KHÔNG CÓ trong Cultural Knowledge Base (CKB) được cấp. Cần thận trọng ghi rõ tính chất suy đoán hoặc thiếu tài liệu lịch sử chứng thực.
              </p>
            </div>
          )}

          {/* Redlines / Cautions */}
          {evaluation.cautions_and_redlines.length > 0 && (
            <div className="mt-4 p-4 bg-amber-50/90 border border-amber-300 rounded text-xs text-amber-950">
              <div className="font-bold flex items-center gap-1.5 text-amber-900 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>CẢNH BÁO CỐT LÕI (REDLINES & INVARIANTS)</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-amber-900 pl-1">
                {evaluation.cautions_and_redlines.map((c, i) => (
                  <li key={i} className="leading-relaxed font-medium">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Impact Analysis */}
          <div className="mt-5">
            <h5 className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-1.5">
              PHÂN TÍCH TÁC ĐỘNG VĂN HÓA (IMPACT ANALYSIS)
            </h5>
            <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded border border-stone-200">
              {evaluation.impact_analysis}
            </p>
          </div>

          {/* Violated or Applicable Evidence IDs */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-500">Căn cứ CKB liên đới:</span>
            {evaluation.violated_evidence_ids.map((id) => (
              <button
                key={id}
                onClick={() => onOpenCKB?.(id)}
                className="font-mono text-[11px] px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded hover:bg-rose-200"
              >
                Vi phạm: {id}
              </button>
            ))}
            {evaluation.applicable_evidence_ids.map((id) => (
              <button
                key={id}
                onClick={() => onOpenCKB?.(id)}
                className="font-mono text-[11px] px-2 py-0.5 bg-stone-100 text-stone-800 border border-stone-300 rounded hover:bg-stone-200"
              >
                Căn cứ: {id}
              </button>
            ))}
          </div>

          {/* Stylist Counter-Proposal (The Co-Designer's Smart Alternative) */}
          <div className="mt-6 p-5 bg-[#FAF7F0] border-2 border-stone-900 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">
                  CONTEMPORARY CO-DESIGNER RESPONSE
                </span>
                <h5 className="text-base font-serif font-bold text-stone-950">
                  Stylist Counter-Proposal: {evaluation.stylist_counter_proposal.title}
                </h5>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-3 border-t border-stone-300 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-stone-900 flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
                  Giải Pháp Thiết Kế
                </span>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  {evaluation.stylist_counter_proposal.solution}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-emerald-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Bảo Toàn Di Sản
                </span>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  {evaluation.stylist_counter_proposal.heritage_safeguard}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-stone-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Vật Liệu & Cắt May
                </span>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  {evaluation.stylist_counter_proposal.materials_and_cuts}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
