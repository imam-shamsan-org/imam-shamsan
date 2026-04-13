import type { Article, ArticleSummary } from '@/types/article'
import type { SiteSettings } from '@/types/settings'
import { PERSON_NAME, PERSON_NAME_AR, PERSON_NAME_FULL } from '@/lib/constants'

export const siteConfig = {
  name: PERSON_NAME_FULL,
  description: `Official website of ${PERSON_NAME_FULL} - Islamic scholar, educator, and community leader. Explore writings, sermons, services, and more.`,
  url: process.env.SITE_URL || 'https://imamshamsan.com',
  author: PERSON_NAME_FULL,
  locale: 'en_US',
  youtubeChannel: 'UCHsyLCyXVM8L25qwS7h9Gjg',
}

const defaultOgImage = `${siteConfig.url}/og-image.jpg`

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
    ogImage = defaultOgImage,
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
    { property: 'og:image', content: ogImage },
    { property: 'og:locale', content: siteConfig.locale },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
  ]

  const links: Array<LinkTag> = [{ rel: 'canonical', href: url }]

  return { meta, links }
}

export function getHomeMeta(_settings?: SiteSettings): HeadConfig {
  const description = `Official website of ${PERSON_NAME_FULL} - Islamic scholar, educator, and community leader. Explore writings, sermons, services, and more.`
  return getPageMeta({
    title: PERSON_NAME_FULL,
    description,
    canonicalUrl: siteConfig.url,
    ogType: 'website',
  })
}

export function getAboutMeta(_settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'About',
    description: `Learn about ${PERSON_NAME_FULL} - his education, ijazaat, specializations, and journey as an Islamic scholar and community leader.`,
    canonicalUrl: `${siteConfig.url}/about`,
  })
}

export function getServicesMeta(_settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Services',
    description: `Book services with ${PERSON_NAME_FULL} - Nikah ceremonies, funeral services, Quran tutoring, counseling, and more.`,
    canonicalUrl: `${siteConfig.url}/services`,
  })
}

export function getWritingsListMeta(_settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Writings',
    description: `Writings and reflections by ${PERSON_NAME_FULL} on Islamic knowledge, Quran commentary, and spiritual guidance.`,
    canonicalUrl: `${siteConfig.url}/writings`,
  })
}

export function getSermonsListMeta(_settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Sermon Summaries',
    description: `Written summaries of Friday khutbahs and sermons by ${PERSON_NAME_FULL}.`,
    canonicalUrl: `${siteConfig.url}/sermons`,
  })
}

export function getMediaMeta(_settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Media',
    description: `Watch sermons, recitations, and live streams from ${PERSON_NAME_FULL}.`,
    canonicalUrl: `${siteConfig.url}/media`,
  })
}

export function getGalleryMeta(_settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Gallery',
    description: `Photos from events, conferences, community programs, and more with ${PERSON_NAME_FULL}.`,
    canonicalUrl: `${siteConfig.url}/gallery`,
  })
}

export function getContactMeta(_settings?: SiteSettings): HeadConfig {
  return getPageMeta({
    title: 'Contact',
    description: `Get in touch with ${PERSON_NAME_FULL} for bookings, inquiries, or community services.`,
    canonicalUrl: `${siteConfig.url}/contact`,
  })
}

export function getArticleMeta(
  article: Article | ArticleSummary,
  _settings?: SiteSettings,
): HeadConfig {
  const description =
    article.description || `Read "${article.title}" by ${PERSON_NAME_FULL}.`
  const ogImage = article.coverImage || defaultOgImage
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
