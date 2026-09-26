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
  hasDesignCaution: boolean;
  hasEvidenceUncertainty: boolean;
  hasCaution: boolean; // backward compatibility
  hasUncertainty: boolean; // backward compatibility
  isFullySupported: boolean;
  prototypeComplianceLabel: string;
  historicalConfidenceLabel: string;
}

/**
 * 2. Evaluates the cultural reference summary for a proposal.
 * Logic Hardening (Requirement 3 & 8):
 * - Explicitly separates design caution from evidence uncertainty.
 * - If design is compliant with prototype and has no redlines, do NOT show "Có điểm cần lưu ý"
 *   even if historical evidence is unverified.
 * - Shows clear two-layer semantics: Prototype Compliance and Historical Confidence.
 */
export function getLookSummaryStatus(audit?: CulturalAuditResult | null): LookSummaryResult {
  if (!audit) {
    return {
      badges: [{ label: 'Chưa đủ dữ liệu tham chiếu', variant: 'uncertainty' }],
      summaryText: 'Chưa có thông tin tham chiếu.',
      hasDesignCaution: false,
      hasEvidenceUncertainty: true,
      hasCaution: false,
      hasUncertainty: true,
      isFullySupported: false,
      prototypeComplianceLabel: 'Chưa đối soát quy tắc prototype',
      historicalConfidenceLabel: 'Nguồn lịch sử chưa xác minh độc lập',
    };
  }

  // Design caution: prototype conflict, failed invariants, or cautions/redlines
  const hasDesignCaution = Boolean(
    audit.prototype_compliance === 'conflict' ||
    audit.has_design_caution ||
    (audit.invariants_checked && audit.invariants_checked.some((inv) => !inv.passed)) ||
    (audit.cautions_and_redlines && audit.cautions_and_redlines.length > 0)
  );

  // Evidence uncertainty: unverified or needs_review sources, or missing evidence
  const hasEvidenceUncertainty = Boolean(
    audit.uncertainty_flag ||
    audit.has_evidence_uncertainty ||
    audit.status === 'Insufficient Evidence' ||
    audit.historical_confidence === 'unverified' ||
    audit.historical_confidence === 'needs_review' ||
    audit.historical_confidence === 'partially_verified' ||
    audit.historical_confidence === 'mixed'
  );

  const prototypeComplianceLabel =
    hasDesignCaution || audit.prototype_compliance === 'conflict'
      ? 'Có xung đột với quy tắc prototype'
      : audit.prototype_compliance === 'unassessed' || audit.status === 'Insufficient Evidence'
      ? 'Chưa đối soát quy tắc prototype'
      : 'Phù hợp với quy tắc prototype';

  const historicalConfidenceLabel =
    audit.historical_confidence === 'verified'
      ? 'Đã đối chiếu nguồn'
      : audit.historical_confidence === 'needs_review'
      ? 'Nguồn lịch sử cần rà soát thêm'
      : audit.historical_confidence === 'partially_verified'
      ? 'Nguồn đối chiếu một phần'
      : audit.historical_confidence === 'mixed'
      ? 'Nguồn tham chiếu hỗn hợp'
      : audit.status === 'Insufficient Evidence'
      ? 'Chưa đủ dữ liệu tham chiếu'
      : 'Nguồn lịch sử chưa xác minh độc lập';

  const badges: SummaryBadge[] = [];

  // 1. Only add caution badge if there is an ACTUAL design caution
  if (hasDesignCaution) {
    badges.push({
      label: audit.prototype_compliance === 'conflict' ? 'Có xung đột với quy tắc prototype' : 'Có điểm cần lưu ý',
      variant: 'caution',
    });
  }

  // 2. Add uncertainty badge if evidence has uncertainty
  if (hasEvidenceUncertainty) {
    badges.push({
      label: audit.status === 'Insufficient Evidence' ? 'Chưa đủ dữ liệu tham chiếu' : historicalConfidenceLabel,
      variant: 'uncertainty',
    });
  }

  // 3. Only show green supported if NO design caution and NO evidence uncertainty
  const isFullySupported = !hasDesignCaution && !hasEvidenceUncertainty && audit.status === 'Supported';
  if (isFullySupported) {
    badges.push({
      label: 'Phù hợp quy tắc tham chiếu',
      variant: 'supported',
    });
  }

  // Compose summary message
  let summaryText = '';
  const cautionSnippet = audit.cautions_and_redlines?.[0] || 'Cần lưu ý một số điểm biến tấu.';
  const uncertaintySnippet =
    audit.uncertainty_note ||
    audit.verification_summary ||
    'Chi tiết này chưa có trong dữ liệu tham chiếu của bản thử nghiệm.';

  if (hasDesignCaution && hasEvidenceUncertainty) {
    summaryText = `[Lưu ý] ${cautionSnippet} · [Dữ liệu] ${uncertaintySnippet}`;
  } else if (hasDesignCaution) {
    summaryText = cautionSnippet;
  } else if (hasEvidenceUncertainty) {
    summaryText = uncertaintySnippet;
  } else {
    summaryText = audit.auditor_verdict || 'Tuân thủ các quy tắc cốt lõi của bản thử nghiệm.';
  }

  return {
    badges,
    summaryText,
    hasDesignCaution,
    hasEvidenceUncertainty,
    hasCaution: hasDesignCaution,
    hasUncertainty: hasEvidenceUncertainty,
    isFullySupported,
    prototypeComplianceLabel,
    historicalConfidenceLabel,
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
