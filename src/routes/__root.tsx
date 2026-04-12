import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useRouter,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'
import type { SiteSettings } from '@/types/settings'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { ThemeProvider } from '@/lib/theme'
import { getSiteSettings } from '@/lib/notion'
import { getOptimizedUrl } from '@/lib/cloudinary'
import { getBaseMeta } from '@/lib/seo'
import { PERSON_NAME, PERSON_NAME_FULL } from '@/lib/constants'

export const Route = createRootRoute({
  loader: async () => {
    const settings = await getSiteSettings()
    return { settings }
  },
  head: ({ loaderData }) => {
    const logoUrl = loaderData?.settings?.logo?.value
    const description = `Official website of ${PERSON_NAME_FULL} - Islamic scholar, educator, and community leader. Explore writings, sermons, services, and more.`
    return {
      meta: [
        ...getBaseMeta(),
        {
          title: PERSON_NAME_FULL,
        },
        {
          name: 'description',
          content: description,
        },
      ],
      links: [
        {
          rel: 'stylesheet',
          href: appCss,
        },
        ...(logoUrl
          ? [
              {
                rel: 'icon',
                type: 'image/png',
                sizes: '48x48',
                href: getOptimizedUrl(logoUrl, 'favicon'),
              },
              {
                rel: 'apple-touch-icon',
                sizes: '180x180',
                href: getOptimizedUrl(logoUrl, 'apple-touch-icon'),
              },
            ]
          : []),
      ],
      scripts: [
        {
          children: `
            (function() {
              const theme = localStorage.getItem('theme');
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            })();
          `,
        },
      ],
    }
  },

  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootError,
})

function RootComponent() {
  const { settings } = Route.useLoaderData()
  const logoUrl = settings.logo?.value
  const personName = PERSON_NAME

  return (
    <RootDocument logoUrl={logoUrl} personName={personName} settings={settings}>
      <Outlet />
    </RootDocument>
  )
}

function NotFound() {
  return (
    <Container size="narrow">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="mt-4 text-xl text-foreground">Page Not Found</p>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </Container>
  )
}

function RootError({ error }: { error: unknown }) {
  const router = useRouter()
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred'

  return (
    <Container size="narrow">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-4 text-muted-foreground">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.invalidate()}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </Container>
  )
}

function RootDocument({
  children,
  logoUrl,
  personName,
  settings,
}: {
  children: React.ReactNode
  logoUrl?: string
  personName?: string
  settings?: SiteSettings
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <Header logoUrl={logoUrl} personName={personName} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
