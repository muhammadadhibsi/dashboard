import { Bell, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useActivityState } from "@/hooks/useActivityState";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/utils/cn";
import { ACTIVITY_ICONS, ACTIVITY_STYLES } from "./activityMeta";

const PREVIEW_COUNT = 5;

/**
 * Plain bell, no count badge: the header reference draws none. The unread
 * count still reaches screen readers through the accessible name.
 */
export function NotificationPopover() {
  const open = useUIStore((s) => s.notificationsOpen);
  const setOpen = useUIStore((s) => s.setNotificationsOpen);
  const markRead = useUIStore((s) => s.markActivityRead);
  const { query, unread } = useActivityState();

  const count = unread.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={
            count > 0 ? `Notifications, ${count} unread` : "Notifications"
          }
          className="size-8 text-muted hover:bg-transparent hover:text-fg data-[state=open]:text-fg [&_svg:not([class*='size-'])]:size-6"
        >
          <Bell aria-hidden />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        aria-label="Notifications"
        className="w-[calc(100vw-1.5rem)] max-w-96 rounded-2xl bg-surface-2 p-0 shadow-pop"
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <p className="text-sm font-semibold text-fg">
            Notifications{" "}
            <span className="font-normal text-muted">
              {count > 0 ? `${count} unread` : "all read"}
            </span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markRead(unread.map((item) => item.id))}
            disabled={count === 0}
            className="min-h-11 text-xs text-voca-ink hover:bg-hover hover:text-voca-ink"
          >
            <CheckCheck aria-hidden />
            Mark all read
          </Button>
        </header>

        {query.isPending ? (
          <p className="px-4 py-6 text-sm text-muted">Loading activity...</p>
        ) : query.isError ? (
          <p className="px-4 py-6 text-sm text-muted">
            Activity feed is unavailable right now.
          </p>
        ) : count === 0 ? (
          <p className="px-4 py-6 text-sm text-muted">
            You're caught up. New platform events will show here.
          </p>
        ) : (
          <ul className="max-h-80 divide-y divide-line overflow-y-auto">
            {unread.slice(0, PREVIEW_COUNT).map((item) => {
              const Icon = ACTIVITY_ICONS[item.type];
              return (
                <li key={item.id} className="flex gap-3 px-4 py-3">
                  <span
                    className={cn(
                      "grid h-7 w-11 shrink-0 place-items-center rounded-full",
                      ACTIVITY_STYLES[item.type],
                    )}
                  >
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {item.description}
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-subtle">
                    {item.time}
                  </time>
                </li>
              );
            })}
          </ul>
        )}

        <footer className="border-t border-line p-2">
          <Button
            asChild
            variant="ghost"
            className="min-h-11 w-full text-muted hover:bg-hover hover:text-fg"
          >
            <Link to="/#activity" onClick={() => setOpen(false)}>
              Open full activity feed
            </Link>
          </Button>
        </footer>
      </PopoverContent>
    </Popover>
  );
}
