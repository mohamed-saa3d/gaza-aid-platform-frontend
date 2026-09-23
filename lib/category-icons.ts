/**
 * Category icon registry.
 *
 * The backend stores a plain icon KEY (e.g. "Droplets"). This map is the frontend
 * side of that contract: the administrator can only pick a key that exists here,
 * and an unknown key degrades to a generic grid icon instead of crashing.
 *
 * Keeping the map on the frontend means adding a new icon is a frontend change
 * only — no database migration, and no arbitrary component name ever reaching the
 * renderer from user input.
 */
import {
  BookOpen,
  Droplets,
  HandCoins,
  HeartHandshake,
  HeartPulse,
  Home,
  LayoutGrid,
  UtensilsCrossed,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react"

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Droplets,
  HandCoins,
  HeartHandshake,
  HeartPulse,
  Home,
  LayoutGrid,
  UtensilsCrossed,
  Users,
  Waves,
}

export const DEFAULT_CATEGORY_ICON_KEY = "LayoutGrid"

/** Options offered to the administrator, in a stable display order. */
export const CATEGORY_ICON_OPTIONS: Array<{ key: string; labelAr: string; labelEn: string }> = [
  { key: "Droplets", labelAr: "قطرات ماء", labelEn: "Water drops" },
  { key: "Waves", labelAr: "أمواج / آبار", labelEn: "Waves / wells" },
  { key: "UtensilsCrossed", labelAr: "طعام", labelEn: "Food" },
  { key: "Home", labelAr: "مأوى", labelEn: "Shelter" },
  { key: "Users", labelAr: "أيتام / مستفيدون", labelEn: "Orphans / beneficiaries" },
  { key: "HandCoins", labelAr: "زكاة / تبرع", labelEn: "Zakat / giving" },
  { key: "HeartHandshake", labelAr: "كفالة", labelEn: "Sponsorship" },
  { key: "HeartPulse", labelAr: "صحة", labelEn: "Health" },
  { key: "BookOpen", labelAr: "تعليم", labelEn: "Education" },
  { key: "LayoutGrid", labelAr: "عام", labelEn: "Generic" },
]

/** Resolves a stored key to a component, falling back safely. */
export function resolveCategoryIcon(key?: string | null): LucideIcon {
  if (key && CATEGORY_ICONS[key]) {
    return CATEGORY_ICONS[key]
  }

  return CATEGORY_ICONS[DEFAULT_CATEGORY_ICON_KEY]
}
