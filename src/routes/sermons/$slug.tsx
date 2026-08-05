import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SermonContent } from '@/components/sermons/SermonContent'
import { formatDate } from '@/lib/utils'
import { getSermonBySlug, getSiteSettings } from '@/lib/notion'
import {
  getBreadcrumbSchema,
  getPageMeta,
  getSettingsOgImage,
  siteConfig,
} from '@/lib/seo'

export const Route = createFileRoute('/sermons/$slug')({
  loader: async ({ params }) => {
    const [sermon, settings] = await Promise.all([
      getSermonBySlug({ data: params.slug }),
      getSiteSettings(),
    ])
    if (!sermon) {
      throw new Error('Sermon not found')
    }
    return { sermon, settings }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.sermon) return { meta: [] }
    const sermon = loaderData.sermon
    const { meta, links } = getPageMeta({
      title: sermon.title,
      description: sermon.description || `Sermon summary: ${sermon.title}`,
      canonicalUrl: `${siteConfig.url}/sermons/${sermon.slug}`,
      ogType: 'article',
      ogImage: getSettingsOgImage(loaderData.settings),
    })
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Sermons', url: `${siteConfig.url}/sermons` },
            {
              name: sermon.title,
              url: `${siteConfig.url}/sermons/${sermon.slug}`,
            },
          ]),
        },
      ],
    }
  },
  component: SermonPage,
  errorComponent: ({ error }) => (
    <Container size="narrow">
      <div className="py-24 text-center">
        <h1 className="text-3xl font-bold text-foreground">Sermon Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          {error instanceof Error && error.message === 'Sermon not found'
            ? "This sermon doesn't exist or has been removed."
            : 'Something went wrong loading this sermon.'}
        </p>
        <Link
          to="/sermons"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Sermons
        </Link>
      </div>
    </Container>
  ),
})

function SermonPage() {
  const { sermon } = Route.useLoaderData()

  return (
    <>
      <section className="bg-gradient-to-b from-accent/50 to-background py-10 md:py-14">
        <Container size="narrow">
          <Link
            to="/sermons"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Sermons
          </Link>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {sermon.title}
          </h1>

          {sermon.date && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <time>{formatDate(sermon.date)}</time>
            </div>
          )}

          {sermon.description && (
            <p className="mt-4 text-lg text-muted-foreground">
              {sermon.description}
            </p>
          )}

          <div className="mt-8 flex items-center gap-3 opacity-40">
            <div className="h-px w-16 bg-secondary" />
            <div className="size-1.5 rounded-full bg-secondary" />
            <div className="h-px w-16 bg-secondary" />
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container size="narrow">
          <SermonContent
            blocks={sermon.content}
            youtubeLink={sermon.youtubeLink}
          />
        </Container>
      </section>
    </>
  )
}
