export const defaultLocale = "en"
export const locales = ["en", "es", "fr", "de", "zh"] as const
export type Locale = (typeof locales)[number]

export const languages = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  // Add RTL languages here if needed
  return "ltr"
}
