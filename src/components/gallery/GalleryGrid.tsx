import type { GalleryImage } from '@/types/gallery'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'

interface GalleryGridProps {
  images: Array<GalleryImage>
  onImageClick: (index: number) => void
}

export function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  if (!images.length) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No photos available.
      </div>
    )
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {images.map((image, index) => (
        <button
          key={image.id}
          onClick={() => onImageClick(index)}
          aria-label={`View ${image.caption || 'photo'} in lightbox`}
          className="mb-4 block w-full overflow-hidden rounded-lg ring-1 ring-foreground/10 transition-all hover:ring-primary/30 hover:shadow-md cursor-pointer break-inside-avoid"
        >
          <CloudinaryImage
            src={image.imageUrl}
            alt={image.caption}
            preset="gallery-thumb"
            className="w-full h-auto"
          />
          {image.caption && (
            <div className="p-2 text-sm text-muted-foreground text-center">
              {image.caption}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
