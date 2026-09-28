import { OutfitProposal, WhatIfEvaluation, GarmentKey, CulturalAuditResult } from '../types/vietphuc';
import {
  getCKBEntry,
  isRuleApplicableToGarment,
  getRuleCertainty,
  deriveAuditConfidence,
} from '../data/ckbRegistry';

/**
 * Deterministic What-If Evaluator for Cultural Knowledge Base (CKB)
 * Single Source of Truth architecture: Rules, metadata, and certainty are read directly from CKB_REGISTRY.
 */
export function evaluateWhatIfDeterministic(
  garment: string,
  query: string,
  current_outfit?: any
): WhatIfEvaluation {
  const rawQuery = query || '';
  const q = rawQuery.toLowerCase().trim();
  const effectiveGarment = (current_outfit?.garment_type || garment || 'ngu_than') as GarmentKey;
  const outfitNote = current_outfit
    ? `[Đang thử nghiệm trên "${current_outfit.title}" (Nấc Dial ${current_outfit.dial_level})]: `
    : '';

  // Helper: check for negation or intent to preserve/avoid
  const hasNegation = (phrase: string): boolean => {
    const negationPatterns = [
      /không\s+(muốn|cần|đổi|thay|cài|làm|bỏ|thêu|chọn)/,
      /chẳng\s+(muốn|cần|đổi|thay|cài|làm|bỏ|thêu|chọn)/,
      /đừng\s+(đổi|thay|cài|làm|bỏ|thêu)/,
      /chớ\s+(đổi|thay|cài|làm|bỏ|thêu)/,
      /không\s+phải/,
      /không\s+hề/,
      /giữ\s+nguyên/,
      /bảo\s+lưu/,
      /tránh/,
    ];
    return negationPatterns.some((pattern) => pattern.test(phrase));
  };

  // --------------------------------------------------------------------------
  // Rule 1: Lapel side (Hữu Nhậm vs Tả Nhậm) - KB-RULE-01
  // Scope: Only applies to garments where isRuleApplicableToGarment is true (ngu_than, ao_tac).
  // Áo Nhật Bình is Đối Khâm (parallel front lapels), not Hữu Nhậm.
  // Must NOT trigger for accessories on the left (bags, watches, bows, etc.)
  // --------------------------------------------------------------------------
  const rule01 = getCKBEntry('KB-RULE-01')!;
  const isApplicableLapel = isRuleApplicableToGarment(rule01, effectiveGarment);

  const isAccessoryLeft =
    q.includes('túi') ||
    q.includes('balo') ||
    q.includes('cặp') ||
    q.includes('hoa cài') ||
    q.includes('nơ') ||
    q.includes('đồng hồ') ||
    q.includes('trâm') ||
    q.includes('khăn tay');

  const isLapelLeftProposal =
    isApplicableLapel &&
    !isAccessoryLeft &&
    !hasNegation(q) &&
    (
      // Explicit term
      q.includes('tả nhậm') ||
      q.includes('tả-nhậm') ||
      // Lapel/buttoning keywords combined with left-hand direction
      ((q.includes('vạt') || q.includes('khuy') || q.includes('cài') || q.includes('lật vạt') || q.includes('đóng vạt') || q.includes('nẹp vạt')) &&
        (q.includes('sang trái') || q.includes('bên trái') || q.includes('qua trái') || q.includes('phía trái') || q.includes('vạt trái đè')))
    );

  if (isLapelLeftProposal) {
    const auditConf = deriveAuditConfidence([rule01.id], true);
    return {
      query: rawQuery,
      target_garment: effectiveGarment,
      proposed_change: 'Đổi vạt áo và cài khuy sang bên trái (Tả nhậm)',
      status: 'Supported with Caution',
      uncertainty_flag: true,
      prototype_compliance: auditConf.prototype_compliance,
      historical_confidence: auditConf.historical_confidence,
      verification_summary: auditConf.verification_summary,
      impact_analysis:
        outfitNote +
        `Thay đổi này xung đột với quy tắc prototype ${rule01.id} (${rule01.title}). ${rule01.information_tier.prototype_rule} Tuy nhiên, nguồn lịch sử của rule này trong bản thử nghiệm hiện chưa được xác minh độc lập. Trong tập quán y phục Á Đông, tả nhậm là quy thức cài áo thường liên quan y phục tang ma theo quan niệm dân gian truyền khẩu (chưa được dự án kiểm chứng bằng thư tịch chính thức), khuyến cáo tránh dùng trên trang phục thường nhật.`,
      violates_invariants: true,
      violated_evidence_ids: [rule01.id],
      applicable_evidence_ids: [rule01.id],
      cautions_and_redlines: [
        `LƯU Ý QUY THỨC [${rule01.id}]: ${rule01.core_rule} (Nguồn tham chiếu hiện chưa được xác minh độc lập trong bản thử nghiệm).`,
      ],
      stylist_counter_proposal: {
        title: 'Bảo lưu Hữu Nhậm với Cúc Bấm Kim Loại Hiện Đại Cho Người Thuận Tay Trái',
        solution:
          'Vẫn giữ đúng quy thức Hữu nhậm (vạt trái đè vạt phải, khuy bên phải), nhưng ứng dụng hệ thống khóa bấm kim loại từ tính (magnetic snap buttons) hoặc khóa kéo ẩn bên hông phải để người thuận tay trái thao tác đóng mở nhanh trong 1 giây.',
        heritage_safeguard:
          'Bảo vệ nguyên vẹn cấu trúc Hữu nhậm theo quy ước prototype, tránh nguy cơ đồng nhất với y phục tang lễ.',
        contemporary_edge:
          'Ứng dụng công nghệ phụ liệu may mặc công thái học hiện đại cho người thuận tay trái.',
        materials_and_cuts: 'Raw denim hoặc linen cao cấp đính khuy nam châm chìm bên phải.',
      },
    };
  }

  // --------------------------------------------------------------------------
  // Rule 2: Five-Claw Dragon Motif (Rồng 5 móng / Ngũ trảo) - KB-RULE-03
  // Sourced from CKB_REGISTRY (Status: needs_review)
  // --------------------------------------------------------------------------
  const rule03 = getCKBEntry('KB-RULE-03')!;
  const isDragonProposal =
    !hasNegation(q) &&
    (q.includes('rồng 5 móng') ||
      q.includes('rồng năm móng') ||
      q.includes('ngũ trảo long') ||
      q.includes('ngũ trảo') ||
      (q.includes('rồng') && q.includes('5 móng')));

  if (isDragonProposal) {
    const auditConf = deriveAuditConfidence([rule03.id], true);
    return {
      query: rawQuery,
      target_garment: effectiveGarment,
      proposed_change: 'Thêu họa tiết Rồng 5 móng lên y phục dân dụng',
      status: 'Supported with Caution',
      uncertainty_flag: true,
      prototype_compliance: auditConf.prototype_compliance,
      historical_confidence: auditConf.historical_confidence,
      verification_summary: auditConf.verification_summary,
      impact_analysis:
        outfitNote +
        `Thay đổi này xung đột với quy tắc prototype ${rule03.id} (${rule03.title}). ${rule03.core_rule} Tuy nhiên, nguồn lịch sử tham chiếu cần được rà soát thêm (${rule03.source_title || 'thư tịch triều Nguyễn'}, trạng thái needs_review), do đó hệ thống khuyến cáo cẩn trọng thay vì khẳng định học thuật tuyệt đối.`,
      violates_invariants: true,
      violated_evidence_ids: [rule03.id],
      applicable_evidence_ids: [rule03.id],
      cautions_and_redlines: [
        `LƯU Ý ĐIỂN CHẾ [${rule03.id}]: ${rule03.redline_warning || rule03.core_rule} (Trạng thái nguồn: Cần rà soát thêm tư liệu).`,
      ],
      stylist_counter_proposal: {
        title: 'Chuyển Hướng Sang Họa Tiết Rồng 4 Móng, Giao Long Hoặc Mây Sấm Bát Bửu Dân Gian',
        solution:
          'Thay thế rồng 5 móng bằng họa tiết Rồng 4 móng (tứ trảo long - dùng cho vương thân), Giao long cách điệu hình học, hoặc đồ án Mây sấm (Vân lôi), Hoa chanh, Bát bửu dân gian đương đại.',
        heritage_safeguard:
          'Tránh lỗi tiếm phạm quy tắc hoàng quyền theo điển chế ghi chép.',
        contemporary_edge:
          'Đồ án Rồng 4 móng cách điệu line-art đồ họa mang hơi thở Cyber-Indochine cực kỳ cuốn hút giới trẻ.',
        materials_and_cuts: 'Thêu chỉ bạc ánh kim hoặc in chuyển nhiệt phản quang trên nền vải dạ hoặc gấm chìm.',
      },
    };
  }

  // --------------------------------------------------------------------------
  // Rule 3: Áo Nhật Bình Cuffs & Five-Color Bands (Cổ tay ngũ sắc) - KB-NHATBINH-02
  // Must distinguish "cổ tay" (cuffs/wrists) from "cổ áo" (collar)!
  // Target garment MUST remain nhat_binh, NEVER mistakenly flipped to ngu_than.
  // --------------------------------------------------------------------------
  const ruleNhatBinh02 = getCKBEntry('KB-NHATBINH-02')!;
  const isCuffFiveColorsProposal =
    !hasNegation(q) &&
    (effectiveGarment === 'nhat_binh' || q.includes('nhật bình')) &&
    (q.includes('cổ tay') || q.includes('viền tay') || q.includes('ngũ sắc') || q.includes('dải màu ngũ hành') || q.includes('dải màu')) &&
    (q.includes('đổi') || q.includes('thay') || q.includes('bỏ') || q.includes('đảo') || q.includes('màu') || q.includes('viền'));

  if (isCuffFiveColorsProposal) {
    const auditConf = deriveAuditConfidence([ruleNhatBinh02.id], false);
    return {
      query: rawQuery,
      target_garment: 'nhat_binh',
      proposed_change: 'Bỏ hoặc thay đổi màu dải ngũ hành ở viền tay Áo Nhật Bình',
      status: 'Supported with Caution',
      uncertainty_flag: true,
      prototype_compliance: 'compliant',
      historical_confidence: 'needs_review',
      verification_summary: auditConf.verification_summary,
      impact_analysis:
        outfitNote +
        `Tư liệu Tạp chí Văn hóa Nghệ thuật ghi nhận dải ngũ hành viền tay xuất hiện trên nhiều phẩm cấp Nhật Bình triều Nguyễn nhưng có ngoại lệ ở bậc Hoàng hậu. Do chưa xác định phẩm cấp cụ thể của người mặc, thay đổi này không bị coi là xung đột quy tắc bất biến. Nếu muốn bản phối tham chiếu chính xác một phẩm cấp cung đình, khuyến nghị xác định rõ phẩm cấp trước khi thiết kế.`,
      violates_invariants: false,
      violated_evidence_ids: [],
      applicable_evidence_ids: [ruleNhatBinh02.id],
      cautions_and_redlines: [
        `LƯU Ý THAM CHIẾU [${ruleNhatBinh02.id}]: Dải ngũ hành thay đổi theo phẩm cấp (Hoàng hậu là ngoại lệ). Bản phối tự do có thể gia giảm nhưng cần lưu ý nếu muốn hướng tới phẩm cấp cụ thể.`,
      ],
      stylist_counter_proposal: {
        title: 'Giữ Gợi Nhắc Dải Ngũ Hành Tone Muted Hoặc Phối Màu Đơn Sắc Tinh Tế',
        solution:
          'Giữ một gợi nhắc dải ngũ hành nếu muốn tham chiếu nhóm Nhật Bình ngoài Hoàng hậu, hoặc dùng xử lý tone muted / tone-sur-tone khi chưa xác định phẩm cấp cụ thể.',
        heritage_safeguard:
          'Bảo tồn tính linh hoạt theo phẩm cấp lịch sử thay vì áp đặt cứng nhắc quy tắc ngũ sắc cho mọi kiểu Nhật Bình.',
        contemporary_edge:
          'Tạo nét thanh lịch, tối giản phù hợp thẩm mỹ đương đại mà vẫn lưu lại dấu ấn cung đình.',
        materials_and_cuts: 'Chất liệu lụa tơ tằm dệt chìm hoặc chỉ thêu phối màu chuyển tiếp tinh tế.',
      },
    };
  }

  // --------------------------------------------------------------------------
  // Rule 4: Standing Collar Alteration (Cổ Lập Lĩnh) - KB-NGUTHAN-01
  // Applicable only to Áo Ngũ Thân (and Áo Tấc).
  // CRITICAL: Must NOT match "cổ tay"! If "cổ" only appears as part of "cổ tay", ignore!
  // --------------------------------------------------------------------------
  const ruleNguThan01 = getCKBEntry('KB-NGUTHAN-01')!;
  const queryWithoutCuff = q.replace(/cổ\s*tay/g, '');
  const hasTrueCollarMention =
    queryWithoutCuff.includes('cổ áo') ||
    queryWithoutCuff.includes('lập lĩnh') ||
    queryWithoutCuff.includes('cổ đứng') ||
    queryWithoutCuff.includes('cổ bẻ') ||
    queryWithoutCuff.includes('cổ vest') ||
    queryWithoutCuff.includes('khoét cổ') ||
    queryWithoutCuff.includes('hạ cổ') ||
    queryWithoutCuff.includes('bỏ cổ') ||
    (queryWithoutCuff.includes('cổ') && (queryWithoutCuff.includes('thay') || queryWithoutCuff.includes('đổi') || queryWithoutCuff.includes('cắt')));

  const isStandingCollarProposal =
    !hasNegation(queryWithoutCuff) &&
    effectiveGarment === 'ngu_than' &&
    hasTrueCollarMention;

  if (isStandingCollarProposal) {
    const auditConf = deriveAuditConfidence([ruleNguThan01.id], true);
    return {
      query: rawQuery,
      target_garment: 'ngu_than',
      proposed_change: 'Thay đổi cổ áo Lập Lĩnh thành cổ bẻ / cổ vest / cổ khoét sâu',
      status: 'Supported with Caution',
      uncertainty_flag: true,
      prototype_compliance: auditConf.prototype_compliance,
      historical_confidence: auditConf.historical_confidence,
      verification_summary: auditConf.verification_summary,
      impact_analysis:
        outfitNote +
        `Thay đổi này xung đột với quy tắc prototype ${ruleNguThan01.id} (${ruleNguThan01.title}). ${ruleNguThan01.core_rule} Tuy nhiên, nguồn lịch sử cho quy chuẩn kích thước cụ thể này trong bản thử nghiệm hiện chưa được xác minh độc lập.`,
      violates_invariants: true,
      violated_evidence_ids: [ruleNguThan01.id],
      applicable_evidence_ids: [ruleNguThan01.id],
      cautions_and_redlines: [
        `LƯU Ý NHẬN DIỆN [${ruleNguThan01.id}]: ${ruleNguThan01.core_rule} (Nguồn tham chiếu hiện chưa được xác minh độc lập trong bản thử nghiệm).`,
      ],
      stylist_counter_proposal: {
        title: 'Giữ Cổ Đứng Nhưng Mở Cúc Cổ Khi Dạo Phố Hoặc Hạ Cổ Thoáng Mát',
        solution:
          'Vẫn may phom cổ vuông đứng kín đáo trang nhã nhưng dùng chất liệu dựng cổ (interlining) mềm mại, hoặc thiết kế cúc cổ có thể mở ra khi dạo phố để lật ve nhẹ, nhưng khi cài lại lập tức trở về phom cổ đứng đoan chính.',
        heritage_safeguard:
          'Giữ trọn vẹn kết cấu nhận diện cốt lõi của cổ đứng theo quy ước prototype.',
        contemporary_edge:
          'Tạo cảm giác thoải mái tối đa cho ngày hè nhiệt đới mà không phá vỡ cấu trúc.',
        materials_and_cuts: 'Chất liệu linen pha lụa tơ tằm với mex dựng cổ mềm.',
      },
    };
  }

  // --------------------------------------------------------------------------
  // Rule 5: Áo Tấc Duster Coat Layering - KB-TAC-03
  // --------------------------------------------------------------------------
  const ruleTac03 = getCKBEntry('KB-TAC-03')!;
  const ruleTac01 = getCKBEntry('KB-TAC-01')!;
  const isAoTacDusterProposal =
    !hasNegation(q) &&
    (effectiveGarment === 'ao_tac' || q.includes('áo tấc')) &&
    (q.includes('duster coat') ||
      q.includes('áo khoác') ||
      q.includes('mở cúc áo tấc') ||
      q.includes('mở khuy áo tấc') ||
      (q.includes('mở tà') && q.includes('khoác')));

  if (isAoTacDusterProposal) {
    const auditConf = deriveAuditConfidence([ruleTac01.id, ruleTac03.id], false);
    return {
      query: rawQuery,
      target_garment: 'ao_tac',
      proposed_change: 'Mở khuy áo Tấc mặc làm áo khoác dáng dài (duster coat) hiện đại',
      status: 'Supported with Caution',
      uncertainty_flag: true,
      prototype_compliance: auditConf.prototype_compliance,
      historical_confidence: auditConf.historical_confidence,
      verification_summary: auditConf.verification_summary,
      impact_analysis:
        outfitNote +
        `Phù hợp với quy tắc prototype hiện tại! Theo ${ruleTac03.id} (${ruleTac03.title}), ${ruleTac03.core_rule}, miễn là bảo toàn ${ruleTac01.title} (${ruleTac01.id}). Nguồn lịch sử của biến tấu này là quy ước sáng tạo nội bộ của lab thử nghiệm, chưa có đối chiếu nghi lễ truyền thống.`,
      violates_invariants: false,
      violated_evidence_ids: [],
      applicable_evidence_ids: [ruleTac01.id, ruleTac03.id],
      cautions_and_redlines: [],
      stylist_counter_proposal: {
        title: 'Phối Áo Tấc Duster Coat Với All-Black Turtleneck & Pleated Trousers',
        solution:
          'Mặc buông 2 vạt áo Tấc tự nhiên, bên trong phối áo thun/len cổ lọ màu đen ôm sát và quần âu xếp ly ống rộng, kết hợp bốt da cao cổ.',
        heritage_safeguard:
          `Bảo lưu trọn vẹn ống tay thụng rộng dài theo ${ruleTac01.id}.`,
        contemporary_edge:
          'Tạo hiệu ứng silhouette bay bổng đậm chất Haute Couture quốc tế.',
        materials_and_cuts: 'Vải dạ len mỏng (lightweight wool) hoặc đũi tơ tằm dệt thô.',
      },
    };
  }

  // --------------------------------------------------------------------------
  // Branch 6: Fallback for all other queries, Negations, or Unrecognized Intents
  // Clearly explains the limitation of deterministic fallback without falsely fabricating taboos!
  // --------------------------------------------------------------------------
  let explanation =
    outfitNote +
    'Yêu cầu thử nghiệm này chưa có đủ dữ liệu quy tắc đối sánh trong bộ suy luận dự phòng ngoại tuyến. Chế độ dự phòng chỉ thẩm định các Invariant/Mutable cốt lõi đã được số hóa (Hữu nhậm, Cổ đứng, Dải ngũ hành theo phẩm cấp, Rồng 5 móng, Áo Tấc duster coat). Không phát hiện xung đột với các quy tắc hiện có trong CKB. Bộ quy tắc hiện tại chưa có đủ dữ liệu để kết luận sâu hơn đối với các chi tiết nằm ngoài tập quy tắc đã số hóa.';

  if (effectiveGarment === 'nhat_binh' && (q.includes('vạt') || q.includes('hữu nhậm') || q.includes('tả nhậm'))) {
    explanation =
      outfitNote +
      'Áo Nhật Bình có kết cấu nẹp cổ Đối Khâm (hai vạt song song mở giữa, buộc ngực), không sử dụng quy thức vạt đè Hữu nhậm như Áo Ngũ Thân/Áo Tấc. Không phát hiện xung đột với các quy tắc hiện có trong CKB.';
  } else if (hasNegation(q)) {
    explanation =
      outfitNote +
      'Câu hỏi mang ý định giữ nguyên hiện trạng hoặc phủ định thay đổi ("không muốn đổi / không thay"). Không phát hiện xung đột với các quy tắc hiện có trong CKB. Việc giữ nguyên các cấu trúc hiện có không làm thay đổi các quy tắc đã ghi nhận.';
  } else if (isAccessoryLeft) {
    explanation =
      outfitNote +
      'Đề xuất sử dụng phụ kiện (như túi xách, balo, trang sức bên trái) là sự lựa chọn phong cách cá nhân tự do, không can thiệp vào quy thức nẹp vạt hay cấu trúc cốt lõi đã số hóa. Không phát hiện xung đột với các quy tắc hiện có trong CKB. Bộ quy tắc hiện tại chưa có đủ dữ liệu để kết luận sâu hơn đối với các phụ kiện ngoài trang phục.';
  }

  return {
    query: rawQuery,
    target_garment: effectiveGarment,
    proposed_change: 'Ý kiến thử nghiệm chưa đủ dữ liệu tham chiếu trong bộ quy tắc CKB dự phòng',
    status: 'Insufficient Evidence',
    uncertainty_flag: true,
    prototype_compliance: 'unassessed',
    historical_confidence: 'unverified',
    verification_summary: 'Chưa đủ dữ liệu tham chiếu trong bộ quy tắc CKB dự phòng',
    impact_analysis: explanation,
    violates_invariants: false,
    violated_evidence_ids: [],
    applicable_evidence_ids: [],
    cautions_and_redlines: [
      'THÔNG TIN HỆ THỐNG: Đang hoạt động ở chế độ phân tích quy tắc dự phòng. Nội dung câu hỏi chưa đủ dữ liệu tham chiếu để đưa ra phán quyết văn hóa chắc chắn.',
    ],
    stylist_counter_proposal: {
      title: 'Tự Do Thử Nghiệm Phụ Kiện Hoặc Tham Vấn Thêm Khi Có Kết Nối AI',
      solution:
        'Với các phụ kiện hoặc chi tiết nằm ngoài tập quy tắc cốt lõi, người mặc có thể tự do sáng tạo phối đồ hiện đại miễn sao bảo lưu nghiêm ngặt trục nhận diện cốt lõi của y phục (cổ áo, vạt áo, tay áo).',
      heritage_safeguard:
        'Bảo lưu nguyên tắc an toàn: Không suy đoán vi phạm khi chưa có căn cứ lịch sử xác thực.',
      contemporary_edge:
        'Khuyến khích thử nghiệm phụ kiện hiện đại phù hợp bối cảnh sử dụng đương đại.',
      materials_and_cuts: 'Lựa chọn chất liệu và phụ kiện hài hòa với tổng thể trang phục.',
    },
  };
}

/**
 * Helper to build an honest CulturalAuditResult grounded dynamically in CKB_REGISTRY.
 * Enforces Requirement 3 & 4:
 * - If historical sources are unverified/needs_review, status is 'Supported with Caution' with uncertainty_flag: true
 * - Prototype compliance ('compliant') and historical confidence are separated into distinct layers.
 */
function buildProposalAudit(
  evidenceIds: string[],
  mutablesInfo: { id?: string; evidence_id?: string; element: string; application: string }[] = [],
  customVerdict?: string
): CulturalAuditResult {
  const auditConf = deriveAuditConfidence(evidenceIds, false);
  const invariants_checked = evidenceIds
    .map((id) => getCKBEntry(id))
    .filter((e): e is NonNullable<typeof e> => e !== undefined && (e.category === 'invariant' || e.category === 'sacred_rule'))
    .map((e) => ({
      evidence_id: e.id,
      rule_name: e.title,
      passed: true,
      detail: `Tuân thủ quy ước prototype: ${e.core_rule}`,
    }));

  const mutables_used = mutablesInfo.map((m) => ({
    evidence_id: m.evidence_id || m.id || '',
    element: m.element,
    application: m.application,
  }));

  const isFullyVerified = !auditConf.hasUnverified;

  return {
    status: isFullyVerified ? 'Supported' : 'Supported with Caution',
    uncertainty_flag: !isFullyVerified,
    uncertainty_note: !isFullyVerified
      ? 'Bản thiết kế phù hợp với quy ước của prototype, tuy nhiên các quy tắc tham chiếu trong bản thử nghiệm hiện chưa được đối chiếu thư tịch độc lập.'
      : '',
    prototype_compliance: auditConf.prototype_compliance,
    historical_confidence: auditConf.historical_confidence,
    verification_summary: auditConf.verification_summary,
    evidence_ids: evidenceIds,
    invariants_checked,
    mutables_used,
    cautions_and_redlines: [],
    auditor_verdict:
      customVerdict ||
      (!isFullyVerified
        ? 'Bản thiết kế phù hợp với quy tắc của prototype trong bản thử nghiệm. Các nguồn lịch sử tham chiếu hiện chưa được xác minh độc lập.'
        : 'Thiết kế chuẩn mực theo quy thức y phục đã đối chiếu nguồn.'),
  };
}

/**
 * Generate deterministic fallback proposals for 100% CKB reliability
 */
export function generateDeterministicProposals(
  garment: string,
  context: string,
  style: string,
  dial: number
): OutfitProposal[] {
  const isNguThan = garment === 'ngu_than';
  const isAoTac = garment === 'ao_tac';

  if (isNguThan) {
    return [
      {
        id: 'prop-nguthan-heritage',
        plan_type: 'heritage_anchored',
        title: 'Áo Ngũ Thân Tay Chẽn Chàm Lam Cổ Điển',
        concept_tag: 'Heritage Anchored · Tinh Hoa Nguyên Bản',
        garment_type: 'ngu_than',
        dial_level: 1,
        visual_details: {
          collar_style: 'Cổ vuông đứng kín đáo, giữ phom nhận diện truyền thống',
          lapel_side: 'Hữu Nhậm (vạt trái đè lên vạt phải, cài khuy bên phải)',
          sleeve_style: 'Tay chẽn ôm thon dần về cổ tay, cử động linh hoạt',
          cut_length: 'Vạt dài qua đầu gối truyền thống, 5 thân đoan chính',
          fabric_materials: ['Lụa Vạn Phúc dệt vân cổ', 'Lót tơ tằm thoáng khí'],
          layering_pieces: ['Áo lót cánh trắng bên trong'],
          bottom_garment: 'Quần lụa thụng trắng hoặc đen truyền thống',
          footwear: 'Guốc mộc quai da hoặc giày da đen Oxford tối giản',
          accessories: ['Khăn xếp đen truyền thống', 'Thẻ ngọc / chuỗi hạt trầm'],
          color_palette: ['#1E293B (Chàm Đậm)', '#F8FAFC (Trắng Tơ)', '#D97706 (Hổ Phách)'],
        },
        audit: buildProposalAudit(
          ['KB-RULE-01', 'KB-RULE-02', 'KB-NGUTHAN-01', 'KB-NGUTHAN-02'],
          [],
          'Thiết kế bảo tồn cấu trúc theo quy ước prototype của Áo Ngũ Thân thời Nguyễn. Các nguồn lịch sử tham chiếu hiện chưa được xác minh độc lập trong bản thử nghiệm.'
        ),
        stylist_notes: {
          philosophy: 'Giữ nguyên tỉ lệ vàng của tiền nhân, tối giản hóa phụ kiện để tôn vinh sự kín đáo và đoan chính.',
          gen_z_tips: [
            'Phối cùng kính gọng kim loại thanh mảnh và túi xách tote vải canvas tối màu để tạo diện mạo tri thức.',
            'Giữ thẳng lưng khi bước đi để tà áo ngũ thân bay tự nhiên theo nhịp chuyển động.',
          ],
          occasions: ['Lễ Tết', 'Chụp ảnh văn hóa kỷ yếu', 'Hội thảo di sản trang trọng'],
        },
      },
      {
        id: 'prop-nguthan-remix',
        plan_type: 'contemporary_remix',
        title: 'Áo Ngũ Thân Indigo Denim Minimalist Cut',
        concept_tag: `Streetwear Hybrid · Dial Level ${dial || 3}`,
        garment_type: 'ngu_than',
        dial_level: dial || 3,
        visual_details: {
          collar_style: 'Cổ vuông đứng gọn, dựng mềm để phù hợp mặc thường ngày',
          lapel_side: 'Hữu Nhậm (vạt trái đè vạt phải, cài khuy bên phải theo quy ước prototype)',
          sleeve_style: 'Tay chẽn thon gọn với đường may đôi (twin needle stitch)',
          cut_length: 'Vạt cách tân lửng ngang hông (midi-cut) hiện đại',
          fabric_materials: ['Raw Selvedge Denim 11oz', 'Sợi cotton dệt chéo thoáng'],
          layering_pieces: ['Áo thun trắng organic cotton cổ tròn bên trong'],
          bottom_garment: 'Quần tây cạp cao ống suông rộng (Wide-leg pleated trousers)',
          footwear: 'Chunky leather loafers hoặc platform Derby shoes',
          accessories: ['Túi đeo chéo da thuộc tối giản', 'Kính mắt gọng vuông đen'],
          color_palette: ['#172554 (Indigo Xanh Thẫm)', '#F1F5F9 (Trắng Ngà)', '#475569 (Xám Kaki)'],
        },
        audit: buildProposalAudit(
          ['KB-RULE-01', 'KB-NGUTHAN-01', 'KB-NGUTHAN-02', 'KB-NGUTHAN-03'],
          [
            {
              evidence_id: 'KB-NGUTHAN-03',
              element: 'Chất liệu Denim & Chiều dài vạt',
              application: 'Ứng dụng chất liệu denim hiện đại và rút ngắn vạt áo trong vùng Mutable cho phép',
            },
          ],
          'Biến tấu hợp thức: Khai thác chính xác vùng Mutable theo KB-NGUTHAN-03 (chất liệu denim, vạt lửng) đồng thời giữ nghiêm Invariants (Hữu nhậm & Cổ lập lĩnh). Phù hợp quy tắc prototype.'
        ),
        stylist_notes: {
          philosophy: 'Đưa di sản vào tủ đồ thường nhật của giới trẻ bằng cách kết hợp chất liệu bền vững hiện đại với hình khối y phục cổ.',
          gen_z_tips: [
            'Có thể mở 2 khuy dưới khi ngồi làm việc để tà áo thả nhẹ hai bên hông.',
            'Mix với tất dệt cao cổ tone-sur-tone và giày loafer đế bánh mì.',
          ],
          occasions: ['Dạo phố cuối tuần', 'Đi làm văn phòng sáng tạo', 'Triển lãm nghệ thuật đương đại'],
        },
      },
    ];
  } else if (isAoTac) {
    return [
      {
        id: 'prop-aotac-heritage',
        plan_type: 'heritage_anchored',
        title: 'Áo Tấc Gấm Hoa Văn Thụ Nhã Cung Đình',
        concept_tag: 'Heritage Anchored · Trang Nghiêm Hoàng Triều',
        garment_type: 'ao_tac',
        dial_level: 1,
        visual_details: {
          collar_style: 'Cổ Lập Lĩnh đính khuy tơ tằm, viền cổ nghiêm trang',
          lapel_side: 'Hữu Nhậm (vạt trái đè lên vạt phải)',
          sleeve_style: 'Tay thụng rộng và dài buông thả tự nhiên theo gấu áo',
          cut_length: 'Vạt dài chạm bắp chân, kết cấu 5 thân rộng rãi',
          fabric_materials: ['Gấm dệt vân hoa mai', 'Lót lụa tơ tằm mềm'],
          layering_pieces: ['Áo lót cánh màu nguyệt bạch'],
          bottom_garment: 'Quần lụa trắng suông rộng xếp ly mềm',
          footwear: 'Hài thêu hoa văn cung đình hoặc giày da cổ điển',
          accessories: ['Khăn đóng quấn tỉ mỉ', 'Quạt xếp nan trúc'],
          color_palette: ['#065F46 (Xanh Ngọc Bích)', '#FEF3C7 (Vàng Nhạt)', '#FFFFFF (Trắng Nguyệt Bạch)'],
        },
        audit: buildProposalAudit(
          ['KB-RULE-01', 'KB-RULE-02', 'KB-TAC-01', 'KB-TAC-02'],
          [],
          'Thiết kế nguyên bản chuẩn mực lễ phục Áo Tấc theo quy ước prototype. Các nguồn lịch sử tham chiếu hiện chưa được xác minh độc lập trong bản thử nghiệm.'
        ),
        stylist_notes: {
          philosophy: 'Tôn trọng toàn diện giá trị lễ nghi của y phục truyền thống trang trọng bậc nhất.',
          gen_z_tips: ['Giữ động tác chắp tay bái lễ khi diện Áo Tấc để hai ống tay thụng phủ đều sang hai bên.'],
          occasions: ['Hỷ sự', 'Lễ hội Đền Hùng / Festival Huế', 'Chụp ảnh cưới văn hóa'],
        },
      },
      {
        id: 'prop-aotac-remix',
        plan_type: 'contemporary_remix',
        title: 'Áo Tấc Duster Coat Mở Tà Sartorial Layer',
        concept_tag: `Avant-Garde Layering · Dial Level ${dial || 4}`,
        garment_type: 'ao_tac',
        dial_level: dial || 4,
        visual_details: {
          collar_style: 'Cổ Lập Lĩnh dựng đứng thanh thoát, giữ khuy đồng cài hờ',
          lapel_side: 'Hữu Nhậm khi đóng; cho phép mở khuy tạo phom duster coat',
          sleeve_style: 'Tay thụng rộng và dài buông thả trang trọng',
          cut_length: 'Áo khoác dáng dài bay bổng qua bắp chân',
          fabric_materials: ['Vải dạ mỏng Wool-blend cao cấp', 'Lớp lót Habotai trượt mịn'],
          layering_pieces: ['Áo cổ lọ đen mỏng ôm sát (Turtleneck knitwear)'],
          bottom_garment: 'Quần tây ống suông xếp ly cạp cao (Tailored Wide Trousers)',
          footwear: 'Chelsea boots da bóng mũi nhọn hoặc chunky sole boots',
          accessories: ['Kính râm gọng oval kim loại', 'Túi clutch cầm tay tối giản'],
          color_palette: ['#0F172A (Đen Mực)', '#B45309 (Hổ Phách Sậm)', '#94A3B8 (Xám Bạc)'],
        },
        audit: buildProposalAudit(
          ['KB-TAC-01', 'KB-TAC-02', 'KB-TAC-03'],
          [
            {
              evidence_id: 'KB-TAC-03',
              element: 'Mở khuy mặc dạng Duster Coat & Chất liệu Dạ mỏng',
              application: 'Khai thác điều khoản Mutable KB-TAC-03 cho phép mở vạt tạo dáng áo khoác dài thời thượng',
            },
          ],
          'Ứng dụng sáng tạo điều khoản Mutable KB-TAC-03 (mở vạt dạng áo khoác) nhưng vẫn nghiêm cẩn giữ ống tay thụng rộng dài. Phù hợp quy tắc prototype.'
        ),
        stylist_notes: {
          philosophy: 'Biến lễ phục Áo Tấc thành item thời trang dạo phố mang hơi thở Haute Couture quốc tế.',
          gen_z_tips: [
            'Bước đi với nhịp độ tự tin để tà áo duster coat bay nhẹ theo chuyển động.',
            'Giữ phụ kiện tối giản tuyệt đối (minimal accessories) để tập trung ánh nhìn vào form dáng áo.',
          ],
          occasions: ['Tuần lễ thời trang', 'Dự tiệc tối trang trọng', 'Sự kiện văn hóa nghệ thuật'],
        },
      },
    ];
  } else {
    // nhat_binh
    return [
      {
        id: 'prop-nhatbinh-heritage',
        plan_type: 'heritage_anchored',
        title: 'Áo Nhật Bình Hoàng Triều Gấm Thêu Ngũ Sắc',
        concept_tag: 'Heritage Anchored · Quý Tộc Cung Đình',
        garment_type: 'nhat_binh',
        dial_level: 1,
        visual_details: {
          collar_style: 'Nẹp cổ to bản hình chữ nhật đối khâm, thêu hoa văn ngũ phúc',
          lapel_side: 'Đối khâm (hai vạt song song), có dải lụa buộc cố định trước ngực',
          sleeve_style: 'Tay thụng viền dải ngũ hành theo phẩm cấp tham chiếu (ngoại lệ ở bậc Hoàng hậu)',
          cut_length: 'Vạt dài qua đầu gối, xẻ tà hai bên hông quý phái',
          fabric_materials: ['Gấm Sa thêu chỉ tơ', 'Lót lụa tơ tằm dệt hoa'],
          layering_pieces: ['Áo lót cánh màu trắng hoặc vàng nhạt'],
          bottom_garment: 'Quần lụa trắng hoặc chân váy xòe truyền thống',
          footwear: 'Hài thêu cung đình hoặc guốc mộc sơn son dát vàng',
          accessories: ['Khăn vành quấn đầu màu lam/tía', 'Trâm cài tóc khảm xà cừ'],
          color_palette: ['#991B1B (Đỏ Son)', '#F59E0B (Vàng Hoàng Yến)', '#047857 (Xanh Ngọc Lam)'],
        },
        audit: buildProposalAudit(
          ['KB-NHATBINH-01', 'KB-NHATBINH-02'],
          [],
          'Thiết kế Nhật Bình bám sát tham chiếu theo quy ước prototype, bảo toàn nẹp cổ đối khâm bất biến KB-NHATBINH-01 và dải ngũ hành tham chiếu theo phẩm cấp KB-NHATBINH-02 (lưu ý ngoại lệ Hoàng hậu). Nguồn tham chiếu ở mức needs_review.'
        ),
        stylist_notes: {
          philosophy: 'Gìn giữ vẻ đẹp đài các, chuẩn mực của y phục cung tần mệnh phụ triều Nguyễn.',
          gen_z_tips: ['Giữ tóc bới cao gọn gàng để lộ trọn vẹn nẹp cổ đối khâm thêu hoa văn.'],
          occasions: ['Lễ cưới truyền thống', 'Festival di sản', 'Chụp ảnh nghệ thuật cổ phục'],
        },
      },
      {
        id: 'prop-nhatbinh-remix',
        plan_type: 'contemporary_remix',
        title: 'Áo Nhật Bình Mở Tà Phối Chân Váy Xếp Ly Ngà',
        concept_tag: `Neo-Chic Editorial · Dial Level ${dial || 3}`,
        garment_type: 'nhat_binh',
        dial_level: dial || 3,
        visual_details: {
          collar_style: 'Nẹp cổ to bản đối khâm hình chữ nhật chuẩn mực, dây buộc ngực lụa đen',
          lapel_side: 'Đối khâm mặc mở tà tạo phom cardigan quý phái đương đại',
          sleeve_style: 'Tay thụng phối dải viền ngũ hành tone muted theo phẩm cấp tham chiếu',
          cut_length: 'Áo lửng ngang hông (crop-length jacket) hoặc ngang đùi',
          fabric_materials: ['Vải dạ Tweed dệt sợi kim tuyến mảnh', 'Nẹp cổ lụa taffeta thêu chìm'],
          layering_pieces: ['Áo cúp ngực hoặc áo tank top lụa trắng ngà bên trong'],
          bottom_garment: 'Chân váy xếp ly dáng dài (Pleated Midi Skirt) màu kem tuyết',
          footwear: 'Giày Mary Jane da bóng đế cao hoặc bốt cổ lửng',
          accessories: ['Vòng cổ ngọc trai nước ngọt mini', 'Túi xách tay quai ngọc'],
          color_palette: ['#881337 (Đỏ Đô Velvet)', '#FFFBEB (Kem Tuyết)', '#312E81 (Chàm Tím)'],
        },
        audit: buildProposalAudit(
          ['KB-NHATBINH-01', 'KB-NHATBINH-02', 'KB-NHATBINH-03'],
          [
            {
              evidence_id: 'KB-NHATBINH-03',
              element: 'Mặc mở tà, phối chân váy xếp ly & chất liệu dạ Tweed',
              application: 'Thay thế quần lụa bằng chân váy xếp ly và cách tân chất liệu vải áo theo điều khoản Mutable KB-NHATBINH-03',
            },
          ],
          'Ứng dụng điều khoản KB-NHATBINH-03 linh hoạt: Bảo toàn nẹp cổ đối khâm bất biến KB-NHATBINH-01, chi tiết dải viền tay KB-NHATBINH-02 và phối cùng chân váy xếp ly hiện đại. Phù hợp quy tắc prototype.'
        ),
        stylist_notes: {
          philosophy: 'Tái định nghĩa Nhật Bình thành một chiếc áo khoác Haute Couture hiện đại, duyên dáng và kiêu sa.',
          gen_z_tips: [
            'Phối cùng chân váy xếp ly màu kem để tôn độ rủ của nẹp cổ đối khâm.',
            'Có thể mở buông dây buộc để áo tạo dáng khoác phóng khoáng.',
          ],
          occasions: ['Dự tiệc gala thời trang', 'Sự kiện triển lãm nghệ thuật', 'Dạo phố cuối tuần sang trọng'],
        },
      },
    ];
  }
}
