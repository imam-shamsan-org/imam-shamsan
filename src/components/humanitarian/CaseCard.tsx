import { Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import type { HumanitarianCase } from '@/types/humanitarian'
import { Card } from '@/components/ui/card'
import {
  getPdfThumbnailUrl,
  getPosterCardUrl,
  isPdfUrl,
} from '@/lib/cloudinary'

interface CaseCardProps {
  case_: HumanitarianCase
  projectSlug: string
}

export function CaseCard({ case_: c, projectSlug }: CaseCardProps) {
  const hasPoster = Boolean(c.posterUrl)

  const thumbnailContent = hasPoster ? (
    (() => {
      const pdf = isPdfUrl(c.posterUrl!)
      const thumbnailSrc = pdf
        ? getPdfThumbnailUrl(c.posterUrl!)
        : getPosterCardUrl(c.posterUrl!)

      return (
        <img
          src={thumbnailSrc}
          alt={c.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
      )
    })()
  ) : (
    <div className="flex items-center justify-center w-full h-full bg-muted">
      <svg
        className="size-12 text-muted-foreground/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
    </div>
  )

  return (
    <Link
      to="/humanitarian/$slug/$caseSlug"
      params={{ slug: projectSlug, caseSlug: c.slug }}
      className="group block h-full w-full"
    >
      <Card className="relative flex flex-col h-full overflow-hidden transition-all duration-200 group-hover:shadow-md group-hover:ring-1 group-hover:ring-primary/20">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          {thumbnailContent}

          {/* Urgency badge — only for Urgent cases */}
          {c.urgency === 'Urgent' && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 text-xs font-medium">
                <AlertCircle className="size-3" />
                Urgent
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
