import { CulturalAuditResult, GarmentKey, OutfitProposal, WhatIfEvaluation } from '../types/vietphuc';

export type SourceBadgeType = 'gemini' | 'fallback' | 'unknown';

export interface SourceBadgeInfo {
  label: string;
  badgeType: SourceBadgeType;
}

/**
 * 1. Safely formats provenance source badge.
 * ONLY exact 'gemini' gets 'Gemini · Trực tiếp'.
 * Fallbacks get 'Bản mẫu dự phòng'.
 * Missing, empty, or unknown strings get 'Nguồn chưa xác định'.
 */
export function formatSourceBadge(source: string | null | undefined): SourceBadgeInfo {
  if (source === 'gemini') {
    return {
      label: 'Gemini · Trực tiếp',
      badgeType: 'gemini',
    };
  }
  if (source === 'deterministic_engine' || source === 'deterministic_engine_fallback') {
    return {
      label: 'Bản mẫu dự phòng',
      badgeType: 'fallback',
    };
  }
  return {
    label: 'Nguồn chưa xác định',
    badgeType: 'unknown',
  };
}

export interface SummaryBadge {
  label: string;
  variant: 'caution' | 'uncertainty' | 'supported';
}

export interface LookSummaryResult {
  badges: SummaryBadge[];
  summaryText: string;
  hasCaution: boolean;
  hasUncertainty: boolean;
  isFullySupported: boolean;
}

/**
 * 2. Evaluates the cultural reference summary for a proposal.
 * Handles both cautions and uncertainty flags:
 * - If uncertainty_flag is true, NEVER shows green supported badge.
 * - If proposal has BOTH cautions and missing data, shows BOTH badges and messages.
 */
export function getLookSummaryStatus(audit?: CulturalAuditResult | null): LookSummaryResult {
  if (!audit) {
    return {
      badges: [{ label: 'Chưa đủ dữ liệu tham chiếu', variant: 'uncertainty' }],
      summaryText: 'Chưa có thông tin tham chiếu.',
      hasCaution: false,
      hasUncertainty: true,
      isFullySupported: false,
    };
  }

  const hasCaution = Boolean(
    audit.status === 'Supported with Caution' ||
    (audit.cautions_and_redlines && audit.cautions_and_redlines.length > 0)
  );

  const hasUncertainty = Boolean(
    audit.uncertainty_flag ||
    audit.status === 'Insufficient Evidence'
  );

  const badges: SummaryBadge[] = [];

  if (hasCaution) {
    badges.push({
      label: 'Có điểm cần lưu ý',
      variant: 'caution',
    });
  }

  if (hasUncertainty) {
    badges.push({
      label: 'Chưa đủ dữ liệu tham chiếu',
      variant: 'uncertainty',
    });
  }

  // Only show supported if NO caution and NO uncertainty
  if (!hasCaution && !hasUncertainty && audit.status === 'Supported') {
    badges.push({
      label: 'Phù hợp quy tắc tham chiếu',
      variant: 'supported',
    });
  }

  // Compose summary message
  let summaryText = '';
  const cautionSnippet = audit.cautions_and_redlines?.[0] || 'Cần lưu ý một số điểm biến tấu.';
  const uncertaintySnippet = audit.uncertainty_note || 'Chi tiết này chưa có trong dữ liệu tham chiếu của bản thử nghiệm.';

  if (hasCaution && hasUncertainty) {
    summaryText = `[Lưu ý] ${cautionSnippet} · [Dữ liệu] ${uncertaintySnippet}`;
  } else if (hasCaution) {
    summaryText = cautionSnippet;
  } else if (hasUncertainty) {
    summaryText = uncertaintySnippet;
  } else {
    summaryText = audit.auditor_verdict || 'Tuân thủ các quy tắc cốt lõi của bản thử nghiệm.';
  }

  return {
    badges,
    summaryText,
    hasCaution,
    hasUncertainty,
    isFullySupported: !hasCaution && !hasUncertainty && audit.status === 'Supported',
  };
}

/**
 * 3. What-If standalone garment change state transition.
 * When switching garment in standalone mode, clears previous evaluation, source, and error.
 * Does NOT touch studio proposals.
 */
export interface WhatIfGarmentChangeState {
  selectedGarment: GarmentKey;
  evaluation: WhatIfEvaluation | null;
  evaluationSource: string | null;
  errorMsg: string | null;
  loading: boolean;
}

export function handleWhatIfStandaloneGarmentChange(
  currentGarment: GarmentKey,
  newGarment: GarmentKey,
  existingState: WhatIfGarmentChangeState
): WhatIfGarmentChangeState {
  if (currentGarment === newGarment) {
    return existingState;
  }
  return {
    selectedGarment: newGarment,
    evaluation: null,
    evaluationSource: null,
    errorMsg: null,
    loading: false,
  };
}

/**
 * 4. Request validation logic for race condition / late arrival prevention.
 * Ensures an incoming response is discarded if request was aborted,
 * if garment changed, or if a newer request was dispatched.
 */
export function isResponseValid(
  requestSignalAborted: boolean,
  reqId: number,
  activeReqId: number,
  targetGarment: GarmentKey,
  currentGarment: GarmentKey
): boolean {
  if (requestSignalAborted) return false;
  if (reqId !== activeReqId) return false;
  if (targetGarment !== currentGarment) return false;
  return true;
}
