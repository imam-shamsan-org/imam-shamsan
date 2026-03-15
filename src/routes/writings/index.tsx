import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/Container'
import { ArticleGrid } from '@/components/articles/ArticleGrid'
import { LanguageFilter } from '@/components/articles/LanguageFilter'
import { FadeIn } from '@/components/shared/FadeIn'
import { getPublishedArticles } from '@/lib/notion'
import { getWritingsListMeta, getBreadcrumbSchema, siteConfig } from '@/lib/seo'
import { ARTICLE_CATEGORIES } from '@/lib/constants'

export const Route = createFileRoute('/writings/')({
  loader: async () => {
    const articles = await getPublishedArticles({ data: {} })
    return { articles }
  },
  head: () => {
    const { meta, links } = getWritingsListMeta()
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Writings', url: `${siteConfig.url}/writings` },
          ]),
        },
      ],
    }
  },
  component: WritingsPage,
})

function WritingsPage() {
  const { articles } = Route.useLoaderData()
  const [language, setLanguage] = useState('All')
  const [category, setCategory] = useState('All')

  const filtered = articles.filter((a) => {
    if (language !== 'All' && a.language !== language) return false
    if (category !== 'All' && a.category !== category) return false
    return true
  })

  return (
    <>
      <section className="bg-gradient-to-b from-accent/50 to-background py-12 md:py-16">
        <Container>
          <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              <span className="text-primary">Writings</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Reflections and Islamic insights by Imam Shamsan
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 opacity-40">
              <div className="h-px w-16 bg-secondary" />
              <div className="size-1.5 rounded-full bg-secondary" />
              <div className="h-px w-16 bg-secondary" />
            </div>
          </div>
          </FadeIn>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="mb-8">
            <LanguageFilter
              selected={language}
              onSelect={setLanguage}
              categories={[...ARTICLE_CATEGORIES]}
              selectedCategory={category}
              onCategorySelect={setCategory}
            />
          </div>

          <ArticleGrid articles={filtered} />
        </Container>
      </section>
    </>
  )
}
