import React, { useState, useEffect, useRef } from 'react';
import { WhatIfEvaluation, GarmentKey, OutfitProposal } from '../types/vietphuc';
import { formatSourceBadge, handleWhatIfStandaloneGarmentChange } from '../utils/remixStateHelpers';
import { getCKBEntry } from '../data/ckbRegistry';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Lightbulb,
  Compass,
  ArrowRight,
  Wand2,
  X,
  RotateCcw,
  HelpCircle,
  FileCheck,
  Layers,
  Info,
} from 'lucide-react';

export interface WhatIfPreset {
  title: string;
  query: string;
}

export const WHAT_IF_PRESETS: Record<GarmentKey, WhatIfPreset[]> = {
  ngu_than: [
    {
      title: 'Đổi hướng cài khuy sang trái',
      query: 'Đổi hướng cài khuy sang bên trái (tả nhậm)',
    },
    {
      title: 'Đổi chất liệu sang denim',
      query: 'Đổi chất liệu sang denim hiện đại kết hợp vạt lửng',
    },
    {
      title: 'Thêm chi tiết phát sáng hiện đại',
      query: 'Thêm chi tiết phát sáng hiện đại lên áo ngũ thân',
    },
  ],
  ao_tac: [
    {
      title: 'Mở vạt như duster coat',
      query: 'Mở vạt như duster coat hiện đại',
    },
    {
      title: 'Đổi hướng cài khuy',
      query: 'Đổi hướng cài khuy sang bên trái thay vì cài khuy bên phải',
    },
    {
      title: 'Thêm chi tiết phát sáng hiện đại',
      query: 'Thêm chi tiết phát sáng hiện đại lên áo tấc',
    },
  ],
  nhat_binh: [
    {
      title: 'Mặc mở vạt với chân váy xếp ly',
      query: 'Mặc mở vạt với chân váy xếp ly hiện đại thay cho quần lụa',
    },
    {
      title: 'Bỏ nẹp cổ đối khâm',
      query: 'Bỏ nẹp cổ đối khâm truyền thống',
    },
    {
      title: 'Thêm chi tiết phát sáng hiện đại',
      query: 'Thêm chi tiết phát sáng hiện đại lên áo nhật bình',
    },
  ],
};

interface WhatIfLabProps {
  currentGarment: GarmentKey;
  activeProposal: OutfitProposal | null;
  onOpenCKB?: (evidenceId?: string) => void;
}

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
          current_outfit: outfitAtRequestTime || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Máy chủ trả về mã lỗi ${res.status}`);
      }

      const data = await res.json();

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

  const currentPresets = WHAT_IF_PRESETS[selectedGarment] || WHAT_IF_PRESETS.ngu_than;

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
        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-600/50 shadow-xs">
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

  // Compute union of valid evidence IDs that exist in CKB
  const allEvidenceIds = evaluation
    ? Array.from(new Set([...evaluation.violated_evidence_ids, ...evaluation.applicable_evidence_ids])).filter(
        (id) => getCKBEntry(id) !== undefined
      )
    : [];

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
              className="text-xs sm:text-sm font-medium text-[#B8AA96] hover:text-[#F5A39D] bg-[#181311]/70 border border-[#C9A66B]/20 hover:border-[#B8342B]/60 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px] backdrop-blur-xs"
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

          {activeProposal && isDetached && (
            <button
              onClick={handleReattachStudioProposal}
              className="text-xs font-semibold text-[#E6C88B] hover:text-[#F2E9D8] bg-[#C9A66B]/15 hover:bg-[#C9A66B]/25 border border-[#C9A66B]/40 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer min-h-[44px] backdrop-blur-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Dùng lại bản phối từ Xưởng ({activeProposal.title})</span>
            </button>
          )}
        </div>
      )}

      {/* Preset Quick Experiments by Garment (Requirement 2) */}
      <div className="lacquer-panel rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F2E9D8] flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#C9A66B]" />
            <span>Thử nghiệm nhanh theo cổ phục (Quick Experiments)</span>
          </span>
          <span className="text-xs text-[#8C7E6C] font-mono">
            3 kịch bản cho {selectedGarment === 'ngu_than' ? 'Áo Ngũ Thân' : selectedGarment === 'ao_tac' ? 'Áo Tấc' : 'Áo Nhật Bình'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {currentPresets.map((preset, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => {
                setQueryInput(preset.query);
                handleRunWhatIf(preset.query, selectedGarment);
              }}
              className="text-left p-3.5 rounded-xl border border-[#C9A66B]/20 bg-[#181311]/60 hover:bg-[#261C19]/80 hover:border-[#C9A66B]/50 transition-all flex flex-col justify-between min-h-[48px] group cursor-pointer backdrop-blur-xs"
            >
              <div className="space-y-1">
                <span className="text-xs sm:text-sm font-bold text-[#F2E9D8] group-hover:text-[#E6C88B] flex items-center justify-between">
                  <span>{preset.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B] group-hover:translate-x-0.5 transition-transform" />
                </span>
                <p className="text-xs text-[#B8AA96] line-clamp-2">
                  "{preset.query}"
                </p>
              </div>
            </button>
          ))}
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
              <option value="nhat_binh">Áo Nhật Bình</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#B8AA96] block mb-1.5">
              Ý tưởng can thiệp của bạn
            </label>
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="VD: What if đổi hướng cài khuy sang bên trái, hoặc thêu họa tiết rồng..."
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

      {/* Results Viewport: 3-Second Readability Layout (Requirement 3 & 4) */}
      {evaluation && (
        <div className="lacquer-card-elevated rounded-2xl p-5 sm:p-6 space-y-6 animate-in fade-in duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#C9A66B]/20 flex-wrap gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C9A66B] font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Kết quả phân tích What If</span>
            </span>
            {renderSourceBadge()}
          </div>

          {/* 1. Đề xuất của bạn */}
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C9A66B] font-bold block">
              Đề xuất của bạn
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#F2E9D8]">
              "{evaluation.query}"
            </h3>
          </div>

          {/* 2. Trạng thái tổng quát, Prototype Compliance & Historical Confidence */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#C9A66B]/20">
            {/* Trạng thái tổng quát */}
            <div className="p-3 rounded-xl bg-[#181311]/70 border border-[#C9A66B]/20 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E6C] font-semibold block">
                Trạng thái tổng quát
              </span>
              <div className="flex items-center gap-1.5">
                {evaluation.status === 'Supported' ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Supported
                  </span>
                ) : evaluation.status === 'Supported with Caution' ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Supported with Caution
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800/80 border border-slate-600/40 text-[#D4C7B4] flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-[#B8AA96]" />
                    Insufficient Evidence
                  </span>
                )}
              </div>
            </div>

            {/* Prototype Compliance (Tuân thủ / Xung đột / Chưa đánh giá) */}
            <div className="p-3 rounded-xl bg-[#181311]/70 border border-[#C9A66B]/20 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E6C] font-semibold block">
                Prototype Compliance
              </span>
              <div className="flex items-center gap-1.5">
                {evaluation.prototype_compliance === 'compliant' ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Tuân thủ Prototype
                  </span>
                ) : evaluation.prototype_compliance === 'conflict' ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                    Xung đột Prototype
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800/80 border border-slate-600/40 text-[#D4C7B4] flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-[#B8AA96]" />
                    Chưa đánh giá Prototype
                  </span>
                )}
              </div>
            </div>

            {/* Historical Confidence */}
            <div className="p-3 rounded-xl bg-[#181311]/70 border border-[#C9A66B]/20 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7E6C] font-semibold block">
                Historical Confidence
              </span>
              <div className="flex items-center gap-1.5">
                {evaluation.historical_confidence === 'verified' ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Đã kiểm chứng
                  </span>
                ) : evaluation.historical_confidence === 'partially_verified' ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-200 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-300" />
                    Đã xác thực một phần
                  </span>
                ) : evaluation.historical_confidence === 'needs_review' ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    Đang chờ đối soát
                  </span>
                ) : evaluation.historical_confidence === 'mixed' ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800/80 border border-slate-600/40 text-[#D4C7B4] flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-[#B8AA96]" />
                    Nguồn hỗn hợp
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800/80 border border-slate-600/40 text-[#D4C7B4] flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-[#B8AA96]" />
                    Chưa đối soát độc lập
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Compact Before - Change - Counter Proposal Flow (Requirement 4) */}
          {effectiveActiveProposal && (
            <div className="p-4 rounded-xl bg-[#140F0D]/90 border border-[#C9A66B]/30 space-y-3 backdrop-blur-xs">
              <span className="text-xs font-mono font-bold uppercase text-[#E6C88B] tracking-wider block">
                Hành trình đối sánh (Before · Change · Counter Proposal)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Before: Bản phối hiện tại */}
                <div className="p-3 rounded-lg bg-[#1F1714]/80 border border-[#C9A66B]/20 space-y-1">
                  <span className="text-[10px] font-mono text-[#C9A66B] font-bold block">
                    BẢN PHỐI HIỆN TẠI
                  </span>
                  <h5 className="text-xs sm:text-sm font-serif font-bold text-[#F2E9D8] truncate">
                    {effectiveActiveProposal.title}
                  </h5>
                  <p className="text-[11px] text-[#B8AA96] line-clamp-2">
                    {effectiveActiveProposal.concept_tag} · Dial {effectiveActiveProposal.dial_level}/5
                  </p>
                </div>

                {/* Change: Thay đổi đang thử */}
                <div className="p-3 rounded-lg bg-[#1F1714]/80 border border-[#C9A66B]/20 space-y-1">
                  <span className="text-[10px] font-mono text-[#E6C88B] font-bold block">
                    THAY ĐỔI ĐANG THỬ
                  </span>
                  <p className="text-xs sm:text-sm text-[#F2E9D8] italic line-clamp-2">
                    "{evaluation.query}"
                  </p>
                </div>

                {/* Counter Proposal: Đề xuất thay thế */}
                <div className="p-3 rounded-lg bg-[#1F1714]/80 border border-[#43B6A4]/30 space-y-1">
                  <span className="text-[10px] font-mono text-[#43B6A4] font-bold block">
                    ĐỀ XUẤT THAY THẾ
                  </span>
                  <h5 className="text-xs sm:text-sm font-serif font-bold text-[#F2E9D8] truncate">
                    {evaluation.stylist_counter_proposal.title}
                  </h5>
                  <p className="text-[11px] text-[#B8AA96] line-clamp-2">
                    {evaluation.stylist_counter_proposal.solution}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. Evidence (Requirement 3 & 5) */}
          <div className="space-y-2 pt-2 border-t border-[#C9A66B]/20">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C9A66B] font-bold block">
              Dẫn chứng quy tắc (Evidence)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {allEvidenceIds.length > 0 ? (
                allEvidenceIds.map((id) => (
                  <button
                    key={id}
                    onClick={() => onOpenCKB?.(id)}
                    className="font-mono text-xs font-semibold px-3 py-2 bg-[#261C19]/80 hover:bg-[#382823] text-[#E6C88B] border border-[#C9A66B]/40 rounded-lg min-h-[44px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Căn cứ CKB: {id}</span>
                    <ArrowRight className="w-3 h-3 text-[#C9A66B]" />
                  </button>
                ))
              ) : (
                <span className="text-xs text-[#8C7E6C] italic min-h-[44px] flex items-center">
                  Chưa đủ dữ liệu tham chiếu
                </span>
              )}
            </div>
          </div>

          {/* 4. Phân tích tác động & Phương án thay thế của Stylist (2 cols on Desktop - Requirement 3 & 9) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-[#C9A66B]/20">
            {/* Phân tích tác động */}
            <div className="p-4 sm:p-5 bg-[#181311]/70 border border-[#C9A66B]/20 rounded-xl space-y-3 backdrop-blur-xs">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C9A66B] font-bold block">
                Phân tích tác động
              </span>
              <p className="text-sm sm:text-base text-[#F2E9D8] leading-relaxed font-serif">
                {evaluation.impact_analysis}
              </p>

              {evaluation.cautions_and_redlines.length > 0 && (
                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl space-y-1 text-xs text-amber-200">
                  <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lưu ý theo quy tắc tham chiếu:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1 text-amber-200/90 leading-relaxed">
                    {evaluation.cautions_and_redlines.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Phương án thay thế của Stylist (Stylist Counter-Proposal - Requirement 7) */}
            <div className="p-4 sm:p-5 lacquer-card-elevated border-2 border-[#C9A66B]/50 rounded-xl space-y-4 backdrop-blur-xs">
              <div className="flex items-center gap-2.5">
                <Lightbulb className="w-5 h-5 text-[#E6C88B] shrink-0" />
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C9A66B] font-semibold block">
                    Stylist Counter-Proposal · Phương án thay thế
                  </span>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-[#F2E9D8]">
                    {evaluation.stylist_counter_proposal.title}
                  </h4>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#C9A66B]/20 text-xs sm:text-sm">
                <div className="space-y-1">
                  <span className="font-semibold text-[#F2E9D8] flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
                    Giải pháp thiết kế
                  </span>
                  <p className="text-[#B8AA96] leading-relaxed">
                    {evaluation.stylist_counter_proposal.solution}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-[#43B6A4] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#43B6A4]" />
                    Bảo toàn quy tắc tham chiếu
                  </span>
                  <p className="text-[#B8AA96] leading-relaxed">
                    {evaluation.stylist_counter_proposal.heritage_safeguard}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-[#E6C88B] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E6C88B]" />
                    Vật liệu & Cắt may
                  </span>
                  <p className="text-[#B8AA96] leading-relaxed">
                    {evaluation.stylist_counter_proposal.materials_and_cuts}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
