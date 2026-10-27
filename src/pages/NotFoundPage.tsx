import { MapPinOff } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";

export function NotFoundPage() {
  return (
    <EmptyState
      icon={MapPinOff}
      title="This page doesn't exist"
      description="The dashboard has three sections: Dashboard, Transactions, and Customers."
      className="py-24"
      action={
        <Link
          to="/"
          className="inline-flex min-h-11 items-center rounded-lg bg-voca px-4 text-sm font-semibold text-bg hover:bg-voca-ink"
        >
          Back to Dashboard
        </Link>
      }
    />
  );
}
