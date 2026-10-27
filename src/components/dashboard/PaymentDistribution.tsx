import { CreditCard, ListFilter } from "lucide-react";
import { useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { usePaymentDistribution } from "@/api/dashboard.queries";
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
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { PaymentDistribution as Slice } from "@/types";
import { paymentColor } from "@/utils/chartTheme";
import { cn } from "@/utils/cn";

// Color follows the method name, not the row index, so filtering never repaints a slice.
const colorFor = (slice: Slice) => paymentColor(slice.method);

interface TooltipEntry {
  payload?: Slice;
}

function SliceTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: readonly TooltipEntry[];
}) {
  const slice = payload?.[0]?.payload;
  if (!active || !slice) return null;
  return (
    <div className="rounded-lg border border-subtle bg-tooltip px-3 py-2 text-sm shadow-pop">
      <span className="text-muted">{slice.method}</span>{" "}
      <span className="font-semibold text-fg tabular-nums">
        {slice.percentage}%
      </span>
    </div>
  );
}

export function PaymentDistribution() {
  const { data, isPending, isError, error, refetch, isRefetching } =
    usePaymentDistribution();
  const reducedMotion = useReducedMotion();
  const [selectedMethod, setSelectedMethod] = useState<string>("all");

  const slices = data ?? [];
  const top = slices.reduce<Slice | undefined>(
    (best, slice) =>
      !best || slice.percentage > best.percentage ? slice : best,
    undefined,
  );

  const activeSlice =
    selectedMethod !== "all"
      ? (slices.find((s) => s.method === selectedMethod) ?? top)
      : top;

  const chartData = slices.map((slice) => {
    const baseColor = colorFor(slice);
    const isHighlighted =
      selectedMethod === "all" || selectedMethod === slice.method;
    return {
      ...slice,
      fill: isHighlighted ? baseColor : `${baseColor}40`,
    };
  });

  const filterAction = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={
            selectedMethod === "all"
              ? "Filter payment methods"
              : `Filter payment methods, ${selectedMethod} highlighted`
          }
          className={cn(
            "size-11 text-muted hover:bg-transparent hover:text-fg data-[state=open]:text-fg [&_svg:not([class*='size-'])]:size-6",
            selectedMethod !== "all" && "text-voca-ink",
          )}
        >
          <ListFilter aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs tracking-wider text-muted uppercase">
          Highlight method
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedMethod}
          onValueChange={setSelectedMethod}
        >
          <DropdownMenuRadioItem value="all" className="min-h-10">
            All Methods
          </DropdownMenuRadioItem>
          {slices.map((slice) => (
            <DropdownMenuRadioItem
              key={slice.id}
              value={slice.method}
              className="min-h-10"
            >
              {slice.method}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Panel title="Payment Distribution" actions={filterAction}>
      {isPending ? (
        <LoadingRegion
          label="Loading payment distribution"
          className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2"
        >
          <div className="relative size-44 shrink-0">
            <Skeleton className="size-full rounded-full" />
            <div className="absolute inset-7 rounded-full bg-card-low" />
          </div>
          <div className="w-full max-w-xs space-y-3.5">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-2.5 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>
        </LoadingRegion>
      ) : isError ? (
        <ErrorState
          subject="payment distribution"
          error={error}
          onRetry={() => void refetch()}
          retrying={isRefetching}
        />
      ) : slices.length === 0 || !top ? (
        <EmptyState
          icon={CreditCard}
          title="No payments recorded"
          description="The split appears after the first paid order."
        />
      ) : (
        <div className="flex flex-1 flex-col sm:flex-row items-center justify-around gap-6 py-2">
          <div
            role="img"
            aria-label={`Donut chart. ${slices.map((s) => `${s.method} ${s.percentage}%`).join(", ")}`}
            className="relative size-44 shrink-0"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  isAnimationActive={!reducedMotion}
                  data={chartData}
                  dataKey="percentage"
                  nameKey="method"
                  innerRadius={54}
                  outerRadius={76}
                  stroke="var(--color-bg)"
                  strokeWidth={3}
                  paddingAngle={1}
                  startAngle={90}
                  endAngle={-270}
                />

                <Tooltip content={SliceTooltip} />
              </PieChart>
            </ResponsiveContainer>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 grid place-content-center text-center"
            >
              <p className="text-[11px] leading-4 font-semibold text-muted">
                {selectedMethod === "all" ? "Top Method" : "Selected"}
              </p>
              <p className="text-lg leading-6 font-bold text-violet-ink">
                {activeSlice?.method ?? top.method}
              </p>
            </div>
          </div>

          <ul className="w-full flex-1">
            {slices.map((slice) => {
              const isSelected =
                selectedMethod === "all" || selectedMethod === slice.method;
              return (
                <li
                  key={slice.id}
                  className={cn(
                    "flex h-8.5 items-center gap-3 transition-opacity",
                    !isSelected && "opacity-40",
                  )}
                >
                  <span
                    aria-hidden
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: colorFor(slice) }}
                  />
                  <span className="flex-1 text-sm text-fg">{slice.method}</span>
                  <span className="text-base text-muted tabular-nums">
                    {slice.percentage}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Panel>
  );
}
