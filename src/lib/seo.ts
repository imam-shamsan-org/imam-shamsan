import type { Article, ArticleSummary } from '@/types/article'
import type { SiteSettings } from '@/types/settings'
import { PERSON_NAME, PERSON_NAME_AR, PERSON_NAME_FULL } from '@/lib/constants'
import { getOptimizedUrl } from '@/lib/cloudinary'

export const siteConfig = {
  name: PERSON_NAME_FULL,
  description: `Official website of ${PERSON_NAME_FULL} - Islamic scholar, educator, and community leader. Explore writings, sermons, services, and more.`,
  url: process.env.SITE_URL || 'https://imam-shamsan.vercel.app',
  author: PERSON_NAME_FULL,
  locale: 'en_US',
  youtubeChannel: 'UCHsyLCyXVM8L25qwS7h9Gjg',
}

/**
 * Resolve the Notion-managed site-wide OG image (Settings database `og_image`
 * field) into an optimized Cloudinary URL, or undefined when unset.
 */
export function getSettingsOgImage(
  settings?: SiteSettings,
): string | undefined {
  const raw = settings?.og_image?.value
  if (!raw) return undefined
  return getOptimizedUrl(raw, 'article-cover')
}

interface MetaTag {
  name?: string
  property?: string
  content?: string
  charSet?: string
  title?: string
}

interface LinkTag {
  rel: string
  href: string
  type?: string
}

interface ScriptTag {
  type: string
  children: string
}

export interface HeadConfig {
  meta: Array<MetaTag>
  links: Array<LinkTag>
  scripts?: Array<ScriptTag>
}

export function getBaseMeta(): Array<MetaTag> {
  return [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: siteConfig.author },
  ]
}

export function getPageMeta(options: {
  title: string
  description: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
}): HeadConfig {
  const {
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType = 'website',
    noIndex = false,
  } = options

  const fullTitle =
    title === siteConfig.name ? title : `${title} | ${siteConfig.name}`
  const url = canonicalUrl || siteConfig.url

  const meta: Array<MetaTag> = [
    { title: fullTitle },
    { name: 'description', content: description },
    ...(noIndex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),

    // Open Graph
    { property: 'og:type', content: ogType },
    { property: 'og:site_name', content: siteConfig.name },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    ...(ogImage ? [{ property: 'og:image', content: ogImage }] : []),
    { property: 'og:locale', content: siteConfig.locale },

    // Twitter Card
    {
      name: 'twitter:card',
      content: ogImage ? 'summary_large_image' : 'summary',
    },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    ...(ogImage ? [{ name: 'twitter:image', content: ogImage }] : []),
  ]

  const links: Array<LinkTag> = [{ rel: 'canonical', href: url }]

  return { meta, links }
}

export function getHomeMeta(settings?: SiteSettings): HeadConfig {
  const description = `Official website of ${PERSON_NAME_FULL} - Islamic scholar, educator, and community leader. Explore writings, sermons, services, and more.`
  return getPageMeta({
    title: PERSON_NAME_FULL,
    description,
    canonicalUrl: siteConfig.url,
    ogType: 'website',
    ogImage: getSettingsOgImage(settings),
  })
}

export function getAboutMeta(settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'About',
    description: `Learn about ${PERSON_NAME_FULL} - his education, ijazaat, specializations, and journey as an Islamic scholar and community leader.`,
    canonicalUrl: `${siteConfig.url}/about`,
    ogImage: getSettingsOgImage(settings),
  })
}

export function getServicesMeta(settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Services',
    description: `Book services with ${PERSON_NAME_FULL} - Nikah ceremonies, funeral services, Quran tutoring, counseling, and more.`,
    canonicalUrl: `${siteConfig.url}/services`,
    ogImage: getSettingsOgImage(settings),
  })
}

export function getWritingsListMeta(settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Writings',
    description: `Writings and reflections by ${PERSON_NAME_FULL} on Islamic knowledge, Quran commentary, and spiritual guidance.`,
    canonicalUrl: `${siteConfig.url}/writings`,
    ogImage: getSettingsOgImage(settings),
  })
}

export function getSermonsListMeta(settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Sermon Summaries',
    description: `Written summaries of Friday khutbahs and sermons by ${PERSON_NAME_FULL}.`,
    canonicalUrl: `${siteConfig.url}/sermons`,
    ogImage: getSettingsOgImage(settings),
  })
}

export function getMediaMeta(settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Media',
    description: `Watch sermons, recitations, and live streams from ${PERSON_NAME_FULL}.`,
    canonicalUrl: `${siteConfig.url}/media`,
    ogImage: getSettingsOgImage(settings),
  })
}

export function getGalleryMeta(settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Gallery',
    description: `Photos from events, conferences, community programs, and more with ${PERSON_NAME_FULL}.`,
    canonicalUrl: `${siteConfig.url}/gallery`,
    ogImage: getSettingsOgImage(settings),
  })
}

export function getContactMeta(settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Contact',
    description: `Get in touch with ${PERSON_NAME_FULL} for bookings, inquiries, or community services.`,
    canonicalUrl: `${siteConfig.url}/contact`,
    ogImage: getSettingsOgImage(settings),
  })
}

export function getTermsMeta(settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Terms & Conditions',
    description: `Terms of use for ${PERSON_NAME_FULL}'s website, including how Shop orders and Humanitarian Aid contributions are handled.`,
    canonicalUrl: `${siteConfig.url}/terms`,
    ogImage: getSettingsOgImage(settings),
  })
}

export function getPrivacyMeta(settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Privacy Policy',
    description: `Privacy policy for ${PERSON_NAME_FULL}'s website, explaining what information is collected and how it is used.`,
    canonicalUrl: `${siteConfig.url}/privacy`,
    ogImage: getSettingsOgImage(settings),
  })
}

export function getArticleMeta(
  article: Article | ArticleSummary,
  settings?: SiteSettings,
): HeadConfig {
  const description =
    article.description || `Read "${article.title}" by ${PERSON_NAME_FULL}.`
  const ogImage = article.coverImage
    ? getOptimizedUrl(article.coverImage, 'article-cover')
    : getSettingsOgImage(settings)
  const canonicalUrl = `${siteConfig.url}/writings/${article.slug}`

  return getPageMeta({
    title: article.title,
    description,
    canonicalUrl,
    ogImage,
    ogType: 'article',
  })
}

export function getPersonSchema(_settings?: SiteSettings): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PERSON_NAME_FULL,
    alternateName: PERSON_NAME_AR,
    url: siteConfig.url,
    jobTitle: 'Imam & Islamic Scholar',
    description: siteConfig.description,
    sameAs: [`https://www.youtube.com/channel/${siteConfig.youtubeChannel}`],
  }
  return JSON.stringify(schema)
}

export function getArticleSchema(
  article: Article,
  _settings?: SiteSettings,
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.coverImage || undefined,
    author: {
      '@type': 'Person',
      name: PERSON_NAME_FULL,
    },
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    publisher: {
      '@type': 'Person',
      name: PERSON_NAME_FULL,
    },
    url: `${siteConfig.url}/writings/${article.slug}`,
    inLanguage: article.language === 'Arabic' ? 'ar' : 'en',
  }
  const cleanSchema = JSON.parse(JSON.stringify(schema))
  return JSON.stringify(cleanSchema)
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return JSON.stringify(schema)
}
