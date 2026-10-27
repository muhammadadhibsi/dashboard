import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Transaction } from "@/types";
import { getPage } from "./client";

// The dataset is small (19 rows) and search has to match name/email, which the
// API cannot do, so the full list is fetched once and filtered on the client.
const ALL_ROWS_LIMIT = 500;

export const transactionQueries = {
  all: () =>
    queryOptions({
      queryKey: ["transactions", "all"],
      queryFn: ({ signal }) =>
        getPage<Transaction>(
          "/transactions",
          { _page: 1, _limit: ALL_ROWS_LIMIT },
          signal,
        ),
      select: (page) => page.data,
    }),
};

export const useAllTransactions = () => useQuery(transactionQueries.all());
