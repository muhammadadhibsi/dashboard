import { Check, Copy } from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { SegmentBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCopy } from "@/hooks/useCopy";
import { useUIStore } from "@/store/useUIStore";
import { formatCurrency } from "@/utils/formatters";
import { getInitials } from "@/utils/initials";

export function CustomerDetailDialog() {
  const customer = useUIStore((s) => s.selectedCustomer);
  const setSelectedCustomer = useUIStore((s) => s.setSelectedCustomer);
  const { copied, copy } = useCopy();

  return (
    <Dialog
      open={customer !== null}
      onOpenChange={(open) => !open && setSelectedCustomer(null)}
    >
      <DialogContent className="max-w-md gap-6 sm:max-w-md">
        {customer && (
          <>
            <DialogHeader className="flex-row items-center gap-3 pr-10 text-left">
              <Avatar
                initials={getInitials(customer.customer_name)}
                seed={customer.email}
                className="size-12 text-sm"
              />
              <div className="min-w-0">
                <DialogTitle className="truncate text-lg font-semibold text-fg">
                  {customer.customer_name}
                </DialogTitle>
                <DialogDescription className="truncate text-xs text-muted">
                  {customer.email}
                </DialogDescription>
              </div>
            </DialogHeader>

            <dl className="space-y-4 rounded-xl border border-line bg-surface-2/60 p-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Lifetime Value</dt>
                <dd className="font-mono text-base font-bold text-voca-ink tabular-nums">
                  {formatCurrency(customer.ltv)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Segment</dt>
                <dd>
                  <SegmentBadge segment={customer.segment} />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Last Active</dt>
                <dd className="font-medium text-fg">{customer.last_active}</dd>
              </div>
            </dl>

            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => void copy("email", customer.email)}
                className="h-11 rounded-xl"
              >
                {copied === "email" ? (
                  <Check aria-hidden className="text-voca-ink" />
                ) : (
                  <Copy aria-hidden />
                )}
                {copied === "email" ? "Copied" : "Copy Email"}
              </Button>
              <DialogClose asChild>
                <Button className="h-11 rounded-xl px-5 font-semibold">
                  Done
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
