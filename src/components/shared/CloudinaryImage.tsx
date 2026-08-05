import { useState } from 'react'
import type { ImagePreset } from '@/lib/cloudinary'
import { cn } from '@/lib/utils'
import { getOptimizedUrl, getSrcSet } from '@/lib/cloudinary'

interface CloudinaryImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src'
> {
  src: string
  alt: string
  preset?: ImagePreset
  sizes?: string
  ref?: React.Ref<HTMLImageElement>
}

export function CloudinaryImage({
  src,
  alt,
  preset = 'card',
  sizes,
  className,
  ...props
}: CloudinaryImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className,
        )}
      >
        <span className="text-sm">No image</span>
      </div>
    )
  }

  const optimizedUrl = getOptimizedUrl(src, preset)
  const srcSet = getSrcSet(src, preset)

  return (
    <img
      src={optimizedUrl}
      srcSet={srcSet || undefined}
      sizes={sizes}
      alt={alt}
      className={cn('h-full w-full object-cover', className)}
      loading="lazy"
      onError={() => setHasError(true)}
      {...props}
    />
  )
}
