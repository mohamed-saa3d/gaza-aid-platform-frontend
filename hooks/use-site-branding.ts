/**
 * Static site branding.
 *
 * The logo is a fixed frontend asset at /images/logo-mark.png.
 * It is NOT fetched from the backend — the site logo is UI, not
 * dynamic domain data, and does not need a database or API.
 */
const LOGO_URL = "/images/logo-mark.png"

export interface SiteBranding {
  logoUrl: string
  loading: boolean
}

export function useSiteBranding(): SiteBranding {
  return { logoUrl: LOGO_URL, loading: false }
}
