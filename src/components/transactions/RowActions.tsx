import { Check, Copy, Eye, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopy } from "@/hooks/useCopy";
import { useUIStore } from "@/store/useUIStore";
import type { Transaction } from "@/types";

export function RowActions({ tx }: { tx: Transaction }) {
  const openTransaction = useUIStore((s) => s.openTransaction);
  const { copied, copy } = useCopy();

  const copyItem = (key: "id" | "email", label: string, value: string) => (
    <DropdownMenuItem
      // Keep the menu open so the "Copied" confirmation is visible.
      onSelect={(event) => {
        event.preventDefault();
        void copy(key, value);
      }}
      className="min-h-10 justify-between"
    >
      <span className="flex items-center gap-2">
        {copied === key ? (
          <Check aria-hidden className="text-voca-ink" />
        ) : (
          <Copy aria-hidden />
        )}
        {label}
      </span>
      {copied === key && <span className="text-xs text-voca-ink">Copied</span>}
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Actions for transaction ${tx.transaction_id}`}
          className="size-11 text-muted data-[state=open]:bg-hover data-[state=open]:text-fg [&_svg:not([class*='size-'])]:size-6"
        >
          <MoreVertical aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onSelect={() => openTransaction(tx.transaction_id)}
          className="min-h-10"
        >
          <Eye aria-hidden />
          View details
        </DropdownMenuItem>
        {copyItem("id", "Copy ID", tx.transaction_id)}
        {copyItem("email", "Copy email", tx.customer_email)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
