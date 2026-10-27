import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import type {
  CustomerAcquisition,
  CustomerSummary,
  GeoDistribution,
  TopSpender,
} from "@/types";
import { getJson, getPage } from "./client";

export const customerQueries = {
  summary: () =>
    queryOptions({
      queryKey: ["customers", "summary"],
      queryFn: ({ signal }) =>
        getJson<CustomerSummary>("/customers/summary", undefined, signal),
    }),
  acquisition: () =>
    queryOptions({
      queryKey: ["customers", "acquisition"],
      queryFn: ({ signal }) =>
        getJson<CustomerAcquisition[]>(
          "/customers/acquisition",
          undefined,
          signal,
        ),
    }),
  geo: () =>
    queryOptions({
      queryKey: ["customers", "geo"],
      queryFn: ({ signal }) =>
        getJson<GeoDistribution[]>("/customers/geo", undefined, signal),
    }),
  topSpenders: (page: number, limit: number) =>
    queryOptions({
      queryKey: ["customers", "top-spenders", { page, limit }],
      queryFn: ({ signal }) =>
        getPage<TopSpender>(
          "/customers/top-spenders",
          { _page: page, _limit: limit },
          signal,
        ),
    }),
};

export const useCustomerSummary = () => useQuery(customerQueries.summary());
export const useAcquisition = () => useQuery(customerQueries.acquisition());
export const useGeoDistribution = () => useQuery(customerQueries.geo());

// Server-side pagination; the previous page stays on screen while the next loads.
export const useTopSpenders = (page: number, limit: number) =>
  useQuery({
    ...customerQueries.topSpenders(page, limit),
    placeholderData: keepPreviousData,
  });
