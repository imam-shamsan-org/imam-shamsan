import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { FadeIn } from '@/components/shared/FadeIn'
import type { ArticleSummary } from '@/types/article'

interface LatestWritingsProps {
  articles: ArticleSummary[]
}

export function LatestWritings({ articles }: LatestWritingsProps) {
  if (!articles.length) return null

  return (
    <section className="border-t border-secondary/20 bg-muted/50 py-16">
      <Container>
        <FadeIn className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-6 w-[3px] rounded-full bg-secondary opacity-70" />
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Latest Writings
              </h2>
            </div>
            <p className="mt-1 text-muted-foreground pl-[18px]">
              Recent writings and reflections
            </p>
          </div>
          <Link
            to="/writings"
            className="hidden text-sm font-medium text-primary hover:text-primary/80 transition-colors sm:flex items-center gap-1"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <FadeIn key={article.id} delay={i * 80}>
              <ArticleCard article={article} />
            </FadeIn>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/writings">
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
              View All Writings
              <ArrowRight className="size-4" />
            </button>
          </Link>
        </div>
      </Container>
    </section>
  )
}
