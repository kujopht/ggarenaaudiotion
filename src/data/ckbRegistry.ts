import {
  CKBEntry,
  GarmentKey,
  PrototypeCompliance,
  HistoricalConfidence,
  VerificationStatus,
} from '../types/vietphuc';

export const CKB_REGISTRY: CKBEntry[] = [
  {
    id: 'KB-RULE-01',
    title: 'Quy thức Hữu nhậm',
    category: 'invariant',
    garment_scope: ['ngu_than', 'ao_tac'],
    core_rule: 'Vạt trái đè lên vạt phải, khuy áo cài bên phải. Đây là quy ước cấu trúc cốt lõi của áo vạt đè trong bản thử nghiệm. Khuyến cáo tránh cài vạt sang trái (Tả nhậm).',
    historical_context: 'Mẫu áo ngũ thân tay chẽn phục dựng đương đại may thủ công theo phong cách truyền thống thời Nguyễn được Bảo tàng Lịch sử Quốc gia tiếp nhận có hàng 5 cúc chạy theo vạt bên phải từ cổ xuống eo. Quan niệm liên hệ tả nhậm với tang phục hiện chưa được dự án xác minh bằng thư tịch chính thức triều Nguyễn.',
    creative_boundary: 'Quy ước Invariant của prototype. Giữ hướng vạt đè sang phải; có thể ứng dụng cúc bấm từ tính hoặc khóa kéo ẩn để người thuận tay trái thao tác thuận tiện.',
    redline_warning: 'LƯU Ý QUY THỨC: Khuyến cáo tránh đổi vạt sang trái (Tả nhậm) trên Áo Ngũ Thân và Áo Tấc vì nguy cơ đồng nhất với quan niệm dân gian về y phục tang ma.',
    source_title: 'Bảo tàng Lịch sử quốc gia tiếp nhận áo dài ngũ thân truyền thống',
    source_author_or_org: 'Bảo tàng Lịch sử Quốc gia',
    source_url: 'https://baotanglichsu.vn/vi/Articles/3090/72685/bao-tang-lich-su-quoc-gia-tiep-nhan-ao-dai-ngu-than-truyen-thong.html',
    source_type: 'museum_archive',
    verification_status: 'needs_review',
    confidence: 'medium',
    notes: 'Nguồn Bảo tàng Lịch sử Quốc gia mô tả mẫu áo ngũ thân tay chẽn phục dựng đương đại được trao tặng cho bảo tàng, có hàng 5 cúc cài vạt bên phải từ cổ xuống eo, ống tay nhỏ gọn (không phải hiện vật khảo cổ thời Nguyễn gốc). Nguồn này chưa được đối soát trực tiếp với văn bản quy chuẩn chính văn về lệnh cấm tả nhậm, cần rà soát thêm thư tịch điển chế triều Nguyễn.',
    information_tier: {
      historical_claim: 'Mẫu áo ngũ thân tay chẽn phục dựng đương đại được Bảo tàng Lịch sử Quốc gia tiếp nhận có hàng 5 cúc chạy theo vạt bên phải từ cổ xuống eo; quan niệm dân gian liên hệ tả nhậm với tang phục hiện chưa được dự án xác minh bằng thư tịch chính thức.',
      prototype_rule: 'Hệ thống quy ước Hữu nhậm là Invariant đối với Áo Ngũ Thân và Áo Tấc; không áp dụng cho Áo Nhật Bình (dạng Đối khâm).',
      contemporary_suggestion: 'Ứng dụng phụ liệu công thái học ẩn (nam châm/khóa bấm) bên phải cho người thuận tay trái.',
    },
  },
  {
    id: 'KB-RULE-02',
    title: 'Cấu trúc Ngũ thân',
    category: 'invariant',
    garment_scope: ['ngu_than', 'ao_tac'],
    core_rule: 'Cấu trúc 5 thân gồm 4 thân ngoài (2 thân trước, 2 thân sau) và 1 thân con (tiểu thân) nằm bên trong phía trước bên phải, mang ý nghĩa đoan chính, kín đáo trong bản thử nghiệm.',
    historical_context: 'Theo cách giải thích văn hóa dân gian và lời tương truyền lưu truyền tại Huế, 5 thân áo gồm 2 thân trước và 2 thân sau được ví như tứ thân phụ mẫu, cùng 1 thân con (tiểu thân) nằm bên trong bên phải tượng trưng cho người mặc được chở che. Đây là cách diễn giải tương truyền giàu tính nhân văn, không phải điển chế hay quy định triều Nguyễn đã được chứng minh.',
    creative_boundary: 'Có thể điều chỉnh độ rộng hẹp phom dáng, nhưng cần tôn trọng tinh thần kín đáo và lớp lót trang nhã của cấu trúc ngũ thân.',
    source_title: 'Tổng hợp những địa chỉ may áo dài ngũ thân tại Huế',
    source_author_or_org: 'Khám phá Huế (huecit.com)',
    source_url: 'https://kph2022.huecit.com/Van-hoa/Hue-Kinh-%C4%91o-ao-dai-Viet-Nam/Chi-tiet/tid/Tong-hop-nhung-dia-chi-may-ao-dai-ngu-than-tai-Hue.html/pid/6335/cid/352',
    source_type: 'community_consensus',
    verification_status: 'needs_review',
    confidence: 'low',
    notes: 'Nguồn Khám phá Huế mô tả cấu trúc 5 thân gồm 2 thân trước, 2 thân sau và thân thứ 5 bên trong phía trước bên phải; ý nghĩa tứ thân phụ mẫu là cách giải thích tương truyền dân gian, chưa được đối soát trực tiếp trong thư tịch triều đình.',
    information_tier: {
      historical_claim: 'Cách diễn giải tương truyền trong dân gian giải thích kết cấu 5 thân đại diện cho sự bao bọc của tứ thân phụ mẫu; chưa có cơ sở khẳng định đây là quy chế chính thức của triều Nguyễn.',
      prototype_rule: 'Hệ thống giữ cấu trúc 5 thân che chở kín đáo như đặc điểm nhận diện của prototype, không khoét xẻ thân áo phản cảm.',
      contemporary_suggestion: 'Tối giản hóa lớp lót bằng vải dệt tự nhiên thoáng mát, co giãn cho giới trẻ.',
    },
  },
  {
    id: 'KB-RULE-03',
    title: 'Quy chế Biểu tượng Hoàng quyền (Rồng 5 móng)',
    category: 'sacred_rule',
    garment_scope: 'all',
    core_rule: 'Rồng 5 móng xuất hiện trên long bào của Hoàng đế triều Nguyễn, trong khi long bào hoàng thái tử và mãng bào hoàng tử dùng rồng 4 móng hoặc hình tượng mãng. Prototype coi việc sử dụng rồng 5 móng trên trang phục casual dân dụng là vùng nhạy cảm về biểu tượng quyền lực và yêu cầu cảnh báo ngữ cảnh.',
    historical_context: 'Khảo sát hiện vật trang phục cung đình triều Nguyễn tại Bảo tàng Lịch sử Quốc gia (bài nghiên cứu của TS. Trần Đức Anh Sơn) cho thấy đồ án rồng 5 móng xuất hiện trên long bào của Hoàng đế, trong khi hoàng thái tử và hoàng tử dùng rồng 4 móng hoặc mãng để thể hiện sự phân tầng quyền uy. Việc sử dụng biểu tượng này trên trang phục dân sự đương đại cần lưu ý ngữ cảnh văn hóa trang trọng.',
    creative_boundary: 'Vùng nhạy cảm biểu tượng (Sacred Rule / Redline). Với trang phục đương đại dân dụng, nên thay thế bằng rồng 4 móng cách điệu, giao long, họa tiết mây sấm (vân lôi), hoặc hoa lá cung đình.',
    redline_warning: 'CẢNH BÁO BIỂU TƯỢNG: Rồng 5 móng là biểu tượng quyền uy trên long bào Hoàng đế triều Nguyễn. Khuyến cáo thận trọng ngữ cảnh, không tùy tiện đưa vào trang phục dân sự thường nhật.',
    source_title: 'Hình ảnh con rồng trên trang phục cung đình triều Nguyễn',
    source_author_or_org: 'Bảo tàng Lịch sử Quốc gia (bài của TS. Trần Đức Anh Sơn)',
    source_url: 'https://baotanglichsu.vn/VI/Articles/3096/18431/hinh-anh-con-rong-tren-trang-phuc-cung-djinh-trieu-nguyen.html',
    source_type: 'museum_archive',
    confidence: 'medium',
    verification_status: 'needs_review',
    notes: 'Nguồn Bảo tàng Lịch sử Quốc gia (TS. Trần Đức Anh Sơn) xác nhận rồng 5 móng trên long bào vua, rồng 4 móng trên trang phục hoàng thái tử và hoàng tử để thể hiện trật tự cung đình. Dẫn liệu Khâm định Đại Nam hội điển sự lệ (Quyển 78 - Lễ bộ) được ghi nhận là nguồn tham chiếu (source lead) đang chờ đối soát trực tiếp bản dịch/văn bản số hóa.',
    information_tier: {
      historical_claim: 'Tư liệu hiện vật Bảo tàng Lịch sử Quốc gia cho thấy rồng 5 móng xuất hiện trên long bào Hoàng đế, rồng 4 móng trên trang phục hoàng thái tử và hoàng tử; đồ án rồng biểu thị phân tầng quyền uy trong cung đình.',
      prototype_rule: 'Prototype coi việc đưa rồng 5 móng vào trang phục dân sự là vùng nhạy cảm về biểu tượng quyền lực và kích hoạt cảnh báo lưu ý ngữ cảnh.',
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
    core_rule: 'Áo Nhật Bình có cổ dạng đối khâm hình chữ nhật và được cài ở trục chính giữa. Đây là đặc điểm nhận diện cấu trúc quan trọng của Nhật Bình và khác với dạng vạt đè Hữu nhậm.',
    historical_context: 'Khảo sát hiện vật nguyên gốc BTH/TB.Đd.17 tại Bảo tàng Cổ vật Cung đình Huế (nghiên cứu của Lê Thị Hà, Tạp chí Văn hóa Nghệ thuật) ghi nhận áo Nhật Bình của Đoan Huy Hoàng thái hậu thuộc hệ thống trang phục cung đình hậu phi triều Nguyễn, có nẹp cổ dạng đối khâm hình chữ nhật và cài khuy ở trục chính giữa.',
    creative_boundary: 'Bất biến nhận diện của prototype. Nẹp cổ chữ nhật đối khâm cài giữa là cấu trúc nhận diện đặc trưng của Áo Nhật Bình; khác biệt hoàn toàn với vạt đè Hữu nhậm.',
    source_title: 'Hoa văn trang trí trên áo Nhật Bình của Đoan Huy Hoàng thái hậu triều Nguyễn (1802-1945)',
    source_author_or_org: 'Lê Thị Hà (Tạp chí Văn hóa Nghệ thuật)',
    source_url: 'https://vanhoanghethuat.vn/hoa-van-trang-tri-tren-ao-nhat-binh-cua-doan-huy-hoang-thai-hau-trieu-nguyen-1802-1945-77758106.html',
    source_page: 'Hiện vật BTH/TB.Đd.17',
    source_type: 'research_study',
    confidence: 'high',
    verification_status: 'verified',
    notes: 'Khảo sát hiện vật tại Bảo tàng Cổ vật Cung đình Huế. Bài nghiên cứu của Lê Thị Hà trên Tạp chí Văn hóa Nghệ thuật khảo sát trực tiếp hiện vật áo Nhật Bình nguyên gốc của Đoan Huy Hoàng thái hậu (ký hiệu BTH/TB.Đd.17; lưu ý đây là mã hiện vật lưu trữ, không phải số trang tạp chí), xác nhận nẹp cổ đối khâm hình chữ nhật cài cúc ở trục chính giữa.',
    information_tier: {
      historical_claim: 'Khảo sát hiện vật áo Nhật Bình của Đoan Huy Hoàng thái hậu (BTH/TB.Đd.17) tại Bảo tàng Cổ vật Cung đình Huế xác nhận nẹp cổ đối khâm hình chữ nhật và cài ở trục chính giữa.',
      prototype_rule: 'Hệ thống coi nẹp đối khâm chữ nhật cài giữa là Invariant bất biến của Nhật Bình (khác với dạng vạt đè Hữu nhậm).',
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
 * Unified statistics interface for Cultural Knowledge Base
 */
export interface CKBStats {
  total: number;
  verified: number;
  needs_review: number;
  unverified: number;
  disputed: number;
  invariant: number;
  mutable: number;
  sacred_rule: number;
}

/**
 * Retrieve unified dynamic statistics for CKB
 * Used across CKBRegistryView and CKBExplorerModal to guarantee consistency.
 */
export function getCKBStats(): CKBStats {
  return {
    total: CKB_REGISTRY.length,
    verified: CKB_REGISTRY.filter((r) => r.verification_status === 'verified').length,
    needs_review: CKB_REGISTRY.filter(
      (r) => r.verification_status === 'needs_review' || r.verification_status === 'needs_research'
    ).length,
    unverified: CKB_REGISTRY.filter((r) => r.verification_status === 'unverified').length,
    disputed: CKB_REGISTRY.filter((r) => r.verification_status === 'disputed').length,
    invariant: CKB_REGISTRY.filter((r) => r.category === 'invariant').length,
    mutable: CKB_REGISTRY.filter((r) => r.category === 'mutable').length,
    sacred_rule: CKB_REGISTRY.filter((r) => r.category === 'sacred_rule').length,
  };
}

/**
 * Format human-readable verification status badge label and visual classes
 * Enforces Requirement 9 & 10:
 * - verified: emerald green
 * - needs_review / needs_research: amber / yellow ("Nguồn tham chiếu đang chờ đối soát")
 * - unverified: neutral
 * - disputed: orange
 */
export function formatVerificationStatusBadge(status: CKBEntry['verification_status']): {
  label: string;
  badgeClass: string;
  cardClass: string;
  sourceLeadLabel: string;
  isVerified: boolean;
} {
  if (status === 'verified') {
    return {
      label: 'Đã đối chiếu nguồn thư tịch',
      badgeClass: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
      cardClass: 'bg-emerald-950/20 border-emerald-600/30 text-emerald-200',
      sourceLeadLabel: 'Nguồn khảo cứu thư tịch đã đối chiếu:',
      isVerified: true,
    };
  }
  if (status === 'needs_review' || status === 'needs_research') {
    return {
      label: 'Cần rà soát thêm nguồn',
      badgeClass: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
      cardClass: 'bg-amber-950/20 border-amber-600/30 text-amber-200',
      sourceLeadLabel: 'Nguồn tham chiếu đang chờ đối soát:',
      isVerified: false,
    };
  }
  if (status === 'disputed') {
    return {
      label: 'Có quan điểm học thuật khác nhau',
      badgeClass: 'border-orange-500/40 text-orange-300 bg-orange-500/10',
      cardClass: 'bg-orange-950/20 border-orange-600/30 text-orange-200',
      sourceLeadLabel: 'Nguồn tham chiếu đang có tranh luận:',
      isVerified: false,
    };
  }
  return {
    label: 'Chưa có nguồn xác minh trong bản thử nghiệm',
    badgeClass: 'border-neutral-500/40 text-neutral-300 bg-neutral-500/10',
    cardClass: 'bg-[#211815]/50 border-neutral-700/50 text-neutral-300',
    sourceLeadLabel: 'Chưa có nguồn xác minh trong bản thử nghiệm:',
    isVerified: false,
  };
}

/**
 * Retrieve a CKB entry by ID
 */
export function getCKBEntry(id: string): CKBEntry | undefined {
  return CKB_REGISTRY.find((entry) => entry.id === id);
}

/**
 * Retrieve multiple CKB entries by IDs
 */
export function getCKBEntries(ids: string[]): CKBEntry[] {
  return ids
    .map((id) => getCKBEntry(id))
    .filter((entry): entry is CKBEntry => entry !== undefined);
}

/**
 * Extract certainty metadata from an entry
 */
export function getRuleCertainty(entry: CKBEntry): {
  isVerified: boolean;
  confidence: string;
  status: VerificationStatus;
  label: string;
} {
  const badge = formatVerificationStatusBadge(entry.verification_status);
  return {
    isVerified: badge.isVerified,
    confidence: entry.confidence || 'medium',
    status: entry.verification_status,
    label: badge.label,
  };
}

/**
 * Extract evidence metadata for display and audit
 */
export function getRuleEvidenceMetadata(entry: CKBEntry) {
  const badge = formatVerificationStatusBadge(entry.verification_status);
  return {
    id: entry.id,
    title: entry.title,
    scope: formatGarmentScopeLabel(entry.garment_scope),
    coreRule: entry.core_rule,
    historicalClaim: entry.information_tier.historical_claim,
    prototypeRule: entry.information_tier.prototype_rule,
    contemporarySuggestion: entry.information_tier.contemporary_suggestion,
    sourceTitle: entry.source_title,
    sourceDetails: entry.source_page
      ? `${entry.source_title || ''} (${entry.source_page})`
      : entry.source_title,
    status: entry.verification_status,
    statusLabel: badge.label,
    isVerified: badge.isVerified,
    notes: entry.notes,
  };
}

/**
 * Derive two-layer audit confidence based on evidence IDs and rule statuses:
 * Layer 1: Prototype Compliance ('compliant' | 'conflict' | 'unassessed')
 * Layer 2: Historical Confidence ('verified' | 'partially_verified' | 'needs_review' | 'unverified' | 'mixed')
 */
export function deriveAuditConfidence(
  evidenceIds: string[],
  hasConflict: boolean = false
): {
  prototype_compliance: PrototypeCompliance;
  historical_confidence: HistoricalConfidence;
  verification_summary: string;
  hasUnverified: boolean;
} {
  if (hasConflict) {
    const entries = getCKBEntries(evidenceIds);
    const allVerified = entries.length > 0 && entries.every((e) => e.verification_status === 'verified');
    const anyVerified = entries.some((e) => e.verification_status === 'verified');
    const anyNeedsReview = entries.some(
      (e) => e.verification_status === 'needs_review' || e.verification_status === 'needs_research'
    );
    const historical_confidence: HistoricalConfidence = allVerified
      ? 'verified'
      : anyVerified
      ? 'partially_verified'
      : anyNeedsReview
      ? 'needs_review'
      : 'unverified';
    return {
      prototype_compliance: 'conflict',
      historical_confidence,
      verification_summary:
        historical_confidence === 'verified'
          ? 'Xung đột với quy tắc prototype; nguồn thư tịch đã được đối chiếu'
          : historical_confidence === 'needs_review'
          ? 'Xung đột với quy tắc prototype; nguồn tham chiếu hiện cần rà soát thêm'
          : historical_confidence === 'partially_verified'
          ? 'Xung đột với quy tắc prototype; nguồn tham chiếu một phần đã đối chiếu'
          : 'Xung đột với quy tắc prototype; nguồn tham chiếu hiện chưa được xác minh độc lập',
      hasUnverified: !allVerified,
    };
  }

  const entries = getCKBEntries(evidenceIds);
  if (entries.length === 0) {
    return {
      prototype_compliance: 'unassessed',
      historical_confidence: 'unverified',
      verification_summary: 'Chưa có điều khoản CKB tham chiếu',
      hasUnverified: true,
    };
  }

  const allVerified = entries.every((e) => e.verification_status === 'verified');
  const anyNeedsReview = entries.some(
    (e) => e.verification_status === 'needs_review' || e.verification_status === 'needs_research'
  );
  const anyVerified = entries.some((e) => e.verification_status === 'verified');

  let historical_confidence: HistoricalConfidence;
  let verification_summary: string;

  if (allVerified) {
    historical_confidence = 'verified';
    verification_summary = 'Đã đối chiếu nguồn thư tịch lịch sử cho toàn bộ quy tắc';
  } else if (anyVerified) {
    historical_confidence = 'partially_verified';
    verification_summary = 'Nguồn tham chiếu hỗn hợp: một số quy tắc đã đối chiếu, một số cần rà soát thêm';
  } else if (anyNeedsReview) {
    historical_confidence = 'needs_review';
    verification_summary = 'Có quy tắc tham chiếu cần rà soát thêm nguồn thư tịch';
  } else {
    historical_confidence = 'unverified';
    verification_summary = 'Các quy tắc tham chiếu hiện chưa được đối chiếu thư tịch độc lập trong bản thử nghiệm';
  }

  return {
    prototype_compliance: 'compliant',
    historical_confidence,
    verification_summary,
    hasUnverified: !allVerified,
  };
}

/**
 * Builds Gemini System Grounding dynamically from CKB_REGISTRY.
 * This guarantees CKB_REGISTRY is the single source of truth for the entire application.
 */
export function buildCKBSystemGrounding(): string {
  const rulesList = CKB_REGISTRY.map((entry) => {
    const scopeLabel = formatGarmentScopeLabel(entry.garment_scope);
    const sourceInfo = entry.source_title
      ? `Nguồn: ${entry.source_title}${entry.source_page ? ` (${entry.source_page})` : ''} - Trạng thái nguồn: ${entry.verification_status}`
      : `Trạng thái nguồn: Chưa xác minh thư tịch độc lập trong bản thử nghiệm (${entry.verification_status})`;

    return `- ${entry.id}: [${entry.title}] (Phạm vi: ${scopeLabel})
  * Quy tắc cốt lõi: ${entry.core_rule}
  * Tầng 1 (Căn cứ lịch sử): ${entry.information_tier.historical_claim}
  * Tầng 2 (Quy ước nội bộ prototype): ${entry.information_tier.prototype_rule}
  * Tầng 3 (Gợi ý sáng tạo đương đại): ${entry.information_tier.contemporary_suggestion}
  * ${sourceInfo}${entry.redline_warning ? `\n  * Cảnh báo: ${entry.redline_warning}` : ''}`;
  }).join('\n');

  return `BẠN LÀ HỆ THỐNG "VIỆTPHỤC REMIX LAB" - ĐỒNG THỜI GIỮ 2 VAI TRÒ:
1. Contemporary Fashion Co-Designer: Chuyên gia sáng tạo thời trang đương đại, giúp Gen Z phối Việt phục với các phong cách mới.
2. Cultural Auditor: Chuyên gia thẩm định di sản minh bạch, chỉ đưa ra kết luận dựa DUY NHẤT trên Cultural Knowledge Base (CKB) được cấp dưới đây. Tuyệt đối không võ đoán hay khẳng định chắc chắn khi quy tắc chưa có nguồn đối chiếu.

==================================================
CULTURAL KNOWLEDGE BASE (CKB) & TẬP QUY TẮC BẤT BIẾN:
==================================================
${rulesList}

==================================================
QUY TẮC THẨM ĐỊNH (CULTURAL AUDIT GOVERNANCE):
==================================================
1. PHÂN TÁCH RẠCH RÒI 2 LỚP ĐÁNH GIÁ (REQUIREMENT 4):
   - Lớp 1 (prototype_compliance): 'compliant' (phù hợp rule), 'conflict' (xung đột rule), hoặc 'unassessed' (chưa đối soát).
   - Lớp 2 (historical_confidence): 'verified', 'partially_verified', 'needs_review', 'unverified', hoặc 'mixed'.
2. ĐÁNH GIÁ CHỈ ĐƯỢC DÙNG 3 TRẠNG THÁI (KHÔNG DÙNG ĐIỂM SỐ 0-100):
   - "Supported": CHỈ DÙNG KHI các claim lịch sử quan trọng làm cơ sở cho kết luận ĐÃ CÓ NGUỒN VERIFIED phù hợp.
   - "Supported with Caution": Dùng khi rule prototype áp dụng rõ ràng nhưng nguồn lịch sử chưa đầy đủ (unverified/needs_review), hoặc khi thiết kế có can thiệp táo bạo. BẮT BUỘC bật cờ uncertainty hoặc ghi rõ lưu ý nguồn.
   - "Insufficient Evidence": Bất kỳ tuyên bố, họa tiết, hoặc chi tiết nào KHÔNG CÓ trong CKB ở trên. Phải bật uncertainty_flag: true và nêu rõ thiếu tài liệu lịch sử chứng thực.
3. TUYỆT ĐỐI TRÁNH NGÔN TỪ VÕ ĐOÁN:
   - Tuyệt đối KHÔNG dùng các từ: "đúng tuyệt đối", "chính xác lịch sử 100%", "đã xác thực văn hóa", "được chứng nhận".
   - Phân biệt rõ giữa: "Phù hợp với quy tắc của prototype" và "Đã được xác nhận chính xác về lịch sử".
4. XỬ LÝ VI PHẠM (REDLINE & LƯU Ý QUY THỨC):
   - Nếu vi phạm KB-RULE-03 (Rồng 5 móng) -> Ghi nhận cảnh báo điển chế hoàng quyền, giải thích trạng thái nguồn cần rà soát thêm (needs_review).
   - Nếu phát hiện đề xuất đổi vạt sang trái (Tả nhậm) trên Ngũ Thân/Áo Tấc -> Ghi nhận cảnh báo lưu ý quy thức KB-RULE-01, nêu rõ nguồn lịch sử chưa kiểm chứng thư tịch độc lập.
`;
}
