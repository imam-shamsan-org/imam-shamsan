import { Check, CircleAlert, X } from 'lucide-react'
import type { AvailableNote } from '@/types/perfume'
import { AVAILABLE_NOTES, NOTE_CATEGORIES } from '@/lib/perfume-notes'
import { ArabicText } from '@/components/shared/ArabicText'
import { cn } from '@/lib/utils'

interface NotesSelectorProps {
  selected: Set<string>
  onToggle: (note: AvailableNote) => void
}

const MAX_NOTES = 4

export function NotesSelector({ selected, onToggle }: NotesSelectorProps) {
  const selectedNotes = AVAILABLE_NOTES.filter((n) => selected.has(n.id))
  const count = selected.size
  const atMax = count >= MAX_NOTES

  return (
    <div className="flex flex-col gap-5">
      {/* Counter + max-reached banner */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          Selected:{' '}
          <span className={cn('font-medium', count >= 2 && 'text-primary')}>
            {count}
          </span>{' '}
          / {MAX_NOTES}
        </span>
        {atMax && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary">
            <CircleAlert className="size-3.5" />
            Maximum reached — remove one to add another
          </span>
        )}
      </div>

      {/* Selected chips */}
      {selectedNotes.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-3">
          {selectedNotes.map((note) => (
            <button
              key={note.id}
              type="button"
              onClick={() => onToggle(note)}
              className="group inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground pl-3 pr-2 py-1 text-sm font-medium transition-colors hover:bg-primary/85"
            >
              {note.nameEn}
              <X className="size-3.5 opacity-70 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}

      {/* Notes grouped by category — headings are labels, not choices */}
      <div className="flex flex-col gap-6">
        {NOTE_CATEGORIES.map((cat) => {
          const notes = AVAILABLE_NOTES.filter((n) => n.category === cat.id)
          return (
            <div key={cat.id}>
              <div className="flex items-center gap-2.5 mb-3">
                <h4 className="shrink-0 text-xs font-semibold uppercase tracking-wider text-foreground/60">
                  {cat.nameEn}
                </h4>
                <span className="h-px flex-1 bg-border" />
                <ArabicText as="span" className="shrink-0 text-xs text-muted-foreground">
                  {cat.nameAr}
                </ArabicText>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {notes.map((note) => {
                  const isSelected = selected.has(note.id)
                  const isDisabled = !isSelected && atMax
                  return (
                    <button
                      key={note.id}
                      type="button"
                      disabled={isDisabled}
                      title={
                        isDisabled
                          ? 'Maximum of 4 notes selected — remove one first'
                          : undefined
                      }
                      onClick={() => onToggle(note)}
                      className={cn(
                        'flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left transition-colors',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground cursor-pointer'
                          : isDisabled
                            ? 'border-border bg-muted/30 opacity-50 cursor-not-allowed'
                            : 'border-border hover:border-primary/50 hover:bg-accent/40 cursor-pointer',
                      )}
                    >
                      <span className="flex w-full items-center justify-between gap-1.5">
                        <span className="text-sm font-medium leading-snug">
                          {note.nameEn}
                        </span>
                        {isSelected && (
                          <Check className="size-3.5 shrink-0" />
                        )}
                      </span>
                      <ArabicText
                        as="span"
                        className={cn(
                          'text-xs',
                          isSelected
                            ? 'text-primary-foreground/80'
                            : 'text-muted-foreground',
                        )}
                      >
                        {note.nameAr}
                      </ArabicText>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
