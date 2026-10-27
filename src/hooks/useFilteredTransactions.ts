import { useMemo } from "react";
import { useAllTransactions } from "@/api/transactions.queries";
import { useFilterStore } from "@/store/useFilterStore";
import { toLocalDayKey } from "@/utils/dateRange";
import { compareNewestFirst } from "@/utils/transactions";
import { useDebouncedValue } from "./useDebouncedValue";

export function useFilteredTransactions() {
  const query = useAllTransactions();
  const search = useFilterStore((s) => s.search);
  const status = useFilterStore((s) => s.status);
  const method = useFilterStore((s) => s.method);
  const dateFrom = useFilterStore((s) => s.dateFrom);
  const dateTo = useFilterStore((s) => s.dateTo);
  const minAmount = useFilterStore((s) => s.minAmount);
  const maxAmount = useFilterStore((s) => s.maxAmount);
  const debouncedSearch = useDebouncedValue(search.trim().toLowerCase());

  const filtered = useMemo(() => {
    const rows = query.data ?? [];
    const minVal = minAmount !== "" ? Number(minAmount) : null;
    const maxVal = maxAmount !== "" ? Number(maxAmount) : null;

    return rows
      .filter((tx) => {
        if (status !== "all" && tx.status !== status) return false;
        if (method !== "all" && tx.method !== method) return false;
        const day = toLocalDayKey(tx.date);
        if (dateFrom && day < dateFrom) return false;
        if (dateTo && day > dateTo) return false;
        if (minVal !== null && !Number.isNaN(minVal) && tx.amount < minVal)
          return false;
        if (maxVal !== null && !Number.isNaN(maxVal) && tx.amount > maxVal)
          return false;
        if (!debouncedSearch) return true;
        return (
          tx.transaction_id.toLowerCase().includes(debouncedSearch) ||
          tx.customer_name.toLowerCase().includes(debouncedSearch) ||
          tx.customer_email.toLowerCase().includes(debouncedSearch)
        );
      })
      .sort(compareNewestFirst);
  }, [
    query.data,
    status,
    method,
    dateFrom,
    dateTo,
    minAmount,
    maxAmount,
    debouncedSearch,
  ]);

  return { query, filtered };
}
