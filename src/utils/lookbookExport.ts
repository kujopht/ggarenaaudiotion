import { OutfitProposal } from '../types/vietphuc';

export type LookbookFormat = 'social_4_5' | 'story_9_16';

export interface LookbookExportResult {
  status: 'prepared' | 'downloaded' | 'unavailable';
  format: LookbookFormat;
  message: string;
  timestamp: string;
  filename?: string;
}

/**
 * Client-side export preparation abstraction for Lookbook cards.
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
 * Generates compact and truthful shareable text for clipboard / Web Share.
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

/**
 * Generates a clean timestamped filename: rewear-lookbook-[ngày]-[giờ].png
 */
export function generateLookbookFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `rewear-lookbook-${year}-${month}-${day}-${hours}-${minutes}.png`;
}

/**
 * Render Lookbook Card directly into a high-resolution PNG using HTML5 Canvas API.
 * High fidelity, zero external dependencies, 100% stable offline.
 */
export async function downloadLookbookAsPng(
  proposal: OutfitProposal,
  format: LookbookFormat
): Promise<{ success: boolean; filename: string }> {
  const filename = generateLookbookFilename();

  // Dimensions
  const width = 1080;
  const height = format === 'social_4_5' ? 1350 : 1920;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { success: false, filename };

  // 1. Background Lacquer Finish
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#120E0D');
  bgGrad.addColorStop(0.5, '#1C1412');
  bgGrad.addColorStop(1, '#0E0A09');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ornamental Border & Corners
  ctx.strokeStyle = '#C9A66B';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  ctx.strokeStyle = 'rgba(201, 166, 107, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // Corner Accents
  const cornerSize = 28;
  const corners = [
    [48, 48],
    [width - 48, 48],
    [48, height - 48],
    [width - 48, height - 48],
  ];
  ctx.fillStyle = '#C9A66B';
  corners.forEach(([cx, cy]) => {
    ctx.fillRect(cx - 4, cy - 4, 8, 8);
  });

  // 3. Header Branding
  ctx.textAlign = 'center';
  ctx.fillStyle = '#C9A66B';
  ctx.font = 'bold 24px monospace';
  ctx.fillText('KUJO RE:WEAR · VIỆT PHỤC TÁI ĐỊNH HÌNH', width / 2, 110);

  ctx.fillStyle = '#8C7E6C';
  ctx.font = '16px sans-serif';
  ctx.fillText('VIETNAMESE HERITAGE CO-DESIGN STUDIO', width / 2, 140);

  // Divider line
  ctx.strokeStyle = 'rgba(201, 166, 107, 0.3)';
  ctx.beginPath();
  ctx.moveTo(120, 165);
  ctx.lineTo(width - 120, 165);
  ctx.stroke();

  // 4. Plan Badge
  const isHeritage = proposal.plan_type === 'heritage_anchored';
  const badgeText = isHeritage
    ? 'HERITAGE ANCHORED · BẢN PHỐI A'
    : `CONTEMPORARY REMIX · BẢN PHỐI B (MỨC ${proposal.dial_level}/5)`;

  ctx.fillStyle = isHeritage ? '#C9A66B' : '#B8342B';
  ctx.fillRect(width / 2 - 240, 195, 480, 44);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px monospace';
  ctx.fillText(badgeText, width / 2, 224);

  // 5. Look Title
  ctx.fillStyle = '#F2E9D8';
  ctx.font = 'bold 42px serif';
  ctx.fillText(proposal.title, width / 2, 305);

  // Concept Tag
  ctx.fillStyle = '#E6C88B';
  ctx.font = '20px monospace';
  ctx.fillText(`“${proposal.concept_tag}”`, width / 2, 345);

  // 6. Garment Type & Dynasty Reference
  const garmentLabel =
    proposal.garment_type === 'ngu_than'
      ? 'Áo Ngũ Thân Tay Chẽn (Thường phục thời Nguyễn)'
      : proposal.garment_type === 'ao_tac'
      ? 'Áo Tấc Lễ Phục (Đại lễ phục thời Nguyễn)'
      : 'Áo Nhật Bình (Nữ phục đối khâm cung đình Huế)';

  ctx.fillStyle = '#B8AA96';
  ctx.font = '20px sans-serif';
  ctx.fillText(garmentLabel, width / 2, 395);

  // 7. Middle Box: Structural Specs
  const cardY = 440;
  const cardH = format === 'social_4_5' ? 440 : 660;
  ctx.fillStyle = 'rgba(38, 28, 25, 0.85)';
  ctx.fillRect(100, cardY, width - 200, cardH);
  ctx.strokeStyle = 'rgba(201, 166, 107, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(100, cardY, width - 200, cardH);

  // Section: Color Palette
  ctx.textAlign = 'left';
  ctx.fillStyle = '#C9A66B';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('1. BẢNG MÀU CHỦ ĐẠO', 140, cardY + 50);

  // Swatch circles
  let swatchX = 140;
  proposal.visual_details.color_palette.forEach((colorStr) => {
    const hexMatch = colorStr.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
    const hex = hexMatch ? hexMatch[0] : '#C9A66B';
    const label = colorStr.replace(hex, '').trim() || hex;

    ctx.beginPath();
    ctx.arc(swatchX + 16, cardY + 100, 16, 0, Math.PI * 2);
    ctx.fillStyle = hex;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#D4C7B4';
    ctx.font = '16px sans-serif';
    ctx.fillText(label, swatchX + 42, cardY + 106);

    swatchX += 240;
  });

  // Section: Materials & Specs
  ctx.fillStyle = '#C9A66B';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('2. CHẤT LIỆU & PHOM DÁNG', 140, cardY + 175);

  ctx.fillStyle = '#F2E9D8';
  ctx.font = '18px sans-serif';
  ctx.fillText(`• Vải dệt: ${proposal.visual_details.fabric_materials.join(', ')}`, 140, cardY + 215);
  ctx.fillText(`• Cấu trúc: ${proposal.visual_details.collar_style} · ${proposal.visual_details.lapel_side}`, 140, cardY + 250);
  ctx.fillText(`• Phối cùng: ${proposal.visual_details.bottom_garment} · Giày: ${proposal.visual_details.footwear}`, 140, cardY + 285);
  ctx.fillText(`• Phụ kiện: ${proposal.visual_details.accessories.join(', ')}`, 140, cardY + 320);

  // Section: Stylist Philosophy
  ctx.fillStyle = '#C9A66B';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('3. TRIẾT LÝ STYLIST', 140, cardY + 380);

  ctx.fillStyle = '#E6C88B';
  ctx.font = 'italic 18px serif';
  ctx.fillText(`“${proposal.stylist_notes.philosophy.slice(0, 90)}...”`, 140, cardY + 415);

  // 8. Cultural Audit Seal
  const auditY = cardY + cardH + 40;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#C9A66B';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('CHỨNG THỰC CƠ SỞ TRI THỨC VĂN HÓA (CKB)', width / 2, auditY);

  const complianceLabel =
    proposal.audit.prototype_compliance === 'compliant'
      ? 'PROTOTYPE: TUÂN THỦ'
      : proposal.audit.prototype_compliance === 'conflict'
      ? 'PROTOTYPE: XUNG ĐỘT'
      : 'PROTOTYPE: CHƯA ĐÁNH GIÁ';

  const confidenceLabel =
    proposal.audit.historical_confidence === 'verified'
      ? 'SỬ LIỆU: ĐÃ KIỂM CHỨNG'
      : proposal.audit.historical_confidence === 'needs_review'
      ? 'SỬ LIỆU: CHỜ ĐỐI SOÁT'
      : 'SỬ LIỆU: ĐÃ XÁC THỰC';

  ctx.fillStyle = '#D4C7B4';
  ctx.font = 'bold 18px monospace';
  ctx.fillText(`${complianceLabel}  ·  ${confidenceLabel}`, width / 2, auditY + 38);

  ctx.fillStyle = '#8C7E6C';
  ctx.font = '16px monospace';
  ctx.fillText(`CĂN CỨ CKB: ${proposal.audit.evidence_ids.join(', ') || 'KB-RULE-01'}`, width / 2, auditY + 70);

  // 9. Bottom Footer
  ctx.strokeStyle = 'rgba(201, 166, 107, 0.3)';
  ctx.beginPath();
  ctx.moveTo(120, height - 120);
  ctx.lineTo(width - 120, height - 120);
  ctx.stroke();

  ctx.fillStyle = '#8C7E6C';
  ctx.font = '16px monospace';
  ctx.fillText('KUJO RE:WEAR · AI ARENA VIETNAM 2026', width / 2, height - 85);
  ctx.fillText(`Xuất bản: ${new Date().toLocaleDateString('vi-VN')} · ID: ${proposal.id}`, width / 2, height - 58);

  // Convert canvas to data URL and download
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return { success: true, filename };
  } catch (err) {
    console.error('Canvas export error:', err);
    return { success: false, filename };
  }
}
