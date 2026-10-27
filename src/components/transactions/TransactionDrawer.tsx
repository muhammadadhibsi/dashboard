import { Check, Copy } from "lucide-react";
import type { ReactNode } from "react";
import { useAllTransactions } from "@/api/transactions.queries";
import { Avatar } from "@/components/common/Avatar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCopy } from "@/hooks/useCopy";
import { useUIStore } from "@/store/useUIStore";
import { formatCurrency, formatTxDate } from "@/utils/formatters";
import { getInitials } from "@/utils/initials";
import { formatPaymentMethod } from "@/utils/paymentMethod";

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 text-xs">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-fg text-right">{children}</dd>
    </div>
  );
}

export function TransactionDrawer() {
  const transactionId = useUIStore((s) => s.drawerTransactionId);
  const close = useUIStore((s) => s.closeTransaction);
  const { data, isPending } = useAllTransactions();
  const { copied, copy } = useCopy();

  const open = Boolean(transactionId);
  const tx = data?.find((row) => row.transaction_id === transactionId);

  return (
    <Dialog open={open} onOpenChange={(val) => !val && close()}>
      <DialogContent className="block max-h-[calc(100dvh-2rem)] max-w-md overflow-y-auto sm:max-w-md">
        <div className="border-b border-line pb-4 pr-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Transaction Details
            </span>
            <DialogTitle className="mt-1 font-mono text-lg font-semibold text-fg">
              {transactionId}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Complete overview of transaction record and customer details
            </DialogDescription>
          </div>
        </div>

        {isPending ? (
          <p className="py-8 text-center text-sm text-muted">
            Loading transaction...
          </p>
        ) : !tx ? (
          <p className="py-8 text-center text-sm text-muted">
            This transaction is no longer in the dataset.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {/* Amount hero pill */}
            <div className="rounded-xl border border-line bg-surface-2 p-4">
              <p className="text-xs font-medium text-muted">Total Amount</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="font-mono text-2xl font-bold tracking-tight text-fg tabular-nums">
                  {formatCurrency(tx.amount)}
                </p>
                <StatusBadge status={tx.status} />
              </div>
            </div>

            {/* Data list */}
            <dl className="divide-y divide-line rounded-xl border border-line bg-surface-2">
              <DetailRow label="Date">
                <span className="tabular-nums">{formatTxDate(tx.date)}</span>
              </DetailRow>

              <DetailRow label="Payment Method">
                <span>{formatPaymentMethod(tx.method, tx.id).label}</span>
              </DetailRow>

              <DetailRow label="Transaction ID">
                <span className="inline-flex items-center gap-1.5 font-mono">
                  <span className="text-violet-ink">{tx.transaction_id}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => void copy("tx-id", tx.transaction_id)}
                    aria-label="Copy transaction ID"
                    className="-my-2 size-9 text-muted"
                  >
                    {copied === "tx-id" ? (
                      <Check
                        aria-hidden="true"
                        className="size-3 text-voca-ink"
                      />
                    ) : (
                      <Copy aria-hidden="true" className="size-3" />
                    )}
                  </Button>
                </span>
              </DetailRow>
            </dl>

            {/* Customer card */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Customer
              </h3>
              <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 p-3">
                <Avatar
                  initials={getInitials(tx.customer_name)}
                  seed={tx.customer_email}
                  className="size-10 text-xs"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-fg">
                    {tx.customer_name}
                  </p>
                  <p className="truncate text-[11px] text-muted">
                    {tx.customer_email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => void copy("cust-email", tx.customer_email)}
                  aria-label="Copy customer email"
                  className="size-11 text-muted"
                >
                  {copied === "cust-email" ? (
                    <Check
                      aria-hidden="true"
                      className="size-3.5 text-voca-ink"
                    />
                  ) : (
                    <Copy aria-hidden="true" className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
