// Recharts takes raw colors, not Tailwind classes. Values are sampled from
// design/Dashboard_Page.png and mirror the @theme tokens in index.css; keep them in sync.
export const CHART_COLORS = {
  surface: "#201f22",
  /* Green-tinted solid gridlines, as drawn in the revenue chart reference. */
  grid: "#215328",
  cursor: "#918fa0",
  muted: "#c7c4d7",
  voca: "#16ca2e",
  tooltip: "#29292b",
  /* Neutral fill: map land and gridlines on charts without the green tint. */
  neutral: "#2a292c",
} as const;

export const AXIS_TICK = { fill: CHART_COLORS.muted, fontSize: 12 };

/** Soft glow on the revenue line, matching --shadow-glow. */
export const LINE_GLOW = "drop-shadow(0 0 6px rgb(22 202 46 / 0.45))";

/**
 * Payment donut colors keyed by method so a slice keeps its color when the
 * API reorders rows or a filter hides some of them. Bank Transfer gets a
 * neutral gray instead of red: red is reserved for failure states.
 */
export const PAYMENT_COLOR_BY_METHOD: Record<string, string> = {
  "E-Wallet": "#c0c1ff",
  QRIS: "#4edea3",
  "Credit Card": "#ddb7ff",
  "Bank Transfer": "#464554",
};

/** Fallback for methods the palette doesn't know about yet. */
export const PAYMENT_FALLBACK_COLOR = "#918fa0";

export const paymentColor = (method: string) =>
  PAYMENT_COLOR_BY_METHOD[method] ?? PAYMENT_FALLBACK_COLOR;

/** Product Performance bars step down from full voca green by rank, as in the reference. */
export const RANK_RAMP = [
  "#16ca2e",
  "#127521",
  "#12631e",
  "#11501b",
  "#103d18",
] as const;

export const rankColor = (index: number) =>
  RANK_RAMP[Math.min(index, RANK_RAMP.length - 1)];
