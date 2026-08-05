import { createFileRoute } from '@tanstack/react-router'

function getBaseUrl(request: Request): string {
  return process.env.SITE_URL || new URL(request.url).origin
}

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const baseUrl = getBaseUrl(request)

        const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`

        return new Response(robots, {
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control':
              'public, max-age=14400, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})
