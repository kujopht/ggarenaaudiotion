import React from 'react';
import { Play, Pause, X, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export interface DemoStep {
  stepIndex: number;
  totalSteps: number;
  title: string;
  description: string;
}

interface DemoTourBannerProps {
  isActive: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription: string;
  secondsRemaining: number;
  onTogglePause: () => void;
  onStop: () => void;
  onNextStep: () => void;
}

export const DemoTourBanner: React.FC<DemoTourBannerProps> = ({
  isActive,
  isPaused,
  currentStep,
  totalSteps,
  stepTitle,
  stepDescription,
  secondsRemaining,
  onTogglePause,
  onStop,
  onNextStep,
}) => {
  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 sm:max-w-md animate-in slide-in-from-bottom duration-300">
      <div className="lacquer-card-elevated rounded-2xl border-2 border-[#C9A66B] bg-[#16100E]/95 shadow-2xl p-4 backdrop-blur-md space-y-3">
        {/* Header strip */}
        <div className="flex items-center justify-between border-b border-[#C9A66B]/25 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E6C88B] animate-ping" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E6C88B]">
              CHẾ ĐỘ DEMO GIÁM KHẢO (BƯỚC {currentStep}/{totalSteps})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onTogglePause}
              className="p-1.5 rounded-lg bg-[#2A1F1B] hover:bg-[#382B26] text-[#E6C88B] border border-[#C9A66B]/30 cursor-pointer"
              title={isPaused ? 'Tiếp tục demo' : 'Tạm dừng demo'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={onStop}
              className="p-1.5 rounded-lg bg-[#2A1F1B] hover:bg-[#382B26] text-[#B8AA96] hover:text-[#FFF] border border-[#C9A66B]/30 cursor-pointer"
              title="Thoát chế độ demo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-serif font-bold text-[#F2E9D8]">
              {stepTitle}
            </h4>
            <span className="text-[10px] font-mono text-[#C9A66B] bg-[#C9A66B]/15 px-1.5 py-0.5 rounded">
              {isPaused ? 'Tạm dừng' : `Tiếp theo trong ${secondsRemaining}s`}
            </span>
          </div>
          <p className="text-xs text-[#B8AA96] leading-relaxed">
            {stepDescription}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#261C19] rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#C9A66B] to-[#E6C88B] transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <button
            type="button"
            onClick={onStop}
            className="text-[11px] text-[#8C7E6C] hover:text-[#B8AA96] underline cursor-pointer"
          >
            Thoát & tự điều khiển
          </button>
          <button
            type="button"
            onClick={onNextStep}
            className="px-2.5 py-1 bg-[#C9A66B]/25 hover:bg-[#C9A66B]/40 text-[#E6C88B] rounded-lg font-semibold flex items-center gap-1 border border-[#C9A66B]/40 cursor-pointer text-[11px]"
          >
            <span>Bước tiếp</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
