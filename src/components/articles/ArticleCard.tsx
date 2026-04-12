import { Link } from '@tanstack/react-router'
import type { ArticleSummary } from '@/types/article'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import { Badge } from '@/components/ui/badge'
import { ArabicText } from '@/components/shared/ArabicText'
import { formatDate } from '@/lib/utils'

interface ArticleCardProps {
  article: ArticleSummary
}

export function ArticleCard({ article }: ArticleCardProps) {
  const isArabic = article.language === 'Arabic'

  return (
    <Link
      to="/writings/$slug"
      params={{ slug: article.slug }}
      className="group flex flex-col overflow-hidden rounded-xl ring-1 ring-foreground/10 bg-card transition-all hover:ring-primary/30 hover:shadow-md"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <CloudinaryImage
          src={article.coverImage}
          alt={article.title}
          preset="card"
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 mb-2">
          {article.category && (
            <Badge variant="muted">{article.category}</Badge>
          )}
          {article.language !== 'English' && (
            <Badge variant="secondary">{article.language}</Badge>
          )}
        </div>

        {isArabic ? (
          <ArabicText
            as="h3"
            className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2"
          >
            {article.title}
          </ArabicText>
        ) : (
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
        )}

        {article.description && (
          <p
            className="mt-2 text-sm text-muted-foreground line-clamp-2"
            dir={isArabic ? 'rtl' : undefined}
          >
            {article.description}
          </p>
        )}

        <div className="mt-auto pt-3 text-xs text-muted-foreground">
          {formatDate(article.createdAt)}
        </div>
      </div>
    </Link>
  )
}
