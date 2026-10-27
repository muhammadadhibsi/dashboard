import { format, parseISO } from "date-fns";

/**
 * Local calendar day ("YYYY-MM-DD") of an API timestamp. Every place that
 * groups or filters by day uses this, so the table, the date filter and the
 * charts always agree on which day a transaction belongs to.
 */
export const toLocalDayKey = (iso: string) =>
  format(parseISO(iso), "yyyy-MM-dd");

/**
 * Formats a date range into a clean string label.
 * Example: "Oct 12 - Oct 27, 2024" or "All dates".
 */
export function formatDateRangeLabel(dateFrom: string, dateTo: string): string {
  if (!dateFrom && !dateTo) return "All dates";

  if (dateFrom && !dateTo) {
    try {
      return `From ${format(parseISO(dateFrom), "MMM d, yyyy")}`;
    } catch {
      return dateFrom;
    }
  }

  if (!dateFrom && dateTo) {
    try {
      return `Up to ${format(parseISO(dateTo), "MMM d, yyyy")}`;
    } catch {
      return dateTo;
    }
  }

  try {
    const fromDate = parseISO(dateFrom);
    const toDate = parseISO(dateTo);
    if (fromDate.getFullYear() === toDate.getFullYear()) {
      return `${format(fromDate, "MMM d")} - ${format(toDate, "MMM d, yyyy")}`;
    }
    return `${format(fromDate, "MMM d, yyyy")} - ${format(toDate, "MMM d, yyyy")}`;
  } catch {
    return `${dateFrom} - ${dateTo}`;
  }
}
