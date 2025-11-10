import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getDomain as extractDomain } from "tldts"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDomain(url: string): string {
  try {
    // Use tldts to properly extract domain, handling all TLD variations
    // Examples:
    // - www.google.com → google.com
    // - google.com.br → google.com.br
    // - bbc.co.uk → bbc.co.uk
    const domain = extractDomain(url)
    return domain || ""
  } catch (error) {
    console.error("Failed to extract domain:", error)
    return ""
  }
}
