import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Phone, Mail, AlertCircle, CheckCircle2, Users, DollarSign, Heart } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import { ArticleContent } from '@/components/articles/ArticleContent'
import { ContributeDialog } from '@/components/humanitarian/ContributeDialog'
import { getHumanitarianProjectBySlug, getHumanitarianCasesByProject } from '@/lib/notion'
import type { HumanitarianCase } from '@/types/humanitarian'

export const Route = createFileRoute('/humanitarian/$slug/$caseSlug')({
  loader: async ({ params }) => {
    const project = await getHumanitarianProjectBySlug({ data: params.slug })
    if (!project) throw notFound()

    const cases = await getHumanitarianCasesByProject({ data: params.slug })
    const case_ = cases.find((c) => c.slug === params.caseSlug)
    if (!case_) throw notFound()

    return { project, case_ }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.case_
          ? `${loaderData.case_.title} — Humanitarian Aid`
          : 'Case',
      },
      { name: 'description', content: loaderData?.case_?.content?.[0]?.content || '' },
    ],
  }),
  component: CaseDetailPage,
  notFoundComponent: () => (
    <Container size="narrow">
      <div className="py-24 text-center">
        <p className="text-xl font-semibold text-foreground">Case Not Found</p>
        <Link to="/humanitarian" className="mt-4 inline-block text-primary hover:underline text-sm">
          ← Back to Humanitarian Aid
        </Link>
      </div>
    </Container>
  ),
})

const urgencyConfig: Record<
  HumanitarianCase['urgency'],
  { label: string; icon: React.ElementType; className: string }
> = {
  Urgent: {
    label: 'Urgent',
    icon: AlertCircle,
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  High: {
    label: 'High Priority',
    icon: AlertCircle,
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  Ongoing: {
    label: 'Ongoing Support',
    icon: CheckCircle2,
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
}

function CaseDetailPage() {
  const { project, case_: c } = Route.useLoaderData()
  const urgency = urgencyConfig[c.urgency]
  const UrgencyIcon = urgency.icon

  return (
    <>
      {/* Hero — side-by-side layout */}
      <section className="bg-gradient-to-b from-primary/15 via-accent/30 to-background py-10 md:py-14">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Humanitarian Aid', to: '/humanitarian' },
              { label: project.title, to: `/humanitarian/${project.slug}` },
              { label: c.title },
            ]}
          />

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
            {/* Photo — stacks above on mobile, right column on desktop */}
            {c.patientPhoto && (
              <div className="order-1 mx-auto shrink-0 md:order-2 md:mx-0 md:w-64">
                <div className="aspect-[3/4] w-48 overflow-hidden rounded-2xl ring-1 ring-border shadow-lg md:w-64">
                  <CloudinaryImage
                    src={c.patientPhoto}
                    alt={c.title}
                    preset="card"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Text */}
            <div className="order-2 flex-1 md:order-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`text-xs border-0 ${urgency.className}`}>
                  <UrgencyIcon className="size-3 mr-1" />
                  {urgency.label}
                </Badge>
                <Badge variant="muted" className="text-xs">Case #{c.caseNumber}</Badge>
                <Badge variant="secondary" className="text-xs">Zakat Eligible</Badge>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {c.title}
              </h1>

              {/* Key stats inline */}
              {(c.targetAmount !== null || c.monthlyAmount !== null || c.familySize !== null) && (
                <div className="mt-5 flex flex-wrap gap-4">
                  {c.targetAmount !== null && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <DollarSign className="size-4 text-secondary" />
                      <span className="font-semibold text-foreground">${c.targetAmount.toLocaleString()}</span>
                      <span className="text-muted-foreground">needed</span>
                    </div>
                  )}
                  {c.monthlyAmount !== null && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <DollarSign className="size-4 text-secondary" />
                      <span className="font-semibold text-foreground">${c.monthlyAmount.toLocaleString()}/mo</span>
                    </div>
                  )}
                  {c.familySize !== null && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Users className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{c.familySize} family members</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex items-center gap-3 opacity-40">
                <div className="h-px w-16 bg-secondary" />
                <div className="size-1.5 rounded-full bg-secondary" />
                <div className="h-px w-16 bg-secondary" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8">
        <Container size="narrow">
          <div className="space-y-10">
            {/* Story */}
            {c.content.length > 0 && (
              <div>
                <ArticleContent blocks={c.content} />
              </div>
            )}

            {/* Needs */}
            {c.needsItems.length > 0 && (
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-5">
                <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                  Specific Needs
                </h2>
                <ul className="space-y-2">
                  {c.needsItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                      <span className="mt-1.5 size-1.5 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}


            {/* Sponsor CTA */}
            <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-6 text-center space-y-4">
              <p className="font-semibold text-foreground">
                Ready to make a difference?
              </p>
              <p className="text-sm text-muted-foreground">
                Contact Imam Shamsan directly — 100% of contributions reach this family.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <ContributeDialog
                  trigger={
                    <Button className="gap-2 px-6">
                      <Heart className="size-4" />
                      Sponsor This Case
                    </Button>
                  }
                  projectTitle={project.title}
                  caseTitle={c.title}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 text-sm">
                <a
                  href="tel:6613800334"
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="size-4" />
                  661-380-0334
                </a>
                <a
                  href="mailto:MCCGPImamShamsan@gmail.com"
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="size-4" />
                  MCCGPImamShamsan@gmail.com
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
