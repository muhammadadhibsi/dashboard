import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { getPaginationRange } from "@/utils/pagination";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  /** "transactions", "users", "customers" */
  noun: string;
  onPageChange: (page: number) => void;
  busy?: boolean;
  variant?: "default" | "compact";
}

export function Pagination({
  page,
  pageSize,
  total,
  noun,
  onPageChange,
  busy,
  variant = "default",
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  if (variant === "compact") {
    return (
      <nav
        aria-label={`${noun} pages`}
        className="flex h-15 items-center justify-between border-t border-line bg-surface-low px-6"
      >
        <p className="text-xs font-medium text-muted" aria-live="polite">
          Showing{" "}
          <span className="tabular-nums">
            {from}-{to}
          </span>{" "}
          of <span className="tabular-nums">{total.toLocaleString()}</span>{" "}
          {noun}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || busy}
            aria-label="Previous page"
            className="h-7.5 w-6.5 rounded-lg border-line bg-transparent pointer-coarse:size-11 dark:bg-transparent [&_svg:not([class*='size-'])]:size-4"
          >
            <ChevronLeft aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount || busy}
            aria-label="Next page"
            className="h-7.5 w-6.5 rounded-lg border-line bg-transparent pointer-coarse:size-11 dark:bg-transparent [&_svg:not([class*='size-'])]:size-4"
          >
            <ChevronRight aria-hidden />
          </Button>
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label={`${noun} pages`}
      className="flex flex-col gap-3 border-t border-line bg-band px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-fg" aria-live="polite">
        Showing{" "}
        <span className="tabular-nums">
          {from}-{to}
        </span>{" "}
        of <span className="tabular-nums">{total.toLocaleString()}</span> {noun}
      </p>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-9 rounded-lg border-line bg-transparent text-muted hover:text-fg disabled:opacity-40 [&_svg:not([class*='size-'])]:size-4"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || busy}
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden />
        </Button>

        <span className="min-w-20 text-center text-sm text-muted tabular-nums sm:hidden">
          Page {page} of {pageCount}
        </span>

        <ol className="hidden items-center gap-1 sm:flex">
          {getPaginationRange(page, pageCount).map((item, i) =>
            item === "gap" ? (
              <li
                key={`gap-${i}`}
                aria-hidden
                className="w-6 text-center text-muted"
              >
                ...
              </li>
            ) : (
              <li key={item}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onPageChange(item)}
                  aria-current={item === page ? "page" : undefined}
                  disabled={busy}
                  className={cn(
                    "size-10 rounded-lg text-base tabular-nums",
                    item === page
                      ? "bg-violet-ink font-bold text-surface-low hover:bg-violet-ink hover:text-surface-low"
                      : "font-bold text-muted hover:bg-hover hover:text-fg",
                  )}
                >
                  {item}
                </Button>
              </li>
            ),
          )}
        </ol>

        <Button
          variant="outline"
          size="icon"
          className="size-9 rounded-lg border-line bg-transparent text-muted hover:text-fg disabled:opacity-40 [&_svg:not([class*='size-'])]:size-4"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount || busy}
          aria-label="Next page"
        >
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </nav>
  );
}
