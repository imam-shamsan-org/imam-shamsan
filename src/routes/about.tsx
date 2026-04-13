import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/Container'
import { ArabicText } from '@/components/shared/ArabicText'
import { FadeIn } from '@/components/shared/FadeIn'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import { ArticleContent } from '@/components/articles/ArticleContent'
import { getAboutPage, getSiteSettings } from '@/lib/notion'
import {
  getAboutMeta,
  getBreadcrumbSchema,
  getPersonSchema,
  siteConfig,
} from '@/lib/seo'
import { PERSON_NAME, PERSON_NAME_AR } from '@/lib/constants'
import { extractCards, isCompactCards, splitIntoSections } from '@/lib/content'

export const Route = createFileRoute('/about')({
  loader: async () => {
    const [settings, aboutPage] = await Promise.all([
      getSiteSettings(),
      getAboutPage(),
    ])
    return { settings, aboutPage }
  },
  head: ({ loaderData }) => {
    const { meta, links } = getAboutMeta(loaderData?.settings)
    return {
      meta,
      links,
      scripts: [
        {
          type: 'application/ld+json',
          children: getPersonSchema(loaderData?.settings),
        },
        {
          type: 'application/ld+json',
          children: getBreadcrumbSchema([
            { name: 'Home', url: siteConfig.url },
            { name: 'About', url: `${siteConfig.url}/about` },
          ]),
        },
      ],
    }
  },
  component: AboutPage,
})

function AboutPage() {
  const { settings, aboutPage } = Route.useLoaderData()
  const profileImage = settings.profile_img?.value
  const personName = PERSON_NAME

  const title = aboutPage?.title || `About ${personName}`
  const subtitleAr = aboutPage?.subtitleAr || PERSON_NAME_AR

  if (!aboutPage || aboutPage.content.length === 0) {
    return (
      <>
        <AboutHero
          title={title}
          subtitleAr={subtitleAr}
          personName={personName}
        />
        <section className="py-8">
          <Container size="narrow">
            {profileImage && (
              <ProfileImage src={profileImage} personName={personName} />
            )}
            <AboutFallback personName={personName} />
          </Container>
        </section>
      </>
    )
  }

  const { intro, sections } = splitIntoSections(aboutPage.content)

  // First prose section (Biography) gets the profile image float
  const firstProseIdx = sections.findIndex((s) => !extractCards(s.blocks))
  const firstProseSection = firstProseIdx >= 0 ? sections[firstProseIdx] : null
  const remainingSections = sections.filter((_, i) => i !== firstProseIdx)

  return (
    <>
      <AboutHero
        title={title}
        subtitleAr={subtitleAr}
        personName={personName}
      />

      <section className="py-8">
        <Container size="narrow">
          <div className="space-y-8 text-foreground [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_li]:text-muted-foreground">
            {/* Intro text (before any h2) */}
            {intro.length > 0 && (
              <FadeIn>
                <ArticleContent blocks={intro} />
              </FadeIn>
            )}

            {/* First prose section (Biography) — heading above, then image float + text */}
            {firstProseSection && (
              <FadeIn delay={80}>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {firstProseSection.heading.content}
                  </h2>
                  <div>
                    {profileImage && (
                      <ProfileImage
                        src={profileImage}
                        personName={personName}
                      />
                    )}
                    <ArticleContent blocks={firstProseSection.blocks} />
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Remaining sections */}
            {remainingSections.map((section, i) => {
              const cards = extractCards(section.blocks)
              const headingText = section.heading.content || ''
              const delay = (i + 2) * 80

              if (cards) {
                if (isCompactCards(cards)) {
                  // Short descriptions → grid cards (e.g., Specializations)
                  const gridClass =
                    cards.length === 2
                      ? 'grid gap-4 sm:grid-cols-2'
                      : 'grid gap-4 sm:grid-cols-3'

                  return (
                    <FadeIn key={section.heading.id} delay={delay}>
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-tight">
                          {headingText}
                        </h2>
                        <div className={gridClass}>
                          {cards.map((card) => (
                            <div
                              key={card.title}
                              className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
                            >
                              <h3 className="font-semibold text-primary">
                                {card.title}
                              </h3>
                              <div className="mt-2 text-sm text-muted-foreground">
                                <ArticleContent blocks={card.description} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FadeIn>
                  )
                }

                // Longer descriptions → full-width stacked blocks (e.g., What Sets Apart)
                return (
                  <FadeIn key={section.heading.id} delay={delay}>
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold tracking-tight">
                        {headingText}
                      </h2>
                      <div className="space-y-3">
                        {cards.map((card) => (
                          <div
                            key={card.title}
                            className="rounded-lg border border-border p-4"
                          >
                            <h3 className="font-semibold text-foreground">
                              {card.title}
                            </h3>
                            <div className="mt-1 text-sm text-muted-foreground">
                              <ArticleContent blocks={card.description} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                )
              }

              // Regular prose section
              return (
                <FadeIn key={section.heading.id} delay={delay}>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                      {headingText}
                    </h2>
                    <ArticleContent blocks={section.blocks} />
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </Container>
      </section>
    </>
  )
}

function AboutHero({
  title,
  subtitleAr,
  personName,
}: {
  title: string
  subtitleAr: string
  personName: string
}) {
  const isDefaultTitle = title === `About ${personName}`
  return (
    <section className="bg-gradient-to-b from-accent/50 to-background py-8 md:py-12">
      <Container size="narrow">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {isDefaultTitle ? (
                <>
                  About <span className="text-primary">{personName}</span>
                </>
              ) : (
                <span className="text-primary">{title}</span>
              )}
            </h1>
            {subtitleAr && (
              <ArabicText as="p" className="mt-2 text-xl text-secondary">
                {subtitleAr}
              </ArabicText>
            )}
            <div className="mt-6 flex items-center justify-center gap-3 opacity-40">
              <div className="h-px w-16 bg-secondary" />
              <div className="size-1.5 rounded-full bg-secondary" />
              <div className="h-px w-16 bg-secondary" />
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}

function ProfileImage({
  src,
  personName,
}: {
  src: string
  personName: string
}) {
  return (
    <div className="mb-6 flex justify-center sm:float-left sm:mr-6 sm:mb-2">
      <CloudinaryImage
        src={src}
        alt={personName}
        preset="avatar"
        className="size-48 shrink-0 rounded-xl ring-2 ring-primary/20"
      />
    </div>
  )
}

/** Hardcoded fallback content shown when the About database is not configured */
function AboutFallback({ personName }: { personName: string }) {
  const shortName = personName
  return (
    <div className="space-y-8 text-foreground">
      <FadeIn>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Biography</h2>
          <p className="leading-relaxed text-muted-foreground">
            {personName} is a distinguished Islamic scholar, educator, and
            community leader dedicated to spreading authentic Islamic knowledge
            and fostering unity within the Muslim community. With decades of
            experience in Islamic education, Quranic studies, and community
            service, he has touched the lives of thousands.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            He serves as the Imam and spiritual leader of the Muslim Community
            Center of Greater Pittsburgh (MCCGP), where he leads daily prayers,
            delivers Friday khutbahs, and provides Islamic guidance to the
            community.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Education & Ijazaat</h2>
          <p className="leading-relaxed text-muted-foreground">
            {shortName} holds advanced degrees in Islamic Studies and has
            received multiple ijazaat (scholarly certifications) from renowned
            scholars across the Muslim world. His educational journey spans
            several countries and prestigious institutions.
          </p>
          <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
            <li>Doctorate in Islamic Studies</li>
            <li>Multiple Ijazaat in Quran recitation and memorization</li>
            <li>Specialized training in Islamic jurisprudence (Fiqh)</li>
            <li>Certification in Islamic counseling and family mediation</li>
          </ul>
        </div>
      </FadeIn>

      <FadeIn delay={160}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Specializations</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: 'Quranic Sciences',
                description:
                  "Expert in Quran recitation (Tajweed), memorization (Hifz), and Tafsir commentary with ijazaat in multiple qira'at.",
              },
              {
                title: 'Islamic Education',
                description:
                  'Passionate about making Islamic knowledge accessible to all ages through structured teaching and mentorship programs.',
              },
              {
                title: 'Community Leadership',
                description:
                  'Experienced in leading diverse Muslim communities, interfaith dialogue, and building bridges across cultures.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
              >
                <h3 className="font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={240}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">What Sets {shortName} Apart</h2>
          <div className="space-y-3">
            {[
              {
                title: 'Bilingual Scholarship',
                description: `Fluent in both Arabic and English, ${shortName} bridges the gap between classical Islamic texts and contemporary audiences, making knowledge accessible to first-generation and born-in-America Muslims alike.`,
              },
              {
                title: 'Practical Guidance',
                description:
                  'Known for his approachable style, he connects timeless Islamic wisdom to the real challenges families face today - from parenting and marriage to navigating identity in the West.',
              },
              {
                title: 'Community-Centered Service',
                description: `Beyond the pulpit, ${shortName} is deeply invested in the day-to-day lives of his community - from hospital visits and counseling sessions to youth mentoring and interfaith engagement.`,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-border p-4"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
