import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  evaluateWhatIfDeterministic,
  generateDeterministicProposals,
} from './src/utils/deterministicEngines.js';

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
2. Cultural Auditor: Chuyên gia thẩm định di sản minh bạch, chỉ đưa ra kết luận dựa DUY NHẤT trên Cultural Knowledge Base (CKB) được cấp dưới đây. Tuyệt đối không võ đoán hay khẳng định chắc chắn khi quy tắc chưa có nguồn đối chiếu.

==================================================
CULTURAL KNOWLEDGE BASE (CKB) & EVIDENCE REGISTRY:
==================================================
- KB-RULE-01: [Quy thức Hữu nhậm] Vạt trái đè lên vạt phải, khuy cài bên phải trên Áo Ngũ Thân và Áo Tấc (chưa áp dụng cho Nhật Bình đối khâm). Khuyến cáo tránh cài vạt sang trái (Tả nhậm do quan niệm tang chế). Trạng thái nguồn: Chưa xác minh thư tịch độc lập trong bản thử nghiệm.
- KB-RULE-02: [Cấu trúc Ngũ thân] Cấu trúc 5 thân che chở đoan chính theo quan niệm dân gian (chưa kiểm chứng thư tịch triều Nguyễn). Áp dụng cho Ngũ Thân & Áo Tấc.
- KB-RULE-03: [Biểu tượng Hoàng quyền] Họa tiết Rồng 5 móng chỉ dành riêng cho Hoàng đế triều Nguyễn (Đã xác minh nguồn sơ cấp: Khâm định Đại Nam hội điển sự lệ, Quyển 78). Redline cấm kỵ trên trang phục dân dụng.
- KB-NGUTHAN-01: [Áo Ngũ Thân - Cổ lập lĩnh] Cổ đứng cao 4-5cm ôm khít cổ, có 1 khuy cài cổ cố định. Quy ước nhận diện cốt lõi của Ngũ Thân trong bản thử nghiệm.
- KB-NGUTHAN-02: [Áo Ngũ Thân - Ống tay] Ống tay ôm thon gọn, phân biệt với áo thụng (Áo Tấc).
- KB-NGUTHAN-03: [Áo Ngũ Thân - Khả biến] Chiều dài vạt áo và chất liệu là vùng khả biến (Mutable) theo quy ước nội bộ của lab.
- KB-TAC-01: [Áo Tấc - Tay thụng] Ống tay thụng rộng hình chữ nhật qua ngón tay là nhận diện cốt lõi của Áo Tấc trong bản thử nghiệm.
- KB-TAC-02: [Áo Tấc - Tính lễ nghi] Giữ sự kín đáo, đoan trang ở thân trên khi phối đồ.
- KB-TAC-03: [Áo Tấc - Khả biến] Cho phép mở khuy tạo dáng duster coat hiện đại (quy ước sáng tạo nội bộ của lab).
- KB-NHATBINH-01: [Áo Nhật Bình - Nẹp cổ đối khâm] Nẹp cổ to bản chạy dọc song song từ cổ xuống ngực tạo thành hình chữ nhật, có dây buộc ngực. Không phải vạt đè Hữu nhậm.
- KB-NHATBINH-02: [Áo Nhật Bình - Cổ tay ngũ sắc] Dải màu ngũ hành ở viền tay áo mang tính nhận diện biểu tượng theo quy ước của bản thử nghiệm.
- KB-NHATBINH-03: [Áo Nhật Bình - Khả biến] Cho phép mặc mở tà, phối chân váy xếp ly (quy ước sáng tạo nội bộ của lab).

==================================================
QUY TẮC THẨM ĐỊNH (CULTURAL AUDIT GOVERNANCE):
==================================================
1. ĐÁNH GIÁ CHỈ ĐƯỢC DÙNG 3 TRẠNG THÁI (KHÔNG DÙNG ĐIỂM SỐ 0-100):
   - "Supported": Thiết kế tôn trọng toàn bộ Invariants, biến tấu nằm trong vùng Mutable, có đầy đủ evidence_id chứng minh.
   - "Supported with Caution": Thiết kế có can thiệp táo bạo (cắt ngắn, layer phá cách, bối cảnh nhạy cảm) nhưng không phạm Invariants; hoặc cần khuyến cáo rõ ràng khi mặc.
   - "Insufficient Evidence": Bất kỳ tuyên bố, họa tiết, hoặc chi tiết nào KHÔNG CÓ trong CKB ở trên. Phải bật uncertainty_flag: true và nêu rõ thiếu tài liệu lịch sử chứng thực.
2. XỬ LÝ VI PHẠM (REDLINE):
   - Nếu vi phạm KB-RULE-03 (Rồng 5 móng) -> Ghi nhận REDLINE điển chế hoàng quyền nghiêm ngặt.
   - Nếu phát hiện đề xuất đổi vạt sang trái (Tả nhậm) trên Ngũ Thân/Áo Tấc -> Ghi nhận cảnh báo lưu ý quy thức KB-RULE-01.
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
   - KB-RULE-01 (Tả nhậm cài sang trái trên Ngũ Thân/Áo Tấc: Lưu ý quy thức - tang ma)
   - KB-RULE-03 (Rồng 5 móng trên trang phục dân sự: REDLINE điển chế hoàng quyền - đã đối chiếu nguồn sơ cấp)
   - KB-NGUTHAN-01 (Cổ lập lĩnh 4-5cm nhận diện của Ngũ Thân)
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
