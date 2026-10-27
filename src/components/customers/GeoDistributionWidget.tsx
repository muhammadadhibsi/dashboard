import { Globe2 } from "lucide-react";
import { useId } from "react";
import { useGeoDistribution } from "@/api/customers.queries";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Panel } from "@/components/common/Panel";
import { LoadingRegion, Skeleton } from "@/components/common/SkeletonLoader";

const REGION_COLORS: Record<string, string> = {
  "SE Asia": "#c0c1ff",
  "North America": "#4edea3",
  Europe: "#ddb7ff",
};

export function GeoDistributionWidget() {
  const { data, isPending, isError, error, refetch, isRefetching } =
    useGeoDistribution();
  const rawListId = useId();

  const regions = data ?? [];
  // Figma design shows only the top 3 regions: SE Asia, North America, Europe.
  const topRegions = regions.slice(0, 3);

  return (
    <Panel
      title="Geographical Map"
      titleClassName="text-lg leading-6 font-semibold"
      className="flex flex-col justify-between rounded-lg border-line-soft bg-card-low p-5"
    >
      {isPending ? (
        <LoadingRegion
          label="Loading geographic distribution"
          className="space-y-4"
        >
          <div className="h-38.75 w-full overflow-hidden rounded-lg border border-line bg-surface-low">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="space-y-3.5">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-1.5 w-24 rounded-full" />
                <Skeleton className="h-4 w-9" />
              </div>
            ))}
          </div>
        </LoadingRegion>
      ) : isError ? (
        <ErrorState
          subject="geographic distribution"
          error={error}
          onRetry={() => void refetch()}
          retrying={isRefetching}
        />
      ) : regions.length === 0 ? (
        <EmptyState
          icon={Globe2}
          title="No regional data yet"
          description="Customer regions will appear here as users register."
        />
      ) : (
        <div className="flex flex-1 flex-col justify-between">
          {/* Authentic raster map asset cropped directly from the Figma design */}
          <div className="relative mb-4 overflow-hidden rounded-lg border border-line bg-surface-low">
            <img
              src="/world-map.webp"
              alt="World map showing regional user distribution"
              className="h-38.75 w-full object-cover"
              width={1059}
              height={688}
            />
          </div>

          <ul id={rawListId} className="space-y-3.5">
            {topRegions.map((region) => {
              const color = REGION_COLORS[region.region] ?? "#c7c4d7";
              return (
                <li
                  key={region.id}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="w-28 shrink-0 truncate text-xs font-normal text-muted">
                    {region.region}
                  </span>
                  <div
                    role="progressbar"
                    aria-label={`${region.region} share`}
                    aria-valuenow={region.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-surface-2"
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, region.percentage)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <span className="w-9 shrink-0 text-right text-xs font-normal text-fg tabular-nums">
                    {region.percentage}%
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
