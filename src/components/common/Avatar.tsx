import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/utils/cn";

// Initials-only avatars: fallback tones are the lavender, mint and violet circles.
const TONES = [
  "bg-lavender-soft text-violet-ink",
  "bg-mint-soft text-voca-ink",
  "bg-orchid-soft text-orchid-ink",
];

function toneFor(seed: string) {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TONES[hash % TONES.length];
}

export function Avatar({
  initials,
  seed,
  src,
  className,
}: {
  initials: string;
  seed: string;
  src?: string;
  className?: string;
}) {
  return (
    <UIAvatar aria-hidden className={cn("size-8", className)}>
      {src && <AvatarImage src={src} alt="" className="object-cover" />}
      <AvatarFallback
        className={cn("text-xs font-semibold tracking-wide", toneFor(seed))}
      >
        {initials}
      </AvatarFallback>
    </UIAvatar>
  );
}
