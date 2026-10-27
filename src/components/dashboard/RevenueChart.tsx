import { LineChart as LineChartIcon } from "lucide-react";
import { useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAllTransactions } from "@/api/transactions.queries";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Panel } from "@/components/common/Panel";
import { LoadingRegion, Skeleton } from "@/components/common/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/utils/cn";
import {
  formatCurrency,
  formatLongDay,
  formatTwoDigitDay,
} from "@/utils/formatters";
import {
  buildDailyRevenue,
  sumRevenue,
  type RevenuePoint,
} from "@/utils/revenue";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AXIS_TICK, CHART_COLORS, LINE_GLOW } from "@/utils/chartTheme";

const RANGES = [30, 90] as const;
type Range = (typeof RANGES)[number];

interface TooltipEntry {
  dataKey?: unknown;
  value?: unknown;
  payload?: RevenuePoint;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: readonly TooltipEntry[];
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="rounded-lg border border-subtle bg-tooltip px-3 py-2 shadow-pop">
      <p className="text-xs text-muted">{formatLongDay(point.date)}</p>
      <p className="mt-1 text-sm font-bold text-voca-ink tabular-nums">
        {formatCurrency(point.revenue)}
      </p>
      {point.previous !== undefined && (
        <p className="font-mono text-xs text-muted tabular-nums">
          Prev: {formatCurrency(point.previous)}
        </p>
      )}
    </div>
  );
}

interface DotProps {
  cx?: number;
  cy?: number;
  index?: number;
  payload?: RevenuePoint;
}

/** Marks only days with sales, so a lone spike reads as one real data point. */
function RevenueDot({ cx, cy, index, payload }: DotProps) {
  if (cx === undefined || cy === undefined || !payload?.revenue)
    return <g key={index} />;
  return (
    <circle
      key={index}
      cx={cx}
      cy={cy}
      r={3.5}
      fill={CHART_COLORS.voca}
      stroke={CHART_COLORS.surface}
      strokeWidth={1.5}
    />
  );
}

export function RevenueChart() {
  const { data, isPending, isError, error, refetch, isRefetching } =
    useAllTransactions();
  const reducedMotion = useReducedMotion();
  const [range, setRange] = useState<Range>(30);
  const [compare, setCompare] = useState(false);
  const gradientId = useId();
  const switchId = useId();

  const points = useMemo(
    () => buildDailyRevenue(data ?? [], range, compare),
    [data, range, compare],
  );
  const total = sumRevenue(points, "revenue");

  const controls = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div
        role="group"
        aria-label="Date range"
        className="flex rounded-md border border-line bg-surface-low p-1"
      >
        {RANGES.map((value) => (
          <Button
            key={value}
            variant="ghost"
            size="sm"
            aria-pressed={range === value}
            onClick={() => setRange(value)}
            className={cn(
              // Dark text on the green segment: the reference's white label fails AA (2.4:1).
              "h-6 rounded-sm px-5 text-xs font-medium pointer-coarse:h-11",
              range === value
                ? "bg-voca text-bg hover:bg-voca hover:text-bg"
                : "text-muted hover:bg-hover hover:text-fg",
            )}
          >
            {value === 30 ? "Last 30 Days" : "90 Days"}
          </Button>
        ))}
      </div>
      <div className="flex min-h-11 items-center gap-3">
        <Switch
          id={switchId}
          size="lg"
          checked={compare}
          onCheckedChange={setCompare}
        />
        <Label
          htmlFor={switchId}
          className="cursor-pointer text-xs font-normal text-muted"
        >
          Compare to previous
        </Label>
      </div>
    </div>
  );

  return (
    <Panel
      title="Revenue Analytics"
      description="Daily transaction volume across all platforms"
      actions={controls}
      titleClassName="text-2xl leading-8"
    >
      {isPending ? (
        <LoadingRegion label="Loading revenue chart" className="space-y-4">
          <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-xl border border-line bg-surface-low p-4">
            <div className="flex h-full flex-col justify-between">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-px w-full bg-line/40" />
              ))}
            </div>
          </div>
          <div className="flex justify-between px-3">
            {["Oct 01", "Oct 07", "Oct 14", "Oct 21", "Oct 28", "Nov 01"].map(
              (tick) => (
                <Skeleton key={tick} className="h-3 w-10" />
              ),
            )}
          </div>
        </LoadingRegion>
      ) : isError ? (
        <ErrorState
          subject="transactions for the revenue chart"
          error={error}
          onRetry={() => void refetch()}
          retrying={isRefetching}
        />
      ) : points.length === 0 ? (
        <EmptyState
          icon={LineChartIcon}
          title="No transactions yet"
          description="Revenue appears here once the API returns successful transactions."
        />
      ) : (
        <>
          {compare && (
            <ul
              aria-label="Legend"
              className="mb-3 flex flex-wrap gap-4 text-xs text-muted"
            >
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-0.5 w-4 rounded bg-voca" />
                This period
              </li>
              <li className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="w-4 border-t-2 border-dashed border-muted"
                />
                Previous {range} days
              </li>
            </ul>
          )}

          <div
            role="img"
            aria-label={`Area chart of daily revenue over the last ${range} days, total ${formatCurrency(total)}`}
            className="h-64 sm:h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={points}
                margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={CHART_COLORS.voca}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor={CHART_COLORS.voca}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatTwoDigitDay}
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={32}
                  tickMargin={8}
                />
                {/* The reference draws grid lines only; exact values live in the tooltip and table. */}
                <YAxis hide allowDecimals={false} />
                <Tooltip
                  content={ChartTooltip}
                  cursor={{
                    stroke: CHART_COLORS.cursor,
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                />
                {compare && (
                  <Line
                    type="linear"
                    dataKey="previous"
                    stroke={CHART_COLORS.muted}
                    strokeOpacity={0.7}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                )}
                {/* Linear segments: monotone smoothing would invent curves between sparse days. */}
                <Area
                  isAnimationActive={!reducedMotion}
                  type="linear"
                  dataKey="revenue"
                  stroke={CHART_COLORS.voca}
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                  dot={RevenueDot}
                  activeDot={{
                    r: 5,
                    fill: CHART_COLORS.voca,
                    stroke: CHART_COLORS.surface,
                    strokeWidth: 2,
                  }}
                  style={{ filter: LINE_GLOW }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <table className="sr-only">
            <caption>Daily revenue, last {range} days</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Revenue</th>
                {compare && <th scope="col">Previous period</th>}
              </tr>
            </thead>
            <tbody>
              {points
                .filter(
                  (point) => point.revenue > 0 || (point.previous ?? 0) > 0,
                )
                .map((point) => (
                  <tr key={point.date}>
                    <td>{formatLongDay(point.date)}</td>
                    <td>{formatCurrency(point.revenue)}</td>
                    {compare && <td>{formatCurrency(point.previous ?? 0)}</td>}
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </Panel>
  );
}
