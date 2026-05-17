import { useState } from 'react'
import type { AvailableNote } from '@/types/perfume'
import { Container } from '@/components/layout/Container'
import { ArabicText } from '@/components/shared/ArabicText'
import { FadeIn } from '@/components/shared/FadeIn'
import { NotesSelector } from '@/components/shop/NotesSelector'

interface CreateYourOwnSectionProps {
  onOrder: (notes: Array<AvailableNote>) => void
}

const STEPS = ['Pick 2–4 notes', 'We blend', 'You enjoy your signature scent']

export function CreateYourOwnSection({ onOrder }: CreateYourOwnSectionProps) {
  const [, setSelectedNotes] = useState<Array<AvailableNote>>([])

  function handleConfirm(notes: Array<AvailableNote>) {
    setSelectedNotes(notes)
    onOrder(notes)
  }

  return (
    <section id="create-your-own" className="py-16 bg-muted/30">
      <Container>
        <FadeIn className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Create Your Own Perfume
            </h2>
            <ArabicText as="p" className="text-xl text-muted-foreground mt-1">
              صمّم عطرك بنفسك
            </ArabicText>
            <p className="mt-3 text-muted-foreground text-sm max-w-xl mx-auto">
              Choose your favourite notes and we will craft a unique blend like
              nothing you've ever experienced before.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{step}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <span className="hidden sm:block text-muted-foreground text-lg">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <NotesSelector onConfirm={handleConfirm} />
        </FadeIn>
      </Container>
    </section>
  )
}
