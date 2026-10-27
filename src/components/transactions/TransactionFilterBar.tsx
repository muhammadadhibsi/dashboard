import { ListFilter, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  selectHasActiveFilters,
  useFilterStore,
  type MethodFilter,
  type StatusFilter,
} from "@/store/useFilterStore";
import { PAYMENT_METHODS, TRANSACTION_STATUSES } from "@/types";
import { cn } from "@/utils/cn";
import { DateRangeFilter } from "./DateRangeFilter";

const STATUS_LABEL: Record<string, string> = {
  success: "Success",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

// Shared look for the filter bar controls: 42px tall, hairline border, recessed fill.
const CONTROL =
  "h-10 rounded-lg border-line bg-field text-sm md:text-sm dark:bg-field dark:hover:bg-hover hover:bg-hover";

function SelectField({
  label,
  value,
  onChange,
  allLabel,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          CONTROL,
          "data-[size=default]:h-10 min-w-36 px-3.5 text-sm",
          value !== "all" ? "border-voca/50 text-fg" : "text-muted",
        )}
      >
        <SelectValue placeholder={allLabel} />
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        <SelectItem value="all" className="min-h-10">
          {allLabel}
        </SelectItem>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="min-h-10"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function AdvancedAmountFilter() {
  const minAmount = useFilterStore((s) => s.minAmount);
  const maxAmount = useFilterStore((s) => s.maxAmount);
  const setMinAmount = useFilterStore((s) => s.setMinAmount);
  const setMaxAmount = useFilterStore((s) => s.setMaxAmount);

  const active = Boolean(minAmount || maxAmount);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={
            active
              ? "Advanced amount filters, active"
              : "Advanced amount filters"
          }
          title="Advanced amount filters"
          className={cn(
            "relative h-7.5 w-9 rounded-lg border-line bg-transparent pointer-coarse:size-11 dark:bg-transparent [&_svg:not([class*='size-'])]:size-3",
            active ? "border-voca/50 text-voca-ink" : "text-muted",
          )}
        >
          <ListFilter aria-hidden />
          {/* Marks a real state: an amount bound is applied but hidden inside the popover. */}
          {active && (
            <span
              aria-hidden
              className="absolute -top-1 -right-1 size-2 rounded-full bg-voca"
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-72 rounded-2xl p-4 shadow-pop"
      >
        <div className="flex items-center justify-between border-b pb-2.5">
          <span className="text-xs font-semibold tracking-wider text-muted uppercase">
            Amount Range
          </span>
          {active && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMinAmount("");
                setMaxAmount("");
              }}
              className="h-9 text-xs text-rose-ink hover:text-rose-ink"
            >
              <RotateCcw aria-hidden />
              Reset
            </Button>
          )}
        </div>

        <div className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="filter-min-amount" className="text-xs text-muted">
              Minimum Amount ($)
            </Label>
            <Input
              id="filter-min-amount"
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="Min ($0)"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="h-10 rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-max-amount" className="text-xs text-muted">
              Maximum Amount ($)
            </Label>
            <Input
              id="filter-max-amount"
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="Max ($10,000)"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="h-10 rounded-lg"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const STATUS_OPTIONS = TRANSACTION_STATUSES.map((s) => ({
  value: s,
  label: STATUS_LABEL[s] ?? s,
}));
const METHOD_OPTIONS = PAYMENT_METHODS.map((m) => ({ value: m, label: m }));

interface FilterBarProps {
  minDay?: string;
  maxDay?: string;
}

export function TransactionFilterBar({ minDay, maxDay }: FilterBarProps) {
  const search = useFilterStore((s) => s.search);
  const status = useFilterStore((s) => s.status);
  const method = useFilterStore((s) => s.method);
  const setSearch = useFilterStore((s) => s.setSearch);
  const setStatus = useFilterStore((s) => s.setStatus);
  const setMethod = useFilterStore((s) => s.setMethod);
  const resetFilters = useFilterStore((s) => s.resetFilters);
  const hasActive = useFilterStore(selectHasActiveFilters);

  return (
    <Card className="gap-0 rounded-xl border-line-soft bg-card-low p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative min-w-64 flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted"
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter by ID or Customer..."
            aria-label="Search transactions"
            className={cn(
              CONTROL,
              "pr-11 pl-10 placeholder:text-subtle [&::-webkit-search-cancel-button]:hidden",
            )}
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-0.5 size-10 -translate-y-1/2 text-muted"
            >
              <X aria-hidden />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <SelectField
            label="Filter by status"
            value={status}
            onChange={(val) => setStatus(val as StatusFilter)}
            allLabel="All Statuses"
            options={STATUS_OPTIONS}
          />
          <DateRangeFilter minDay={minDay} maxDay={maxDay} />
          <SelectField
            label="Filter by payment method"
            value={method}
            onChange={(val) => setMethod(val as MethodFilter)}
            allLabel="All Methods"
            options={METHOD_OPTIONS}
          />
          <AdvancedAmountFilter />
          {hasActive && (
            <Button
              variant="outline"
              onClick={resetFilters}
              className="h-10.5 rounded-lg border-line bg-transparent text-xs font-semibold text-rose-ink hover:text-rose-ink dark:bg-transparent"
            >
              <RotateCcw aria-hidden />
              Reset
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
