import { Wand2 } from 'lucide-react'
import { ArabicText } from '@/components/shared/ArabicText'
import { ShimmerButton } from '@/components/ui/shimmer-button'

interface CreateYourOwnCardProps {
  onClick: () => void
}

export function CreateYourOwnCard({ onClick }: CreateYourOwnCardProps) {
  return (
    <div
      className="group flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center transition-colors hover:border-primary/60 hover:bg-primary/10 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform group-hover:scale-105">
        <Wand2 className="size-6" />
      </div>
      <div>
        <h3 className="font-semibold text-base">Create Your Own</h3>
        <ArabicText as="p" className="text-sm text-muted-foreground mt-0.5">
          صمّم عطرك بنفسك
        </ArabicText>
      </div>
      <p className="text-sm text-muted-foreground max-w-[220px]">
        Pick your favourite notes and we'll blend a signature scent just for
        you.
      </p>
      <ShimmerButton
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        className="mt-1"
      >
        Start Designing
      </ShimmerButton>
    </div>
  )
}
