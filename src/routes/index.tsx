import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Mail } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/home/HeroSection'
import { ServicesPreview } from '@/components/home/ServicesPreview'
import { LatestWritings } from '@/components/home/LatestWritings'
import { MediaHighlight } from '@/components/home/MediaHighlight'
import { FeaturedRecitations } from '@/components/home/FeaturedRecitations'
import {
  getActiveServices,
  getFeaturedRecitations,
  getLatestArticles,
  getSiteSettings,
} from '@/lib/notion'
import { getHomeMeta, getPersonSchema } from '@/lib/seo'
import { getStreamStatus } from '@/lib/youtube'
import { PERSON_NAME } from '@/lib/constants'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [services, latestArticles, settings, featuredRecitations] =
      await Promise.all([
        getActiveServices(),
        getLatestArticles({ data: 3 }),
        getSiteSettings(),
        getFeaturedRecitations(),
      ])
    return { services, latestArticles, settings, featuredRecitations }
  },
  head: ({ loaderData }) => {
    const { meta, links } = getHomeMeta(loaderData?.settings)
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getPersonSchema(loaderData?.settings),
        },
      ],
    }
  },
  component: HomePage,
})

function HomePage() {
  const { services, latestArticles, settings, featuredRecitations } =
    Route.useLoaderData()
  const personName = PERSON_NAME

  const liveStreamEntry = settings.live_stream_url as
    | typeof settings.live_stream_url
    | undefined
  const { isLive } = getStreamStatus(
    liveStreamEntry?.updatedAt,
    liveStreamEntry?.duration,
  )

  return (
    <>
      <HeroSection settings={settings} />
      {isLive ? (
        <>
          <MediaHighlight settings={settings} />
          <FeaturedRecitations recitations={featuredRecitations} />
          <ServicesPreview services={services} settings={settings} />
          <LatestWritings articles={latestArticles} />
        </>
      ) : (
        <>
          <ServicesPreview services={services} settings={settings} />
          <LatestWritings articles={latestArticles} />
          <FeaturedRecitations recitations={featuredRecitations} />
          <MediaHighlight settings={settings} />
        </>
      )}

      {/* Contact CTA */}
      <section className="border-t border-secondary/20 bg-primary/5 py-10 md:py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex items-center justify-center gap-3 opacity-40">
              <div className="h-px w-16 bg-secondary" />
              <div className="size-1.5 rounded-full bg-secondary" />
              <div className="h-px w-16 bg-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Write to {personName}
            </h2>
            <p className="mt-4 text-muted-foreground">
              Have questions, need guidance, or want to book a service? Don't
              hesitate to reach out.
            </p>
            <Link to="/contact" className="mt-6 inline-block">
              <Button size="lg" className="gap-2">
                <Mail className="size-4" />
                Contact
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
