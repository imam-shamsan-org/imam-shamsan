import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { HumanitarianProject } from '@/types/humanitarian'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getProjectIcon } from '@/lib/humanitarian-icons'

interface ProjectCardProps {
  project: HumanitarianProject
}

export function ProjectCard({ project }: ProjectCardProps) {
  const Icon = getProjectIcon(project.icon, project.category)

  return (
    <Card className="flex flex-col h-full transition-all duration-200 hover:shadow-md hover:ring-1 hover:ring-primary/20">
      <CardHeader className="pt-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <Icon className="size-7 text-primary shrink-0" />
          <Badge variant="outline" className="text-xs ml-auto shrink-0">
            {project.category}
          </Badge>
        </div>

        <CardTitle className="text-base font-semibold leading-snug">
          {project.title}
        </CardTitle>

        {project.titleAr && (
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-sm text-muted-foreground mt-0.5"
          >
            {project.titleAr}
          </p>
        )}

        <CardDescription className="mt-1 text-sm leading-relaxed">
          {project.description}
        </CardDescription>

        {project.descriptionAr && (
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-sm text-muted-foreground mt-1 leading-relaxed"
          >
            {project.descriptionAr}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1" />

      <CardFooter className="flex items-center gap-2 bg-transparent border-t border-border/50 pt-3 pb-4 px-4">
        <Badge variant="secondary" className="text-xs">
          Zakat Eligible
        </Badge>

        <Link
          to="/humanitarian/$slug"
          params={{ slug: project.slug }}
          className="ml-auto"
        >
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            View Project
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
