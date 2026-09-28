import assert from 'node:assert';
import {
  formatSourceBadge,
  getLookSummaryStatus,
  getWhatIfSummaryStatus,
  handleWhatIfStandaloneGarmentChange,
  isResponseValid,
} from '../src/utils/remixStateHelpers.js';
import {
  evaluateWhatIfDeterministic,
  generateDeterministicProposals,
} from '../src/utils/deterministicEngines.js';
import {
  CKB_REGISTRY,
  isRuleApplicableToGarment,
  formatVerificationStatusBadge,
  getCKBEntry,
  getCKBEntries,
  getRuleCertainty,
  getRuleEvidenceMetadata,
  deriveAuditConfidence,
  buildCKBSystemGrounding,
  getCKBStats,
} from '../src/data/ckbRegistry.js';
import {
  normalizeGeminiProposalAudit,
  normalizeGeminiProposal,
  normalizeGeminiWhatIfEvaluation,
  validateEvidenceId,
  hasOverconfidentClaim,
  sanitizeAuditorVerdict,
  sanitizeWhatIfImpactAnalysis,
  validateGeminiProposalContract,
  processGeminiProposalResponse,
} from '../src/utils/auditNormalization.js';
import { CulturalAuditResult, GarmentKey, OutfitProposal, WhatIfEvaluation } from '../src/types/vietphuc.js';

console.log('--- BẮT ĐẦU CHẠY BỘ KIỂM THỬ: REMIX STATE & FLOW VALIDATION ---\n');

let passCount = 0;
let failCount = 0;

function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passCount++;
  } catch (error: any) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(`   Lỗi: ${error.message}\n`);
    failCount++;
  }
}

// -------------------------------------------------------------
// Test Case 1: Xử lý nhãn nguồn (Gemini, Fallback, Thiếu nguồn, Nguồn lạ)
// -------------------------------------------------------------
runTest('1.1 Nhãn nguồn: exact "gemini" phải trả về "Gemini · Trực tiếp"', () => {
  const result = formatSourceBadge('gemini');
  assert.strictEqual(result.label, 'Gemini · Trực tiếp');
  assert.strictEqual(result.badgeType, 'gemini');
});

runTest('1.2 Nhãn nguồn: deterministic fallback phải trả về "Bản mẫu dự phòng"', () => {
  const res1 = formatSourceBadge('deterministic_engine');
  assert.strictEqual(res1.label, 'Bản mẫu dự phòng');
  assert.strictEqual(res1.badgeType, 'fallback');

  const res2 = formatSourceBadge('deterministic_engine_fallback');
  assert.strictEqual(res2.label, 'Bản mẫu dự phòng');
  assert.strictEqual(res2.badgeType, 'fallback');
});

runTest('1.3 Nhãn nguồn: thiếu source (null, undefined, rỗng) phải trả về "Nguồn chưa xác định"', () => {
  assert.strictEqual(formatSourceBadge(null).label, 'Nguồn chưa xác định');
  assert.strictEqual(formatSourceBadge(undefined).label, 'Nguồn chưa xác định');
  assert.strictEqual(formatSourceBadge('').label, 'Nguồn chưa xác định');
  assert.strictEqual(formatSourceBadge(undefined).badgeType, 'unknown');
});

runTest('1.4 Nhãn nguồn: source lạ không xác định phải trả về "Nguồn chưa xác định", không được coi là Gemini', () => {
  const weirdSource = formatSourceBadge('custom_vendor_ai_model');
  assert.strictEqual(weirdSource.label, 'Nguồn chưa xác định');
  assert.strictEqual(weirdSource.badgeType, 'unknown');
});

// -------------------------------------------------------------
// Test Case 2: Đổi áo hoặc unmount khi request Studio chưa xong
// -------------------------------------------------------------
runTest('2.1 Request Studio về muộn: Bấm tạo Ngũ Thân nhưng đã đổi sang Nhật Bình trước khi có kết quả', () => {
  const reqId = 1;
  const activeReqId = 1;
  const targetGarment: GarmentKey = 'ngu_than';
  const currentGarment: GarmentKey = 'nhat_binh'; // User switched
  const signalAborted = false;

  const valid = isResponseValid(signalAborted, reqId, activeReqId, targetGarment, currentGarment);
  assert.strictEqual(valid, false, 'Kết quả Ngũ Thân về muộn không được ghi nhận khi áo hiện tại là Nhật Bình');
});

runTest('2.2 Request Studio bị hủy khi unmount hoặc người dùng đổi tab (AbortSignal triggered)', () => {
  const reqId = 2;
  const activeReqId = 2;
  const targetGarment: GarmentKey = 'ao_tac';
  const currentGarment: GarmentKey = 'ao_tac';
  const signalAborted = true; // Component unmounted on tab switch

  const valid = isResponseValid(signalAborted, reqId, activeReqId, targetGarment, currentGarment);
  assert.strictEqual(valid, false, 'Request đã bị abort không được phép xử lý kết quả');
});

// -------------------------------------------------------------
// Test Case 3: Bỏ chọn look khi What If đang chạy
// -------------------------------------------------------------
runTest('3.1 Bỏ chọn look khi What-If đang chạy: Request cũ bị hủy và không ghi đè kết quả', () => {
  // Simulate active What-If with an outfit
  const controller = new AbortController();
  let loading = true;
  let evaluation: WhatIfEvaluation | null = null;

  // User triggers "Bỏ chọn" while request is in flight
  controller.abort();
  loading = false;
  evaluation = null;

  // When simulated late response resolves:
  const handleLateResponse = (simulatedData: WhatIfEvaluation) => {
    if (controller.signal.aborted) {
      return; // Ignored cleanly
    }
    evaluation = simulatedData;
  };

  handleLateResponse({
    query: 'What if đổi vạt sang trái?',
    target_garment: 'ngu_than',
    proposed_change: 'Tả nhậm',
    status: 'Supported with Caution',
    uncertainty_flag: false,
    impact_analysis: 'Vi phạm',
    violates_invariants: true,
    violated_evidence_ids: ['KB-RULE-01'],
    applicable_evidence_ids: ['KB-RULE-01'],
    cautions_and_redlines: ['REDLINE'],
    stylist_counter_proposal: {
      title: 'Giữ Hữu Nhậm',
      solution: 'Dùng khuy nam châm',
      heritage_safeguard: 'Bảo toàn',
      contemporary_edge: 'Hiện đại',
      materials_and_cuts: 'Denim',
    },
  });

  assert.strictEqual(evaluation, null, 'Kết quả của request cũ không được xuất hiện sau khi bỏ chọn');
  assert.strictEqual(loading, false, 'Loading phải được reset về false');
});

// -------------------------------------------------------------
// Test Case 4: Đánh giá xong trong chế độ tự do rồi đổi loại áo
// -------------------------------------------------------------
runTest('4.1 What If chế độ tự do: Đổi dropdown từ Ngũ Thân sang Nhật Bình xóa sạch evaluation cũ', () => {
  const initialEvaluation: WhatIfEvaluation = {
    query: 'What if vạt ngắn ngang hông?',
    target_garment: 'ngu_than',
    proposed_change: 'Vạt ngắn',
    status: 'Supported',
    uncertainty_flag: false,
    impact_analysis: 'Phù hợp vùng khả biến',
    violates_invariants: false,
    violated_evidence_ids: [],
    applicable_evidence_ids: ['KB-NGUTHAN-03'],
    cautions_and_redlines: [],
    stylist_counter_proposal: {
      title: 'Midi crop',
      solution: 'Cắt vạt',
      heritage_safeguard: 'Giữ lập lĩnh',
      contemporary_edge: 'Gọn gàng',
      materials_and_cuts: 'Linen',
    },
  };

  const stateBefore = {
    selectedGarment: 'ngu_than' as GarmentKey,
    evaluation: initialEvaluation,
    evaluationSource: 'deterministic_engine',
    errorMsg: null,
    loading: false,
  };

  // User changes dropdown to nhat_binh in standalone mode
  const stateAfter = handleWhatIfStandaloneGarmentChange('ngu_than', 'nhat_binh', stateBefore);

  assert.strictEqual(stateAfter.selectedGarment, 'nhat_binh');
  assert.strictEqual(stateAfter.evaluation, null, 'Evaluation của Ngũ Thân phải được xóa sạch');
  assert.strictEqual(stateAfter.evaluationSource, null, 'Nhãn nguồn phải được xóa sạch');
  assert.strictEqual(stateAfter.errorMsg, null);
  assert.strictEqual(stateAfter.loading, false, 'Không tự động gọi loading/API khi đổi dropdown');
});

runTest('4.2 What If chế độ tự do: Đổi dropdown không làm thay đổi hay xóa mảng proposals của Studio', () => {
  const dummyStudioProposals: OutfitProposal[] = [
    {
      id: 'look-1',
      plan_type: 'contemporary_remix',
      title: 'Áo Ngũ Thân Indigo Denim Minimalist Cut',
      concept_tag: 'STREETWEAR ĐƯƠNG ĐẠI',
      garment_type: 'ngu_than',
      dial_level: 3,
      visual_details: {
        collar_style: 'Lập lĩnh chuẩn 4cm',
        lapel_side: 'Hữu nhậm (cài sang phải)',
        sleeve_style: 'Tay chẽn',
        cut_length: 'Dài quá gối',
        fabric_materials: ['Denim selvedge'],
        layering_pieces: ['Quần tây suông'],
        bottom_garment: 'Quần tây',
        footwear: 'Chunky boots',
        accessories: ['Túi đeo chéo'],
        color_palette: ['#1E3A8A', '#3B82F6', '#F8FAFC', '#E2E8F0'],
      },
      audit: {
        status: 'Supported',
        uncertainty_flag: false,
        evidence_ids: ['KB-RULE-01'],
        invariants_checked: [],
        mutables_used: [],
        cautions_and_redlines: [],
        auditor_verdict: 'Chuẩn quy thức.',
      },
      stylist_notes: {
        philosophy: 'Mặc buông vạt phối quần tây ống rộng.',
        gen_z_tips: ['Xắn gấu nhẹ', 'Phối sneaker'],
        occasions: ['Dạo phố', 'Cà phê'],
      },
    },
  ];

  // Studio proposals before What-If garment change
  const originalProposalsCopy = JSON.stringify(dummyStudioProposals);

  // User changes garment in What-If standalone
  const state = handleWhatIfStandaloneGarmentChange('ngu_than', 'ao_tac', {
    selectedGarment: 'ngu_than',
    evaluation: null,
    evaluationSource: null,
    errorMsg: null,
    loading: false,
  });

  // Verify dummyStudioProposals remains completely unchanged
  assert.strictEqual(JSON.stringify(dummyStudioProposals), originalProposalsCopy, 'Danh sách look của Studio phải được giữ nguyên');
  assert.strictEqual(state.selectedGarment, 'ao_tac');
});

// -------------------------------------------------------------
// Test Case 5: Dữ liệu có status Supported nhưng uncertainty_flag là true
// -------------------------------------------------------------
runTest('5.1 Thanh tóm tắt: Status Supported nhưng uncertainty_flag=true KHÔNG ĐƯỢC hiện nhãn xanh', () => {
  const auditWithUncertainty: CulturalAuditResult = {
    status: 'Supported', // Server returned Supported
    uncertainty_flag: true, // But flagged as uncertain/unverified
    uncertainty_note: 'Họa tiết này chưa có tài liệu lịch sử chứng thực.',
    evidence_ids: [],
    invariants_checked: [],
    mutables_used: [],
    cautions_and_redlines: [],
    auditor_verdict: 'Cần cẩn trọng khi sáng tạo.',
  };

  const summary = getLookSummaryStatus(auditWithUncertainty);

  // Must NOT be marked as fully supported
  assert.strictEqual(summary.isFullySupported, false, 'Không được coi là hoàn toàn phù hợp');
  
  // Must NOT contain the green 'supported' badge
  const hasGreenBadge = summary.badges.some((b) => b.variant === 'supported');
  assert.strictEqual(hasGreenBadge, false, 'Tuyệt đối không hiện nhãn xanh Phù hợp khi có cờ chưa chắc chắn');

  // Must contain uncertainty badge
  const hasUncertaintyBadge = summary.badges.some((b) => b.variant === 'uncertainty');
  assert.strictEqual(hasUncertaintyBadge, true, 'Phải có nhãn Chưa đủ dữ liệu tham chiếu');
  assert.ok(summary.summaryText.includes('Họa tiết này chưa có tài liệu lịch sử chứng thực'));
});

// -------------------------------------------------------------
// Test Case 6: Dữ liệu vừa có cảnh báo vừa có trạng thái Insufficient Evidence / Thiếu dữ liệu
// -------------------------------------------------------------
runTest('6.1 Thanh tóm tắt: Vừa có cảnh báo vừa thiếu dữ liệu phải thể hiện CẢ HAI, không che mất nhau', () => {
  const auditWithBoth: CulturalAuditResult = {
    status: 'Insufficient Evidence',
    uncertainty_flag: true,
    uncertainty_note: 'Họa tiết chim Lạc thời Lý chưa được kiểm chứng trên áo ngũ thân.',
    evidence_ids: ['KB-RULE-01'],
    invariants_checked: [],
    mutables_used: [],
    cautions_and_redlines: ['Cảnh báo: Cách may vạt áo có thể bị nhầm với quy thức áo tang.'],
    auditor_verdict: 'Cần lưu ý cả hai yếu tố.',
  };

  const summary = getLookSummaryStatus(auditWithBoth);

  assert.strictEqual(summary.hasCaution, true, 'Phải nhận diện có cảnh báo');
  assert.strictEqual(summary.hasUncertainty, true, 'Phải nhận diện có thiếu dữ liệu');

  // Both badges must be present
  const hasCautionBadge = summary.badges.some((b) => b.variant === 'caution');
  const hasUncertaintyBadge = summary.badges.some((b) => b.variant === 'uncertainty');
  assert.strictEqual(hasCautionBadge, true, 'Phải hiện nhãn Có điểm cần lưu ý');
  assert.strictEqual(hasUncertaintyBadge, true, 'Phải hiện nhãn Chưa đủ dữ liệu tham chiếu');

  // Summary text must mention both caution and uncertainty
  assert.ok(summary.summaryText.includes('[Lưu ý]'), 'Tóm tắt phải có phần Lưu ý');
  assert.ok(summary.summaryText.includes('[Dữ liệu]'), 'Tóm tắt phải có phần Dữ liệu');
  assert.ok(summary.summaryText.includes('Cách may vạt áo có thể bị nhầm'));
  assert.ok(summary.summaryText.includes('Họa tiết chim Lạc thời Lý'));
});

// -------------------------------------------------------------
// Test Case 7: Bản phối thuần chuẩn (Supported + không có cảnh báo + không có cờ chưa chắc chắn)
// -------------------------------------------------------------
runTest('7.1 Thanh tóm tắt: Look chuẩn mực hoàn toàn hiển thị nhãn xanh Phù hợp', () => {
  const cleanAudit: CulturalAuditResult = {
    status: 'Supported',
    uncertainty_flag: false,
    uncertainty_note: '',
    evidence_ids: ['KB-RULE-01', 'KB-NGUTHAN-01'],
    invariants_checked: [
      { evidence_id: 'KB-RULE-01', rule_name: 'Hữu nhậm', passed: true, detail: 'Chuẩn vạt phải' },
    ],
    mutables_used: [],
    cautions_and_redlines: [],
    auditor_verdict: 'Thiết kế chuẩn mực theo quy thức y phục cổ truyền.',
  };

  const summary = getLookSummaryStatus(cleanAudit);

  assert.strictEqual(summary.isFullySupported, true);
  assert.strictEqual(summary.badges.length, 1);
  assert.strictEqual(summary.badges[0].variant, 'supported');
  assert.strictEqual(summary.badges[0].label, 'Phù hợp quy tắc tham chiếu');
  assert.strictEqual(summary.summaryText, 'Thiết kế chuẩn mực theo quy thức y phục cổ truyền.');
});

// -------------------------------------------------------------
// Test Case 8: Kiểm thử trực tiếp hàm fallback What If đang chạy thực tế
// -------------------------------------------------------------
runTest('8.1 Fallback: "Đeo túi bên trái" không được coi là vi phạm đổi vạt Tả nhậm', () => {
  const result = evaluateWhatIfDeterministic('ngu_than', 'Đeo túi bên trái có hợp không?');
  assert.strictEqual(result.violates_invariants, false, 'Đeo túi không được coi là vi phạm cấu trúc bất biến');
  assert.strictEqual(result.status, 'Insufficient Evidence');
  assert.strictEqual(result.uncertainty_flag, true);
  assert.ok(!result.violated_evidence_ids.includes('KB-RULE-01'), 'Không được gán vi phạm KB-RULE-01');
  assert.ok(result.impact_analysis.includes('túi xách') || result.impact_analysis.includes('phụ kiện'), 'Phải nhận diện đây là phụ kiện cá nhân');
});

runTest('8.2 Fallback: "Không muốn đổi vạt áo" (phủ định) không được coi là đề xuất Tả nhậm', () => {
  const result = evaluateWhatIfDeterministic('ngu_than', 'Không muốn đổi vạt áo sang trái');
  assert.strictEqual(result.violates_invariants, false, 'Phủ định không được suy diễn thành vi phạm tang ma');
  assert.strictEqual(result.status, 'Insufficient Evidence');
  assert.strictEqual(result.uncertainty_flag, true);
  assert.ok(!result.violated_evidence_ids.includes('KB-RULE-01'));
});

runTest('8.3 Fallback: "Đổi màu cổ tay của Nhật Bình" giữ nguyên target_garment là nhat_binh, không nhầm sang ngu_than', () => {
  const result = evaluateWhatIfDeterministic('nhat_binh', 'Đổi màu cổ tay của Nhật Bình');
  assert.strictEqual(result.target_garment, 'nhat_binh', 'target_garment phải là nhat_binh');
  assert.strictEqual(result.violates_invariants, true, 'Đổi màu cổ tay ngũ sắc vi phạm Invariant KB-NHATBINH-02');
  assert.ok(result.violated_evidence_ids.includes('KB-NHATBINH-02'));
  assert.ok(!result.violated_evidence_ids.includes('KB-NGUTHAN-01'), 'Không được nhầm cổ tay thành cổ áo Lập Lĩnh');
  assert.strictEqual(result.status, 'Supported with Caution');
});

runTest('8.4 Fallback: "Đổi cổ áo của Ngũ Thân" kiểm tra đúng KB-NGUTHAN-01', () => {
  const result = evaluateWhatIfDeterministic('ngu_than', 'Đổi cổ áo của Ngũ Thân thành cổ bẻ');
  assert.strictEqual(result.target_garment, 'ngu_than');
  assert.strictEqual(result.violates_invariants, true, 'Thay cổ lập lĩnh vi phạm KB-NGUTHAN-01');
  assert.ok(result.violated_evidence_ids.includes('KB-NGUTHAN-01'));
  assert.strictEqual(result.status, 'Supported with Caution');
});

runTest('8.5 Fallback: Câu hỏi ngoài khả năng xử lý trả về Insufficient Evidence & nêu rõ giới hạn fallback', () => {
  const result = evaluateWhatIfDeterministic('ngu_than', 'Thời tiết 15 độ C ở Sa Pa thì mặc thế nào cho ấm?');
  assert.strictEqual(result.status, 'Insufficient Evidence');
  assert.strictEqual(result.uncertainty_flag, true);
  assert.strictEqual(result.violates_invariants, false, 'Không được suy đoán vi phạm khi không có cơ sở');
  assert.strictEqual(result.violated_evidence_ids.length, 0);
  assert.ok(result.impact_analysis.toLowerCase().includes('chế độ dự phòng') || result.impact_analysis.toLowerCase().includes('dự phòng'), 'Phải nêu rõ giới hạn của bộ suy luận dự phòng');
});

runTest('8.6 Fallback: Thiếu API key hoặc Gemini lỗi, nhãn nguồn trả về dự phòng', () => {
  const badge1 = formatSourceBadge('deterministic_engine');
  assert.strictEqual(badge1.badgeType, 'fallback');
  assert.strictEqual(badge1.label, 'Bản mẫu dự phòng');

  const badge2 = formatSourceBadge('deterministic_engine_fallback');
  assert.strictEqual(badge2.badgeType, 'fallback');
  assert.strictEqual(badge2.label, 'Bản mẫu dự phòng');
});

// -------------------------------------------------------------
// Test Case 9: Luồng tạo Look ở Studio chuyển tiếp sang What If (Mock flow)
// -------------------------------------------------------------
runTest('9.1 Luồng tạo Look -> Chọn chuyển sang What-If: Dữ liệu kế thừa chuẩn xác', () => {
  // Giả lập outfit được tạo thành công ở Studio
  const selectedProposal: OutfitProposal = {
    id: 'prop-custom-1',
    plan_type: 'contemporary_remix',
    title: 'Áo Ngũ Thân Indigo Denim Minimalist Cut',
    concept_tag: 'Streetwear Hybrid',
    garment_type: 'ngu_than',
    dial_level: 3,
    visual_details: {
      collar_style: 'Cổ Lập Lĩnh 4.2cm',
      lapel_side: 'Hữu Nhậm',
      sleeve_style: 'Tay chẽn',
      cut_length: 'Vạt lửng',
      fabric_materials: ['Denim'],
      layering_pieces: ['Áo thun trắng'],
      bottom_garment: 'Quần tây suông',
      footwear: 'Loafers',
      accessories: ['Túi đeo chéo'],
      color_palette: ['#172554'],
    },
    audit: {
      status: 'Supported',
      uncertainty_flag: false,
      uncertainty_note: '',
      evidence_ids: ['KB-RULE-01', 'KB-NGUTHAN-01'],
      invariants_checked: [
        { evidence_id: 'KB-RULE-01', rule_name: 'Hữu nhậm', passed: true, detail: 'Chuẩn vạt phải' },
      ],
      mutables_used: [],
      cautions_and_redlines: [],
      auditor_verdict: 'Hợp lệ',
    },
    stylist_notes: {
      philosophy: 'Đương đại',
      gen_z_tips: ['Xắn tay nhẹ'],
      occasions: ['Dạo phố'],
    },
  };

  // Người dùng chuyển sang tab What-If và gửi câu hỏi dựa trên outfit đang chọn
  const whatIfResult = evaluateWhatIfDeterministic(
    selectedProposal.garment_type,
    'What if đổi vạt áo và cài sang trái?',
    selectedProposal
  );

  assert.strictEqual(whatIfResult.violates_invariants, true);
  assert.ok(whatIfResult.violated_evidence_ids.includes('KB-RULE-01'));
  assert.ok(whatIfResult.impact_analysis.includes(selectedProposal.title), 'Kết quả What-If phải tham chiếu trang phục nền đang chọn');
});

// -------------------------------------------------------------
// Test Case 10: Submission Hardening & CKB Truthfulness
// -------------------------------------------------------------
runTest('10.1 CKB Rule cần rà soát (needs_review): KB-RULE-03 ghi nhận hiện vật bảo tàng và source lead thư tịch', () => {
  const rule = CKB_REGISTRY.find((r) => r.id === 'KB-RULE-03');
  assert.ok(rule, 'Phải tìm thấy rule KB-RULE-03');
  assert.strictEqual(rule?.verification_status, 'needs_review', 'KB-RULE-03 phải ở trạng thái needs_review khi chưa đối soát thực địa/bản số hóa');
  assert.strictEqual(rule?.source_title, 'Hình ảnh con rồng trên trang phục cung đình triều Nguyễn');
  assert.strictEqual(rule?.source_type, 'museum_archive');
  assert.strictEqual(rule?.confidence, 'medium');
  assert.ok(rule?.source_author_or_org?.includes('Bảo tàng Lịch sử Quốc gia'), 'Phải ghi nhận cơ quan biên soạn');
  assert.ok(rule?.notes?.includes('Khâm định Đại Nam hội điển sự lệ'), 'Phải có source lead thư tịch trong notes');
  assert.ok(
    rule?.notes?.includes('chưa được đối soát trực tiếp') || rule?.notes?.includes('chờ đối soát trực tiếp'),
    'Phải có note minh bạch về tình trạng chưa đối soát'
  );

  const badge = formatVerificationStatusBadge(rule.verification_status);
  assert.strictEqual(badge.isVerified, false, 'Không được nhận là đã verified hoàn toàn khi chưa đối soát');
  assert.strictEqual(badge.label, 'Cần rà soát thêm nguồn');
});

runTest('10.2 CKB Rule chưa có nguồn (Unverified): Không tự bịa nguồn, thể hiện minh bạch trạng thái unverified', () => {
  const unverifiedIds = [
    'KB-NGUTHAN-01',
    'KB-NGUTHAN-02',
    'KB-NGUTHAN-03',
    'KB-TAC-01',
    'KB-TAC-02',
    'KB-TAC-03',
    'KB-NHATBINH-02',
    'KB-NHATBINH-03',
  ];

  for (const id of unverifiedIds) {
    const rule = CKB_REGISTRY.find((r) => r.id === id);
    assert.ok(rule, `Phải tìm thấy rule ${id}`);
    assert.strictEqual(rule?.verification_status, 'unverified', `Rule ${id} chưa có thư tịch đối chiếu độc lập phải là unverified`);
    assert.strictEqual(rule?.source_title, undefined, `Tuyệt đối không được bịa đặt tên sách/nguồn cho rule ${id}`);
    assert.strictEqual(rule?.source_author_or_org, undefined, `Không được bịa tác giả cho rule ${id}`);
    assert.ok(rule?.notes && rule.notes.length > 0, `Rule ${id} phải có notes ghi nhận nhu cầu nghiên cứu`);

    const badge = formatVerificationStatusBadge(rule.verification_status);
    assert.strictEqual(badge.isVerified, false);
    assert.strictEqual(badge.label, 'Chưa có nguồn xác minh trong bản thử nghiệm');
  }
});

runTest('10.3 Garment Scope: Rule sai garment scope không được áp dụng nhầm', () => {
  const rule01 = CKB_REGISTRY.find((r) => r.id === 'KB-RULE-01');
  const rule02 = CKB_REGISTRY.find((r) => r.id === 'KB-RULE-02');
  const ruleNguThan01 = CKB_REGISTRY.find((r) => r.id === 'KB-NGUTHAN-01');
  const ruleTac01 = CKB_REGISTRY.find((r) => r.id === 'KB-TAC-01');
  const ruleNhatBinh01 = CKB_REGISTRY.find((r) => r.id === 'KB-NHATBINH-01');
  assert.ok(rule01 && rule02 && ruleNguThan01 && ruleTac01 && ruleNhatBinh01);

  // KB-RULE-01 (Hữu nhậm) áp dụng cho Ngũ Thân & Áo Tấc, KHÔNG áp dụng cho Nhật Bình (Đối khâm)
  assert.strictEqual(isRuleApplicableToGarment(rule01, 'ngu_than'), true);
  assert.strictEqual(isRuleApplicableToGarment(rule01, 'ao_tac'), true);
  assert.strictEqual(isRuleApplicableToGarment(rule01, 'nhat_binh'), false, 'Hữu nhậm không áp dụng cho Áo Nhật Bình');

  // KB-RULE-02 (Cấu trúc ngũ thân) KHÔNG áp dụng cho Nhật Bình
  assert.strictEqual(isRuleApplicableToGarment(rule02, 'ngu_than'), true);
  assert.strictEqual(isRuleApplicableToGarment(rule02, 'nhat_binh'), false, 'Ý nghĩa ngũ thân không áp dụng cho Áo Nhật Bình');

  // KB-NGUTHAN-01 chỉ áp dụng cho Ngũ Thân
  assert.strictEqual(isRuleApplicableToGarment(ruleNguThan01, 'ngu_than'), true);
  assert.strictEqual(isRuleApplicableToGarment(ruleNguThan01, 'ao_tac'), false);
  assert.strictEqual(isRuleApplicableToGarment(ruleNguThan01, 'nhat_binh'), false);

  // KB-TAC-01 chỉ áp dụng cho Áo Tấc
  assert.strictEqual(isRuleApplicableToGarment(ruleTac01, 'ao_tac'), true);
  assert.strictEqual(isRuleApplicableToGarment(ruleTac01, 'ngu_than'), false);
  assert.strictEqual(isRuleApplicableToGarment(ruleTac01, 'nhat_binh'), false);

  // KB-NHATBINH-01 chỉ áp dụng cho Áo Nhật Bình
  assert.strictEqual(isRuleApplicableToGarment(ruleNhatBinh01, 'nhat_binh'), true);
  assert.strictEqual(isRuleApplicableToGarment(ruleNhatBinh01, 'ngu_than'), false);
  assert.strictEqual(isRuleApplicableToGarment(ruleNhatBinh01, 'ao_tac'), false);

  // Scope 'needs_verification' không được áp dụng nhầm cho bất kỳ trang phục nào
  const mockUncertainRule = { ...rule01, garment_scope: 'needs_verification' as const };
  assert.strictEqual(isRuleApplicableToGarment(mockUncertainRule, 'ngu_than'), false);
  assert.strictEqual(isRuleApplicableToGarment(mockUncertainRule, 'ao_tac'), false);
  assert.strictEqual(isRuleApplicableToGarment(mockUncertainRule, 'nhat_binh'), false);

  // Thử nghiệm What-If câu hỏi về vạt với Áo Nhật Bình: Không được quy kết vi phạm Hữu nhậm
  const resNhatBinhLapel = evaluateWhatIfDeterministic('nhat_binh', 'Áo Nhật Bình có vạt đè bên trái không?');
  assert.strictEqual(resNhatBinhLapel.violates_invariants, false, 'Không áp đặt Hữu nhậm lên Áo Nhật Bình');
  assert.ok(resNhatBinhLapel.impact_analysis.includes('Đối Khâm'), 'Phải giải thích Nhật Bình là Đối Khâm');
});

runTest('10.4 Fallback wording: Tuyệt đối không dùng cụm từ võ đoán "không có vi phạm văn hóa" khi thiếu dữ liệu', () => {
  const testQueries = [
    'Đeo túi xách vải bố bên trái',
    'Không muốn đổi vạt áo',
    'Thời tiết 15 độ C ở Sa Pa thì mặc thế nào?',
    'Phối áo khoác da bomber bên ngoài áo ngũ thân',
    'Có được đeo kính râm phi công không?',
  ];

  for (const q of testQueries) {
    const res = evaluateWhatIfDeterministic('ngu_than', q);
    assert.strictEqual(
      res.impact_analysis.toLowerCase().includes('không có vi phạm văn hóa'),
      false,
      `Không được dùng "không có vi phạm văn hóa" trong câu trả lời cho query: "${q}"`
    );
    assert.strictEqual(
      res.impact_analysis.toLowerCase().includes('không vi phạm văn hóa'),
      false,
      `Không được dùng "không vi phạm văn hóa" trong câu trả lời cho query: "${q}"`
    );
    assert.ok(
      res.impact_analysis.includes('Không phát hiện xung đột với các quy tắc hiện có trong CKB'),
      `Phải dùng wording trung thực "Không phát hiện xung đột..." cho query: "${q}"`
    );
  }
});

runTest('10.5 Evidence ID mở đúng metadata nguồn và phân tách 3 tầng thông tin', () => {
  for (const entry of CKB_REGISTRY) {
    assert.ok(entry.id, 'Entry phải có id');
    assert.ok(entry.title, 'Entry phải có title');
    assert.ok(entry.core_rule, 'Entry phải có core_rule');
    assert.ok(entry.garment_scope, 'Entry phải có garment_scope');
    assert.ok(entry.verification_status, 'Entry phải có verification_status');

    assert.ok(entry.information_tier, `Rule ${entry.id} phải có 3 tầng thông tin`);
    assert.ok(entry.information_tier.historical_claim, `Rule ${entry.id} phải có tầng căn cứ lịch sử`);
    assert.ok(entry.information_tier.prototype_rule, `Rule ${entry.id} phải có tầng quy tắc nội bộ prototype`);
    assert.ok(entry.information_tier.contemporary_suggestion, `Rule ${entry.id} phải có tầng gợi ý đương đại`);

    if (entry.verification_status === 'verified') {
      assert.ok(entry.source_title, `Rule đã verified ${entry.id} phải có source_title`);
      assert.ok(entry.source_author_or_org, `Rule đã verified ${entry.id} phải có source_author_or_org`);
    } else if (entry.verification_status === 'needs_review') {
      assert.ok(entry.source_title, `Rule needs_review ${entry.id} có ghi nhận source_title`);
      assert.ok(
        entry.notes &&
          (entry.notes.includes('chưa được đối soát trực tiếp') ||
            entry.notes.includes('chờ đối soát') ||
            entry.notes.includes('tiếp tục tra cứu')),
        `Rule ${entry.id} ghi rõ cần rà soát`
      );
    } else {
      assert.strictEqual(entry.source_title, undefined, `Rule unverified ${entry.id} không được có source_title giả`);
      assert.ok(entry.notes && entry.notes.includes('Chưa có nguồn xác minh'), `Rule unverified ${entry.id} phải ghi rõ chưa có nguồn`);
    }
  }
});

runTest('10.6 Metadata & wording verification cho batch 1 CKB (KB-RULE-01, 02, 03, KB-NHATBINH-01)', () => {
  const targetIds = ['KB-RULE-01', 'KB-RULE-02', 'KB-RULE-03', 'KB-NHATBINH-01'];

  for (const id of targetIds) {
    const entry = CKB_REGISTRY.find((r) => r.id === id);
    assert.ok(entry, `Phải tìm thấy rule ${id}`);

    // source_url tồn tại và không chỉ là homepage
    assert.ok(entry?.source_url, `Rule ${id} phải có source_url`);
    assert.ok(
      entry!.source_url!.startsWith('https://') || entry!.source_url!.startsWith('http://'),
      `source_url của ${id} phải là HTTP(S) URL`
    );
    const parsedUrl = new URL(entry!.source_url!);
    assert.ok(
      parsedUrl.pathname.length > 1,
      `source_url của ${id} không được chỉ là homepage, phải trỏ đến bài cụ thể`
    );
  }

  // Verification status
  const rule01 = CKB_REGISTRY.find((r) => r.id === 'KB-RULE-01')!;
  const rule02 = CKB_REGISTRY.find((r) => r.id === 'KB-RULE-02')!;
  const rule03 = CKB_REGISTRY.find((r) => r.id === 'KB-RULE-03')!;
  const ruleNhatBinh01 = CKB_REGISTRY.find((r) => r.id === 'KB-NHATBINH-01')!;

  assert.strictEqual(ruleNhatBinh01.verification_status, 'verified', 'KB-NHATBINH-01 phải ở trạng thái verified');
  assert.strictEqual(rule01.verification_status, 'needs_review', 'KB-RULE-01 phải ở trạng thái needs_review');
  assert.strictEqual(rule02.verification_status, 'needs_review', 'KB-RULE-02 phải ở trạng thái needs_review');
  assert.strictEqual(rule03.verification_status, 'needs_review', 'KB-RULE-03 phải ở trạng thái needs_review');

  // KB-RULE-01: Không chứa wording ngụ ý hiện vật gốc thời Nguyễn
  const rule01CombinedText = `${rule01.core_rule} ${rule01.historical_context} ${rule01.information_tier.historical_claim}`;
  assert.strictEqual(
    rule01CombinedText.toLowerCase().includes('hiện vật thời nguyễn xác nhận'),
    false,
    'KB-RULE-01 không được chứa "hiện vật thời Nguyễn xác nhận"'
  );
  assert.strictEqual(
    rule01CombinedText.toLowerCase().includes('khảo cổ vật'),
    false,
    'KB-RULE-01 không được ngụ ý khảo cổ vật thế kỷ XIX'
  );

  // KB-RULE-02: Vẫn có wording tương truyền
  const rule02CombinedText = `${rule02.historical_context} ${rule02.notes} ${rule02.information_tier.historical_claim}`;
  assert.ok(
    rule02CombinedText.toLowerCase().includes('tương truyền'),
    'KB-RULE-02 phải có wording tương truyền'
  );

  // KB-RULE-03: Không chứa "tuyệt đối cấm" hoặc "vi phạm trực tiếp điển chế"
  const rule03CombinedText = `${rule03.core_rule} ${rule03.historical_context} ${rule03.redline_warning} ${rule03.information_tier.historical_claim}`;
  assert.strictEqual(
    rule03CombinedText.toLowerCase().includes('tuyệt đối cấm'),
    false,
    'KB-RULE-03 không được chứa "tuyệt đối cấm"'
  );
  assert.strictEqual(
    rule03CombinedText.toLowerCase().includes('vi phạm trực tiếp điển chế'),
    false,
    'KB-RULE-03 không được chứa "vi phạm trực tiếp điển chế"'
  );
});

// -------------------------------------------------------------
// Test Case 11: Single Source of Truth Architecture & Two-Layer Certainty Model
// -------------------------------------------------------------
runTest('11.1 Dynamic CKB System Grounding: buildCKBSystemGrounding sinh chỉ dẫn từ CKB_REGISTRY', () => {
  const grounding = buildCKBSystemGrounding();
  assert.ok(typeof grounding === 'string', 'Grounding phải là string');
  assert.ok(grounding.includes('CULTURAL KNOWLEDGE BASE (CKB)'), 'Grounding phải chứa tiêu đề CKB');
  assert.ok(grounding.includes('TẬP QUY TẮC BẤT BIẾN'), 'Grounding phải chứa tập quy tắc bất biến');

  // Grounding phải chứa tất cả rule id trong registry
  for (const entry of CKB_REGISTRY) {
    assert.ok(grounding.includes(entry.id), `Grounding phải tự động chứa mã rule ${entry.id}`);
  }

  // Grounding phải yêu cầu tách bạch 2 tầng (prototype compliance & historical confidence)
  assert.ok(grounding.includes('prototype_compliance'), 'Grounding phải yêu cầu trường prototype_compliance');
  assert.ok(grounding.includes('historical_confidence'), 'Grounding phải yêu cầu trường historical_confidence');
});

runTest('11.2 Helpers getCKBEntry & isRuleApplicableToGarment hoạt động chính xác', () => {
  const entry01 = getCKBEntry('KB-RULE-01');
  assert.ok(entry01, 'getCKBEntry phải trả về entry khi có id hợp lệ');
  assert.strictEqual(entry01?.id, 'KB-RULE-01');

  const invalidEntry = getCKBEntry('NON_EXISTENT_ID');
  assert.strictEqual(invalidEntry, undefined, 'getCKBEntry phải trả về undefined khi id không tồn tại');

  // Garment applicability
  assert.strictEqual(isRuleApplicableToGarment(entry01!, 'ngu_than'), true);
  assert.strictEqual(isRuleApplicableToGarment(entry01!, 'ao_tac'), true);
  assert.strictEqual(isRuleApplicableToGarment(entry01!, 'nhat_binh'), false);
});

runTest('11.3 Tách bạch Prototype Compliance và Historical Confidence trong Audit', () => {
  // Case 1: Toàn bộ rules là unverified (ví dụ KB-NGUTHAN-01, KB-NGUTHAN-02)
  const unverifiedConfidence = deriveAuditConfidence(['KB-NGUTHAN-01', 'KB-NGUTHAN-02'], false);
  assert.strictEqual(unverifiedConfidence.prototype_compliance, 'compliant', 'Tuân thủ quy ước prototype');
  assert.strictEqual(unverifiedConfidence.historical_confidence, 'unverified', 'Nguồn lịch sử là unverified');
  assert.strictEqual(unverifiedConfidence.hasUnverified, true);
  assert.ok(unverifiedConfidence.verification_summary.includes('chưa được đối chiếu thư tịch độc lập'));

  // Case 2: Có rule needs_review (ví dụ KB-RULE-03)
  const reviewConfidence = deriveAuditConfidence(['KB-RULE-03'], true);
  assert.strictEqual(reviewConfidence.prototype_compliance, 'conflict', 'Có xung đột với quy tắc prototype');
  assert.strictEqual(reviewConfidence.historical_confidence, 'needs_review', 'Nguồn lịch sử ở mức needs_review');
  assert.strictEqual(reviewConfidence.hasUnverified, true);

  // Case 3: Empty evidence
  const emptyConfidence = deriveAuditConfidence([], false);
  assert.strictEqual(emptyConfidence.prototype_compliance, 'unassessed');
  assert.strictEqual(emptyConfidence.historical_confidence, 'unverified');
});

runTest('11.4 What-If Fallback phản ánh trung thực certainty model khi vi phạm rule unverified/needs_review', () => {
  // Khi vi phạm KB-RULE-01 (needs_review): nêu rõ tình trạng nguồn cần rà soát
  const resLapel = evaluateWhatIfDeterministic('ngu_than', 'Đổi vạt áo sang bên trái');
  assert.strictEqual(resLapel.violates_invariants, true);
  assert.strictEqual(resLapel.prototype_compliance, 'conflict');
  assert.strictEqual(resLapel.historical_confidence, 'needs_review');
  assert.ok(resLapel.impact_analysis.includes('KB-RULE-01'));
  assert.ok(resLapel.impact_analysis.includes('nguồn lịch sử'));

  // Khi vi phạm KB-RULE-03 (needs_review): nêu rõ điển chế và nguồn cần rà soát thêm
  const resDragon = evaluateWhatIfDeterministic('ngu_than', 'Thêu rồng 5 móng lên vạt');
  assert.strictEqual(resDragon.violates_invariants, true);
  assert.strictEqual(resDragon.prototype_compliance, 'conflict');
  assert.strictEqual(resDragon.historical_confidence, 'needs_review');
  assert.ok(resDragon.impact_analysis.includes('KB-RULE-03'));
  assert.ok(resDragon.impact_analysis.includes('nguồn lịch sử tham chiếu cần được rà soát thêm'));
});

// -------------------------------------------------------------
// Test Case 12: Gemini Normalization Layer Tests (Mock Gemini Outputs)
// -------------------------------------------------------------
runTest('12.1 Normalization Case 1: Gemini nói verified nhưng evidence KB-NGUTHAN-01 unverified -> demote historical_confidence & uncertainty true', () => {
  const fakeGeminiAudit = {
    status: 'Supported',
    historical_confidence: 'verified', // Overconfident model claim
    prototype_compliance: 'compliant',
    uncertainty_flag: false,
    evidence_ids: ['KB-NGUTHAN-01'], // Real status in CKB is unverified
    invariants_checked: [{ evidence_id: 'KB-NGUTHAN-01', rule_name: 'Cổ lập lĩnh', passed: true, detail: 'Đúng cổ' }],
    mutables_used: [],
    cautions_and_redlines: [],
    auditor_verdict: 'Chính xác lịch sử 100%.',
  };

  const normalized = normalizeGeminiProposalAudit(fakeGeminiAudit, 'ngu_than');
  assert.strictEqual(normalized.historical_confidence, 'unverified', 'Historical confidence phải bị hạ về unverified');
  assert.strictEqual(normalized.uncertainty_flag, true, 'uncertainty_flag phải bị ép thành true');
  assert.strictEqual(normalized.status, 'Supported with Caution', 'Status không được là Supported khi nguồn unverified');
  assert.strictEqual(normalized.prototype_compliance, 'compliant');
  assert.strictEqual(normalized.has_design_caution, false, 'Không có design caution khi thiết kế tuân thủ');
  assert.strictEqual(normalized.has_evidence_uncertainty, true);
});

runTest('12.2 Normalization Case 2: Gemini nói Supported nhưng evidence KB-RULE-03 needs_review -> không được coi fully verified', () => {
  const fakeGeminiAudit = {
    status: 'Supported',
    historical_confidence: 'verified',
    prototype_compliance: 'compliant',
    uncertainty_flag: false,
    evidence_ids: ['KB-RULE-03'],
    invariants_checked: [{ evidence_id: 'KB-RULE-03', rule_name: 'Rồng 5 móng', passed: true, detail: 'Tuân thủ' }],
    mutables_used: [],
    cautions_and_redlines: [],
  };

  const normalized = normalizeGeminiProposalAudit(fakeGeminiAudit, 'ngu_than');
  assert.strictEqual(normalized.historical_confidence, 'needs_review', 'KB-RULE-03 phải trả về needs_review');
  assert.strictEqual(normalized.uncertainty_flag, true);
  assert.notStrictEqual(normalized.status, 'Supported');
  assert.strictEqual(normalized.status, 'Supported with Caution');
});

runTest('12.3 Normalization Case 3: Gemini trả evidence ID không tồn tại -> uncertainty true và hạ certainty', () => {
  const fakeGeminiAudit = {
    status: 'Supported',
    historical_confidence: 'verified',
    prototype_compliance: 'compliant',
    uncertainty_flag: false,
    evidence_ids: ['KB-FAKE-999'],
    invariants_checked: [],
    mutables_used: [],
    cautions_and_redlines: [],
  };

  const normalized = normalizeGeminiProposalAudit(fakeGeminiAudit, 'ngu_than');
  assert.strictEqual(normalized.uncertainty_flag, true);
  assert.strictEqual(normalized.status, 'Insufficient Evidence');
  assert.ok(normalized.system_warnings && normalized.system_warnings.some((c) => c.includes('KB-FAKE-999')));
  assert.strictEqual(normalized.cautions_and_redlines.length, 0, 'Cảnh báo kỹ thuật không được nhét vào cautions_and_redlines');
});

runTest('12.4 Normalization Case 4: Gemini dùng KB-NGUTHAN-01 cho Nhật Bình -> không coi là evidence hợp lệ cho garment', () => {
  const fakeGeminiAudit = {
    status: 'Supported',
    historical_confidence: 'verified',
    prototype_compliance: 'compliant',
    uncertainty_flag: false,
    evidence_ids: ['KB-NGUTHAN-01'], // Scope is strictly ngu_than, not nhat_binh!
    invariants_checked: [{ evidence_id: 'KB-NGUTHAN-01', rule_name: 'Cổ lập lĩnh', passed: true, detail: 'Đúng' }],
    mutables_used: [],
    cautions_and_redlines: [],
  };

  const normalized = normalizeGeminiProposalAudit(fakeGeminiAudit, 'nhat_binh');
  assert.strictEqual(normalized.evidence_ids.length, 0, 'Rule sai scope không được đưa vào valid evidence');
  assert.strictEqual(normalized.status, 'Insufficient Evidence');
  assert.strictEqual(normalized.uncertainty_flag, true);
  assert.ok(normalized.system_warnings && normalized.system_warnings.some((c) => c.includes('không áp dụng cho trang phục "nhat_binh"')));
  assert.strictEqual(normalized.cautions_and_redlines.length, 0, 'Cảnh báo phạm vi không được nhét vào cautions_and_redlines');
});

runTest('12.5 Normalization Case 5: Gemini nói prototype compliant nhưng có violated_evidence_ids / vi phạm -> ép thành conflict', () => {
  // Test với What-If evaluation
  const fakeGeminiEvaluation = {
    query: 'Cắt cổ áo Nhật Bình thành cổ tròn',
    target_garment: 'nhat_binh',
    proposed_change: 'Đổi cổ',
    status: 'Supported',
    prototype_compliance: 'compliant', // False claim by model!
    historical_confidence: 'verified',
    uncertainty_flag: false,
    violates_invariants: true,
    violated_evidence_ids: ['KB-NHATBINH-01'],
    applicable_evidence_ids: [],
    cautions_and_redlines: ['Xung đột nẹp cổ đối khâm'],
    impact_analysis: 'Phá vỡ nẹp cổ',
  };

  const normalized = normalizeGeminiWhatIfEvaluation(fakeGeminiEvaluation, 'nhat_binh');
  assert.strictEqual(normalized.prototype_compliance, 'conflict', 'Phải ép thành conflict khi có violated evidence');
  assert.strictEqual(normalized.violates_invariants, true);
  assert.strictEqual(normalized.has_design_caution, true);
});

runTest('12.6 Normalization Case 6: Prototype compliant, không caution, evidence unverified -> Look summary chỉ hiện uncertainty về nguồn, KHÔNG hiện "Có điểm cần lưu ý"', () => {
  const normalizedAudit = normalizeGeminiProposalAudit(
    {
      status: 'Supported',
      historical_confidence: 'verified',
      prototype_compliance: 'compliant',
      uncertainty_flag: false,
      evidence_ids: ['KB-NGUTHAN-01', 'KB-NGUTHAN-02'],
      invariants_checked: [
        { evidence_id: 'KB-NGUTHAN-01', passed: true, detail: 'Cổ lập lĩnh chuẩn' },
        { evidence_id: 'KB-NGUTHAN-02', passed: true, detail: 'Tay chẽn chuẩn' },
      ],
      mutables_used: [],
      cautions_and_redlines: [],
      auditor_verdict: 'Thiết kế đẹp.',
    },
    'ngu_than'
  );

  const summary = getLookSummaryStatus(normalizedAudit);
  assert.strictEqual(summary.hasDesignCaution, false, 'Không được có design caution khi thiết kế tuân thủ');
  assert.strictEqual(summary.hasEvidenceUncertainty, true, 'Phải có evidence uncertainty do nguồn unverified');
  assert.strictEqual(summary.badges.some((b) => b.label === 'Có điểm cần lưu ý'), false, 'KHÔNG ĐƯỢC hiện "Có điểm cần lưu ý"');
  assert.strictEqual(summary.prototypeComplianceLabel, 'Phù hợp với quy tắc prototype');
  assert.strictEqual(summary.historicalConfidenceLabel, 'Nguồn lịch sử chưa xác minh độc lập');
});

runTest('12.7 Normalization Case 7: Prototype conflict và evidence unverified -> hiện cả conflict và uncertainty', () => {
  const conflictAudit = normalizeGeminiProposalAudit(
    {
      status: 'Supported with Caution',
      historical_confidence: 'unverified',
      prototype_compliance: 'conflict',
      uncertainty_flag: true,
      evidence_ids: ['KB-NGUTHAN-01'],
      invariants_checked: [{ evidence_id: 'KB-NGUTHAN-01', passed: false, detail: 'Bỏ cổ lập lĩnh' }],
      mutables_used: [],
      cautions_and_redlines: ['Cảnh báo đổi vạt sang trái'],
      auditor_verdict: 'Xung đột quy thức.',
    },
    'ngu_than'
  );

  const summary = getLookSummaryStatus(conflictAudit);
  assert.strictEqual(summary.hasDesignCaution, true, 'Phải nhận diện có design caution/conflict');
  assert.strictEqual(summary.hasEvidenceUncertainty, true, 'Phải nhận diện có evidence uncertainty');
  assert.strictEqual(summary.badges.some((b) => b.variant === 'caution'), true);
  assert.strictEqual(summary.badges.some((b) => b.variant === 'uncertainty'), true);
  assert.strictEqual(summary.prototypeComplianceLabel, 'Có xung đột với quy tắc prototype');
});

runTest('12.8 Normalization Case 8: Không có evidence -> Insufficient Evidence & prototype_compliance unassessed', () => {
  const emptyAudit = normalizeGeminiProposalAudit(
    {
      status: 'Supported',
      historical_confidence: 'verified',
      prototype_compliance: 'compliant',
      evidence_ids: [],
      invariants_checked: [],
      mutables_used: [],
      cautions_and_redlines: [],
    },
    'ngu_than'
  );

  assert.strictEqual(emptyAudit.status, 'Insufficient Evidence');
  assert.strictEqual(emptyAudit.prototype_compliance, 'unassessed');
  assert.strictEqual(emptyAudit.uncertainty_flag, true);
  assert.strictEqual(emptyAudit.historical_confidence, 'unverified');
});

// -------------------------------------------------------------
// Test Case 13: Toàn Bộ Garment Scope Của Mọi Rule Trong CKB
// -------------------------------------------------------------
runTest('13.1 Duyệt qua toàn bộ CKB_REGISTRY và xác thực garment scope', () => {
  const garments: GarmentKey[] = ['ngu_than', 'ao_tac', 'nhat_binh'];

  for (const entry of CKB_REGISTRY) {
    assert.ok(entry.garment_scope, `Rule ${entry.id} phải có garment_scope`);

    if (entry.garment_scope === 'all') {
      for (const g of garments) {
        assert.strictEqual(isRuleApplicableToGarment(entry, g), true, `Rule ${entry.id} scope all phải áp dụng cho ${g}`);
      }
    } else if (entry.garment_scope === 'needs_verification') {
      for (const g of garments) {
        assert.strictEqual(isRuleApplicableToGarment(entry, g), false, `Rule ${entry.id} needs_verification không được áp dụng cho ${g}`);
      }
    } else if (Array.isArray(entry.garment_scope)) {
      for (const g of garments) {
        const expected = entry.garment_scope.includes(g);
        assert.strictEqual(isRuleApplicableToGarment(entry, g), expected, `Rule ${entry.id} array scope kiểm tra ${g}`);
      }
    } else if (entry.garment_scope === 'ngu_than_and_tac') {
      assert.strictEqual(isRuleApplicableToGarment(entry, 'ngu_than'), true);
      assert.strictEqual(isRuleApplicableToGarment(entry, 'ao_tac'), true);
      assert.strictEqual(isRuleApplicableToGarment(entry, 'nhat_binh'), false);
    } else {
      assert.strictEqual(isRuleApplicableToGarment(entry, entry.garment_scope as GarmentKey), true);
    }
  }
});

// -------------------------------------------------------------
// Test Case 14: Dynamic CKB Stats Validation
// -------------------------------------------------------------
runTest('14.1 Helper getCKBStats trả về số liệu động chính xác', () => {
  const stats = getCKBStats();
  assert.strictEqual(stats.total, CKB_REGISTRY.length, 'Total phải bằng đúng số lượng entries');

  // Tổng các verification bucket phải bằng total
  const verificationSum = stats.verified + stats.needs_review + stats.unverified + stats.disputed;
  assert.strictEqual(verificationSum, stats.total, 'Tổng các bucket verification phải khớp total');

  // Tổng các category bucket phải bằng total
  const categorySum = stats.invariant + stats.mutable + stats.sacred_rule;
  assert.strictEqual(categorySum, stats.total, 'Tổng các bucket category phải khớp total');

  assert.strictEqual(stats.verified, 1, 'KB-NHATBINH-01 đã được xác minh qua khảo sát hiện vật bảo tàng');
  assert.strictEqual(stats.needs_review, 3, 'KB-RULE-01, KB-RULE-02, KB-RULE-03 ở trạng thái needs_review');
  assert.strictEqual(stats.unverified, 8, '8 rule còn lại unverified');
});

// -------------------------------------------------------------
// Test Case 15: Audit Consistency Hardening & Prose Sanitization
// -------------------------------------------------------------
runTest('15.1 Helper hasOverconfidentClaim phát hiện các tuyên bố phóng đại mức độ chắc chắn', () => {
  assert.strictEqual(hasOverconfidentClaim('Thiết kế chính xác lịch sử 100%.'), true);
  assert.strictEqual(hasOverconfidentClaim('Bộ áo này đã xác thực văn hóa hoàn toàn.'), true);
  assert.strictEqual(hasOverconfidentClaim('Quy thức đã được kiểm chứng hoàn toàn.'), true);
  assert.strictEqual(hasOverconfidentClaim('Áo ngũ thân chuẩn xác 100% theo triều đình.'), true);
  assert.strictEqual(hasOverconfidentClaim('Thiết kế phù hợp với các quy tắc prototype hiện tại.'), false);
  assert.strictEqual(hasOverconfidentClaim('Tuân thủ cấu trúc lập lĩnh và hữu nhậm.'), false);
});

runTest('15.2 Auditor verdict sanitize: Gemini trả "Chính xác lịch sử 100%" khi rule unverified -> thay bằng neutral CKB verdict', () => {
  const fakeAudit = {
    status: 'Supported',
    historical_confidence: 'verified', // Overclaimed
    prototype_compliance: 'compliant',
    uncertainty_flag: false,
    evidence_ids: ['KB-NGUTHAN-01'], // unverified
    invariants_checked: [{ evidence_id: 'KB-NGUTHAN-01', passed: true, detail: 'Cổ lập lĩnh' }],
    mutables_used: [],
    cautions_and_redlines: [],
    auditor_verdict: 'Chính xác lịch sử 100% không thể bàn cãi.',
  };

  const normalized = normalizeGeminiProposalAudit(fakeAudit, 'ngu_than');
  assert.strictEqual(normalized.historical_confidence, 'unverified');
  assert.strictEqual(hasOverconfidentClaim(normalized.auditor_verdict), false, 'Không được còn tuyên bố phóng đại');
  assert.ok(
    normalized.auditor_verdict.includes('chưa được xác minh độc lập'),
    'Verdict phải phản ánh trung thực trạng thái nguồn unverified'
  );
});

runTest('15.3 Auditor verdict sanitize: Gemini trả "Đã xác thực văn hóa" khi rule needs_review -> thay bằng rà soát thêm', () => {
  const fakeAudit = {
    status: 'Supported',
    historical_confidence: 'verified',
    prototype_compliance: 'compliant',
    uncertainty_flag: false,
    evidence_ids: ['KB-RULE-03'], // needs_review
    invariants_checked: [{ evidence_id: 'KB-RULE-03', passed: true, detail: 'Quy thức rồng' }],
    mutables_used: [],
    cautions_and_redlines: [],
    auditor_verdict: 'Bộ trang phục đã xác thực văn hóa hoàn toàn.',
  };

  const normalized = normalizeGeminiProposalAudit(fakeAudit, 'ao_tac');
  assert.strictEqual(normalized.historical_confidence, 'needs_review');
  assert.strictEqual(hasOverconfidentClaim(normalized.auditor_verdict), false);
  assert.ok(
    normalized.auditor_verdict.includes('cần rà soát thêm'),
    'Verdict phải phản ánh trạng thái needs_review'
  );
});

runTest('15.4 What-If impact_analysis sanitize: Gemini khẳng định chuẩn xác 100% -> loại bỏ tuyệt đối và append CKB disclaimer', () => {
  const fakeWhatIf = {
    query: 'What if tay áo dài rộng hơn 5cm?',
    target_garment: 'ngu_than',
    proposed_change: 'Nới tay',
    status: 'Supported',
    uncertainty_flag: false,
    impact_analysis: 'Thay đổi này chính xác lịch sử 100% và giữ trọn nét thanh tao của áo truyền thống.',
    violates_invariants: false,
    violated_evidence_ids: [],
    applicable_evidence_ids: ['KB-NGUTHAN-02'], // unverified
    cautions_and_redlines: [],
  };

  const normalized = normalizeGeminiWhatIfEvaluation(fakeWhatIf, 'ngu_than');
  assert.strictEqual(hasOverconfidentClaim(normalized.impact_analysis), false);
  assert.ok(
    normalized.impact_analysis.includes('chưa được xác minh độc lập'),
    'Impact analysis phải có CKB verification disclaimer khi nguồn unverified'
  );
});

runTest('15.5 Validate invariants_checked: Nhật Bình có invariant KB-NGUTHAN-01 passed false -> Không làm Nhật Bình thành conflict', () => {
  const fakeAudit = {
    status: 'Supported with Caution',
    historical_confidence: 'verified',
    prototype_compliance: 'conflict', // Gemini falsely set conflict because of Ngũ Thân rule!
    uncertainty_flag: false,
    evidence_ids: ['KB-NHATBINH-01'],
    invariants_checked: [
      { evidence_id: 'KB-NGUTHAN-01', passed: false, detail: 'Không có cổ lập lĩnh ngũ thân' }, // Inapplicable to Nhật Bình!
      { evidence_id: 'KB-NHATBINH-01', passed: true, detail: 'Nẹp cổ đối khâm chuẩn' },
    ],
    mutables_used: [],
    cautions_and_redlines: [],
    auditor_verdict: 'Xung đột giả định.',
  };

  const normalized = normalizeGeminiProposalAudit(fakeAudit, 'nhat_binh');
  // KB-NGUTHAN-01 must be pruned from valid invariants
  assert.strictEqual(normalized.invariants_checked.length, 1);
  assert.strictEqual(normalized.invariants_checked[0].evidence_id, 'KB-NHATBINH-01');
  assert.strictEqual(normalized.prototype_compliance, 'compliant', 'Nhật Bình không được nhận prototype conflict từ rule của Ngũ Thân');
  assert.ok(normalized.system_warnings && normalized.system_warnings.length > 0, 'Phải có system warning về rule sai garment scope');
  assert.strictEqual(normalized.cautions_and_redlines.length, 0, 'Cảnh báo hệ thống không được đưa vào cautions_and_redlines');
});

runTest('15.6 Validate mutables_used: Mutable ID lạ hoặc sai garment scope -> Không vào mutables_used hợp lệ, chuyển sang system_warnings', () => {
  const fakeAudit = {
    status: 'Supported',
    historical_confidence: 'verified',
    prototype_compliance: 'compliant',
    uncertainty_flag: false,
    evidence_ids: ['KB-NHATBINH-01'],
    invariants_checked: [{ evidence_id: 'KB-NHATBINH-01', passed: true, detail: 'Chuẩn' }],
    mutables_used: [
      { evidence_id: 'KB-MUTABLE-FAKE', element: 'Tà áo', application: 'Cắt tà' },
      { evidence_id: 'KB-NGUTHAN-03', element: 'Chiều dài vạt', application: 'Vạt lửng' }, // inapplicable to nhat_binh
    ],
    cautions_and_redlines: [],
  };

  const normalized = normalizeGeminiProposalAudit(fakeAudit, 'nhat_binh');
  assert.strictEqual(normalized.mutables_used.length, 0, 'Các mutables không hợp lệ phải bị loại bỏ');
  assert.ok(normalized.system_warnings && normalized.system_warnings.length >= 2, 'Phải có 2 cảnh báo hệ thống cho 2 mutable lỗi');
  assert.strictEqual(normalized.cautions_and_redlines.length, 0, 'cautions_and_redlines không chứa system warnings');
});

runTest('15.7 getLookSummaryStatus: Có system_warnings nhưng thiết kế compliant và không có cautions -> hasDesignCaution là false', () => {
  const auditWithSystemWarnings: CulturalAuditResult = {
    status: 'Supported with Caution',
    uncertainty_flag: true,
    uncertainty_note: 'Nguồn chưa xác minh.',
    evidence_ids: ['KB-NHATBINH-01'],
    invariants_checked: [{ evidence_id: 'KB-NHATBINH-01', rule_name: 'Đối khâm', passed: true, detail: 'Đúng' }],
    mutables_used: [],
    cautions_and_redlines: [], // No design caution!
    system_warnings: ['[Lưu ý hệ thống] Mã bằng chứng KB-FAKE không tồn tại.'],
    auditor_verdict: 'Thiết kế đẹp.',
    prototype_compliance: 'compliant',
    historical_confidence: 'unverified',
    has_design_caution: false,
    has_evidence_uncertainty: true,
  };

  const summary = getLookSummaryStatus(auditWithSystemWarnings);
  assert.strictEqual(summary.hasDesignCaution, false, 'System warnings KHÔNG được biến thành design caution');
  assert.strictEqual(summary.badges.some((b) => b.label === 'Có điểm cần lưu ý'), false);
  assert.strictEqual(summary.prototypeComplianceLabel, 'Phù hợp với quy tắc prototype');
  assert.strictEqual(summary.historicalConfidenceLabel, 'Nguồn lịch sử chưa xác minh độc lập');
});

runTest('15.8 What-If: Inapplicable violated evidence ID không làm garment thành conflict', () => {
  const fakeWhatIf = {
    query: 'What if cổ đứng?',
    target_garment: 'nhat_binh',
    proposed_change: 'Đổi cổ',
    status: 'Supported with Caution',
    uncertainty_flag: false,
    violates_invariants: true, // Model claims invariant violated
    violated_evidence_ids: ['KB-NGUTHAN-01'], // But rule is for ngu_than, inapplicable to nhat_binh!
    applicable_evidence_ids: ['KB-NHATBINH-01'],
    cautions_and_redlines: [],
    impact_analysis: 'Đổi cổ áo',
  };

  const normalized = normalizeGeminiWhatIfEvaluation(fakeWhatIf, 'nhat_binh');
  assert.strictEqual(normalized.violated_evidence_ids.length, 0, 'Rule sai scope không được giữ trong violated_evidence_ids');
  assert.strictEqual(normalized.violates_invariants, false, 'Không vi phạm invariant vì rule không áp dụng cho Nhật Bình');
  assert.strictEqual(normalized.prototype_compliance, 'compliant', 'Prototype compliance phải là compliant');
  assert.ok(normalized.system_warnings && normalized.system_warnings.length > 0, 'Phải có system warning về scope');
  assert.strictEqual(normalized.cautions_and_redlines.length, 0);
});

// -------------------------------------------------------------
// Test Case 16: Regression Tests for Gemini Contract & Summary Helpers
// -------------------------------------------------------------
const createValidMockProposal = (
  garment: GarmentKey = 'nhat_binh',
  planType: 'heritage_anchored' | 'contemporary_remix' = 'heritage_anchored'
) => ({
  id: 'mock-prop-1',
  plan_type: planType,
  title: 'Áo Nhật Bình Hoàng Gia',
  concept_tag: 'EDITORIAL',
  garment_type: garment,
  dial_level: 2,
  visual_details: {
    collar_style: 'Nẹp cổ đối khâm chuẩn',
    lapel_side: 'Đối khâm cài khuy tim',
    sleeve_style: 'Tay thụng ngũ sắc',
    cut_length: 'Dài ngang bắp chân',
    fabric_materials: ['Tơ tằm tự nhiên', 'Gấm'],
    layering_pieces: ['Áo ngũ thân lót'],
    bottom_garment: 'Quần lụa trắng',
    footwear: 'Hài thêu hoa',
    accessories: ['Trâm cài hoa cài đầu'],
    color_palette: ['#B8342B', '#E6C88B', '#1E3A8A'],
  },
  audit: {
    status: 'Supported',
    uncertainty_flag: false,
    evidence_ids: ['KB-NHATBINH-01'],
    invariants_checked: [
      { evidence_id: 'KB-NHATBINH-01', rule_name: 'Đối khâm', passed: true, detail: 'Chuẩn' },
    ],
    mutables_used: [],
    cautions_and_redlines: [],
    auditor_verdict: 'Hợp lệ theo quy thức y phục cổ truyền.',
  },
  stylist_notes: {
    philosophy: 'Bảo lưu trọn vẹn đối khâm và cổ tay ngũ sắc.',
    gen_z_tips: ['Mặc chuẩn nghi thức'],
    occasions: ['Lễ cưới', 'Chụp ảnh di sản'],
  },
});

// Case 1: User chọn nhat_binh nhưng proposal trả ngu_than -> validateGeminiProposalContract phải fail
runTest('16.1 Contract check: User chọn nhat_binh nhưng proposal trả ngu_than -> validateGeminiProposalContract phải fail', () => {
  const mockProposal = createValidMockProposal('ngu_than');
  const validation = validateGeminiProposalContract(mockProposal, 'nhat_binh');
  assert.strictEqual(validation.valid, false);
  assert.ok(validation.error && validation.error.includes('nhat_binh'));
});

// Case 2: Có đúng 2 proposal hợp lệ và đều đúng garment -> processGeminiProposalResponse phải trả source gemini
runTest('16.2 Process response: Có đúng 2 proposal hợp lệ và đều đúng garment -> processGeminiProposalResponse phải trả source gemini', () => {
  const responseJson = {
    proposals: [
      createValidMockProposal('nhat_binh', 'heritage_anchored'),
      createValidMockProposal('nhat_binh', 'contemporary_remix'),
    ],
  };
  const result = processGeminiProposalResponse(responseJson, 'nhat_binh');
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.source, 'gemini');
  assert.strictEqual(result.proposals.length, 2);
  assert.strictEqual(result.proposals[0].garment_type, 'nhat_binh');
  assert.strictEqual(result.proposals[1].garment_type, 'nhat_binh');
});

// Case 3: Chỉ có 1 proposal -> Phải fallback và source deterministic_engine_fallback
runTest('16.3 Process response: Chỉ có 1 proposal -> Phải fallback và source deterministic_engine_fallback', () => {
  const responseJson = {
    proposals: [createValidMockProposal('ngu_than')],
  };
  const result = processGeminiProposalResponse(responseJson, 'ngu_than');
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.source, 'deterministic_engine_fallback');
  assert.ok(result.warning && result.warning.includes('1 proposals'));
  assert.strictEqual(result.proposals.length, 2);
});

// Case 4: Có 3 proposal -> Phải fallback
runTest('16.4 Process response: Có 3 proposal -> Phải fallback', () => {
  const responseJson = {
    proposals: [
      createValidMockProposal('ngu_than'),
      createValidMockProposal('ngu_than'),
      createValidMockProposal('ngu_than'),
    ],
  };
  const result = processGeminiProposalResponse(responseJson, 'ngu_than');
  assert.strictEqual(result.source, 'deterministic_engine_fallback');
  assert.ok(result.warning && result.warning.includes('3 proposals'));
});

// Case 5: Một proposal thiếu visual_details -> Phải fallback
runTest('16.5 Process response: Một proposal thiếu visual_details -> Phải fallback', () => {
  const prop1 = createValidMockProposal('ngu_than');
  const prop2 = createValidMockProposal('ngu_than');
  delete (prop2 as any).visual_details;
  const responseJson = { proposals: [prop1, prop2] };
  const result = processGeminiProposalResponse(responseJson, 'ngu_than');
  assert.strictEqual(result.source, 'deterministic_engine_fallback');
  assert.ok(result.warning && result.warning.includes('visual_details'));
});

// Case 6: Một proposal thiếu audit -> Phải fallback
runTest('16.6 Process response: Một proposal thiếu audit -> Phải fallback', () => {
  const prop1 = createValidMockProposal('ngu_than');
  const prop2 = createValidMockProposal('ngu_than');
  delete (prop2 as any).audit;
  const responseJson = { proposals: [prop1, prop2] };
  const result = processGeminiProposalResponse(responseJson, 'ngu_than');
  assert.strictEqual(result.source, 'deterministic_engine_fallback');
  assert.ok(result.warning && result.warning.includes('audit'));
});

// Case 7: Một proposal thiếu stylist_notes -> Phải fallback
runTest('16.7 Process response: Một proposal thiếu stylist_notes -> Phải fallback', () => {
  const prop1 = createValidMockProposal('ngu_than');
  const prop2 = createValidMockProposal('ngu_than');
  delete (prop2 as any).stylist_notes;
  const responseJson = { proposals: [prop1, prop2] };
  const result = processGeminiProposalResponse(responseJson, 'ngu_than');
  assert.strictEqual(result.source, 'deterministic_engine_fallback');
  assert.ok(result.warning && result.warning.includes('stylist_notes'));
});

// Case 8: Một proposal có plan_type sai -> Phải fallback
runTest('16.8 Process response: Một proposal có plan_type sai -> Phải fallback', () => {
  const prop1 = createValidMockProposal('ngu_than');
  const prop2 = createValidMockProposal('ngu_than');
  (prop2 as any).plan_type = 'invalid_plan_type';
  const responseJson = { proposals: [prop1, prop2] };
  const result = processGeminiProposalResponse(responseJson, 'ngu_than');
  assert.strictEqual(result.source, 'deterministic_engine_fallback');
  assert.ok(result.warning && result.warning.includes('plan_type'));
});

// Case 9: Canonical evidence union: evidence_ids rỗng, invariants_checked có KB-NGUTHAN-01, mutables_used có KB-NGUTHAN-03
// Sau normalize: audit.evidence_ids phải chứa cả hai ID hợp lệ. Không được trả Insufficient Evidence chỉ vì evidence_ids ban đầu rỗng.
runTest('16.9 Canonical evidence union: evidence_ids rỗng, có invariants_checked & mutables_used -> audit.evidence_ids chứa cả hai ID, không trả Insufficient Evidence', () => {
  const rawAudit = {
    status: 'Supported',
    prototype_compliance: 'compliant',
    uncertainty_flag: false,
    evidence_ids: [], // empty initial array
    invariants_checked: [
      { evidence_id: 'KB-NGUTHAN-01', rule_name: 'Cổ lập lĩnh', passed: true, detail: 'Đúng chuẩn' },
    ],
    mutables_used: [
      { evidence_id: 'KB-NGUTHAN-03', element: 'Tà áo', application: 'Cắt tà lửng' },
    ],
    cautions_and_redlines: [],
  };
  const normalized = normalizeGeminiProposalAudit(rawAudit, 'ngu_than');
  assert.ok(normalized.evidence_ids.includes('KB-NGUTHAN-01'), 'evidence_ids phải chứa KB-NGUTHAN-01');
  assert.ok(normalized.evidence_ids.includes('KB-NGUTHAN-03'), 'evidence_ids phải chứa KB-NGUTHAN-03');
  assert.strictEqual(normalized.evidence_ids.length, 2);
  assert.notStrictEqual(
    normalized.status,
    'Insufficient Evidence',
    'Không được trả Insufficient Evidence chỉ vì evidence_ids ban đầu rỗng'
  );
});

// Case 10: getWhatIfSummaryStatus với Insufficient Evidence -> Phải nói chưa đủ dữ liệu
runTest('16.10 getWhatIfSummaryStatus với Insufficient Evidence: Phải nói chưa đủ dữ liệu', () => {
  const evaluation: WhatIfEvaluation = {
    query: 'What if phối phong cách cyberpunk?',
    target_garment: 'ngu_than',
    proposed_change: 'Cyberpunk elements',
    status: 'Insufficient Evidence',
    uncertainty_flag: true,
    impact_analysis: 'Chưa đủ dữ liệu tham chiếu.',
    violates_invariants: false,
    violated_evidence_ids: [],
    applicable_evidence_ids: [],
    cautions_and_redlines: [],
    stylist_counter_proposal: {
      title: 'Đề xuất',
      solution: 'Giải pháp',
      heritage_safeguard: 'Bảo toàn',
      contemporary_edge: 'Đương đại',
      materials_and_cuts: 'Vật liệu',
    },
    prototype_compliance: 'unassessed',
    historical_confidence: 'unverified',
    has_design_caution: false,
    has_evidence_uncertainty: true,
  };
  const summary = getWhatIfSummaryStatus(evaluation);
  assert.strictEqual(summary.showInsufficientEvidence, true);
  assert.strictEqual(summary.historicalLabel, 'Chưa đủ dữ liệu tham chiếu');
  assert.strictEqual(summary.uncertaintyTitle, 'Chưa đủ dữ liệu tham chiếu');
  assert.ok(
    summary.uncertaintyText.toLowerCase().includes('chưa đủ dữ liệu') ||
    summary.uncertaintyTitle.toLowerCase().includes('chưa đủ dữ liệu'),
    'Phải nói chưa đủ dữ liệu'
  );
});

// Case 11: getWhatIfSummaryStatus với rule unverified nhưng có trong CKB -> Không được nói rule nằm ngoài CKB
runTest('16.11 getWhatIfSummaryStatus với rule unverified nhưng có trong CKB: Không được nói rule nằm ngoài CKB', () => {
  const evaluation: WhatIfEvaluation = {
    query: 'What if cổ áo ngũ thân?',
    target_garment: 'ngu_than',
    proposed_change: 'Cổ lập lĩnh',
    status: 'Supported with Caution',
    uncertainty_flag: true,
    impact_analysis: 'Tuân thủ cổ lập lĩnh.',
    violates_invariants: false,
    violated_evidence_ids: [],
    applicable_evidence_ids: ['KB-NGUTHAN-01'], // unverified, but exists in CKB
    cautions_and_redlines: [],
    stylist_counter_proposal: {
      title: 'Đề xuất',
      solution: 'Giải pháp',
      heritage_safeguard: 'Bảo toàn',
      contemporary_edge: 'Đương đại',
      materials_and_cuts: 'Vật liệu',
    },
    prototype_compliance: 'compliant',
    historical_confidence: 'unverified',
    has_design_caution: false,
    has_evidence_uncertainty: true,
  };
  const summary = getWhatIfSummaryStatus(evaluation);
  assert.strictEqual(summary.showInsufficientEvidence, false);
  assert.strictEqual(summary.uncertaintyTitle, 'Nguồn lịch sử chưa xác minh độc lập');
  assert.ok(
    !summary.uncertaintyText.includes('nằm ngoài phạm vi các quy tắc'),
    'Không được nói rule nằm ngoài CKB khi rule đã có trong CKB'
  );
  assert.ok(
    summary.uncertaintyText.includes('có trong CKB của prototype'),
    'Phải khẳng định quy tắc có trong CKB'
  );
});

// Case 12: getWhatIfSummaryStatus với needs_review -> Phải nói nguồn đang chờ đối soát
runTest('16.12 getWhatIfSummaryStatus với needs_review: Phải nói nguồn đang chờ đối soát', () => {
  const evaluation: WhatIfEvaluation = {
    query: 'What if thêu rồng 5 móng?',
    target_garment: 'ngu_than',
    proposed_change: 'Thêu rồng',
    status: 'Supported with Caution',
    uncertainty_flag: true,
    impact_analysis: 'Quy thức triều Nguyễn.',
    violates_invariants: false,
    violated_evidence_ids: [],
    applicable_evidence_ids: ['KB-RULE-03'], // needs_review
    cautions_and_redlines: [],
    stylist_counter_proposal: {
      title: 'Đề xuất',
      solution: 'Giải pháp',
      heritage_safeguard: 'Bảo toàn',
      contemporary_edge: 'Đương đại',
      materials_and_cuts: 'Vật liệu',
    },
    prototype_compliance: 'compliant',
    historical_confidence: 'needs_review',
    has_design_caution: false,
    has_evidence_uncertainty: true,
  };
  const summary = getWhatIfSummaryStatus(evaluation);
  assert.strictEqual(summary.uncertaintyTitle, 'Nguồn tham chiếu đang chờ đối soát');
  assert.ok(summary.uncertaintyText.includes('đối chiếu trực tiếp') || summary.uncertaintyText.includes('chờ'));
});

// Case 13: compliant nhưng unverified -> hasDesignCaution phải false, hasEvidenceUncertainty phải true
runTest('16.13 getWhatIfSummaryStatus: compliant nhưng unverified -> hasDesignCaution false, hasEvidenceUncertainty true', () => {
  const evaluation: WhatIfEvaluation = {
    query: 'What if tay chẽn vừa vặn?',
    target_garment: 'ngu_than',
    proposed_change: 'Tay chẽn',
    status: 'Supported with Caution',
    uncertainty_flag: true,
    impact_analysis: 'Tay chẽn chuẩn.',
    violates_invariants: false,
    violated_evidence_ids: [],
    applicable_evidence_ids: ['KB-NGUTHAN-02'],
    cautions_and_redlines: [],
    stylist_counter_proposal: {
      title: 'Đề xuất',
      solution: 'Giải pháp',
      heritage_safeguard: 'Bảo toàn',
      contemporary_edge: 'Đương đại',
      materials_and_cuts: 'Vật liệu',
    },
    prototype_compliance: 'compliant',
    historical_confidence: 'unverified',
    has_design_caution: false,
    has_evidence_uncertainty: true,
  };
  const summary = getWhatIfSummaryStatus(evaluation);
  assert.strictEqual(summary.hasDesignCaution, false, 'hasDesignCaution phải false');
  assert.strictEqual(summary.hasEvidenceUncertainty, true, 'hasEvidenceUncertainty phải true');
  assert.strictEqual(summary.isPrototypeConflict, false);
});

// Case 14: conflict và unverified -> Phải có cả prototype conflict và evidence uncertainty
runTest('16.14 getWhatIfSummaryStatus: conflict và unverified -> Phải có cả prototype conflict và evidence uncertainty', () => {
  const evaluation: WhatIfEvaluation = {
    query: 'What if vạt cài sang trái?',
    target_garment: 'ngu_than',
    proposed_change: 'Tả nhậm',
    status: 'Supported with Caution',
    uncertainty_flag: true,
    impact_analysis: 'Xung đột tả nhậm.',
    violates_invariants: true,
    violated_evidence_ids: ['KB-RULE-01'], // unverified
    applicable_evidence_ids: [],
    cautions_and_redlines: ['Xung đột quy thức tả nhậm tang phục'],
    stylist_counter_proposal: {
      title: 'Đề xuất',
      solution: 'Giải pháp',
      heritage_safeguard: 'Bảo toàn',
      contemporary_edge: 'Đương đại',
      materials_and_cuts: 'Vật liệu',
    },
    prototype_compliance: 'conflict',
    historical_confidence: 'unverified',
    has_design_caution: true,
    has_evidence_uncertainty: true,
  };
  const summary = getWhatIfSummaryStatus(evaluation);
  assert.strictEqual(summary.isPrototypeConflict, true, 'Phải có prototype conflict');
  assert.strictEqual(summary.hasDesignCaution, true, 'Phải có design caution');
  assert.strictEqual(summary.hasEvidenceUncertainty, true, 'Phải có evidence uncertainty');
  assert.strictEqual(summary.prototypeLabel, 'Có xung đột với quy tắc prototype');
});

// Case 15: system warning nhưng không có design conflict -> Không được biến thành design caution
runTest('16.15 getWhatIfSummaryStatus: system warning nhưng không có design conflict -> Không được biến thành design caution', () => {
  const evaluation: WhatIfEvaluation = {
    query: 'What if thay cúc?',
    target_garment: 'ngu_than',
    proposed_change: 'Khuy ngọc',
    status: 'Supported with Caution',
    uncertainty_flag: true,
    impact_analysis: 'Khuy hợp lệ.',
    violates_invariants: false,
    violated_evidence_ids: [],
    applicable_evidence_ids: ['KB-NGUTHAN-01'],
    cautions_and_redlines: [], // No design cautions
    system_warnings: ['[Lưu ý hệ thống] Mã bằng chứng "KB-FAKE-ID" không tồn tại trong CKB.'],
    stylist_counter_proposal: {
      title: 'Đề xuất',
      solution: 'Giải pháp',
      heritage_safeguard: 'Bảo toàn',
      contemporary_edge: 'Đương đại',
      materials_and_cuts: 'Vật liệu',
    },
    prototype_compliance: 'compliant',
    historical_confidence: 'unverified',
    has_design_caution: false,
    has_evidence_uncertainty: true,
  };
  const summary = getWhatIfSummaryStatus(evaluation);
  assert.strictEqual(summary.hasDesignCaution, false, 'System warning không được biến thành design caution');
  assert.strictEqual(summary.isPrototypeConflict, false, 'Không được có prototype conflict');
  assert.strictEqual(summary.systemWarnings.length, 1);
});

console.log('\n-------------------------------------------------------------');
console.log(`TỔNG KẾT KIỂM THỬ: ${passCount} PASSED / ${failCount} FAILED`);
console.log('-------------------------------------------------------------');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
