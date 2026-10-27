/**
 * Builds an array of page numbers and 'gap' markers with ellipsis.
 * Example: 1 … 4 5 6 … 12
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | "gap")[] = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) items.push("gap");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < totalPages - 1) items.push("gap");
  items.push(totalPages);

  return items;
}
