import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Phone, Mail } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { CaseCard } from '@/components/humanitarian/CaseCard'
import { ContributeDialog } from '@/components/humanitarian/ContributeDialog'
import { FadeIn } from '@/components/shared/FadeIn'
import { getProjectIcon } from '@/lib/humanitarian-icons'
import { getHumanitarianProjectBySlug, getHumanitarianCasesByProject } from '@/lib/notion'

export const Route = createFileRoute('/humanitarian/$slug/')({
  loader: async ({ params }) => {
    const project = await getHumanitarianProjectBySlug({ data: params.slug })
    if (!project) throw notFound()

    const cases = project.hasCases
      ? await getHumanitarianCasesByProject({ data: params.slug })
      : []

    return { project, cases }
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
        <p className="text-xl font-semibold text-foreground">Initiative Not Found</p>
        <Link to="/humanitarian" className="mt-4 inline-block text-primary hover:underline text-sm">
          ← Back to Humanitarian Aid
        </Link>
      </div>
    </Container>
  ),
})

function ProjectDetailPage() {
  const { project, cases } = Route.useLoaderData()
  const Icon = getProjectIcon(project.icon, project.category)

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
                <Badge variant="outline" className="text-xs">{project.category}</Badge>
                <Badge variant="secondary" className="text-xs">Zakat Eligible</Badge>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {project.title}
              </h1>
              {project.titleAr && (
                <p dir="rtl" lang="ar" className="font-arabic text-muted-foreground mt-1">
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
                This initiative accepts general contributions. Contact Imam Shamsan to participate.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:6613800334"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Phone className="size-4" />
                  661-380-0334
                </a>
                <a
                  href="mailto:MCCGPImamShamsan@gmail.com"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Mail className="size-4" />
                  Email Imam
                </a>
              </div>
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
                    Click a case to read the full story and contribute.
                  </p>
                </div>
                <ContributeDialog
                  trigger={
                    <Button variant="outline" size="sm">
                      Contribute to Any Case
                    </Button>
                  }
                  projectTitle={project.title}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cases.map((c, i) => (
                  <FadeIn key={c.id} delay={i * 80}>
                    <CaseCard
                      case_={c}
                      projectSlug={project.slug}
                      projectTitle={project.title}
                    />
                  </FadeIn>
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
            <div className="flex gap-3 shrink-0">
              <a
                href="tel:6613800334"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Phone className="size-4" />
                Call Imam
              </a>
              <a
                href="mailto:MCCGPImamShamsan@gmail.com"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Mail className="size-4" />
                Email
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
