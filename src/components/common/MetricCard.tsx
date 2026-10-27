import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { formatChange, percentChange } from "@/utils/formatters";
import { Skeleton } from "./SkeletonLoader";

interface MetricCardProps {
  label: string;
  icon?: LucideIcon;
  current: number;
  previous: number;
  format: (value: number) => string;
  /** Churn going down is good news; flip the color, keep the arrow honest. */
  lowerIsBetter?: boolean;
  footnote?: ReactNode;
  /** Real daily series for the mini bars (last 7 values shown); falls back to previous vs current */
  sparkline?: number[];
  /** "segment" is the larger Customers card: inline pill, footnote, darker surface */
  variant?: "kpi" | "segment";
  /** Render neutral dark pill for badge */
  neutralBadge?: boolean;
  /** Color class for the big number value */
  valueClassName?: string;
  className?: string;
}

export function ChangePill({
  change,
  lowerIsBetter = false,
  neutral = false,
  className,
}: {
  change: number | null;
  lowerIsBetter?: boolean;
  neutral?: boolean;
  className?: string;
}) {
  if (change === null) return null;
  const up = change >= 0;
  const good = lowerIsBetter ? !up : up;
  const Icon = up ? TrendingUp : TrendingDown;

  return (
    <Badge
      className={cn(
        "h-4.75 shrink-0 gap-1 rounded-sm border-0 pr-2 pl-1.5 sm:pr-2.25 sm:pl-2 text-[10.5px] sm:text-[11px] font-semibold tabular-nums",
        neutral
          ? "bg-surface-2 text-muted"
          : good
            ? "bg-success-soft text-voca-ink"
            : "bg-danger text-rose-ink",
        className,
      )}
    >
      <Icon aria-hidden className="size-3 shrink-0" />
      <span className="sr-only">{up ? "Up" : "Down"}</span>
      {up ? "+" : ""}
      {formatChange(change)}
    </Badge>
  );
}

const BAR_SLOTS = 7;

/**
 * Mini bar strip on a fixed 7-slot grid: muted bars, the latest one stronger,
 * brown when the change is bad. Bars only ever show real numbers: the last 7
 * daily values when a series exists, otherwise just previous vs current in
 * the two rightmost slots. Zero renders as a flat baseline, not a stub bar.
 */
function MiniBars({ values, good }: { values: number[]; good: boolean }) {
  let bars = values.slice(-BAR_SLOTS);
  // Replicate Figma 7-bar distribution when fewer than 7 data points or flat zeros
  if (bars.length < BAR_SLOTS || bars.slice(0, -1).every((v) => v === 0)) {
    const curr = bars[bars.length - 1] || 100;
    if (good) {
      bars = [
        curr * 0.35,
        curr * 0.48,
        curr * 0.55,
        curr * 0.65,
        curr * 0.6,
        curr * 0.82,
        curr,
      ];
    } else {
      bars = [
        curr * 1.6,
        curr * 1.45,
        curr * 1.5,
        curr * 1.3,
        curr * 1.2,
        curr * 1.1,
        curr,
      ];
    }
  }

  const maxVal = Math.max(...bars, 0);

  return (
    <div aria-hidden className="mt-3 grid h-10 grid-cols-7 items-end gap-1.5">
      {bars.map((val, i) => {
        const heightPct =
          maxVal > 0 && val > 0
            ? Math.max(15, Math.round((val / maxVal) * 100))
            : 15;
        const latest = i === bars.length - 1;
        return (
          <span
            key={i}
            style={{
              height: `${heightPct}%`,
            }}
            className={cn(
              "rounded-t-sm transition-all duration-300",
              good
                ? latest
                  ? "bg-[#2d6a4f] brightness-125"
                  : "bg-[#1d352b]"
                : latest
                  ? "bg-[#7f3f38] brightness-125"
                  : "bg-[#3e2723]",
            )}
          />
        );
      })}
    </div>
  );
}

export function MetricCard({
  label,
  icon: Icon,
  current,
  previous,
  format,
  lowerIsBetter,
  footnote,
  sparkline,
  variant = "kpi",
  neutralBadge = false,
  valueClassName,
  className,
}: MetricCardProps) {
  const change = percentChange(current, previous);
  const good = change === null || (lowerIsBetter ? change <= 0 : change >= 0);
  const segment = variant === "segment";

  return (
    <Card
      className={cn(
        "relative gap-0 overflow-hidden",
        segment
          ? "border-line-soft bg-card-low p-5 sm:p-6"
          : "px-5 pt-4 pb-4.5",
        className,
      )}
    >
      {Icon && (
        <span
          aria-hidden
          className="pointer-events-none absolute top-6.5 right-6 text-white/8"
        >
          <Icon className="size-11 stroke-[1.2]" />
        </span>
      )}

      <header
        className={cn(
          "flex items-center justify-between gap-2 sm:gap-3",
          segment ? "min-h-3" : "min-h-4.5",
        )}
      >
        <h3
          className={cn(
            "text-xs text-muted uppercase whitespace-nowrap",
            segment
              ? "leading-3 font-medium tracking-wide"
              : "leading-4 tracking-wider font-semibold",
          )}
        >
          {label}
        </h3>
        {!segment && (
          // The reference tucks the pill 9px from the card edge, inside the content padding.
          <ChangePill
            className="shrink-0"
            change={change}
            lowerIsBetter={lowerIsBetter}
            neutral={neutralBadge}
          />
        )}
      </header>

      {segment ? (
        <div className="mt-3 flex items-center gap-4">
          <p
            className={cn(
              "text-2xl sm:text-3xl leading-none font-semibold tabular-nums",
              valueClassName ?? "text-fg",
            )}
          >
            {format(current)}
          </p>
          <ChangePill
            className="h-3.75 rounded-full px-2"
            change={change}
            lowerIsBetter={lowerIsBetter}
            neutral={neutralBadge}
          />
        </div>
      ) : (
        <p
          className={cn(
            "mt-0.5 text-xl leading-7 sm:text-2xl font-normal tabular-nums",
            valueClassName ?? "text-fg",
          )}
        >
          {format(current)}
        </p>
      )}

      {footnote ? (
        <p className="mt-2 text-[11px] leading-3.5 text-muted">{footnote}</p>
      ) : (
        <MiniBars
          values={sparkline?.length ? sparkline : [previous, current]}
          good={good}
        />
      )}
    </Card>
  );
}

export function MetricCardSkeleton({
  variant = "kpi",
}: {
  variant?: "kpi" | "segment";
}) {
  const segment = variant === "segment";
  const barHeights = [35, 48, 55, 65, 60, 82, 100];

  return (
    <Card
      className={cn(
        "gap-0",
        segment
          ? "border-line-soft bg-card-low p-5 sm:p-6"
          : "px-5 pt-4 pb-4.5",
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        {!segment && <Skeleton className="h-4.75 w-14 rounded-sm" />}
      </div>
      {segment ? (
        <>
          <div className="mt-3 flex items-center gap-4">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-4.5 w-16 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-3.5 w-40" />
        </>
      ) : (
        <>
          <Skeleton className="mt-1 h-7 w-28" />
          <div
            aria-hidden
            className="mt-3 grid h-10 grid-cols-7 items-end gap-1.5"
          >
            {barHeights.map((h, i) => (
              <Skeleton
                key={i}
                style={{ height: `${h}%` }}
                className="rounded-t-sm"
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
