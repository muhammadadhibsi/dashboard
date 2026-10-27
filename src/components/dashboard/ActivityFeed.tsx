import { BellOff, History } from "lucide-react";
import {
  ACTIVITY_ICONS,
  ACTIVITY_STYLES,
} from "@/components/common/activityMeta";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import {
  LoadingRegion,
  SkeletonRows,
} from "@/components/common/SkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useActivityState } from "@/hooks/useActivityState";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/utils/cn";

const SEVERITY_LABEL = {
  info: "Info",
  success: "Success",
  warning: "Warning",
  danger: "Critical",
} as const;

// The reference shows four events; the rest stay reachable via the bell popover.
const VISIBLE_COUNT = 4;

export function ActivityFeed() {
  const { query, visible } = useActivityState();
  const clearActivity = useUIStore((s) => s.clearActivity);
  const restoreActivity = useUIStore((s) => s.restoreActivity);
  const clearedCount = useUIStore((s) => s.clearedActivityIds.length);

  const items = visible.slice(0, VISIBLE_COUNT);

  return (
    <Card
      id="activity"
      tabIndex={-1}
      role="region"
      aria-labelledby="activity-title"
      className="scroll-mt-24 gap-5 py-0 focus:outline-none"
    >
      <CardHeader className="px-5 py-4">
        <CardTitle
          id="activity-title"
          role="heading"
          aria-level={2}
          className="text-lg leading-6 font-semibold text-fg"
        >
          Activity Feed
        </CardTitle>
        <CardAction>
          <Badge className="rounded-sm border-0 bg-tag px-2 py-0.5 text-[10px] font-bold tracking-wider text-violet-ink">
            LIVE
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="px-5">
        {query.isPending ? (
          <LoadingRegion label="Loading activity">
            <SkeletonRows rows={4} />
          </LoadingRegion>
        ) : query.isError ? (
          <ErrorState
            subject="the activity feed"
            error={query.error}
            onRetry={() => void query.refetch()}
            retrying={query.isRefetching}
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={clearedCount > 0 ? History : BellOff}
            title={clearedCount > 0 ? "History cleared" : "No activity yet"}
            description={
              clearedCount > 0
                ? `${clearedCount} events hidden on this device.`
                : "Payouts, alerts, and security events will appear here."
            }
            action={
              clearedCount > 0 && (
                <Button
                  variant="outline"
                  onClick={restoreActivity}
                  className="min-h-10 border-line text-xs"
                >
                  Restore history
                </Button>
              )
            }
          />
        ) : (
          <ol>
            {items.map((item, index) => {
              const Icon = ACTIVITY_ICONS[item.type];
              const last = index === items.length - 1;
              return (
                <li key={item.id} className="flex gap-4">
                  {/* Icon pill plus the connector down to the next event. */}
                  <div className="flex w-8 shrink-0 flex-col items-center">
                    <span
                      className={cn(
                        "grid h-5 w-8 place-items-center rounded-full",
                        item.type === "org" && "h-8",
                        ACTIVITY_STYLES[item.type],
                      )}
                    >
                      <Icon aria-hidden className="size-3" />
                      <span className="sr-only">
                        {SEVERITY_LABEL[item.severity]}
                      </span>
                    </span>
                    {!last && (
                      <span aria-hidden className="my-2 w-px flex-1 bg-line" />
                    )}
                  </div>
                  <div className={cn("min-w-0 flex-1", !last && "pb-4.5")}>
                    <p className="text-sm leading-5 font-medium break-words text-fg">
                      {item.title}
                    </p>
                    <p className="text-xs leading-4 break-words text-muted">
                      {item.description} • {item.time}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>

      {visible.length > 0 && (
        <CardFooter className="px-5 pb-4">
          <Button
            variant="outline"
            onClick={() => clearActivity(visible.map((item) => item.id))}
            className="h-8.5 w-full rounded-lg border-line bg-transparent text-xs font-medium text-fg pointer-coarse:h-11 hover:bg-hover dark:border-line dark:bg-transparent dark:hover:bg-hover"
          >
            Clear All History
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
