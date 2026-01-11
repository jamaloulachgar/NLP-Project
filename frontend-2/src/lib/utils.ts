import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Language } from "@/types/chat"
import { t } from "./i18n"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date: Date, lang: Language): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return t('justNow', lang);
  } else if (diffMins < 60) {
    return `${diffMins}${t('minutesAgo', lang)}`;
  } else if (diffHours < 24) {
    return `${diffHours}${t('hoursAgo', lang)}`;
  } else {
    return `${diffDays}${t('daysAgo', lang)}`;
  }
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
