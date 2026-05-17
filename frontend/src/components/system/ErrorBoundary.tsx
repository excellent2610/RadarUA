import type { ErrorInfo, PropsWithChildren } from "react";
import { Component } from "react";
import { translate } from "../../i18n";

interface State {
  failed: boolean;
}

export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Збій інтерфейсу RadarUA", error, info);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-radar-black p-6 text-center text-slate-100">
          <div className="max-w-sm rounded border border-radar-red/30 bg-radar-panel p-5">
            <h1 className="font-display text-xl text-radar-red">{translate("errors.uiFailureTitle")}</h1>
            <p className="mt-2 text-sm text-slate-300">{translate("errors.uiFailureBody")}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
