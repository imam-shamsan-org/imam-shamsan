import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { parseBlocksToContent } from './parsers'
import type {
  BlockObjectResponse,
  ListBlockChildrenResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import type { Article, ArticleSummary } from '@/types/article'
import type { Service } from '@/types/service'
import type { Sermon, SermonSummary } from '@/types/sermon'
import type { GalleryImage } from '@/types/gallery'
import type { Recitation } from '@/types/recitation'
import type { SiteSettings } from '@/types/settings'
import type { AboutPage } from '@/types/about'
import type {
  HumanitarianCase,
  HumanitarianProject,
} from '@/types/humanitarian'
import { slugify } from '@/lib/utils'

/** Response shape from Notion's POST /databases/{id}/query endpoint */
interface QueryDatabaseResponse {
  results: Array<PageObjectResponse | { object: 'page'; id: string }>
  has_more: boolean
  next_cursor: string | null
}

const NOTION_API_VERSION = '2022-06-28'

// ── In-memory TTL cache ──────────────────────────────────────
// Prevents hitting Notion's 3 req/s rate limit and speeds up responses.

const CACHE_TTL_MS = 60 * 1000 // 1 minute

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const cache = new Map<string, CacheEntry<unknown>>()

function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return undefined
  }
  return entry.data as T
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

function withCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const cached = getCached<T>(key)
  if (cached !== undefined) return Promise.resolve(cached)
  return fn().then((result) => {
    setCache(key, result)
    return result
  })
}

function getApiKey(): string {
  return process.env.NOTION_API_KEY || ''
}

function getDbId(key: string): string {
  return process.env[key] || ''
}

function isNotionConfigured(): boolean {
  return Boolean(process.env.NOTION_API_KEY)
}

async function notionFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const apiKey = getApiKey()
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Notion-Version': NOTION_API_VERSION,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Notion API error: ${response.status} - ${error}`)
  }

  return response.json() as Promise<T>
}

async function queryDatabase(
  databaseId: string,
  body: object,
): Promise<QueryDatabaseResponse> {
  return notionFetch<QueryDatabaseResponse>(`/databases/${databaseId}/query`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

async function getBlockChildren(
  blockId: string,
  startCursor?: string,
): Promise<ListBlockChildrenResponse> {
  const params = new URLSearchParams({ page_size: '100' })
  if (startCursor) params.set('start_cursor', startCursor)
  return notionFetch<ListBlockChildrenResponse>(
    `/blocks/${blockId}/children?${params}`,
  )
}

function getPropertyValue(
  property: PageObjectResponse['properties'][string] | undefined,
): unknown {
  if (!property) return null

  switch (property.type) {
    case 'title':
      return property.title.map((t) => t.plain_text).join('')
    case 'rich_text':
      return property.rich_text.map((t) => t.plain_text).join('')
    case 'number':
      return property.number
    case 'select':
      return property.select?.name
    case 'multi_select':
      return property.multi_select.map((s) => s.name)
    case 'url':
      return property.url
    case 'checkbox':
      return property.checkbox
    case 'date':
      return property.date?.start
    case 'files':
      return property.files.map((f) => {
        if (f.type === 'file') return f.file.url
        if (f.type === 'external') return f.external.url
        return ''
      })
    case 'created_time':
      return property.created_time
    case 'last_edited_time':
      return property.last_edited_time
    default:
      return null
  }
}

function getImageUrl(
  props: PageObjectResponse['properties'],
  propertyName: string,
): string {
  const prop = props[propertyName]
  if (!prop) return ''

  if (prop.type === 'url') {
    return prop.url || ''
  }
  if (prop.type === 'files' && prop.files.length > 0) {
    const file = prop.files[0]
    if (file.type === 'file') return file.file.url
    if (file.type === 'external') return file.external.url
  }
  return ''
}

async function getAllBlockChildren(
  pageId: string,
): Promise<Array<BlockObjectResponse>> {
  if (!isNotionConfigured()) return []

  try {
    const allBlocks: Array<BlockObjectResponse> = []

    async function fetchBlocksRecursively(blockId: string): Promise<void> {
      let cursor: string | undefined

      do {
        const response = await getBlockChildren(blockId, cursor)

        for (const block of response.results) {
          if ('type' in block) {
            const typedBlock = block
            allBlocks.push(typedBlock)

            if ((typedBlock as Record<string, unknown>).has_children) {
              await fetchBlocksRecursively(typedBlock.id)
            }
          }
        }

        cursor = response.has_more
          ? (response.next_cursor ?? undefined)
          : undefined
      } while (cursor)
    }

    await fetchBlocksRecursively(pageId)
    return allBlocks
  } catch (error) {
    console.error('Error fetching blocks from Notion:', error)
    return []
  }
}

// ── Articles ──────────────────────────────────────────────

function pageToArticleSummary(page: PageObjectResponse): ArticleSummary {
  const props = page.properties
  return {
    id: page.id,
    slug: (getPropertyValue(props['Slug']) as string) || '',
    title: (getPropertyValue(props['Title']) as string) || '',
    description: (getPropertyValue(props['Description']) as string) || '',
    coverImage: getImageUrl(props, 'Cover Image'),
    language:
      (getPropertyValue(props['Language']) as ArticleSummary['language']) ||
      'English',
    category: (getPropertyValue(props['Category']) as string) || '',
    tags: (getPropertyValue(props['Tags']) as Array<string>) || [],
    featured: (getPropertyValue(props['Featured']) as boolean) || false,
    createdAt: (getPropertyValue(props['Created time']) as string) || '',
    updatedAt: (getPropertyValue(props['Last edited time']) as string) || '',
  }
}

async function pageToArticle(page: PageObjectResponse): Promise<Article> {
  const summary = pageToArticleSummary(page)
  const blocks = await getAllBlockChildren(page.id)
  const content = parseBlocksToContent(blocks)
  return { ...summary, content }
}

async function fetchPublishedArticles(options?: {
  language?: string
  category?: string
  limit?: number
}): Promise<Array<ArticleSummary>> {
  const databaseId = getDbId('NOTION_ARTICLES_DATABASE_ID')
  if (!isNotionConfigured() || !databaseId) return []

  const cacheKey = `articles:${options?.language ?? 'all'}:${options?.category ?? 'all'}:${options?.limit ?? 'all'}`
  return withCache(cacheKey, async () => {
    try {
      const filters: Array<object> = [
        { property: 'Status', select: { equals: 'Published' } },
      ]
      if (options?.language && options.language !== 'All') {
        filters.push({
          property: 'Language',
          select: { equals: options.language },
        })
      }
      if (options?.category && options.category !== 'All') {
        filters.push({
          property: 'Category',
          select: { equals: options.category },
        })
      }

      const response = await queryDatabase(databaseId, {
        filter: filters.length === 1 ? filters[0] : { and: filters },
        sorts: [{ timestamp: 'created_time', direction: 'descending' }],
        ...(options?.limit ? { page_size: options.limit } : {}),
      })

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(pageToArticleSummary)
    } catch (error) {
      console.error('Error fetching articles:', error)
      return []
    }
  })
}

async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const databaseId = getDbId('NOTION_ARTICLES_DATABASE_ID')
  if (!isNotionConfigured() || !databaseId) return null

  try {
    const response = await queryDatabase(databaseId, {
      filter: {
        and: [
          { property: 'Slug', rich_text: { equals: slug } },
          { property: 'Status', select: { equals: 'Published' } },
        ],
      },
    })

    const page = response.results[0]
    if (!page || !('properties' in page)) return null

    return pageToArticle(page)
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

// ── Services ──────────────────────────────────────────────

function pageToService(page: PageObjectResponse): Service {
  const props = page.properties
  return {
    id: page.id,
    nameEn: (getPropertyValue(props['Name EN']) as string) || '',
    nameAr: (getPropertyValue(props['Name AR']) as string) || '',
    description: (getPropertyValue(props['Description']) as string) || '',
    priceDisplay: (getPropertyValue(props['Price Display']) as string) || '',
    priceNote: (getPropertyValue(props['Price Note']) as string) || '',
    icon: (getPropertyValue(props['Icon']) as string) || '',
    order: (getPropertyValue(props['Order']) as number) || 0,
    status:
      (getPropertyValue(props['Status']) as 'Active' | 'Inactive') || 'Active',
  }
}

async function fetchActiveServices(): Promise<Array<Service>> {
  const databaseId = getDbId('NOTION_SERVICES_DATABASE_ID')
  if (!isNotionConfigured() || !databaseId) return []

  return withCache('services:active', async () => {
    try {
      const response = await queryDatabase(databaseId, {
        filter: { property: 'Status', select: { equals: 'Active' } },
        sorts: [{ property: 'Order', direction: 'ascending' }],
      })

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(pageToService)
    } catch (error) {
      console.error('Error fetching services:', error)
      return []
    }
  })
}

// ── Sermons ──────────────────────────────────────────────

function pageToSermonSummary(page: PageObjectResponse): SermonSummary {
  const props = page.properties
  return {
    id: page.id,
    title: (getPropertyValue(props['Title']) as string) || '',
    slug: (getPropertyValue(props['Slug']) as string) || '',
    description: (getPropertyValue(props['Description']) as string) || '',
    youtubeLink:
      (getPropertyValue(props['YouTube Link']) as string) || undefined,
    date: (getPropertyValue(props['Date']) as string) || '',
    createdAt: (getPropertyValue(props['Created time']) as string) || '',
  }
}

async function pageToSermon(page: PageObjectResponse): Promise<Sermon> {
  const summary = pageToSermonSummary(page)
  const blocks = await getAllBlockChildren(page.id)
  const content = parseBlocksToContent(blocks)
  return { ...summary, content }
}

async function fetchPublishedSermons(
  limit?: number,
): Promise<Array<SermonSummary>> {
  const databaseId = getDbId('NOTION_SERMONS_DATABASE_ID')
  if (!isNotionConfigured() || !databaseId) return []

  return withCache(`sermons:${limit ?? 'all'}`, async () => {
    try {
      const response = await queryDatabase(databaseId, {
        filter: { property: 'Status', select: { equals: 'Published' } },
        sorts: [{ property: 'Date', direction: 'descending' }],
        ...(limit ? { page_size: limit } : {}),
      })

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(pageToSermonSummary)
    } catch (error) {
      console.error('Error fetching sermons:', error)
      return []
    }
  })
}

async function fetchSermonBySlug(slug: string): Promise<Sermon | null> {
  const databaseId = getDbId('NOTION_SERMONS_DATABASE_ID')
  if (!isNotionConfigured() || !databaseId) return null

  try {
    const response = await queryDatabase(databaseId, {
      filter: {
        and: [
          { property: 'Slug', rich_text: { equals: slug } },
          { property: 'Status', select: { equals: 'Published' } },
        ],
      },
    })

    const page = response.results[0]
    if (!page || !('properties' in page)) return null

    return pageToSermon(page)
  } catch (error) {
    console.error('Error fetching sermon:', error)
    return null
  }
}

// ── Gallery ──────────────────────────────────────────────

function pageToGalleryImage(page: PageObjectResponse): GalleryImage {
  const props = page.properties
  return {
    id: page.id,
    caption: (getPropertyValue(props['Caption']) as string) || '',
    imageUrl: getImageUrl(props, 'Image URL'),
    category: (getPropertyValue(props['Category']) as string) || '',
    order: (getPropertyValue(props['Order']) as number) || 0,
    featured: (getPropertyValue(props['Featured']) as boolean) || false,
    status:
      (getPropertyValue(props['Status']) as 'Active' | 'Inactive') || 'Active',
  }
}

async function fetchActiveGalleryImages(
  category?: string,
): Promise<Array<GalleryImage>> {
  const databaseId = getDbId('NOTION_GALLERY_DATABASE_ID')
  if (!isNotionConfigured() || !databaseId) return []

  return withCache(`gallery:${category ?? 'all'}`, async () => {
    try {
      const filters: Array<object> = [
        { property: 'Status', select: { equals: 'Active' } },
      ]
      if (category && category !== 'All') {
        filters.push({ property: 'Category', select: { equals: category } })
      }

      const response = await queryDatabase(databaseId, {
        filter: filters.length === 1 ? filters[0] : { and: filters },
        sorts: [{ property: 'Order', direction: 'ascending' }],
      })

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(pageToGalleryImage)
    } catch (error) {
      console.error('Error fetching gallery:', error)
      return []
    }
  })
}

// ── Recitations ──────────────────────────────────────────

function pageToRecitation(page: PageObjectResponse): Recitation {
  const props = page.properties
  return {
    id: page.id,
    title: (getPropertyValue(props['Title']) as string) || '',
    youtubeLink: (getPropertyValue(props['YouTube Link']) as string) || '',
    order: (getPropertyValue(props['Order']) as number) || 0,
    featured: (getPropertyValue(props['Featured']) as boolean) || false,
  }
}

async function fetchActiveRecitations(): Promise<Array<Recitation>> {
  const databaseId = getDbId('NOTION_RECITATIONS_DATABASE_ID')
  if (!isNotionConfigured() || !databaseId) return []

  return withCache('recitations', async () => {
    try {
      const response = await queryDatabase(databaseId, {
        sorts: [{ property: 'Order', direction: 'ascending' }],
      })

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(pageToRecitation)
    } catch (error) {
      console.error('Error fetching recitations:', error)
      return []
    }
  })
}

async function fetchFeaturedRecitations(): Promise<Array<Recitation>> {
  const databaseId = getDbId('NOTION_RECITATIONS_DATABASE_ID')
  if (!isNotionConfigured() || !databaseId) return []

  return withCache('recitations-featured', async () => {
    try {
      const response = await queryDatabase(databaseId, {
        filter: { property: 'Featured', checkbox: { equals: true } },
        sorts: [{ property: 'Order', direction: 'ascending' }],
      })

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(pageToRecitation)
        .slice(0, 4)
    } catch (error) {
      console.error('Error fetching featured recitations:', error)
      return []
    }
  })
}

// ── Site Settings ──────────────────────────────────────────

async function fetchSiteSettings(): Promise<SiteSettings> {
  const databaseId = getDbId('NOTION_SETTINGS_DATABASE_ID')
  if (!isNotionConfigured() || !databaseId) return {}

  return withCache('settings', async () => {
    try {
      const response = await queryDatabase(databaseId, {})
      const settings: SiteSettings = {}

      for (const page of response.results) {
        if (!('properties' in page)) continue
        const p = page
        const key = (getPropertyValue(p.properties['Key']) as string) || ''
        const value = (getPropertyValue(p.properties['Value']) as string) || ''
        const updatedAt =
          (getPropertyValue(p.properties['Last edited time']) as string) || ''
        const duration =
          (getPropertyValue(p.properties['Duration']) as string) || undefined
        if (key) settings[key] = { value, updatedAt, duration }
      }

      return settings
    } catch (error) {
      console.error('Error fetching site settings:', error)
      return {}
    }
  })
}

// ── About Page ──────────────────────────────────────────

async function fetchAboutPage(): Promise<AboutPage | null> {
  const databaseId = getDbId('NOTION_ABOUT_DATABASE_ID')
  if (!isNotionConfigured() || !databaseId) return null

  return withCache('about', async () => {
    try {
      const response = await queryDatabase(databaseId, {
        filter: { property: 'Status', select: { equals: 'Published' } },
        page_size: 1,
      })

      const page = response.results[0]
      if (!page || !('properties' in page)) return null

      const p = page
      const props = p.properties

      const blocks = await getAllBlockChildren(p.id)
      const content = parseBlocksToContent(blocks)

      return {
        id: p.id,
        title: (getPropertyValue(props['Title']) as string) || '',
        subtitleAr: (getPropertyValue(props['Subtitle AR']) as string) || '',
        content,
      }
    } catch (error) {
      console.error('Error fetching about page:', error)
      return null
    }
  })
}

// ── Server Functions (exported for routes) ──────────────────

export const getPublishedArticles = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z
      .object({
        language: z.string().optional(),
        category: z.string().optional(),
        limit: z.number().int().positive().optional(),
      })
      .optional(),
  )
  .handler(async ({ data }) => {
    return fetchPublishedArticles(data ?? {})
  })

export const getArticleBySlug = createServerFn({
  method: 'GET',
})
  .inputValidator(z.string().min(1).max(500))
  .handler(async ({ data: slug }) => {
    return fetchArticleBySlug(slug)
  })

export const getActiveServices = createServerFn({
  method: 'GET',
}).handler(async () => {
  return fetchActiveServices()
})

export const getPublishedSermons = createServerFn({
  method: 'GET',
})
  .inputValidator(z.number().int().positive().optional())
  .handler(async ({ data: limit }) => {
    return fetchPublishedSermons(limit ?? undefined)
  })

export const getSermonBySlug = createServerFn({
  method: 'GET',
})
  .inputValidator(z.string().min(1).max(500))
  .handler(async ({ data: slug }) => {
    return fetchSermonBySlug(slug)
  })

export const getGalleryImages = createServerFn({
  method: 'GET',
})
  .inputValidator(z.string().optional())
  .handler(async ({ data: category }) => {
    return fetchActiveGalleryImages(category ?? undefined)
  })

export const getActiveRecitations = createServerFn({
  method: 'GET',
}).handler(async () => {
  return fetchActiveRecitations()
})

export const getFeaturedRecitations = createServerFn({
  method: 'GET',
}).handler(async () => {
  return fetchFeaturedRecitations()
})

export const getSiteSettings = createServerFn({
  method: 'GET',
}).handler(async () => {
  return fetchSiteSettings()
})

export const getLatestArticles = createServerFn({
  method: 'GET',
})
  .inputValidator(z.number().int().positive())
  .handler(async ({ data: limit }) => {
    return fetchPublishedArticles({ limit })
  })

export const getFeaturedArticles = createServerFn({
  method: 'GET',
})
  .inputValidator(z.number().int().positive())
  .handler(async ({ data: limit }) => {
    const databaseId = getDbId('NOTION_ARTICLES_DATABASE_ID')
    if (!isNotionConfigured() || !databaseId) return []

    try {
      const response = await queryDatabase(databaseId, {
        filter: {
          and: [
            { property: 'Status', select: { equals: 'Published' } },
            { property: 'Featured', checkbox: { equals: true } },
          ],
        },
        sorts: [{ timestamp: 'created_time', direction: 'descending' }],
        page_size: limit,
      })

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(pageToArticleSummary)
    } catch (error) {
      console.error('Error fetching featured articles:', error)
      return []
    }
  })

export const getAboutPage = createServerFn({
  method: 'GET',
}).handler(async () => {
  return fetchAboutPage()
})

// ── Humanitarian Projects ──────────────────────────────────────

function pageToHumanitarianProject(
  page: PageObjectResponse,
): HumanitarianProject {
  const props = page.properties
  return {
    id: page.id,
    slug: (getPropertyValue(props['Slug']) as string) || '',
    title: (getPropertyValue(props['Name']) as string) || '',
    titleAr: (getPropertyValue(props['Name (Arabic)']) as string) || '',
    description: (getPropertyValue(props['Description']) as string) || '',
    descriptionAr:
      (getPropertyValue(props['Description (Arabic)']) as string) || '',
    category: ((getPropertyValue(props['Category']) as string) ||
      'Medical') as HumanitarianProject['category'],
    icon: (getPropertyValue(props['Icon']) as string) || '',
    hasCases: (getPropertyValue(props['Has Cases']) as boolean) || false,
    sortOrder: (getPropertyValue(props['Sort Order']) as number) || 0,
    status: ((getPropertyValue(props['Status']) as string) ||
      'Active') as HumanitarianProject['status'],
  }
}

function pageToHumanitarianCase(page: PageObjectResponse): HumanitarianCase {
  const props = page.properties
  const caseNumber = (getPropertyValue(props['Case Number']) as number) || 0
  const title = (getPropertyValue(props['Name']) as string) || ''

  return {
    id: page.id,
    slug: `case-${caseNumber}-${slugify(title).slice(0, 60)}`,
    caseNumber,
    title,
    projectId: (getPropertyValue(props['Project Slug']) as string) || '',
    urgency: ((getPropertyValue(props['Urgency']) as string) ||
      'Ongoing') as HumanitarianCase['urgency'],
    posterUrl: (getPropertyValue(props['Poster URL']) as string) || null,
    status: ((getPropertyValue(props['Status']) as string) ||
      'Published') as HumanitarianCase['status'],
  }
}

async function fetchActiveHumanitarianProjects(): Promise<
  Array<HumanitarianProject>
> {
  const databaseId = getDbId('NOTION_HUMANITARIAN_PROJECTS_DATABASE_ID')
  if (!isNotionConfigured() || !databaseId) return []

  return withCache('humanitarian:projects', async () => {
    try {
      const response = await queryDatabase(databaseId, {
        filter: { property: 'Status', select: { equals: 'Active' } },
        sorts: [{ property: 'Sort Order', direction: 'ascending' }],
      })

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(pageToHumanitarianProject)
    } catch (error) {
      console.error('Error fetching humanitarian projects:', error)
      return []
    }
  })
}

async function fetchHumanitarianProjectBySlug(
  slug: string,
): Promise<HumanitarianProject | null> {
  const databaseId = getDbId('NOTION_HUMANITARIAN_PROJECTS_DATABASE_ID')
  if (!isNotionConfigured() || !databaseId) return null

  try {
    const response = await queryDatabase(databaseId, {
      filter: {
        and: [
          { property: 'Slug', rich_text: { equals: slug } },
          { property: 'Status', select: { equals: 'Active' } },
        ],
      },
      page_size: 1,
    })

    const page = response.results[0]
    if (!page || !('properties' in page)) return null
    return pageToHumanitarianProject(page)
  } catch (error) {
    console.error('Error fetching humanitarian project:', error)
    return null
  }
}

async function fetchHumanitarianCasesByProject(
  projectTitle: string,
): Promise<Array<HumanitarianCase>> {
  const databaseId = getDbId('NOTION_HUMANITARIAN_CASES_DATABASE_ID')
  if (!isNotionConfigured() || !databaseId) return []

  return withCache(`humanitarian:cases:${projectTitle}`, async () => {
    try {
      const response = await queryDatabase(databaseId, {
        filter: {
          and: [
            { property: 'Project Slug', rich_text: { equals: projectTitle } },
            { property: 'Status', select: { equals: 'Published' } },
          ],
        },
        sorts: [{ property: 'Case Number', direction: 'ascending' }],
      })

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(pageToHumanitarianCase)
    } catch (error) {
      console.error('Error fetching humanitarian cases:', error)
      return []
    }
  })
}

export const getHumanitarianProjects = createServerFn({
  method: 'GET',
}).handler(async () => {
  return fetchActiveHumanitarianProjects()
})

export const getHumanitarianProjectBySlug = createServerFn({
  method: 'GET',
})
  .inputValidator(z.string().min(1).max(500))
  .handler(async ({ data: slug }) => {
    return fetchHumanitarianProjectBySlug(slug)
  })

export const getHumanitarianCasesByProject = createServerFn({
  method: 'GET',
})
  .inputValidator(z.string().min(1))
  .handler(async ({ data: projectId }) => {
    return fetchHumanitarianCasesByProject(projectId)
  })
