import React from 'react';
import { Sparkles, Shirt } from 'lucide-react';

interface OutfitProposalSkeletonProps {
  count?: number;
  message?: string;
}

export const OutfitProposalSkeleton: React.FC<OutfitProposalSkeletonProps> = ({
  count = 2,
  message = 'Đang tham chiếu CKB và đồng sáng tạo 2 bản phối...',
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top indicator banner */}
      <div className="bg-[#241815] border border-[#C9A66B]/30 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E6C88B] animate-ping" />
          <span className="text-[#E6C88B] font-semibold">{message}</span>
        </div>
        <span className="text-[11px] font-mono text-[#8C7E6C] hidden sm:inline">
          Gemini 3.8-flash · Grounded CKB
        </span>
      </div>

      {/* Grid of Skeleton Cards */}
      <div className={`grid grid-cols-1 ${count > 1 ? 'md:grid-cols-2' : ''} gap-5 lg:gap-6`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="lacquer-card-elevated rounded-2xl p-4 sm:p-5 flex flex-col space-y-4 border border-[#C9A66B]/25 relative overflow-hidden"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-[#C9A66B]/10 to-transparent pointer-events-none" />

            {/* Header: badge + title */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-32 h-5 bg-[#2E201B] rounded animate-pulse" />
                <div className="w-20 h-5 bg-[#2E201B] rounded-full animate-pulse" />
              </div>

              <div className="w-4/5 h-6 bg-[#2E201B] rounded animate-pulse" />
              <div className="w-2/5 h-4 bg-[#261C19] rounded animate-pulse" />
            </div>

            {/* Visual placeholder */}
            <div className="w-full h-64 sm:h-72 rounded-xl bg-[#1C1412] border border-[#C9A66B]/15 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-[#2E201B] flex items-center justify-center text-[#C9A66B]/50 animate-pulse">
                <Shirt className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-[#8C7E6C] mt-2 animate-pulse">
                Phác thảo dáng áo & phối layer...
              </span>
            </div>

            {/* Swatches & Materials Skeleton */}
            <div className="space-y-2 pt-2 border-t border-[#C9A66B]/15">
              <div className="w-20 h-3 bg-[#261C19] rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="w-16 h-6 bg-[#2E201B] rounded-md animate-pulse" />
                <div className="w-16 h-6 bg-[#2E201B] rounded-md animate-pulse" />
                <div className="w-16 h-6 bg-[#2E201B] rounded-md animate-pulse" />
              </div>
            </div>

            {/* Cultural audit bar skeleton */}
            <div className="p-3 bg-[#181311] rounded-xl border border-[#C9A66B]/15 space-y-2">
              <div className="flex gap-2">
                <div className="w-28 h-4 bg-[#2E201B] rounded animate-pulse" />
                <div className="w-24 h-4 bg-[#2E201B] rounded animate-pulse" />
              </div>
              <div className="w-full h-3 bg-[#221815] rounded animate-pulse" />
            </div>

            {/* Bottom action buttons */}
            <div className="pt-2 border-t border-[#C9A66B]/15 grid grid-cols-3 gap-2 mt-auto">
              <div className="h-9 bg-[#2E201B] rounded-xl animate-pulse" />
              <div className="h-9 bg-[#261C19] rounded-xl animate-pulse" />
              <div className="h-9 bg-[#261C19] rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
