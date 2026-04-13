import { Link } from '@tanstack/react-router'
import { ArrowRight, Youtube } from 'lucide-react'
import type { SiteSettings } from '@/types/settings'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/shared/FadeIn'
import { getStreamStatus, getYouTubeEmbedUrl } from '@/lib/youtube'

interface MediaHighlightProps {
  settings: SiteSettings
}

export function MediaHighlight({ settings }: MediaHighlightProps) {
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
    <section className="border-t border-secondary/20 py-10 md:py-16">
      <Container>
        <FadeIn className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-6 w-[3px] rounded-full bg-secondary opacity-70" />
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                {embedUrl ? 'Live Stream' : 'Media'}
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
                <span className="text-sm text-muted-foreground">{timeAgo}</span>
              )}
            </div>
            <p className="mt-1 text-muted-foreground pl-[18px]">
              {embedUrl && isLive
                ? 'Watch the current live broadcast'
                : embedUrl
                  ? liveStreamTitle
                  : 'Watch sermons, recitations & live streams'}
            </p>
          </div>
          <Link
            to="/media"
            className="hidden text-sm font-medium text-primary hover:text-primary/80 transition-colors sm:flex items-center gap-1"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </FadeIn>

        {embedUrl ? (
          <FadeIn delay={100} distance={16}>
            <div className="mx-auto max-w-3xl">
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
          </FadeIn>
        ) : (
          <FadeIn delay={100} distance={16}>
            <div className="mx-auto max-w-3xl text-center">
              <div className="rounded-xl bg-gradient-to-b from-accent/40 to-muted/30 ring-1 ring-border p-12">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                  <Youtube className="size-8 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  Visit Our YouTube Channel
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Watch sermons, recitations, and educational content
                </p>
                <div className="mt-6">
                  <a
                    href={youtubeChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="gap-2">
                      <Youtube className="size-4" />
                      Watch on YouTube
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        )}
      </Container>
    </section>
  )
}
