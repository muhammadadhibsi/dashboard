import type { Transaction } from "@/types";

/**
 * Newest first. ISO-8601 UTC strings sort lexicographically; id and then
 * transaction_id break ties so rows with equal timestamps never swap places
 * between renders.
 */
export const compareNewestFirst = (a: Transaction, b: Transaction) =>
  b.date.localeCompare(a.date) ||
  b.id - a.id ||
  b.transaction_id.localeCompare(a.transaction_id);
