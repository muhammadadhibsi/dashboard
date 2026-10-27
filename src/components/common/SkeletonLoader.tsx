import type { ReactNode } from "react";
import { Skeleton as UISkeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";

/** shadcn Skeleton, hidden from assistive tech; LoadingRegion does the announcing. */
export function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <UISkeleton aria-hidden className={className} {...props} />;
}

/** Announces loading to screen readers while the visual skeleton is shown. */
export function LoadingRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export function SkeletonRows({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}
