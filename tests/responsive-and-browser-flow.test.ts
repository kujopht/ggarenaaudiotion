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

console.log('\n-------------------------------------------------------------');
console.log(`TỔNG KẾT BROWSER & FLOW SUITE: ${passCount} PASSED / ${failCount} FAILED`);
console.log('-------------------------------------------------------------');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
