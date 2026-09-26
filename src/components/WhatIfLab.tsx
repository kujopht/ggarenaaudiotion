import React, { useState, useEffect, useRef } from 'react';
import { WhatIfEvaluation, GarmentKey, OutfitProposal } from '../types/vietphuc';
import { formatSourceBadge, handleWhatIfStandaloneGarmentChange } from '../utils/remixStateHelpers';
import { Sparkles, ShieldCheck, AlertTriangle, AlertOctagon, Lightbulb, Compass, ArrowRight, Wand2, X, RotateCcw, HelpCircle } from 'lucide-react';

interface WhatIfLabProps {
  currentGarment: GarmentKey;
  activeProposal: OutfitProposal | null;
  onOpenCKB?: (evidenceId?: string) => void;
}

const PRESET_QUERIES = [
  {
    title: 'Cài vạt sang trái (Tả nhậm)',
    garment: 'ngu_than' as GarmentKey,
    garmentLabel: 'Áo Ngũ Thân',
    query: 'What if đổi vạt áo và cài khuy sang bên trái (Tả nhậm) để người thuận tay trái dễ mặc?',
    badge: 'KB-RULE-01',
    badgeType: 'redline',
    hint: 'Tang ma cấm kỵ',
  },
  {
    title: 'Thêu Rồng 5 móng dạo phố',
    garment: 'ao_tac' as GarmentKey,
    garmentLabel: 'Áo Tấc',
    query: 'What if thêu họa tiết Rồng 5 móng ánh kim lên tà áo Tấc đi dự tiệc cưới và dạo phố?',
    badge: 'KB-RULE-03',
    badgeType: 'redline',
    hint: 'Hoàng quyền cấm kỵ',
  },
  {
    title: 'Đổi cổ Lập Lĩnh thành Cổ Vest V',
    garment: 'ngu_than' as GarmentKey,
    garmentLabel: 'Áo Ngũ Thân',
    query: 'What if đổi cổ áo lập lĩnh của áo Ngũ thân thành cổ vest khoét sâu thoáng mát?',
    badge: 'KB-NGUTHAN-01',
    badgeType: 'invariant',
    hint: 'Bất biến cốt lõi',
  },
  {
    title: 'Áo Tấc Mở Khuy Làm Duster Coat',
    garment: 'ao_tac' as GarmentKey,
    garmentLabel: 'Áo Tấc',
    query: 'What if cởi mở toàn bộ khuy áo Tấc mặc buông làm áo khoác duster coat phối với quần tây và boots?',
    badge: 'KB-TAC-03',
    badgeType: 'mutable',
    hint: 'Vùng biến tấu hợp thức',
  },
  {
    title: 'Bỏ Dải Ngũ Sắc Ở Cổ Tay Nhật Bình',
    garment: 'nhat_binh' as GarmentKey,
    garmentLabel: 'Áo Nhật Bình',
    query: 'What if bỏ dải màu ngũ sắc ở viền tay áo Nhật Bình để chuyển sang phối màu monochrome tối giản?',
    badge: 'KB-NHATBINH-02',
    badgeType: 'invariant',
    hint: 'Ngũ hành bất biến',
  },
  {
    title: 'Thêu Chim Lạc Thời Đông Sơn',
    garment: 'ngu_than' as GarmentKey,
    garmentLabel: 'Áo Ngũ Thân',
    query: 'What if thêu hình chim Lạc trống đồng thời Đông Sơn và rồng thời Lý lên tà áo ngũ thân?',
    badge: 'NGOÀI DỮ LIỆU',
    badgeType: 'insufficient',
    hint: 'Chưa có trong dữ liệu tham chiếu',
  },
];

export const WhatIfLab: React.FC<WhatIfLabProps> = ({
  currentGarment,
  activeProposal,
  onOpenCKB,
}) => {
  // Local detachment flag: if true, user has detached WhatIf to standalone mode,
  // without deleting the proposals in Studio!
  const [isDetached, setIsDetached] = useState<boolean>(false);

  const effectiveActiveProposal = !isDetached ? activeProposal : null;

  const [selectedGarment, setSelectedGarment] = useState<GarmentKey>(
    effectiveActiveProposal ? effectiveActiveProposal.garment_type : currentGarment
  );
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<WhatIfEvaluation | null>(null);
  const [evaluationSource, setEvaluationSource] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const activeReqIdRef = useRef<number>(0);
  const activeGarmentRef = useRef<GarmentKey>(selectedGarment);
  const activeProposalId = effectiveActiveProposal?.id ?? null;
  const prevProposalIdRef = useRef(activeProposalId);

  activeGarmentRef.current = selectedGarment;

  // Abort on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Sync garment and clear previous evaluation when target proposal changes
  useEffect(() => {
    if (effectiveActiveProposal) {
      setSelectedGarment(effectiveActiveProposal.garment_type);
      activeGarmentRef.current = effectiveActiveProposal.garment_type;
    }

    if (prevProposalIdRef.current !== activeProposalId) {
      prevProposalIdRef.current = activeProposalId;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      activeReqIdRef.current++;
      setLoading(false);
      setEvaluation(null);
      setEvaluationSource(null);
      setQueryInput('');
      setErrorMsg(null);
    }
  }, [effectiveActiveProposal, activeProposalId]);

  // Handle user detaching WhatIf to standalone mode
  const handleDetachToStandalone = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    activeReqIdRef.current++;
    setLoading(false);
    setIsDetached(true);
    setEvaluation(null);
    setEvaluationSource(null);
    setQueryInput('');
    setErrorMsg(null);
  };

  // Handle re-attaching the active proposal from Studio
  const handleReattachStudioProposal = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    activeReqIdRef.current++;
    setLoading(false);
    setIsDetached(false);
    setEvaluation(null);
    setEvaluationSource(null);
    setQueryInput('');
    setErrorMsg(null);
  };

  // When changing garment dropdown in standalone mode:
  // Clears evaluation, evaluationSource, errorMsg, aborts in-flight request,
  // does not auto-call Gemini and does not affect Studio proposals!
  const handleSelectGarmentInStandalone = (newGarment: GarmentKey) => {
    if (newGarment === selectedGarment) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    activeReqIdRef.current++;
    activeGarmentRef.current = newGarment;

    const nextState = handleWhatIfStandaloneGarmentChange(selectedGarment, newGarment, {
      selectedGarment,
      evaluation,
      evaluationSource,
      errorMsg,
      loading,
    });

    setSelectedGarment(nextState.selectedGarment);
    setEvaluation(nextState.evaluation);
    setEvaluationSource(nextState.evaluationSource);
    setErrorMsg(nextState.errorMsg);
    setLoading(nextState.loading);
  };

  const handleRunWhatIf = async (queryText: string, targetGarment: GarmentKey = selectedGarment) => {
    // Prevent duplicate requests inside handler
    if (loading) return;
    if (!queryText.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const reqId = ++activeReqIdRef.current;
    const outfitAtRequestTime = effectiveActiveProposal;
    const garmentAtRequestTime = targetGarment;
    activeGarmentRef.current = targetGarment;

    setLoading(true);
    setErrorMsg(null);
    setQueryInput(queryText);
    // Clear previous evaluation immediately while running
    setEvaluation(null);
    setEvaluationSource(null);

    try {
      const res = await fetch('/api/remix/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          garment: garmentAtRequestTime,
          query: queryText,
          // Only send current_outfit if not detached and activeProposal exists
          current_outfit: outfitAtRequestTime || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Máy chủ trả về mã lỗi ${res.status}`);
      }

      const data = await res.json();

      // Check if request was aborted, garment changed, or active proposal changed
      if (
        controller.signal.aborted ||
        reqId !== activeReqIdRef.current ||
        activeGarmentRef.current !== garmentAtRequestTime ||
        (effectiveActiveProposal?.id !== outfitAtRequestTime?.id)
      ) {
        return;
      }

      if (data.evaluation) {
        setEvaluation(data.evaluation);
        setEvaluationSource(data.source || '');
      } else {
        throw new Error('Không nhận được dữ liệu đánh giá từ máy chủ.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || controller.signal.aborted) {
        return;
      }
      if (reqId === activeReqIdRef.current && activeGarmentRef.current === garmentAtRequestTime) {
        console.error('Failed to run What-If evaluation:', err);
        setErrorMsg(err.message || 'Lỗi kết nối khi gửi yêu cầu What-If.');
      }
    } finally {
      if (reqId === activeReqIdRef.current && !controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  // Safe format source badge display (Gemini only when source === 'gemini')
  const renderSourceBadge = () => {
    const info = formatSourceBadge(evaluationSource);
    if (info.badgeType === 'gemini') {
      return (
        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-[#C9A66B]/15 text-[#E6C88B] border border-[#C9A66B]/40 flex items-center gap-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E6C88B]" />
          {info.label}
        </span>
      );
    }
    if (info.badgeType === 'fallback') {
      return (
        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-[#B8342B]/15 text-[#F5A39D] border border-[#B8342B]/40 shadow-xs">
          {info.label}
        </span>
      );
    }
    return (
      <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-[#2C211D] text-[#B8AA96] border border-[#4A3830]">
        {info.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="lacquer-panel rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#C9A66B] uppercase tracking-wider">
              Phòng Thử Nghiệm Giả Định
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F2E9D8] tracking-tight">
            "What If...?" Thử nghiệm mọi thay đổi & tìm giải pháp thay thế
          </h2>
          <p className="text-sm sm:text-base text-[#B8AA96] max-w-2xl leading-relaxed">
            Bạn muốn thay đổi kiểu cổ, dời khuy cài hay phối hoa văn mới? Đặt câu hỏi để hệ thống đối chiếu với quy tắc tham chiếu và đề xuất giải pháp thay thế (Stylist Counter-Proposal) hợp lý.
          </p>
        </div>
      </div>

      {/* Connection Indicator: Linked to Studio Look vs Standalone */}
      {effectiveActiveProposal ? (
        <div className="lacquer-card-elevated border-2 border-[#C9A66B]/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase text-[#E6C88B] tracking-wider">
                Đang thử nghiệm trên bản phối đã chọn:
              </span>
              <span className="text-xs font-mono px-2 py-0.5 bg-[#C9A66B]/20 text-[#E6C88B] rounded-md border border-[#C9A66B]/40">
                Mức biến tấu {effectiveActiveProposal.dial_level}/5
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#F2E9D8]">
              {effectiveActiveProposal.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#B8AA96]">
              Cổ phục: {effectiveActiveProposal.garment_type === 'ngu_than' ? 'Áo Ngũ Thân tay chẽn' : effectiveActiveProposal.garment_type === 'ao_tac' ? 'Áo Tấc lễ phục' : 'Áo Nhật Bình'} · {effectiveActiveProposal.concept_tag}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDetachToStandalone}
              className="text-xs sm:text-sm font-medium text-[#B8AA96] hover:text-[#F5A39D] bg-[#181311]/70 border border-[#C9A66B]/20 hover:border-[#B8342B]/60 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer min-h-[42px] backdrop-blur-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Bỏ chọn (Chuyển sang thử tự do)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="lacquer-panel-subtle rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-[#B8AA96]">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2 py-1 rounded-md bg-[#261C19]/80 text-[#E6C88B] border border-[#C9A66B]/30 backdrop-blur-xs">
              CHẾ ĐỘ TỰ DO
            </span>
            <span>Bạn đang thử nghiệm độc lập. Bạn có thể chọn bất kỳ loại áo nào bên dưới.</span>
          </div>

          {/* Re-attach button if studio proposal exists */}
          {activeProposal && isDetached && (
            <button
              onClick={handleReattachStudioProposal}
              className="text-xs font-semibold text-[#E6C88B] hover:text-[#F2E9D8] bg-[#C9A66B]/15 hover:bg-[#C9A66B]/25 border border-[#C9A66B]/40 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer min-h-[40px] backdrop-blur-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Dùng lại bản phối từ Xưởng ({activeProposal.title})</span>
            </button>
          )}
        </div>
      )}

      {/* Preset Fast-Test Scenarios */}
      <div className="lacquer-panel rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F2E9D8] flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#C9A66B]" />
            <span>Kịch bản thử nghiệm phổ biến (Bấm để thử ngay)</span>
          </span>
          <span className="text-xs text-[#8C7E6C] font-mono">
            {effectiveActiveProposal ? `Đang lọc cho ${effectiveActiveProposal.garment_type === 'ngu_than' ? 'Áo Ngũ Thân' : effectiveActiveProposal.garment_type === 'ao_tac' ? 'Áo Tấc' : 'Áo Nhật Bình'}` : '6 kịch bản mẫu'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_QUERIES.map((item, idx) => {
            const isConflict = Boolean(effectiveActiveProposal && item.garment !== effectiveActiveProposal.garment_type);

            return (
              <button
                key={idx}
                disabled={isConflict || loading}
                onClick={() => {
                  if (loading || isConflict) return;
                  if (!effectiveActiveProposal) {
                    if (item.garment !== selectedGarment) {
                      handleSelectGarmentInStandalone(item.garment);
                    }
                  }
                  handleRunWhatIf(item.query, effectiveActiveProposal ? effectiveActiveProposal.garment_type : item.garment);
                }}
                className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between min-h-[110px] ${
                  isConflict
                    ? 'opacity-40 cursor-not-allowed bg-[#181311]/40 border-[#C9A66B]/10'
                    : loading
                    ? 'opacity-60 cursor-wait bg-[#181311]/50 border-[#C9A66B]/20'
                    : 'bg-[#181311]/50 border-[#C9A66B]/15 hover:border-[#C9A66B]/50 hover:bg-[#211815]/75 cursor-pointer group backdrop-blur-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className={`text-xs sm:text-sm font-bold ${isConflict ? 'text-[#6E5D53]' : 'text-[#F2E9D8] group-hover:text-[#E6C88B]'}`}>
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        item.badgeType === 'redline'
                          ? 'border-[#B8342B]/50 text-[#F5A39D] bg-[#B8342B]/15'
                          : item.badgeType === 'invariant'
                          ? 'border-[#43B6A4]/50 text-[#43B6A4] bg-[#43B6A4]/15'
                          : item.badgeType === 'mutable'
                          ? 'border-[#C9A66B]/50 text-[#E6C88B] bg-[#C9A66B]/15'
                          : 'border-[#3A2B25] text-[#8C7E6C] bg-[#261C19]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${isConflict ? 'text-[#6E5D53]' : 'text-[#B8AA96]'}`}>
                    "{item.query}"
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#C9A66B]/15 flex items-center justify-between text-xs">
                  {isConflict ? (
                    <span className="text-[#6E5D53] italic text-[11px]">
                      Dành cho {item.garmentLabel} (khác loại áo đang chọn)
                    </span>
                  ) : (
                    <>
                      <span className="text-[#8C7E6C]">{item.hint}</span>
                      <span className="text-[#C9A66B] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Thử ngay →
                      </span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Bar */}
      <div className="lacquer-panel rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          <div className="sm:w-56 shrink-0">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#B8AA96] block mb-1.5">
              {effectiveActiveProposal ? 'Loại áo đang thử nghiệm' : 'Chọn loại áo thử nghiệm'}
            </label>
            <select
              value={selectedGarment}
              onChange={(e) => handleSelectGarmentInStandalone(e.target.value as GarmentKey)}
              disabled={!!effectiveActiveProposal || loading}
              className={`w-full text-sm font-medium bg-[#181311]/60 border border-[#C9A66B]/20 rounded-xl px-3 py-2.5 text-[#F2E9D8] focus:outline-none focus:border-[#C9A66B] min-h-[44px] backdrop-blur-xs ${
                effectiveActiveProposal ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <option value="ngu_than">Áo Ngũ Thân tay chẽn</option>
              <option value="ao_tac">Áo Tấc lễ phục</option>
              <option value="nhat_binh">Áo Nhật Bình hoàng tộc</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#B8AA96] block mb-1.5">
              Nhập câu hỏi thử nghiệm của bạn (What If...?)
            </label>
            <input
              type="text"
              value={queryInput}
              disabled={loading}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="VD: What if đổi vải áo sang dạ tweed và cắt tà áo ngắn ngang thắt lưng?"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (!loading && queryInput.trim()) {
                    handleRunWhatIf(queryInput);
                  }
                }
              }}
              className="w-full text-sm bg-[#181311]/60 border border-[#C9A66B]/20 rounded-xl px-3.5 py-2.5 text-[#F2E9D8] placeholder:text-[#6E5D53] focus:outline-none focus:border-[#C9A66B] min-h-[44px] backdrop-blur-xs"
            />
          </div>

          <button
            onClick={() => handleRunWhatIf(queryInput)}
            disabled={loading || !queryInput.trim()}
            className="px-5 py-2.5 bg-[#B8342B] hover:bg-[#A32D25] disabled:bg-[#3A2B25] text-[#F2E9D8] rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-xs min-h-[44px] cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang đối chiếu...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-[#F5DCA3]" />
                <span>Thẩm định ngay</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Results Viewport */}
      {evaluation && (
        <div className="lacquer-card-elevated rounded-2xl p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C9A66B]/20 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono uppercase tracking-wider text-[#B8AA96]">
                  Kết quả tham chiếu văn hóa
                </span>
                {renderSourceBadge()}
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F2E9D8]">
                "{evaluation.query}"
              </h3>
            </div>

            {/* Status Badges */}
            <div className="shrink-0 flex items-center gap-1.5 flex-wrap">
              {(evaluation.status === 'Supported with Caution' ||
                evaluation.violates_invariants ||
                (evaluation.cautions_and_redlines && evaluation.cautions_and_redlines.length > 0)) && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold backdrop-blur-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Có điểm cần lưu ý theo quy tắc tham chiếu</span>
                </div>
              )}
              {(evaluation.status === 'Insufficient Evidence' || evaluation.uncertainty_flag) && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/15 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-semibold backdrop-blur-xs">
                  <HelpCircle className="w-4 h-4 text-rose-400" />
                  <span>Chưa đủ dữ liệu tham chiếu</span>
                </div>
              )}
              {evaluation.status === 'Supported' &&
                !evaluation.uncertainty_flag &&
                !evaluation.violates_invariants &&
                (!evaluation.cautions_and_redlines || evaluation.cautions_and_redlines.length === 0) && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A66B]/15 border border-[#C9A66B]/40 text-[#E6C88B] rounded-lg text-xs font-semibold backdrop-blur-xs">
                  <ShieldCheck className="w-4 h-4 text-[#E6C88B]" />
                  <span>Phù hợp với quy tắc tham chiếu của bản thử nghiệm</span>
                </div>
              )}
            </div>
          </div>

          {/* Uncertainty Flag Banner */}
          {evaluation.uncertainty_flag && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs sm:text-sm text-rose-200 backdrop-blur-xs">
              <div className="font-semibold flex items-center gap-1.5 mb-1 text-rose-300">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>Chi tiết nằm ngoài dữ liệu tham chiếu của bản thử nghiệm</span>
              </div>
              <p className="text-rose-200/90 leading-relaxed text-xs sm:text-sm">
                Chi tiết hoặc họa tiết bạn hỏi chưa có tài liệu xác thực trong dữ liệu tham chiếu của bản thử nghiệm. Cần lưu ý đây là sáng tác tự do đương đại.
              </p>
            </div>
          )}

          {/* Redlines & Warnings */}
          {evaluation.cautions_and_redlines.length > 0 && (
            <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs sm:text-sm text-amber-200 space-y-1.5 backdrop-blur-xs">
              <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Điểm cần lưu ý theo quy tắc tham chiếu:</span>
              </div>
              <ul className="space-y-1 list-disc list-inside space-y-1 text-amber-200/90 text-xs sm:text-sm pl-1 leading-relaxed">
                {evaluation.cautions_and_redlines.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Cultural Impact Analysis */}
          <div className="p-4 bg-[#181311]/60 border border-[#C9A66B]/20 rounded-xl space-y-1.5 backdrop-blur-xs">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C9A66B] font-semibold block">
              Phân tích tham chiếu văn hóa
            </span>
            <p className="text-sm sm:text-base text-[#F2E9D8] leading-relaxed font-serif">
              {evaluation.impact_analysis}
            </p>
          </div>

          {/* Relevant Evidence Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#8C7E6C]">Dẫn chứng quy tắc liên quan:</span>
            {evaluation.violated_evidence_ids.map((id) => (
              <button
                key={id}
                onClick={() => onOpenCKB?.(id)}
                className="font-mono text-xs font-semibold px-2.5 py-1 bg-[#B8342B]/20 text-[#F5A39D] border border-[#B8342B]/50 rounded-lg hover:bg-[#B8342B]/30 cursor-pointer backdrop-blur-xs"
              >
                Cần lưu ý: {id}
              </button>
            ))}
            {evaluation.applicable_evidence_ids.map((id) => (
              <button
                key={id}
                onClick={() => onOpenCKB?.(id)}
                className="font-mono text-xs font-semibold px-2.5 py-1 bg-[#261C19]/80 text-[#E6C88B] border border-[#C9A66B]/30 rounded-lg hover:bg-[#322521] cursor-pointer backdrop-blur-xs"
              >
                Căn cứ: {id}
              </button>
            ))}
          </div>

          {/* Stylist Counter-Proposal (Smart Alternative) */}
          <div className="p-5 sm:p-6 lacquer-card-elevated border-2 border-[#C9A66B]/50 rounded-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <Lightbulb className="w-5 h-5 text-[#E6C88B]" />
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#C9A66B] font-semibold block">
                  Stylist Counter-Proposal · Đề xuất thay thế thông minh
                </span>
                <h4 className="text-base sm:text-lg font-serif font-bold text-[#F2E9D8]">
                  {evaluation.stylist_counter_proposal.title}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-[#C9A66B]/20 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <span className="font-semibold text-[#F2E9D8] flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
                  Giải pháp thiết kế
                </span>
                <p className="text-[#B8AA96] leading-relaxed text-xs sm:text-sm">
                  {evaluation.stylist_counter_proposal.solution}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-[#43B6A4] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#43B6A4]" />
                  Bảo toàn quy tắc tham chiếu
                </span>
                <p className="text-[#B8AA96] leading-relaxed text-xs sm:text-sm">
                  {evaluation.stylist_counter_proposal.heritage_safeguard}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-[#E6C88B] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E6C88B]" />
                  Vật liệu & Cắt may
                </span>
                <p className="text-[#B8AA96] leading-relaxed text-xs sm:text-sm">
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
