export type CulturalAuditStatus = 'Supported' | 'Supported with Caution' | 'Insufficient Evidence';

export type GarmentKey = 'ngu_than' | 'ao_tac' | 'nhat_binh';

export type VerificationStatus = 'verified' | 'unverified' | 'needs_review' | 'needs_research' | 'disputed';

export type PrototypeCompliance = 'compliant' | 'conflict' | 'unassessed';

export type HistoricalConfidence = 'verified' | 'partially_verified' | 'needs_review' | 'unverified' | 'mixed';

export type SourceType =
  | 'primary_text'
  | 'historical_text'
  | 'research_study'
  | 'museum_archive'
  | 'community_consensus'
  | 'internal_heuristic'
  | 'contemporary_guideline';

export type GarmentScope = 'all' | 'ngu_than' | 'ao_tac' | 'nhat_binh' | 'ngu_than_and_tac' | 'needs_verification';

export interface InformationTier {
  historical_claim: string;        // Thông tin lịch sử / có nguồn tham chiếu
  prototype_rule: string;          // Quy tắc nội bộ của prototype
  contemporary_suggestion: string; // Gợi ý sáng tạo đương đại
}

export interface CKBEntry {
  id: string; // e.g. KB-RULE-01
  title: string;
  category: 'invariant' | 'mutable' | 'sacred_rule';
  garment_scope: GarmentKey[] | GarmentScope;
  core_rule: string;
  historical_context: string;
  creative_boundary: string;
  redline_warning?: string;

  // Source & Verification Metadata (Submission Hardening)
  source_title?: string;
  source_author_or_org?: string;
  source_url?: string;
  source_page?: string;
  source_type?: SourceType;
  confidence?: 'high' | 'medium' | 'low' | 'provisional';
  verification_status: VerificationStatus;
  notes?: string;

  // Information Tier Separation (Requirement 3)
  information_tier: InformationTier;
}

export interface InvariantCheckResult {
  evidence_id: string;
  rule_name: string;
  passed: boolean;
  detail: string;
}

export interface MutableUsage {
  evidence_id: string;
  element: string;
  application: string;
}

export interface CulturalAuditResult {
  status: CulturalAuditStatus;
  uncertainty_flag: boolean;
  uncertainty_note?: string;
  evidence_ids: string[];
  invariants_checked: InvariantCheckResult[];
  mutables_used: MutableUsage[];
  cautions_and_redlines: string[];
  system_warnings?: string[];
  auditor_verdict: string;

  // Separation of prototype compliance & historical confidence (Requirement 4)
  prototype_compliance?: PrototypeCompliance;
  historical_confidence?: HistoricalConfidence;
  verification_summary?: string;

  // Logic Hardening: separation of design caution vs evidence uncertainty (Requirement 3 & 4)
  has_design_caution?: boolean;
  has_evidence_uncertainty?: boolean;
}

export interface VisualDetails {
  collar_style: string;
  lapel_side: string;
  sleeve_style: string;
  cut_length: string;
  fabric_materials: string[];
  layering_pieces: string[];
  bottom_garment: string;
  footwear: string;
  accessories: string[];
  color_palette: string[];
}

export interface StylistNotes {
  philosophy: string;
  gen_z_tips: string[];
  occasions: string[];
}

export interface OutfitProposal {
  id: string;
  plan_type: 'heritage_anchored' | 'contemporary_remix';
  title: string;
  concept_tag: string;
  garment_type: GarmentKey;
  dial_level: number;
  visual_details: VisualDetails;
  audit: CulturalAuditResult;
  stylist_notes: StylistNotes;
}

export interface StylistCounterProposal {
  title: string;
  solution: string;
  heritage_safeguard: string;
  contemporary_edge: string;
  materials_and_cuts: string;
}

export interface WhatIfEvaluation {
  query: string;
  target_garment: string;
  proposed_change: string;
  status: CulturalAuditStatus;
  uncertainty_flag: boolean;
  impact_analysis: string;
  violates_invariants: boolean;
  violated_evidence_ids: string[];
  applicable_evidence_ids: string[];
  cautions_and_redlines: string[];
  system_warnings?: string[];
  stylist_counter_proposal: StylistCounterProposal;

  // Separation of prototype compliance & historical confidence (Requirement 4)
  prototype_compliance?: PrototypeCompliance;
  historical_confidence?: HistoricalConfidence;
  verification_summary?: string;

  // Logic Hardening: separation of design caution vs evidence uncertainty (Requirement 3 & 4)
  has_design_caution?: boolean;
  has_evidence_uncertainty?: boolean;
}

// -------------------------------------------------------------
// V2.0 Visual-First Design Studio: Design State & Image Pipeline
// -------------------------------------------------------------
export type ImageGenerationStatus = 'image_ready' | 'image_generating' | 'image_unavailable';

export interface LookImageData {
  status: ImageGenerationStatus;
  imageUrl?: string;
  generationSource?: string;
  promptUsed?: string;
  aspectRatio?: '1:1' | '3:4' | '9:16' | '16:9';
  errorMessage?: string;
}

export interface DesignState {
  id: string;
  garment_type: GarmentKey;
  plan_type: 'heritage_anchored' | 'contemporary_remix';
  title: string;
  concept_tag: string;
  dial_level: number;
  collar: string;
  lapel: string;
  sleeve: string;
  length: string;
  fabric_materials: string[];
  layering: string[];
  bottom_garment: string;
  footwear: string;
  accessories: string[];
  color_palette: string[];
  stylist_notes: StylistNotes;
  audit: CulturalAuditResult;
  evidence_ids: string[];
  image_data?: LookImageData;
}

/**
 * Adapter converting existing OutfitProposal to structured DesignState
 */
export function proposalToDesignState(proposal: OutfitProposal, imageData?: LookImageData): DesignState {
  return {
    id: proposal.id,
    garment_type: proposal.garment_type,
    plan_type: proposal.plan_type,
    title: proposal.title,
    concept_tag: proposal.concept_tag,
    dial_level: proposal.dial_level,
    collar: proposal.visual_details.collar_style,
    lapel: proposal.visual_details.lapel_side,
    sleeve: proposal.visual_details.sleeve_style,
    length: proposal.visual_details.cut_length,
    fabric_materials: [...(proposal.visual_details.fabric_materials || [])],
    layering: [...(proposal.visual_details.layering_pieces || [])],
    bottom_garment: proposal.visual_details.bottom_garment,
    footwear: proposal.visual_details.footwear,
    accessories: [...(proposal.visual_details.accessories || [])],
    color_palette: [...(proposal.visual_details.color_palette || [])],
    stylist_notes: {
      philosophy: proposal.stylist_notes.philosophy,
      gen_z_tips: [...(proposal.stylist_notes.gen_z_tips || [])],
      occasions: [...(proposal.stylist_notes.occasions || [])],
    },
    audit: proposal.audit,
    evidence_ids: proposal.audit.evidence_ids ? [...proposal.audit.evidence_ids] : [],
    image_data: imageData || {
      status: 'image_unavailable',
      generationSource: 'placeholder_editorial',
    },
  };
}

/**
 * Adapter converting structured DesignState back to OutfitProposal
 */
export function designStateToProposal(state: DesignState): OutfitProposal {
  return {
    id: state.id,
    plan_type: state.plan_type,
    title: state.title,
    concept_tag: state.concept_tag,
    garment_type: state.garment_type,
    dial_level: state.dial_level,
    visual_details: {
      collar_style: state.collar,
      lapel_side: state.lapel,
      sleeve_style: state.sleeve,
      cut_length: state.length,
      fabric_materials: [...state.fabric_materials],
      layering_pieces: [...state.layering],
      bottom_garment: state.bottom_garment,
      footwear: state.footwear,
      accessories: [...state.accessories],
      color_palette: [...state.color_palette],
    },
    audit: state.audit,
    stylist_notes: {
      philosophy: state.stylist_notes.philosophy,
      gen_z_tips: [...state.stylist_notes.gen_z_tips],
      occasions: [...state.stylist_notes.occasions],
    },
  };
}

