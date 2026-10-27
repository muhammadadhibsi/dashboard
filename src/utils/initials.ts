/**
 * Derives 1-2 character uppercase initials from a customer or user name.
 * Examples:
 * - "Arthur Vance" -> "AV"
 * - "M irfan" -> "MI"
 * - "irfannn" -> "IR"
 */
export function getInitials(name: string): string {
  const clean = name.trim();
  if (!clean) return "?";

  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? "";
    return (first + second).toUpperCase();
  }

  return clean.slice(0, 2).toUpperCase();
}
