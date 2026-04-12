import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/Container'
import { SermonCard } from '@/components/sermons/SermonCard'
import { FadeIn } from '@/components/shared/FadeIn'
import { getPublishedSermons, getSiteSettings } from '@/lib/notion'
import { getBreadcrumbSchema, getSermonsListMeta, siteConfig } from '@/lib/seo'

export const Route = createFileRoute('/sermons/')({
  loader: async () => {
    const [sermons, settings] = await Promise.all([
      getPublishedSermons(),
      getSiteSettings(),
    ])
    return { sermons, settings }
  },
  head: ({ loaderData }) => {
    const { meta, links } = getSermonsListMeta(loaderData?.settings)
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Sermons', url: `${siteConfig.url}/sermons` },
          ]),
        },
      ],
    }
  },
  component: SermonsPage,
})

function SermonsPage() {
  const { sermons } = Route.useLoaderData()

  return (
    <>
      <section className="bg-gradient-to-b from-accent/50 to-background py-8 md:py-12">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                <span className="text-primary">Sermon Summaries</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Written summaries of Friday khutbahs and sermons
              </p>
              <div className="mt-6 flex items-center justify-center gap-3 opacity-40">
                <div className="h-px w-16 bg-secondary" />
                <div className="size-1.5 rounded-full bg-secondary" />
                <div className="h-px w-16 bg-secondary" />
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          {sermons.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No sermon summaries yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sermons.map((sermon, i) => (
                <FadeIn key={sermon.id} delay={i * 80}>
                  <SermonCard sermon={sermon} />
                </FadeIn>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
