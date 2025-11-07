import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDomain(url: string): string {
  const hostname = new URL(url).hostname // e.g. "www.youtube.com"
  const parts = hostname.split(".")

  // Remove subdomains like "www" → keep last two parts: "youtube.com"
  return parts.slice((parts.length - 1) * -1).join(".")
}
