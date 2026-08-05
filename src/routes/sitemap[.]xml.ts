import { createFileRoute } from '@tanstack/react-router'

// Static top-level routes only. Notion-backed dynamic detail routes
// (writings/$slug, sermons/$slug, humanitarian/$slug, humanitarian/$slug/$caseSlug)
// are intentionally excluded — out of scope for this basic sitemap.
const STATIC_ROUTES: Array<{
  path: string
  changefreq: string
  priority: string
}> = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/services', changefreq: 'monthly', priority: '0.8' },
  { path: '/writings', changefreq: 'weekly', priority: '0.8' },
  { path: '/sermons', changefreq: 'weekly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
  { path: '/gallery', changefreq: 'monthly', priority: '0.5' },
  { path: '/media', changefreq: 'weekly', priority: '0.6' },
  { path: '/shop', changefreq: 'weekly', priority: '0.6' },
  { path: '/humanitarian', changefreq: 'weekly', priority: '0.7' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
]

function getBaseUrl(request: Request): string {
  return process.env.SITE_URL || new URL(request.url).origin
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const baseUrl = getBaseUrl(request)

        const urls = STATIC_ROUTES.map(
          ({ path, changefreq, priority }) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
        ).join('')

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control':
              'public, max-age=14400, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})
