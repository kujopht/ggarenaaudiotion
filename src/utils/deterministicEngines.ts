import { OutfitProposal, WhatIfEvaluation } from '../types/vietphuc';

/**
 * Deterministic What-If Evaluator for Cultural Knowledge Base (CKB)
 * Accurately models Invariants & Mutables with rigorous contextual matching,
 * negation handling, and clear fallback boundary reporting.
 */
export function evaluateWhatIfDeterministic(
  garment: string,
  query: string,
  current_outfit?: any
): WhatIfEvaluation {
  const rawQuery = query || '';
  const q = rawQuery.toLowerCase().trim();
  const effectiveGarment = current_outfit?.garment_type || garment || 'ngu_than';
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
  // Scope: Only applies to overlapping lapel garments (ngu_than, ao_tac).
  // Áo Nhật Bình is Đối Khâm (parallel front lapels), not Hữu Nhậm.
  // Must NOT trigger for accessories on the left (bags, watches, bows, etc.)
  // --------------------------------------------------------------------------
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
    effectiveGarment !== 'nhat_binh' &&
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
    return {
      query: rawQuery,
      target_garment: effectiveGarment,
      proposed_change: 'Đổi vạt áo và cài khuy sang bên trái (Tả nhậm)',
      status: 'Supported with Caution',
      uncertainty_flag: false,
      impact_analysis:
        outfitNote +
        'Đổi vạt sang cài bên trái là vi phạm quy ước cấu trúc cốt lõi theo KB-RULE-01 (áp dụng cho Áo Ngũ Thân và Áo Tấc). Trong tập quán y phục Á Đông và ghi nhận hiện vật thời Nguyễn, tả nhậm là quy thức cài áo thường liên quan y phục tang ma của người quá cố, khuyến cáo tránh dùng trên trang phục thường nhật.',
      violates_invariants: true,
      violated_evidence_ids: ['KB-RULE-01'],
      applicable_evidence_ids: ['KB-RULE-01'],
      cautions_and_redlines: [
        'LƯU Ý QUY THỨC [KB-RULE-01]: Quy thức Hữu nhậm (vạt trái đè vạt phải, khuy cài bên phải) là quy ước cấu trúc cốt lõi của Áo Ngũ Thân và Áo Tấc trong bản thử nghiệm. Khuyến cáo tránh cài vạt sang trái (Tả nhậm).',
      ],
      stylist_counter_proposal: {
        title: 'Bảo lưu Hữu Nhậm với Cúc Bấm Kim Loại Hiện Đại Cho Người Thuận Tay Trái',
        solution:
          'Vẫn giữ đúng quy thức Hữu nhậm (vạt trái đè vạt phải, khuy bên phải), nhưng ứng dụng hệ thống khóa bấm kim loại từ tính (magnetic snap buttons) hoặc khóa kéo ẩn bên hông phải để người thuận tay trái thao tác đóng mở nhanh trong 1 giây.',
        heritage_safeguard:
          'Bảo vệ nguyên vẹn cấu trúc Hữu nhậm truyền thống, tránh nguy cơ đồng nhất với y phục tang lễ.',
        contemporary_edge:
          'Ứng dụng công nghệ phụ liệu may mặc công thái học hiện đại cho người thuận tay trái.',
        materials_and_cuts: 'Raw denim hoặc linen cao cấp đính khuy nam châm chìm bên phải.',
      },
    };
  }

  // --------------------------------------------------------------------------
  // Rule 2: Five-Claw Dragon Motif (Rồng 5 móng / Ngũ trảo) - KB-RULE-03
  // REDLINE: Only for genuine 5-claw dragon on civilian outfits
  // --------------------------------------------------------------------------
  const isDragonProposal =
    !hasNegation(q) &&
    (q.includes('rồng 5 móng') ||
      q.includes('rồng năm móng') ||
      q.includes('ngũ trảo long') ||
      q.includes('ngũ trảo') ||
      (q.includes('rồng') && q.includes('5 móng')));

  if (isDragonProposal) {
    return {
      query: rawQuery,
      target_garment: effectiveGarment,
      proposed_change: 'Thêu họa tiết Rồng 5 móng lên y phục dân dụng',
      status: 'Supported with Caution',
      uncertainty_flag: false,
      impact_analysis:
        outfitNote +
        'Họa tiết Rồng 5 móng (ngũ trảo long) là biểu tượng tối thượng của Hoàng quyền thời Nguyễn, chỉ dành độc quyền cho Hoàng đế (Long bào). Việc đưa họa tiết này vào trang phục dạo phố, casual, tiệc cưới dân sự vi phạm trực tiếp KB-RULE-03.',
      violates_invariants: true,
      violated_evidence_ids: ['KB-RULE-03'],
      applicable_evidence_ids: ['KB-RULE-03'],
      cautions_and_redlines: [
        'REDLINE CẤM KỴ [KB-RULE-03]: Họa tiết Rồng 5 móng chỉ dành riêng cho Hoàng đế thời Nguyễn. Tuyệt đối không đưa vào trang phục dân dụng, dạo phố, casual.',
      ],
      stylist_counter_proposal: {
        title: 'Chuyển Hướng Sang Họa Tiết Rồng 4 Móng, Giao Long Hoặc Mây Sấm Bát Bửu Dân Gian',
        solution:
          'Thay thế rồng 5 móng bằng họa tiết Rồng 4 móng (tứ trảo long - dùng cho vương thân), Giao long cách điệu hình học, hoặc đồ án Mây sấm (Vân lôi), Hoa chanh, Bát bửu dân gian đương đại.',
        heritage_safeguard:
          'Tránh hoàn toàn lỗi tiếm phạm hoàng quyền, tôn trọng thứ bậc lễ chế triều đại Nguyễn.',
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
  const isCuffFiveColorsProposal =
    !hasNegation(q) &&
    (effectiveGarment === 'nhat_binh' || q.includes('nhật bình')) &&
    (q.includes('cổ tay') || q.includes('viền tay') || q.includes('ngũ sắc') || q.includes('dải màu ngũ hành')) &&
    (q.includes('đổi') || q.includes('thay') || q.includes('bỏ') || q.includes('đảo') || q.includes('màu') || q.includes('viền'));

  if (isCuffFiveColorsProposal) {
    return {
      query: rawQuery,
      target_garment: 'nhat_binh',
      proposed_change: 'Bỏ hoặc thay đổi màu dải ngũ sắc ở cổ tay Áo Nhật Bình',
      status: 'Supported with Caution',
      uncertainty_flag: false,
      impact_analysis:
        outfitNote +
        'Dải ngũ sắc viền cổ tay áo Nhật Bình tượng trưng cho Ngũ hành (Kim - Mộc - Thủy - Hỏa - Thổ) và Ngũ thường, là nhận diện cốt lõi theo KB-NHATBINH-02 trong bản thử nghiệm. Bản thử nghiệm lưu ý không đảo lộn hoặc loại bỏ tùy tiện.',
      violates_invariants: true,
      violated_evidence_ids: ['KB-NHATBINH-02'],
      applicable_evidence_ids: ['KB-NHATBINH-02'],
      cautions_and_redlines: [
        'LƯU Ý NHẬN DIỆN [KB-NHATBINH-02]: Dải màu ngũ hành/ngũ thường ở viền tay áo mang tính nhận diện biểu tượng theo quy ước của bản thử nghiệm. Tránh đảo lộn hoặc loại bỏ tùy tiện.',
      ],
      stylist_counter_proposal: {
        title: 'Giữ Thứ Tự Ngũ Sắc Nhưng Chuyển Sang Bảng Màu Muted Hoặc Pastel Tinh Tế',
        solution:
          'Vẫn giữ đúng 5 dải màu theo đúng trật tự ngũ hành, nhưng gia giảm độ bão hòa (desaturated) sang tông màu nhã nhặn hiện đại (muted tones) hoặc dệt chìm bằng sợi tơ mờ trên nền cổ tay áo.',
        heritage_safeguard:
          'Bảo toàn nguyên tắc ngũ hành và thứ tự dải màu nhận diện bất biến của Nhật Bình.',
        contemporary_edge:
          'Hài hòa thị giác với các phong cách tối giản và pastel hiện đại.',
        materials_and_cuts: 'Chất liệu lụa tơ tằm dệt chìm hoặc chỉ thêu phối màu chuyển tiếp tinh tế.',
      },
    };
  }

  // --------------------------------------------------------------------------
  // Rule 4: Standing Collar Alteration (Cổ Lập Lĩnh) - KB-NGUTHAN-01
  // Applicable only to Áo Ngũ Thân (and Áo Tấc).
  // CRITICAL: Must NOT match "cổ tay"! If "cổ" only appears as part of "cổ tay", ignore!
  // --------------------------------------------------------------------------
  // Strip out occurrences of "cổ tay" to inspect true collar mentions
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
    return {
      query: rawQuery,
      target_garment: 'ngu_than',
      proposed_change: 'Thay đổi cổ áo Lập Lĩnh thành cổ bẻ / cổ vest / cổ khoét sâu',
      status: 'Supported with Caution',
      uncertainty_flag: false,
      impact_analysis:
        outfitNote +
        'Cổ Lập Lĩnh cao 4-5cm ôm khít cổ với 1 cúc cổ cố định là đặc trưng nhận diện cốt lõi của Áo Ngũ Thân trong bản thử nghiệm (KB-NGUTHAN-01). Nếu thay bằng cổ vest hoặc khoét cổ sâu sẽ làm mất nhận diện truyền thống của Áo Ngũ Thân.',
      violates_invariants: true,
      violated_evidence_ids: ['KB-NGUTHAN-01'],
      applicable_evidence_ids: ['KB-NGUTHAN-01'],
      cautions_and_redlines: [
        'LƯU Ý NHẬN DIỆN [KB-NGUTHAN-01]: Cổ đứng cao 4-5cm ôm khít cổ, có 1 khuy cài cổ cố định là đặc trưng nhận diện cốt lõi của Áo Ngũ Thân tay chẽn trong bản thử nghiệm.',
      ],
      stylist_counter_proposal: {
        title: 'Giữ Cổ Lập Lĩnh Nhưng Mở Cúc Cổ Khi Dạo Phố Hoặc Hạ Cổ Xuống 4.0cm Thoáng Mát',
        solution:
          'Vẫn may cổ Lập Lĩnh chuẩn 4cm nhưng dùng chất liệu dựng cổ (interlining) mềm mại, hoặc thiết kế cúc cổ có thể mở ra khi dạo phố để lật ve nhẹ, nhưng khi cài lại lập tức trở về phom lập lĩnh đoan chính.',
        heritage_safeguard:
          'Giữ trọn vẹn kết cấu nhận diện bất biến của cổ lập lĩnh thời Nguyễn.',
        contemporary_edge:
          'Tạo cảm giác thoải mái tối đa cho ngày hè nhiệt đới mà không phá vỡ cấu trúc.',
        materials_and_cuts: 'Chất liệu linen pha lụa tơ tằm với mex dựng cổ mềm.',
      },
    };
  }

  // --------------------------------------------------------------------------
  // Rule 5: Áo Tấc Duster Coat Layering - KB-TAC-03
  // --------------------------------------------------------------------------
  const isAoTacDusterProposal =
    !hasNegation(q) &&
    (effectiveGarment === 'ao_tac' || q.includes('áo tấc')) &&
    (q.includes('duster coat') ||
      q.includes('áo khoác') ||
      q.includes('mở cúc áo tấc') ||
      q.includes('mở khuy áo tấc') ||
      (q.includes('mở tà') && q.includes('khoác')));

  if (isAoTacDusterProposal) {
    return {
      query: rawQuery,
      target_garment: 'ao_tac',
      proposed_change: 'Mở khuy áo Tấc mặc làm áo khoác dáng dài (duster coat) hiện đại',
      status: 'Supported',
      uncertainty_flag: false,
      impact_analysis:
        outfitNote +
        'Hoàn toàn hợp lệ! Theo KB-TAC-03, Áo Tấc cho phép cởi mở khuy áo phía trước để tạo layer dạng áo khoác dáng dài (duster coat) hiện đại, phối với quần và giày hiện đại, miễn là ống tay thụng chữ nhật vẫn được bảo toàn (KB-TAC-01).',
      violates_invariants: false,
      violated_evidence_ids: [],
      applicable_evidence_ids: ['KB-TAC-01', 'KB-TAC-03'],
      cautions_and_redlines: [],
      stylist_counter_proposal: {
        title: 'Phối Áo Tấc Duster Coat Với All-Black Turtleneck & Pleated Trousers',
        solution:
          'Mặc buông 2 vạt áo Tấc tự nhiên, bên trong phối áo thun/len cổ lọ màu đen ôm sát và quần âu xếp ly ống rộng, kết hợp bốt da cao cổ.',
        heritage_safeguard:
          'Bảo lưu trọn vẹn ống tay thụng hình chữ nhật buông dài qua ngón tay theo KB-TAC-01.',
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
    'Yêu cầu thử nghiệm này chưa có đủ dữ liệu quy tắc đối sánh trong bộ suy luận dự phòng ngoại tuyến. Chế độ dự phòng chỉ thẩm định các Invariant/Mutable cốt lõi đã được số hóa cứng (Hữu nhậm, Cổ Lập Lĩnh, Cổ tay ngũ sắc, Rồng 5 móng, Áo Tấc duster coat). Không phát hiện xung đột với các quy tắc hiện có trong CKB. Bộ quy tắc hiện tại chưa có đủ dữ liệu để kết luận sâu hơn đối với các chi tiết nằm ngoài tập quy tắc đã số hóa.';

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
          collar_style: 'Cổ Lập Lĩnh cao 4.5cm ôm sát cổ, 1 khuy cài cổ cố định',
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
        audit: {
          status: 'Supported',
          uncertainty_flag: false,
          uncertainty_note: '',
          evidence_ids: ['KB-RULE-01', 'KB-RULE-02', 'KB-NGUTHAN-01', 'KB-NGUTHAN-02'],
          invariants_checked: [
            { evidence_id: 'KB-RULE-01', rule_name: 'Quy thức Hữu nhậm', passed: true, detail: 'Vạt trái đè vạt phải, cài khuy bên phải hoàn toàn chuẩn mực' },
            { evidence_id: 'KB-RULE-02', rule_name: 'Cấu trúc Ngũ thân', passed: true, detail: 'Đủ 5 thân tượng trưng tứ thân phụ mẫu che chở' },
            { evidence_id: 'KB-NGUTHAN-01', rule_name: 'Cổ Lập lĩnh 4-5cm', passed: true, detail: 'Cổ đứng 4.5cm ôm khít, có 1 khuy cài cổ cố định' },
            { evidence_id: 'KB-NGUTHAN-02', rule_name: 'Ống tay chẽn', passed: true, detail: 'Ống tay thu nhỏ gọn gàng về cổ tay' },
          ],
          mutables_used: [],
          cautions_and_redlines: [],
          auditor_verdict: 'Thiết kế bảo tồn toàn vẹn cấu trúc cốt lõi của Áo Ngũ Thân thời Nguyễn. Hoàn toàn tuân thủ các Invariants của CKB.',
        },
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
          collar_style: 'Cổ Lập Lĩnh cao 4.2cm ôm khít cổ, đính khuy đồng thau đúc',
          lapel_side: 'Hữu Nhậm (vạt trái đè vạt phải, khuy bên phải bất biến)',
          sleeve_style: 'Tay chẽn thon gọn với đường may đôi (twin needle stitch)',
          cut_length: 'Vạt cách tân lửng ngang hông (midi-cut) hiện đại',
          fabric_materials: ['Raw Selvedge Denim 11oz', 'Sợi cotton dệt chéo thoáng'],
          layering_pieces: ['Áo thun trắng organic cotton cổ tròn bên trong'],
          bottom_garment: 'Quần tây cạp cao ống suông rộng (Wide-leg pleated trousers)',
          footwear: 'Chunky leather loafers hoặc platform Derby shoes',
          accessories: ['Túi đeo chéo da thuộc tối giản', 'Kính mắt gọng vuông đen'],
          color_palette: ['#172554 (Indigo Xanh Thẫm)', '#F1F5F9 (Trắng Ngà)', '#475569 (Xám Kaki)'],
        },
        audit: {
          status: 'Supported',
          uncertainty_flag: false,
          uncertainty_note: '',
          evidence_ids: ['KB-RULE-01', 'KB-NGUTHAN-01', 'KB-NGUTHAN-02', 'KB-NGUTHAN-03'],
          invariants_checked: [
            { evidence_id: 'KB-RULE-01', rule_name: 'Quy thức Hữu nhậm', passed: true, detail: 'Bảo lưu tuyệt đối vạt trái đè vạt phải và cài khuy bên phải' },
            { evidence_id: 'KB-NGUTHAN-01', rule_name: 'Cổ Lập lĩnh', passed: true, detail: 'Duy trì cổ đứng 4.2cm ôm sát cổ với 1 cúc cổ định vị' },
            { evidence_id: 'KB-NGUTHAN-02', rule_name: 'Ống tay chẽn', passed: true, detail: 'Giữ cấu trúc ống tay ôm thon cử động thuận tiện' },
          ],
          mutables_used: [
            { evidence_id: 'KB-NGUTHAN-03', element: 'Chất liệu Denim & Chiều dài vạt', application: 'Ứng dụng chất liệu denim hiện đại và rút ngắn vạt áo trong vùng Mutable cho phép' },
          ],
          cautions_and_redlines: [],
          auditor_verdict: 'Biến tấu hợp thức: Khai thác chính xác vùng Mutable theo KB-NGUTHAN-03 (chất liệu denim, vạt lửng) đồng thời giữ nghiêm Invariants (Hữu nhậm & Cổ lập lĩnh). Đạt trạng thái Supported.',
        },
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
          sleeve_style: 'Tay thụng chữ nhật rộng, thả xuôi dài qua ngón tay',
          cut_length: 'Vạt dài chạm bắp chân, kết cấu 5 thân rộng rãi',
          fabric_materials: ['Gấm dệt vân hoa mai', 'Lót lụa tơ tằm mềm'],
          layering_pieces: ['Áo lót cánh màu nguyệt bạch'],
          bottom_garment: 'Quần lụa trắng suông rộng xếp ly mềm',
          footwear: 'Hài thêu hoa văn cung đình hoặc giày da cổ điển',
          accessories: ['Khăn đóng quấn tỉ mỉ', 'Quạt xếp nan trúc'],
          color_palette: ['#065F46 (Xanh Ngọc Bích)', '#FEF3C7 (Vàng Nhạt)', '#FFFFFF (Trắng Nguyệt Bạch)'],
        },
        audit: {
          status: 'Supported',
          uncertainty_flag: false,
          uncertainty_note: '',
          evidence_ids: ['KB-RULE-01', 'KB-RULE-02', 'KB-TAC-01', 'KB-TAC-02'],
          invariants_checked: [
            { evidence_id: 'KB-RULE-01', rule_name: 'Hữu nhậm', passed: true, detail: 'Cài khuy bên phải chuẩn quy thức' },
            { evidence_id: 'KB-TAC-01', rule_name: 'Tay thụng chữ nhật', passed: true, detail: 'Ống tay thụng rộng hình chữ nhật qua ngón tay khi thả buông' },
            { evidence_id: 'KB-TAC-02', rule_name: 'Tính lễ nghi trang trọng', passed: true, detail: 'Giữ trọn tính nghiêm cẩn của lễ phục cung đình thời Nguyễn' },
          ],
          mutables_used: [],
          cautions_and_redlines: [],
          auditor_verdict: 'Thiết kế nguyên bản chuẩn mực lễ phục Áo Tấc thời Nguyễn. Đạt chuẩn Supported theo CKB.',
        },
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
          sleeve_style: 'Tay thụng chữ nhật buông dài vượt qua bàn tay bất biến',
          cut_length: 'Áo khoác dáng dài bay bổng qua bắp chân',
          fabric_materials: ['Vải dạ mỏng Wool-blend cao cấp', 'Lớp lót Habotai trượt mịn'],
          layering_pieces: ['Áo cổ lọ đen mỏng ôm sát (Turtleneck knitwear)'],
          bottom_garment: 'Quần tây ống suông xếp ly cạp cao (Tailored Wide Trousers)',
          footwear: 'Chelsea boots da bóng mũi nhọn hoặc chunky sole boots',
          accessories: ['Kính râm gọng oval kim loại', 'Túi clutch cầm tay tối giản'],
          color_palette: ['#0F172A (Đen Mực)', '#B45309 (Hổ Phách Sậm)', '#94A3B8 (Xám Bạc)'],
        },
        audit: {
          status: 'Supported',
          uncertainty_flag: false,
          uncertainty_note: '',
          evidence_ids: ['KB-TAC-01', 'KB-TAC-02', 'KB-TAC-03'],
          invariants_checked: [
            { evidence_id: 'KB-TAC-01', rule_name: 'Ống tay thụng chữ nhật', passed: true, detail: 'Duy trì chuẩn xác tay thụng rộng buông dài qua ngón tay' },
            { evidence_id: 'KB-TAC-02', rule_name: 'Tính lễ nghi thân trên', passed: true, detail: 'Lớp layer cổ lọ bên trong bảo toàn sự kín đáo, đoan trang thân trên' },
          ],
          mutables_used: [
            { evidence_id: 'KB-TAC-03', element: 'Mở khuy mặc dạng Duster Coat & Chất liệu Dạ mỏng', application: 'Khai thác điều khoản Mutable KB-TAC-03 cho phép mở vạt tạo dáng áo khoác dài thời thượng' },
          ],
          cautions_and_redlines: [],
          auditor_verdict: 'Ứng dụng sáng tạo điều khoản Mutable KB-TAC-03 (mở vạt dạng áo khoác) nhưng vẫn nghiêm cẩn giữ ống tay thụng qua ngón tay. Đạt trạng thái Supported.',
        },
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
          sleeve_style: 'Tay thụng viền ngũ sắc ngũ hành (Kim - Mộc - Thủy - Hỏa - Thổ)',
          cut_length: 'Vạt dài qua đầu gối, xẻ tà hai bên hông quý phái',
          fabric_materials: ['Gấm Sa thêu chỉ tơ', 'Lót lụa tơ tằm dệt hoa'],
          layering_pieces: ['Áo lót cánh màu trắng hoặc vàng nhạt'],
          bottom_garment: 'Quần lụa trắng hoặc chân váy xòe truyền thống',
          footwear: 'Hài thêu cung đình hoặc guốc mộc sơn son dát vàng',
          accessories: ['Khăn vành quấn đầu màu lam/tía', 'Trâm cài tóc khảm xà cừ'],
          color_palette: ['#991B1B (Đỏ Son)', '#F59E0B (Vàng Hoàng Yến)', '#047857 (Xanh Ngọc Lam)'],
        },
        audit: {
          status: 'Supported',
          uncertainty_flag: false,
          uncertainty_note: '',
          evidence_ids: ['KB-NHATBINH-01', 'KB-NHATBINH-02'],
          invariants_checked: [
            { evidence_id: 'KB-NHATBINH-01', rule_name: 'Nẹp cổ đối khâm chữ nhật', passed: true, detail: 'Nẹp cổ to bản chạy dọc song song từ cổ xuống ngực đặc trưng và có dây buộc ngực' },
            { evidence_id: 'KB-NHATBINH-02', rule_name: 'Cổ tay ngũ sắc', passed: true, detail: 'Giữ nguyên vẹn thứ tự và nhận diện của dải màu ngũ hành ở viền tay' },
          ],
          mutables_used: [],
          cautions_and_redlines: [],
          auditor_verdict: 'Thiết kế Nhật Bình mẫu mực, tuân thủ nghiêm ngặt 2 Invariants bất biến cốt lõi KB-NHATBINH-01 và KB-NHATBINH-02. Trạng thái: Supported.',
        },
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
          sleeve_style: 'Tay thụng giữ trọn dải màu viền cổ tay ngũ sắc nguyên bản',
          cut_length: 'Áo lửng ngang hông (crop-length jacket) hoặc ngang đùi',
          fabric_materials: ['Vải dạ Tweed dệt sợi kim tuyến mảnh', 'Nẹp cổ lụa taffeta thêu chìm'],
          layering_pieces: ['Áo cúp ngực hoặc áo tank top lụa trắng ngà bên trong'],
          bottom_garment: 'Chân váy xếp ly dáng dài (Pleated Midi Skirt) màu kem tuyết',
          footwear: 'Giày Mary Jane da bóng đế cao hoặc bốt cổ lửng',
          accessories: ['Vòng cổ ngọc trai nước ngọt mini', 'Túi xách tay quai ngọc'],
          color_palette: ['#881337 (Đỏ Đô Velvet)', '#FFFBEB (Kem Tuyết)', '#312E81 (Chàm Tím)'],
        },
        audit: {
          status: 'Supported',
          uncertainty_flag: false,
          uncertainty_note: '',
          evidence_ids: ['KB-NHATBINH-01', 'KB-NHATBINH-02', 'KB-NHATBINH-03'],
          invariants_checked: [
            { evidence_id: 'KB-NHATBINH-01', rule_name: 'Nẹp cổ đối khâm', passed: true, detail: 'Nẹp cổ to bản chữ nhật được may chuẩn xác, giữ dải buộc ngực' },
            { evidence_id: 'KB-NHATBINH-02', rule_name: 'Cổ tay ngũ sắc', passed: true, detail: 'Dải màu ngũ sắc ở cổ tay được giữ nguyên trật tự nhận diện' },
          ],
          mutables_used: [
            { evidence_id: 'KB-NHATBINH-03', element: 'Mặc mở tà, phối chân váy xếp ly & chất liệu dạ Tweed', application: 'Thay thế quần lụa bằng chân váy xếp ly và cách tân chất liệu vải áo theo điều khoản Mutable KB-NHATBINH-03' },
          ],
          cautions_and_redlines: [],
          auditor_verdict: 'Ứng dụng điều khoản KB-NHATBINH-03 xuất sắc: Giữ trọn 2 nhận diện bất biến (Nẹp đối khâm & Tay ngũ sắc) trong khi phối cùng chân váy xếp ly hiện đại. Đạt trạng thái Supported.',
        },
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
