import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/badge'
import { ProjectCard } from '@/components/humanitarian/ProjectCard'
import { StatsBar } from '@/components/humanitarian/StatsBar'
import { CharityMarquee } from '@/components/humanitarian/CharityMarquee'
import { FadeIn } from '@/components/shared/FadeIn'
import { getHumanitarianProjects } from '@/lib/notion'

export const Route = createFileRoute('/humanitarian/')({
  loader: async () => {
    const projects = await getHumanitarianProjects()
    return { projects }
  },
  head: () => ({
    meta: [
      { title: 'Humanitarian Initiatives — Imam Shamsan' },
      {
        name: 'description',
        content:
          'Humanitarian initiatives led by Imam Dr. Shamsan Aljabi — supporting displaced families, medical cases, orphans, and more. Eligible for Zakat and Sadaqah.',
      },
    ],
  }),
  component: HumanitarianPage,
})

function HumanitarianPage() {
  const { projects } = Route.useLoaderData()

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/20 via-accent/30 to-background py-14 md:py-20">
        <Container>
          <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-5 px-3 py-1 text-xs font-medium">
              Eligible for Zakat &amp; Sadaqah
            </Badge>

            {/* Arabic title */}
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic-h3 text-primary mb-2"
            >
              مبادرة إنسانية
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              <span className="text-primary">Humanitarian</span> Initiatives
            </h1>

            <p className="mt-3 text-base text-muted-foreground">
              Led by Imam Dr. Shamsan Aljabi
            </p>

            {/* Hadith quote */}
            <blockquote className="mt-6 mx-auto max-w-xl rounded-xl bg-card ring-1 ring-foreground/10 p-5 text-left">
              <p className="text-sm italic text-muted-foreground leading-relaxed">
                &ldquo;Doing good protects against an evil end, and secret charity extinguishes
                the wrath of the Lord.&rdquo;
              </p>
              <footer className="mt-2 text-xs font-medium text-secondary">
                — Prophet Muhammad ﷺ
              </footer>
            </blockquote>

            <p className="mt-5 text-sm text-muted-foreground max-w-xl mx-auto">
              For anyone who wishes to support or contribute to these initiatives —
              helping hands for those in need.
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

      {/* Animated stats */}
      <StatsBar />

      {/* Hadith marquee */}
      <CharityMarquee />

      {/* Projects grid */}
      <section className="py-14">
        <Container>
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="h-6 w-[3px] rounded-full bg-secondary opacity-70" />
              <h2 className="text-2xl font-bold text-foreground">Ongoing Initiatives</h2>
              <div className="h-6 w-[3px] rounded-full bg-secondary opacity-70" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Click any project with <span className="text-primary font-medium">"View Cases"</span> to
              see individual sponsorable cases
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p>No active initiatives at this time. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <FadeIn key={project.id} delay={i * 80}>
                  <ProjectCard project={project} />
                </FadeIn>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary/5 border-t border-secondary/20 py-12">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex items-center justify-center gap-3 opacity-40">
              <div className="h-px w-16 bg-secondary" />
              <div className="size-1.5 rounded-full bg-secondary" />
              <div className="h-px w-16 bg-secondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Want to Contribute Directly?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Contact Imam Shamsan to discuss contributions, sponsorships, or to learn more
              about any of these initiatives.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
              <a
                href="tel:6613800334"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                📞 661-380-0334
              </a>
              <a
                href="mailto:MCCGPImamShamsan@gmail.com"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                ✉️ MCCGPImamShamsan@gmail.com
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
