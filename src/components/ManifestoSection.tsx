import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle, CheckCircle2 } from 'lucide-react';
import { CKB_REGISTRY } from '../data/ckbRegistry';

interface ManifestoSectionProps {
  onOpenCKB: () => void;
}

export const ManifestoSection: React.FC<ManifestoSectionProps> = ({ onOpenCKB }) => {
  return (
    <section id="manifesto" className="py-16 px-6 max-w-7xl mx-auto border-b border-stone-200">
      <div className="max-w-3xl mb-12">
        <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 mb-1">
          CULTURAL AUDIT GOVERNANCE PROTOCOL
        </div>
        <h2 className="text-3xl font-serif font-bold text-stone-950 tracking-tight">
          Hiến Chương Thẩm Định & Tôn Chỉ Giám Định Di Sản
        </h2>
        <p className="text-sm text-stone-700 mt-2 leading-relaxed font-serif">
          Việt Phục Remix Lab thiết lập một chuẩn mực minh bạch giữa tự do sáng tạo đương đại và sự nghiêm cẩn với cổ nhân. Mọi phán quyết của hệ thống đều tuân thủ 2 nguyên tắc tối thượng sau:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Governance Principle 1 */}
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-4">
          <div className="text-xs font-mono text-stone-500 uppercase tracking-widest">
            NGUYÊN TẮC THẨM ĐỊNH 01
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            Chỉ Dùng 3 Trạng Thái Chuẩn Mực (Không Dùng Điểm Số)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Hệ thống kiên quyết bài trừ việc chấm điểm 0-100 tùy tiện thiếu căn cứ. Đánh giá y phục di sản chỉ có thể dựa trên cơ sở chứng lý CKB rõ ràng:
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs">
              <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>"Supported"</span>
              </div>
              <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                Thiết kế tôn trọng toàn bộ Invariants, mọi biến tấu nằm trong vùng Mutable, có đầy đủ evidence_id chứng minh.
              </p>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs">
              <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>"Supported with Caution"</span>
              </div>
              <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                Thiết kế có can thiệp táo bạo (cắt ngắn, layer phá cách, bối cảnh nhạy cảm) nhưng không phạm Invariants; cần khuyến cáo rõ ràng khi mặc.
              </p>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg text-xs">
              <div className="font-semibold text-rose-900 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>"Insufficient Evidence"</span>
              </div>
              <p className="text-rose-800 text-[11px] mt-0.5 leading-relaxed">
                Bất kỳ tuyên bố, họa tiết, hoặc chi tiết nào KHÔNG CÓ trong CKB. Hệ thống bắt buộc bật <span className="font-mono">uncertainty_flag: true</span> và nêu rõ thiếu tài liệu lịch sử chứng thực.
              </p>
            </div>
          </div>
        </div>

        {/* Governance Principle 2 */}
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-4">
          <div className="text-xs font-mono text-stone-500 uppercase tracking-widest">
            NGUYÊN TẮC THẨM ĐỊNH 02
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            Xử Lý Vi Phạm Cốt Lõi (Redlines Ranh Giới Đỏ)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Nếu thiết kế xâm phạm các cấm kỵ cốt tử đã được định danh trong Evidence Registry, hệ thống sẽ lập tức kích hoạt cảnh báo nghiêm trọng trong cautions_and_redlines:
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 bg-rose-50 border-l-4 border-rose-600 rounded-r text-xs">
              <div className="font-bold text-rose-900 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>REDLINE 01: Vi Phạm Quy Thức Hữu Nhậm [KB-RULE-01]</span>
              </div>
              <p className="text-rose-800 text-[11px] mt-1 leading-relaxed">
                Cài vạt sang trái (Tả nhậm) là quy thức riêng biệt của y phục tang ma cho người đã khuất. Tuyệt đối không được bình thường hóa trên y phục người sống.
              </p>
            </div>

            <div className="p-3.5 bg-rose-50 border-l-4 border-rose-600 rounded-r text-xs">
              <div className="font-bold text-rose-900 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>REDLINE 02: Cấm Kỵ Hoàng Quyền Rồng 5 Móng [KB-RULE-03]</span>
              </div>
              <p className="text-rose-800 text-[11px] mt-1 leading-relaxed">
                Họa tiết Rồng 5 móng chỉ dành riêng cho Hoàng đế thời Nguyễn. Tuyệt đối không đưa vào trang phục dân dụng, dạo phố, casual. Thay thế bằng rồng 4 móng hoặc mây sấm bát bửu.
              </p>
            </div>

            <div className="p-3.5 bg-stone-100 rounded-lg text-xs flex items-center justify-between">
              <span className="text-stone-700 font-medium">Toàn văn {CKB_REGISTRY.length} điều khoản CKB:</span>
              <button
                onClick={onOpenCKB}
                className="text-stone-950 font-bold hover:underline underline-offset-2"
              >
                Tra Cứu Bảng Quy Thức
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
