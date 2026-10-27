import { create } from "zustand";
import type { PaymentMethod, TransactionStatus } from "@/types";

export type StatusFilter = TransactionStatus | "all";
export type MethodFilter = PaymentMethod | "all";

interface FilterState {
  // Transactions table (client-side filtering + pagination)
  search: string;
  status: StatusFilter;
  method: MethodFilter;
  /** YYYY-MM-DD, inclusive, empty = open-ended */
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
  page: number;

  // Top spenders table (server-side pagination)
  spendersPage: number;

  setSearch: (search: string) => void;
  setStatus: (status: StatusFilter) => void;
  setMethod: (method: MethodFilter) => void;
  setDateRange: (dateFrom: string, dateTo: string) => void;
  setMinAmount: (minAmount: string) => void;
  setMaxAmount: (maxAmount: string) => void;
  setPage: (page: number) => void;
  setSpendersPage: (page: number) => void;
  resetFilters: () => void;
}

const initialFilters = {
  search: "",
  status: "all",
  method: "all",
  dateFrom: "",
  dateTo: "",
  minAmount: "",
  maxAmount: "",
  page: 1,
} satisfies Partial<FilterState>;

// Every filter change sends the table back to page 1 so the user never lands
// on a page that no longer exists.
export const useFilterStore = create<FilterState>()((set) => ({
  ...initialFilters,
  spendersPage: 1,

  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setMethod: (method) => set({ method, page: 1 }),
  setDateRange: (dateFrom, dateTo) => set({ dateFrom, dateTo, page: 1 }),
  setMinAmount: (minAmount) => set({ minAmount, page: 1 }),
  setMaxAmount: (maxAmount) => set({ maxAmount, page: 1 }),
  setPage: (page) => set({ page }),
  setSpendersPage: (spendersPage) => set({ spendersPage }),
  resetFilters: () => set(initialFilters),
}));

export const selectHasActiveFilters = (state: FilterState) =>
  state.search.trim() !== "" ||
  state.status !== "all" ||
  state.method !== "all" ||
  state.dateFrom !== "" ||
  state.dateTo !== "" ||
  state.minAmount !== "" ||
  state.maxAmount !== "";
