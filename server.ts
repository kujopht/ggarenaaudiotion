import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent as required by Gemini API skill
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Cultural Knowledge Base (CKB) text for prompt grounding
const CKB_SYSTEM_GROUNDING = `
BẠN LÀ HỆ THỐNG "VIỆTPHỤC REMIX LAB" - ĐỒNG THỜI GIỮ 2 VAI TRÒ:
1. Contemporary Fashion Co-Designer: Chuyên gia sáng tạo thời trang đương đại, giúp Gen Z phối Việt phục với các phong cách mới.
2. Cultural Auditor: Chuyên gia thẩm định di sản nghiêm ngặt, chỉ đưa ra kết luận dựa DUY NHẤT trên Cultural Knowledge Base (CKB) được cấp dưới đây.

==================================================
CULTURAL KNOWLEDGE BASE (CKB) & EVIDENCE REGISTRY:
==================================================
- KB-RULE-01: [Quy thức Hữu nhậm] Vạt trái đè lên vạt phải, khuy áo cài bên phải. Đây là cấu trúc bất biến (Invariant). Tuyệt đối cấm cài vạt sang trái (Tả nhậm - quy thức y phục tang ma).
- KB-RULE-02: [Ý nghĩa Ngũ thân] Cấu trúc 5 thân tượng trưng tứ thân phụ mẫu ôm lấy người mặc, thể hiện sự kín đáo, đoan chính.
- KB-RULE-03: [Cấm kỵ Hoàng quyền] Họa tiết Rồng 5 móng chỉ dành riêng cho Hoàng đế thời Nguyễn. Tuyệt đối không đưa vào trang phục dân dụng, dạo phố, casual.
- KB-NGUTHAN-01: [Áo Ngũ Thân tay chẽn - Cổ lập lĩnh] Cổ đứng cao 4-5cm ôm khít cổ, có 1 khuy cài cổ cố định. Đây là đặc trưng cốt lõi bất biến.
- KB-NGUTHAN-02: [Áo Ngũ Thân tay chẽn - Ống tay] Ống tay áo ôm thon dần về phía cổ tay, thuận tiện cử động hàng ngày.
- KB-NGUTHAN-03: [Áo Ngũ Thân tay chẽn - Khả biến] Chiều dài vạt áo và chất liệu (denim, vải dù, dạ, linen, kaki) là vùng khả biến (Mutable), cho phép cách tân nếu giữ cổ lập lĩnh và vạt ngũ thân.
- KB-TAC-01: [Áo Tấc - Tay thụng] Ống tay áo thụng rộng hình chữ nhật, khi thả xuôi dài bằng hoặc qua ngón tay. Đây là nhận diện cốt lõi bất biến của Áo Tấc.
- KB-TAC-02: [Áo Tấc - Tính lễ nghi] Áo Tấc là lễ phục trang trọng thời Nguyễn. Khi mix-match hiện đại vẫn phải giữ sự trang nghiêm ở thân trên.
- KB-TAC-03: [Áo Tấc - Khả biến] Cho phép cởi mở khuy áo phía trước để tạo layer dạng áo khoác dáng dài (duster coat) hiện đại, phối với quần và giày hiện đại.
- KB-NHATBINH-01: [Áo Nhật Bình - Nẹp cổ đối khâm] Nẹp cổ to bản chạy dọc song song từ cổ xuống ngực tạo thành hình chữ nhật đặc trưng, có dải dây buộc ở ngực. Bất biến.
- KB-NHATBINH-02: [Áo Nhật Bình - Cổ tay ngũ sắc] Dải màu ngũ hành/ngũ thường ở viền tay áo mang tính nhận diện biểu tượng. Bất biến, không đảo lộn lung tung.
- KB-NHATBINH-03: [Áo Nhật Bình - Khả biến] Cho phép mặc mở tà, thay thế quần lụa trắng bằng chân váy xếp ly, quần suông hiện đại hoặc biến tấu chất liệu vải áo.

==================================================
QUY TẮC THẨM ĐỊNH (CULTURAL AUDIT GOVERNANCE):
==================================================
1. ĐÁNH GIÁ CHỈ ĐƯỢC DÙNG 3 TRẠNG THÁI (KHÔNG DÙNG ĐIỂM SỐ 0-100):
   - "Supported": Thiết kế tôn trọng toàn bộ Invariants, biến tấu nằm trong vùng Mutable, có đầy đủ evidence_id chứng minh.
   - "Supported with Caution": Thiết kế có can thiệp táo bạo (cắt ngắn, layer phá cách, bối cảnh nhạy cảm) nhưng không phạm Invariants; hoặc cần khuyến cáo rõ ràng khi mặc.
   - "Insufficient Evidence": Bất kỳ tuyên bố, họa tiết, hoặc chi tiết nào KHÔNG CÓ trong CKB ở trên. Phải bật uncertainty_flag: true và nêu rõ thiếu tài liệu lịch sử chứng thực.
2. XỬ LÝ VI PHẠM (REDLINE):
   - Nếu vi phạm KB-RULE-01 (Tả nhậm) hoặc KB-RULE-03 (Rồng 5 móng) -> Ghi nhận cảnh báo nghiêm trọng trong cautions_and_redlines.
`;

// Outfit creation API
app.post('/api/remix/generate', async (req: Request, res: Response) => {
  try {
    const { garment, context, style, dial_level, custom_notes } = req.body;

    if (!ai) {
      // Fallback response if API key is missing
      return res.json({
        success: true,
        proposals: generateDeterministicProposals(garment, context, style, dial_level),
        source: 'deterministic_engine',
      });
    }

    const prompt = `
Người dùng muốn tạo trang phục Việt Phục Remix:
- Garment: ${garment} (ngu_than: Áo Ngũ Thân tay chẽn, ao_tac: Áo Tấc, nhat_binh: Áo Nhật Bình)
- Context: ${context}
- Style: ${style}
- Dial Level (Mức độ phá cách 1-5): ${dial_level}
- Custom notes: ${custom_notes || 'Không có'}

Hãy tạo đúng 2 phương án thiết kế đa dạng:
1. Phương án A: Bám sát truyền thống (Heritage Anchored), tinh tế, chuẩn mực.
2. Phương án B: Phá cách đương đại theo Dial Level ${dial_level} (Contemporary Edge / Streetwear / Editorial / Avant-garde).

YÊU CẦU BẮT BUỘC VỀ THẨM ĐỊNH DI SẢN:
- Cả 2 phương án đều phải được thẩm định nghiêm ngặt theo CKB.
- Chỉ dùng 1 trong 3 trạng thái: "Supported", "Supported with Caution", hoặc "Insufficient Evidence" (KHÔNG DÙNG ĐIỂM SỐ).
- Nêu rõ các evidence_ids liên quan từ CKB.
- Liệt kê các Invariants đã kiểm tra, các Mutables đã áp dụng, và cautions_and_redlines (nếu có).
- Đưa ra lời khuyên stylist cho Gen Z phối đồ thực tế.

Trả về kết quả chuẩn định dạng JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: CKB_SYSTEM_GROUNDING,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            proposals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  plan_type: { type: Type.STRING, description: "heritage_anchored hoặc contemporary_remix" },
                  title: { type: Type.STRING },
                  concept_tag: { type: Type.STRING },
                  garment_type: { type: Type.STRING },
                  dial_level: { type: Type.INTEGER },
                  visual_details: {
                    type: Type.OBJECT,
                    properties: {
                      collar_style: { type: Type.STRING },
                      lapel_side: { type: Type.STRING },
                      sleeve_style: { type: Type.STRING },
                      cut_length: { type: Type.STRING },
                      fabric_materials: { type: Type.ARRAY, items: { type: Type.STRING } },
                      layering_pieces: { type: Type.ARRAY, items: { type: Type.STRING } },
                      bottom_garment: { type: Type.STRING },
                      footwear: { type: Type.STRING },
                      accessories: { type: Type.ARRAY, items: { type: Type.STRING } },
                      color_palette: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["collar_style", "lapel_side", "sleeve_style", "cut_length", "fabric_materials", "bottom_garment", "footwear", "color_palette"]
                  },
                  audit: {
                    type: Type.OBJECT,
                    properties: {
                      status: { type: Type.STRING, description: "Chỉ được chọn: 'Supported', 'Supported with Caution', hoặc 'Insufficient Evidence'" },
                      uncertainty_flag: { type: Type.BOOLEAN },
                      uncertainty_note: { type: Type.STRING },
                      evidence_ids: { type: Type.ARRAY, items: { type: Type.STRING } },
                      invariants_checked: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            evidence_id: { type: Type.STRING },
                            rule_name: { type: Type.STRING },
                            passed: { type: Type.BOOLEAN },
                            detail: { type: Type.STRING },
                          },
                          required: ["evidence_id", "rule_name", "passed", "detail"]
                        }
                      },
                      mutables_used: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            evidence_id: { type: Type.STRING },
                            element: { type: Type.STRING },
                            application: { type: Type.STRING },
                          },
                          required: ["evidence_id", "element", "application"]
                        }
                      },
                      cautions_and_redlines: { type: Type.ARRAY, items: { type: Type.STRING } },
                      auditor_verdict: { type: Type.STRING },
                    },
                    required: ["status", "uncertainty_flag", "evidence_ids", "invariants_checked", "mutables_used", "cautions_and_redlines", "auditor_verdict"]
                  },
                  stylist_notes: {
                    type: Type.OBJECT,
                    properties: {
                      philosophy: { type: Type.STRING },
                      gen_z_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
                      occasions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["philosophy", "gen_z_tips", "occasions"]
                  }
                },
                required: ["id", "plan_type", "title", "concept_tag", "garment_type", "dial_level", "visual_details", "audit", "stylist_notes"]
              }
            }
          },
          required: ["proposals"]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.proposals && parsed.proposals.length > 0) {
      return res.json({ success: true, proposals: parsed.proposals, source: 'gemini' });
    }

    // Fallback if parsing was empty
    return res.json({
      success: true,
      proposals: generateDeterministicProposals(garment, context, style, dial_level),
      source: 'deterministic_engine',
    });
  } catch (err: any) {
    console.error('Error generating remix outfit:', err);
    // Graceful fallback to deterministic engine
    const { garment, context, style, dial_level } = req.body;
    return res.json({
      success: true,
      proposals: generateDeterministicProposals(garment || 'ngu_than', context || 'streetwear', style || 'modern_minimal', dial_level || 3),
      source: 'deterministic_engine_fallback',
      warning: err.message,
    });
  }
});

// "What if...?" evaluation endpoint
app.post('/api/remix/what-if', async (req: Request, res: Response) => {
  try {
    const { garment, query, current_outfit } = req.body;
    const effectiveGarment = current_outfit?.garment_type || garment || 'ngu_than';

    if (!ai) {
      return res.json({
        success: true,
        evaluation: evaluateWhatIfDeterministic(effectiveGarment, query, current_outfit),
        source: 'deterministic_engine',
      });
    }

    const prompt = `
Người dùng hỏi câu hỏi thử nghiệm "What if...?" về trang phục Việt Phục:
- Garment: ${effectiveGarment}
- Câu hỏi What-If: "${query}"
${current_outfit ? `- Trang phục nền đang chọn chỉnh sửa: "${current_outfit.title}" (Garment: ${current_outfit.garment_type}, Dial: ${current_outfit.dial_level}, Chi tiết hiện tại: ${JSON.stringify(current_outfit.visual_details)})` : '- Chế độ độc lập (Standalone mode, chưa chọn trang phục nền)'}

Nhiệm vụ:
Kích hoạt trường what_if_evaluation:
1. Đánh giá chi tiết đề xuất đó tác động thế nào đến y phục.
2. Xác định chi tiết đó có vi phạm bất kỳ Invariant (bất biến) hoặc Redline nào trong CKB không:
   - KB-RULE-01 (Tả nhậm cài sang trái: REDLINE nghiêm trọng - tang ma)
   - KB-RULE-03 (Rồng 5 móng: REDLINE nghiêm trọng - cấm kỵ hoàng quyền)
   - KB-NGUTHAN-01 (Cổ lập lĩnh 4-5cm bất biến của Ngũ Thân)
   - KB-TAC-01 (Tay thụng chữ nhật qua ngón tay của Áo Tấc)
   - KB-NHATBINH-01 (Nẹp cổ đối khâm chữ nhật của Nhật Bình)
   - KB-NHATBINH-02 (Cổ tay ngũ sắc không được đảo lộn)
   - Hoặc chi tiết nằm trong vùng Mutable (KB-NGUTHAN-03, KB-TAC-03, KB-NHATBINH-03)
   - Hoặc KHÔNG CÓ trong CKB -> Gán "Insufficient Evidence" và bật uncertainty_flag: true.
3. Đưa ra status CHÍNH XÁC: "Supported", "Supported with Caution", hoặc "Insufficient Evidence" (KHÔNG DÙNG ĐIỂM SỐ).
4. Stylist counter-proposal: Đề xuất một giải pháp thay thế thông minh (Stylist counter-proposal) giúp đạt thẩm mỹ tương đương mà vẫn giữ trọn chuẩn mực di sản.

Trả về kết quả chuẩn định dạng JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: CKB_SYSTEM_GROUNDING,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            evaluation: {
              type: Type.OBJECT,
              properties: {
                query: { type: Type.STRING },
                target_garment: { type: Type.STRING },
                proposed_change: { type: Type.STRING },
                status: { type: Type.STRING, description: "'Supported', 'Supported with Caution', hoặc 'Insufficient Evidence'" },
                uncertainty_flag: { type: Type.BOOLEAN },
                impact_analysis: { type: Type.STRING },
                violates_invariants: { type: Type.BOOLEAN },
                violated_evidence_ids: { type: Type.ARRAY, items: { type: Type.STRING } },
                applicable_evidence_ids: { type: Type.ARRAY, items: { type: Type.STRING } },
                cautions_and_redlines: { type: Type.ARRAY, items: { type: Type.STRING } },
                stylist_counter_proposal: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    solution: { type: Type.STRING },
                    heritage_safeguard: { type: Type.STRING },
                    contemporary_edge: { type: Type.STRING },
                    materials_and_cuts: { type: Type.STRING },
                  },
                  required: ["title", "solution", "heritage_safeguard", "contemporary_edge", "materials_and_cuts"]
                }
              },
              required: ["query", "target_garment", "proposed_change", "status", "uncertainty_flag", "impact_analysis", "violates_invariants", "violated_evidence_ids", "applicable_evidence_ids", "cautions_and_redlines", "stylist_counter_proposal"]
            }
          },
          required: ["evaluation"]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.evaluation) {
      return res.json({ success: true, evaluation: parsed.evaluation, source: 'gemini' });
    }

    return res.json({
      success: true,
      evaluation: evaluateWhatIfDeterministic(effectiveGarment, query, current_outfit),
      source: 'deterministic_engine',
    });
  } catch (err: any) {
    console.error('Error evaluating What-If:', err);
    const { garment, query, current_outfit } = req.body;
    const effectiveGarment = current_outfit?.garment_type || garment || 'ngu_than';
    return res.json({
      success: true,
      evaluation: evaluateWhatIfDeterministic(effectiveGarment, query || '', current_outfit),
      source: 'deterministic_engine_fallback',
      warning: err.message,
    });
  }
});

// Deterministic helpers for 100% CKB reliability
function generateDeterministicProposals(garment: string, context: string, style: string, dial: number) {
  const isNguThan = garment === 'ngu_than';
  const isAoTac = garment === 'ao_tac';
  const isNhatBinh = garment === 'nhat_binh';

  if (isNguThan) {
    return [
      {
        id: 'prop-nguthan-heritage',
        plan_type: 'heritage_anchored',
        title: 'Áo Ngũ Thân Tay Chẽn Chàm Lam Cổ Điển',
        concept_tag: 'Heritage Anchored · Tinh Hoa Nguyên Bản',
        garment_type: 'ngu_than',
        dial_level: 1,
        visual_details: {
          collar_style: 'Cổ Lập Lĩnh cao 4.5cm ôm sát cổ, 1 khuy cài cổ cố định',
          lapel_side: 'Hữu Nhậm (vạt trái đè lên vạt phải, cài khuy bên phải)',
          sleeve_style: 'Tay chẽn ôm thon dần về cổ tay, cử động linh hoạt',
          cut_length: 'Vạt dài qua đầu gối truyền thống, 5 thân đoan chính',
          fabric_materials: ['Lụa Vạn Phúc dệt vân cổ', 'Lót tơ tằm thoáng khí'],
          layering_pieces: ['Áo lót cánh trắng bên trong'],
          bottom_garment: 'Quần lụa thụng trắng hoặc đen truyền thống',
          footwear: 'Guốc mộc quai da hoặc giày da đen Oxford tối giản',
          accessories: ['Khăn xếp đen truyền thống', 'Thẻ ngọc / chuỗi hạt trầm'],
          color_palette: ['#1E293B (Chàm Đậm)', '#F8FAFC (Trắng Tơ)', '#D97706 (Hổ Phách)'],
        },
        audit: {
          status: 'Supported',
          uncertainty_flag: false,
          uncertainty_note: '',
          evidence_ids: ['KB-RULE-01', 'KB-RULE-02', 'KB-NGUTHAN-01', 'KB-NGUTHAN-02'],
          invariants_checked: [
            { evidence_id: 'KB-RULE-01', rule_name: 'Quy thức Hữu nhậm', passed: true, detail: 'Vạt trái đè vạt phải, cài khuy bên phải hoàn toàn chuẩn mực' },
            { evidence_id: 'KB-RULE-02', rule_name: 'Cấu trúc Ngũ thân', passed: true, detail: 'Đủ 5 thân tượng trưng tứ thân phụ mẫu che chở' },
            { evidence_id: 'KB-NGUTHAN-01', rule_name: 'Cổ Lập lĩnh 4-5cm', passed: true, detail: 'Cổ đứng 4.5cm ôm khít, có 1 khuy cài cổ cố định' },
            { evidence_id: 'KB-NGUTHAN-02', rule_name: 'Ống tay chẽn', passed: true, detail: 'Ống tay thu nhỏ gọn gàng về cổ tay' },
          ],
          mutables_used: [],
          cautions_and_redlines: [],
          auditor_verdict: 'Thiết kế bảo tồn toàn vẹn cấu trúc cốt lõi của Áo Ngũ Thân thời Nguyễn. Hoàn toàn tuân thủ các Invariants của CKB.',
        },
        stylist_notes: {
          philosophy: 'Giữ nguyên tỉ lệ vàng của tiền nhân, tối giản hóa phụ kiện để tôn vinh sự kín đáo và đoan chính.',
          gen_z_tips: [
            'Phối cùng kính gọng kim loại thanh mảnh và túi xách tote vải canvas tối màu để tạo diện mạo tri thức.',
            'Giữ thẳng lưng khi bước đi để tà áo ngũ thân bay tự nhiên theo nhịp chuyển động.',
          ],
          occasions: ['Lễ Tết', 'Chụp ảnh văn hóa kỷ yếu', 'Hội thảo di sản trang trọng'],
        },
      },
      {
        id: 'prop-nguthan-remix',
        plan_type: 'contemporary_remix',
        title: 'Áo Ngũ Thân Indigo Denim Minimalist Cut',
        concept_tag: `Streetwear Hybrid · Dial Level ${dial || 3}`,
        garment_type: 'ngu_than',
        dial_level: dial || 3,
        visual_details: {
          collar_style: 'Cổ Lập Lĩnh cao 4.2cm ôm khít cổ, đính khuy đồng thau đúc',
          lapel_side: 'Hữu Nhậm (vạt trái đè vạt phải, khuy bên phải bất biến)',
          sleeve_style: 'Tay chẽn thon gọn với đường may đôi (twin needle stitch)',
          cut_length: 'Vạt cách tân lửng ngang hông (midi-cut) hiện đại',
          fabric_materials: ['Raw Selvedge Denim 11oz', 'Sợi cotton dệt chéo thoáng'],
          layering_pieces: ['Áo thun trắng organic cotton cổ tròn bên trong'],
          bottom_garment: 'Quần tây cạp cao ống suông rộng (Wide-leg pleated trousers)',
          footwear: 'Chunky leather loafers hoặc platform Derby shoes',
          accessories: ['Túi đeo chéo da thuộc tối giản', 'Kính mắt gọng vuông đen'],
          color_palette: ['#172554 (Indigo Xanh Thẫm)', '#F1F5F9 (Trắng Ngà)', '#475569 (Xám Kaki)'],
        },
        audit: {
          status: 'Supported',
          uncertainty_flag: false,
          uncertainty_note: '',
          evidence_ids: ['KB-RULE-01', 'KB-NGUTHAN-01', 'KB-NGUTHAN-02', 'KB-NGUTHAN-03'],
          invariants_checked: [
            { evidence_id: 'KB-RULE-01', rule_name: 'Quy thức Hữu nhậm', passed: true, detail: 'Bảo lưu tuyệt đối vạt trái đè vạt phải và cài khuy bên phải' },
            { evidence_id: 'KB-NGUTHAN-01', rule_name: 'Cổ Lập lĩnh', passed: true, detail: 'Duy trì cổ đứng 4.2cm ôm sát cổ với 1 cúc cổ định vị' },
            { evidence_id: 'KB-NGUTHAN-02', rule_name: 'Ống tay chẽn', passed: true, detail: 'Giữ cấu trúc ống tay ôm thon cử động thuận tiện' },
          ],
          mutables_used: [
            { evidence_id: 'KB-NGUTHAN-03', element: 'Chất liệu Denim & Chiều dài vạt', application: 'Ứng dụng chất liệu denim hiện đại và rút ngắn vạt áo trong vùng Mutable cho phép' },
          ],
          cautions_and_redlines: [],
          auditor_verdict: 'Biến tấu hợp thức: Khai thác chính xác vùng Mutable theo KB-NGUTHAN-03 (chất liệu denim, vạt lửng) đồng thời giữ nghiêm Invariants (Hữu nhậm & Cổ lập lĩnh). Đạt trạng thái Supported.',
        },
        stylist_notes: {
          philosophy: 'Đưa di sản vào tủ đồ thường nhật của giới trẻ bằng cách kết hợp chất liệu bền vững hiện đại với hình khối y phục cổ.',
          gen_z_tips: [
            'Có thể mở 2 khuy dưới khi ngồi làm việc để tà áo thả nhẹ hai bên hông.',
            'Mix với tất dệt cao cổ tone-sur-tone và giày loafer đế bánh mì.',
          ],
          occasions: ['Dạo phố cuối tuần', 'Đi làm văn phòng sáng tạo', 'Triển lãm nghệ thuật đương đại'],
        },
      },
    ];
  } else if (isAoTac) {
    return [
      {
        id: 'prop-aotac-heritage',
        plan_type: 'heritage_anchored',
        title: 'Áo Tấc Gấm Hoa Văn Thụ Nhã Cung Đình',
        concept_tag: 'Heritage Anchored · Trang Nghiêm Hoàng Triều',
        garment_type: 'ao_tac',
        dial_level: 1,
        visual_details: {
          collar_style: 'Cổ Lập Lĩnh đính khuy tơ tằm, viền cổ nghiêm trang',
          lapel_side: 'Hữu Nhậm (vạt trái đè lên vạt phải)',
          sleeve_style: 'Tay thụng chữ nhật rộng, thả xuôi dài qua ngón tay',
          cut_length: 'Vạt dài chạm bắp chân, kết cấu 5 thân rộng rãi',
          fabric_materials: ['Gấm dệt vân hoa mai', 'Lót lụa tơ tằm mềm'],
          layering_pieces: ['Áo lót cánh màu nguyệt bạch'],
          bottom_garment: 'Quần lụa trắng suông rộng xếp ly mềm',
          footwear: 'Hài thêu hoa văn cung đình hoặc giày da cổ điển',
          accessories: ['Khăn đóng quấn tỉ mỉ', 'Quạt xếp nan trúc'],
          color_palette: ['#065F46 (Xanh Ngọc Bích)', '#FEF3C7 (Vàng Nhạt)', '#FFFFFF (Trắng Nguyệt Bạch)'],
        },
        audit: {
          status: 'Supported',
          uncertainty_flag: false,
          uncertainty_note: '',
          evidence_ids: ['KB-RULE-01', 'KB-RULE-02', 'KB-TAC-01', 'KB-TAC-02'],
          invariants_checked: [
            { evidence_id: 'KB-RULE-01', rule_name: 'Hữu nhậm', passed: true, detail: 'Cài khuy bên phải chuẩn quy thức' },
            { evidence_id: 'KB-TAC-01', rule_name: 'Tay thụng chữ nhật', passed: true, detail: 'Ống tay thụng rộng hình chữ nhật qua ngón tay khi thả buông' },
            { evidence_id: 'KB-TAC-02', rule_name: 'Tính lễ nghi trang trọng', passed: true, detail: 'Giữ trọn tính nghiêm cẩn của lễ phục cung đình thời Nguyễn' },
          ],
          mutables_used: [],
          cautions_and_redlines: [],
          auditor_verdict: 'Thiết kế nguyên bản chuẩn mực lễ phục Áo Tấc thời Nguyễn. Đạt chuẩn Supported theo CKB.',
        },
        stylist_notes: {
          philosophy: 'Tôn trọng toàn diện giá trị lễ nghi của y phục truyền thống trang trọng bậc nhất.',
          gen_z_tips: ['Giữ động tác chắp tay bái lễ khi diện Áo Tấc để hai ống tay thụng phủ đều sang hai bên.'],
          occasions: ['Hỷ sự', 'Lễ hội Đền Hùng / Festival Huế', 'Chụp ảnh cưới văn hóa'],
        },
      },
      {
        id: 'prop-aotac-remix',
        plan_type: 'contemporary_remix',
        title: 'Áo Tấc Duster Coat Mở Tà Sartorial Layer',
        concept_tag: `Avant-Garde Layering · Dial Level ${dial || 4}`,
        garment_type: 'ao_tac',
        dial_level: dial || 4,
        visual_details: {
          collar_style: 'Cổ Lập Lĩnh dựng đứng thanh thoát, giữ khuy đồng cài hờ',
          lapel_side: 'Hữu Nhậm khi đóng; cho phép mở khuy tạo phom duster coat',
          sleeve_style: 'Tay thụng chữ nhật buông dài vượt qua bàn tay bất biến',
          cut_length: 'Áo khoác dáng dài bay bổng qua bắp chân',
          fabric_materials: ['Vải dạ mỏng Wool-blend cao cấp', 'Lớp lót Habotai trượt mịn'],
          layering_pieces: ['Áo cổ lọ đen mỏng ôm sát (Turtleneck knitwear)'],
          bottom_garment: 'Quần tây ống suông xếp ly cạp cao (Tailored Wide Trousers)',
          footwear: 'Chelsea boots da bóng mũi nhọn hoặc chunky sole boots',
          accessories: ['Kính râm gọng oval kim loại', 'Túi clutch cầm tay tối giản'],
          color_palette: ['#0F172A (Đen Mực)', '#B45309 (Hổ Phách Sậm)', '#94A3B8 (Xám Bạc)'],
        },
        audit: {
          status: 'Supported',
          uncertainty_flag: false,
          uncertainty_note: '',
          evidence_ids: ['KB-TAC-01', 'KB-TAC-02', 'KB-TAC-03'],
          invariants_checked: [
            { evidence_id: 'KB-TAC-01', rule_name: 'Ống tay thụng chữ nhật', passed: true, detail: 'Duy trì chuẩn xác tay thụng rộng buông dài qua ngón tay' },
            { evidence_id: 'KB-TAC-02', rule_name: 'Tính lễ nghi thân trên', passed: true, detail: 'Lớp layer cổ lọ bên trong bảo toàn sự kín đáo, đoan trang thân trên' },
          ],
          mutables_used: [
            { evidence_id: 'KB-TAC-03', element: 'Mặc mở khuy làm Duster Coat & Phối âu phục', application: 'Khai thác trọn vẹn KB-TAC-03: Mở khuy trước tạo layer áo khoác dáng dài hiện đại phối cùng quần tây và boots' },
          ],
          cautions_and_redlines: [],
          auditor_verdict: 'Phương án khai thác xuất sắc điều khoản Khả biến KB-TAC-03: Áo Tấc được chuyển hóa thành duster coat đương đại nhưng vẫn bảo tồn ống tay thụng đặc trưng. Đạt trạng thái Supported.',
        },
        stylist_notes: {
          philosophy: 'Giải phóng Áo Tấc khỏi không gian nghi lễ tĩnh, mang lại chuyển động sống động trên sàn diễn và đời sống hiện đại.',
          gen_z_tips: [
            'Khi bước đi, để hai vạt áo khoác mở nhẹ tạo độ bay bổng tự nhiên.',
            'Giữ lớp layer bên trong tối giản, ôm gọn để tạo độ tương phản thị giác với phom tay thụng rộng.',
          ],
          occasions: ['Tuần lễ Thời trang (Fashion Week)', 'Khai mạc triển lãm nghệ thuật', 'Sự kiện thảm đỏ văn hóa'],
        },
      },
    ];
  } else {
    // Nhat Binh
    return [
      {
        id: 'prop-nhatbinh-heritage',
        plan_type: 'heritage_anchored',
        title: 'Áo Nhật Bình Son Đỏ Cổ Đối Khâm Hoàng Tộc',
        concept_tag: 'Heritage Anchored · Quý Phái Triều Nguyễn',
        garment_type: 'nhat_binh',
        dial_level: 1,
        visual_details: {
          collar_style: 'Nẹp cổ to bản chạy dọc song song từ cổ xuống ngực tạo thành hình chữ nhật',
          lapel_side: 'Đối Khâm (hai nẹp cổ song song, buộc dải dây trước ngực)',
          sleeve_style: 'Cổ tay viền dải ngũ sắc (Ngũ hành/Ngũ thường) bất biến',
          cut_length: 'Dáng áo thụng dài tới đầu gối',
          fabric_materials: ['Sa tơ tằm dệt họa tiết chữ Thọ', 'Viền chỉ ngũ sắc tơ tằm'],
          layering_pieces: ['Áo lót trắng bên trong', 'Dây thao kết ngọc bích'],
          bottom_garment: 'Quần lụa trắng ống rộng truyền thống',
          footwear: 'Hài thêu cánh phượng hoặc hài nhung đỏ',
          accessories: ['Khăn vành dây xanh hoặc đỏ', 'Trâm cài tóc bạc'],
          color_palette: ['#991B1B (Son Đỏ Hoàng Triều)', '#F59E0B (Hoàng Yến)', '#065F46 (Lục Bảo)'],
        },
        audit: {
          status: 'Supported',
          uncertainty_flag: false,
          uncertainty_note: '',
          evidence_ids: ['KB-NHATBINH-01', 'KB-NHATBINH-02'],
          invariants_checked: [
            { evidence_id: 'KB-NHATBINH-01', rule_name: 'Nẹp cổ đối khâm chữ nhật', passed: true, detail: 'Nẹp cổ to bản chạy dọc song song từ cổ xuống ngực đặc trưng và có dây buộc ngực' },
            { evidence_id: 'KB-NHATBINH-02', rule_name: 'Cổ tay ngũ sắc', passed: true, detail: 'Giữ nguyên vẹn thứ tự và nhận diện của dải màu ngũ hành ở viền tay' },
          ],
          mutables_used: [],
          cautions_and_redlines: [],
          auditor_verdict: 'Thiết kế Nhật Bình mẫu mực, tuân thủ nghiêm ngặt 2 Invariants bất biến cốt lõi KB-NHATBINH-01 và KB-NHATBINH-02. Trạng thái: Supported.',
        },
        stylist_notes: {
          philosophy: 'Gìn giữ vẻ đẹp đài các, chuẩn mực của y phục cung tần mệnh phụ triều Nguyễn.',
          gen_z_tips: ['Giữ tóc bới cao gọn gàng để lộ trọn vẹn nẹp cổ đối khâm thêu hoa văn.'],
          occasions: ['Lễ cưới truyền thống', 'Festival di sản', 'Chụp ảnh nghệ thuật cổ phục'],
        },
      },
      {
        id: 'prop-nhatbinh-remix',
        plan_type: 'contemporary_remix',
        title: 'Áo Nhật Bình Mở Tà Phối Chân Váy Xếp Ly Ngà',
        concept_tag: `Neo-Chic Editorial · Dial Level ${dial || 3}`,
        garment_type: 'nhat_binh',
        dial_level: dial || 3,
        visual_details: {
          collar_style: 'Nẹp cổ to bản đối khâm hình chữ nhật chuẩn mực, dây buộc ngực lụa đen',
          lapel_side: 'Đối khâm mặc mở tà tạo phom cardigan quý phái đương đại',
          sleeve_style: 'Tay thụng giữ trọn dải màu viền cổ tay ngũ sắc nguyên bản',
          cut_length: 'Áo lửng ngang hông (crop-length jacket) hoặc ngang đùi',
          fabric_materials: ['Vải dạ Tweed dệt sợi kim tuyến mảnh', 'Nẹp cổ lụa taffeta thêu chìm'],
          layering_pieces: ['Áo cúp ngực hoặc áo tank top lụa trắng ngà bên trong'],
          bottom_garment: 'Chân váy xếp ly dáng dài (Pleated Midi Skirt) màu kem tuyết',
          footwear: 'Giày Mary Jane da bóng đế cao hoặc bốt cổ lửng',
          accessories: ['Vòng cổ ngọc trai nước ngọt mini', 'Túi xách tay quai ngọc'],
          color_palette: ['#881337 (Đỏ Đô Velvet)', '#FFFBEB (Kem Tuyết)', '#312E81 (Chàm Tím)'],
        },
        audit: {
          status: 'Supported',
          uncertainty_flag: false,
          uncertainty_note: '',
          evidence_ids: ['KB-NHATBINH-01', 'KB-NHATBINH-02', 'KB-NHATBINH-03'],
          invariants_checked: [
            { evidence_id: 'KB-NHATBINH-01', rule_name: 'Nẹp cổ đối khâm', passed: true, detail: 'Nẹp cổ to bản chữ nhật được may chuẩn xác, giữ dải buộc ngực' },
            { evidence_id: 'KB-NHATBINH-02', rule_name: 'Cổ tay ngũ sắc', passed: true, detail: 'Dải màu ngũ sắc ở cổ tay được giữ nguyên trật tự nhận diện' },
          ],
          mutables_used: [
            { evidence_id: 'KB-NHATBINH-03', element: 'Mặc mở tà, phối chân váy xếp ly & chất liệu dạ Tweed', application: 'Thay thế quần lụa bằng chân váy xếp ly và cách tân chất liệu vải áo theo điều khoản Mutable KB-NHATBINH-03' },
          ],
          cautions_and_redlines: [],
          auditor_verdict: 'Ứng dụng điều khoản KB-NHATBINH-03 xuất sắc: Giữ trọn 2 nhận diện bất biến (Nẹp đối khâm & Tay ngũ sắc) trong khi phối cùng chân váy xếp ly hiện đại. Đạt trạng thái Supported.',
        },
        stylist_notes: {
          philosophy: 'Tái định nghĩa Nhật Bình thành một chiếc áo khoác Haute Couture hiện đại, duyên dáng và kiêu sa.',
          gen_z_tips: [
            'Phối cùng chân váy xếp ly màu kem để tôn độ rủ của nẹp cổ đối khâm.',
            'Có thể mở buông dây buộc để áo tạo dáng khoác phóng khoáng.',
          ],
          occasions: ['Dự tiệc gala thời trang', 'Sự kiện triển lãm nghệ thuật', 'Dạo phố cuối tuần sang trọng'],
        },
      },
    ];
  }
}

function evaluateWhatIfDeterministic(garment: string, query: string, current_outfit?: any) {
  const q = query.toLowerCase();
  const outfitNote = current_outfit ? `[Đang thử nghiệm trên "${current_outfit.title}" (Nấc Dial ${current_outfit.dial_level})]: ` : '';

  // Test KB-RULE-01: Tả nhậm
  if (q.includes('trái') || q.includes('tả nhậm') || q.includes('cài sang trái') || q.includes('lật vạt sang trái')) {
    return {
      query,
      target_garment: garment,
      proposed_change: 'Đổi vạt áo và cài khuy sang bên trái (Tả nhậm)',
      status: 'Supported with Caution',
      uncertainty_flag: false,
      impact_analysis: outfitNote + 'Đổi vạt sang cài bên trái là vi phạm nghiêm trọng cấu trúc bất biến (Invariant) theo KB-RULE-01. Trong văn hóa cổ truyền Việt Nam, tả nhậm là quy thức cài áo chỉ dùng cho y phục người đã khuất (tang ma), hoàn toàn cấm kỵ trên trang phục của người sống.',
      violates_invariants: true,
      violated_evidence_ids: ['KB-RULE-01'],
      applicable_evidence_ids: ['KB-RULE-01'],
      cautions_and_redlines: [
        'REDLINE NGUY HIỂM [KB-RULE-01]: Quy thức Hữu nhậm (vạt trái đè vạt phải, khuy áo cài bên phải) là cấu trúc BẤT BIẾN. Tuyệt đối cấm cài vạt sang trái (Tả nhậm - quy thức y phục tang ma).',
      ],
      stylist_counter_proposal: {
        title: 'Bảo lưu Hữu Nhậm với Cúc Bấm Kim Loại Hiện Đại Cho Người Thuận Tay Trái',
        solution: 'Vẫn giữ đúng quy thức Hữu nhậm (vạt trái đè vạt phải, khuy bên phải), nhưng ứng dụng hệ thống khóa bấm kim loại từ tính (magnetic snap buttons) hoặc khóa kéo ẩn bên hông phải để người thuận tay trái thao tác đóng mở nhanh trong 1 giây.',
        heritage_safeguard: 'Bảo vệ nguyên vẹn cấu trúc Hữu nhậm thiêng liêng, triệt tiêu nguy cơ biến y phục thành tang phục.',
        contemporary_edge: 'Ứng dụng công nghệ phụ liệu may mặc công thái học hiện đại cho người thuận tay trái.',
        materials_and_cuts: 'Raw denim hoặc linen cao cấp đính khuy nam châm chìm bên phải.',
      },
    };
  }

  // Test KB-RULE-03: Rồng 5 móng
  if (q.includes('rồng 5 móng') || q.includes('rồng năm móng') || q.includes('ngũ trảo') || q.includes('5 móng')) {
    return {
      query,
      target_garment: garment,
      proposed_change: 'Thêu họa tiết Rồng 5 móng lên y phục dân dụng',
      status: 'Supported with Caution',
      uncertainty_flag: false,
      impact_analysis: outfitNote + 'Họa tiết Rồng 5 móng (ngũ trảo long) là biểu tượng tối thượng của Hoàng quyền thời Nguyễn, chỉ dành độc quyền cho Hoàng đế (Long bào). Việc đưa họa tiết này vào trang phục dạo phố, casual, tiệc cưới dân sự vi phạm trực tiếp KB-RULE-03.',
      violates_invariants: true,
      violated_evidence_ids: ['KB-RULE-03'],
      applicable_evidence_ids: ['KB-RULE-03'],
      cautions_and_redlines: [
        'REDLINE CẤM KỴ [KB-RULE-03]: Họa tiết Rồng 5 móng chỉ dành riêng cho Hoàng đế thời Nguyễn. Tuyệt đối không đưa vào trang phục dân dụng, dạo phố, casual.',
      ],
      stylist_counter_proposal: {
        title: 'Chuyển Hướng Sang Họa Tiết Rồng 4 Móng, Giao Long Hoặc Mây Sấm Bát Bửu Dân Gian',
        solution: 'Thay thế rồng 5 móng bằng họa tiết Rồng 4 móng (tứ trảo long - dùng cho vương thân), Giao long cách điệu hình học, hoặc đồ án Mây sấm (Vân lôi), Hoa chanh, Bát bửu dân gian đương đại.',
        heritage_safeguard: 'Tránh hoàn toàn lỗi tiếm phạm hoàng quyền, tôn trọng thứ bậc lễ chế triều đại Nguyễn.',
        contemporary_edge: 'Đồ án Rồng 4 móng cách điệu line-art đồ họa mang hơi thở Cyber-Indochine cực kỳ cuốn hút giới trẻ.',
        materials_and_cuts: 'Thêu chỉ bạc ánh kim hoặc in chuyển nhiệt phản quang trên nền vải dạ hoặc gấm chìm.',
      },
    };
  }

  // Test KB-NGUTHAN-01: Cổ lập lĩnh
  if (q.includes('cổ vest') || q.includes('cổ bẻ') || q.includes('bỏ cổ') || (q.includes('cổ') && (q.includes('thay') || q.includes('đổi') || q.includes('khoét')))) {
    return {
      query,
      target_garment: 'ngu_than',
      proposed_change: 'Thay đổi cổ áo Lập Lĩnh thành cổ bẻ / cổ vest / cổ khoét sâu',
      status: 'Supported with Caution',
      uncertainty_flag: false,
      impact_analysis: outfitNote + 'Cổ Lập Lĩnh cao 4-5cm ôm khít cổ với 1 cúc cổ cố định là đặc trưng cốt lõi BẤT BIẾN của Áo Ngũ Thân (KB-NGUTHAN-01). Nếu thay bằng cổ vest hoặc khoét cổ sẽ làm mất hoàn toàn nhận diện linh hồn của Áo Ngũ Thân.',
      violates_invariants: true,
      violated_evidence_ids: ['KB-NGUTHAN-01'],
      applicable_evidence_ids: ['KB-NGUTHAN-01'],
      cautions_and_redlines: [
        'CẢNH BÁO BẤT BIẾN [KB-NGUTHAN-01]: Cổ đứng cao 4-5cm ôm khít cổ, có 1 khuy cài cổ cố định là đặc trưng cốt lõi bất biến của Áo Ngũ Thân tay chẽn.',
      ],
      stylist_counter_proposal: {
        title: 'Giữ Cổ Lập Lĩnh Nhưng Mở Cúc Cổ Khi Dạo Phố Hoặc Hạ Cổ Xuống 4.0cm Thoáng Mát',
        solution: 'Vẫn may cổ Lập Lĩnh chuẩn 4cm nhưng dùng chất liệu dựng cổ (interlining) mềm mại, hoặc thiết kế cúc cổ có thể mở ra khi dạo phố để lật ve nhẹ, nhưng khi cài lại lập tức trở về phom lập lĩnh đoan chính.',
        heritage_safeguard: 'Giữ trọn vẹn kết cấu nhận diện bất biến của cổ lập lĩnh thời Nguyễn.',
        contemporary_edge: 'Tạo cảm giác thoải mái tối đa cho ngày hè nhiệt đới mà không phá vỡ cấu trúc.',
        materials_and_cuts: 'Chất liệu linen pha lụa tơ tằm với mex dựng cổ mềm.',
      },
    };
  }

  // Test KB-TAC-03: Áo Tấc duster coat
  if (q.includes('áo khoác') || q.includes('duster coat') || q.includes('mở cúc áo tấc') || q.includes('mở khuy áo tấc')) {
    return {
      query,
      target_garment: 'ao_tac',
      proposed_change: 'Mở khuy áo Tấc mặc làm áo khoác dáng dài (duster coat) hiện đại',
      status: 'Supported',
      uncertainty_flag: false,
      impact_analysis: outfitNote + 'Hoàn toàn hợp lệ! Theo KB-TAC-03, Áo Tấc cho phép cởi mở khuy áo phía trước để tạo layer dạng áo khoác dáng dài (duster coat) hiện đại, phối với quần và giày hiện đại, miễn là ống tay thụng chữ nhật vẫn được bảo toàn (KB-TAC-01).',
      violates_invariants: false,
      violated_evidence_ids: [],
      applicable_evidence_ids: ['KB-TAC-01', 'KB-TAC-03'],
      cautions_and_redlines: [],
      stylist_counter_proposal: {
        title: 'Phối Áo Tấc Duster Coat Với All-Black Turtleneck & Pleated Trousers',
        solution: 'Mặc buông 2 vạt áo Tấc tự nhiên, bên trong phối áo thun/len cổ lọ màu đen ôm sát và quần âu xếp ly ống rộng, kết hợp bốt da cao cổ.',
        heritage_safeguard: 'Bảo lưu trọn vẹn ống tay thụng hình chữ nhật buông dài qua ngón tay theo KB-TAC-01.',
        contemporary_edge: 'Tạo hiệu ứng silhouette bay bổng đậm chất Haute Couture quốc tế.',
        materials_and_cuts: 'Vải dạ len mỏng (lightweight wool) hoặc đũi tơ tằm dệt thô.',
      },
    };
  }

  // Test KB-NHATBINH-02: Dải ngũ sắc
  if (q.includes('ngũ sắc') || q.includes('viền tay') || q.includes('bỏ màu') || q.includes('đổi màu cổ tay')) {
    return {
      query,
      target_garment: 'nhat_binh',
      proposed_change: 'Bỏ hoặc thay đổi màu dải ngũ sắc ở cổ tay Áo Nhật Bình',
      status: 'Supported with Caution',
      uncertainty_flag: false,
      impact_analysis: outfitNote + 'Dải ngũ sắc viền tay áo Nhật Bình tượng trưng cho Ngũ hành (Kim - Mộc - Thủy - Hỏa - Thổ) và Ngũ thường, là nhận diện cốt lõi BẤT BIẾN theo KB-NHATBINH-02. Tuyệt đối không được đảo lộn hoặc loại bỏ lung tung.',
      violates_invariants: true,
      violated_evidence_ids: ['KB-NHATBINH-02'],
      applicable_evidence_ids: ['KB-NHATBINH-02'],
      cautions_and_redlines: [
        'CẢNH BÁO BẤT BIẾN [KB-NHATBINH-02]: Dải màu ngũ hành/ngũ thường ở viền tay áo mang tính nhận diện biểu tượng. Bất biến, không đảo lộn lung tung.',
      ],
      stylist_counter_proposal: {
        title: 'Giữ Thứ Tự Ngũ Sắc Nhưng Chuyển Sang Bảng Màu Muted Hoặc Pastel Tinh Tế',
        solution: 'Vẫn giữ đúng 5 dải màu theo đúng trật tự ngũ hành, nhưng gia giảm độ bão hòa (desaturated) sang tông màu nhã nhặn hiện đại (muted tones) hoặc dệt chìm bằng sợi tơ mờ trên nền cổ tay áo.',
        heritage_safeguard: 'Bảo toàn nguyên tắc ngũ hành và thứ tự dải màu nhận diện bất biến của Nhật Bình.',
        contemporary_edge: 'Hài hòa thị giác với các phong cách tối giản và pastel hiện đại.',
        materials_and_cuts: 'Chỉ tơ tằm nhuộm thảo mộc tự nhiên viền trên gấm tơ.',
      },
    };
  }

  // Fallback for general queries or Insufficient Evidence
  return {
    query,
    target_garment: garment,
    proposed_change: 'Đề xuất thử nghiệm thiết kế đương đại',
    status: 'Insufficient Evidence',
    uncertainty_flag: true,
    impact_analysis: outfitNote + 'Chi tiết hoặc họa tiết được đề cập không có dữ liệu đối chiếu trong Cultural Knowledge Base (CKB) được cấp. Theo quy tắc Cultural Audit Governance, hệ thống phải bật cờ uncertainty_flag: true và nêu rõ thiếu tài liệu lịch sử chứng thực.',
    violates_invariants: false,
    violated_evidence_ids: [],
    applicable_evidence_ids: [],
    cautions_and_redlines: [
      'LƯU Ý THẨM ĐỊNH: Chi tiết này chưa được ghi nhận trong Cultural Knowledge Base (CKB). Cần tham vấn thêm tài liệu khảo cứu trang phục thời Nguyễn trước khi đưa vào sản xuất thương mại.',
    ],
    stylist_counter_proposal: {
      title: 'Tập Trung Biến Tấu Trong Vùng Khả Biến Được CKB Chứng Thực',
      solution: 'Nên ưu tiên ứng dụng các biến tấu nằm trong vùng Mutable đã được CKB xác thực: thay đổi chất liệu sang denim, linen, dạ, kaki; điều chỉnh chiều dài vạt áo; phối cùng âu phục và phụ kiện hiện đại trong khi bảo lưu nghiêm ngặt các Invariants cốt lõi.',
      heritage_safeguard: 'Tránh các sai lệch lịch sử khi chưa có bằng chứng khảo cổ hoặc thư tịch xác thực.',
      contemporary_edge: 'Tạo nên sản phẩm thời trang vừa táo bạo vừa có nền tảng học thuật vững chắc.',
      materials_and_cuts: 'Chất liệu tự nhiên cao cấp, phom dáng đương đại tối giản.',
    },
  };
}

// In production, serve static dist files. In dev, Vite middleware is attached.
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Việt Phục Remix Lab server running on http://localhost:${PORT}`);
  });
}

startServer();
