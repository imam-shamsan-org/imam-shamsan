import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/shared/FadeIn'
import { getBreadcrumbSchema, getTermsMeta, siteConfig } from '@/lib/seo'
import { PERSON_NAME_FULL } from '@/lib/constants'

export const Route = createFileRoute('/terms')({
  head: () => {
    const { meta, links } = getTermsMeta()
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Terms & Conditions', url: `${siteConfig.url}/terms` },
          ]),
        },
      ],
    }
  },
  component: TermsPage,
})

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  )
}

function TermsPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-accent/50 to-background py-8 md:py-12">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                <span className="text-primary">Terms & Conditions</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Please read this page before using the Shop or Humanitarian Aid
                sections of this website.
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

      <section className="py-8 md:py-12">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl">
              <Section title="Overview">
                <p>
                  This website is the official site of {PERSON_NAME_FULL}, used
                  to share writings, sermons, services, and community
                  initiatives. By using this website, you agree to the terms
                  described below.
                </p>
              </Section>

              <Section title="Shop Orders">
                <p>
                  The Shop page lets you browse items offered directly by the
                  imam. It is not an online store — there is no checkout, and no
                  payment is processed, transmitted, or stored by this website.
                </p>
                <p>
                  If you place an order, payment is made independently by you,
                  directly to the imam&apos;s personal Zelle account, outside of
                  this website. The order form only collects your contact
                  details, order details, and a copy of your Zelle payment
                  receipt, and sends them by email directly to the imam.
                </p>
                <p>
                  Submitting the form is not an automated purchase or a
                  confirmed sale. Every order is reviewed and confirmed
                  personally by the imam, and availability, pricing,
                  fulfillment, and delivery are arranged directly between you
                  and the imam by email or phone. Because this is a manual,
                  trust-based process intended for people who already know the
                  imam, this website does not guarantee stock, delivery
                  timelines, or refunds — any such matters should be raised
                  directly with the imam.
                </p>
              </Section>

              <Section title="Humanitarian Aid Contributions">
                <p>
                  The Humanitarian Aid page describes ongoing initiatives and
                  lets you reach out to contribute. As with the Shop, any
                  contribution is sent directly by you via Zelle to the
                  imam&apos;s personal account — this website does not process,
                  hold, or handle funds at any point.
                </p>
                <p>
                  The contribution form only collects your details and payment
                  receipt so the imam can be notified by email. It does not
                  constitute a receipt, tax document, or official confirmation
                  of contribution.
                </p>
              </Section>

              <Section title="Third-Party Services">
                <p>
                  Zelle is operated by a third party and is not affiliated with
                  this website. This website has no control over, and is not
                  responsible for, delays, errors, or issues with Zelle
                  transfers.
                </p>
              </Section>

              <Section title="Content & Intellectual Property">
                <p>
                  The text, images, and media on this website belong to{' '}
                  {PERSON_NAME_FULL} and MCCGP unless otherwise noted, and may
                  not be reproduced without permission.
                </p>
              </Section>

              <Section title="Changes to These Terms">
                <p>
                  These terms may be updated from time to time as the website
                  changes. Continued use of the website after an update means
                  you accept the revised terms.
                </p>
              </Section>

              <Section title="Contact">
                <p>
                  Questions about these terms can be sent to{' '}
                  <a
                    href="mailto:MCCGPImamShamsan@gmail.com"
                    className="text-primary hover:text-primary/80 underline underline-offset-2"
                  >
                    MCCGPImamShamsan@gmail.com
                  </a>
                  .
                </p>
              </Section>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  )
}
