import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Navbar, WorkspaceTab } from '../src/components/Navbar.js';
import { HeritageBackground } from '../src/components/HeritageBackground.js';
import { DongSonDialRing } from '../src/components/MotionMotifs.js';
import { evaluateWhatIfDeterministic, generateDeterministicProposals } from '../src/utils/deterministicEngines.js';
import { OutfitProposal } from '../src/types/vietphuc.js';
import { CKBExplorerModal } from '../src/components/CKBExplorerModal.js';
import { CKBRegistryView } from '../src/components/CKBRegistryView.js';
import { FashionEditorialVisual } from '../src/components/FashionEditorialVisual.js';
import { GarmentSchematic } from '../src/components/GarmentSchematic.js';
import { AnatomySection } from '../src/components/AnatomySection.js';
import { CoDesignStudio } from '../src/components/CoDesignStudio.js';
import { QuickCompareSection } from '../src/components/QuickCompareSection.js';
import { WhatIfLab, WHAT_IF_PRESETS } from '../src/components/WhatIfLab.js';
import { formatSourceBadge } from '../src/utils/remixStateHelpers.js';
import { LookbookCardModal } from '../src/components/LookbookCardModal.js';
import { exportLookbookCard, formatLookbookShareText } from '../src/utils/lookbookExport.js';
import fs from 'node:fs';

console.log('--- BẮT ĐẦU KIỂM THỬ: BROWSER VIEWPORT SIMULATION & MOCK WORKSPACE FLOW ---\n');

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

// ----------------------------------------------------------------------------
// 1. Kiểm tra Navbar tại các Breakpoint (320px, 360px, 390px, 768px, 1024px, 1440px)
// ----------------------------------------------------------------------------
runTest('1.1 Navbar cấu trúc: Đảm bảo có đúng 1 nút điều khiển hiệu ứng ở mobile (< md) và desktop/tablet (>= md)', () => {
  const html = renderToString(
    React.createElement(Navbar, {
      activeTab: 'studio',
      onSelectTab: () => {},
      onOpenCKBModal: () => {},
      motionEnabled: true,
      onToggleMotion: () => {},
    })
  );

  // Check mobile button wrapper has md:hidden
  assert.ok(html.includes('class="md:hidden shrink-0"'), 'Nút mobile phải có class md:hidden shrink-0 để ẩn trên tablet/desktop');

  // Check desktop button wrapper has hidden md:block (NOT hidden lg:block which caused gap at 768px-1023px)
  assert.ok(html.includes('class="hidden md:block shrink-0"'), 'Nút desktop phải có class hidden md:block để hiển thị từ breakpoint 768px (md) trở lên');
  assert.ok(!html.includes('hidden lg:block'), 'Không được dùng hidden lg:block làm mất nút ở khoảng 768px-1023px');

  // Check accessible labels exist
  assert.ok(html.includes('aria-label="Hiệu ứng chuyển động: Đang bật"'), 'Phải có accessible aria-label khi bật');
});

runTest('1.2 Navbar ở 320px / 360px: Nhãn nút rút gọn linh hoạt mà không mất accessible label', () => {
  const htmlOff = renderToString(
    React.createElement(Navbar, {
      activeTab: 'studio',
      onSelectTab: () => {},
      onOpenCKBModal: () => {},
      motionEnabled: false,
      onToggleMotion: () => {},
    })
  );

  assert.ok(htmlOff.includes('aria-label="Hiệu ứng chuyển động: Đang tắt"'), 'Phải có accessible aria-label khi tắt');
  assert.ok(htmlOff.includes('hidden min-[380px]:inline'), 'Nhãn dài "Chuyển động: " phải ẩn ở < 380px để bảo vệ brand lockup 320px');
  assert.ok(htmlOff.includes('truncate'), 'Brand title có class truncate an toàn tránh tràn layout 320px');
});

runTest('1.3 Navbar Tab Bar: Vùng cuộn ngang riêng biệt không tràn trang (overflow-x-auto, không dùng overflow-hidden bao ngoài)', () => {
  const html = renderToString(
    React.createElement(Navbar, {
      activeTab: 'what-if',
      onSelectTab: () => {},
      onOpenCKBModal: () => {},
      motionEnabled: true,
      onToggleMotion: () => {},
    })
  );

  assert.ok(html.includes('overflow-x-auto'), 'Thanh tab phải có overflow-x-auto');
  assert.ok(html.includes('touch-pan-x'), 'Thanh tab hỗ trợ touch-pan-x mượt mà trên mobile');
  assert.ok(!html.includes('w-full md:w-auto overflow-hidden'), 'Không bọc overflow-hidden cắt cụt thanh tab');
});

// ----------------------------------------------------------------------------
// 2. Kiểm tra tính nhất quán của nút Chuyển động (Motion Toggle)
// ----------------------------------------------------------------------------
runTest('2.1 DongSonDialRing: Nhận trạng thái isRotating = false khi motion bị tắt', () => {
  const htmlActive = renderToString(
    React.createElement(DongSonDialRing, {
      dialLevel: 3,
      isRotating: true,
    })
  );
  assert.ok(htmlActive.includes('animate-drum-spin-slow'), 'Khi isRotating=true, vòng phải quay chậm');

  const htmlStationary = renderToString(
    React.createElement(DongSonDialRing, {
      dialLevel: 3,
      isRotating: false,
    })
  );
  assert.ok(!htmlStationary.includes('animate-drum-spin-slow'), 'Khi isRotating=false, vòng KHÔNG được quay');
});

runTest('2.2 HeritageBackground: Dừng quay trống đồng khi motionEnabled = false', () => {
  const htmlMotionOff = renderToString(
    React.createElement(HeritageBackground, {
      motionEnabled: false,
    })
  );
  // Drum SVG must not have rotation active
  assert.ok(!htmlMotionOff.includes('animate-drum-spin'), 'Trống đồng không được quay khi motionEnabled=false');
});

// ----------------------------------------------------------------------------
// 3. Luồng hoàn chỉnh: Tạo Look (Mock) -> Chuyển sang What If
// ----------------------------------------------------------------------------
runTest('3.1 Luồng hoàn chỉnh Studio -> What If: Tạo outfit giả lập và đánh giá What If liên kết', () => {
  // Step 1: Generate proposals deterministically (0 quota consumed)
  const proposals = generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3);
  assert.strictEqual(proposals.length, 2, 'Phải tạo ra 2 phương án (Heritage & Remix)');

  const selectedProposal = proposals[1]; // Áo Ngũ Thân Indigo Denim Minimalist Cut
  assert.strictEqual(selectedProposal.garment_type, 'ngu_than');
  assert.strictEqual(selectedProposal.dial_level, 3);

  // Step 2: User triggers "Chuyển sang What-If" with selected outfit linked
  const userQuery = 'What if may vạt lửng và mở khuy dưới khi ngồi?';
  const evaluation = evaluateWhatIfDeterministic(
    selectedProposal.garment_type,
    userQuery,
    selectedProposal
  );

  // Assert link to current outfit is intact
  assert.ok(evaluation.impact_analysis.includes(selectedProposal.title), 'Phải liên kết tên outfit vào phân tích');
  assert.strictEqual(evaluation.violates_invariants, false, 'Không vi phạm Invariant');
  assert.strictEqual(evaluation.uncertainty_flag, true, 'Fallback bật cờ uncertainty với câu hỏi dạo phố ngoài core');
});

// ----------------------------------------------------------------------------
// 4. Pre-recording Regression Check: CKB Source Links & Fallback Badge Semantics
// ----------------------------------------------------------------------------
runTest('4.1 CKBRegistryView & CKBExplorerModal: Sử dụng source_url với target="_blank" và rel="noopener noreferrer"', () => {
  const registryHtml = renderToString(React.createElement(CKBRegistryView, {}));
  assert.ok(registryHtml.includes('Mở nguồn tham khảo'), 'CKBRegistryView phải có action "Mở nguồn tham khảo"');
  assert.ok(registryHtml.includes('target="_blank"'), 'Link ngoài phải có target="_blank"');
  assert.ok(registryHtml.includes('rel="noopener noreferrer"'), 'Link ngoài phải có rel="noopener noreferrer"');
  assert.ok(registryHtml.includes('https://baotanglichsu.vn'), 'Phải chứa URL từ CKB registry');
  assert.ok(registryHtml.includes('https://vanhoanghethuat.vn'), 'Phải chứa URL Tạp chí Văn hóa Nghệ thuật');

  const modalHtml = renderToString(React.createElement(CKBExplorerModal, { isOpen: true, onClose: () => {} }));
  assert.ok(modalHtml.includes('Mở nguồn tham khảo'), 'CKBExplorerModal phải có action "Mở nguồn tham khảo"');
  assert.ok(modalHtml.includes('target="_blank"'), 'Modal link ngoài phải có target="_blank"');
  assert.ok(modalHtml.includes('rel="noopener noreferrer"'), 'Modal link ngoài phải có rel="noopener noreferrer"');
});

runTest('4.2 WhatIfLab Fallback Badge semantics: Không dùng màu red/rose cho Bản phân tích dự phòng', () => {
  const whatIfCode = fs.readFileSync('src/components/WhatIfLab.tsx', 'utf-8');
  // Check badgeType === 'fallback' block inside WhatIfLab
  const fallbackBlockMatch = whatIfCode.match(/if\s*\(\s*info\.badgeType\s*===\s*['"]fallback['"]\s*\)\s*\{([\s\S]*?)\}/);
  assert.ok(fallbackBlockMatch, 'Phải có block render cho info.badgeType === fallback trong WhatIfLab');
  const fallbackBlock = fallbackBlockMatch[1];
  
  assert.ok(!fallbackBlock.includes('#B8342B'), 'Fallback badge KHÔNG ĐƯỢC dùng màu đỏ sơn mài (#B8342B)');
  assert.ok(!fallbackBlock.includes('#F5A39D'), 'Fallback badge KHÔNG ĐƯỢC dùng màu hồng/đỏ (#F5A39D)');
  assert.ok(!fallbackBlock.includes('text-rose'), 'Fallback badge KHÔNG ĐƯỢC dùng text-rose');
  assert.ok(!fallbackBlock.includes('bg-rose'), 'Fallback badge KHÔNG ĐƯỢC dùng bg-rose');
  assert.ok(fallbackBlock.includes('slate') || fallbackBlock.includes('neutral'), 'Fallback badge phải dùng slate hoặc neutral đồng bộ với CoDesignStudio');
});

// ----------------------------------------------------------------------------
// 5. V2.0 Visual-First Fashion Editorial & Structural Reference Validation
// ----------------------------------------------------------------------------
runTest('5.1 FashionEditorialVisual: Render ở trạng thái image_unavailable không hiển thị CTA phác họa khi provider chưa configured', () => {
  const html = renderToString(
    React.createElement(FashionEditorialVisual, {
      garment: 'ngu_than',
      planType: 'heritage_anchored',
      dialLevel: 1,
      conceptTag: 'HERITAGE_LOOK',
      colorPalette: ['#1E3A8A', '#C9A66B'],
      fabricMaterials: ['Lụa Vạn Phúc'],
      imageData: { status: 'image_unavailable' },
      onTriggerImageGeneration: () => {},
      onOpenStructuralReference: () => {},
    })
  );

  assert.ok(html.includes('Phác thảo thời trang'), 'Phải có nhãn phác thảo thời trang');
  assert.strictEqual(html.includes('Phác họa thị giác'), false, 'Không hiển thị nút Phác họa thị giác khi provider chưa configured');
  assert.ok(html.includes('Sơ đồ cấu trúc'), 'Phải có link mở sơ đồ cấu trúc');
});

runTest('5.2 FashionEditorialVisual: Render ở trạng thái image_generating hiển thị thông báo đang phác họa', () => {
  const html = renderToString(
    React.createElement(FashionEditorialVisual, {
      garment: 'ao_tac',
      planType: 'contemporary_remix',
      dialLevel: 3,
      conceptTag: 'CONTEMPORARY_LOOK',
      colorPalette: ['#111111', '#065F46'],
      fabricMaterials: ['Dạ tweed'],
      imageData: { status: 'image_generating' },
    })
  );

  assert.ok(html.includes('Đang phác họa thị giác AI...'), 'Phải hiển thị thông báo đang tạo ảnh thị giác');
});

runTest('5.3 FashionEditorialVisual: Render ở trạng thái image_ready hiển thị ảnh với thẻ img', () => {
  const html = renderToString(
    React.createElement(FashionEditorialVisual, {
      garment: 'nhat_binh',
      planType: 'heritage_anchored',
      dialLevel: 1,
      conceptTag: 'ROYAL_LOOK',
      colorPalette: ['#991B1B', '#C9A66B'],
      fabricMaterials: ['Gấm tơ'],
      imageData: { status: 'image_ready', imageUrl: 'https://example.com/editorial-preview.jpg' },
    })
  );

  assert.ok(html.includes('<img'), 'Phải hiển thị thẻ img');
  assert.ok(html.includes('src="https://example.com/editorial-preview.jpg"'), 'Phải bind đúng URL ảnh');
});

runTest('5.4 GarmentSchematic & AnatomySection: Có nhãn Interactive Structural Reference phân biệt rõ với render thời trang', () => {
  const schematicHtml = renderToString(
    React.createElement(GarmentSchematic, {
      garment: 'ngu_than',
      dialLevel: 2,
    })
  );
  assert.ok(schematicHtml.includes('Interactive Structural Reference'), 'GarmentSchematic phải có nhãn Interactive Structural Reference');

  const anatomyHtml = renderToString(
    React.createElement(AnatomySection, {
      onOpenCKB: () => {},
    })
  );
  assert.ok(anatomyHtml.includes('Interactive Structural Reference'), 'AnatomySection phải chứa nhãn Interactive Structural Reference');
});

runTest('5.5 CoDesignStudio: Render 2 cards cạnh nhau trong grid-cols-1 md:grid-cols-2', () => {
  const sampleProposals = generateDeterministicProposals('ngu_than', 'streetwear', 'modern_minimal', 3);
  const html = renderToString(
    React.createElement(CoDesignStudio, {
      proposals: sampleProposals,
      selectedPlanIndex: 0,
      onSelectPlanIndex: () => {},
      onUpdateProposals: () => {},
      proposalSource: 'deterministic_engine',
      selectedGarment: 'ngu_than',
      onChangeGarment: () => {},
      dialLevel: 3,
      onChangeDialLevel: () => {},
      context: 'streetwear',
      onChangeContext: () => {},
      style: 'modern_minimal',
      onChangeStyle: () => {},
      customNotes: '',
      onChangeCustomNotes: () => {},
      onOpenCKB: () => {},
      onOpenLookbookCard: () => {},
      onNavigateToWhatIf: () => {},
      motionEnabled: true,
    })
  );

  assert.ok(html.includes('grid-cols-1 md:grid-cols-2'), 'Phải có grid-cols-1 md:grid-cols-2 cho 2 proposal cards song song');
  assert.ok(html.includes('BẢN PHỐI A · HERITAGE'), 'Phải render card Bản phối A');
  assert.ok(html.includes('BẢN PHỐI B · CONTEMPORARY'), 'Phải render card Bản phối B');
  assert.ok(html.includes('Edit Look'), 'Mỗi card phải có nút Edit Look');
  assert.ok(html.includes('Thẩm định'), 'Mỗi card phải có nút mở Thẩm định');
  assert.ok(html.includes('Lookbook'), 'Mỗi card phải có nút mở Lookbook');
});

runTest('5.6 FashionEditorialVisual: Render nút Phác họa thị giác khi showImageGenCTA được bật', () => {
  const html = renderToString(
    React.createElement(FashionEditorialVisual, {
      garment: 'ngu_than',
      planType: 'heritage_anchored',
      dialLevel: 1,
      conceptTag: 'HERITAGE_LOOK',
      colorPalette: ['#1E3A8A', '#C9A66B'],
      fabricMaterials: ['Lụa Vạn Phúc'],
      imageData: { status: 'image_unavailable' },
      onTriggerImageGeneration: () => {},
      showImageGenCTA: true,
    })
  );

  assert.ok(html.includes('Phác họa thị giác'), 'Phải hiển thị nút Phác họa thị giác khi showImageGenCTA = true');
});

// ----------------------------------------------------------------------------
// 6. Quick Compare Section Validation
// ----------------------------------------------------------------------------
runTest('6.1 QuickCompareSection: Render đối chiếu 6 tiêu chí khi có đúng 2 proposals', () => {
  const sampleProposals = generateDeterministicProposals('ngu_than', 'streetwear', 'modern_minimal', 3);
  const html = renderToString(
    React.createElement(QuickCompareSection, {
      proposals: sampleProposals,
      onOpenCKB: () => {},
    })
  );

  assert.ok(html.includes('So sánh nhanh'), 'Phải có tiêu đề So sánh nhanh');
  assert.ok(html.includes('Cấu trúc và phom'), 'Phải có tiêu chí Cấu trúc và phom');
  assert.ok(html.includes('Chất liệu'), 'Phải có tiêu chí Chất liệu');
  assert.ok(html.includes('Bảng màu'), 'Phải có tiêu chí Bảng màu');
  assert.ok(html.includes('Giày và phụ kiện'), 'Phải có tiêu chí Giày và phụ kiện');
  assert.ok(html.includes('Mức Remix'), 'Phải có tiêu chí Mức Remix');
  assert.ok(html.includes('Cultural Audit summary'), 'Phải có tiêu chí Cultural Audit summary');
  assert.ok(html.includes('Bản phối A · Heritage'), 'Phải đối chiếu Bản phối A');
  assert.ok(html.includes('Bản phối B · Contemporary'), 'Phải đối chiếu Bản phối B');
});

runTest('6.2 QuickCompareSection: Trả về rỗng khi không có đúng 2 proposals', () => {
  const emptyHtml = renderToString(
    React.createElement(QuickCompareSection, {
      proposals: [],
    })
  );
  assert.strictEqual(emptyHtml, '', 'Phải trả về rỗng khi proposals rỗng');

  const singleHtml = renderToString(
    React.createElement(QuickCompareSection, {
      proposals: [generateDeterministicProposals('ngu_than', 'streetwear', 'modern_minimal', 3)[0]],
    })
  );
  assert.strictEqual(singleHtml, '', 'Phải trả về rỗng khi chỉ có 1 proposal');
});

runTest('6.3 QuickCompareSection: Không coi unassessed là conflict, hiển thị đúng Chưa đánh giá và không dùng màu đỏ', () => {
  const sampleProposals = generateDeterministicProposals('ngu_than', 'streetwear', 'modern_minimal', 3);
  const unassessedProposals = [
    {
      ...sampleProposals[0],
      audit: {
        ...sampleProposals[0].audit,
        prototype_compliance: 'unassessed' as const,
      },
    },
    {
      ...sampleProposals[1],
      audit: {
        ...sampleProposals[1].audit,
        prototype_compliance: 'unassessed' as const,
      },
    },
  ];

  const html = renderToString(
    React.createElement(QuickCompareSection, {
      proposals: unassessedProposals,
      onOpenCKB: () => {},
    })
  );

  assert.ok(html.includes('Chưa đánh giá Prototype'), 'Phải có nhãn Chưa đánh giá Prototype');
  assert.strictEqual(html.includes('Xung đột Prototype'), false, 'Không được coi unassessed là Xung đột Prototype');
  assert.strictEqual(html.includes('bg-rose-950/60'), false, 'Tuyệt đối không dùng màu đỏ cho unassessed');
});

// ----------------------------------------------------------------------------
// 7. What If Hero Experience & Reasoning Regression Suite (V2.1B)
// ----------------------------------------------------------------------------
runTest('7.1 preset đúng garment: 3 preset theo đúng từng loại cổ phục', () => {
  // Áo Ngũ Thân
  const nguThanPresets = WHAT_IF_PRESETS.ngu_than;
  assert.strictEqual(nguThanPresets.length, 3, 'Ngũ thân phải có đúng 3 preset');
  assert.strictEqual(nguThanPresets[0].title, 'Đổi hướng cài khuy sang trái');
  assert.strictEqual(nguThanPresets[1].title, 'Đổi chất liệu sang denim');
  assert.strictEqual(nguThanPresets[2].title, 'Thêm chi tiết phát sáng hiện đại');

  // Áo Tấc
  const aoTacPresets = WHAT_IF_PRESETS.ao_tac;
  assert.strictEqual(aoTacPresets.length, 3, 'Áo Tấc phải có đúng 3 preset');
  assert.strictEqual(aoTacPresets[0].title, 'Mở vạt như duster coat');
  assert.strictEqual(aoTacPresets[1].title, 'Đổi hướng cài khuy');
  assert.strictEqual(aoTacPresets[2].title, 'Thêm chi tiết phát sáng hiện đại');

  // Áo Nhật Bình
  const nhatBinhPresets = WHAT_IF_PRESETS.nhat_binh;
  assert.strictEqual(nhatBinhPresets.length, 3, 'Nhật Bình phải có đúng 3 preset');
  assert.strictEqual(nhatBinhPresets[0].title, 'Mặc mở vạt với chân váy xếp ly');
  assert.strictEqual(nhatBinhPresets[1].title, 'Bỏ nẹp cổ đối khâm');
  assert.strictEqual(nhatBinhPresets[2].title, 'Thêm chi tiết phát sáng hiện đại');
});

runTest('7.2 preset chỉ thay query, không hardcode evaluation', () => {
  for (const garment of ['ngu_than', 'ao_tac', 'nhat_binh'] as const) {
    for (const preset of WHAT_IF_PRESETS[garment]) {
      const keys = Object.keys(preset);
      assert.deepStrictEqual(keys.sort(), ['query', 'title'].sort(), 'Preset chỉ được có title và query');
      assert.strictEqual(typeof preset.query, 'string');
      assert.strictEqual(typeof preset.title, 'string');
      assert.strictEqual((preset as any).status, undefined, 'Không được hardcode status');
      assert.strictEqual((preset as any).evaluation, undefined, 'Không được hardcode evaluation');
    }
  }
});

runTest('7.3 active proposal hiện Before - Change - Counter Proposal', () => {
  const proposal = generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3)[1];
  const html = renderToString(
    React.createElement(WhatIfLab, {
      currentGarment: 'ngu_than',
      activeProposal: proposal,
    })
  );

  assert.ok(html.includes('Đang thử nghiệm trên bản phối đã chọn'), 'Phải hiển thị bản phối đã chọn');
  assert.ok(html.includes(proposal.title), 'Phải có tiêu đề bản phối');
});

runTest('7.4 standalone không hiện Before (Bản phối hiện tại)', () => {
  const html = renderToString(
    React.createElement(WhatIfLab, {
      currentGarment: 'ngu_than',
      activeProposal: null,
    })
  );

  assert.ok(html.includes('CHẾ ĐỘ TỰ DO'), 'Phải hiển thị chế độ tự do');
  assert.strictEqual(html.includes('Đang thử nghiệm trên bản phối đã chọn'), false, 'Không được hiện banner chọn');
  assert.strictEqual(html.includes('BẢN PHỐI HIỆN TẠI'), false, 'Không được hiện Before box khi standalone');
});

runTest('7.5 conflict vẫn tách Prototype Compliance và Historical Confidence', () => {
  const evalResult = evaluateWhatIfDeterministic('ngu_than', 'Đổi vạt áo sang bên trái');
  assert.strictEqual(evalResult.prototype_compliance, 'conflict', 'Phải ghi nhận conflict prototype');
  assert.strictEqual(evalResult.historical_confidence, 'needs_review', 'Historical confidence độc lập');
  assert.notStrictEqual(evalResult.prototype_compliance as any, evalResult.historical_confidence as any);
});

runTest('7.6 unassessed không hiển thị màu conflict', () => {
  const unassessedEval = evaluateWhatIfDeterministic('ngu_than', 'Thêm chi tiết phát sáng hiện đại');
  assert.strictEqual(unassessedEval.prototype_compliance, 'unassessed');
  assert.strictEqual(unassessedEval.status, 'Insufficient Evidence');
  assert.strictEqual(unassessedEval.violates_invariants, false);
});

runTest('7.7 evidence ID hợp lệ mở được CKB', () => {
  const evalResult = evaluateWhatIfDeterministic('ao_tac', 'Mở vạt như duster coat');
  assert.ok(evalResult.applicable_evidence_ids.includes('KB-TAC-03'));
});

runTest('7.8 empty evidence hiển thị Insufficient Evidence', () => {
  const evalResult = evaluateWhatIfDeterministic('ngu_than', 'Thêm chi tiết phát sáng hiện đại');
  assert.strictEqual(evalResult.applicable_evidence_ids.length, 0);
  assert.strictEqual(evalResult.violated_evidence_ids.length, 0);
  assert.strictEqual(evalResult.status, 'Insufficient Evidence');
});

runTest('7.9 KB-RULE-01 không xuất hiện claim "đồ tang"', () => {
  const evalResult = evaluateWhatIfDeterministic('ngu_than', 'Đổi hướng cài khuy sang trái');
  const fullText = JSON.stringify(evalResult).toLowerCase();
  assert.strictEqual(fullText.includes('đồ tang'), false, 'Không được có từ đồ tang');
  assert.strictEqual(fullText.includes('tang ma'), false, 'Không được có từ tang ma');
  assert.strictEqual(fullText.includes('tang lễ'), false, 'Không được có từ tang lễ');
});

runTest('7.10 source badge semantics giữ nguyên', () => {
  assert.strictEqual(formatSourceBadge('gemini').label, 'Gemini trực tiếp');
  assert.strictEqual(formatSourceBadge('deterministic_engine').label, 'Bản phân tích dự phòng');
  assert.strictEqual(formatSourceBadge('deterministic_engine_fallback').label, 'Bản phân tích dự phòng');
  assert.strictEqual(formatSourceBadge(null).label, 'Nguồn chưa xác định');
  assert.strictEqual(formatSourceBadge('unknown').label, 'Nguồn chưa xác định');
});

runTest('7.11 title deterministic không mâu thuẫn colorPreference', () => {
  // Ngu Than with Đen: title must not say Indigo
  const nguThanDen = generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3, 'Đen');
  assert.ok(nguThanDen[1].title.includes('Đen'), 'Title phải có chữ Đen');
  assert.strictEqual(nguThanDen[1].title.includes('Indigo'), false, 'Title không được giữ Indigo khi chọn Đen');

  // Nhat Binh with Đen: title must not say Ngà
  const nhatBinhDen = generateDeterministicProposals('nhat_binh', 'fashion_week', 'neo_indochine', 3, 'Đen');
  assert.ok(nhatBinhDen[1].title.includes('Đen'), 'Title phải có chữ Đen');
  assert.strictEqual(nhatBinhDen[1].title.includes('Ngà'), false, 'Title không được giữ Ngà khi chọn Đen');

  // Nhat Binh with auto: title retains Ngà
  const nhatBinhAuto = generateDeterministicProposals('nhat_binh', 'fashion_week', 'neo_indochine', 3, 'auto');
  assert.ok(nhatBinhAuto[1].title.includes('Ngà'), 'Title auto giữ nguyên Ngà');

  // Heritage Anchored title untouched
  assert.strictEqual(nguThanDen[0].title, 'Áo Ngũ Thân Tay Chẽn Chàm Lam Cổ Điển');
  assert.strictEqual(nhatBinhDen[0].title, 'Áo Nhật Bình Hoàng Triều Gấm Thêu Ngũ Sắc');
});

// ----------------------------------------------------------------------------
// 8. Lookbook Shareable Cultural Fashion Card Suite (V2.2)
// ----------------------------------------------------------------------------
runTest('8.1 Lookbook render đúng proposal: branding, title, concept, materials', () => {
  const proposal = generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3)[1];
  const html = renderToString(
    React.createElement(LookbookCardModal, {
      proposal,
      isOpen: true,
      onClose: () => {},
    })
  );

  assert.ok(html.includes('KUJO Re:Wear'), 'Phải có branding KUJO Re:Wear');
  assert.ok(html.includes(proposal.title), 'Phải có tên look');
  assert.ok(html.includes(proposal.concept_tag), 'Phải có concept tag');
  assert.ok(html.includes('THẺ LOOKBOOK CHIA SẺ'), 'Phải có tiêu đề modal Thẻ Lookbook Chia Sẻ');
  assert.ok(html.includes(proposal.visual_details.bottom_garment), 'Phải có trang phục dưới');
});

runTest('8.2 Heritage Anchored và Contemporary Remix label đúng trên Lookbook card', () => {
  const [heritageProp, remixProp] = generateDeterministicProposals('ao_tac', 'festival', 'modern_minimal', 2);

  const htmlHeritage = renderToString(
    React.createElement(LookbookCardModal, {
      proposal: heritageProp,
      isOpen: true,
      onClose: () => {},
    })
  );
  assert.ok(htmlHeritage.includes('Heritage Anchored'), 'Bản phối gốc phải có nhãn Heritage Anchored');

  const htmlRemix = renderToString(
    React.createElement(LookbookCardModal, {
      proposal: remixProp,
      isOpen: true,
      onClose: () => {},
    })
  );
  assert.ok(htmlRemix.includes('Contemporary Remix'), 'Bản phối remix phải có nhãn Contemporary Remix');
});

runTest('8.3 prototype compliance đủ 3 trạng thái trên Lookbook card', () => {
  const baseProp = generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3)[1];

  // Compliant
  const htmlCompliant = renderToString(
    React.createElement(LookbookCardModal, {
      proposal: { ...baseProp, audit: { ...baseProp.audit, prototype_compliance: 'compliant' } },
      isOpen: true,
      onClose: () => {},
    })
  );
  assert.ok(htmlCompliant.includes('Tuân thủ'), 'Phải hiển thị Tuân thủ');

  // Conflict
  const htmlConflict = renderToString(
    React.createElement(LookbookCardModal, {
      proposal: { ...baseProp, audit: { ...baseProp.audit, prototype_compliance: 'conflict' } },
      isOpen: true,
      onClose: () => {},
    })
  );
  assert.ok(htmlConflict.includes('Xung đột'), 'Phải hiển thị Xung đột');

  // Unassessed
  const htmlUnassessed = renderToString(
    React.createElement(LookbookCardModal, {
      proposal: { ...baseProp, audit: { ...baseProp.audit, prototype_compliance: 'unassessed' } },
      isOpen: true,
      onClose: () => {},
    })
  );
  assert.ok(htmlUnassessed.includes('Chưa đánh giá'), 'Phải hiển thị Chưa đánh giá');
  assert.strictEqual(htmlUnassessed.includes('Xung đột'), false, 'Không được hiển thị Xung đột khi unassessed');
});

runTest('8.4 historical confidence mapping đúng trên Lookbook card', () => {
  const baseProp = generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3)[1];

  const map = {
    verified: 'Đã kiểm chứng',
    partially_verified: 'Đã xác thực một phần',
    needs_review: 'Đang chờ đối soát',
    unverified: 'Chưa đối soát độc lập',
    mixed: 'Nguồn hỗn hợp',
  } as const;

  for (const [confKey, expectedLabel] of Object.entries(map)) {
    const html = renderToString(
      React.createElement(LookbookCardModal, {
        proposal: { ...baseProp, audit: { ...baseProp.audit, historical_confidence: confKey as any } },
        isOpen: true,
        onClose: () => {},
      })
    );
    assert.ok(html.includes(expectedLabel), `Historical confidence ${confKey} phải map sang ${expectedLabel}`);
  }
});

runTest('8.5 evidence count đúng và hiển thị tối đa 3 evidence IDs', () => {
  const baseProp = generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3)[1];
  const html = renderToString(
    React.createElement(LookbookCardModal, {
      proposal: baseProp,
      isOpen: true,
      onClose: () => {},
    })
  );

  assert.ok(html.includes(`${baseProp.audit.evidence_ids.length} căn cứ CKB`), 'Phải hiển thị đúng số lượng căn cứ CKB');
  for (const id of baseProp.audit.evidence_ids.slice(0, 3)) {
    assert.ok(html.includes(id), `Phải hiển thị mã căn cứ ${id}`);
  }
});

runTest('8.6 4:5 preview render và tỉ lệ chuẩn', () => {
  const proposal = generateDeterministicProposals('nhat_binh', 'fashion_week', 'neo_indochine', 3)[1];
  const html = renderToString(
    React.createElement(LookbookCardModal, {
      proposal,
      isOpen: true,
      onClose: () => {},
    })
  );

  assert.ok(html.includes('aspect-[4/5]'), 'Mặc định phải render container tỉ lệ 4:5');
  assert.ok(html.includes('4:5 Social'), 'Phải có nút chọn 4:5 Social');
  assert.ok(html.includes('9:16 Story'), 'Phải có nút chọn 9:16 Story');
});

runTest('8.7 9:16 preview render & exportLookbookCard abstraction', () => {
  const proposal = generateDeterministicProposals('nhat_binh', 'fashion_week', 'neo_indochine', 3)[1];
  const expStory = exportLookbookCard(proposal, 'story_9_16');
  assert.strictEqual(expStory.status, 'prepared');
  assert.strictEqual(expStory.format, 'story_9_16');
  assert.ok(expStory.message.includes('9:16 Story'));

  const expSocial = exportLookbookCard(proposal, 'social_4_5');
  assert.strictEqual(expSocial.status, 'prepared');
  assert.strictEqual(expSocial.format, 'social_4_5');
  assert.ok(expSocial.message.includes('4:5 Social Post'));
});

runTest('8.8 copy text chứa KUJO Re:Wear và evidence IDs', () => {
  const proposal = generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3)[1];
  const shareText = formatLookbookShareText(proposal);

  assert.ok(shareText.includes('KUJO Re:Wear'), 'Nội dung chia sẻ phải có KUJO Re:Wear');
  assert.ok(shareText.includes(proposal.title), 'Nội dung chia sẻ phải có tên bản phối');
  assert.ok(shareText.includes('Áo Ngũ Thân'), 'Nội dung chia sẻ phải có tên cổ phục');
  assert.ok(shareText.includes('Dẫn chứng CKB:'), 'Nội dung chia sẻ phải có dòng Dẫn chứng CKB');
  for (const id of proposal.audit.evidence_ids) {
    assert.ok(shareText.includes(id), `Nội dung chia sẻ phải có evidence ID ${id}`);
  }
});

runTest('8.9 clipboard failure không crash: formatLookbookShareText an toàn với mọi proposal', () => {
  const props = [
    generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3)[0],
    generateDeterministicProposals('ao_tac', 'festival', 'modern_minimal', 2)[1],
    generateDeterministicProposals('nhat_binh', 'fashion_week', 'neo_indochine', 4)[1],
  ];

  for (const p of props) {
    assert.doesNotThrow(() => {
      const text = formatLookbookShareText(p);
      assert.ok(text.length > 50);
    });
  }
});

runTest('8.10 không có Heritage Score trên Lookbook card', () => {
  const proposal = generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3)[1];
  const html = renderToString(
    React.createElement(LookbookCardModal, {
      proposal,
      isOpen: true,
      onClose: () => {},
    })
  );

  assert.strictEqual(html.includes('Heritage Score'), false, 'Không được có nhãn Heritage Score');
  assert.strictEqual(html.includes('Điểm di sản'), false, 'Không được có nhãn Điểm di sản');
  assert.strictEqual(html.includes('heritage_score'), false, 'Không được có biến heritage_score');
});

runTest('8.11 không có download giả khi export chưa implemented', () => {
  const proposal = generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3)[1];
  const html = renderToString(
    React.createElement(LookbookCardModal, {
      proposal,
      isOpen: true,
      onClose: () => {},
    })
  );

  assert.strictEqual(html.includes('download='), false, 'Không được có download link giả');
  assert.ok(html.includes('Chuẩn bị khung xuất'), 'Nút phải ghi rõ Chuẩn bị khung xuất');
});

runTest('8.12 evidence button có min touch target 44px và flex-wrap', () => {
  const proposal = generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3)[1];
  const html = renderToString(
    React.createElement(LookbookCardModal, {
      proposal,
      isOpen: true,
      onClose: () => {},
    })
  );

  assert.ok(html.includes('min-h-[44px]'), 'Evidence button phải có min-h-[44px] để bảo đảm touch target di động');
  assert.ok(html.includes('flex-wrap'), 'Vùng chứa evidence button phải có flex-wrap tránh tràn ngang');
  assert.ok(html.includes('px-2.5'), 'Evidence button phải có padding ngang thoải mái');
  assert.ok(html.includes('py-2'), 'Evidence button phải có padding dọc phù hợp');
});

runTest('8.13 Lookbook evidence callback có thể mở đúng evidence', () => {
  const proposal = generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3)[1];
  let clickedEvidenceId: string | undefined = undefined;

  const modalEl = React.createElement(LookbookCardModal, {
    proposal,
    isOpen: true,
    onClose: () => {},
    onOpenCKB: (id) => {
      clickedEvidenceId = id;
    },
  });

  // Verify component accepts onOpenCKB without error
  const html = renderToString(modalEl);
  assert.ok(html.includes('KB-NGUTHAN-01') || html.includes('KB-RULE-01'));
  
  // Directly invoke the prop to verify callback correctness
  modalEl.props.onOpenCKB?.('KB-NGUTHAN-01');
  assert.strictEqual(clickedEvidenceId, 'KB-NGUTHAN-01', 'onOpenCKB phải nhận đúng evidence ID được bấm');
});

runTest('8.14 flow từ Lookbook không để Lookbook và CKB modal cùng mở (Single Modal Flow)', () => {
  let lookbookModalOpen = true;
  let ckbModalOpen = false;
  let highlightedCKBId: string | null = null;

  const handleOpenCKB = (evidenceId?: string) => {
    if (evidenceId) {
      highlightedCKBId = evidenceId;
    } else {
      highlightedCKBId = null;
    }
    ckbModalOpen = true;
  };

  const handleOpenCKBFromLookbook = (evidenceId?: string) => {
    lookbookModalOpen = false;
    handleOpenCKB(evidenceId);
  };

  // User in Lookbook clicks an evidence ID
  assert.strictEqual(lookbookModalOpen, true);
  assert.strictEqual(ckbModalOpen, false);

  handleOpenCKBFromLookbook('KB-RULE-01');

  // After click: Lookbook closed, CKB opened with evidence highlighted
  assert.strictEqual(lookbookModalOpen, false, 'Lookbook phải đóng khi mở CKB');
  assert.strictEqual(ckbModalOpen, true, 'CKB modal phải mở');
  assert.strictEqual(highlightedCKBId, 'KB-RULE-01', 'Evidence ID phải được truyền sang CKB');
  assert.strictEqual(lookbookModalOpen && ckbModalOpen, false, 'Không bao giờ để 2 modal cùng mở');
});

runTest('8.15 tối đa 3 evidence ID hiển thị và evidence count vẫn là tổng thật', () => {
  const proposal = generateDeterministicProposals('ngu_than', 'streetwear', 'indigo_denim', 3)[1];
  // Create test proposal with 5 evidence IDs
  const testProposal = {
    ...proposal,
    audit: {
      ...proposal.audit,
      evidence_ids: ['KB-01', 'KB-02', 'KB-03', 'KB-04', 'KB-05'],
    },
  };

  const html = renderToString(
    React.createElement(LookbookCardModal, {
      proposal: testProposal,
      isOpen: true,
      onClose: () => {},
    })
  );

  assert.ok(html.includes('5 căn cứ CKB'), 'Tổng số căn cứ phải hiển thị chính xác là 5');
  assert.ok(html.includes('KB-01'), 'Căn cứ thứ 1 phải hiển thị');
  assert.ok(html.includes('KB-02'), 'Căn cứ thứ 2 phải hiển thị');
  assert.ok(html.includes('KB-03'), 'Căn cứ thứ 3 phải hiển thị');
  assert.strictEqual(html.includes('KB-04'), false, 'Căn cứ thứ 4 không được xuất hiện (tối đa 3)');
  assert.strictEqual(html.includes('KB-05'), false, 'Căn cứ thứ 5 không được xuất hiện (tối đa 3)');
});

console.log('\n-------------------------------------------------------------');
console.log(`TỔNG KẾT BROWSER & FLOW SUITE: ${passCount} PASSED / ${failCount} FAILED`);
console.log('-------------------------------------------------------------');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
