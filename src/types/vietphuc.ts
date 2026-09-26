export type CulturalAuditStatus = 'Supported' | 'Supported with Caution' | 'Insufficient Evidence';

export type GarmentKey = 'ngu_than' | 'ao_tac' | 'nhat_binh';

export type VerificationStatus = 'verified' | 'unverified' | 'needs_review' | 'needs_research' | 'disputed';

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
  auditor_verdict: string;
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
  stylist_counter_proposal: StylistCounterProposal;
}
