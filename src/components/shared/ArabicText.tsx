import { cn } from '@/lib/utils'

interface ArabicTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3'
}

export function ArabicText({
  children,
  as: Tag = 'span',
  className,
  ...props
}: ArabicTextProps) {
  return (
    <Tag
      dir="rtl"
      lang="ar"
      className={cn(
        Tag === 'h1'
          ? 'font-arabic-h1'
          : Tag === 'h2'
            ? 'font-arabic-h2'
            : Tag === 'h3'
              ? 'font-arabic-h3'
              : 'font-arabic',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
