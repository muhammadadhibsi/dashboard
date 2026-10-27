import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TopSpender } from "@/types";

interface UIState {
  sidebarOpen: boolean;
  paletteOpen: boolean;
  notificationsOpen: boolean;
  /** transaction_id shown in the detail drawer */
  drawerTransactionId: string | null;
  /** Top spender customer currently open in detail dialog */
  selectedCustomer: TopSpender | null;
  /** Whether the top spenders table is in expanded "all customers" mode */
  viewAllCustomers: boolean;
  /** Activity ids the admin has seen or dismissed; the API has no read state. */
  readActivityIds: number[];
  clearedActivityIds: number[];

  setSidebarOpen: (open: boolean) => void;
  setPaletteOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  openTransaction: (transactionId: string) => void;
  closeTransaction: () => void;
  setSelectedCustomer: (customer: TopSpender | null) => void;
  setViewAllCustomers: (viewAll: boolean) => void;
  toggleViewAllCustomers: () => void;
  markActivityRead: (ids: number[]) => void;
  clearActivity: (ids: number[]) => void;
  restoreActivity: () => void;
}

const merge = (current: number[], ids: number[]) =>
  Array.from(new Set([...current, ...ids]));

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      paletteOpen: false,
      notificationsOpen: false,
      drawerTransactionId: null,
      selectedCustomer: null,
      viewAllCustomers: false,
      readActivityIds: [],
      clearedActivityIds: [],

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
      setNotificationsOpen: (notificationsOpen) => set({ notificationsOpen }),
      openTransaction: (drawerTransactionId) => set({ drawerTransactionId }),
      closeTransaction: () => set({ drawerTransactionId: null }),
      setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer }),
      setViewAllCustomers: (viewAllCustomers) => set({ viewAllCustomers }),
      toggleViewAllCustomers: () =>
        set((state) => ({ viewAllCustomers: !state.viewAllCustomers })),
      markActivityRead: (ids) =>
        set((state) => ({
          readActivityIds: merge(state.readActivityIds, ids),
        })),
      clearActivity: (ids) =>
        set((state) => ({
          clearedActivityIds: merge(state.clearedActivityIds, ids),
          readActivityIds: merge(state.readActivityIds, ids),
        })),
      restoreActivity: () => set({ clearedActivityIds: [] }),
    }),
    {
      name: "vocagame-ui",
      partialize: (state) => ({
        readActivityIds: state.readActivityIds,
        clearedActivityIds: state.clearedActivityIds,
      }),
    },
  ),
);
