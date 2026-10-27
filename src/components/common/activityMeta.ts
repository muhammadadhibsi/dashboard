import {
  KeyRound,
  TriangleAlert,
  UserPlus,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { ActivityType } from "@/types";

// Icon and container both follow the event type, as in the Activity Feed
// reference: payouts mint, alerts solid red, security lavender, orgs gray.
export const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  payout: Wallet,
  alert: TriangleAlert,
  security: KeyRound,
  org: UserPlus,
};

export const ACTIVITY_STYLES: Record<ActivityType, string> = {
  payout: "bg-mint-soft text-voca-ink",
  alert: "bg-danger text-rose-ink",
  security: "bg-lavender-soft text-violet-ink",
  org: "bg-hover text-muted",
};
