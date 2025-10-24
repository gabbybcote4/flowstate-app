// src/components/ui/utils.ts
// utility for merging conditional class names cleanly using clsx + tailwind-merge

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* combines arbitrary class values into one consistent string.
   - clsx handles conditional / array syntax (e.g. clsx("a", {b: true}))
   - twMerge resolves tailwind conflicts (e.g. "p-2 p-4" → "p-4") */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
