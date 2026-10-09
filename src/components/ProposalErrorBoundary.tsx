import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ProposalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ProposalErrorBoundary] Bắt lỗi hiển thị giao diện bản phối:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="lacquer-panel border border-[#B8342B]/40 rounded-2xl p-6 sm:p-8 text-center space-y-4 bg-[#1F1412] my-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-[#B8342B]/20 flex items-center justify-center mx-auto text-[#F5A39D] border border-[#B8342B]/40">
            <AlertTriangle className="w-6 h-6 text-[#F5A39D]" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#F2E9D8]">
              Đã xảy ra lỗi hiển thị bản phối
            </h3>
            <p className="text-xs sm:text-sm text-[#B8AA96] leading-relaxed">
              Hệ thống gặp sự cố khi dựng giao diện kết quả. Bạn có thể bấm nút bên dưới để thử lại an toàn với bộ máy tham chiếu chuẩn mực.
            </p>
            {this.state.error?.message && (
              <p className="text-[11px] font-mono text-[#E6C88B]/90 bg-[#120E0D] px-2.5 py-1.5 rounded-lg border border-[#C9A66B]/25 truncate max-w-sm mx-auto">
                {this.state.error.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-[#B8342B] hover:bg-[#A32D25] text-[#F2E9D8] text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4 text-[#F5DCA3]" />
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
