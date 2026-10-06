# SUBMISSION FORM COPY - AI ARENA VIETNAM 2026

## 1. Solution Name
**KUJO Re:Wear - Vietnamese Heritage Co-Design & Cultural Reference Studio**

---

## 2. User Need / Problem
Gen Z và các nhà sáng tạo trẻ ngày càng khao khát đưa di sản Việt phục vào đời sống thường nhật (streetwear, công sở sáng tạo, lễ hội). Tuy nhiên, họ luôn đối mặt với rào cản tâm lý e dè (cultural anxiety): không rõ chi tiết nào là bất biến cần bảo tồn, chi tiết nào có thể tự do biến tấu, và lo sợ bị cộng đồng đánh giá là "phối sai quy chuẩn văn hóa". Khoảng trống mà KUJO Re:Wear hướng tới là kết hợp trải nghiệm đồng thiết kế hiện đại với tham chiếu văn hóa minh bạch và trạng thái xác minh nguồn để người trẻ tự tin diện cổ phục.

---

## 3. Solution Summary
KUJO Re:Wear là nền tảng AI Cultural Co-Designer kết hợp Cơ sở tri thức Văn hóa (Cultural Knowledge Base - CKB) với mô hình Google Gemini nhằm hỗ trợ thế hệ trẻ đồng sáng tạo Việt phục đương đại. Người dùng lựa chọn 1 trong 3 loại cổ phục thời Nguyễn (Áo Ngũ Thân tay chẽn, Áo Tấc, Áo Nhật Bình), thiết lập bối cảnh, phong cách, bảng màu, phụ kiện và điều chỉnh độ phá cách qua đĩa xoay Remix Dial (mức 1-5). Hệ thống lập tức tạo ra 2 bản phối song hành: Heritage Anchored (bám sát truyền thống) và Contemporary Remix (phá cách hiện đại). Đi kèm mỗi bản phối là bảng So sánh nhanh khách quan (Quick Compare) và báo cáo Thẩm định văn hóa (Cultural Audit) phân tách độc lập giữa chuẩn mực mẫu thiết kế (Prototype Compliance) và độ tin cậy lịch sử (Historical Confidence). Người dùng còn có thể đặt câu hỏi giả định trong phòng thử nghiệm What If Lab để nhận giải pháp thay thế thông minh (Stylist Counter-Proposal), tra cứu cấu trúc giải phẫu áo tương tác, xem trước thẻ Lookbook theo tỉ lệ 4:5 Social và 9:16 Story, chuẩn bị khung xuất và sao chép nội dung chia sẻ kèm mã căn cứ CKB.

---

## 4. Expected Impact
KUJO Re:Wear xóa bỏ tâm lý e ngại văn hóa, tiếp thêm tự tin cho giới trẻ đưa Việt phục hòa nhập tự nhiên vào nhịp sống thường nhật. Ứng dụng đóng vai trò cầu nối chuyển hóa các nguồn bảo tàng, nghiên cứu và quy tắc prototype được phân tầng rõ ràng thành quy tắc thiết kế công nghệ sống động, dễ tiếp cận. Đồng thời, nền tảng thiết lập chuẩn mực về sự trung thực của AI trong lĩnh vực di sản: không giả vờ chắc chắn khi dữ liệu khảo chứng chưa đủ, tôn trọng tính nguyên bản nhưng không cấm đoán cứng nhắc sự sáng tạo đương đại.

---

## 5. Technical Approach
KUJO Re:Wear được xây dựng theo kiến trúc Single-Page Application (SPA) trên nền tảng React 19, TypeScript và Tailwind CSS, bảo đảm hiển thị mượt mà và chuẩn mực accessibility từ thiết bị di động 320px đến desktop 1440px. Phía sau giao diện là Express API proxy đóng vai trò gateway an toàn, bảo vệ khóa API server-side và tiêm tri thức hệ thống từ nguồn chân lý duy nhất `src/data/ckbRegistry.ts`. Hệ thống áp dụng nguyên lý công nghệ phòng thủ đa lớp (Defensive Engineering): sử dụng AbortController và chuỗi Request-ID giúp loại bỏ stale response theo request lifecycle hiện tại khi chuyển tab liên tục; tách rời độc lập luồng What If để không làm mất bản phối đã sinh; và tích hợp bộ xử lý dự phòng xác định (Deterministic Engine Fallback) sẵn sàng duy trì trọn vẹn luồng trải nghiệm cốt lõi ngay cả khi mạng gián đoạn hoặc không có API key.

---

## 6. How Gemini Is Used
KUJO Re:Wear khai thác sức mạnh của Google Gemini qua SDK chính thức `@google/genai` với chiến lược phân tầng sẵn sàng cao (Model Cascade): ưu tiên mô hình tiên tiến `gemini-3.8-flash`, tự động chuyển đổi sang `gemini-3.1-flash-lite` khi lưu lượng cao, và về `deterministic cultural engine` nếu ngoại tuyến. Gemini đảm nhận 3 vai trò then chốt:
1. **Chuyên gia phong cách (Expert Stylist):** Phân tích đa chiều về bối cảnh, vật liệu, bảng màu và mức độ Remix Dial để đề xuất trang phục hài hòa.
2. **Thẩm định viên văn hóa (Cultural Auditor):** Đối soát từng chi tiết thiết kế với tri thức CKB được tiêm vào System Grounding, trích xuất chính xác các mã bằng chứng (`evidence_ids`).
3. **Cố vấn phản đề xuất (Counter-Proposal Generator):** Khi phát hiện ý tưởng can thiệp xung đột với quy thức bất biến, Gemini lý giải ranh giới lịch sử và chủ động đưa ra giải pháp thay thế bảo toàn ý đồ thẩm mỹ phá cách của người dùng. Mọi phản hồi đều được server chuẩn hóa và kiểm soát chặt chẽ; server chủ động hạ mức certainty khi output vượt quá trạng thái evidence CKB, giảm nguy cơ AI đưa ra kết luận chắc chắn hơn bằng chứng hiện có.

---

## 7. Prompting and Grounding Strategy
Toàn bộ tri thức CKB (gồm các quy tắc bất biến Invariant, vùng khả biến Mutable, ranh giới cấm kỵ Redline, cấp độ khảo chứng học thuật và trích dẫn nguồn) được chuyển đổi động và tiêm trực tiếp vào System Instruction của Gemini. Đầu ra được khóa chặt bằng cấu trúc JSON Schema nghiêm ngặt (`responseSchema` với kiểu Type.OBJECT, Type.ARRAY) để hạn chế tối đa sai lệch định dạng. Chiến lược prompting đặt trọng tâm vào tính trung lập và chuẩn hóa văn hóa: nghiêm cấm chấm điểm số cơ học (Heritage Score) hay phân định thắng-thua; chỉ kết luận theo 3 trạng thái chuẩn (`Supported`, `Supported with Caution`, `Insufficient Evidence`); và phân định rạch ròi giữa quy chuẩn thiết kế prototype với độ tin cậy của tài liệu khảo cổ.

---

## 8. Key Differentiators
1. **Remix Dial (Đĩa xoay phá cách):** Trải nghiệm tương tác vật lý trực quan, kết hợp mỹ thuật Trống đồng Đông Sơn, điều tiết linh hoạt ranh giới sáng tạo từ bảo tồn (mức 1) đến thể nghiệm (mức 5).
2. **2-Look Co-Design (Bản phối song hành):** Luôn sinh song song 2 bản phối Heritage Anchored và Contemporary Remix để đối chiếu trực quan thay vì chỉ đưa ra một lựa chọn duy nhất.
3. **Phân tách Prototype Compliance & Historical Confidence:** Phương pháp luận thẩm định văn hóa đột phá, không đánh đồng sự vi phạm phom dáng thiết kế với sự thiếu hụt tài liệu khảo cứu lịch sử.
4. **What If Lab với Stylist Counter-Proposal:** Tư vấn phản đề xuất thông minh, gìn giữ tinh thần phá cách của người dùng thay vì từ chối cứng nhắc.
5. **Cơ sở tri thức CKB minh bạch & liên kết nguồn:** Mọi đánh giá đều gắn với mã định danh cụ thể (KB-RULE-01, KB-NGUTHAN-01...), kèm tên học giả, tổ chức nghiên cứu và liên kết tham chiếu gốc.
6. **Thẻ Lookbook văn hóa chia sẻ:** Xem trước chuẩn 4:5 Social và 9:16 Story, chuẩn bị khung xuất minh bạch và sao chép nội dung chia sẻ trích dẫn đầy đủ mã căn cứ CKB.

---

## 9. Links
- **DEMO_URL:** https://ais-pre-hjtflzcu3t3figluemkfcz-414295093889.asia-southeast1.run.app
- **REPOSITORY_URL:** https://github.com/kujopht/ggarenaaudiotion
- **VIDEO_URL:** TO_FILL_AFTER_RECORDING
- **GEMINI_CONVERSATION_URL:** TO_FILL_BEFORE_SUBMISSION

---

## 10. One-line Pitch
- **Tiếng Việt:** KUJO Re:Wear là nền tảng AI Cultural Co-Designer giúp Gen Z tự tin remix Việt phục đương đại với hệ thống tham chiếu di sản và phản đề xuất thẩm mỹ minh bạch.
- **English:** KUJO Re:Wear is an AI Cultural Co-Designer empowering Gen Z to remix traditional Vietnamese garments with transparent heritage grounding, dual-layer audits, and creative counter-proposals.
