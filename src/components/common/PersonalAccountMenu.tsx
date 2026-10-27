import { ChevronDown, Command, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/store/useUIStore";

/**
 * Text-only trigger as drawn in the header reference. The menu lists only
 * actions that exist: there is no auth or settings backend to sign out of.
 */
export function PersonalAccountMenu() {
  const setPaletteOpen = useUIStore((s) => s.setPaletteOpen);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group h-9.5 gap-2.5 px-3 text-sm font-normal text-muted hover:bg-transparent hover:text-fg data-[state=open]:text-fg"
        >
          <span className="hidden sm:inline">Personal Account</span>
          <span className="sr-only sm:hidden">Personal Account</span>
          <ChevronDown
            aria-hidden
            className="size-3.5 transition-transform group-data-[state=open]:rotate-180"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-xl p-2"
      >
        <DropdownMenuLabel className="px-2 py-2 font-normal">
          <p className="font-semibold text-fg">user_root</p>
          <p className="mt-0.5 truncate text-xs text-subtle">Admin Panel</p>
          <p className="mt-2 flex items-center gap-1 text-xs text-muted">
            <ShieldCheck aria-hidden className="size-3.5 text-voca-ink" />
            Role: Administrator
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => setPaletteOpen(true)}
          className="min-h-11 gap-2.5 px-2"
        >
          <Command aria-hidden className="text-muted" />
          Command Palette
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
