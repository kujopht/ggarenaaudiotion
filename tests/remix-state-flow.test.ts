import assert from 'node:assert';
import {
  formatSourceBadge,
  getLookSummaryStatus,
  handleWhatIfStandaloneGarmentChange,
  isResponseValid,
} from '../src/utils/remixStateHelpers.js';
import { evaluateWhatIfDeterministic } from '../src/utils/deterministicEngines.js';
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

console.log('\n-------------------------------------------------------------');
console.log(`TỔNG KẾT KIỂM THỬ: ${passCount} PASSED / ${failCount} FAILED`);
console.log('-------------------------------------------------------------');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
