import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstName(fullName?: string | null): string {
  if (!fullName) return "";
  const first = fullName.trim().split(/\s+/)[0] || "";
  // Capitalize first letter for safety
  return first.charAt(0).toUpperCase() + first.slice(1);
}
