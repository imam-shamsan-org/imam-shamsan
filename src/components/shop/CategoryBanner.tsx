import { useState } from 'react'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'

interface CategoryBannerProps {
  imageUrl: string | null
  alt?: string
}

export function CategoryBanner({ imageUrl, alt = '' }: CategoryBannerProps) {
  const [hasError, setHasError] = useState(false)

  if (!imageUrl || hasError) return null

  return (
    <div className="aspect-[21/9] w-full overflow-hidden">
      <CloudinaryImage
        src={imageUrl}
        alt={alt}
        preset="article-cover"
        loading="eager"
        // CloudinaryImage spreads {...props} AFTER its own internal onError,
        // so this replaces its handler entirely — deliberate, to avoid its
        // grey "No image" placeholder and unmount to null instead.
        onError={() => setHasError(true)}
        // SSR: the browser can fetch and fail the image before hydration
        // attaches the onError listener above, in which case the error
        // event is lost. Catch that case on mount by checking whether the
        // element already finished loading with no natural size.
        ref={(img: HTMLImageElement | null) => {
          if (img && img.complete && img.naturalWidth === 0) {
            setHasError(true)
          }
        }}
        className="h-full w-full"
      />
    </div>
  )
}
