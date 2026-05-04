import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { ContributeDialog } from '@/components/humanitarian/ContributeDialog'
import { getPosterFullUrl, isPdfUrl } from '@/lib/cloudinary'
import {
  getHumanitarianCasesByProject,
  getHumanitarianProjectBySlug,
  getSiteSettings,
} from '@/lib/notion'
import { PERSON_NAME } from '@/lib/constants'

export const Route = createFileRoute('/humanitarian/$slug/$caseSlug')({
  loader: async ({ params }) => {
    const [project, settings] = await Promise.all([
      getHumanitarianProjectBySlug({ data: params.slug }),
      getSiteSettings(),
    ])
    if (!project) throw notFound()

    const cases = await getHumanitarianCasesByProject({ data: project.id })
    const case_ = cases.find((c) => c.slug === params.caseSlug)
    if (!case_) throw notFound()

    return { project, case_, settings }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.case_
          ? `${loaderData.case_.title} — Humanitarian Aid`
          : 'Case',
      },
      {
        name: 'description',
        content: loaderData?.case_?.title || '',
      },
    ],
  }),
  component: CaseDetailPage,
  notFoundComponent: () => (
    <Container size="narrow">
      <div className="py-24 text-center">
        <p className="text-xl font-semibold text-foreground">Case Not Found</p>
        <Link
          to="/humanitarian"
          className="mt-4 inline-block text-primary hover:underline text-sm"
        >
          ← Back to Humanitarian Aid
        </Link>
      </div>
    </Container>
  ),
})

function CaseDetailPage() {
  const { project, case_: c, settings: _settings } = Route.useLoaderData()
  const personName = PERSON_NAME
  const hasPoster = Boolean(c.posterUrl)
  const pdf = hasPoster && isPdfUrl(c.posterUrl!)

  return (
    <>
      {/* Breadcrumbs */}
      <section className="bg-gradient-to-b from-primary/15 via-accent/30 to-background py-6">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Humanitarian Aid', to: '/humanitarian' },
              { label: project.title, to: `/humanitarian/${project.slug}` },
              { label: c.title },
            ]}
          />
        </Container>
      </section>

      {/* Poster — full-width if present, placeholder otherwise */}
      <section className="bg-muted/30">
        <Container>
          <div className="py-6">
            {hasPoster ? (
              pdf ? (
                <iframe
                  src={c.posterUrl!}
                  title={c.title}
                  className="w-full h-screen rounded-lg border border-border"
                />
              ) : (
                <img
                  src={getPosterFullUrl(c.posterUrl!)}
                  alt={c.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                  loading="lazy"
                />
              )
            ) : (
              <div className="flex items-center justify-center h-64 rounded-lg bg-muted border border-border">
                <svg
                  className="size-16 text-muted-foreground/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Contribute CTA */}
      <section className="py-8">
        <Container size="narrow">
          <div className="flex justify-center">
            <ContributeDialog
              trigger={
                <Button size="lg" className="gap-2 px-8">
                  <Heart className="size-4" />
                  Sponsor This Case
                </Button>
              }
              projectTitle={project.title}
              caseTitle={c.title}
              personName={personName}
            />
          </div>
        </Container>
      </section>
    </>
  )
}
