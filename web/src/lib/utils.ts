import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {format, parseISO} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date, formatString = "yyyy-MM-dd") => {
  return format(date, formatString);
};

export const formatDateTime = (date: Date, formatString?: string) => {
  if (formatString) {
    return format(date, formatString);
  }
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export const parseDateFromISO = (timestamp: string) => {
  return parseISO(timestamp);
};


