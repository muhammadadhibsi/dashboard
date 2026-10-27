import { Avatar } from "@/components/common/Avatar";
import { Skeleton } from "@/components/common/SkeletonLoader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TD, TH } from "@/components/common/tableStyles";
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
import type { PaymentMethod, Transaction } from "@/types";
import { formatCurrency, formatTxDate } from "@/utils/formatters";
import { getInitials } from "@/utils/initials";
import { formatPaymentMethod } from "@/utils/paymentMethod";
import { RowActions } from "./RowActions";
import { Button } from "@/components/ui/button";

function MethodCell({
  method,
  seed,
}: {
  method: PaymentMethod;
  seed?: number;
}) {
  const { label, Icon } = formatPaymentMethod(method, seed);

  return (
    <div className="flex items-center gap-2 text-sm text-muted whitespace-nowrap">
      <Icon aria-hidden="true" className="size-5 shrink-0 text-muted" />
      <span>{label}</span>
    </div>
  );
}

export function TransactionTable({ rows }: { rows: Transaction[] }) {
  const openTransaction = useUIStore((s) => s.openTransaction);

  return (
    <>
      {/* md and up: full table */}
      <div className="relative hidden overflow-x-auto md:block">
        <Table className="w-full text-sm">
          <TableCaption className="sr-only">Transactions</TableCaption>
          <TableHeader>
            <TableRow className="bg-band hover:bg-band">
              <TableHead className={`${TH} w-[125px]`}>Transaction ID</TableHead>
              <TableHead className={`${TH} w-[165px]`}>Date</TableHead>
              <TableHead className={TH}>Customer</TableHead>
              <TableHead className={`${TH} w-[95px]`}>Amount</TableHead>
              <TableHead className={`${TH} w-[120px]`}>Method</TableHead>
              <TableHead className={`${TH} w-[105px] text-center`}>Status</TableHead>
              <TableHead className={`${TH} w-[50px] text-right`}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className={TD}>
                  <Button
                    variant="link"
                    onClick={() => openTransaction(tx.transaction_id)}
                    title={`View details for ${tx.transaction_id}`}
                    className="h-auto p-0 text-sm font-normal text-violet-ink"
                  >
                    {tx.transaction_id}
                  </Button>
                </TableCell>
                <TableCell
                  className={`${TD} whitespace-nowrap text-muted tabular-nums`}
                >
                  {formatTxDate(tx.date)}
                </TableCell>
                <TableCell className={TD}>
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={getInitials(tx.customer_name)}
                      seed={tx.customer_email}
                    />
                    <span
                      className="min-w-0 truncate text-fg"
                      title={tx.customer_email}
                    >
                      {tx.customer_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  className={`${TD} whitespace-nowrap font-semibold text-fg tabular-nums`}
                >
                  {formatCurrency(tx.amount)}
                </TableCell>
                <TableCell className={TD}>
                  <MethodCell method={tx.method} seed={tx.id} />
                </TableCell>
                <TableCell className={`${TD} text-center`}>
                  <StatusBadge status={tx.status} />
                </TableCell>
                <TableCell className={`${TD} py-2 text-right`}>
                  <RowActions tx={tx} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* below md: stacked cards, no sideways scrolling */}
      <ul className="divide-y divide-line md:hidden">
        {rows.map((tx) => (
          <li key={tx.id} className="flex gap-3 px-4 py-4">
            <Avatar
              initials={getInitials(tx.customer_name)}
              seed={tx.customer_email}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium text-fg">
                    {tx.customer_name}
                  </p>
                  <Button
                    variant="link"
                    onClick={() => openTransaction(tx.transaction_id)}
                    className="block h-auto max-w-full truncate p-0 text-left font-mono text-sm font-normal text-violet-ink"
                  >
                    {tx.transaction_id}
                  </Button>
                </div>
                <p className="shrink-0 font-mono font-semibold text-fg tabular-nums">
                  {formatCurrency(tx.amount)}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <StatusBadge status={tx.status} />
                <MethodCell method={tx.method} seed={tx.id} />
                <span className="tabular-nums">{formatTxDate(tx.date)}</span>
              </div>
            </div>
            <div className="-mt-2 -mr-2 shrink-0">
              <RowActions tx={tx} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function TransactionTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {/* md and up: table structure skeleton */}
      <div className="relative hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-band">
              <th className={TH}><Skeleton className="h-4 w-24" /></th>
              <th className={TH}><Skeleton className="h-4 w-16" /></th>
              <th className={TH}><Skeleton className="h-4 w-28" /></th>
              <th className={TH}><Skeleton className="h-4 w-18" /></th>
              <th className={TH}><Skeleton className="h-4 w-20" /></th>
              <th className={`${TH} text-center`}><Skeleton className="mx-auto h-4 w-16" /></th>
              <th className={`${TH} text-right`}><Skeleton className="ml-auto size-5 rounded-md" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {Array.from({ length: rows }, (_, i) => (
              <tr key={i} className="border-b border-line">
                <td className={TD}><Skeleton className="h-4 w-24" /></td>
                <td className={TD}><Skeleton className="h-4 w-32" /></td>
                <td className={TD}>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-8 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </td>
                <td className={TD}><Skeleton className="h-4 w-20" /></td>
                <td className={TD}>
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-4 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </td>
                <td className={`${TD} text-center`}>
                  <Skeleton className="mx-auto h-5 w-20 rounded-full" />
                </td>
                <td className={`${TD} text-right`}>
                  <Skeleton className="ml-auto size-7 rounded-md" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* below md: stacked card skeletons */}
      <ul className="divide-y divide-line md:hidden">
        {Array.from({ length: Math.min(rows, 5) }, (_, i) => (
          <li key={i} className="flex gap-3 px-4 py-4">
            <Skeleton className="size-8 rounded-full shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-3 w-24" />
              <div className="mt-2 flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
