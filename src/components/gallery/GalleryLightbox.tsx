import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import type { GalleryImage } from '@/types/gallery'
import { getOptimizedUrl } from '@/lib/cloudinary'

interface GalleryLightboxProps {
  images: Array<GalleryImage>
  open: boolean
  index: number
  onClose: () => void
}

export function GalleryLightbox({
  images,
  open,
  index,
  onClose,
}: GalleryLightboxProps) {
  const slides = images.map((img) => ({
    src: getOptimizedUrl(img.imageUrl, 'gallery-full'),
    alt: img.caption,
  }))

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Zoom]}
    />
  )
}
