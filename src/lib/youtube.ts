/**
 * Shared YouTube URL utilities.
 * Handles watch, short, and live URL formats.
 */

/** Extract YouTube video ID from various URL formats */
export function getYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null

  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) return watchMatch[1]

  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return shortMatch[1]

  const liveMatch = url.match(/youtube\.com\/live\/([^?&]+)/)
  if (liveMatch) return liveMatch[1]

  return null
}

/** Get embeddable YouTube URL */
export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

/** Get YouTube video thumbnail */
export function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeVideoId(url)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
}

/** Determine live/recent stream status based on when the URL was last updated */
export function getStreamStatus(dateStr: string | undefined): {
  isLive: boolean
  timeAgo: string | null
} {
  if (!dateStr) return { isLive: false, timeAgo: null }

  const streamDate = new Date(dateStr)
  if (isNaN(streamDate.getTime())) return { isLive: false, timeAgo: null }

  const now = new Date()
  const diffMs = now.getTime() - streamDate.getTime()
  if (diffMs < 0) return { isLive: false, timeAgo: null }

  const LIVE_WINDOW_MS = 4 * 60 * 60 * 1000
  if (diffMs < LIVE_WINDOW_MS) {
    return { isLive: true, timeAgo: null }
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)

  let timeAgo: string
  if (diffHours < 24) {
    timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  } else if (diffWeeks < 5) {
    timeAgo = `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`
  } else {
    timeAgo = streamDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return { isLive: false, timeAgo }
}
