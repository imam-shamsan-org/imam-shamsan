import { Link } from '@tanstack/react-router'
import { AlertCircle, CheckCircle2, Users, DollarSign, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import type { HumanitarianCase } from '@/types/humanitarian'
import type { ContentBlock } from '@/types/article'

const urgencyConfig = {
  Urgent: {
    label: 'Urgent',
    icon: AlertCircle,
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    borderClass: 'border-l-red-400',
  },
  High: {
    label: 'High Priority',
    icon: AlertCircle,
    badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    borderClass: 'border-l-orange-400',
  },
  Ongoing: {
    label: 'Ongoing',
    icon: CheckCircle2,
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    borderClass: 'border-l-primary/50',
  },
}

function getExcerpt(content: ContentBlock[], maxLen = 120): string {
  for (const block of content) {
    const text = block.richText?.map((r) => r.text).join('') || block.content || ''
    if (block.type === 'paragraph' && text.trim()) {
      return text.length > maxLen ? text.slice(0, maxLen).trimEnd() + '…' : text
    }
  }
  return ''
}

interface CaseCardProps {
  case_: HumanitarianCase
  projectSlug: string
  projectTitle: string
}

export function CaseCard({ case_: c, projectSlug }: CaseCardProps) {
  const urgency = urgencyConfig[c.urgency]
  const UrgencyIcon = urgency.icon
  const excerpt = getExcerpt(c.content)

  return (
    <Link
      to="/humanitarian/$slug/$caseSlug"
      params={{ slug: projectSlug, caseSlug: c.slug }}
      className="group block h-full"
    >
      <Card className={`relative flex flex-col h-full border-l-4 ${urgency.borderClass} transition-all duration-200 group-hover:shadow-md group-hover:ring-1 group-hover:ring-primary/20`}>
        {/* Photo */}
        {c.patientPhoto && (
          <div className="relative h-44 w-full overflow-hidden">
            <CloudinaryImage
              src={c.patientPhoto}
              alt={c.title}
              preset="card"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}

        <CardHeader className={c.patientPhoto ? 'pt-4' : 'pt-5'}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border-0 ${urgency.badgeClass}`}>
              <UrgencyIcon className="size-3" />
              {urgency.label}
            </span>
            <Badge variant="muted" className="text-xs">Case #{c.caseNumber}</Badge>
          </div>
          <CardTitle className="text-sm font-semibold leading-snug">{c.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 space-y-3 pb-4">
          {excerpt && (
            <p className="text-xs text-muted-foreground leading-relaxed">{excerpt}</p>
          )}

          {/* Key stats */}
          <div className="flex flex-wrap gap-3 pt-1">
            {c.targetAmount !== null && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="size-3.5 text-secondary" />
                <span className="font-medium text-foreground">${c.targetAmount.toLocaleString()}</span>
                <span>needed</span>
              </div>
            )}
            {c.monthlyAmount !== null && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="size-3.5 text-secondary" />
                <span className="font-medium text-foreground">${c.monthlyAmount}/mo</span>
              </div>
            )}
            {c.familySize !== null && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="size-3.5" />
                <span>{c.familySize} members</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-medium text-primary pt-1">
            Read full story
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
