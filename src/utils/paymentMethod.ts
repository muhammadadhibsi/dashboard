import {
  Bitcoin,
  CircleDollarSign,
  CreditCard,
  Landmark,
  QrCode,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface PaymentMethodInfo {
  label: string;
  Icon: LucideIcon;
}

function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Maps raw payment method name to a user-facing label and Lucide icon.
 * Card brands are displayed masked, e.g. "Visa **** 4421".
 */
export function formatPaymentMethod(
  method: string,
  seed?: string | number,
): PaymentMethodInfo {
  const norm = method.trim();
  const lower = norm.toLowerCase();

  // Generate deterministic last 4 digits from seed if available
  const digits = seed
    ? String((Math.abs(hashSeed(String(seed))) % 9000) + 1000)
    : "4421";

  if (lower.includes("visa")) {
    return { label: `Visa **** ${digits}`, Icon: CreditCard };
  }
  if (lower.includes("mastercard")) {
    return { label: `Mastercard **** ${digits}`, Icon: CreditCard };
  }
  if (lower.includes("amex") || lower.includes("american express")) {
    return { label: `Amex **** ${digits}`, Icon: CreditCard };
  }
  if (lower === "credit card") {
    return { label: `Visa **** ${digits}`, Icon: CreditCard };
  }
  if (
    lower.includes("usdt") ||
    lower.includes("eth") ||
    lower.includes("crypto")
  ) {
    return { label: norm, Icon: Bitcoin };
  }
  if (lower.includes("bank") || lower.includes("wire")) {
    return { label: norm, Icon: Landmark };
  }
  if (
    lower.includes("paypal") ||
    lower.includes("e-wallet") ||
    lower.includes("wallet")
  ) {
    return { label: norm, Icon: Wallet };
  }
  if (lower === "qris") {
    return { label: "QRIS", Icon: QrCode };
  }

  // Graceful fallback for any unknown method
  return { label: norm || "Other", Icon: CircleDollarSign };
}
