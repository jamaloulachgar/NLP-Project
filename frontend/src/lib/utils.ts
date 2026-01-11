import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChatLanguage } from "@/types/chat";
import { t } from "@/lib/i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date, lang: ChatLanguage): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  const displayLang = lang === 'ar' ? 'ar' : 'en';
  
  if (diffMins < 1) {
    return t('chat.justNow', displayLang);
  } else if (diffMins < 60) {
    return `${diffMins}${t('chat.minutesAgo', displayLang)}`;
  } else if (diffHours < 24) {
    return `${diffHours}${t('chat.hoursAgo', displayLang)}`;
  } else {
    return `${diffDays}${t('chat.daysAgo', displayLang)}`;
  }
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
