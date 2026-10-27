import { Grip, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUIStore } from "@/store/useUIStore";
import { NotificationPopover } from "./NotificationPopover";
import { PersonalAccountMenu } from "./PersonalAccountMenu";

// Ghost icons, a hairline divider and the text-only account trigger, as in the header reference.
const ICON_BUTTON = "size-8 text-muted hover:bg-transparent hover:text-fg";

export function Header() {
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const setPaletteOpen = useUIStore((s) => s.setPaletteOpen);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg">
      <div className="flex h-16 items-center justify-between pr-4 pl-6 sm:pr-6 sm:pl-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
          className="size-9.5 rounded-lg border-line bg-surface text-muted hover:bg-hover hover:text-fg lg:hidden dark:border-line dark:bg-surface"
        >
          <Menu aria-hidden className="size-5" />
        </Button>

        <div className="ml-auto flex items-center">
          <NotificationPopover />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPaletteOpen(true)}
            aria-label="Apps and quick search (⌘K)"
            title="Apps & Search (⌘K)"
            className={ICON_BUTTON}
          >
            <Grip aria-hidden className="size-5.5" />
          </Button>

          <Separator orientation="vertical" className="mx-2 h-5! sm:mx-4" />

          <PersonalAccountMenu />
        </div>
      </div>
    </header>
  );
}
