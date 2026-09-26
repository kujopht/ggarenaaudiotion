import {
  CKB_REGISTRY,
  getCKBEntry,
  isRuleApplicableToGarment,
  deriveAuditConfidence,
} from '../data/ckbRegistry.js';
import {
  CulturalAuditResult,
  GarmentKey,
  OutfitProposal,
  WhatIfEvaluation,
  PrototypeCompliance,
  HistoricalConfidence,
  CulturalAuditStatus,
  CKBEntry,
  InvariantCheckResult,
  MutableUsage,
} from '../types/vietphuc.js';

/**
 * Validate an evidence ID against CKB_REGISTRY and garment scope.
 * Requirement 6:
 * - Reject unknown evidence IDs
 * - Demote rules not applicable to current garment (e.g. KB-NGUTHAN-01 on Nhật Bình)
 */
export function validateEvidenceId(
  id: string,
  garmentKey: GarmentKey
): {
  valid: boolean;
  entry?: CKBEntry;
  isUnknown: boolean;
  isInapplicable: boolean;
  warning?: string;
} {
  const trimmed = typeof id === 'string' ? id.trim() : '';
  const entry = getCKBEntry(trimmed);

  if (!entry) {
    return {
      valid: false,
      isUnknown: true,
      isInapplicable: false,
      warning: `[Lưu ý hệ thống] Mã bằng chứng "${trimmed}" không tồn tại trong CKB.`,
    };
  }

  if (!isRuleApplicableToGarment(entry, garmentKey)) {
    return {
      valid: false,
      entry,
      isUnknown: false,
      isInapplicable: true,
      warning: `[Lưu ý phạm vi] Quy tắc ${entry.id} (${entry.title}) không áp dụng cho trang phục "${garmentKey}".`,
    };
  }

  return {
    valid: true,
    entry,
    isUnknown: false,
    isInapplicable: false,
  };
}

/**
 * Normalizes a proposal audit returned by Gemini or any external model.
 * Guarantees:
 * 1. Final historical confidence is strictly derived from CKB_REGISTRY, never blindly trusted from model.
 * 2. Unverified or needs_review evidence forces uncertainty_flag = true and prevents fully Supported status.
 * 3. Invariants violations force prototype_compliance = 'conflict'.
 * 4. Invalid or out-of-scope evidence IDs are demoted with transparent warnings.
 * 5. Explicitly separates has_design_caution from has_evidence_uncertainty.
 */
export function normalizeGeminiProposalAudit(
  rawAudit: any,
  garmentKey: GarmentKey
): CulturalAuditResult {
  if (!rawAudit || typeof rawAudit !== 'object') {
    const fallbackConf = deriveAuditConfidence([], false);
    return {
      status: 'Insufficient Evidence',
      uncertainty_flag: true,
      uncertainty_note: 'Bộ quy tắc hiện tại chưa có đủ dữ liệu để kết luận sâu hơn.',
      evidence_ids: [],
      invariants_checked: [],
      mutables_used: [],
      cautions_and_redlines: ['[Lưu ý hệ thống] Không nhận được phản hồi thẩm định từ mô hình.'],
      auditor_verdict: 'Không có dữ liệu thẩm định khả dụng.',
      prototype_compliance: 'unassessed',
      historical_confidence: 'unverified',
      verification_summary: fallbackConf.verification_summary,
      has_design_caution: false,
      has_evidence_uncertainty: true,
    };
  }

  // 1. Evidence ID parsing & validation (Requirement 6)
  const rawEvidenceIds: string[] = Array.isArray(rawAudit.evidence_ids)
    ? rawAudit.evidence_ids.map(String)
    : [];

  const validEvidenceIds: string[] = [];
  const systemWarnings: string[] = [];
  let hasUnknown = false;
  let hasInapplicable = false;

  for (const id of rawEvidenceIds) {
    const res = validateEvidenceId(id, garmentKey);
    if (res.valid) {
      validEvidenceIds.push(res.entry!.id);
    } else {
      if (res.isUnknown) hasUnknown = true;
      if (res.isInapplicable) hasInapplicable = true;
      if (res.warning) systemWarnings.push(res.warning);
    }
  }

  // 2. Invariants & Mutables parsing
  const invariantsChecked: InvariantCheckResult[] = Array.isArray(rawAudit.invariants_checked)
    ? rawAudit.invariants_checked.map((inv: any) => {
        const id = String(inv?.evidence_id || '');
        const entry = getCKBEntry(id);
        return {
          evidence_id: id,
          rule_name: inv?.rule_name || entry?.title || id,
          passed: Boolean(inv?.passed),
          detail: String(inv?.detail || ''),
        };
      })
    : [];

  const mutablesUsed: MutableUsage[] = Array.isArray(rawAudit.mutables_used)
    ? rawAudit.mutables_used.map((mut: any) => ({
        evidence_id: String(mut?.evidence_id || ''),
        element: String(mut?.element || ''),
        application: String(mut?.application || ''),
      }))
    : [];

  // 3. Derive prototype compliance (Requirement 7)
  const hasFailedInvariant = invariantsChecked.some((inv: InvariantCheckResult) => !inv.passed);
  const rawCautions: string[] = Array.isArray(rawAudit.cautions_and_redlines)
    ? rawAudit.cautions_and_redlines.map(String)
    : [];

  let prototype_compliance: PrototypeCompliance;
  if (hasFailedInvariant || rawAudit.prototype_compliance === 'conflict') {
    prototype_compliance = 'conflict';
  } else if (validEvidenceIds.length === 0) {
    prototype_compliance = 'unassessed';
  } else {
    prototype_compliance = 'compliant';
  }

  // 4. Derive historical confidence from CKB_REGISTRY (Requirement 1)
  const isConflict = prototype_compliance === 'conflict';
  const derivedConfidence = deriveAuditConfidence(validEvidenceIds, isConflict);

  let historical_confidence: HistoricalConfidence = derivedConfidence.historical_confidence;
  let hasUnverified = derivedConfidence.hasUnverified;

  // Unknown or out-of-scope evidence prevents fully verified historical confidence
  if (hasUnknown || hasInapplicable) {
    hasUnverified = true;
    if (historical_confidence === 'verified') {
      historical_confidence = 'partially_verified';
    }
  }

  // 5. Enforce Status & Uncertainty Flag (Requirement 2)
  let status: CulturalAuditStatus;
  let uncertainty_flag = false;

  if (prototype_compliance === 'unassessed' || validEvidenceIds.length === 0) {
    status = 'Insufficient Evidence';
    uncertainty_flag = true;
  } else if (hasUnverified) {
    status = 'Supported with Caution';
    uncertainty_flag = true;
  } else if (isConflict) {
    status = 'Supported with Caution';
    uncertainty_flag = false;
  } else {
    status = 'Supported';
    uncertainty_flag = false;
  }

  const combinedCautions = [...rawCautions, ...systemWarnings];

  // 6. Explicitly separate design caution from evidence uncertainty (Requirement 3 & 4)
  const has_design_caution =
    prototype_compliance === 'conflict' ||
    hasFailedInvariant ||
    rawCautions.length > 0;

  const has_evidence_uncertainty = uncertainty_flag;

  let uncertainty_note = rawAudit.uncertainty_note;
  if (uncertainty_flag && (!uncertainty_note || uncertainty_note.trim() === '')) {
    uncertainty_note =
      prototype_compliance === 'unassessed' || validEvidenceIds.length === 0
        ? 'Bộ quy tắc hiện tại trong bản thử nghiệm chưa đủ dữ liệu tham chiếu để kết luận sâu hơn.'
        : 'Bản thiết kế phù hợp với quy ước của prototype, tuy nhiên các quy tắc tham chiếu trong bản thử nghiệm hiện chưa được đối chiếu thư tịch độc lập.';
  }

  return {
    status,
    uncertainty_flag,
    uncertainty_note,
    evidence_ids: validEvidenceIds,
    invariants_checked: invariantsChecked,
    mutables_used: mutablesUsed,
    cautions_and_redlines: combinedCautions,
    auditor_verdict: String(
      rawAudit.auditor_verdict || 'Đối soát theo quy thức CKB trong bản thử nghiệm.'
    ),
    prototype_compliance,
    historical_confidence,
    verification_summary: derivedConfidence.verification_summary,
    has_design_caution,
    has_evidence_uncertainty,
  };
}

/**
 * Normalizes an entire proposal from Gemini, ensuring audit is normalized.
 */
export function normalizeGeminiProposal(
  rawProposal: any,
  fallbackGarment: GarmentKey
): OutfitProposal {
  const garment_type: GarmentKey =
    rawProposal.garment_type === 'ngu_than' ||
    rawProposal.garment_type === 'ao_tac' ||
    rawProposal.garment_type === 'nhat_binh'
      ? rawProposal.garment_type
      : fallbackGarment;

  const audit = normalizeGeminiProposalAudit(rawProposal.audit, garment_type);

  return {
    id: String(rawProposal.id || `prop-${Date.now()}`),
    plan_type:
      rawProposal.plan_type === 'heritage_anchored' ? 'heritage_anchored' : 'contemporary_remix',
    title: String(rawProposal.title || 'Bản phối Việt Phục Đương Đại'),
    concept_tag: String(rawProposal.concept_tag || 'Concept Đương Đại'),
    garment_type,
    dial_level: typeof rawProposal.dial_level === 'number' ? rawProposal.dial_level : 3,
    visual_details: rawProposal.visual_details || {
      collar_style: '',
      lapel_side: '',
      sleeve_style: '',
      cut_length: '',
      fabric_materials: [],
      layering_pieces: [],
      bottom_garment: '',
      footwear: '',
      accessories: [],
      color_palette: [],
    },
    audit,
    stylist_notes: rawProposal.stylist_notes || {
      philosophy: '',
      gen_z_tips: [],
      occasions: [],
    },
  };
}

/**
 * Normalizes a What-If evaluation returned by Gemini.
 * Enforces:
 * 1. Prototype compliance is forced to 'conflict' if violates_invariants is true or violated_evidence_ids has entries.
 * 2. Historical confidence is strictly derived from CKB_REGISTRY.
 * 3. Status is Insufficient Evidence if no valid evidence applies.
 * 4. Demotes certainty on unknown or inapplicable evidence IDs.
 */
export function normalizeGeminiWhatIfEvaluation(
  rawEvaluation: any,
  effectiveGarment: string
): WhatIfEvaluation {
  const garmentKey = (
    effectiveGarment === 'ngu_than' ||
    effectiveGarment === 'ao_tac' ||
    effectiveGarment === 'nhat_binh'
      ? effectiveGarment
      : 'ngu_than'
  ) as GarmentKey;

  const rawViolated = Array.isArray(rawEvaluation?.violated_evidence_ids)
    ? rawEvaluation.violated_evidence_ids.map(String)
    : [];
  const rawApplicable = Array.isArray(rawEvaluation?.applicable_evidence_ids)
    ? rawEvaluation.applicable_evidence_ids.map(String)
    : [];

  const validViolatedIds: string[] = [];
  const validApplicableIds: string[] = [];
  const systemWarnings: string[] = [];

  let hasUnknown = false;
  let hasInapplicable = false;

  for (const id of rawViolated) {
    const res = validateEvidenceId(id, garmentKey);
    if (res.valid) {
      validViolatedIds.push(res.entry!.id);
    } else {
      if (res.isUnknown) hasUnknown = true;
      if (res.isInapplicable) hasInapplicable = true;
      if (res.warning) systemWarnings.push(res.warning);
    }
  }

  for (const id of rawApplicable) {
    const res = validateEvidenceId(id, garmentKey);
    if (res.valid) {
      validApplicableIds.push(res.entry!.id);
    } else {
      if (res.isUnknown) hasUnknown = true;
      if (res.isInapplicable) hasInapplicable = true;
      if (res.warning) systemWarnings.push(res.warning);
    }
  }

  // 1. Prototype compliance (Requirement 7)
  let violates_invariants = Boolean(rawEvaluation?.violates_invariants) || validViolatedIds.length > 0;
  let prototype_compliance: PrototypeCompliance;

  if (violates_invariants) {
    prototype_compliance = 'conflict';
    violates_invariants = true;
  } else if (validApplicableIds.length === 0) {
    prototype_compliance = 'unassessed';
    violates_invariants = false;
  } else {
    prototype_compliance = 'compliant';
    violates_invariants = false;
  }

  // 2. Historical confidence derived from CKB_REGISTRY (Requirement 1)
  const allValidEvidence = Array.from(new Set([...validViolatedIds, ...validApplicableIds]));
  const isConflict = prototype_compliance === 'conflict';
  const derivedConf = deriveAuditConfidence(allValidEvidence, isConflict);

  let historical_confidence: HistoricalConfidence = derivedConf.historical_confidence;
  let hasUnverified = derivedConf.hasUnverified;

  if (hasUnknown || hasInapplicable) {
    hasUnverified = true;
    if (historical_confidence === 'verified') {
      historical_confidence = 'partially_verified';
    }
  }

  // 3. Status & Uncertainty enforcement (Requirement 2)
  let status: CulturalAuditStatus;
  let uncertainty_flag = false;

  if (prototype_compliance === 'unassessed' || allValidEvidence.length === 0) {
    status = 'Insufficient Evidence';
    uncertainty_flag = true;
  } else if (hasUnverified) {
    status = 'Supported with Caution';
    uncertainty_flag = true;
  } else if (isConflict) {
    status = 'Supported with Caution';
    uncertainty_flag = false;
  } else {
    status = 'Supported';
    uncertainty_flag = false;
  }

  const rawCautions = Array.isArray(rawEvaluation?.cautions_and_redlines)
    ? rawEvaluation.cautions_and_redlines.map(String)
    : [];

  const combinedCautions = [...rawCautions, ...systemWarnings];

  return {
    query: String(rawEvaluation?.query || ''),
    target_garment: garmentKey,
    proposed_change: String(rawEvaluation?.proposed_change || ''),
    status,
    uncertainty_flag,
    impact_analysis: String(rawEvaluation?.impact_analysis || ''),
    violates_invariants,
    violated_evidence_ids: validViolatedIds,
    applicable_evidence_ids: validApplicableIds,
    cautions_and_redlines: combinedCautions,
    stylist_counter_proposal: rawEvaluation?.stylist_counter_proposal || {
      title: 'Đề xuất thay thế từ stylist',
      solution: 'Tham khảo quy thức trong Cultural Knowledge Base.',
      heritage_safeguard: 'Bảo lưu cấu trúc cốt lõi của y phục.',
      contemporary_edge: 'Ứng dụng chất liệu đương đại phù hợp.',
      materials_and_cuts: 'Lựa chọn hài hòa tổng thể.',
    },
    prototype_compliance,
    historical_confidence,
    verification_summary: derivedConf.verification_summary,
    has_design_caution: violates_invariants || rawCautions.length > 0,
    has_evidence_uncertainty: uncertainty_flag,
  };
}
