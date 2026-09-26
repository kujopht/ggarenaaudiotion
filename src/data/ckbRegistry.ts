import { CKBEntry, GarmentKey } from '../types/vietphuc';

export const CKB_REGISTRY: CKBEntry[] = [
  {
    id: 'KB-RULE-01',
    title: 'Quy thức Hữu nhậm',
    category: 'invariant',
    garment_scope: ['ngu_than', 'ao_tac'],
    core_rule: 'Vạt trái đè lên vạt phải, khuy áo cài bên phải. Đây là quy ước cấu trúc cốt lõi của áo vạt đè trong bản thử nghiệm. Khuyến cáo tránh cài vạt sang trái (Tả nhậm).',
    historical_context: 'Theo tập quán y phục Á Đông và các khảo sát hiện vật thời Nguyễn, áo ngũ thân và áo tấc có vạt đè cài sang bên phải (Hữu nhậm). Trong dân gian, kiểu cài vạt sang trái (Tả nhậm) thường được cho là gắn liền với trang phục liệm cho người đã khuất. Tuy nhiên, bản thử nghiệm hiện chưa đối chiếu văn bản quy chế chính thức về lệnh cấm tả nhậm.',
    creative_boundary: 'Quy ước Invariant của prototype. Giữ hướng vạt đè sang phải; có thể ứng dụng cúc bấm từ tính hoặc khóa kéo ẩn để người thuận tay trái thao tác thuận tiện.',
    redline_warning: 'LƯU Ý QUY THỨC: Khuyến cáo tránh đổi vạt sang trái (Tả nhậm) trên Áo Ngũ Thân và Áo Tấc vì nguy cơ đồng nhất với y phục tang lễ.',
    verification_status: 'unverified',
    confidence: 'medium',
    notes: 'Chưa có nguồn xác minh trong bản thử nghiệm. Cần tra cứu thư tịch triều Nguyễn hoặc khảo sát đối sánh đo đạc hiện vật để xác nhận tính quy thức chính thức. Áo Nhật Bình là dạng Đối Khâm (mở giữa) nên không thuộc phạm vi Hữu nhậm.',
    information_tier: {
      historical_claim: 'Thông lệ y phục vạt đè truyền thống cài sang phải; quan niệm dân gian gắn tả nhậm với y phục người khuất (chưa đối chiếu văn bản quy chuẩn chính văn).',
      prototype_rule: 'Hệ thống quy ước Hữu nhậm là Invariant đối với Áo Ngũ Thân và Áo Tấc; không áp dụng cho Áo Nhật Bình (dạng Đối khâm).',
      contemporary_suggestion: 'Ứng dụng phụ liệu công thái học ẩn (nam châm/khóa bấm) bên phải cho người thuận tay trái.',
    },
  },
  {
    id: 'KB-RULE-02',
    title: 'Cấu trúc Ngũ thân',
    category: 'invariant',
    garment_scope: ['ngu_than', 'ao_tac'],
    core_rule: 'Cấu trúc 5 thân gồm 4 thân ngoài và 1 thân con bên trong, mang ý nghĩa che chở, kín đáo và đoan chính.',
    historical_context: 'Theo quan niệm lưu truyền trong văn hóa dân gian, 5 thân áo gồm 2 thân trước, 2 thân sau tượng trưng cho tứ thân phụ mẫu, và 1 thân con (tiểu thân) nằm bên trong bên phải tượng trưng cho người mặc được chở che. Đây là cách giải thích giàu tính nhân văn nhưng mang tính truyền ngôn dân gian.',
    creative_boundary: 'Có thể điều chỉnh độ rộng hẹp phom dáng, nhưng cần tôn trọng tinh thần kín đáo và lớp lót trang nhã của cấu trúc ngũ thân.',
    verification_status: 'unverified',
    confidence: 'low',
    notes: 'Chưa có nguồn xác minh trong bản thử nghiệm. Thuyết tứ thân phụ mẫu là giải thích dân gian/truyền ngôn phổ biến, cần thẩm định thêm tư liệu thư tịch triều Nguyễn để xác nhận tính chính thống sử học. Không áp dụng cho Áo Nhật Bình (dạng Đối khâm).',
    information_tier: {
      historical_claim: 'Quan niệm dân gian giải thích kết cấu 5 thân đại diện cho sự bao bọc của phụ mẫu đối với con cái (truyền ngôn dân gian, chưa kiểm chứng thư tịch triều đình).',
      prototype_rule: 'Hệ thống giữ cấu trúc 5 thân che chở kín đáo, không khoét xẻ thân áo phản cảm.',
      contemporary_suggestion: 'Tối giản hóa lớp lót bằng vải dệt tự nhiên thoáng mát, co giãn cho giới trẻ.',
    },
  },
  {
    id: 'KB-RULE-03',
    title: 'Quy chế Biểu tượng Hoàng quyền (Rồng 5 móng)',
    category: 'sacred_rule',
    garment_scope: 'all',
    core_rule: 'Họa tiết Rồng 5 móng (Ngũ trảo long) là biểu tượng tối thượng chỉ dành riêng cho Hoàng đế triều Nguyễn. Tuyệt đối không đưa vào trang phục dân dụng, dạo phố, casual.',
    historical_context: 'Theo điển chế nhà Nguyễn được ghi chép trong Khâm định Đại Nam hội điển sự lệ, đồ án rồng 5 móng là biểu trưng độc quyền của Thiên tử. Vương công chỉ được dùng rồng 4 móng (Tứ trảo long), dân thường tuyệt đối không được phép sử dụng.',
    creative_boundary: 'Bất biến cấm kỵ (Redline). Với trang phục đương đại dân dụng, nên thay thế bằng rồng 4 móng cách điệu, giao long, họa tiết mây sấm (vân lôi), hoặc hoa lá cung đình.',
    redline_warning: 'REDLINE ĐIỂN CHẾ: Đưa Rồng 5 móng vào trang phục dân sự vi phạm trực tiếp điển chế lễ nghi hoàng triều Nguyễn.',
    source_title: 'Khâm định Đại Nam hội điển sự lệ',
    source_author_or_org: 'Nội các triều Nguyễn (Bản dịch Viện Sử học)',
    source_page: 'Quyển 78 - Lễ bộ, phần Điển lễ phẩm phục',
    source_type: 'primary_text',
    confidence: 'high',
    verification_status: 'verified',
    notes: 'Quy định chính thức của điển chế triều Nguyễn về sắc phục và hoa văn rồng của hoàng đế. Nguồn sử liệu sơ cấp đã được đối chiếu trực tiếp.',
    information_tier: {
      historical_claim: 'Khâm định Đại Nam hội điển sự lệ quy định rồng 5 móng độc quyền cho Hoàng đế; quan và thứ dân dùng rồng 4 móng hoặc hoa văn khác.',
      prototype_rule: 'Phần mềm kích hoạt cờ cảnh báo Redline nghiêm ngặt nếu phát hiện đề xuất thêu rồng 5 móng trên trang phục dân sự.',
      contemporary_suggestion: 'Ứng dụng đồ án rồng 4 móng cách điệu hình học (line-art) hoặc mây sấm đương đại.',
    },
  },
  {
    id: 'KB-NGUTHAN-01',
    title: 'Áo Ngũ Thân tay chẽn - Cổ lập lĩnh',
    category: 'invariant',
    garment_scope: ['ngu_than'],
    core_rule: 'Cổ đứng (Lập lĩnh) cao khoảng 4-5cm ôm khít cổ, có 1 khuy cài cổ cố định. Đây là đặc trưng nhận diện cốt lõi của Áo Ngũ Thân trong bản thử nghiệm.',
    historical_context: 'Hiện vật áo ngũ thân thời Nguyễn ghi nhận cổ đứng ôm sát, thể hiện phong thái kín đáo, đoan chính của người mặc. Cổ áo được dựng thẳng đứng và khóa bằng 1 khuy cài cổ định vị trên cùng.',
    creative_boundary: 'Quy ước nhận diện của prototype. Tránh khoét sâu cổ tim, cổ thuyền, hoặc thay bằng cổ bẻ polo/vest trên phom dáng Áo Ngũ Thân truyền thống.',
    redline_warning: 'LƯU Ý NHẬN DIỆN: Bỏ cổ đứng hoặc khoét sâu làm mất nhận diện đặc trưng của Áo Ngũ Thân.',
    verification_status: 'unverified',
    confidence: 'medium',
    notes: 'Chưa có nguồn xác minh trong bản thử nghiệm. Quy chuẩn chiều cao cổ 4-5cm phản ánh thông lệ hiện vật đo đạc thời Nguyễn, cần bổ sung tài liệu bảo tàng đối sánh theo từng thời kỳ vua chúa.',
    information_tier: {
      historical_claim: 'Hiện vật áo ngũ thân thời Nguyễn ghi nhận cổ đứng ôm sát, khuy cài cổ kín đáo (dựa trên khảo sát hiện vật, chưa có văn bản tiêu chuẩn số đo).',
      prototype_rule: 'Bản thử nghiệm coi cổ lập lĩnh là Invariant cốt lõi của Áo Ngũ Thân.',
      contemporary_suggestion: 'Dùng dựng cổ mex mềm thoáng mát, cho phép mở cúc cổ khi dạo phố nhưng giữ phom khi cài.',
    },
  },
  {
    id: 'KB-NGUTHAN-02',
    title: 'Áo Ngũ Thân tay chẽn - Ống tay chẽn',
    category: 'invariant',
    garment_scope: ['ngu_than'],
    core_rule: 'Ống tay áo ôm thon dần về phía cổ tay, phân biệt rõ rệt với lễ phục áo thụng (Áo Tấc).',
    historical_context: 'Khác với áo thụng nghi lễ, Áo Ngũ Thân tay chẽn được thiết kế để phục vụ đi lại, làm việc, sinh hoạt hàng ngày mà vẫn giữ được tác phong nghiêm trang.',
    creative_boundary: 'Đặc trưng phân biệt với Áo Tấc. Cần giữ độ ôm thon gọn gàng từ bắp tay về cổ tay.',
    verification_status: 'unverified',
    confidence: 'medium',
    notes: 'Chưa có nguồn xác minh trong bản thử nghiệm. Cần bổ sung tài liệu đo đạc tỷ lệ ống tay từ hiện vật lưu trữ tại Bảo tàng Lịch sử Quốc gia.',
    information_tier: {
      historical_claim: 'Tay chẽn là y phục thường nhật và công vụ tiện lợi của người Việt thế kỷ 19-20.',
      prototype_rule: 'Giữ cấu trúc ống tay thon gọn, phân biệt rạch ròi với tay thụng của Áo Tấc.',
      contemporary_suggestion: 'Đường may đôi chắc chắn (twin-needle), phối vải denim selvedge hoặc cotton dệt chéo.',
    },
  },
  {
    id: 'KB-NGUTHAN-03',
    title: 'Áo Ngũ Thân tay chẽn - Vùng khả biến',
    category: 'mutable',
    garment_scope: ['ngu_than'],
    core_rule: 'Chiều dài vạt áo và chất liệu (denim, dạ, linen, kaki) là vùng khả biến, cho phép mở rộng sáng tạo đương đại.',
    historical_context: 'Chiều dài tà áo ngũ thân trong lịch sử từng có sự dịch chuyển tùy bối cảnh sinh hoạt và thời kỳ. Vùng này mở ra khả năng thích ứng thời trang ứng dụng.',
    creative_boundary: 'Vùng Khả Biến (Mutable). Cho phép thử nghiệm chất liệu hiện đại (denim, wool, dù) và cắt vạt lửng ngang hông/midi miễn giữ cổ lập lĩnh và vạt ngũ thân.',
    verification_status: 'unverified',
    source_type: 'internal_heuristic',
    confidence: 'medium',
    notes: 'Chưa có nguồn xác minh trong bản thử nghiệm. Quy ước nội bộ của lab: Ranh giới Mutable do dự án đề xuất để tạo không gian sáng tạo an toàn cho nhà thiết kế trẻ, không phải quy chuẩn lịch sử cố định.',
    information_tier: {
      historical_claim: 'Tà áo có độ dài biến thiên theo từng thời kỳ lịch sử và hoàn cảnh sử dụng.',
      prototype_rule: 'Hệ thống đánh dấu chất liệu và độ dài vạt là vùng Khả biến (Mutable).',
      contemporary_suggestion: 'Phối áo ngũ thân vạt lửng với quần tây ống rộng và giày chunky loafer.',
    },
  },
  {
    id: 'KB-TAC-01',
    title: 'Áo Tấc - Tay thụng chữ nhật',
    category: 'invariant',
    garment_scope: ['ao_tac'],
    core_rule: 'Ống tay áo thụng rộng hình chữ nhật, khi thả xuôi dài bằng hoặc qua ngón tay. Đây là nhận diện cốt lõi của Áo Tấc trong bản thử nghiệm.',
    historical_context: 'Áo Tấc (còn gọi là áo lễ, áo thụng) có đôi ống tay rộng buông dài qua ngón tay, tạo phong thái uy nghiêm, khoan thai khi chấp tay bái lễ trong các nghi thức quan trọng.',
    creative_boundary: 'Bất biến nhận diện của prototype. Không may thu hẹp ống tay áo Tấc; nếu thu hẹp thì bản chất đã chuyển hóa thành Áo Ngũ Thân tay chẽn.',
    verification_status: 'unverified',
    confidence: 'medium',
    notes: 'Chưa có nguồn xác minh trong bản thử nghiệm. Cần bổ sung nguồn khảo cứu đo đạc kích thước tấc vải và biên độ ống tay thụng thời Nguyễn.',
    information_tier: {
      historical_claim: 'Tay áo thụng dài là nhận diện của lễ phục tế lễ và hỷ sự thời Nguyễn.',
      prototype_rule: 'Hệ thống coi ống tay thụng qua ngón tay là Invariant bắt buộc của Áo Tấc.',
      contemporary_suggestion: 'Dùng vải dạ mỏng hoặc đũi tơ tằm mềm để ống tay có độ rủ tự nhiên.',
    },
  },
  {
    id: 'KB-TAC-02',
    title: 'Áo Tấc - Tính lễ nghi thân trên',
    category: 'invariant',
    garment_scope: ['ao_tac'],
    core_rule: 'Áo Tấc là lễ phục trang nghiêm. Khi phối đồ đương đại vẫn cần bảo toàn sự kín đáo và mực thước ở phần thân trên.',
    historical_context: 'Áo Tấc dùng trong các dịp cúng tế gia tiên, yết kiến quan lại, hôn lễ và các sự kiện tế lễ cung đình thời Nguyễn.',
    creative_boundary: 'Dù phối hợp với phong cách hiện đại nào ở thân dưới, thân trên cần tạo cảm giác chỉn chu, đoan trang, không hở hang phản cảm.',
    verification_status: 'unverified',
    confidence: 'medium',
    notes: 'Chưa có nguồn xác minh trong bản thử nghiệm. Quy ước giữ tính lễ nghi thân trên cần tham chiếu thêm văn bản điển lễ triều đình.',
    information_tier: {
      historical_claim: 'Lễ phục đòi hỏi phong thái trang nghiêm, đoan chính trong nghi thức cộng đồng.',
      prototype_rule: 'Hệ thống yêu cầu các biến tấu của Áo Tấc phải giữ kín đáo thân trên.',
      contemporary_suggestion: 'Layer bên trong áo cổ lọ mỏng dệt kim tối màu ôm sát thanh lịch.',
    },
  },
  {
    id: 'KB-TAC-03',
    title: 'Áo Tấc - Vùng khả biến (Duster coat)',
    category: 'mutable',
    garment_scope: ['ao_tac'],
    core_rule: 'Cho phép mở khuy áo phía trước để tạo layer dạng áo khoác dáng dài (duster coat) hiện đại, phối với quần tây và bốt da.',
    historical_context: 'Phom dáng dài rộng rãi của Áo Tấc có sự tương đồng thẩm mỹ với áo khoác dài (duster coat / kimono coat) trong thời trang quốc tế đương đại.',
    creative_boundary: 'Vùng Khả Biến (Mutable). Mặc mở khuy tạo phom duster coat bay bổng khi chuyển động, phối quần âu xếp ly và áo cổ lọ bên trong.',
    verification_status: 'unverified',
    source_type: 'internal_heuristic',
    confidence: 'medium',
    notes: 'Chưa có nguồn xác minh trong bản thử nghiệm. Quy ước nội bộ của lab: Mở khuy dạng áo khoác duster coat là sáng tạo công năng hiện đại của lab thử nghiệm.',
    information_tier: {
      historical_claim: 'Áo Tấc trong truyền thống cài khuy kín khi hành lễ.',
      prototype_rule: 'Hệ thống cho phép mở tà làm áo khoác như một Mutable hợp lệ.',
      contemporary_suggestion: 'Tạo dáng áo khoác sartorial layer thời thượng cho tuần lễ thời trang.',
    },
  },
  {
    id: 'KB-NHATBINH-01',
    title: 'Áo Nhật Bình - Nẹp cổ đối khâm',
    category: 'invariant',
    garment_scope: ['nhat_binh'],
    core_rule: 'Nẹp cổ to bản chạy dọc song song từ cổ xuống ngực tạo thành hình chữ nhật đặc trưng, có dải dây buộc ở ngực. Không phải dạng vạt đè Hữu nhậm.',
    historical_context: 'Tên gọi "Nhật Bình" bắt nguồn từ chính hình dạng nẹp cổ to bản ghép lại trước ngực thành một hình chữ nhật ("Nhật" 日) cân đối của cung tần, mệnh phụ thời Nguyễn.',
    creative_boundary: 'Bất biến nhận diện của prototype. Nẹp cổ chữ nhật đối khâm và dải buộc ngực là cấu trúc nhận diện đặc trưng của Áo Nhật Bình.',
    verification_status: 'unverified',
    confidence: 'medium',
    notes: 'Chưa có nguồn xác minh trong bản thử nghiệm. Cần bổ sung trích lục quy định về phẩm phục cung quy từ Khâm định Đại Nam hội điển sự lệ phần Hậu cung phẩm phục.',
    information_tier: {
      historical_claim: 'Nẹp cổ đối khâm to bản chữ nhật là trang phục chính thức của hậu cung và mệnh phụ triều Nguyễn.',
      prototype_rule: 'Hệ thống coi nẹp đối khâm chữ nhật là Invariant bất biến của Nhật Bình (không nhầm với Hữu nhậm).',
      contemporary_suggestion: 'Thêu chìm hoa văn chỉ bạc hoặc hoa văn hình học tối giản trên nền nẹp lụa taffeta.',
    },
  },
  {
    id: 'KB-NHATBINH-02',
    title: 'Áo Nhật Bình - Dải ngũ sắc viền tay',
    category: 'invariant',
    garment_scope: ['nhat_binh'],
    core_rule: 'Dải màu ngũ hành ở viền tay áo mang tính biểu tượng nhận diện. Bản thử nghiệm lưu ý không tùy tiện đảo lộn hoặc xóa bỏ.',
    historical_context: 'Năm dải màu ở cổ tay tượng trưng cho Ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ) và Ngũ thường theo quan niệm vũ trụ triết học Á Đông.',
    creative_boundary: 'Quy ước bất biến của prototype. Tránh xóa bỏ hoặc thay đổi trật tự 5 dải màu ngũ hành; cho phép gia giảm độ bão hòa màu sắc (desaturated/pastel).',
    verification_status: 'unverified',
    confidence: 'medium',
    notes: 'Chưa có nguồn xác minh trong bản thử nghiệm. Cần tài liệu đối chiếu hình ảnh hiện vật bảo tàng triều Nguyễn về thứ tự màu sắc chính xác theo từng phẩm cấp.',
    information_tier: {
      historical_claim: 'Cổ tay áo nhật bình đính dải vải ngũ sắc tượng trưng cho ngũ hành và phẩm trật.',
      prototype_rule: 'Hệ thống coi dải ngũ sắc viền tay là Invariant cốt lõi của Áo Nhật Bình.',
      contemporary_suggestion: 'Dệt chìm bằng sợi tơ tone-sur-tone hoặc bảng màu pastel nhẹ nhàng cho giới trẻ.',
    },
  },
  {
    id: 'KB-NHATBINH-03',
    title: 'Áo Nhật Bình - Vùng khả biến (Mở tà, phối chân váy)',
    category: 'mutable',
    garment_scope: ['nhat_binh'],
    core_rule: 'Cho phép mặc mở tà, phối cùng chân váy xếp ly dáng dài hoặc quần âu hiện đại thay cho quần lụa trắng truyền thống.',
    historical_context: 'Áo Nhật Bình khi buông dây mở tà tạo phom áo khoác cardigan quý phái, dễ dàng cộng hưởng với trang phục đương đại.',
    creative_boundary: 'Vùng Khả Biến (Mutable). Thử nghiệm chất liệu dạ tweed, nhung velvet, phối cùng chân váy midi xếp ly màu kem hoặc quần suông hiện đại.',
    verification_status: 'unverified',
    source_type: 'internal_heuristic',
    confidence: 'medium',
    notes: 'Chưa có nguồn xác minh trong bản thử nghiệm. Quy ước nội bộ của lab: Biến tấu mở tà phối chân váy xếp ly là đề xuất thời trang đương đại của phòng thử nghiệm.',
    information_tier: {
      historical_claim: 'Trong cung đình triều Nguyễn, Áo Nhật Bình được mặc cùng quần trắng và khăn vành.',
      prototype_rule: 'Hệ thống coi việc mặc mở tà phối chân váy là Mutable được phép.',
      contemporary_suggestion: 'Biến Nhật Bình thành áo khoác Haute Couture dạ hội duyên dáng.',
    },
  },
];

/**
 * Check if a CKB rule is applicable to a specific garment
 */
export function isRuleApplicableToGarment(entry: CKBEntry, garment: GarmentKey): boolean {
  if (entry.garment_scope === 'all') return true;
  if (entry.garment_scope === 'needs_verification') return false;
  if (Array.isArray(entry.garment_scope)) {
    return entry.garment_scope.includes(garment);
  }
  if (entry.garment_scope === 'ngu_than_and_tac') {
    return garment === 'ngu_than' || garment === 'ao_tac';
  }
  return entry.garment_scope === garment;
}

/**
 * Format human-readable garment scope label
 */
export function formatGarmentScopeLabel(scope: CKBEntry['garment_scope']): string {
  if (scope === 'all') return 'Toàn bộ trang phục dân sự (All)';
  if (scope === 'needs_verification') return 'Cần thẩm định phạm vi áp dụng';
  if (Array.isArray(scope)) {
    return scope
      .map((g) => {
        if (g === 'ngu_than') return 'Áo Ngũ Thân';
        if (g === 'ao_tac') return 'Áo Tấc';
        if (g === 'nhat_binh') return 'Áo Nhật Bình';
        return g;
      })
      .join(' & ');
  }
  if (scope === 'ngu_than') return 'Áo Ngũ Thân';
  if (scope === 'ao_tac') return 'Áo Tấc';
  if (scope === 'nhat_binh') return 'Áo Nhật Bình';
  if (scope === 'ngu_than_and_tac') return 'Áo Ngũ Thân & Áo Tấc';
  return String(scope);
}

/**
 * Format human-readable verification status badge label
 */
export function formatVerificationStatusBadge(status: CKBEntry['verification_status']): {
  label: string;
  badgeClass: string;
  isVerified: boolean;
} {
  if (status === 'verified') {
    return {
      label: 'Đã đối chiếu nguồn thư tịch',
      badgeClass: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
      isVerified: true,
    };
  }
  if (status === 'needs_review' || status === 'needs_research') {
    return {
      label: 'Cần nghiên cứu thêm nguồn',
      badgeClass: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
      isVerified: false,
    };
  }
  if (status === 'disputed') {
    return {
      label: 'Có quan điểm học thuật khác nhau',
      badgeClass: 'border-orange-500/40 text-orange-300 bg-orange-500/10',
      isVerified: false,
    };
  }
  return {
    label: 'Chưa có nguồn xác minh trong bản thử nghiệm',
    badgeClass: 'border-neutral-500/40 text-neutral-300 bg-neutral-500/10',
    isVerified: false,
  };
}
