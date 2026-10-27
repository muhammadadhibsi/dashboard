import { ReceiptText } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAllTransactions } from "@/api/transactions.queries";
import { Avatar } from "@/components/common/Avatar";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingRegion, Skeleton } from "@/components/common/SkeletonLoader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUIStore } from "@/store/useUIStore";
import { formatCurrency } from "@/utils/formatters";
import { getInitials } from "@/utils/initials";
import { compareNewestFirst } from "@/utils/transactions";

const COLUMNS = ["Transaction ID", "Customer", "Amount", "Method", "Status"];

// 75px rows with 24px side padding and 16px body text, as measured on the reference.
const ROW_CELL = "h-14 px-5 py-0 text-sm";

export function RecentTransactions() {
  const openTransaction = useUIStore((s) => s.openTransaction);
  const { data, isPending, isError, error, refetch, isRefetching } =
    useAllTransactions();
  // Same cached query as the Transactions page; the API returns oldest first.
  const rows = useMemo(
    () => [...(data ?? [])].sort(compareNewestFirst).slice(0, 5),
    [data],
  );

  return (
    <Card
      role="region"
      aria-labelledby="recent-tx-title"
      className="min-w-0 gap-0 overflow-hidden py-0"
    >
      {/* Title row sits on a hairline divider; the table then runs edge to edge. */}
      <CardHeader className="items-center border-b px-5 py-4 [.border-b]:pb-4">
        <CardTitle
          id="recent-tx-title"
          role="heading"
          aria-level={2}
          className="text-lg leading-6 font-semibold text-fg"
        >
          Recent Transactions
        </CardTitle>
        <CardAction className="self-center">
          <Link
            to="/transactions"
            className="rounded-sm text-xs font-bold text-violet-ink transition-colors hover:text-fg"
          >
            View All
          </Link>
        </CardAction>
      </CardHeader>

      <div className="flex flex-1 flex-col">
        {isPending ? (
          <LoadingRegion
            label="Loading recent transactions"
            className="space-y-3 p-6"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 py-2"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </LoadingRegion>
        ) : isError ? (
          <ErrorState
            subject="recent transactions"
            error={error}
            onRetry={() => void refetch()}
            retrying={isRefetching}
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="No transactions yet"
            description="Transactions appear here as soon as payments are processed."
          />
        ) : (
          <>
            {/* Below md a stacked list keeps every field without horizontal scroll. */}
            <ul className="divide-y divide-line px-6 md:hidden">
              {rows.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between gap-3 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar
                      initials={getInitials(tx.customer_name)}
                      seed={tx.customer_email}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-fg">
                        {tx.customer_name}
                      </p>
                      <p className="truncate font-mono text-xs text-muted">
                        #{tx.transaction_id}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-sm text-fg tabular-nums">
                      {formatCurrency(tx.amount)}
                    </p>
                    <div className="mt-1 flex justify-end">
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Table className="hidden md:table">
              <TableCaption className="sr-only">
                Five most recent transactions
              </TableCaption>
              <TableHeader className="bg-surface-low">
                <TableRow className="hover:bg-transparent">
                  {COLUMNS.map((label) => (
                    <TableHead
                      key={label}
                      className="h-10 px-5 text-[11px] font-medium tracking-wider text-muted uppercase"
                    >
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className={`${ROW_CELL} text-fg`}>
                      <Button
                        variant="link"
                        onClick={() => openTransaction(tx.transaction_id)}
                        title={`View details for ${tx.transaction_id}`}
                        className="h-auto p-0 text-sm font-normal text-violet-ink hover:underline"
                      >
                        #{tx.transaction_id}
                      </Button>
                    </TableCell>
                    <TableCell className={ROW_CELL}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={getInitials(tx.customer_name)}
                          seed={tx.customer_email}
                        />
                        <span className="truncate text-fg">
                          {tx.customer_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={`${ROW_CELL} text-fg tabular-nums`}>
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell className={`${ROW_CELL} text-sm text-fg`}>
                      {tx.method}
                    </TableCell>
                    <TableCell className={ROW_CELL}>
                      <StatusBadge status={tx.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </Card>
  );
}
