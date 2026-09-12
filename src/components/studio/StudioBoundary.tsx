import { Component, type ErrorInfo, type ReactNode } from "react";
import { useStudio } from "@/lib/studio-store";

type Props = { children: ReactNode };
type State = { failed: boolean };

export class StudioBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("studio-boundary", error.message, info.componentStack);
  }

  recover = () => {
    const s = useStudio.getState();
    s.setError(null);
    s.setStatus("idle");
    s.setBay("floor");
    s.takeShow();
    this.setState({ failed: false });
  };

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-air">
          Floor recovered
        </p>
        <p className="max-w-md text-lg font-medium tracking-tight text-fg">
          The picture stumbled. The show is still here.
        </p>
        <button
          type="button"
          onClick={this.recover}
          className="h-12 rounded-full bg-air px-6 text-sm font-medium text-fg"
        >
          Back to standing
        </button>
      </div>
    );
  }
}
