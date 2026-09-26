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

export interface WhatIfSummaryResult {
  prototypeLabel: string;
  historicalLabel: string;
  uncertaintyTitle: string;
  uncertaintyText: string;
  hasDesignCaution: boolean;
  hasEvidenceUncertainty: boolean;
  isPrototypeConflict: boolean;
  showInsufficientEvidence: boolean;
  systemWarnings: string[];
}

/**
 * Evaluates semantic summary status for a What-If evaluation.
 * Requirement 7 & 8:
 * - Returns precise uncertainty titles and explanations based on actual evidence status.
 * - Does not call all uncertainty "Chi tiết nằm ngoài CKB".
 */
export function getWhatIfSummaryStatus(evaluation?: WhatIfEvaluation | null): WhatIfSummaryResult {
  if (!evaluation) {
    return {
      prototypeLabel: 'Chưa đối soát quy tắc prototype',
      historicalLabel: 'Chưa đủ dữ liệu tham chiếu',
      uncertaintyTitle: 'Chưa đủ dữ liệu tham chiếu',
      uncertaintyText: 'Chi tiết này hiện nằm ngoài phạm vi các quy tắc đã được số hóa trong bản thử nghiệm.',
      hasDesignCaution: false,
      hasEvidenceUncertainty: true,
      isPrototypeConflict: false,
      showInsufficientEvidence: true,
      systemWarnings: [],
    };
  }

  const isPrototypeConflict = Boolean(
    evaluation.prototype_compliance === 'conflict' ||
    evaluation.violates_invariants ||
    (evaluation.violated_evidence_ids && evaluation.violated_evidence_ids.length > 0)
  );

  const hasDesignCaution = Boolean(
    isPrototypeConflict ||
    evaluation.has_design_caution ||
    (evaluation.cautions_and_redlines && evaluation.cautions_and_redlines.length > 0)
  );

  const showInsufficientEvidence = Boolean(
    evaluation.status === 'Insufficient Evidence' ||
    evaluation.prototype_compliance === 'unassessed' ||
    ((!evaluation.applicable_evidence_ids || evaluation.applicable_evidence_ids.length === 0) &&
      (!evaluation.violated_evidence_ids || evaluation.violated_evidence_ids.length === 0))
  );

  const hasEvidenceUncertainty = Boolean(
    evaluation.uncertainty_flag ||
    evaluation.has_evidence_uncertainty ||
    showInsufficientEvidence ||
    evaluation.historical_confidence === 'unverified' ||
    evaluation.historical_confidence === 'needs_review' ||
    evaluation.historical_confidence === 'partially_verified' ||
    evaluation.historical_confidence === 'mixed'
  );

  const prototypeLabel = isPrototypeConflict
    ? 'Có xung đột với quy tắc prototype'
    : showInsufficientEvidence
    ? 'Chưa đối soát quy tắc prototype'
    : 'Phù hợp với quy tắc prototype';

  const historicalLabel =
    showInsufficientEvidence
      ? 'Chưa đủ dữ liệu tham chiếu'
      : evaluation.historical_confidence === 'verified'
      ? 'Đã đối chiếu nguồn thư tịch'
      : evaluation.historical_confidence === 'needs_review'
      ? 'Nguồn lịch sử cần rà soát thêm'
      : evaluation.historical_confidence === 'partially_verified'
      ? 'Nguồn đối chiếu một phần'
      : evaluation.historical_confidence === 'mixed'
      ? 'Độ xác minh nguồn không đồng nhất'
      : 'Nguồn lịch sử chưa xác minh độc lập';

  // Semantic Uncertainty Title & Text (Requirement 7)
  let uncertaintyTitle = 'Minh bạch về độ tin cậy của nguồn tham chiếu';
  let uncertaintyText = 'Các quy tắc tham chiếu trong bản thử nghiệm hiện chưa được đối chiếu thư tịch độc lập.';

  if (showInsufficientEvidence) {
    uncertaintyTitle = 'Chưa đủ dữ liệu tham chiếu';
    uncertaintyText = 'Chi tiết này hiện nằm ngoài phạm vi các quy tắc đã được số hóa trong bản thử nghiệm.';
  } else if (evaluation.historical_confidence === 'unverified') {
    uncertaintyTitle = 'Nguồn lịch sử chưa xác minh độc lập';
    uncertaintyText = 'Quy tắc liên quan có trong CKB của prototype, nhưng nguồn lịch sử hiện chưa được đối chiếu độc lập.';
  } else if (evaluation.historical_confidence === 'needs_review') {
    uncertaintyTitle = 'Nguồn tham chiếu đang chờ đối soát';
    uncertaintyText = 'Hệ thống đã có đầu mối nguồn cho quy tắc này, nhưng dự án chưa đối chiếu trực tiếp tài liệu gốc hoặc bản số hóa.';
  } else if (evaluation.historical_confidence === 'partially_verified') {
    uncertaintyTitle = 'Nguồn tham chiếu mới được đối chiếu một phần';
    uncertaintyText = 'Một số quy tắc liên quan đã có nguồn đối chiếu, trong khi các quy tắc còn lại vẫn đang chờ xác minh thêm.';
  } else if (evaluation.historical_confidence === 'mixed') {
    uncertaintyTitle = 'Độ xác minh nguồn không đồng nhất';
    uncertaintyText = 'Các quy tắc liên quan có mức độ xác minh tư liệu khác nhau trong bản thử nghiệm.';
  }

  return {
    prototypeLabel,
    historicalLabel,
    uncertaintyTitle,
    uncertaintyText,
    hasDesignCaution,
    hasEvidenceUncertainty,
    isPrototypeConflict,
    showInsufficientEvidence,
    systemWarnings: evaluation.system_warnings || [],
  };
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

  // True prototype conflict: rule conflict or failed invariant
  const isPrototypeConflict = Boolean(
    audit.prototype_compliance === 'conflict' ||
    (audit.invariants_checked && audit.invariants_checked.some((inv) => !inv.passed))
  );

  // Design caution: prototype conflict, failed invariants, or genuine design cautions
  const hasDesignCaution = Boolean(
    isPrototypeConflict ||
    audit.has_design_caution ||
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
    isPrototypeConflict
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
