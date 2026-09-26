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
import { generateDeterministicProposals } from './deterministicEngines.js';

/**
 * Common regex patterns for overconfident or inflated historical certainty claims.
 * Used to guard against Gemini or external models asserting 100% historical accuracy
 * when underlying CKB rules are unverified or needs_review.
 */
export const OVERCONFIDENT_PHRASES = [
  /chính\s+xác\s+lịch\s+sử\s+100%/gi,
  /100%\s+chính\s+xác\s+lịch\s+sử/gi,
  /100%\s+chuẩn\s+lịch\s+sử/gi,
  /chuẩn\s+lịch\s+sử\s+100%/gi,
  /chuẩn\s+xác\s+100%/gi,
  /100%\s+chuẩn\s+xác/gi,
  /xác\s+thực\s+100%/gi,
  /100%\s+xác\s+thực/gi,
  /chính\s+xác\s+tuyệt\s+đối/gi,
  /tuyệt\s+đối\s+chính\s+xác/gi,
  /hoàn\s+toàn\s+chính\s+xác/gi,
  /hoàn\s+toàn\s+chuẩn\s+xác/gi,
  /đã\s+xác\s+thực\s+văn\s+hóa/gi,
  /được\s+chứng\s+nhận/gi,
  /chắc\s+chắn\s+đúng\s+lịch\s+sử/gi,
  /đã\s+được\s+kiểm\s+chứng\s+hoàn\s+toàn/gi,
  /xác\s+minh\s+hoàn\s+toàn/gi,
  /chứng\s+thực\s+tuyệt\s+đối/gi,
  /được\s+chứng\s+minh\s+lịch\s+sử/gi,
  /tuyệt\s+đối\s+chuẩn\s+xác/gi,
];

/**
 * Checks whether a given prose text contains overconfident historical certainty claims.
 */
export function hasOverconfidentClaim(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  return OVERCONFIDENT_PHRASES.some((regex) => {
    regex.lastIndex = 0;
    return regex.test(text);
  });
}

/**
 * Normalizes and guards auditor verdict prose.
 * If historical confidence is not 'verified' and text asserts absolute historical certainty,
 * replaces it with honest, neutral CKB-grounded phrasing.
 */
export function sanitizeAuditorVerdict(
  rawVerdict: string,
  historicalConfidence: HistoricalConfidence,
  prototypeCompliance: PrototypeCompliance
): string {
  let text = typeof rawVerdict === 'string' && rawVerdict.trim()
    ? rawVerdict.trim()
    : 'Đối soát theo quy thức CKB trong bản thử nghiệm.';

  // If historical confidence is verified, keep original verdict
  if (historicalConfidence === 'verified') {
    return text;
  }

  // If text contains overconfident claims when evidence is not verified
  if (hasOverconfidentClaim(text)) {
    if (prototypeCompliance === 'conflict') {
      return 'Thay đổi này xung đột với quy tắc prototype hiện tại. Mức độ xác minh lịch sử phụ thuộc vào trạng thái nguồn của evidence liên quan.';
    }
    if (prototypeCompliance === 'unassessed') {
      return 'Chưa đủ dữ liệu tham chiếu trong bản thử nghiệm để đánh giá độ chuẩn xác lịch sử.';
    }
    if (historicalConfidence === 'needs_review') {
      return 'Thiết kế phù hợp với các quy tắc prototype hiện tại. Nguồn lịch sử của các quy tắc liên quan đang trong diện cần rà soát thêm thư tịch.';
    }
    if (historicalConfidence === 'partially_verified') {
      return 'Thiết kế phù hợp với các quy tắc prototype hiện tại. Nguồn lịch sử của các quy tắc liên quan mới được đối chiếu một phần.';
    }
    return 'Thiết kế phù hợp với các quy tắc prototype hiện tại. Nguồn lịch sử của các quy tắc liên quan chưa được xác minh độc lập.';
  }

  return text;
}

/**
 * Normalizes and guards What-If impact analysis prose.
 * Removes absolute certainty wording and appends CKB verification status disclaimer.
 */
export function sanitizeWhatIfImpactAnalysis(
  rawAnalysis: string,
  historicalConfidence: HistoricalConfidence,
  prototypeCompliance: PrototypeCompliance
): string {
  let text = typeof rawAnalysis === 'string' && rawAnalysis.trim()
    ? rawAnalysis.trim()
    : 'Chưa có phân tích tác động cụ thể.';

  if (historicalConfidence === 'verified') {
    return text;
  }

  // Replace any absolute certainty phrases with neutral phrasing
  for (const regex of OVERCONFIDENT_PHRASES) {
    regex.lastIndex = 0;
    text = text.replace(regex, 'phù hợp với quy tắc tham chiếu');
  }

  // Ensure cultural conclusion has appropriate verification disclaimer
  const hasDisclaimer =
    text.includes('chưa được xác minh độc lập') ||
    text.includes('cần rà soát thêm') ||
    text.includes('đối chiếu một phần') ||
    text.includes('chưa đủ dữ liệu');

  if (!hasDisclaimer) {
    if (historicalConfidence === 'unverified') {
      text += ' (Lưu ý: Nguồn lịch sử của các quy tắc liên quan trong bản thử nghiệm chưa được xác minh độc lập).';
    } else if (historicalConfidence === 'needs_review') {
      text += ' (Lưu ý: Nguồn lịch sử của các quy tắc liên quan trong bản thử nghiệm cần được rà soát thêm).';
    } else if (historicalConfidence === 'partially_verified') {
      text += ' (Lưu ý: Nguồn lịch sử của các quy tắc liên quan mới được đối chiếu một phần).';
    }
  }

  return text;
}

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
 * Contract validation for an individual proposal from Gemini.
 * Requirement 1, 11 & 12:
 * Proposal is strictly invalid if:
 * - garment_type != expectedGarment (Authoritative garment enforcement)
 * - missing or invalid audit object
 * - missing or invalid visual_details (must have required strings and arrays)
 * - missing or invalid stylist_notes
 * - invalid plan_type
 */
export interface ProposalContractValidation {
  valid: boolean;
  error?: string;
}

export function validateGeminiProposalContract(
  rawProposal: any,
  expectedGarment: GarmentKey
): ProposalContractValidation {
  if (!rawProposal || typeof rawProposal !== 'object') {
    return { valid: false, error: 'Proposal không phải là đối tượng hợp lệ' };
  }

  // 1. Authoritative Garment check
  if (rawProposal.garment_type !== expectedGarment) {
    return {
      valid: false,
      error: `Sai loại áo: Yêu cầu "${expectedGarment}" nhưng mô hình trả về "${rawProposal.garment_type}"`,
    };
  }

  // 2. Plan type
  if (
    rawProposal.plan_type !== 'heritage_anchored' &&
    rawProposal.plan_type !== 'contemporary_remix'
  ) {
    return { valid: false, error: `plan_type không hợp lệ: "${rawProposal.plan_type}"` };
  }

  // 3. Visual details check (Requirement 12)
  const vd = rawProposal.visual_details;
  if (!vd || typeof vd !== 'object') {
    return { valid: false, error: 'Thiếu visual_details' };
  }

  const requiredStrings = [
    'collar_style',
    'lapel_side',
    'sleeve_style',
    'cut_length',
    'bottom_garment',
    'footwear',
  ];
  for (const field of requiredStrings) {
    if (typeof vd[field] !== 'string' || vd[field].trim() === '') {
      return { valid: false, error: `visual_details thiếu trường chuỗi hợp lệ: ${field}` };
    }
  }

  if (!Array.isArray(vd.fabric_materials) || vd.fabric_materials.length === 0) {
    return { valid: false, error: 'visual_details.fabric_materials phải là mảng không rỗng' };
  }

  if (!Array.isArray(vd.color_palette) || vd.color_palette.length === 0) {
    return { valid: false, error: 'visual_details.color_palette phải là mảng không rỗng' };
  }

  if (vd.layering_pieces !== undefined && !Array.isArray(vd.layering_pieces)) {
    return { valid: false, error: 'visual_details.layering_pieces phải là mảng nếu được cung cấp' };
  }

  if (vd.accessories !== undefined && !Array.isArray(vd.accessories)) {
    return { valid: false, error: 'visual_details.accessories phải là mảng nếu được cung cấp' };
  }

  // 4. Audit object check (Requirement 11)
  const audit = rawProposal.audit;
  if (!audit || typeof audit !== 'object') {
    return { valid: false, error: 'Thiếu audit object' };
  }

  // 5. Stylist notes check
  const sn = rawProposal.stylist_notes;
  if (
    !sn ||
    typeof sn !== 'object' ||
    typeof sn.philosophy !== 'string' ||
    sn.philosophy.trim() === ''
  ) {
    return { valid: false, error: 'Thiếu hoặc sai định dạng stylist_notes' };
  }

  return { valid: true };
}

/**
 * Normalizes a proposal audit returned by Gemini or any external model.
 * Guarantees:
 * 1. Historical confidence & status are derived from the CANONICAL UNION of all valid evidence:
 *    valid evidence_ids + valid invariants_checked + valid mutables_used. (Requirement 5)
 * 2. audit.evidence_ids is canonicalized to contain all valid evidence actually used. (Requirement 6)
 * 3. Unverified or needs_review evidence forces uncertainty_flag = true and prevents fully Supported status.
 * 4. Invariants violations force prototype_compliance = 'conflict'. Invariants outside garment scope are moved to system_warnings.
 * 5. Invalid or out-of-scope mutables are moved to system_warnings and excluded from mutables_used.
 * 6. Technical warnings are segregated into system_warnings, keeping cautions_and_redlines clean.
 * 7. Explicitly separates has_design_caution from has_evidence_uncertainty.
 * 8. Enforces prose certainty sanitation on auditor_verdict and uncertainty_note.
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
      cautions_and_redlines: [],
      system_warnings: ['[Lưu ý hệ thống] Không nhận được phản hồi thẩm định từ mô hình.'],
      auditor_verdict: 'Không có dữ liệu thẩm định khả dụng.',
      prototype_compliance: 'unassessed',
      historical_confidence: 'unverified',
      verification_summary: fallbackConf.verification_summary,
      has_design_caution: false,
      has_evidence_uncertainty: true,
    };
  }

  const systemWarnings: string[] = [];

  // 1. Evidence ID parsing & validation (Requirement 6)
  const rawEvidenceIds: string[] = Array.isArray(rawAudit.evidence_ids)
    ? rawAudit.evidence_ids.map(String)
    : [];

  const validEvidenceIdsList: string[] = [];
  let hasUnknown = false;
  let hasInapplicable = false;

  for (const id of rawEvidenceIds) {
    const res = validateEvidenceId(id, garmentKey);
    if (res.valid) {
      validEvidenceIdsList.push(res.entry!.id);
    } else {
      if (res.isUnknown) hasUnknown = true;
      if (res.isInapplicable) hasInapplicable = true;
      if (res.warning) systemWarnings.push(res.warning);
    }
  }

  // 2. Invariants parsing & validation (Requirement 3 & 5)
  const rawInvariants: any[] = Array.isArray(rawAudit.invariants_checked)
    ? rawAudit.invariants_checked
    : [];

  const validInvariantsChecked: InvariantCheckResult[] = [];
  for (const inv of rawInvariants) {
    const id = String(inv?.evidence_id || '').trim();
    const validation = validateEvidenceId(id, garmentKey);
    if (!validation.valid) {
      if (validation.warning) {
        systemWarnings.push(validation.warning);
      } else {
        systemWarnings.push(
          `[Lưu ý hệ thống] Quy tắc bất biến "${id}" không hợp lệ hoặc không áp dụng cho "${garmentKey}".`
        );
      }
      if (validation.isUnknown) hasUnknown = true;
      if (validation.isInapplicable) hasInapplicable = true;
      continue;
    }

    const entry = validation.entry!;
    validInvariantsChecked.push({
      evidence_id: entry.id,
      rule_name: inv?.rule_name || entry.title || entry.id,
      passed: Boolean(inv?.passed),
      detail: String(inv?.detail || ''),
    });
  }

  // 3. Mutables parsing & validation (Requirement 4 & 5)
  const rawMutables: any[] = Array.isArray(rawAudit.mutables_used)
    ? rawAudit.mutables_used
    : [];

  const validMutablesUsed: MutableUsage[] = [];
  for (const mut of rawMutables) {
    const id = String(mut?.evidence_id || '').trim();
    const validation = validateEvidenceId(id, garmentKey);
    if (!validation.valid) {
      if (validation.warning) {
        systemWarnings.push(validation.warning);
      } else {
        systemWarnings.push(
          `[Lưu ý hệ thống] Vùng khả biến "${id}" không hợp lệ hoặc không áp dụng cho "${garmentKey}".`
        );
      }
      if (validation.isUnknown) hasUnknown = true;
      if (validation.isInapplicable) hasInapplicable = true;
      continue;
    }

    validMutablesUsed.push({
      evidence_id: validation.entry!.id,
      element: String(mut?.element || ''),
      application: String(mut?.application || ''),
    });
  }

  // 4. Form Canonical Evidence Union (Requirement 5 & 6)
  // Include valid evidence_ids, invariants_checked evidence, and mutables_used evidence
  const allValidEvidenceIds = Array.from(
    new Set([
      ...validEvidenceIdsList,
      ...validInvariantsChecked.map((inv) => inv.evidence_id),
      ...validMutablesUsed.map((mut) => mut.evidence_id),
    ])
  );

  // 5. Derive prototype compliance (Requirement 3 & 7)
  const hasFailedInvariant = validInvariantsChecked.some((inv: InvariantCheckResult) => !inv.passed);
  const rawCautions: string[] = Array.isArray(rawAudit.cautions_and_redlines)
    ? rawAudit.cautions_and_redlines.map(String).filter((s: string) => s.trim().length > 0)
    : [];

  let prototype_compliance: PrototypeCompliance;
  if (hasFailedInvariant) {
    prototype_compliance = 'conflict';
  } else if (rawInvariants.length === 0 && rawAudit.prototype_compliance === 'conflict') {
    prototype_compliance = 'conflict';
  } else if (allValidEvidenceIds.length === 0) {
    prototype_compliance = 'unassessed';
  } else {
    prototype_compliance = 'compliant';
  }

  // 6. Derive historical confidence from Canonical Evidence Union (Requirement 1 & 5)
  const isConflict = prototype_compliance === 'conflict';
  const derivedConfidence = deriveAuditConfidence(allValidEvidenceIds, isConflict);

  let historical_confidence: HistoricalConfidence = derivedConfidence.historical_confidence;
  let hasUnverified = derivedConfidence.hasUnverified;

  if (hasUnknown || hasInapplicable) {
    hasUnverified = true;
    if (historical_confidence === 'verified') {
      historical_confidence = 'partially_verified';
    }
  }

  // 7. Enforce Status & Uncertainty Flag (Requirement 2 & 5)
  let status: CulturalAuditStatus;
  let uncertainty_flag = false;

  if (prototype_compliance === 'unassessed' || allValidEvidenceIds.length === 0) {
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

  // 8. Explicitly separate design caution from evidence uncertainty
  const has_design_caution =
    prototype_compliance === 'conflict' ||
    hasFailedInvariant ||
    rawCautions.length > 0;

  const has_evidence_uncertainty = uncertainty_flag;

  // 9. Prose Certainty Hardening
  const auditor_verdict = sanitizeAuditorVerdict(
    String(rawAudit.auditor_verdict || ''),
    historical_confidence,
    prototype_compliance
  );

  let uncertainty_note = rawAudit.uncertainty_note;
  if (
    uncertainty_flag &&
    (!uncertainty_note || uncertainty_note.trim() === '' || hasOverconfidentClaim(uncertainty_note))
  ) {
    uncertainty_note =
      prototype_compliance === 'unassessed' || allValidEvidenceIds.length === 0
        ? 'Bộ quy tắc hiện tại trong bản thử nghiệm chưa đủ dữ liệu tham chiếu để kết luận sâu hơn.'
        : historical_confidence === 'needs_review'
        ? 'Bản thiết kế phù hợp với quy ước của prototype, tuy nhiên các quy tắc tham chiếu hiện đang trong diện cần rà soát thêm thư tịch.'
        : 'Bản thiết kế phù hợp với quy ước của prototype, tuy nhiên các quy tắc tham chiếu trong bản thử nghiệm hiện chưa được đối chiếu thư tịch độc lập.';
  }

  return {
    status,
    uncertainty_flag,
    uncertainty_note,
    evidence_ids: allValidEvidenceIds, // Canonicalized evidence union (Requirement 6)
    invariants_checked: validInvariantsChecked,
    mutables_used: validMutablesUsed,
    cautions_and_redlines: rawCautions,
    system_warnings: systemWarnings,
    auditor_verdict,
    prototype_compliance,
    historical_confidence,
    verification_summary: derivedConfidence.verification_summary,
    has_design_caution,
    has_evidence_uncertainty,
  };
}

/**
 * Normalizes an entire proposal from Gemini.
 * Requirement 1 & 4:
 * - GarmentKey is authoritative.
 * - Uses deterministic proposal IDs (e.g. gemini-proposal-1, gemini-proposal-2) instead of Date.now().
 */
export function normalizeGeminiProposal(
  rawProposal: any,
  authoritativeGarment: GarmentKey,
  proposalIndex: number = 0
): OutfitProposal {
  const fallbackId = `gemini-proposal-${proposalIndex + 1}`;
  const id = typeof rawProposal?.id === 'string' && rawProposal.id.trim()
    ? rawProposal.id.trim()
    : fallbackId;

  const garment_type: GarmentKey = authoritativeGarment;
  const audit = normalizeGeminiProposalAudit(rawProposal?.audit, garment_type);

  return {
    id,
    plan_type:
      rawProposal?.plan_type === 'heritage_anchored' ? 'heritage_anchored' : 'contemporary_remix',
    title: String(rawProposal?.title || 'Bản phối Việt Phục Đương Đại'),
    concept_tag: String(rawProposal?.concept_tag || 'Concept Đương Đại'),
    garment_type,
    dial_level: typeof rawProposal?.dial_level === 'number' ? rawProposal.dial_level : 3,
    visual_details: rawProposal?.visual_details || {
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
    stylist_notes: rawProposal?.stylist_notes || {
      philosophy: '',
      gen_z_tips: [],
      occasions: [],
    },
  };
}

/**
 * Pure response processing helper for POST /api/remix/generate.
 * Requirement 2, 3 & 13:
 * - Validates contract for both proposals against authoritative garment.
 * - Enforces exactly 2 valid proposals.
 * - Falls back to deterministic proposals with source: 'deterministic_engine_fallback' if contract fails.
 */
export interface ProcessGeminiProposalResponseOptions {
  context?: string;
  style?: string;
  dial_level?: number;
}

export interface ProcessedProposalResult {
  success: boolean;
  proposals: OutfitProposal[];
  source: 'gemini' | 'deterministic_engine_fallback';
  warning?: string;
}

export function processGeminiProposalResponse(
  parsedJson: any,
  expectedGarment: GarmentKey,
  options?: ProcessGeminiProposalResponseOptions
): ProcessedProposalResult {
  const context = options?.context || 'streetwear';
  const style = options?.style || 'modern_minimal';
  const dial_level = typeof options?.dial_level === 'number' ? options.dial_level : 3;

  const rawProposals = parsedJson?.proposals;

  // Must have proposals array
  if (!Array.isArray(rawProposals)) {
    return {
      success: true,
      proposals: generateDeterministicProposals(expectedGarment, context, style, dial_level),
      source: 'deterministic_engine_fallback',
      warning: 'Mô hình không trả về mảng proposals hợp lệ.',
    };
  }

  // Must have exactly 2 proposals (Requirement 2)
  if (rawProposals.length !== 2) {
    return {
      success: true,
      proposals: generateDeterministicProposals(expectedGarment, context, style, dial_level),
      source: 'deterministic_engine_fallback',
      warning: `Yêu cầu đúng 2 proposals nhưng mô hình trả về ${rawProposals.length} proposals.`,
    };
  }

  // Validate contract for both proposals (Requirement 1, 11 & 12)
  for (let i = 0; i < rawProposals.length; i++) {
    const validation = validateGeminiProposalContract(rawProposals[i], expectedGarment);
    if (!validation.valid) {
      return {
        success: true,
        proposals: generateDeterministicProposals(expectedGarment, context, style, dial_level),
        source: 'deterministic_engine_fallback',
        warning: `Proposal ${i + 1} vi phạm contract: ${validation.error}`,
      };
    }
  }

  // Normalize both proposals with deterministic IDs (Requirement 4)
  const normalizedProposals = rawProposals.map((prop: any, idx: number) =>
    normalizeGeminiProposal(prop, expectedGarment, idx)
  );

  return {
    success: true,
    proposals: normalizedProposals,
    source: 'gemini',
  };
}

/**
 * Normalizes a What-If evaluation returned by Gemini.
 * Enforces:
 * 1. Prototype compliance is forced to 'conflict' if valid violated invariants exist.
 * 2. Out-of-scope or unknown evidence IDs are demoted to system_warnings and do NOT trigger conflict.
 * 3. Historical confidence is strictly derived from CKB_REGISTRY.
 * 4. Technical warnings are segregated into system_warnings, keeping cautions_and_redlines clean.
 * 5. Impact analysis prose is sanitized against overconfident claims and grounded with CKB disclaimer.
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

  // 1. Prototype compliance (Requirement 3 & 7)
  let violates_invariants = validViolatedIds.length > 0;
  if (!violates_invariants && rawEvaluation?.violates_invariants && rawViolated.length === 0) {
    violates_invariants = true;
  }

  let prototype_compliance: PrototypeCompliance;
  if (violates_invariants || rawEvaluation?.prototype_compliance === 'conflict') {
    prototype_compliance = 'conflict';
    violates_invariants = true;
  } else if (validApplicableIds.length === 0 && validViolatedIds.length === 0) {
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
    ? rawEvaluation.cautions_and_redlines.map(String).filter((s: string) => s.trim().length > 0)
    : [];

  // 4. Prose Certainty Hardening (Requirement 1 & 2)
  const impact_analysis = sanitizeWhatIfImpactAnalysis(
    String(rawEvaluation?.impact_analysis || ''),
    historical_confidence,
    prototype_compliance
  );

  return {
    query: String(rawEvaluation?.query || ''),
    target_garment: garmentKey,
    proposed_change: String(rawEvaluation?.proposed_change || ''),
    status,
    uncertainty_flag,
    impact_analysis,
    violates_invariants,
    violated_evidence_ids: validViolatedIds,
    applicable_evidence_ids: validApplicableIds,
    cautions_and_redlines: rawCautions,
    system_warnings: systemWarnings,
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
