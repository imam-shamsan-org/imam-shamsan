import { createFileRoute } from '@tanstack/react-router'
import { Facebook, Instagram, Mail, Youtube } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ContactForm } from '@/components/contact/ContactForm'
import { FadeIn } from '@/components/shared/FadeIn'
import { getActiveServices, getSiteSettings } from '@/lib/notion'
import {
  getBreadcrumbSchema,
  getContactMeta,
  getPersonName,
  siteConfig,
} from '@/lib/seo'

interface ContactSearch {
  service?: string
}

export const Route = createFileRoute('/contact')({
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    service: (search.service as string) || undefined,
  }),
  loader: async () => {
    const [services, settings] = await Promise.all([
      getActiveServices(),
      getSiteSettings(),
    ])
    return { services, settings }
  },
  head: ({ loaderData }) => {
    const { meta, links } = getContactMeta(loaderData?.settings)
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Contact', url: `${siteConfig.url}/contact` },
          ]),
        },
      ],
    }
  },
  component: ContactPage,
})

function ContactPage() {
  const { services, settings } = Route.useLoaderData()
  const { service } = Route.useSearch()
  const personName = getPersonName(settings, { short: true })

  const youtubeUrl =
    settings.youtube_url?.value ||
    'https://www.youtube.com/channel/UCHsyLCyXVM8L25qwS7h9Gjg'
  const facebookUrl =
    settings.facebook_url?.value ||
    'https://www.facebook.com/shamsan.aljabi.2025'
  const instagramUrl =
    settings.instagram_url?.value || 'https://www.instagram.com/dr.sham_san/'

  return (
    <>
      <section className="bg-gradient-to-b from-accent/50 to-background py-8 md:py-12">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                <span className="text-primary">Contact</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Reach out to {personName} for bookings, inquiries, or community
                services
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
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <ContactForm
                services={services}
                preselectedService={service}
                personName={personName}
              />
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Get in Touch
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="size-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Email
                      </p>
                      <a
                        href="mailto:MCCGPImamShamsan@gmail.com"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        MCCGPImamShamsan@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Follow & Connect
                </h3>
                <div className="flex gap-4">
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Youtube className="size-5 text-red-500" />
                    YouTube
                  </a>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Facebook className="size-5 text-blue-600" />
                    Facebook
                  </a>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Instagram className="size-5 text-pink-500" />
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
