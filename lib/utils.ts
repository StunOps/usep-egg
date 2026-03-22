import { EggRecord, EggSize } from "./storage";

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function getDateNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export function countBySize(eggs: EggRecord[]): Record<EggSize, number> {
  const counts: Record<EggSize, number> = {
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    Jumbo: 0,
  };
  eggs.forEach((e) => {
    counts[e.size]++;
  });
  return counts;
}

export function countByDate(eggs: EggRecord[]): { date: string; count: number }[] {
  const map = new Map<string, number>();
  eggs.forEach((e) => {
    map.set(e.date, (map.get(e.date) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function sizeColor(size: EggSize): string {
  switch (size) {
    case "S":
      return "#3b82f6"; // blue
    case "M":
      return "#22c55e"; // green
    case "L":
      return "#f97316"; // orange
    case "XL":
      return "#8b5cf6"; // purple
    case "Jumbo":
      return "#ef4444"; // red
  }
}

export function sizeBadgeClass(size: EggSize): string {
  switch (size) {
    case "S":
      return "badge-small";
    case "M":
      return "badge-medium";
    case "L":
      return "badge-large";
    case "XL":
      return "badge-xlarge";
    case "Jumbo":
      return "badge-jumbo";
  }
}
