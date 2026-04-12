import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/Container'
import { ServiceGrid } from '@/components/services/ServiceGrid'
import { FadeIn } from '@/components/shared/FadeIn'
import { getActiveServices, getSiteSettings } from '@/lib/notion'
import {
  getBreadcrumbSchema,
  getPersonName,
  getServicesMeta,
  siteConfig,
} from '@/lib/seo'

export const Route = createFileRoute('/services')({
  loader: async () => {
    const [services, settings] = await Promise.all([
      getActiveServices(),
      getSiteSettings(),
    ])
    return { services, settings }
  },
  head: ({ loaderData }) => {
    const { meta, links } = getServicesMeta(loaderData?.settings)
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Services', url: `${siteConfig.url}/services` },
          ]),
        },
      ],
    }
  },
  component: ServicesPage,
})

function ServicesPage() {
  const { services, settings } = Route.useLoaderData()
  const personName = getPersonName(settings, { short: true })

  return (
    <>
      <section className="bg-gradient-to-b from-accent/50 to-background py-8 md:py-12">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                <span className="text-primary">Services</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {personName} offers a range of Islamic services for the
                community. Click on any service to book or inquire.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3 opacity-40">
                <div className="h-px w-16 bg-secondary" />
                <div className="size-1.5 rounded-full bg-secondary" />
                <div className="h-px w-16 bg-secondary" />
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <ServiceGrid services={services} personName={personName} />
        </Container>
      </section>
    </>
  )
}
