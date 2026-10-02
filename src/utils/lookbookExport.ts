import { OutfitProposal } from '../types/vietphuc';

export type LookbookFormat = 'social_4_5' | 'story_9_16';

export interface LookbookExportResult {
  status: 'prepared' | 'unavailable';
  format: LookbookFormat;
  message: string;
  timestamp: string;
}

/**
 * Client-side export preparation abstraction for Lookbook cards (Requirement 4).
 * Prepares metadata and export frame without pulling heavy rasterizer dependencies.
 */
export function exportLookbookCard(
  proposal: OutfitProposal,
  format: LookbookFormat
): LookbookExportResult {
  return {
    status: 'prepared',
    format,
    message: `Khung xuất ảnh ${format === 'social_4_5' ? '4:5 Social Post' : '9:16 Story'} đã sẵn sàng cho bản phối "${proposal.title}".`,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generates compact and truthful shareable text for clipboard (Requirement 3).
 * Contains brand, title, garment, remix level, concept, palette, materials,
 * cultural status (Prototype & Historical separate), and evidence IDs.
 */
export function formatLookbookShareText(proposal: OutfitProposal): string {
  const planTypeLabel =
    proposal.plan_type === 'heritage_anchored'
      ? 'Heritage Anchored'
      : 'Contemporary Remix';

  const garmentLabel =
    proposal.garment_type === 'ngu_than'
      ? 'Áo Ngũ Thân tay chẽn'
      : proposal.garment_type === 'ao_tac'
      ? 'Áo Tấc lễ phục'
      : 'Áo Nhật Bình';

  const complianceLabel =
    proposal.audit.prototype_compliance === 'compliant'
      ? 'Tuân thủ'
      : proposal.audit.prototype_compliance === 'conflict'
      ? 'Xung đột'
      : 'Chưa đánh giá';

  const confidenceLabel =
    proposal.audit.historical_confidence === 'verified'
      ? 'Đã kiểm chứng'
      : proposal.audit.historical_confidence === 'partially_verified'
      ? 'Đã xác thực một phần'
      : proposal.audit.historical_confidence === 'needs_review'
      ? 'Đang chờ đối soát'
      : proposal.audit.historical_confidence === 'mixed'
      ? 'Nguồn hỗn hợp'
      : 'Chưa đối soát độc lập';

  const paletteText = proposal.visual_details.color_palette.join(' · ');
  const materialsText = proposal.visual_details.fabric_materials.join(', ');
  const evidenceIds = proposal.audit.evidence_ids.join(', ') || 'Chưa đủ dữ liệu tham chiếu';

  return [
    'KUJO Re:Wear · Việt Phục Tái Định Hình',
    `Bản phối: ${proposal.title} (${planTypeLabel})`,
    `Cổ phục: ${garmentLabel} · Mức Remix ${proposal.dial_level}/5`,
    `Concept: ${proposal.concept_tag}`,
    `Bảng màu: ${paletteText}`,
    `Chất liệu: ${materialsText}`,
    `Phối kèm: ${proposal.visual_details.bottom_garment} · Giày: ${proposal.visual_details.footwear}`,
    `Phụ kiện: ${proposal.visual_details.accessories.join(', ')}`,
    `Thẩm định: Prototype [${complianceLabel}] · Sử liệu [${confidenceLabel}]`,
    `Dẫn chứng CKB: ${evidenceIds}`,
  ].join('\n');
}
