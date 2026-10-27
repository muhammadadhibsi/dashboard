import { NavLink } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/utils/cn";
import { NAV_ITEMS } from "./navItems";

function Brand() {
  return (
    <div className="px-6">
      <NavLink to="/" className="inline-block focus:outline-none">
        <img
          src="/vocagame-fulllogo.png"
          alt="VocaGame"
          className="h-10 w-auto object-contain"
        />
      </NavLink>
      <p className="mt-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
        Real Time Dashboard
      </p>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Main" className="mt-8 flex-1 px-4">
      <ul className="space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  // Square rows; the active one carries a 2px brand strip on its right edge.
                  "relative flex h-11 items-center gap-3.5 px-4 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-nav-active text-voca after:absolute after:inset-y-0 after:right-0 after:w-0.5 after:bg-voca"
                    : "text-muted hover:bg-nav-active hover:text-fg",
                )
              }
            >
              <Icon aria-hidden className="size-4.5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function AdminCard() {
  return (
    <div className="flex items-center gap-3 border-t border-line px-6 pt-6 pb-7.5">
      {/* Profile photo taken from the design reference; there is no user-image API. */}
      <img
        src="/admin-avatar.webp"
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-full border border-line object-cover"
      />
      <div className="min-w-0 flex-1 text-xs leading-tight">
        <p className="truncate font-bold text-fg">Admin Panel</p>
        <p className="truncate text-muted">user_root</p>
      </div>
    </div>
  );
}

export function Sidebar() {
  const open = useUIStore((s) => s.sidebarOpen);
  const setOpen = useUIStore((s) => s.setSidebarOpen);
  const close = () => setOpen(false);

  return (
    <>
      {/* Desktop: fixed rail on the page background, split from content by a hairline. */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-bg pt-8 lg:flex">
        <Brand />
        <NavList />
        <AdminCard />
      </aside>

      {/* Mobile: slide-out sheet; Radix handles the focus trap, Escape and scroll lock. */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-64 max-w-[85vw] gap-0 bg-bg p-0 pt-8 shadow-pop lg:hidden"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Main pages of the dashboard
          </SheetDescription>
          <div className="pr-12">
            <Brand />
          </div>
          <NavList onNavigate={close} />
          <AdminCard />
        </SheetContent>
      </Sheet>
    </>
  );
}
