import { Search } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAllTransactions } from "@/api/transactions.queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatters";
import { Avatar } from "./Avatar";
import { NAV_ITEMS } from "./navItems";

interface Result {
  key: string;
  label: string;
  hint: string;
  run: () => void;
  render?: () => ReactNode;
}

const MAX_TRANSACTIONS = 6;

export function CommandPalette() {
  const open = useUIStore((s) => s.paletteOpen);
  const setOpen = useUIStore((s) => s.setPaletteOpen);

  // Ctrl/Cmd + K from anywhere toggles the palette.
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!useUIStore.getState().paletteOpen);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="top-[12vh] translate-y-0 gap-0 overflow-hidden bg-surface-2 p-0 sm:max-w-lg"
      >
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Jump to a page or open a transaction
        </DialogDescription>
        {/* Mounted only while open, so every opening starts with an empty query. */}
        <PaletteBody onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function PaletteBody({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const openTransaction = useUIStore((s) => s.openTransaction);
  const transactions = useAllTransactions();
  const [term, setTerm] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();

  const results = useMemo<Result[]>(() => {
    const q = term.trim().toLowerCase();
    const pages: Result[] = NAV_ITEMS.filter((item) =>
      item.label.toLowerCase().includes(q),
    ).map((item) => ({
      key: `page-${item.to}`,
      label: item.label,
      hint: "Go to page",
      run: () => navigate(item.to),
    }));
    if (!q) return pages;

    const matches: Result[] = (transactions.data ?? [])
      .filter(
        (tx) =>
          tx.transaction_id.toLowerCase().includes(q) ||
          tx.customer_name.toLowerCase().includes(q) ||
          tx.customer_email.toLowerCase().includes(q),
      )
      .slice(0, MAX_TRANSACTIONS)
      .map((tx) => ({
        key: `tx-${tx.id}`,
        label: `${tx.transaction_id} · ${tx.customer_name}`,
        hint: formatCurrency(tx.amount),
        run: () => {
          navigate("/transactions");
          openTransaction(tx.transaction_id);
        },
        render: () => (
          <Avatar
            initials={tx.avatar}
            seed={tx.customer_email}
            className="size-7 text-[10px]"
          />
        ),
      }));
    return [...pages, ...matches];
  }, [term, transactions.data, navigate, openTransaction]);

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));

  const select = (result: Result | undefined) => {
    if (!result) return;
    onClose();
    result.run();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((activeIndex + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(
        (activeIndex - 1 + results.length) % Math.max(results.length, 1),
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      select(results[activeIndex]);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 border-b px-4">
        <Search aria-hidden className="size-4 shrink-0 text-subtle" />
        <Input
          value={term}
          onChange={(event) => {
            setTerm(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={
            results[activeIndex] ? `${listId}-${activeIndex}` : undefined
          }
          aria-label="Search pages and transactions"
          placeholder="Transaction ID, customer name or email"
          className="h-14 min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 text-base shadow-none placeholder:text-subtle focus-visible:ring-0 dark:bg-transparent"
        />
        <kbd className="rounded-md border px-1.5 py-0.5 text-[11px] text-muted">
          Esc
        </kbd>
      </div>

      <ul
        id={listId}
        role="listbox"
        aria-label="Results"
        className="max-h-80 overflow-y-auto p-2"
      >
        {results.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted">
            {transactions.isPending
              ? "Loading transactions..."
              : `Nothing matches "${term.trim()}".`}
          </li>
        )}
        {results.map((result, index) => (
          <li
            key={result.key}
            id={`${listId}-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            onClick={() => select(result)}
            onMouseMove={() => setActive(index)}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm",
              index === activeIndex ? "bg-hover text-fg" : "text-muted",
            )}
          >
            {result.render?.()}
            <span className="min-w-0 flex-1 truncate">{result.label}</span>
            <span className="shrink-0 text-xs text-subtle">{result.hint}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
