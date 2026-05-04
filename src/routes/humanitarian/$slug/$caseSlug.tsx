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
      {/* Compact header: breadcrumbs + sponsor button on one row */}
      <section className="bg-gradient-to-b from-primary/15 via-accent/30 to-background py-3 border-b border-border/40">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <Breadcrumbs
              items={[
                { label: 'Humanitarian Aid', to: '/humanitarian' },
                { label: project.title, to: `/humanitarian/${project.slug}` },
                { label: c.title },
              ]}
            />
            <ContributeDialog
              trigger={
                <Button size="sm" className="gap-1.5 shrink-0">
                  <Heart className="size-3.5" />
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

      {/* Poster — fills all remaining viewport height */}
      {hasPoster ? (
        <div className="h-[calc(100dvh-7rem)] bg-muted/20">
          {pdf ? (
            <iframe
              src={c.posterUrl!}
              title={c.title}
              className="w-full h-full"
            />
          ) : (
            <img
              src={getPosterFullUrl(c.posterUrl!)}
              alt={c.title}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 py-24">
          <p className="text-muted-foreground text-sm">
            No poster available for this case.
          </p>
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
      )}
    </>
  )
}
