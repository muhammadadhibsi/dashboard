import { Badge } from "@/components/ui/badge";
import type { CustomerSegment, TransactionStatus } from "@/types";
import { cn } from "@/utils/cn";

const STATUS_LABEL: Record<TransactionStatus, string> = {
  success: "Success",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

// Borderless tags from the Top Spenders reference, tinted by segment.
const SEGMENT_STYLES: Record<CustomerSegment, string> = {
  Whale: "bg-violet-ink/10 text-violet-ink",
  "High Value": "bg-voca-ink/12 text-voca-ink",
  "Power User": "bg-violet-ink/15 text-violet-ink",
};

/** Status variants live in ui/badge.tsx; the label carries meaning, not just the color. */
export function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <Badge
      variant={status}
      className="h-5 rounded-full px-2.5 py-0 text-xs font-medium"
    >
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export function SegmentBadge({ segment }: { segment: CustomerSegment }) {
  return (
    <Badge
      className={cn(
        "h-5 rounded border-0 px-2 py-0 text-[11px] font-semibold",
        SEGMENT_STYLES[segment],
      )}
    >
      {segment}
    </Badge>
  );
}
