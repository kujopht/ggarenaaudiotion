# HỒ SƠ ĐĂNG KÝ DỰ THI AI ARENA VIETNAM 2026

## 1. Tên giải pháp
**KUJO Re:Wear - Vietnamese Heritage Co-Design & Cultural Reference Studio**

---

## 2. Nhu cầu người dùng và tình huống sử dụng
- **Định vị sản phẩm & Nhu cầu người dùng:**  
  KUJO Re:Wear là **AI Cultural Co-Designer** giúp thế hệ trẻ (Gen Z, nhà sáng tạo nội dung, nhà thiết kế trẻ) đồng sáng tạo và remix Việt phục theo cá tính riêng trong đời sống hiện đại, đồng thời chỉ rõ đâu là vùng có thể tự do sáng tạo, đâu là đặc trưng cần lưu ý và căn cứ văn hóa nằm ở đâu. Sản phẩm không định vị như một công cụ sinh ảnh thời trang đơn thuần (fashion generator), mà là một hệ thống tham chiếu và thẩm định văn hóa tương tác.
- **Vấn đề cốt lõi (Problem Framing):**  
  Gen Z ngày càng khao khát đưa di sản cổ phục vào đời sống thường nhật (thời trang đường phố - streetwear, công sở sáng tạo, lễ hội, sự kiện văn hóa nghệ thuật). Tuy nhiên, họ luôn đối mặt với rào cản tâm lý e dè (cultural anxiety): *không biết chi tiết nào có thể biến tấu, chi tiết nào nên giữ nguyên và lo ngại bị cộng đồng đánh giá là phối sai chuẩn mực văn hóa.* Khoảng trống mà KUJO Re:Wear hướng tới là kết hợp trải nghiệm đồng thiết kế hiện đại với tham chiếu văn hóa minh bạch và trạng thái xác minh nguồn để người trẻ tự tin diện cổ phục.
- **Tình huống sử dụng thực tế:**
  1. *Gen Z phối đồ thường nhật:* Chọn Áo Ngũ Thân hoặc Áo Tấc dạo phố, kết hợp quần jeans, sneakers, bảng màu cá nhân và túi xách hiện đại mà vẫn yên tâm giữ đúng cấu trúc vạt hữu nhậm và cài khuy.
  2. *Nhà thiết kế / Stylist thử nghiệm ý tưởng (What-If Exploration):* Trước khi cắt may, người thiết kế đặt các câu hỏi giả định (ví dụ: mở vạt áo Tấc như duster coat, thay đổi hướng cài khuy) để kiểm chứng ngay phản hồi văn hóa và nhận đề xuất thay thế thẩm mỹ (*Stylist Counter-Proposal*).
  3. *Tra cứu cấu trúc di sản minh bạch:* Xem sơ đồ giải phẫu y phục tương tác (*Interactive Structural Reference*) với các điểm ghim chú giải nguồn gốc minh bạch từ CKB (Cultural Knowledge Base).
  4. *Chia sẻ thẻ phong cách văn hóa:* Xem trước thẻ Lookbook chuẩn tỉ lệ 4:5 Social hoặc 9:16 Story, chuẩn bị khung xuất và sao chép nội dung chia sẻ kèm mã căn cứ CKB.

---

## 3. Tóm tắt giải pháp
KUJO Re:Wear là nền tảng web tương tác thời gian thực, kết hợp giữa **Cơ sở tri thức Văn hóa (Cultural Knowledge Base - CKB)** và mô hình trí tuệ nhân tạo **Google Gemini (gemini-3.8-flash)** với cơ chế phòng vệ đa tầng:
- **3 loại cổ phục thời Nguyễn:** Áo Ngũ Thân tay chẽn, Áo Tấc (tay thụng lễ phục), và Áo Nhật Bình (nữ phục đối khâm).
- **Bộ thông số đầu vào linh hoạt:** Loại cổ phục (Garment), Bối cảnh (Context), Phong cách (Style), Bảng màu ưa thích (Color Preference), Định hướng phụ kiện (Accessory Direction), và Đĩa xoay phá cách (Remix Dial mức 1-5).
- **Cơ chế 2 bản phối song hành (2-Look Co-Design):** Luôn sinh ra đồng thời:
  - **Heritage Anchored:** Bản phối bám sát tham chiếu truyền thống, giữ trọn vẹn quy thức cổ truyền.
  - **Contemporary Remix:** Bản phối đương đại ứng dụng phụ kiện, chất liệu và bảng màu mới mẻ theo mức độ Remix Dial.
- **So sánh nhanh (Quick Compare):** Bảng đối chiếu 6 tiêu chí (Cấu trúc & phom, Chất liệu, Bảng màu, Giày & phụ kiện, Remix level, Thẩm định CKB) khách quan, không chấm điểm cơ học, không tạo winner.
- **Thẩm định văn hóa minh bạch (Cultural Audit):** Phân tách độc lập 2 tầng đánh giá:
  - **Prototype Compliance:** `compliant` (tuân thủ), `conflict` (xung đột), `unassessed` (chưa đánh giá).
  - **Historical Confidence:** `verified` (đã kiểm chứng), `partially_verified` (xác thực một phần), `needs_review` (chờ đối soát), `unverified` (chưa đối soát độc lập), `mixed` (nguồn hỗn hợp).
- **Phòng thử nghiệm giả định (What-If Lab):** Đánh giá mọi ý tưởng can thiệp qua hành trình 3 chặng (*Trước* → *Thay đổi* → *Kết quả*), cung cấp giải pháp thay thế của stylist (*Stylist Counter-Proposal*) cố gắng giữ trọn vẹn ý định phá cách của người dùng thay vì chỉ từ chối.
- **Sơ đồ giải phẫu y phục (Interactive Structural Reference):** Bản vẽ cấu trúc kỹ thuật phân định rõ Vùng Bất Biến (Invariant) và Vùng Khả Biến (Mutable), độc lập với ảnh dựng thời trang.
- **Thẻ Lookbook văn hóa chia sẻ (Lookbook Card):** Tùy chọn khung xem trước chuẩn 4:5 Social và 9:16 Story, chuẩn bị khung xuất minh bạch và sao chép nội dung chia sẻ kèm trích dẫn mã căn cứ CKB.
- **Dự phòng văn hóa xác định (Deterministic Engine Fallback):** Tự động duy trì luồng trải nghiệm cốt lõi khi Gemini API tạm thời gián đoạn hoặc không có API key.

---

## 4. Tác động kỳ vọng
- **Giải tỏa nỗi e ngại văn hóa (Cultural Anxiety):** Tiếp thêm tự tin cho Gen Z diện và làm mới Việt phục trong đời sống hằng ngày mà không sợ bị phán xét hay vô tình làm sai lệch quy thức.
- **Kết nối nghiên cứu học thuật với thiết kế ứng dụng:** Biến các nguồn bảo tàng, nghiên cứu và quy tắc prototype được phân tầng rõ ràng thành quy tắc thiết kế sống động, dễ tiếp cận và có thể kiểm chứng.
- **Thiết lập chuẩn mực về sự trung thực của AI trong văn hóa:** Phân định rõ ràng giữa quy tắc thiết kế prototype và mức độ xác thực của bằng chứng lịch sử, kiên quyết không để AI khẳng định quá đà hay tự nâng độ chắc chắn vượt qua nguồn tư liệu.

---

## 5. Hướng tiếp cận kỹ thuật
- **Kiến trúc Single-Page Application (SPA):** Xây dựng trên React 19, TypeScript và Tailwind CSS, tối ưu hóa responsive mượt mà từ màn hình siêu nhỏ (320px) đến máy tính để bàn (1440px).
- **Backend Proxy an toàn:** Node.js/Express đóng vai trò gateway bảo vệ API key phía máy chủ, tiêm tri thức hệ thống (System Grounding) từ nguồn duy nhất `src/data/ckbRegistry.ts`, kiểm soát hợp đồng dữ liệu (Data Contract Validation) và tự động kích hoạt Deterministic Fallback khi có sự cố.
- **Kỹ thuật phòng thủ đa lớp (Defensive Engineering):**
  - Quản lý vòng đời yêu cầu với `AbortController` và chuỗi Request-ID giúp giảm rủi ro xung đột trạng thái mạng (Stale Response) theo request lifecycle hiện tại.
  - Tách rời trạng thái độc lập (What-If Detach/Reattach) giúp người dùng thử nghiệm tự do mà không làm mất bản phối đã sinh.
  - Tôn trọng tùy chọn hệ thống `prefers-reduced-motion`, cung cấp nút gạt tắt chuyển động thủ công, dọn dẹp bộ định thời an toàn.
  - Xử lý clipboard an toàn với fallback, bảo đảm ứng dụng xử lý an toàn ngay cả khi trình duyệt hạn chế quyền truy cập.

---

## 6. Cách sử dụng Gemini
- **Mô hình triển khai đa tầng (Model Cascade):**
  - *Mô hình chính:* `gemini-3.8-flash` qua SDK chính thức `@google/genai`.
  - *Mô hình dự phòng sẵn sàng:* `gemini-3.1-flash-lite` khi lưu lượng cao.
  - *Dự phòng ngoại tuyến cuối cùng:* `deterministic cultural engine`.
- **Vai trò của Gemini:**
  1. *Stylist sáng tạo chuyên gia:* Phân tích ngữ cảnh, phong cách, màu sắc, phụ kiện và mức độ Remix Dial để xây dựng chi tiết bản phối có cấu trúc rõ ràng.
  2. *Thẩm định viên văn hóa đối soát:* Đối chiếu trực tiếp từng đề xuất với tri thức CKB trong System Instruction để xác định các quy tắc bất biến (*Invariants*), vùng khả biến (*Mutables*), cảnh báo lằn ranh (*Redlines*), và gán chính xác `evidence_ids`.
  3. *Tư vấn phản đề xuất (Counter-Proposal Generator):* Khi người dùng đưa ra giả định xung đột với quy thức trang phục, Gemini đề xuất phương án mỹ thuật tương đương, tích hợp giải pháp công thái học hiện đại để giữ ý định thẩm mỹ của người dùng.
- **Kiểm soát & Chuẩn hóa đầu ra (Output Normalization):**
  - Server kiểm tra và chuẩn hóa phản hồi từ Gemini dựa trên trạng thái khảo chứng thực tế của CKB.
  - Nếu bằng chứng lịch sử đang ở trạng thái `needs_review` hoặc `unverified`, server chủ động trung hòa các phát ngôn khẳng định vượt quá bằng chứng (ví dụ: các tuyên bố tuyệt đối).
  - Nghiêm cấm gán nhãn conflict cho thiết kế khi dữ liệu chỉ thiếu bằng chứng (`unassessed`).
  - Hệ thống chỉ cung cấp hình ảnh minh họa phong cách (Editorial Visual) và sơ đồ cấu trúc kỹ thuật (Structural Reference), không sinh ảnh ảo hallucination.

---

## 7. Chiến lược Prompting & Grounding
- **System Instruction Grounding:** Bơm toàn bộ tri thức có cấu trúc từ `CKB_REGISTRY` vào System Instruction, bao gồm mã căn cứ, tên quy tắc, mô tả chi tiết, phân loại (invariant, mutable, sacred_rule), mức độ xác minh nguồn và các ngoại lệ phẩm cấp.
- **Cấu trúc đầu ra nghiêm ngặt (Structured JSON Schema):** Sử dụng `responseMimeType: 'application/json'` và `responseSchema` ép kiểu chặt chẽ từ `@google/genai` (Type.OBJECT, Type.ARRAY) để hạn chế tối đa sai lệch định dạng.
- **Chuẩn hóa ngôn ngữ trung lập (Auditor Normalization):**
  - Không sử dụng điểm số cơ học (0-100%) hay bảng xếp hạng thắng-thua.
  - Kết luận chỉ dùng 3 trạng thái chuẩn: `Supported`, `Supported with Caution`, hoặc `Insufficient Evidence`.
  - Giữ nguyên tắc thận trọng: "Hệ thống không giả vờ chắc chắn khi dữ liệu chưa đủ."

---

## 8. Điểm khác biệt cốt lõi
1. **Remix Dial (Đĩa xoay phá cách):** Tương tác trực quan kết hợp hoa văn Trống đồng Đông Sơn, điều tiết mức độ sáng tạo từ bảo tồn trang trọng (mức 1) đến phá cách thể nghiệm (mức 5).
2. **2-Look Co-Design (Bản phối song hành):** Luôn cung cấp song song Heritage Anchored (gốc) và Contemporary Remix (mới) để người dùng đối chiếu.
3. **Phân tách Prototype Compliance & Historical Confidence:** Không đánh đồng sự vi phạm hình thái thiết kế với sự thiếu hụt tài liệu khảo cổ.
4. **What If Lab với Stylist Counter-Proposal:** Đưa ra phương án giải quyết thay thế tôn trọng ý định người dùng thay vì cấm đoán cứng nhắc.
5. **Căn cứ CKB minh bạch & liên kết nguồn:** Mọi đánh giá đều gắn với mã `KB-RULE-01`, `KB-NGUTHAN-01`, `KB-NHATBINH-01`... kèm tên học giả, cơ quan nghiên cứu và đường dẫn tham chiếu.
6. **Thẻ Lookbook văn hóa chia sẻ:** Xem trước chuẩn 4:5 và 9:16, chuẩn bị khung xuất minh bạch và sao chép nội dung kèm đầy đủ mã căn cứ CKB.

---

## 9. Liên kết nghiệm thu & Trình diễn
- **DEMO_URL:** https://ais-pre-hjtflzcu3t3figluemkfcz-414295093889.asia-southeast1.run.app
- **REPOSITORY_URL:** https://github.com/kujopht/ggarenaaudiotion
- **VIDEO_URL:** TO_FILL_AFTER_RECORDING
- **GEMINI_CONVERSATION_URL:** TO_FILL_BEFORE_SUBMISSION
