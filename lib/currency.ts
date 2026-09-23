/**
 * Centralized monetary formatting.
 *
 * The platform DISPLAYS all user-facing amounts in USD. This module is the single
 * place that decides how an amount becomes text, so no component invents its own
 * currency string (which is exactly how the previous SAR / ر.س / ار-SA mix crept
 * in).
 *
 * IMPORTANT — this is DISPLAY only.
 * It does not convert amounts and does not change what the payment provider
 * settles or what the database stores. Amounts are stored as plain integers
 * (`targetAmount`, `collectedAmount`, ...) and the payment gateway's own
 * transaction currency is configured separately on the backend
 * (`payments.service.ts`). Changing this module changes only what the user reads.
 */
import type { Locale } from "@/lib/dictionary"

export const DISPLAY_CURRENCY = {
  code: "USD",
  symbol: "$",
  labelAr: "دولار أمريكي",
  labelEn: "US Dollar",
} as const

const LOCALE_TAG: Record<Locale, string> = {
  ar: "ar-EG",
  en: "en-US",
}

/**
 * Formats a whole-number amount as USD, e.g. `$50,000` / `٥٠٬٠٠٠ $`.
 *
 * `maximumFractionDigits: 0` is intentional: every amount in the domain model is
 * a whole integer, and showing `.00` on a donation target is noise.
 */
export function formatCurrency(amount: number, locale: Locale = "ar"): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0

  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    style: "currency",
    currency: DISPLAY_CURRENCY.code,
    maximumFractionDigits: 0,
  }).format(safeAmount)
}

/** Number + explicit USD suffix, for compact inline use such as "50,000 USD". */
export function formatAmountWithCode(amount: number, locale: Locale = "ar"): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0
  const formatted = new Intl.NumberFormat(LOCALE_TAG[locale], {
    maximumFractionDigits: 0,
  }).format(safeAmount)

  return `${formatted} ${DISPLAY_CURRENCY.code}`
}

/** Bare formatted number, no currency symbol — for percentages and counts. */
export function formatNumber(value: number, locale: Locale = "ar"): string {
  const safeValue = Number.isFinite(value) ? value : 0

  return new Intl.NumberFormat(LOCALE_TAG[locale], { maximumFractionDigits: 0 }).format(safeValue)
}
