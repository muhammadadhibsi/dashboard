import { format, parseISO } from "date-fns";
import { CalendarDays, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFilterStore } from "@/store/useFilterStore";
import { cn } from "@/utils/cn";
import { formatDateRangeLabel } from "@/utils/dateRange";

interface DateRangeFilterProps {
  minDay?: string;
  maxDay?: string;
}

export function DateRangeFilter({ minDay, maxDay }: DateRangeFilterProps) {
  const dateFrom = useFilterStore((s) => s.dateFrom);
  const dateTo = useFilterStore((s) => s.dateTo);
  const setDateRange = useFilterStore((s) => s.setDateRange);
  const [open, setOpen] = useState(false);

  const selectedRange = useMemo<DateRange | undefined>(() => {
    if (!dateFrom && !dateTo) return undefined;
    return {
      from: dateFrom ? parseISO(dateFrom) : undefined,
      to: dateTo ? parseISO(dateTo) : undefined,
    };
  }, [dateFrom, dateTo]);

  const label = formatDateRangeLabel(dateFrom, dateTo);
  const active = Boolean(dateFrom || dateTo);

  const handleSelect = (range: DateRange | undefined) => {
    const fromStr = range?.from ? format(range.from, "yyyy-MM-dd") : "";
    const toStr = range?.to ? format(range.to, "yyyy-MM-dd") : "";
    setDateRange(fromStr, toStr);
  };

  const handleClear = () => {
    setDateRange("", "");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label="Filter by date range"
          className={cn(
            "h-10.5 justify-start gap-2.5 rounded-lg border-line bg-field px-4 text-sm font-normal dark:border-line dark:bg-field",
            active ? "border-voca/50 text-fg" : "text-muted",
          )}
        >
          <CalendarDays
            aria-hidden="true"
            className={cn(
              "size-4.5 shrink-0",
              active ? "text-voca-ink" : "text-muted",
            )}
          />
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-auto rounded-2xl p-4 shadow-pop"
      >
        <div className="flex items-center justify-between border-b border-line pb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Select Date Range
          </span>
          {active && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-9 text-xs text-rose-ink hover:text-rose-ink"
            >
              <RotateCcw aria-hidden="true" />
              Reset
            </Button>
          )}
        </div>

        <div className="pt-2 text-fg [&_.rdp-root]:text-fg [&_.rdp-day_button]:text-fg [&_.rdp-selected]:bg-voca [&_.rdp-selected]:text-bg [&_.rdp-range_middle]:bg-voca/20 [&_.rdp-range_middle]:text-fg [&_.rdp-chevron]:fill-muted">
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={handleSelect}
            defaultMonth={
              selectedRange?.from ?? (maxDay ? parseISO(maxDay) : new Date())
            }
            disabled={[
              ...(minDay ? [{ before: parseISO(minDay) }] : []),
              ...(maxDay ? [{ after: parseISO(maxDay) }] : []),
            ]}
          />
        </div>

        <div className="mt-3 flex items-center justify-end gap-2 border-t border-line pt-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="h-10 rounded-lg text-xs font-semibold"
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
