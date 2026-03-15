import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/Container'
import { ServiceGrid } from '@/components/services/ServiceGrid'
import { FadeIn } from '@/components/shared/FadeIn'
import { getActiveServices } from '@/lib/notion'
import { getServicesMeta, getBreadcrumbSchema, siteConfig } from '@/lib/seo'

export const Route = createFileRoute('/services')({
  loader: async () => {
    const services = await getActiveServices()
    return { services }
  },
  head: () => {
    const { meta, links } = getServicesMeta()
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
  const { services } = Route.useLoaderData()

  return (
    <>
      <section className="bg-gradient-to-b from-accent/50 to-background py-12 md:py-16">
        <Container>
          <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              <span className="text-primary">Services</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Imam Shamsan offers a range of Islamic services for the community.
              Click on any service to book or inquire.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 opacity-40">
              <div className="h-px w-16 bg-secondary" />
              <div className="size-1.5 rounded-full bg-secondary" />
              <div className="h-px w-16 bg-secondary" />
            </div>
          </div>
          </FadeIn>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <ServiceGrid services={services} />
        </Container>
      </section>
    </>
  )
}
