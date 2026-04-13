import { Link } from '@tanstack/react-router'
import { ArrowRight, Music2, Play } from 'lucide-react'
import type { Recitation } from '@/types/recitation'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/shared/FadeIn'
import { getYouTubeThumbnail, getYouTubeVideoId } from '@/lib/youtube'

interface FeaturedRecitationsProps {
  recitations: Array<Recitation>
}

export function FeaturedRecitations({ recitations }: FeaturedRecitationsProps) {
  if (recitations.length === 0) return null

  return (
    <section className="border-t border-secondary/20 py-10 md:py-16">
      <Container>
        <FadeIn className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-6 w-[3px] rounded-full bg-secondary opacity-70" />
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Featured Recitations
              </h2>
            </div>
            <p className="mt-1 text-muted-foreground pl-[18px]">
              A curated selection of Imam Shamsan's recitations
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

        <div
          className={`grid gap-4 ${recitations.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : recitations.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}
        >
          {recitations.map((recitation, i) => {
            const thumbnail = getYouTubeThumbnail(recitation.youtubeLink)
            const videoId = getYouTubeVideoId(recitation.youtubeLink)
            const href = videoId
              ? `https://www.youtube.com/watch?v=${videoId}`
              : recitation.youtubeLink

            return (
              <FadeIn key={recitation.id} delay={i * 60} distance={16}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl overflow-hidden ring-1 ring-foreground/10 bg-card hover:ring-primary/40 transition-all duration-200"
                >
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={recitation.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-b from-accent/40 to-muted/30">
                        <Music2 className="size-10 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex size-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                        <Play className="size-5 fill-primary text-primary ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {recitation.title}
                    </p>
                  </div>
                </a>
              </FadeIn>
            )
          })}
        </div>

        <FadeIn className="mt-6 text-center sm:hidden">
          <Link
            to="/media"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
          >
            View all recitations
            <ArrowRight className="size-4" />
          </Link>
        </FadeIn>
      </Container>
    </section>
  )
}
