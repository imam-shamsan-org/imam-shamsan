import { cn } from '@/lib/utils'
import { ARTICLE_LANGUAGES } from '@/lib/constants'

interface LanguageFilterProps {
  selected: string
  onSelect: (value: string) => void
  categories?: Array<string>
  selectedCategory?: string
  onCategorySelect?: (value: string) => void
}

export function LanguageFilter({
  selected,
  onSelect,
  categories,
  selectedCategory,
  onCategorySelect,
}: LanguageFilterProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="group"
        aria-label="Filter by language"
        className="flex flex-wrap gap-2"
      >
        <span className="text-sm font-medium text-muted-foreground self-center mr-1">
          Language:
        </span>
        {ARTICLE_LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => onSelect(lang)}
            aria-pressed={selected === lang}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              selected === lang
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {lang}
          </button>
        ))}
      </div>

      {categories && categories.length > 0 && onCategorySelect && (
        <div
          role="group"
          aria-label="Filter by category"
          className="flex flex-wrap gap-2"
        >
          <span className="text-sm font-medium text-muted-foreground self-center mr-1">
            Category:
          </span>
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect(cat)}
              aria-pressed={selectedCategory === cat}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                selectedCategory === cat
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
