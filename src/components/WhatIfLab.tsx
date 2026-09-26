import React, { useState } from 'react';
import { WhatIfEvaluation, GarmentKey } from '../types/vietphuc';
import { HelpCircle, Sparkles, ShieldCheck, AlertTriangle, AlertOctagon, Lightbulb, Compass, ArrowRight, Wand2 } from 'lucide-react';

interface WhatIfLabProps {
  currentGarment: GarmentKey;
  onOpenCKB?: (evidenceId?: string) => void;
}

const PRESET_QUERIES = [
  {
    title: 'Cài vạt sang trái (Tả nhậm)',
    garment: 'ngu_than' as GarmentKey,
    query: 'What if đổi vạt áo và cài khuy sang bên trái (Tả nhậm) để người thuận tay trái dễ mặc?',
    badge: 'KB-RULE-01',
    badgeType: 'redline',
    hint: 'Tang ma cấm kỵ',
  },
  {
    title: 'Thêu Rồng 5 móng dạo phố',
    garment: 'ao_tac' as GarmentKey,
    query: 'What if thêu họa tiết Rồng 5 móng ánh kim lên tà áo Tấc đi dự tiệc cưới và dạo phố?',
    badge: 'KB-RULE-03',
    badgeType: 'redline',
    hint: 'Hoàng quyền cấm kỵ',
  },
  {
    title: 'Đổi cổ Lập Lĩnh thành Cổ Vest V',
    garment: 'ngu_than' as GarmentKey,
    query: 'What if đổi cổ áo lập lĩnh của áo Ngũ thân thành cổ vest khoét sâu thoáng mát?',
    badge: 'KB-NGUTHAN-01',
    badgeType: 'invariant',
    hint: 'Bất biến cốt lõi',
  },
  {
    title: 'Áo Tấc Mở Khuy Làm Duster Coat',
    garment: 'ao_tac' as GarmentKey,
    query: 'What if cởi mở toàn bộ khuy áo Tấc mặc buông làm áo khoác duster coat phối với quần tây và boots?',
    badge: 'KB-TAC-03',
    badgeType: 'mutable',
    hint: 'Vùng khả biến hợp thức',
  },
  {
    title: 'Bỏ Dải Ngũ Sắc Ở Cổ Tay Nhật Bình',
    garment: 'nhat_binh' as GarmentKey,
    query: 'What if bỏ dải màu ngũ sắc ở viền tay áo Nhật Bình để chuyển sang phối màu monochrome tối giản?',
    badge: 'KB-NHATBINH-02',
    badgeType: 'invariant',
    hint: 'Ngũ hành bất biến',
  },
  {
    title: 'Thêu Chim Lạc Thời Đông Sơn / Lý',
    garment: 'ngu_than' as GarmentKey,
    query: 'What if thêu hình chim Lạc trống đồng thời Đông Sơn và rồng thời Lý lên tà áo ngũ thân?',
    badge: 'NGOÀI CKB',
    badgeType: 'insufficient',
    hint: 'Thiếu căn cứ sử liệu',
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1E3A8A] text-[#FEF3C7] flex items-center justify-center font-serif font-bold text-lg border border-[#172554] shrink-0">
            BIỆN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#1E3A8A] uppercase tracking-wider">
                SIMULATOR GIẢ ĐỊNH & THẨM ĐỊNH
              </span>
              <span className="text-[#A8A29E]">·</span>
              <span className="text-xs text-[#78716C]">Quy tắc CKB Bất Biến & Khả Biến</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917] tracking-tight">
              "What If...?" Phản Biện & Đề Xuất Thay Thế
            </h2>
          </div>
        </div>

        <p className="text-xs text-[#57534E] max-w-md leading-relaxed">
          Thử nghiệm mọi ý tưởng táo bạo. Hệ thống sẽ thẩm định theo CKB và tạo <strong className="text-[#1C1917]">Stylist Counter-Proposal</strong> thông minh giúp đạt thẩm mỹ mong muốn mà vẫn chuẩn mực di sản.
        </p>
      </div>

      {/* Preset Fast-Test Scenarios */}
      <div className="bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917] font-serif flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#B45309]" />
            <span>Tình Huống Giả Định Nổi Bật (Bấm Để Thử Nghiệm Ngay)</span>
          </span>
          <span className="text-[11px] text-[#78716C] font-mono">6 kịch bản thử thách</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESET_QUERIES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedGarment(item.garment);
                handleRunWhatIf(item.query, item.garment);
              }}
              className="text-left p-3 rounded-lg border border-[#E2DBD0] bg-white hover:border-[#991B1B] hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-[#1C1917] font-serif group-hover:text-[#991B1B] transition-colors">
                    {item.title}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      item.badgeType === 'redline'
                        ? 'border-[#991B1B] text-[#991B1B] bg-[#991B1B]/10'
                        : item.badgeType === 'invariant'
                        ? 'border-[#065F46] text-[#065F46] bg-[#065F46]/10'
                        : item.badgeType === 'mutable'
                        ? 'border-[#0284C7] text-[#0284C7] bg-[#0284C7]/10'
                        : 'border-[#64748B] text-[#64748B] bg-[#64748B]/10'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[#57534E] line-clamp-2 leading-relaxed">
                  "{item.query}"
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-[#F2ECE0] flex items-center justify-between text-[10px] text-[#78716C]">
                <span>{item.hint}</span>
                <span className="text-[#991B1B] font-semibold group-hover:translate-x-0.5 transition-transform">
                  Kiểm tra →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Query Bar */}
      <div className="bg-[#FAF7F0] border border-[#E2DBD0] rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          <div className="sm:w-52 shrink-0">
            <label className="text-[11px] font-mono text-[#78716C] block mb-1">
              CHỌN CỔ PHỤC THỬ NGHIỆM
            </label>
            <select
              value={selectedGarment}
              onChange={(e) => setSelectedGarment(e.target.value as GarmentKey)}
              className="w-full text-xs font-semibold bg-white border border-[#D6CEBE] rounded-lg px-3 py-2 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
            >
              <option value="ngu_than">Áo Ngũ Thân tay chẽn</option>
              <option value="ao_tac">Áo Tấc lễ phục</option>
              <option value="nhat_binh">Áo Nhật Bình hoàng tộc</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="text-[11px] font-mono text-[#78716C] block mb-1">
              NHẬP CÂU HỎI THỬ NGHIỆM CỦA BẠN
            </label>
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="VD: What if đổi vải áo sang dạ tweed và cắt tà áo ngắn ngang thắt lưng?"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunWhatIf(queryInput);
              }}
              className="w-full text-xs bg-white border border-[#D6CEBE] rounded-lg px-3 py-2 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
            />
          </div>

          <button
            onClick={() => handleRunWhatIf(queryInput)}
            disabled={loading || !queryInput.trim()}
            className="px-5 py-2 bg-[#1C1917] hover:bg-[#991B1B] disabled:bg-[#A8A29E] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm h-[36px]"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang Thẩm Định...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Thẩm Định Ngay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Viewport */}
      {evaluation && (
        <div className="bg-[#FAF7F0] border-2 border-[#1C1917] rounded-xl p-5 sm:p-6 shadow-md space-y-5 animate-in fade-in slide-in-from-bottom-2">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2DBD0] gap-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-0.5">
                KẾT QUẢ PHẢN BIỆN DI SẢN (WHAT-IF EVALUATION)
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917]">
                "{evaluation.query}"
              </h3>
            </div>

            {/* Strict 3 Status Badge */}
            <div className="shrink-0">
              {evaluation.status === 'Supported' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded-md text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>SUPPORTED (HỢP THỨC DI SẢN)</span>
                </div>
              )}
              {evaluation.status === 'Supported with Caution' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] rounded-md text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                  <span>SUPPORTED WITH CAUTION (CẢNH BÁO)</span>
                </div>
              )}
              {evaluation.status === 'Insufficient Evidence' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded-md text-xs font-bold">
                  <HelpCircle className="w-4 h-4 text-[#DC2626]" />
                  <span>INSUFFICIENT EVIDENCE (THIẾU SỬ LIỆU)</span>
                </div>
              )}
            </div>
          </div>

          {/* Uncertainty Flag Banner if true */}
          {evaluation.uncertainty_flag && (
            <div className="p-3.5 bg-[#FEF2F2] border-l-4 border-[#DC2626] rounded-r text-xs text-[#991B1B]">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <AlertOctagon className="w-4 h-4 text-[#DC2626]" />
                <span>UNCERTAINTY FLAG: KHÔNG CÓ TRONG CULTURAL KNOWLEDGE BASE</span>
              </div>
              <p className="text-[#7F1D1D] leading-relaxed">
                Chi tiết hoặc họa tiết bạn hỏi chưa được chứng thực trong CKB. Cần thận trọng ghi chú tính chất sáng tác đương đại, tránh ngộ nhận là lịch sử.
              </p>
            </div>
          )}

          {/* Redlines & Invariant Warnings */}
          {evaluation.cautions_and_redlines.length > 0 && (
            <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B] space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-[#7F1D1D]">
                <AlertOctagon className="w-4 h-4 text-[#DC2626]" />
                <span>CẢNH BÁO VI PHẠM CỐT LÕI (REDLINES):</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#7F1D1D] pl-1 font-medium leading-relaxed">
                {evaluation.cautions_and_redlines.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Cultural Impact Analysis */}
          <div className="p-4 bg-white border border-[#E2DBD0] rounded-xl space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716C] block font-semibold">
              PHÂN TÍCH TÁC ĐỘNG VĂN HÓA TỪ AUDITOR
            </span>
            <p className="text-xs text-[#44403C] leading-relaxed font-serif text-sm">
              {evaluation.impact_analysis}
            </p>
          </div>

          {/* Relevant Evidence Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#78716C]">Hồ sơ CKB liên đới:</span>
            {evaluation.violated_evidence_ids.map((id) => (
              <button
                key={id}
                onClick={() => onOpenCKB?.(id)}
                className="font-mono text-[11px] font-bold px-2 py-0.5 bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5] rounded hover:bg-[#FECACA]"
              >
                Vi phạm: {id}
              </button>
            ))}
            {evaluation.applicable_evidence_ids.map((id) => (
              <button
                key={id}
                onClick={() => onOpenCKB?.(id)}
                className="font-mono text-[11px] font-bold px-2 py-0.5 bg-white text-[#1C1917] border border-[#D6CEBE] rounded hover:bg-[#F2ECE0]"
              >
                Căn cứ: {id}
              </button>
            ))}
          </div>

          {/* Stylist Counter-Proposal (Smart Alternative) */}
          <div className="p-5 bg-white border-2 border-[#B45309] rounded-xl shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#B45309]" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#B45309] font-bold block">
                  STYLIST COUNTER-PROPOSAL (GIẢI PHÁP THAY THẾ THÔNG MINH)
                </span>
                <h4 className="text-base font-serif font-bold text-[#1C1917]">
                  {evaluation.stylist_counter_proposal.title}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-[#E2DBD0] text-xs">
              <div className="space-y-1">
                <span className="font-bold text-[#1C1917] flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-[#B45309]" />
                  Giải Pháp Thiết Kế
                </span>
                <p className="text-[#57534E] leading-relaxed text-[11px]">
                  {evaluation.stylist_counter_proposal.solution}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#065F46] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                  Bảo Toàn Di Sản
                </span>
                <p className="text-[#57534E] leading-relaxed text-[11px]">
                  {evaluation.stylist_counter_proposal.heritage_safeguard}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#1C1917] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
                  Vật Liệu & Cắt May
                </span>
                <p className="text-[#57534E] leading-relaxed text-[11px]">
                  {evaluation.stylist_counter_proposal.materials_and_cuts}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
