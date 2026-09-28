import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { GoogleGenAI, Type } from '@google/genai';
import {
  evaluateWhatIfDeterministic,
  generateDeterministicProposals,
} from './src/utils/deterministicEngines.js';
import { buildCKBSystemGrounding } from './src/data/ckbRegistry.js';
import {
  normalizeGeminiProposal,
  normalizeGeminiWhatIfEvaluation,
  processGeminiProposalResponse,
} from './src/utils/auditNormalization.js';

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

// Cultural Knowledge Base (CKB) text dynamically generated from single source of truth (Requirement 1)
const getCKBSystemGrounding = () => buildCKBSystemGrounding();

// Resilient Gemini generator with automatic fallback across supported model tiers
async function generateWithGemini(prompt: string, responseSchema: any) {
  if (!ai) return null;
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: getCKBSystemGrounding(),
          responseMimeType: 'application/json',
          responseSchema,
        },
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      console.warn(`[Gemini Engine] Model ${model} unavailable (${err?.status || err?.message || 'high demand'}). Cascading to fallback model...`);
    }
  }
  return null;
}

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
Người dùng muốn tạo bản phối Việt phục trong KUJO Re:Wear:
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

    const proposalSchema = {
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
                  prototype_compliance: { type: Type.STRING, description: "'compliant', 'conflict', hoặc 'unassessed'" },
                  historical_confidence: { type: Type.STRING, description: "'verified', 'partially_verified', 'needs_review', 'unverified', hoặc 'mixed'" },
                  verification_summary: { type: Type.STRING },
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
    };

    const response = await generateWithGemini(prompt, proposalSchema);

    if (response?.text) {
      const parsed = JSON.parse(response.text || '{}');
      const processed = processGeminiProposalResponse(
        parsed,
        (garment || 'ngu_than') as any,
        { context, style, dial_level }
      );
      return res.json(processed);
    }

    // Seamless fallback to deterministic engine if all models busy
    console.warn('[AI Studio Backend] Notice: High demand on cloud models, serving deterministic cultural engine.');
    return res.json({
      success: true,
      proposals: generateDeterministicProposals(garment || 'ngu_than', context || 'streetwear', style || 'modern_minimal', dial_level || 3),
      source: 'deterministic_engine_fallback',
      warning: 'High demand spike on cloud AI; served seamlessly by deterministic cultural engine.',
    });
  } catch (err: any) {
    console.warn('[AI Studio Backend] Notice: Generating remix outfit switched to deterministic engine:', err?.message || err);
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
2. Đối soát chặt chẽ với CKB được cung cấp ở systemInstruction:
   - Nếu vi phạm Invariant hoặc Redline -> violates_invariants: true, gán evidence IDs vi phạm, phân tích rõ lý do và mức độ xác minh nguồn (chưa xác minh độc lập thì nói rõ).
   - Nếu thuộc vùng Mutable được phép -> violates_invariants: false, gán evidence IDs vùng khả biến.
   - Nếu KHÔNG CÓ trong CKB -> Gán "Insufficient Evidence" và bật uncertainty_flag: true.
3. Phân tách rõ 2 tầng: prototype_compliance ('compliant' | 'conflict' | 'unassessed') và historical_confidence ('verified' | 'partially_verified' | 'needs_review' | 'unverified' | 'mixed').
4. Đưa ra status CHÍNH XÁC: "Supported", "Supported with Caution", hoặc "Insufficient Evidence" (KHÔNG DÙNG ĐIỂM SỐ).
5. Stylist counter-proposal: Đề xuất một giải pháp thay thế thông minh giúp đạt thẩm mỹ tương đương mà vẫn tôn trọng chuẩn mực di sản.

Trả về kết quả chuẩn định dạng JSON.
`;

    const whatIfSchema = {
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
            prototype_compliance: { type: Type.STRING, description: "'compliant', 'conflict', hoặc 'unassessed'" },
            historical_confidence: { type: Type.STRING, description: "'verified', 'partially_verified', 'needs_review', 'unverified', hoặc 'mixed'" },
            verification_summary: { type: Type.STRING },
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
    };

    const response = await generateWithGemini(prompt, whatIfSchema);

    if (response?.text) {
      const parsed = JSON.parse(response.text || '{}');
      if (parsed.evaluation) {
        const normalizedEvaluation = normalizeGeminiWhatIfEvaluation(parsed.evaluation, effectiveGarment);
        return res.json({ success: true, evaluation: normalizedEvaluation, source: 'gemini' });
      }
    }

    console.warn('[AI Studio Backend] Notice: What-if evaluation served via deterministic cultural engine.');
    return res.json({
      success: true,
      evaluation: evaluateWhatIfDeterministic(effectiveGarment, query, current_outfit),
      source: 'deterministic_engine',
    });
  } catch (err: any) {
    console.warn('[AI Studio Backend] Notice: What-if evaluation switched to deterministic engine:', err?.message || err);
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
    console.log(`KUJO Re:Wear server running on http://localhost:${PORT}`);
  });
}

startServer();
