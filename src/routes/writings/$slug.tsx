import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ArticleContent } from '@/components/articles/ArticleContent'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import { Badge } from '@/components/ui/badge'
import { ArabicText } from '@/components/shared/ArabicText'
import { formatDate } from '@/lib/utils'
import { getArticleBySlug, getSiteSettings } from '@/lib/notion'
import {
  getArticleMeta,
  getArticleSchema,
  getBreadcrumbSchema,
  siteConfig,
} from '@/lib/seo'

export const Route = createFileRoute('/writings/$slug')({
  loader: async ({ params }) => {
    const [article, settings] = await Promise.all([
      getArticleBySlug({ data: params.slug }),
      getSiteSettings(),
    ])
    if (!article) {
      throw new Error('Article not found')
    }
    return { article, settings }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.article) return { meta: [] }
    const { meta, links } = getArticleMeta(
      loaderData.article,
      loaderData.settings,
    )
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getArticleSchema(loaderData.article),
        },
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Writings', url: `${siteConfig.url}/writings` },
            {
              name: loaderData.article.title,
              url: `${siteConfig.url}/writings/${loaderData.article.slug}`,
            },
          ]),
        },
      ],
    }
  },
  component: ArticlePage,
  errorComponent: ({ error }) => (
    <Container size="narrow">
      <div className="py-24 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Article Not Found
        </h1>
        <p className="mt-4 text-muted-foreground">
          {error instanceof Error && error.message === 'Article not found'
            ? "This article doesn't exist or has been removed."
            : 'Something went wrong loading this article.'}
        </p>
        <Link
          to="/writings"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Writings
        </Link>
      </div>
    </Container>
  ),
})

function ArticlePage() {
  const { article } = Route.useLoaderData()
  const isArabic = article.language === 'Arabic'

  return (
    <article>
      {/* Cover Image */}
      {article.coverImage && (
        <div className="aspect-[21/9] w-full overflow-hidden">
          <CloudinaryImage
            src={article.coverImage}
            alt={article.title}
            preset="hero"
            className="h-full w-full"
          />
        </div>
      )}

      {/* Header — gradient only when no cover image */}
      <section
        className={
          article.coverImage
            ? 'pt-2'
            : 'bg-gradient-to-b from-accent/50 to-background pt-10 pb-2'
        }
      >
        <Container size="narrow">
          <div className="py-6">
            <Link
              to="/writings"
              className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to Writings
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4 mt-4">
              {article.category && (
                <Badge variant="muted">{article.category}</Badge>
              )}
              {article.language !== 'English' && (
                <Badge variant="secondary">{article.language}</Badge>
              )}
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  <Tag className="size-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {isArabic ? (
              <ArabicText
                as="h1"
                className="text-3xl font-bold tracking-tight sm:text-4xl"
              >
                {article.title}
              </ArabicText>
            ) : (
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {article.title}
              </h1>
            )}

            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <time>{formatDate(article.createdAt)}</time>
            </div>

            {article.description && (
              <p
                className="mt-4 text-lg text-muted-foreground"
                dir={isArabic ? 'rtl' : undefined}
              >
                {article.description}
              </p>
            )}

            <div className="mt-8 flex items-center gap-3 opacity-40">
              <div className="h-px w-16 bg-secondary" />
              <div className="size-1.5 rounded-full bg-secondary" />
              <div className="h-px w-16 bg-secondary" />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8">
        <Container size="narrow">
          <ArticleContent blocks={article.content} isArabic={isArabic} />
        </Container>
      </section>
    </article>
  )
}
