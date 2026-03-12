import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/Container'
import { SermonCard } from '@/components/sermons/SermonCard'
import { getPublishedSermons } from '@/lib/notion'
import { getSermonsListMeta, getBreadcrumbSchema, siteConfig } from '@/lib/seo'

export const Route = createFileRoute('/sermons/')({
  loader: async () => {
    const sermons = await getPublishedSermons()
    return { sermons }
  },
  head: () => {
    const { meta, links } = getSermonsListMeta()
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
      <section className="bg-gradient-to-b from-accent/50 to-background py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              <span className="text-primary">Sermon Summaries</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Written summaries of Friday khutbahs and sermons
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 opacity-40">
              <div className="h-px w-16 bg-secondary" />
              <div className="size-1.5 rounded-full bg-secondary" />
              <div className="h-px w-16 bg-secondary" />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          {sermons.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No sermon summaries yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
