import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Phone, Mail, AlertCircle, CheckCircle2, Users, DollarSign } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { NumberTicker } from '@/components/ui/number-ticker'
import { ShimmerButton } from '@/components/ui/shimmer-button'
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
      {/* Hero image */}
      {c.patientPhoto && (
        <div className="relative h-72 w-full overflow-hidden md:h-96">
          <CloudinaryImage
            src={c.patientPhoto}
            alt={c.title}
            preset="hero"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
      )}

      <section className={c.patientPhoto ? 'pt-6 pb-4' : 'pt-12 pb-4 bg-gradient-to-b from-primary/15 via-accent/30 to-background'}>
        <Container size="narrow">
          <Breadcrumbs
            items={[
              { label: 'Humanitarian Aid', to: '/humanitarian' },
              { label: project.title, to: `/humanitarian/${project.slug}` },
              { label: c.title },
            ]}
          />

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Badge className={`text-xs border-0 ${urgency.className}`}>
              <UrgencyIcon className="size-3 mr-1" />
              {urgency.label}
            </Badge>
            <Badge variant="muted" className="text-xs">Case #{c.caseNumber}</Badge>
            <Badge variant="secondary" className="text-xs">Zakat Eligible</Badge>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {c.title}
          </h1>
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

            {/* Amount stats */}
            {(c.targetAmount !== null || c.monthlyAmount !== null || c.familySize !== null) && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {c.targetAmount !== null && (
                  <div className="rounded-lg bg-card ring-1 ring-foreground/10 p-4 text-center">
                    <DollarSign className="size-5 text-secondary mx-auto mb-1" />
                    <p className="text-xl font-bold text-foreground">
                      $<NumberTicker value={c.targetAmount} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Target Amount</p>
                  </div>
                )}
                {c.monthlyAmount !== null && (
                  <div className="rounded-lg bg-card ring-1 ring-foreground/10 p-4 text-center">
                    <DollarSign className="size-5 text-secondary mx-auto mb-1" />
                    <p className="text-xl font-bold text-foreground">
                      $<NumberTicker value={c.monthlyAmount} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Monthly Need</p>
                  </div>
                )}
                {c.familySize !== null && (
                  <div className="rounded-lg bg-card ring-1 ring-foreground/10 p-4 text-center">
                    <Users className="size-5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xl font-bold text-foreground">
                      <NumberTicker value={c.familySize} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Family Members</p>
                  </div>
                )}
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
                    <ShimmerButton className="gap-2 px-6 py-2.5" borderRadius="8px">
                      Sponsor This Case
                    </ShimmerButton>
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
