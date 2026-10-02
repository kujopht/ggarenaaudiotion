# KUJO Re:Wear

> **KUJO Re:Wear - Vietnamese Heritage Co-Design & Cultural Reference Studio**  
> Dự án tham gia: **AI Arena Vietnam 2026**

---

## 🌐 Liên kết sản phẩm (Live Demo)

- **Bản chia sẻ (Shared App URL):** [https://ais-pre-hjtflzcu3t3figluemkfcz-414295093889.asia-southeast1.run.app](https://ais-pre-hjtflzcu3t3figluemkfcz-414295093889.asia-southeast1.run.app)
- **Bản phát triển (Development URL):** [https://ais-dev-hjtflzcu3t3figluemkfcz-414295093889.asia-southeast1.run.app](https://ais-dev-hjtflzcu3t3figluemkfcz-414295093889.asia-southeast1.run.app)
- **Mã nguồn (Repository URL):** [https://github.com/kujopht/ggarenaaudiotion](https://github.com/kujopht/ggarenaaudiotion)

---

## 🎯 Giới thiệu & Triết lý thiết kế

**KUJO Re:Wear** giải quyết nghịch lý lớn nhất của phong trào phục hưng cổ phục Việt Nam trong giới trẻ:
*Wear heritage differently — Làm sao để người trẻ tự do ứng dụng cổ phục vào đời sống hiện đại (streetwear, công sở sáng tạo, dạ tiệc) mà không vô tình phá vỡ những quy thức cốt lõi của tiền nhân?*

Hệ thống kết hợp giữa **Cơ sở tri thức văn hóa (Cultural Knowledge Base - CKB)** (lưu trạng thái xác minh riêng cho từng rule và công khai mức độ chắc chắn của nguồn) và năng lực thẩm mỹ sáng tạo của **Google Gemini AI** (mô hình `gemini-3.8-flash`). Người dùng có thể phối đồ, thử nghiệm mọi ý tưởng phá cách (What If) và nhận được các phương án thay thế thông minh (Stylist Counter-Proposal) bảo toàn hồn cốt di sản.

### 🏛️ Trụ cột Trung thực Văn hóa (Single Source of Truth)

1. **Phân tách 2 lớp đánh giá độc lập**:
   - **Chuẩn mực mẫu thiết kế (Prototype Compliance):** `compliant` (hợp lệ) hoặc `conflict` (vi phạm quy ước nhận diện trang phục). Màu đỏ chỉ xuất hiện khi có vi phạm prototype thật sự.
   - **Độ tin cậy lịch sử (Historical Confidence):** `verified` (đã đối soát nguồn thư tịch/bảo tàng), `needs_review` (nguồn đang rà soát thêm), hoặc `unverified` (đề xuất phòng lab chưa có chứng cứ khảo cổ). Tuyệt đối không dùng màu đỏ cho sự thiếu hụt nguồn đơn thuần.
2. **Minh bạch 3 tầng thông tin (Information Tier Separation)**:
   - *Tầng 1 - Dữ liệu lịch sử có nguồn dẫn:* Trích xuất từ các công trình nghiên cứu (*Tạp chí Văn hóa Nghệ thuật*), khảo cứu hiện vật tại Bảo tàng Lịch sử Quốc gia và Bảo tàng Cổ vật Cung đình Huế.
   - *Tầng 2 - Quy tắc nội bộ prototype:* Quy ước cấu trúc dùng để vận hành logic thuật toán trong ứng dụng.
   - *Tầng 3 - Gợi ý sáng tạo đương đại:* Vùng khả biến cho phép Gen Z phối đồ thực tế.
3. **Hiệu chỉnh trung thực các điểm văn hóa nhạy cảm**:
   - `KB-NHATBINH-02`: Dải ngũ hành ở tay áo là đặc điểm tham chiếu theo phẩm cấp (ngoại lệ Hoàng hậu không có dải ngũ hành), không áp đặt là bất biến tuyệt đối.
   - `KB-TAC-02`: Tách bạch tính lễ nghi trang trọng với các quan niệm dân gian kiêng kỵ chưa được chứng thực thư tịch.
   - Minh bạch nguồn gốc: Nhãn nguồn hiển thị chính xác `Gemini trực tiếp` hoặc `Bản phân tích dự phòng` (hoặc `Nguồn chưa xác định`), không bao giờ gây nhầm lẫn.

---

## 🧭 Hướng dẫn Ban Giám khảo (3-Minute Judge Walkthrough)

### Kịch bản 1: Xưởng phối đồ (5 Bước Nhanh)
1. **Bước 1:** Chọn loại áo cổ truyền (*Áo Ngũ Thân tay chẽn*, *Áo Tấc lễ phục*, hoặc *Áo Nhật Bình*). Có thể bấm nút **Gợi ý nhanh (1-chạm)** để thiết lập cấu hình mẫu ngay lập tức.
2. **Bước 2 & 3:** Chọn bối cảnh (*Dạo phố cuối tuần*, *Sự kiện thời trang*, *Công sở sáng tạo*...) và phong cách (*Indigo Denim*, *Tối giản Linen*, *May đo Sartorial*...).
3. **Bước 4:** Xoay đĩa **Remix Dial** từ Mức 1 (*Bám sát tham chiếu*) đến Mức 5 (*Phá cách thể nghiệm*). Vành trống đồng Đông Sơn xoay nhẹ tĩnh tại, số trung tâm phản hồi tức thì.
4. **Bước 5:** Bấm **"5. Tạo 2 bản phối"**: Hệ thống khởi tạo đồng thời:
   - **Bản phối A: Bám sát tham chiếu:** Tôn trọng tối đa phom dáng truyền thống.
   - **Bản phối B: Phá cách đương đại:** Phối layer táo bạo với phụ kiện hiện đại.
5. **Đọc lướt trong 3 giây (At-a-Glance Strip):** Cấu trúc phom dáng, dải màu thực tế (Color Swatches), phụ kiện đề xuất, dịp mặc, nhãn thẩm định CKB và căn cứ nguồn.
6. **Thẻ Lookbook:** Bấm "Thẻ Lookbook" để xuất thẻ thị giác phục vụ chia sẻ xã hội.

### Kịch bản 2: Phòng thử nghiệm giả định (What-If Lab — Decision Journey)
1. Chuyển sang tab **"Thử thay đổi (What If)"** trực tiếp từ bản phối đang chọn hoặc bấm các kịch bản mẫu:
   - **Thử nghiệm vi phạm (Prototype Conflict):** *"What if đổi vạt áo và cài khuy sang bên trái (Tả nhậm)?"* → Hệ thống báo vi phạm quy tắc `KB-RULE-01`, giải thích căn cứ và đưa ra **Stylist Counter-Proposal** (dùng đường may lé hoặc cúc kép để người thuận tay trái thao tác dễ dàng mà không đổi hướng vạt).
   - **Thử nghiệm khả biến an toàn (Safe Mutable):** *"What if cởi mở toàn bộ khuy áo Tấc mặc buông làm áo khoác duster coat?"* → Hệ thống duyệt `KB-TAC-03` là vùng biến tấu sáng tạo hợp lệ.
   - **Thử nghiệm đối soát cấp bậc:** *"What if bỏ dải màu ngũ sắc ở viền tay áo Nhật Bình?"* → Hệ thống đối chiếu `KB-NHATBINH-02`, lưu ý ngoại lệ phẩm cấp Hoàng hậu và khuyến nghị phối màu tone-sur-tone.
2. **Hành trình ra quyết định (Decision Journey 3 Chặng):**
   - **Chặng 1 - Trước:** Quy thức gốc của trang phục.
   - **Chặng 2 - Thay đổi đề xuất:** Ý tưởng can thiệp của người dùng.
   - **Chặng 3 - Kết quả tham chiếu:** Thẩm định 2 lớp độc lập và đề xuất giải pháp thay thế.

### Kịch bản 3: Cấu trúc áo (Anatomy) & Sơ đồ tương tác
- Khám phá các điểm ghim tương tác trên đồ họa vector áo Ngũ Thân, Áo Tấc, Áo Nhật Bình.
- Bấm vào từng điểm ghim để xem giải thích quy thức bất biến (màu xanh ngọc) và vùng khả biến sáng tạo (màu vàng đồng).
- Đối với Áo Nhật Bình, dải màu ngũ hành cổ tay được chú thích rõ là ví dụ tham chiếu theo phẩm cấp (Hoàng hậu là ngoại lệ).

### Kịch bản 4: Bộ Quy tắc CKB Registry
- Xem toàn bộ 12 quy tắc văn hóa đã được lập chỉ mục, với tỷ lệ xác minh minh bạch: Verified (1), Needs Review (8), Unverified (3).
- Xem đầy đủ URL bài báo nghiên cứu, tác giả, loại nguồn và trích đoạn lịch sử.

---

## 📊 Bảng thống kê Cơ sở tri thức Văn hóa (CKB Registry)

| Mã quy tắc | Tên quy tắc | Phân loại | Trang phục áp dụng | Trạng thái xác minh | Nguồn tham chiếu thực tế (CKB Registry) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **KB-RULE-01** | Quy thức Hữu nhậm | `invariant` | Ngũ Thân, Áo Tấc | `needs_review` | **Bảo tàng Lịch sử Quốc gia** — *"Bảo tàng Lịch sử quốc gia tiếp nhận áo dài ngũ thân truyền thống"* [baotanglichsu.vn](https://baotanglichsu.vn/vi/Articles/3090/72685/bao-tang-lich-su-quoc-gia-tiep-nhan-ao-dai-ngu-than-truyen-thong.html) |
| **KB-RULE-02** | Cấu trúc Ngũ thân | `invariant` | Ngũ Thân, Áo Tấc | `needs_review` | **Khám phá Huế (huecit.com)** — *"Tổng hợp những địa chỉ may áo dài ngũ thân tại Huế"* [kph2022.huecit.com](https://kph2022.huecit.com/Van-hoa/Hue-Kinh-%C4%91o-ao-dai-Viet-Nam/Chi-tiet/tid/Tong-hop-nhung-dia-chi-may-ao-dai-ngu-than-tai-Hue.html/pid/6335/cid/352) |
| **KB-RULE-03** | Quy chế Biểu tượng Hoàng quyền (Rồng 5 móng) | `sacred_rule` | Toàn bộ | `needs_review` | **Bảo tàng Lịch sử Quốc gia (bài của TS. Trần Đức Anh Sơn)** — *"Hình ảnh con rồng trên trang phục cung đình triều Nguyễn"* [baotanglichsu.vn](https://baotanglichsu.vn/VI/Articles/3096/18431/hinh-anh-con-rong-tren-trang-phuc-cung-djinh-trieu-nguyen.html) |
| **KB-NGUTHAN-01** | Áo Ngũ Thân tay chẽn - Cổ đứng | `invariant` | Áo Ngũ Thân | `needs_review` | **Tạp chí Văn hóa Nghệ thuật** — *"Nhận diện và phát huy giá trị Áo dài truyền thống trong bối cảnh hội nhập - Bài 1: Giá trị thẩm mỹ và bản sắc văn hóa của trang phục áo dài"* [vanhoanghethuat.vn](https://vanhoanghethuat.vn/nhan-dien-va-phat-huy-gia-tri-ao-dai-truyen-thong-trong-boi-canh-hoi-nhap-bai-1-gia-tri-tham-m-va-ban-sac-van-hoa-cua-trang-phuc-ao-dai-77753129.html) |
| **KB-NGUTHAN-02** | Áo Ngũ Thân tay chẽn - Ống tay chẽn | `invariant` | Áo Ngũ Thân | `needs_review` | **Tạp chí Văn hóa Nghệ thuật** — *"Nhận diện và phát huy giá trị Áo dài truyền thống trong bối cảnh hội nhập - Bài 1: Giá trị thẩm mỹ và bản sắc văn hóa của trang phục áo dài"* [vanhoanghethuat.vn](https://vanhoanghethuat.vn/nhan-dien-va-phat-huy-gia-tri-ao-dai-truyen-thong-trong-boi-canh-hoi-nhap-bai-1-gia-tri-tham-m-va-ban-sac-van-hoa-cua-trang-phuc-ao-dai-77753129.html) |
| **KB-NGUTHAN-03** | Áo Ngũ Thân tay chẽn - Vùng khả biến | `mutable` | Áo Ngũ Thân | `unverified` | **Đề xuất sáng tạo của prototype** (internal_heuristic) — Không có historical source đã xác minh |
| **KB-TAC-01** | Áo Tấc - Tay thụng dài bằng gấu | `invariant` | Áo Tấc | `needs_review` | **Tạp chí Văn hóa Nghệ thuật** — *"Gen Z và trào lưu phục dựng cổ phục Việt - Tương lai nối dài quá khứ"* [vanhoanghethuat.vn](https://vanhoanghethuat.vn/gen-z-va-trao-luu-phuc-dung-co-phuc-viet-tuong-lai-noi-dai-qua-khu-77755196.html) |
| **KB-TAC-02** | Áo Tấc - Tính lễ nghi thân trên | `invariant` | Áo Tấc | `needs_review` | **Tạp chí Văn hóa Nghệ thuật** — *"Gen Z và trào lưu phục dựng cổ phục Việt - Tương lai nối dài quá khứ"* [vanhoanghethuat.vn](https://vanhoanghethuat.vn/gen-z-va-trao-luu-phuc-dung-co-phuc-viet-tuong-lai-noi-dai-qua-khu-77755196.html) |
| **KB-TAC-03** | Áo Tấc - Vùng khả biến (Duster coat) | `mutable` | Áo Tấc | `unverified` | **Đề xuất sáng tạo của prototype** (internal_heuristic) — Không có historical source đã xác minh |
| **KB-NHATBINH-01** | Áo Nhật Bình - Nẹp cổ đối khâm | `invariant` | Áo Nhật Bình | `verified` | **Lê Thị Hà (Tạp chí Văn hóa Nghệ thuật)** — *"Hoa văn trang trí trên áo Nhật Bình của Đoan Huy Hoàng thái hậu triều Nguyễn (1802-1945)"*, Hiện vật BTH/TB.Đd.17 tại Bảo tàng Cổ vật Cung đình Huế [vanhoanghethuat.vn](https://vanhoanghethuat.vn/hoa-van-trang-tri-tren-ao-nhat-binh-cua-doan-huy-hoang-thai-hau-trieu-nguyen-1802-1945-77758106.html) |
| **KB-NHATBINH-02** | Áo Nhật Bình - Dải ngũ hành theo phẩm cấp | `mutable` | Áo Nhật Bình | `needs_review` | **Tạp chí Văn hóa Nghệ thuật** — *"Áo Nhật Bình: Một di sản văn hóa quý của Cố đô Huế"* [vanhoanghethuat.vn](https://vanhoanghethuat.vn/ao-nhat-binh-mot-di-san-van-hoa-quy-cua-co-do-hue-77752065.html) |
| **KB-NHATBINH-03** | Áo Nhật Bình - Vùng khả biến (Mở tà, phối chân váy) | `mutable` | Áo Nhật Bình | `unverified` | **Đề xuất sáng tạo của prototype** (internal_heuristic) — Không có historical source đã xác minh |

**Thống kê trạng thái xác minh CKB:**
- **Đã xác thực (Verified):** 1 (`KB-NHATBINH-01`)
- **Chờ rà soát (Needs Review):** 8 (`KB-RULE-01`, `KB-RULE-02`, `KB-RULE-03`, `KB-NGUTHAN-01`, `KB-NGUTHAN-02`, `KB-TAC-01`, `KB-TAC-02`, `KB-NHATBINH-02`)
- **Đề xuất thể nghiệm sáng tạo (Unverified):** 3 (`KB-NGUTHAN-03`, `KB-TAC-03`, `KB-NHATBINH-03`)
- **Tổng số quy tắc:** 12

---

## 🛠️ Kiến trúc Hệ thống & Độ ổn định (Production Hardening)

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT: REACT 19 SPA                     │
│  - CoDesignStudio (5-Step Quick Flow & 1-Click Presets)     │
│  - WhatIfLab (3-Stage Decision Journey & Preset Scenarios)  │
│  - GarmentSchematic (Interactive Vector Architecture)       │
│  - HeritageBackground (Serene Phoenix & Hypnotic Bronze Drum)│
│  - CulturalAuditPanel & CKB Registry Explorer               │
└──────────────────────────────┬──────────────────────────────┘
                               │
            fetch (/api/remix/generate, /api/remix/what-if)
            [Guards: AbortController, Request-ID, Fallback]
                               │
┌──────────────────────────────▼──────────────────────────────┐
│             NODE.JS / EXPRESS SERVER PROXY                  │
│  - Server-side GEMINI_API_KEY protection                    │
│  - Grounding Prompt Injection from CKB_REGISTRY             │
│  - Contract Validation: Exactly 2 Valid Proposals           │
│  - Deterministic Fallback Engine (Auto-switches on error)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   GOOGLE GEMINI API ENGINE                  │
│  - Primary model: gemini-3.8-flash                          │
│  - Availability fallback: gemini-3.1-flash-lite             │
│  - Final offline/API fallback: deterministic cultural engine│
└─────────────────────────────────────────────────────────────┘
```

### Các cơ chế phòng vệ và ổn định đã được kiểm thử tự động (94/94 PASS):
1. **AbortController & Request ID Sequencing:** Khi người dùng đổi loại áo hoặc chuyển tab liên tục, mọi yêu cầu mạng đang dang dở đều bị hủy ngay lập tức, không bao giờ ghi đè kết quả của yêu cầu mới.
2. **Stale Response Protection:** Phản hồi từ mạng về muộn sau khi giao diện đã đổi trạng thái sẽ bị loại bỏ an toàn.
3. **Garment Validation Contract:** Nghiêm cấm trường hợp người dùng chọn Nhật Bình mà AI trả về Ngũ Thân. Khi dữ liệu vi phạm contract, hệ thống tự động kích hoạt **Deterministic Engine Fallback**.
4. **Exact Source Badge:** Giao diện hiển thị rõ ràng nguồn kết quả (`Gemini trực tiếp`, `Bản phân tích dự phòng`, hoặc `Nguồn chưa xác định`).
5. **Response Normalization:** Tự động lọc các tuyên bố phóng đại quá mức từ AI (như "chính xác lịch sử 100%"), ép về chuẩn đánh giá trung lập của CKB.
6. **What-If Detach / Reattach:** Tách rời trạng thái thử nghiệm What-If độc lập mà không phá hủy mảng proposals đã tạo trong Studio.

---

## 📱 Khả năng tương thích Responsive

Hệ thống được thiết kế và kiểm thử chuyên biệt trên toàn bộ dải kích thước màn hình:
- **320px (iPhone SE cũ, màn hình siêu nhỏ):** Thanh điều hướng rút gọn nhãn nút, thương hiệu không gãy dòng, không có thanh cuộn ngang trang.
- **360px & 390px (Android tiêu chuẩn & iPhone hiện đại):** Bố cục dọc mượt mà, touch target >= 44px, nút gạt chuyển động nhỏ gọn.
- **430px (iPhone Pro Max):** Bố trí 2 cột các nút preset, hiển thị sắc nét.
- **768px (iPad / Tablet dọc):** Hiển thị cánh chim phượng lượn uyển chuyển (chu kỳ 28s, nghỉ 55-80s), bố cục Studio chuyển sang dạng bảng thông minh.
- **1024px & 1440px (Laptop & Desktop Ultra-wide):** Tỷ lệ vàng thời trang (Editorial Fashion Spread), trống đồng Đông Sơn làm nền nghệ thuật, không gây tranh chấp thị giác với nội dung chính.

---

## 💻 Hướng dẫn Chạy Cục bộ & Kiểm thử

### Cài đặt
```bash
# Cài đặt thư viện phụ thuộc
npm install
```

### Chạy kiểm thử tự động (94 test cases bao phủ logic, browser & PR #270 rollback)
```bash
npm test
```

### Chạy kiểm tra cú pháp TypeScript & Linting
```bash
npm run lint
```

### Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
# Mở trình duyệt tại http://localhost:3000
```

### Xây dựng bản phân phối sản xuất (Production Build)
```bash
npm run build
```

---

## 📜 Cam kết Bản quyền & Đạo đức Văn hóa

Dự án phát triển với tinh thần tôn kính văn hiến dân tộc Việt Nam. Toàn bộ hình họa và đồ họa vector trong ứng dụng là tác phẩm phác họa nghệ thuật thị giác lấy cảm hứng từ trang phục cổ, không thay thế cho bản vẽ kỹ thuật may mặc khảo cổ chuyên sâu hay tài liệu pháp lý của các cơ quan quản lý di sản. Mỗi claim được gắn trạng thái verified, needs_review hoặc unverified và ghi nhận nguồn minh bạch.
