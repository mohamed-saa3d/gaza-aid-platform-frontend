/**
 * Single source of truth for turning a stored YouTube URL into an embeddable
 * player URL.
 *
 * This used to live only inside the public live page, which meant the Admin form
 * happily accepted a link like `https://www.youtube.com/` — a valid URL with no
 * video in it. The stream was then saved as active, the public API returned it,
 * and the player silently fell back to the "no live stream" empty state. The
 * Admin had no way to know why their stream never appeared.
 *
 * Both the Admin form (validation feedback) and the public player now use these
 * functions, so "is this a usable live link" is answered in exactly one place.
 */

/** A parsed YouTube video reference: either a `v=` id or a live/channel path. */
export interface YouTubeVideoRef {
  /** The 11-character video id when one could be extracted. */
  videoId: string | null
  /** A `/live/<id>` or `/embed/<id>` path id (Streaming live links). */
  pathId: string | null
}

const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be', 'www.youtu.be']

/** True when the string is a URL whose host is a known YouTube domain. */
export function isYouTubeUrl(raw: string): boolean {
  if (!raw) return false
  try {
    const parsed = new URL(raw.trim())
    return YOUTUBE_HOSTS.includes(parsed.hostname.toLowerCase())
  } catch {
    return false
  }
}

/**
 * Extracts whatever part of a YouTube link can be turned into an embed.
 * Returns nulls (never throws) for anything not recognisable, so callers can
 * decide how to present the failure.
 */
export function parseYouTubeUrl(raw: string): YouTubeVideoRef {
  const empty: YouTubeVideoRef = { videoId: null, pathId: null }
  if (!raw) return empty

  let parsed: URL
  try {
    parsed = new URL(raw.trim())
  } catch {
    return empty
  }

  const hostname = parsed.hostname.toLowerCase()

  if (hostname === 'youtu.be' || hostname === 'www.youtu.be') {
    const id = parsed.pathname.replace(/^\/+/, '').split('/')[0]
    return { videoId: id || null, pathId: null }
  }

  if (!hostname.includes('youtube.com')) {
    return empty
  }

  if (parsed.pathname.startsWith('/embed/')) {
    const id = parsed.pathname.split('/embed/')[1]?.split('/')[0]
    return { videoId: id || null, pathId: id || null }
  }

  if (parsed.pathname.startsWith('/live/')) {
    const id = parsed.pathname.split('/live/')[1]?.split('/')[0]
    return { videoId: id || null, pathId: id || null }
  }

  const v = parsed.searchParams.get('v')
  if (v) {
    return { videoId: v, pathId: null }
  }

  return empty
}

/**
 * Builds an embeddable player URL, or `null` when the stored link cannot be
 * embedded. A bare channel/domain link (e.g. `https://www.youtube.com/`) yields
 * `null` — that is the honest answer, and the caller shows a real state for it.
 */
export function getYouTubeEmbedUrl(raw: string | null | undefined): string | null {
  if (!raw) return null

  const { videoId, pathId } = parseYouTubeUrl(raw)
  const id = videoId || pathId
  if (!id) return null

  return `https://www.youtube.com/embed/${id}`
}

/** Whether the stored link can actually be embedded (used by Admin validation). */
export function canEmbedYouTubeUrl(raw: string): boolean {
  return getYouTubeEmbedUrl(raw) !== null
}
