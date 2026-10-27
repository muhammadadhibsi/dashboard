import { useCustomerSummary } from "@/api/customers.queries";
import { AcquisitionChart } from "@/components/customers/AcquisitionChart";
import { CustomerSegmentCards } from "@/components/customers/CustomerSegmentCards";
import { GeoDistributionWidget } from "@/components/customers/GeoDistributionWidget";
import { TopSpendersTable } from "@/components/customers/TopSpendersTable";
import { formatNumber } from "@/utils/formatters";

function OnlineNow() {
  const { data } = useCustomerSummary();
  if (!data) return <p className="mt-1 h-5 text-sm text-muted" aria-hidden />;
  return (
    <p className="mt-1 flex items-center gap-2 text-sm text-muted">
      <span aria-hidden className="size-2 rounded-full bg-voca-ink" />
      <span>
        <span className="font-semibold text-voca-ink tabular-nums">
          {formatNumber(data.active_users_online.current)}
        </span>{" "}
        active users currently online
      </span>
    </p>
  );
}

export function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-fg">
          Customer Insights
        </h1>
        <OnlineNow />
      </div>
      <CustomerSegmentCards />
      <div className="grid gap-3.5 lg:grid-cols-3">
        <AcquisitionChart />
        <GeoDistributionWidget />
      </div>
      <TopSpendersTable />
    </div>
  );
}
