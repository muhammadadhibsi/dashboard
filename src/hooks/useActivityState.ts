import { useMemo } from "react";
import { useActivityFeed } from "@/api/dashboard.queries";
import { useUIStore } from "@/store/useUIStore";

/** Activity feed joined with the locally stored read / cleared ids. */
export function useActivityState() {
  const query = useActivityFeed();
  const readIds = useUIStore((s) => s.readActivityIds);
  const clearedIds = useUIStore((s) => s.clearedActivityIds);

  return useMemo(() => {
    const read = new Set(readIds);
    const cleared = new Set(clearedIds);
    const visible = (query.data ?? []).filter((item) => !cleared.has(item.id));
    const unread = visible.filter((item) => !read.has(item.id));
    return { query, visible, unread, isUnread: (id: number) => !read.has(id) };
  }, [query, readIds, clearedIds]);
}
