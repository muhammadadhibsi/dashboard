import { Copy, Eye, MoreVertical, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useTopSpenders } from "@/api/customers.queries";
import { Avatar } from "@/components/common/Avatar";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Pagination } from "@/components/common/Pagination";
import { LoadingRegion, Skeleton } from "@/components/common/SkeletonLoader";
import { SegmentBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCopy } from "@/hooks/useCopy";
import { useFilterStore } from "@/store/useFilterStore";
import { useUIStore } from "@/store/useUIStore";
import type { TopSpender } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { getInitials } from "@/utils/initials";
import { CustomerDetailDialog } from "./CustomerDetailDialog";

const DEFAULT_PAGE_SIZE = 5;
const ALL_PAGE_SIZE = 20;

function SpenderActions({ customer }: { customer: TopSpender }) {
  const setSelectedCustomer = useUIStore((s) => s.setSelectedCustomer);
  const { copy } = useCopy();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Actions for ${customer.customer_name}`}
          className="size-8 text-muted data-[state=open]:bg-hover data-[state=open]:text-fg [&_svg:not([class*='size-'])]:size-4"
        >
          <MoreVertical aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onSelect={() => setSelectedCustomer(customer)}
          className="min-h-10"
        >
          <Eye aria-hidden className="mr-2 size-4 text-muted" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => copy("email", customer.email)}
          className="min-h-10"
        >
          <Copy aria-hidden className="mr-2 size-4 text-muted" />
          Copy Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const CUST_TH =
  "h-10 px-5 text-left text-[11px] font-semibold text-muted uppercase tracking-wider whitespace-nowrap";
const CUST_TD = "px-5 py-3 align-middle whitespace-normal text-xs";

export function TopSpendersTable() {
  const page = useFilterStore((s) => s.page);
  const setPage = useFilterStore((s) => s.setPage);
  const [showAll, setShowAll] = useState(false);

  const pageSize = showAll ? ALL_PAGE_SIZE : DEFAULT_PAGE_SIZE;
  const { data, isPending, isError, error, refetch, isRefetching } =
    useTopSpenders(page, pageSize);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [page, totalPages, setPage]);

  const rows = data?.data ?? [];

  return (
    <>
      <Card className="gap-0 overflow-hidden rounded-lg border-line-soft bg-card-low py-0">
        <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
          <CardTitle className="text-lg leading-6 font-semibold text-fg">
            Top Spenders
          </CardTitle>
          <CardAction className="self-center">
            <Button
              variant="link"
              onClick={() => {
                setShowAll(!showAll);
                setPage(1);
              }}
              className="h-auto p-0 text-xs font-medium text-violet-ink hover:text-fg"
            >
              {showAll ? "Show Top 5" : "View all customers"}
            </Button>
          </CardAction>
        </CardHeader>

        <div className="overflow-x-auto">
          {isPending ? (
            <LoadingRegion
              label="Loading top spenders"
              className="divide-y divide-line"
            >
              <div className="flex items-center justify-between bg-surface-low px-5 py-2.5 border-y border-line">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-8 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="size-8 rounded-md" />
                </div>
              ))}
            </LoadingRegion>
          ) : isError ? (
            <div className="p-5">
              <ErrorState
                subject="top spenders"
                error={error}
                onRetry={() => void refetch()}
                retrying={isRefetching}
              />
            </div>
          ) : rows.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={Trophy}
                title="No top spenders found"
                description="Customers will appear here once purchases are made."
              />
            </div>
          ) : (
            <Table className="w-full min-w-160">
              <TableCaption className="sr-only">
                Top spending customers
              </TableCaption>
              <TableHeader>
                <TableRow className="border-y border-line bg-surface-low hover:bg-surface-low">
                  <TableHead className={CUST_TH}>Customer</TableHead>
                  <TableHead className={CUST_TH}>
                    LTV (Lifetime Value)
                  </TableHead>
                  <TableHead className={CUST_TH}>Last Active</TableHead>
                  <TableHead className={CUST_TH}>Segment</TableHead>
                  <TableHead className={`${CUST_TH} text-right`}>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="border-b border-line hover:bg-hover/30"
                  >
                    <TableCell className={CUST_TD}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={getInitials(customer.customer_name)}
                          seed={customer.email}
                          src={customer.avatar}
                          className="size-8 rounded-full"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-normal text-fg">
                            {customer.customer_name}
                          </p>
                          <p className="truncate text-sm text-muted">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className={`${CUST_TD} text-left font-mono text-sm font-normal text-voca-ink tabular-nums`}
                    >
                      {formatCurrency(customer.ltv)}
                    </TableCell>
                    <TableCell className={`${CUST_TD} text-sm text-muted`}>
                      {customer.last_active}
                    </TableCell>
                    <TableCell className={CUST_TD}>
                      <SegmentBadge segment={customer.segment} />
                    </TableCell>
                    <TableCell className={`${CUST_TD} text-right`}>
                      <SpenderActions customer={customer} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {total > 0 && (
          <Pagination
            variant="compact"
            page={page}
            pageSize={pageSize}
            total={total}
            noun="customers"
            onPageChange={setPage}
            busy={isRefetching}
          />
        )}
      </Card>

      <CustomerDetailDialog />
    </>
  );
}
