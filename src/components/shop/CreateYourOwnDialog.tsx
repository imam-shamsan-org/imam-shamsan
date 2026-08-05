import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import type { AvailableNote } from '@/types/perfume'
import { AVAILABLE_NOTES } from '@/lib/perfume-notes'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArabicText } from '@/components/shared/ArabicText'
import { NotesSelector } from '@/components/shop/NotesSelector'
import { cn } from '@/lib/utils'

interface CreateYourOwnDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (notes: Array<AvailableNote>) => void
}

type WizardStep = 'notes' | 'review'

const WIZARD_STEPS: Array<{ id: WizardStep; label: string }> = [
  { id: 'notes', label: 'Pick Notes' },
  { id: 'review', label: 'Review' },
]

export function CreateYourOwnDialog({
  open,
  onClose,
  onConfirm,
}: CreateYourOwnDialogProps) {
  const [step, setStep] = useState<WizardStep>('notes')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!open) {
      setStep('notes')
      setSelected(new Set())
    }
  }, [open])

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
  const canContinue = count >= 2 && count <= 4

  return (
    <Dialog open={open} onClose={onClose} className="max-w-2xl">
      <DialogHeader className="pb-0">
        <DialogTitle className="pr-6">
          Create Your Own Perfume{' '}
          <ArabicText as="span" className="text-lg font-semibold">
            صمّم عطرك بنفسك
          </ArabicText>
        </DialogTitle>

        {/* Step indicator */}
        <div className="mt-4 flex items-center gap-3">
          {WIZARD_STEPS.map((s, i) => {
            const currentIndex = WIZARD_STEPS.findIndex((x) => x.id === step)
            const isDone = i < currentIndex
            const isActive = s.id === step
            return (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      isDone || isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {isDone ? <Check className="size-3.5" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isActive ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < WIZARD_STEPS.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </div>
            )
          })}
        </div>
      </DialogHeader>

      <DialogContent className="pt-5">
        {step === 'notes' ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              Choose 2–4 notes and we will craft a unique blend like nothing
              you've ever experienced before.
            </p>
            <NotesSelector selected={selected} onToggle={toggle} />
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Here's your signature blend. Confirm to move on to payment.
            </p>
            <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-muted/30 p-4">
              {selectedNotes.map((note) => (
                <span
                  key={note.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 text-sm font-medium text-secondary"
                >
                  {note.nameEn}
                  <ArabicText as="span" className="text-xs">
                    {note.nameAr}
                  </ArabicText>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep('notes')}
              className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
              Not quite right? Edit your notes
            </button>
          </div>
        )}
      </DialogContent>

      <DialogFooter>
        {step === 'notes' ? (
          <>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!canContinue}
              onClick={() => setStep('review')}
            >
              Next: Review
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('notes')}
            >
              Back
            </Button>
            <Button type="button" onClick={() => onConfirm(selectedNotes)}>
              Continue to Payment
            </Button>
          </>
        )}
      </DialogFooter>
    </Dialog>
  )
}
