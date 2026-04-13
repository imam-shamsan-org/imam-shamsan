export type ImagePreset =
  | 'thumbnail'
  | 'hero'
  | 'card'
  | 'article-cover'
  | 'article-body'
  | 'gallery-thumb'
  | 'gallery-full'
  | 'avatar'
  | 'favicon'
  | 'apple-touch-icon'

interface PresetConfig {
  width: number
  height?: number
  crop?: 'fill' | 'fit' | 'scale'
}

const presets: Record<ImagePreset, PresetConfig> = {
  thumbnail: { width: 400, height: 300, crop: 'fill' },
  card: { width: 600, height: 400, crop: 'fill' },
  hero: { width: 1200, height: 800, crop: 'fill' },
  'article-cover': { width: 1200, height: 630, crop: 'fill' },
  'article-body': { width: 720 },
  'gallery-thumb': { width: 400, height: 400, crop: 'fill' },
  'gallery-full': { width: 1400 },
  avatar: { width: 200, height: 200, crop: 'fill' },
  favicon: { width: 48, height: 48, crop: 'fit' },
  'apple-touch-icon': { width: 180, height: 180, crop: 'fit' },
}

const CLOUDINARY_REGEX =
  /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(.*)/
const TRANSFORM_PREFIX = /^(w_|h_|c_|q_|f_|ar_|g_|dpr_|e_|l_|fl_|t_)/

/** Extract cloud name and clean image path from a Cloudinary URL */
function parseCloudinaryUrl(
  url: string,
): { cloudName: string; imagePath: string } | null {
  if (!url || typeof url !== 'string') return null
  const match = url.match(CLOUDINARY_REGEX)
  if (!match) return null

  const [, cloudName, pathWithTransforms] = match
  const pathParts = pathWithTransforms.split('/')
  const firstNonTransformIndex = pathParts.findIndex(
    (part) => !TRANSFORM_PREFIX.test(part) && !part.includes(','),
  )

  const imagePath =
    firstNonTransformIndex === -1
      ? pathParts.join('/')
      : pathParts.slice(firstNonTransformIndex).join('/')

  return { cloudName, imagePath }
}

/** Build a Cloudinary URL with specific transforms */
function buildUrl(
  cloudName: string,
  imagePath: string,
  transforms: Array<string>,
): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${imagePath}`
}

/**
 * Transform a Cloudinary URL with optimization parameters
 */
export function getOptimizedUrl(url: string, preset: ImagePreset): string {
  const parsed = parseCloudinaryUrl(url)
  if (!parsed) return url || ''

  const config = presets[preset]
  const transforms = [`w_${config.width}`]
  if (config.height) transforms.push(`h_${config.height}`)
  if (config.crop) transforms.push(`c_${config.crop}`)
  transforms.push('q_auto', 'f_auto')

  return buildUrl(parsed.cloudName, parsed.imagePath, transforms)
}

/**
 * Generate srcSet string for responsive images
 */
export function getSrcSet(url: string, preset: ImagePreset): string {
  const parsed = parseCloudinaryUrl(url)
  if (!parsed) return ''

  const config = presets[preset]
  const widths = [
    Math.round(config.width * 0.5),
    config.width,
    Math.round(config.width * 1.5),
  ]

  return widths
    .map((w) => {
      const transforms = [`w_${w}`]
      if (config.height)
        transforms.push(`h_${Math.round(config.height * (w / config.width))}`)
      if (config.crop) transforms.push(`c_${config.crop}`)
      transforms.push('q_auto', 'f_auto')
      return `${buildUrl(parsed.cloudName, parsed.imagePath, transforms)} ${w}w`
    })
    .join(', ')
}

/**
 * Get a blur placeholder URL for loading states
 */
/**
 * Check if a URL points to a PDF file
 */
export function isPdfUrl(url: string): boolean {
  return url.toLowerCase().includes('.pdf')
}

/**
 * Get a JPG thumbnail of the first page of a Cloudinary-hosted PDF.
 * Inserts `f_jpg,pg_1` after `/upload/`.
 */
export function getPdfThumbnailUrl(url: string): string {
  return url.replace(/\/upload\//, '/upload/f_jpg,pg_1/')
}

/**
 * Get a poster-optimised Cloudinary URL (for image posters on cards).
 */
export function getPosterCardUrl(url: string): string {
  return url.replace(/\/upload\//, '/upload/w_400,q_auto,f_auto/')
}

/**
 * Get a full-size optimised Cloudinary image URL (for modal display).
 */
export function getPosterFullUrl(url: string): string {
  return url.replace(/\/upload\//, '/upload/w_1200,q_auto,f_auto/')
}

export function getBlurPlaceholder(url: string): string {
  const parsed = parseCloudinaryUrl(url)
  if (!parsed) return url || ''

  return buildUrl(parsed.cloudName, parsed.imagePath, [
    'w_50',
    'h_50',
    'c_fill',
    'q_auto',
    'f_auto',
    'e_blur:1000',
  ])
}
