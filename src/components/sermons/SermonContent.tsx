import type { ContentBlock } from '@/types/article'
import { ArticleContent } from '@/components/articles/ArticleContent'
import { getYouTubeEmbedUrl } from '@/lib/youtube'

interface SermonContentProps {
  blocks: Array<ContentBlock>
  youtubeLink?: string
}

export function SermonContent({ blocks, youtubeLink }: SermonContentProps) {
  const embedUrl = youtubeLink ? getYouTubeEmbedUrl(youtubeLink) : null

  return (
    <div>
      {embedUrl && (
        <div className="mb-8 aspect-video overflow-hidden rounded-xl ring-1 ring-foreground/10">
          <iframe
            src={embedUrl}
            title="Sermon video"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <ArticleContent blocks={blocks} />
    </div>
  )
}
