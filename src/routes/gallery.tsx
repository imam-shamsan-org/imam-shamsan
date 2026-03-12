import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/Container'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox'
import { getGalleryImages } from '@/lib/notion'
import { getGalleryMeta, getBreadcrumbSchema, siteConfig } from '@/lib/seo'
import { GALLERY_CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/gallery')({
  loader: async () => {
    const images = await getGalleryImages()
    return { images }
  },
  head: () => {
    const { meta, links } = getGalleryMeta()
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Gallery', url: `${siteConfig.url}/gallery` },
          ]),
        },
      ],
    }
  },
  component: GalleryPage,
})

function GalleryPage() {
  const { images } = Route.useLoaderData()
  const [category, setCategory] = useState('All')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const filtered =
    category === 'All'
      ? images
      : images.filter((img) => img.category === category)

  const handleImageClick = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <section className="bg-gradient-to-b from-accent/50 to-background py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              <span className="text-primary">Gallery</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Photos from events, conferences, and community programs
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
          {/* Category filter */}
          <div role="group" aria-label="Filter by category" className="mb-8 flex flex-wrap gap-2">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  category === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <GalleryGrid images={filtered} onImageClick={handleImageClick} />

          <GalleryLightbox
            images={filtered}
            open={lightboxOpen}
            index={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
          />
        </Container>
      </section>
    </>
  )
}
