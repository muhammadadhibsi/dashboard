import { RotateCw, WifiOff } from "lucide-react";
import { ApiError } from "@/api/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface ErrorStateProps {
  /** What failed to load, in the user's words: "revenue summary" */
  subject: string;
  error: unknown;
  onRetry: () => void;
  retrying?: boolean;
  className?: string;
}

function describe(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 0)
      return "The mock API could not be reached. Check your connection.";
    if (error.status >= 500)
      return `The mock API returned a server error (${error.status}).`;
    return `The mock API rejected the request (${error.status}).`;
  }
  return "Something unexpected happened while reading the response.";
}

export function ErrorState({
  subject,
  error,
  onRetry,
  retrying,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-8 text-center",
        className,
      )}
    >
      <WifiOff aria-hidden className="size-6 text-rose-ink" />
      <div>
        <p className="text-sm font-medium text-fg">Couldn't load {subject}</p>
        <p className="mt-1 max-w-xs text-sm text-muted">{describe(error)}</p>
      </div>
      <Button
        variant="outline"
        onClick={onRetry}
        disabled={retrying}
        className="h-11 rounded-lg px-4"
      >
        <RotateCw aria-hidden className={cn(retrying && "animate-spin")} />
        {retrying ? "Retrying" : "Try again"}
      </Button>
    </div>
  );
}
