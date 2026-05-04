import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import type { HumanitarianCase } from '@/types/humanitarian'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { CaseCard } from '@/components/humanitarian/CaseCard'
import { CaseDetailModal } from '@/components/humanitarian/CaseDetailModal'
import { ContributeDialog } from '@/components/humanitarian/ContributeDialog'
import { getProjectIcon } from '@/lib/humanitarian-icons'
import {
  getHumanitarianCasesByProject,
  getHumanitarianProjectBySlug,
  getSiteSettings,
} from '@/lib/notion'
import { PERSON_NAME } from '@/lib/constants'

export const Route = createFileRoute('/humanitarian/$slug/')({
  loader: async ({ params }) => {
    const [project, settings] = await Promise.all([
      getHumanitarianProjectBySlug({ data: params.slug }),
      getSiteSettings(),
    ])
    if (!project) throw notFound()

    const cases = await getHumanitarianCasesByProject({ data: project.id })

    return { project, cases, settings }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.project
          ? `${loaderData.project.title} — Humanitarian Aid`
          : 'Humanitarian Initiative',
      },
      { name: 'description', content: loaderData?.project?.description || '' },
    ],
  }),
  component: ProjectDetailPage,
  notFoundComponent: () => (
    <Container size="narrow">
      <div className="py-24 text-center">
        <p className="text-xl font-semibold text-foreground">
          Initiative Not Found
        </p>
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

function ProjectDetailPage() {
  const { project, cases, settings: _settings } = Route.useLoaderData()
  const personName = PERSON_NAME
  const Icon = getProjectIcon(project.icon, project.category)
  const [selectedCase, setSelectedCase] = useState<HumanitarianCase | null>(
    null,
  )

  return (
    <>
      <section className="bg-gradient-to-b from-primary/15 via-accent/30 to-background py-10 md:py-14">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Humanitarian Aid', to: '/humanitarian' },
              { label: project.title },
            ]}
          />

          <div className="mt-6 flex items-start gap-4">
            <div className="shrink-0 rounded-lg bg-primary/10 p-3">
              <Icon className="size-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {project.category}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Zakat Eligible
                </Badge>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {project.title}
              </h1>
              {project.titleAr && (
                <p
                  dir="rtl"
                  lang="ar"
                  className="font-arabic text-muted-foreground mt-1"
                >
                  {project.titleAr}
                </p>
              )}
              {project.description && (
                <p className="mt-2 text-muted-foreground leading-relaxed max-w-2xl">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 opacity-40">
            <div className="h-px w-16 bg-secondary" />
            <div className="size-1.5 rounded-full bg-secondary" />
            <div className="h-px w-16 bg-secondary" />
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          {cases.length === 0 ? (
            <div className="mx-auto max-w-lg text-center py-12">
              <p className="text-muted-foreground mb-6">
                Support this initiative directly — your contribution goes
                entirely to this cause.
              </p>
              <ContributeDialog
                trigger={<Button size="lg">Sponsor This Project</Button>}
                projectTitle={project.title}
                personName={personName}
              />
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-0.5">
                    <div className="h-5 w-[3px] rounded-full bg-secondary opacity-70" />
                    <h2 className="text-lg font-semibold text-foreground">
                      {cases.length} Active Case{cases.length !== 1 ? 's' : ''}
                    </h2>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground pl-[18px]">
                    Click a case to view the poster and contribute.
                  </p>
                </div>
                <ContributeDialog
                  trigger={
                    <Button variant="outline" size="sm">
                      Sponsor This Project
                    </Button>
                  }
                  projectTitle={project.title}
                  personName={personName}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cases.map((c) => (
                  <CaseCard
                    key={c.id}
                    case_={c}
                    projectSlug={project.slug}
                    projectTitle={project.title}
                    onClick={() => setSelectedCase(c)}
                  />
                ))}
              </div>
            </>
          )}
        </Container>
      </section>

      <section className="bg-muted/40 border-t border-secondary/20 py-8">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              100% of contributions go directly to beneficiaries.
            </p>
            <Button asChild size="sm">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </Container>
      </section>

      <CaseDetailModal
        case_={selectedCase}
        projectTitle={project.title}
        open={selectedCase !== null}
        onClose={() => setSelectedCase(null)}
        personName={personName}
      />
    </>
  )
}
