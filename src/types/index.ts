// Shapes follow the live mock API (probed 2026-10-26), which differs from SPEC.md
// in several places. See README "API deviations".

export interface PeriodValue {
  current: number;
  previous: number;
}

export interface DashboardSummary {
  total_revenue: PeriodValue;
  total_orders: PeriodValue;
  active_users: PeriodValue;
  conversion_rate: PeriodValue;
}

export interface ProductPerformance {
  id: number;
  name: string;
  revenue: number;
  max_revenue: number;
}

export interface PaymentDistribution {
  id: number;
  method: string;
  percentage: number;
  color: string;
}

export type ActivityType = "payout" | "alert" | "security" | "org";
export type ActivitySeverity = "info" | "warning" | "success" | "danger";

export interface ActivityItem {
  id: number;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  severity: ActivitySeverity;
}

export const TRANSACTION_STATUSES = [
  "success",
  "pending",
  "failed",
  "refunded",
] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export const PAYMENT_METHODS = [
  "Credit Card",
  "PayPal",
  "QRIS",
  "Visa Card",
  "Wire Transfer",
  "Bank Transfer",
  "Mastercard",
  "Amex",
  "USDT Wallet",
  "ETH Wallet",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number] | (string & {});

export interface Transaction {
  id: number;
  transaction_id: string;
  customer_name: string;
  customer_email: string;
  avatar: string;
  amount: number;
  method: PaymentMethod;
  status: TransactionStatus;
  date: string;
}

export interface CustomerSummary {
  active_users_online: PeriodValue;
  new_segments: PeriodValue;
  retaining: PeriodValue;
  churned: PeriodValue;
}

export type CustomerSegment = "Whale" | "High Value" | "Power User";

export interface TopSpender {
  id: number;
  customer_name: string;
  email: string;
  avatar: string;
  ltv: number;
  last_active: string;
  segment: CustomerSegment;
}

export interface CustomerAcquisition {
  id: number;
  month: string;
  month_index: number;
  new_users: number;
  returning_users: number;
}

export interface GeoDistribution {
  id: number;
  region: string;
  user_count: number;
  percentage: number;
  color: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
}
