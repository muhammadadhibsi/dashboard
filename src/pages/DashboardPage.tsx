import { useMemo } from "react";
import { useDashboardSummary } from "@/api/dashboard.queries";
import { useAllTransactions } from "@/api/transactions.queries";
import { ErrorState } from "@/components/common/ErrorState";
import { MetricCard, MetricCardSkeleton } from "@/components/common/MetricCard";
import { LoadingRegion } from "@/components/common/SkeletonLoader";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { PaymentDistribution } from "@/components/dashboard/PaymentDistribution";
import { ProductPerformance } from "@/components/dashboard/ProductPerformance";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Card } from "@/components/ui/card";
import { formatNumber, formatWholeCurrency } from "@/utils/formatters";
import { buildDailyKpiSeries } from "@/utils/revenue";

const formatRate = (value: number) => `${value.toFixed(2)}%`;

function KpiRow() {
  const { data, isPending, isError, error, refetch, isRefetching } =
    useDashboardSummary();
  const txQuery = useAllTransactions();

  // Last 7 local days ending on the latest transaction, zero-filled.
  const { revenue: revenueSeries, orders: ordersSeries } = useMemo(
    () => buildDailyKpiSeries(txQuery.data ?? [], 7),
    [txQuery.data],
  );

  if (isPending) {
    return (
      <LoadingRegion
        label="Loading key metrics"
        className="grid gap-4.5 grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: 4 }, (_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </LoadingRegion>
    );
  }

  if (isError) {
    return (
      <Card className="py-0">
        <ErrorState
          subject="key metrics"
          error={error}
          onRetry={() => void refetch()}
          retrying={isRefetching}
        />
      </Card>
    );
  }

  return (
    <div className="grid gap-4.5 grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Total Revenue"
        {...data.total_revenue}
        format={formatWholeCurrency}
        sparkline={revenueSeries}
      />
      <MetricCard
        label="Total Orders"
        {...data.total_orders}
        format={formatNumber}
        sparkline={ordersSeries}
      />
      <MetricCard
        label="Active Users"
        {...data.active_users}
        format={formatNumber}
      />
      <MetricCard
        label="Conversion"
        {...data.conversion_rate}
        format={formatRate}
      />
    </div>
  );
}

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <section aria-label="Key metrics">
        <KpiRow />
      </section>

      <RevenueChart />

      <div className="grid gap-4.5 lg:grid-cols-2">
        <ProductPerformance />
        <PaymentDistribution />
      </div>

      <div className="grid gap-4.5 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <RecentTransactions />
        </div>
        <div className="min-w-0 lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
