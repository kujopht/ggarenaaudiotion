# HỒ SƠ ĐĂNG KÝ DỰ THI AI ARENA VIETNAM 2026

## 1. Tên giải pháp
**KUJO Re:Wear - Vietnamese Heritage Co-Design & Cultural Reference Studio**

---

## 2. Nhu cầu người dùng và tình huống sử dụng
- **Nhu cầu người dùng:**  
  Giới trẻ Việt Nam (đặc biệt là Gen Z, nhà sáng tạo nội dung, nhà thiết kế trẻ) ngày càng hào hứng đưa di sản cổ phục vào đời sống đương đại (thời trang đường phố - streetwear, công sở sáng tạo, lễ hội, sự kiện văn hóa nghệ thuật). Tuy nhiên, họ luôn đối mặt với một rào cản và nỗi e ngại lớn: *Không rõ chi tiết nào là cốt lõi bất biến cần bảo tồn sự chuẩn mực trang trọng, và chi tiết nào là vùng khả biến có thể tự do sáng tạo mà không gây phản cảm hay sai lệch văn hóa.*
- **Tình huống sử dụng thực tế:**
  1. *Gen Z phối đồ thường nhật:* Muốn mặc áo Ngũ Thân hoặc Áo Tấc dạo phố cuối tuần hay đi làm, cần gợi ý cách phối cùng quần jeans, áo thun, sneakers mà vẫn chuẩn form vạt hữu nhậm và cài khuy đúng quy thức.
  2. *Nhà thiết kế / Stylist thử nghiệm ý tưởng (What-If Exploration):* Trước khi cắt may một bộ sưu tập cách tân, người thiết kế đặt các câu hỏi giả định (ví dụ: cởi mở khuy vạt áo Tấc làm duster coat, thay đổi màu sắc viền tay áo Nhật Bình) để kiểm chứng ngay phản hồi văn hóa và nhận đề xuất thay thế thông minh (Counter-Proposal).
  3. *Học tập và lan tỏa di sản:* Người yêu cổ phục tra cứu cấu trúc trang phục trực quan (Garment Schematic) với các điểm ghim chú giải nguồn gốc minh bạch từ bảo tàng và tài liệu nghiên cứu.

---

## 3. Tóm tắt giải pháp
KUJO Re:Wear là nền tảng web tương tác thời gian thực, kết hợp giữa **Cơ sở tri thức Văn hóa (Cultural Knowledge Base - CKB)** và mô hình trí tuệ nhân tạo **Google Gemini (gemini-3.8-flash)** nhằm hỗ trợ đồng sáng tạo thời trang cổ phục đương đại:
- **Đĩa xoay phá cách (Remix Dial):** Cho phép điều chỉnh mức độ sáng tạo từ Mức 1 (Bám sát tham chiếu) đến Mức 5 (Phá cách thể nghiệm).
- **Cơ chế 2 bản phối song hành (2-Look Co-Design):** Luôn sinh ra đồng thời Bản phối A (Heritage Anchored - Tôn trọng truyền thống) và Bản phối B (Contemporary Edge - Phá cách đương đại) để người dùng so sánh trực quan.
- **Thẩm định văn hóa minh bạch (Cultural Audit):** Phân tách độc lập 2 tầng đánh giá — Chuẩn mực mẫu thiết kế (*Prototype Compliance*: `compliant` / `conflict`) và Độ tin cậy lịch sử (*Historical Confidence*: `verified` / `needs_review` / `unverified`).
- **Phòng thử nghiệm giả định (What-If Lab):** Đánh giá mọi ý tưởng can thiệp qua hành trình 3 chặng (*Trước* → *Thay đổi* → *Kết quả*), cung cấp giải pháp thay thế của stylist (*Stylist Counter-Proposal*).
- **Công cụ dự phòng xác định (Deterministic Engine):** Tự động duy trì luồng trải nghiệm cốt lõi khi Gemini API tạm thời không khả dụng hoặc không có API key.

---

## 4. Tác động kỳ vọng
- **Xóa bỏ tâm lý e dè đối với di sản:** Giúp người trẻ tự tin tiếp cận, sáng tạo và tự hào diện Việt phục trong đời sống thường nhật mà không sợ vi phạm quy chuẩn.
- **Tạo cầu nối giữa nghiên cứu học thuật và thời trang ứng dụng:** Đưa các tư liệu nghiên cứu từ viện bảo tàng và tạp chí chuyên ngành thành các quy tắc thiết kế có thể tương tác được bằng công nghệ.
- **Tiêu chuẩn hóa tính minh bạch của AI trong văn hóa:** Phân định rạch ròi giữa dữ liệu đã được khảo chứng lịch sử và các thể nghiệm sáng tạo của phòng lab, thiết lập tiền lệ về sự trung thực trong ứng dụng AI cho di sản dân tộc.

---

## 5. Hướng tiếp cận kỹ thuật
- **Kiến trúc Single-Page Application (SPA):** Xây dựng trên React 19, TypeScript và Tailwind CSS, tối ưu hóa hiển thị responsive mượt mà từ màn hình siêu nhỏ (320px) đến máy tính để bàn (1440px).
- **Backend Proxy an toàn:** Node.js/Express đóng vai trò gateway bảo vệ khóa bí mật (server-side API key), tiêm tri thức hệ thống (System Grounding) từ nguồn duy nhất `src/data/ckbRegistry.ts`, kiểm soát hợp đồng dữ liệu (Data Contract Validation) và tự động kích hoạt Deterministic Fallback khi có sự cố.
- **Kiến trúc phòng thủ đa lớp (Defensive Engineering):**
  - Quản lý vòng đời yêu cầu với `AbortController` và chuỗi Request-ID, loại bỏ triệt để xung đột trạng thái mạng (Stale Response).
  - Tách rời trạng thái độc lập (What-If Detach/Reattach) giúp người dùng thử nghiệm tự do mà không làm mất bản phối đã sinh.
  - Tối ưu hiệu năng và khả năng tiếp cận: Tôn trọng tùy chọn hệ thống `prefers-reduced-motion`, cung cấp nút gạt tắt chuyển động thủ công, dọn dẹp bộ định thời (timer cleanup) an toàn.

---

## 6. Cách sử dụng Gemini
- **Mô hình triển khai:** `gemini-3.8-flash` qua SDK chính thức `@google/genai`.
- **Vai trò của Gemini:**
  1. *Stylist sáng tạo chuyên gia:* Phân tích ngữ cảnh (dạo phố, công sở, sự kiện), mức độ Remix Dial và phong cách yêu cầu để xây dựng chi tiết bản phối (chất liệu vải, bảng màu, trang phục lót, phụ kiện, giày dép, triết lý phối đồ).
  2. *Thẩm định viên văn hóa đối soát:* Đối chiếu trực tiếp từng đề xuất với tri thức CKB trong System Instruction để xác định các quy tắc bất biến (*Invariants*), vùng khả biến (*Mutables*), cảnh báo lằn ranh (*Redlines*), và gán chính xác `evidence_ids`.
  3. *Tư vấn phản đề xuất (Counter-Proposal Generator):* Khi người dùng đưa ra giả định xung đột với quy thức trang phục, Gemini đề xuất phương án mỹ thuật tương đương tôn trọng cấu trúc di sản.

---

## 7. Chiến lược Prompting
- **System Instruction Grounding:** Bơm toàn bộ tri thức có cấu trúc từ `CKB_REGISTRY` vào System Instruction, bao gồm mã quy tắc, nội dung quy chuẩn, phân loại (invariant, mutable, sacred_rule), mức độ xác minh nguồn và các ngoại lệ phẩm cấp.
- **Cấu trúc đầu ra nghiêm ngặt (Structured JSON Schema):** Sử dụng `responseMimeType: 'application/json'` và `responseSchema` ép kiểu chặt chẽ từ `@google/genai` (Type.OBJECT, Type.ARRAY) để đảm bảo đầu ra không bao giờ sai lệch định dạng.
- **Chuẩn hóa ngôn ngữ trung lập (Auditor Normalization):**
  - Nghiêm cấm sử dụng điểm số cơ học (0-100%).
  - Chỉ cho phép 3 trạng thái kết luận: `Supported`, `Supported with Caution`, hoặc `Insufficient Evidence`.
  - Phân tách rõ ràng giữa nhận diện thiết kế (*prototype_compliance*) và cơ sở khảo chứng lịch sử (*historical_confidence*).

---

## 8. Điểm khác biệt của sản phẩm
1. **Remix Dial (Đĩa xoay phá cách):** Trải nghiệm tương tác vật lý trực quan, kết hợp mỹ thuật Trống đồng Đông Sơn với số phản hồi tức thì, định hình rõ ràng ranh giới sáng tạo từ bảo tồn đến thể nghiệm.
2. **2-Look Co-Design (Bản phối song hành):** Luôn cung cấp 2 giải pháp đối sánh (Bản A bám sát truyền thống, Bản B phá cách đương đại) giúp người dùng hiểu rõ sự khác biệt giữa chuẩn mực và ứng dụng.
3. **Cultural Audit (Thẩm định văn hóa):** Báo cáo thẩm định chi tiết hiển thị các quy tắc đã kiểm tra, bằng chứng tham chiếu, và các lưu ý văn hóa nhạy cảm.
4. **What If Lab & Decision Journey:** Phòng thử nghiệm tương tác 3 chặng giúp trả lời mọi câu hỏi giả định và cung cấp ngay đề xuất thay thế thông minh.
5. **Tách bạch Prototype Compliance và Historical Confidence:** Đột phá về phương pháp luận đánh giá văn hóa, không đánh đồng sự vi phạm thiết kế với sự thiếu hụt tài liệu khảo cổ.
6. **Mã bằng chứng (Evidence ID) & Minh bạch nguồn:** Mọi đánh giá đều gắn với mã `KB-RULE-01`, `KB-NGUTHAN-01`, `KB-NHATBINH-01`... kèm tên tác giả, cơ quan nghiên cứu và liên kết nguồn gốc.
7. **Source Transparency Badge:** Giao diện công khai minh bạch nguồn dữ liệu của từng bản phối (`Gemini trực tiếp`, `Bản phân tích dự phòng`, `Nguồn chưa xác định`).
8. **Deterministic Fallback Engine:** Duy trì luồng trải nghiệm cốt lõi khi Gemini API tạm thời không khả dụng hoặc không có API key.
9. **Responsive PoC:** Được thiết kế và kiểm tra trên các viewport từ 320px đến 1440px, duy trì bố cục ổn định và không phát sinh cuộn ngang.

---

## 9. Liên kết nghiệm thu & Trình diễn
- **VIDEO_URL:** *(Đang cập nhật link video demo 90-120s theo DEMO_SCRIPT.md)*
- **DEMO_URL:** https://ais-pre-hjtflzcu3t3figluemkfcz-414295093889.asia-southeast1.run.app
- **REPOSITORY_URL:** https://github.com/kujopht/ggarenaaudiotion
