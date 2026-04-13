import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, Radio, Youtube } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/shared/FadeIn'
import { getActiveRecitations, getSiteSettings } from '@/lib/notion'
import { getBreadcrumbSchema, getMediaMeta, siteConfig } from '@/lib/seo'
import { getStreamStatus, getYouTubeEmbedUrl } from '@/lib/youtube'

export const Route = createFileRoute('/media')({
  loader: async () => {
    const [settings, recitations] = await Promise.all([
      getSiteSettings(),
      getActiveRecitations(),
    ])
    return { settings, recitations }
  },
  head: ({ loaderData }) => {
    const { meta, links } = getMediaMeta(loaderData?.settings)
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Media', url: `${siteConfig.url}/media` },
          ]),
        },
      ],
    }
  },
  component: MediaPage,
})

function MediaPage() {
  const { settings, recitations } = Route.useLoaderData()

  const liveStreamUrl = settings.live_stream_url?.value
  const liveStreamTitle =
    settings.live_stream_title?.value || 'Weekly Live Stream'
  const youtubeChannelUrl =
    settings.youtube_url?.value ||
    'https://www.youtube.com/channel/UCHsyLCyXVM8L25qwS7h9Gjg'
  const embedUrl = liveStreamUrl ? getYouTubeEmbedUrl(liveStreamUrl) : null
  const { isLive, timeAgo } = getStreamStatus(
    settings.live_stream_url?.updatedAt,
    settings.live_stream_url?.duration,
  )

  return (
    <>
      <section className="bg-gradient-to-b from-accent/50 to-background py-8 md:py-12">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                <span className="text-primary">Media</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Sermons, recitations, live streams, and more
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
          <div className="space-y-10 md:space-y-16">
            {/* Live Stream Section */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Radio className="size-6 text-red-500" />
                <h2 className="text-2xl font-bold text-foreground">
                  Live Stream
                </h2>
                {embedUrl && isLive && (
                  <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                    </span>
                    LIVE
                  </span>
                )}
                {embedUrl && !isLive && timeAgo && (
                  <span className="text-sm text-muted-foreground">
                    {timeAgo}
                  </span>
                )}
              </div>
              {embedUrl ? (
                <div className="mx-auto max-w-3xl">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">
                    {liveStreamTitle}
                  </h3>
                  <div className="aspect-video overflow-hidden rounded-xl ring-1 ring-foreground/10">
                    <iframe
                      src={embedUrl}
                      title={liveStreamTitle}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-muted/50 p-8 text-center">
                  <p className="text-muted-foreground">
                    No live stream scheduled at this time. Check back for the
                    next weekly broadcast.
                  </p>
                </div>
              )}
            </div>

            {/* Recitations Section */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <BookOpen className="size-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  Qur'anic Recitations
                </h2>
              </div>
              {recitations.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-3">
                  {recitations.map((recitation) => {
                    const recitationEmbed = getYouTubeEmbedUrl(
                      recitation.youtubeLink,
                    )
                    if (!recitationEmbed) return null
                    return (
                      <div key={recitation.id}>
                        <h3 className="mb-3 text-base font-semibold text-foreground">
                          {recitation.title}
                        </h3>
                        <div className="aspect-video overflow-hidden rounded-xl ring-1 ring-foreground/10">
                          <iframe
                            src={recitationEmbed}
                            title={recitation.title}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-xl bg-muted/50 p-8 text-center">
                  <p className="text-muted-foreground">
                    Recitations will be available soon. Stay tuned!
                  </p>
                </div>
              )}
            </div>

            {/* YouTube Channel Banner */}
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl bg-card ring-1 ring-foreground/10 px-6 py-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <Youtube className="size-5 text-red-500" />
                <span className="text-sm font-medium text-foreground">
                  Subscribe to our YouTube channel for all sermons & lectures
                </span>
              </div>
              <span className="text-sm font-medium text-primary">
                Visit Channel &rarr;
              </span>
            </a>
          </div>
        </Container>
      </section>
    </>
  )
}
