import { ArticleCard } from './ArticleCard'
import type { ArticleSummary } from '@/types/article'
import { FadeIn } from '@/components/shared/FadeIn'

interface ArticleGridProps {
  articles: Array<ArticleSummary>
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (!articles.length) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No articles found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) => (
        <FadeIn key={article.id} delay={i * 80}>
          <ArticleCard article={article} />
        </FadeIn>
      ))}
    </div>
  )
}
