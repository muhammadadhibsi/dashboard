import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface BoundaryProps {
  onReset: () => void;
  children: ReactNode;
}

interface BoundaryState {
  error: Error | null;
}

class Boundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      "Render error caught by ErrorBoundary",
      error,
      info.componentStack,
    );
  }

  reset = () => {
    this.props.onReset();
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div
        role="alert"
        className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center"
      >
        <TriangleAlert aria-hidden className="size-8 text-amber-ink" />
        <div>
          <h1 className="text-lg font-semibold text-fg">
            This page hit an unexpected error
          </h1>
          <p className="mt-2 text-sm text-muted">{this.state.error.message}</p>
        </div>
        <Button
          onClick={this.reset}
          className="h-11 rounded-lg px-4 font-semibold"
        >
          Reload this page
        </Button>
      </div>
    );
  }
}

/** Render-error boundary that also resets failed queries on retry. */
export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => <Boundary onReset={reset}>{children}</Boundary>}
    </QueryErrorResetBoundary>
  );
}
