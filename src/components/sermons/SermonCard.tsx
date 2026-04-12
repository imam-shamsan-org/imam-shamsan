import { Link } from '@tanstack/react-router'
import { Calendar, Play } from 'lucide-react'
import type { SermonSummary } from '@/types/sermon'
import { formatDate } from '@/lib/utils'
import { getYouTubeThumbnail } from '@/lib/youtube'

interface SermonCardProps {
  sermon: SermonSummary
}

export function SermonCard({ sermon }: SermonCardProps) {
  const thumbnail = sermon.youtubeLink
    ? getYouTubeThumbnail(sermon.youtubeLink)
    : null

  return (
    <Link
      to="/sermons/$slug"
      params={{ slug: sermon.slug }}
      className="group flex flex-col overflow-hidden rounded-xl ring-1 ring-foreground/10 bg-card transition-all hover:ring-primary/30 hover:shadow-md"
    >
      {thumbnail && (
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={thumbnail}
            alt={sermon.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
            <Play className="size-10 text-white fill-white" />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {sermon.title}
        </h3>

        {sermon.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {sermon.description}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center gap-4 text-xs text-muted-foreground">
          {sermon.date && (
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {formatDate(sermon.date)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
