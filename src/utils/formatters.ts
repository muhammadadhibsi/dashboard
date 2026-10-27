import { format, parseISO } from "date-fns";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const wholeCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US");

/** $1,200.00 */
export const formatCurrency = (value: number) => currency.format(value);

/** $1,248,300 */
export const formatWholeCurrency = (value: number) =>
  wholeCurrency.format(value);

/** $420.5k, $1.2M */
export function formatCompactCurrency(value: number) {
  if (Math.abs(value) >= 1_000_000) return `$${trimZero(value / 1_000_000)}M`;
  if (Math.abs(value) >= 1_000) return `$${trimZero(value / 1_000)}k`;
  return `$${value}`;
}

const trimZero = (value: number) => value.toFixed(1).replace(/\.0$/, "");

/** 128,492 */
export const formatNumber = (value: number) => number.format(value);

/** 12.5 -> "12.5%", always one decimal */
export const formatPercent = (value: number) => `${value.toFixed(1)}%`;

/**
 * Period-over-period change, truncated toward zero to one decimal so a
 * -0.58% dip reads "-0.5%" rather than being rounded up into a bigger move.
 */
export const formatChange = (value: number) =>
  `${(Math.trunc(value * 10) / 10).toFixed(1)}%`;

/** Signed change in percent; returns null when there is no baseline. */
export function percentChange(
  current: number,
  previous: number,
): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

// All dates render in the viewer's local timezone. parseISO keeps "YYYY-MM-DD"
// day keys at local midnight (new Date() would read them as UTC midnight and
// show the previous day west of Greenwich), and converts "...Z" timestamps to local.

/** "Oct 24, 2024" */
export const formatDateOnly = (iso: string) =>
  format(parseISO(iso), "MMM d, yyyy");

/** "18:47" */
export const formatTimeOnly = (iso: string) => format(parseISO(iso), "HH:mm");

/** "Oct 24, 2024 • 18:47" */
export const formatTxDate = (iso: string) =>
  format(parseISO(iso), "MMM d, yyyy • HH:mm");

/** "Oct 7" */
export const formatShortDay = (iso: string) => format(parseISO(iso), "MMM d");

/** "Oct 07" (matches Figma chart x-axis) */
export const formatTwoDigitDay = (iso: string) =>
  format(parseISO(iso), "MMM dd");

/** "Oct 24, 2024" */
export const formatLongDay = formatDateOnly;
