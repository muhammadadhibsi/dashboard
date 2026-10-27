import { ShieldCheck, UserPlus, UserX } from "lucide-react";
import { useCustomerSummary } from "@/api/customers.queries";
import { ErrorState } from "@/components/common/ErrorState";
import { MetricCard, MetricCardSkeleton } from "@/components/common/MetricCard";
import { LoadingRegion } from "@/components/common/SkeletonLoader";
import { formatNumber } from "@/utils/formatters";

export function CustomerSegmentCards() {
  const { data, isPending, isError, error, refetch, isRefetching } =
    useCustomerSummary();

  if (isPending) {
    return (
      <LoadingRegion
        label="Loading customer segments"
        className="grid gap-3.5 sm:grid-cols-3"
      >
        <MetricCardSkeleton variant="segment" />
        <MetricCardSkeleton variant="segment" />
        <MetricCardSkeleton variant="segment" />
      </LoadingRegion>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-line-soft bg-card-low">
        <ErrorState
          subject="customer segments"
          error={error}
          onRetry={() => void refetch()}
          retrying={isRefetching}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-3.5 sm:grid-cols-3">
      <MetricCard
        label="New Segments"
        icon={UserPlus}
        current={data.new_segments.current}
        previous={data.new_segments.previous}
        format={formatNumber}
        variant="segment"
        footnote="Customers acquired in the last 7 days"
      />
      <MetricCard
        label="Retaining"
        icon={ShieldCheck}
        current={data.retaining.current}
        previous={data.retaining.previous}
        format={formatNumber}
        variant="segment"
        footnote="Loyal users with 3+ repeat actions"
      />
      <MetricCard
        label="Churned"
        icon={UserX}
        current={data.churned.current}
        previous={data.churned.previous}
        format={formatNumber}
        variant="segment"
        neutralBadge
        valueClassName="text-rose"
        className="border-line-danger"
        footnote="Users inactive for over 30 days"
      />
    </div>
  );
}
