import { UserRound } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAcquisition } from "@/api/customers.queries";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Panel } from "@/components/common/Panel";
import { LoadingRegion, Skeleton } from "@/components/common/SkeletonLoader";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { CustomerAcquisition } from "@/types";
import { formatNumber } from "@/utils/formatters";

interface TooltipPayload {
  payload?: CustomerAcquisition;
}

function AcquisitionTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: readonly TooltipPayload[];
}) {
  const data = payload?.[0]?.payload;
  if (!active || !data) return null;
  return (
    <div className="space-y-1 rounded-lg border border-line-soft bg-tooltip p-2.5 text-xs shadow-pop">
      <p className="font-semibold text-fg">{data.month}</p>
      <p className="text-violet-ink">
        New:{" "}
        <span className="font-mono text-fg tabular-nums">
          {formatNumber(data.new_users)}
        </span>
      </p>
      <p className="text-voca-ink">
        Returning:{" "}
        <span className="font-mono text-fg tabular-nums">
          {formatNumber(data.returning_users)}
        </span>
      </p>
    </div>
  );
}

export function AcquisitionChart() {
  const { data, isPending, isError, error, refetch, isRefetching } =
    useAcquisition();
  const reducedMotion = useReducedMotion();

  const months = data ?? [];

  const legend = (
    <ul
      aria-label="Legend"
      className="flex items-center gap-3.5 text-xs text-muted"
    >
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="size-2.5 rounded-xs bg-violet-ink" />
        <span>New</span>
      </li>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="size-2.5 rounded-xs bg-voca-ink" />
        <span>Returning</span>
      </li>
    </ul>
  );

  return (
    <Panel
      title="User Acquisition & Retention"
      titleClassName="text-lg leading-6 font-semibold"
      actions={legend}
      className="flex flex-col justify-between rounded-lg border-line-soft bg-card-low p-5 lg:col-span-2"
    >
      {isPending ? (
        <LoadingRegion label="Loading acquisition trend" className="space-y-4">
          <div className="h-52.5 w-full overflow-hidden rounded-lg border border-line bg-surface-low p-2">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
          <div className="flex justify-between px-3">
            {["JAN", "FEB", "MAR", "APR", "MAY", "JUN"].map((m) => (
              <Skeleton key={m} className="h-3.5 w-8" />
            ))}
          </div>
        </LoadingRegion>
      ) : isError ? (
        <ErrorState
          subject="acquisition trend"
          error={error}
          onRetry={() => void refetch()}
          retrying={isRefetching}
        />
      ) : months.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="No acquisition data yet"
          description="Monthly sign-ups will be charted once the first month closes."
        />
      ) : (
        <div className="flex flex-1 flex-col justify-between">
          <div
            role="img"
            aria-label="Area chart of new and returning users per month"
            className="h-52.5 w-full overflow-hidden rounded-lg border border-line bg-surface-low p-1"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={months}
                margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient
                    id="grad-new-users"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#c0c1ff" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#c0c1ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="grad-ret-users"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4edea3" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4edea3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#27272a"
                  strokeDasharray="none"
                  vertical={false}
                  opacity={0.6}
                />
                <XAxis dataKey="month" hide />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip content={AcquisitionTooltip} />
                <Area
                  isAnimationActive={!reducedMotion}
                  type="monotone"
                  dataKey="new_users"
                  name="New Users"
                  stroke="#c0c1ff"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  fill="url(#grad-new-users)"
                />
                <Area
                  isAnimationActive={!reducedMotion}
                  type="monotone"
                  dataKey="returning_users"
                  name="Returning Users"
                  stroke="#4edea3"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  fill="url(#grad-ret-users)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Month labels below the chart box matching Figma */}
          <div className="mt-2 flex justify-between px-3 text-xs font-bold tracking-wider text-muted uppercase">
            {months.map((m) => (
              <span key={m.id}>{m.month.slice(0, 3).toUpperCase()}</span>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}
