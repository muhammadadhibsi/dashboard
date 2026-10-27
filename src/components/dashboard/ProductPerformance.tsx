import { MoreHorizontal, PackageOpen } from "lucide-react";
import { useState } from "react";
import { useProductPerformance } from "@/api/dashboard.queries";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Panel } from "@/components/common/Panel";
import { LoadingRegion, Skeleton } from "@/components/common/SkeletonLoader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { rankColor } from "@/utils/chartTheme";
import { formatCompactCurrency } from "@/utils/formatters";

const INITIAL_COUNT = 5;

type SortMode = "revenue" | "share" | "name";

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "revenue", label: "Sort by Revenue (High to Low)" },
  { id: "share", label: "Sort by Share (%)" },
  { id: "name", label: "Sort Alphabetically" },
];

export function ProductPerformance() {
  const { data, isPending, isError, error, refetch, isRefetching } =
    useProductPerformance();
  const [showAll, setShowAll] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("revenue");

  const sorted = [...(data ?? [])].sort((a, b) => {
    if (sortMode === "revenue") return b.revenue - a.revenue;
    if (sortMode === "share") {
      const shareA = a.max_revenue > 0 ? a.revenue / a.max_revenue : 0;
      const shareB = b.max_revenue > 0 ? b.revenue / b.max_revenue : 0;
      return shareB - shareA;
    }
    return a.name.localeCompare(b.name);
  });

  const visible = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);
  const hidden = sorted.length - INITIAL_COUNT;

  const menuAction = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Product performance options"
          className="size-8 text-muted hover:bg-transparent hover:text-fg data-[state=open]:text-fg [&_svg:not([class*='size-'])]:size-6"
        >
          <MoreHorizontal aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="text-xs tracking-wider text-muted uppercase">
          Order by
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={sortMode}
          onValueChange={(value) => setSortMode(value as SortMode)}
        >
          {SORT_OPTIONS.map((opt) => (
            <DropdownMenuRadioItem
              key={opt.id}
              value={opt.id}
              className="min-h-10"
            >
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Panel title="Product Performance" actions={menuAction}>
      {isPending ? (
        <LoadingRegion
          label="Loading product performance"
          className="space-y-3.5"
        >
          {Array.from({ length: INITIAL_COUNT }, (_, i) => (
            <div key={i} className="space-y-2.5">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </LoadingRegion>
      ) : isError ? (
        <ErrorState
          subject="product performance"
          error={error}
          onRetry={() => void refetch()}
          retrying={isRefetching}
        />
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No product sales yet"
          description="Items appear here after their first sale."
        />
      ) : (
        <>
          <ul className="space-y-3.5">
            {visible.map((product, index) => {
              const share =
                product.max_revenue > 0
                  ? (product.revenue / product.max_revenue) * 100
                  : 0;
              return (
                <li key={product.id}>
                  <div className="mb-3 flex items-baseline justify-between gap-3 text-[13px] leading-4.5">
                    <span className="min-w-0 truncate font-medium text-fg">
                      {product.name}
                    </span>
                    <span className="shrink-0 text-fg tabular-nums">
                      {formatCompactCurrency(product.revenue)}
                    </span>
                  </div>
                  <div
                    role="meter"
                    aria-label={`${product.name} revenue relative to top seller`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(share)}
                    className="h-2.5 overflow-hidden rounded-full bg-field"
                  >
                    <div
                      className="h-full rounded-full transition-[width] duration-300"
                      style={{
                        width: `${Math.max(4, share)}%`,
                        backgroundColor: rankColor(index),
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          {hidden > 0 && (
            <Button
              variant="ghost"
              onClick={() => setShowAll(!showAll)}
              aria-expanded={showAll}
              className="mt-5 min-h-11 self-start px-2 text-voca-ink hover:bg-hover hover:text-voca-ink"
            >
              {showAll ? "Show top 5 only" : `Show ${hidden} more products`}
            </Button>
          )}
        </>
      )}
    </Panel>
  );
}
