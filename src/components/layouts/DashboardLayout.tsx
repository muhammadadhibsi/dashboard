import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CommandPalette } from "@/components/common/CommandPalette";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Header } from "@/components/common/Header";
import { Sidebar } from "@/components/common/Sidebar";
import { LoadingRegion, Skeleton } from "@/components/common/SkeletonLoader";
import { TransactionDrawer } from "@/components/transactions/TransactionDrawer";

/** React Router does not scroll to #hash targets on its own. */
function useHashScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    const target = document.getElementById(hash.slice(1));
    target?.scrollIntoView({ block: "start" });
    target?.focus({ preventScroll: true });
  }, [pathname, hash]);
}

export function DashboardLayout() {
  const { pathname } = useLocation();
  useHashScroll();

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:rounded-lg focus:bg-voca focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bg"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main
          id="main"
          tabIndex={-1}
          className="mx-auto w-full max-w-360 px-6 py-8 focus:outline-none sm:px-8 sm:py-8"
        >
          <ErrorBoundary key={pathname}>
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <CommandPalette />
      <TransactionDrawer />
    </div>
  );
}

function PageFallback() {
  return (
    <LoadingRegion label="Loading page" className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </LoadingRegion>
  );
}
