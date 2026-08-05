import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/shared/FadeIn'
import { getBreadcrumbSchema, getPrivacyMeta, siteConfig } from '@/lib/seo'

export const Route = createFileRoute('/privacy')({
  head: () => {
    const { meta, links } = getPrivacyMeta()
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'Privacy Policy', url: `${siteConfig.url}/privacy` },
          ]),
        },
      ],
    }
  },
  component: PrivacyPage,
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

function PrivacyPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-accent/50 to-background py-8 md:py-12">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                <span className="text-primary">Privacy Policy</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                What information this website collects, and how it is used.
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
              <Section title="Information We Collect">
                <p>
                  This website collects information only when you choose to
                  submit it through the Contact form, a Shop order form, or a
                  Humanitarian Aid contribution form. Depending on the form,
                  this may include your name, email address, phone number, a
                  message or order details, and a file you upload (such as a
                  Zelle payment receipt, as a PDF or PNG).
                </p>
              </Section>

              <Section title="How We Use Your Information">
                <p>
                  Submitted information is used only to relay your message,
                  order, or contribution by email directly to the imam, so he
                  can respond, confirm, and follow up with you personally. It is
                  not used for marketing, and it is never sold or shared with
                  advertisers.
                </p>
              </Section>

              <Section title="How Your Information Is Handled">
                <p>
                  Form submissions are sent using Resend, a transactional email
                  service, straight to the imam&apos;s email inbox. This website
                  does not store your submission in a database — once it is
                  sent, the information exists only in that email.
                </p>
              </Section>

              <Section title="Cookies & Analytics">
                <p>
                  This website does not use cookies, analytics, or tracking
                  scripts.
                </p>
              </Section>

              <Section title="Images & Media">
                <p>
                  Photos and graphics shown on the site are hosted via
                  Cloudinary. This is unrelated to, and does not involve, any
                  personal information you submit through a form.
                </p>
              </Section>

              <Section title="Data Security">
                <p>
                  Form submissions are sent over an encrypted (HTTPS)
                  connection.
                </p>
              </Section>

              <Section title="Children's Privacy">
                <p>
                  This website is not directed at children, and we do not
                  knowingly collect information from children.
                </p>
              </Section>

              <Section title="Changes to This Policy">
                <p>
                  This policy may be updated from time to time as the website
                  changes. Continued use of the website after an update means
                  you accept the revised policy.
                </p>
              </Section>

              <Section title="Contact">
                <p>
                  Questions about this policy can be sent to{' '}
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
