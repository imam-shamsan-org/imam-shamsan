import { useState } from 'react'
import type { AvailableNote } from '@/types/perfume'
import { AVAILABLE_NOTES, NOTE_CATEGORIES } from '@/lib/perfume-notes'
import { ArabicText } from '@/components/shared/ArabicText'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NotesSelectorProps {
  onConfirm: (notes: Array<AvailableNote>) => void
}

export function NotesSelector({ onConfirm }: NotesSelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(note: AvailableNote) {
    setSelected((prev) => {
      if (prev.has(note.id)) {
        const next = new Set(prev)
        next.delete(note.id)
        return next
      }
      if (prev.size >= 4) return prev
      return new Set(prev).add(note.id)
    })
  }

  const selectedNotes = AVAILABLE_NOTES.filter((n) => selected.has(n.id))
  const count = selected.size
  const canConfirm = count >= 2 && count <= 4

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Selected:{' '}
          <span className={cn('font-medium', count >= 2 ? 'text-primary' : '')}>
            {count}
          </span>{' '}
          / 4
        </span>
      </div>

      {NOTE_CATEGORIES.map((cat) => {
        const notes = AVAILABLE_NOTES.filter((n) => n.category === cat.id)
        return (
          <div key={cat.id}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold">{cat.nameEn}</span>
              <ArabicText as="span" className="text-sm text-muted-foreground">
                {cat.nameAr}
              </ArabicText>
            </div>
            <div className="flex flex-wrap gap-2">
              {notes.map((note) => {
                const isSelected = selected.has(note.id)
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => toggle(note)}
                    className={cn(
                      'border rounded-full px-3 py-1 text-sm cursor-pointer transition-colors',
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50',
                    )}
                  >
                    {note.nameEn}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <Button
        disabled={!canConfirm}
        onClick={() => onConfirm(selectedNotes)}
        className="self-start"
      >
        Confirm Selection | تأكيد الاختيار
      </Button>
    </div>
  )
}
