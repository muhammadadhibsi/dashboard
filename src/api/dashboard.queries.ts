import { queryOptions, useQuery } from "@tanstack/react-query";
import type {
  ActivityItem,
  DashboardSummary,
  PaymentDistribution,
  ProductPerformance,
} from "@/types";
import { getJson } from "./client";

export const dashboardQueries = {
  summary: () =>
    queryOptions({
      queryKey: ["dashboard", "summary"],
      queryFn: ({ signal }) =>
        getJson<DashboardSummary>("/dashboard/summary", undefined, signal),
    }),
  products: () =>
    queryOptions({
      queryKey: ["dashboard", "product-performance"],
      queryFn: ({ signal }) =>
        getJson<ProductPerformance[]>(
          "/product-performance",
          undefined,
          signal,
        ),
    }),
  payments: () =>
    queryOptions({
      queryKey: ["dashboard", "payment-distribution"],
      queryFn: ({ signal }) =>
        getJson<PaymentDistribution[]>(
          "/payment-distribution",
          undefined,
          signal,
        ),
    }),
  activity: () =>
    queryOptions({
      queryKey: ["dashboard", "activity-feed"],
      queryFn: ({ signal }) =>
        getJson<ActivityItem[]>("/activity-feed", { _limit: 15 }, signal),
      // The API docs ask clients to poll every 30s to simulate a live feed.
      refetchInterval: 30_000,
    }),
};

export const useDashboardSummary = () => useQuery(dashboardQueries.summary());
export const useProductPerformance = () =>
  useQuery(dashboardQueries.products());
export const usePaymentDistribution = () =>
  useQuery(dashboardQueries.payments());
export const useActivityFeed = () => useQuery(dashboardQueries.activity());
