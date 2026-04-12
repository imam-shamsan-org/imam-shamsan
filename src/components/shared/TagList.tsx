import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TagListProps {
  tags: Array<string>
  className?: string
  variant?: 'default' | 'secondary' | 'outline' | 'muted'
}

export function TagList({ tags, className, variant = 'muted' }: TagListProps) {
  if (!tags.length) return null

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {tags.map((tag) => (
        <Badge key={tag} variant={variant}>
          {tag}
        </Badge>
      ))}
    </div>
  )
}
