import { Download, Inbox, SearchX } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Pagination } from "@/components/common/Pagination";
import { LoadingRegion } from "@/components/common/SkeletonLoader";
import { TransactionFilterBar } from "@/components/transactions/TransactionFilterBar";
import {
  TransactionTable,
  TransactionTableSkeleton,
} from "@/components/transactions/TransactionTable";
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions";
import { useFilterStore } from "@/store/useFilterStore";
import { toLocalDayKey } from "@/utils/dateRange";
import { formatCurrency } from "@/utils/formatters";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 15;

export function TransactionsPage() {
  const { query, filtered } = useFilteredTransactions();
  const page = useFilterStore((s) => s.page);
  const setPage = useFilterStore((s) => s.setPage);
  const resetFilters = useFilterStore((s) => s.resetFilters);

  const all = query.data;
  const bounds = useMemo(() => {
    if (!all?.length) return { minDay: undefined, maxDay: undefined };
    const days = all.map((tx) => toLocalDayKey(tx.date)).sort();
    return { minDay: days[0], maxDay: days[days.length - 1] };
  }, [all]);

  // Debounced search can shrink the result set after the page was chosen.
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount, setPage]);

  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const successRows = filtered.filter((tx) => tx.status === "success");
  const successCount = successRows.length;
  const settled = successRows.reduce((sum, tx) => sum + tx.amount, 0);

  const exportCsv = useCallback(() => {
    if (!filtered.length) return;
    const headers = [
      "Transaction ID",
      "Date",
      "Customer Name",
      "Customer Email",
      "Amount",
      "Payment Method",
      "Status",
    ];
    const escapeCsv = (val: string | number) =>
      `"${String(val).replace(/"/g, '""')}"`;
    const lines = [
      headers.join(","),
      ...filtered.map((tx) =>
        [
          escapeCsv(tx.transaction_id),
          escapeCsv(tx.date),
          escapeCsv(tx.customer_name),
          escapeCsv(tx.customer_email),
          escapeCsv(tx.amount.toFixed(2)),
          escapeCsv(tx.method),
          escapeCsv(tx.status),
        ].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vocagame-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold leading-8 text-fg">Transactions</h1>
          <p className="text-sm text-muted">
            Manage and monitor all platform financial activity.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {query.isSuccess && filtered.length > 0 && (
            <p className="text-sm text-muted" aria-live="polite">
              <span className="font-mono font-semibold text-fg tabular-nums">
                {formatCurrency(settled)}
              </span>{" "}
              settled from{" "}
              <span className="font-mono font-semibold text-fg tabular-nums">
                {successCount}
              </span>{" "}
              successful of{" "}
              <span className="font-mono font-semibold text-fg tabular-nums">
                {filtered.length}
              </span>{" "}
              transactions
            </p>
          )}
          <Button
            variant="outline"
            onClick={exportCsv}
            disabled={!filtered.length}
            className="h-11 rounded-xl bg-surface px-3.5"
          >
            <Download aria-hidden="true" className="text-muted" />
            Export CSV
          </Button>
        </div>
      </div>

      <TransactionFilterBar minDay={bounds.minDay} maxDay={bounds.maxDay} />

      <section
        aria-label="Transaction list"
        className="overflow-hidden rounded-xl border border-line-soft bg-card-low"
      >
        {query.isPending ? (
          <LoadingRegion label="Loading transactions">
            <TransactionTableSkeleton />
          </LoadingRegion>
        ) : query.isError ? (
          <ErrorState
            subject="transactions"
            error={query.error}
            onRetry={() => void query.refetch()}
            retrying={query.isRefetching}
          />
        ) : all?.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No transactions yet"
            description="Payments will be listed here as soon as customers check out."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No transactions match your filters"
            description="Try a shorter search term, another status or method, or a wider date range."
            action={
              <Button
                onClick={resetFilters}
                className="h-11 rounded-lg px-4 font-semibold"
              >
                Reset filters
              </Button>
            }
          />
        ) : (
          <>
            <TransactionTable rows={rows} />
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              noun="transactions"
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
